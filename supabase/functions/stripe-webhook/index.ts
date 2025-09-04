import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2024-06-20" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "",
  { auth: { persistSession: false } }
);

function iso(ts?: number | null) {
  return ts ? new Date(ts * 1000).toISOString() : null;
}

async function attachCustomerToProfile({
  customerId,
  userId,
  email,
}: {
  customerId?: string | null;
  userId?: string | null;
  email?: string | null;
}) {
  if (!customerId) return { updated: 0, route: "none" };

  // Try A) by user id (if you ever provide it)
  if (userId) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select("*");
    console.log("attach by userId", { count: data?.length ?? 0, error });
    if ((data?.length ?? 0) > 0) return { updated: data?.length ?? 0, route: "userId" };
  }

  // Try B) by email we already have
  if (email) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .eq("email", email)
      .select("*");
    console.log("attach by email (session/customer)", { count: data?.length ?? 0, error });
    if ((data?.length ?? 0) > 0) return { updated: data?.length ?? 0, route: "email" };
  }

  return { updated: 0, route: "none" };
}

async function upsertSubscriptionStatus({
  customerId,
  status,
  plan,
  currentPeriodEnd,
}: {
  customerId?: string | null;
  status: string;
  plan?: string | null;
  currentPeriodEnd?: string | null;
}) {
  if (!customerId) return;

  // First: by stripe_customer_id
  let { data, error } = await supabase
    .from("profiles")
    .update({
      subscription_status: status,
      plan: plan ?? null,
      current_period_end: currentPeriodEnd ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId)
    .select("*");

  console.log("sub update by customer_id", {
    count: data?.length ?? 0,
    error,
    customerId,
    status,
  });

  // If nothing updated, try to backfill by email
  if ((data?.length ?? 0) === 0) {
    const cust = await stripe.customers.retrieve(customerId);
    if (!("deleted" in cust)) {
      const custEmail = (cust as Stripe.Customer).email ?? undefined;
      if (custEmail) {
        const res2 = await supabase
          .from("profiles")
          .update({
            stripe_customer_id: customerId, // backfill attach
            subscription_status: status,
            plan: plan ?? null,
            current_period_end: currentPeriodEnd ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("email", custEmail)
          .select("*");
        console.log("sub update by email backfill", {
          count: res2.data?.length ?? 0,
          error: res2.error,
          custEmail,
        });
      }
    }
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });
  if (!webhookSecret) return new Response("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (err) {
    console.error("Signature verify error:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      /**
       * Map the Stripe customer to your Supabase profile ASAP after checkout completes.
       * For Payment Links, client_reference_id is usually NULL, so we:
       *   1) grab session.customer if present
       *   2) otherwise fetch session.subscription and read sub.customer
       *   3) then attach to profile by userId (if present) or by email
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Try to resolve customer id robustly
        let customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        if (!customerId && session.subscription) {
          const subId = typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;
          if (subId) {
            const sub = await stripe.subscriptions.retrieve(subId);
            customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
          }
        }

        const email =
          session.customer_details?.email ??
          (typeof session.customer_email === "string" ? session.customer_email : undefined) ??
          undefined;

        const userId = session.client_reference_id ?? undefined; // usually null for Payment Links

        const res = await attachCustomerToProfile({
          customerId,
          userId: userId ?? null,
          email: email ?? null,
        });

        console.log("checkout.session.completed -> attach result", {
          route: res.route,
          updated: res.updated,
          customerId,
          email,
          userId,
        });

        break;
      }

      /**
       * Keep subscription status in sync.
       */
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        const status = sub.status; // 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | ...
        const plan = sub.items?.data?.[0]?.price?.id ?? null;

        await upsertSubscriptionStatus({
          customerId,
          status,
          plan,
          currentPeriodEnd: iso(sub.current_period_end),
        });

        break;
      }

      /**
       * Mark active as soon as the invoice is paid (covers edge cases).
       */
      case "invoice.paid": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId =
          typeof inv.customer === "string" ? inv.customer : inv.customer?.id;

        await upsertSubscriptionStatus({
          customerId,
          status: "active",
          plan: inv.lines?.data?.[0]?.price?.id ?? null,
          currentPeriodEnd: iso(inv.lines?.data?.[0]?.period?.end ?? null),
        });

        break;
      }

      /**
       * Downgrade on failed payment.
       */
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId =
          typeof inv.customer === "string" ? inv.customer : inv.customer?.id;

        await upsertSubscriptionStatus({
          customerId,
          status: "past_due",
          plan: inv.lines?.data?.[0]?.price?.id ?? null,
          currentPeriodEnd: iso(inv.lines?.data?.[0]?.period?.end ?? null),
        });

        break;
      }

      default:
        // ignore others
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook handler error:", e);
    return new Response("Webhook handler failed", { status: 500 });
  }
});
