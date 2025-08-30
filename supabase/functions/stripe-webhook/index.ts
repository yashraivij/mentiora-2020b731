import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-06-20",
});
const cryptoProvider = Stripe.createSubtleCryptoProvider();

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (request) => {
  try {
    const sig = request.headers.get("stripe-signature");
    if (!sig) return new Response("Missing signature", { status: 400 });

    // RAW body (safer version that avoids any normalization issues)
    const buf = await request.arrayBuffer();
    const rawBody = new TextDecoder("utf-8").decode(new Uint8Array(buf));

    const event = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider
    );

    switch (event.type) {
      // 1) When checkout completes, mark user active and store customer id
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;

        const customerId =
          typeof s.customer === "string" ? s.customer : s.customer?.id ?? null;
        const clientRef = s.client_reference_id || null;     // we pass supabase uid here
        const email = s.customer_details?.email || null;

        // Decide which profile row to update (priority)
        let column: "id" | "stripe_customer_id" | "email" | null = null;
        let value: string | null = null;

        if (clientRef) { column = "id"; value = clientRef; }
        else if (customerId) { column = "stripe_customer_id"; value = customerId; }
        else if (email) { column = "email"; value = email; }

        if (column && value) {
          await supabase
            .from("profiles")
            .update({
              stripe_customer_id: customerId,
              subscription_status: "active",
              updated_at: new Date().toISOString(),
            })
            .eq(column, value);
        }

        break;
      }

      // 2) Keep profile in sync as subscription changes (trial, active, canceled, etc.)
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;

        const updates = {
          subscription_status: sub.status, // "trialing" | "active" | "past_due" | "canceled" | "unpaid"
          plan: sub.items?.data?.[0]?.price?.id ?? null,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        };

        // Update by customer id; if no row yet, fallback by email
        const { count } = await supabase
          .from("profiles")
          .update(updates)
          .eq("stripe_customer_id", customerId)
          .select("*", { head: true, count: "exact" });

        if (!count) {
          const email =
            (sub.customer as any)?.email ||
            (sub.latest_invoice as any)?.customer_email ||
            null;
          if (email) {
            await supabase
              .from("profiles")
              .update({ ...updates, stripe_customer_id: customerId })
              .eq("email", email);
          }
        }
        break;
      }

      // 3) Optional: payment failed → mark past_due
      case "invoice.payment_failed": {
        const inv = event.data.object as Stripe.Invoice;
        const customerId =
          typeof inv.customer === "string" ? inv.customer : inv.customer?.id;
        if (customerId) {
          await supabase
            .from("profiles")
            .update({
              subscription_status: "past_due",
              updated_at: new Date().toISOString(),
            })
            .eq("stripe_customer_id", customerId);
        }
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response(`Webhook error: ${(err as Error).message}`, { status: 400 });
  }
});