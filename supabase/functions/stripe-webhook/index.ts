import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!.trim(), { apiVersion: "2024-06-20" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!.trim();
const supabase = createClient(Deno.env.get("SUPABASE_URL")!.trim(), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!.trim());

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const raw = await req.text();

  // Keep this while testing; remove later if you want
  console.log("verify debug", {
    rawLen: raw.length,
    sigPrefix: sig.slice(0, 12),
    whsecPrefix: webhookSecret.slice(0, 12),
  });

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
       * 1) When Checkout completes, capture the Stripe customer id and attach it to the profile.
       * We try 3 ways to identify the profile:
       *   A) by client_reference_id (if you set it to the supabase user id when creating/redirecting to Checkout)
       *   B) by email from session.customer_details.email
       *   C) as last resort, by email from the Stripe customer object
       */
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
        const email = session.customer_details?.email ?? undefined;
        const userId = session.client_reference_id ?? undefined;

        if (customerId) {
          if (userId) {
            // A) attach by user id
            const { data, error } = await supabase
              .from("profiles")
              .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
              .eq("id", userId)
              .select("*");
            console.log("attach by userId", { count: data?.length ?? 0, error });
            if ((data?.length ?? 0) > 0) break; // done
          }

          if (email) {
            // B) attach by email
            const { data, error } = await supabase
              .from("profiles")
              .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
              .eq("email", email)
              .select("*");
            console.log("attach by email (session)", { count: data?.length ?? 0, error });
            if ((data?.length ?? 0) > 0) break; // done
          }

          // C) fetch customer for email and try again
          const cust = await stripe.customers.retrieve(customerId);
          const custEmail = !cust.deleted ? (cust as Stripe.Customer).email ?? undefined : undefined;
          if (custEmail) {
            const { data, error } = await supabase
              .from("profiles")
              .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
              .eq("email", custEmail)
              .select("*");
            console.log("attach by email (customer)", { count: data?.length ?? 0, error });
          }
        }
        break;
      }

      /**
       * 2) Subscription lifecycle updates the premium status.
       * If no row matches stripe_customer_id yet, also try to backfill by email.
       */
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        const status = sub.status; // 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
        const plan = sub.items?.data?.[0]?.price?.id ?? null;
        const currentPeriodEndIso = sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null;

        // First pass: by stripe_customer_id
        let { data, error } = await supabase
          .from("profiles")
          .update({
            subscription_status: status,
            plan,
            current_period_end: currentPeriodEndIso,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId)
          .select("*");
        console.log("sub update by customer_id", { count: data?.length ?? 0, error, customerId, status });

        if ((data?.length ?? 0) === 0 && customerId) {
          // Backfill: try by email
          const cust = await stripe.customers.retrieve(customerId);
          if (!("deleted" in cust)) {
            const custEmail = (cust as Stripe.Customer).email ?? undefined;
            if (custEmail) {
              const res2 = await supabase
                .from("profiles")
                .update({
                  stripe_customer_id: customerId, // backfill attach
                  subscription_status: status,
                  plan,
                  current_period_end: currentPeriodEndIso,
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
        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        const { data, error } = await supabase
          .from("profiles")
          .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId)
          .select("*");
        console.log("payment_failed update", { count: data?.length ?? 0, error, customerId });
        break;
      }

      default:
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