import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    console.error("Missing stripe-signature header");
    return new Response("Missing signature", { status: 400 });
  }

  const raw = await req.text(); // IMPORTANT: raw string, not JSON
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig, webhookSecret);
  } catch (err) {
    console.error("Signature verify error:", err);
    // Helpful debug (safe to log): length + first 20 chars (do NOT log full payload)
    console.error("raw length:", raw.length, "sig prefix:", sig.slice(0, 10), "whsec prefix:", webhookSecret.slice(0, 10));
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        const status = sub.status;

        await supabase
          .from("profiles")
          .update({
            subscription_status: status,
            plan: sub.items?.data?.[0]?.price?.id ?? null,
            current_period_end: sub.current_period_end ? new Date(sub.current_period_end * 1000).toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId = typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        await supabase
          .from("profiles")
          .update({ subscription_status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_customer_id", customerId);
        break;
      }
      // You can handle checkout.session.completed if you need to backfill data
      default:
        // ignore other event types
        break;
    }

    return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" }});
  } catch (e) {
    console.error("Webhook handler error:", e);
    return new Response("Webhook handler failed", { status: 500 });
  }
});