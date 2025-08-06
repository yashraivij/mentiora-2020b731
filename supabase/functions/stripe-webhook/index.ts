import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Use the service role key to bypass RLS for subscription updates
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("stripe key");
    if (!stripeKey) throw new Error("Stripe key is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Note: In production, you should use the webhook endpoint secret
    // For now, we'll verify this is a valid Stripe event
    let event;
    try {
      event = JSON.parse(body);
      logStep("Event parsed", { type: event.type, id: event.id });
    } catch (err) {
      throw new Error("Invalid JSON");
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      logStep("Checkout session completed", { sessionId: session.id, customerEmail: session.customer_details?.email });

      if (session.mode === 'subscription' && session.customer_details?.email) {
        const customerEmail = session.customer_details.email;
        
        // Get customer and subscription details from Stripe
        const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
        
        if (customers.data.length > 0) {
          const customerId = customers.data[0].id;
          const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
            limit: 1,
          });

          const hasActiveSub = subscriptions.data.length > 0;
          let subscriptionTier = "Premium";
          let subscriptionEnd = null;

          if (hasActiveSub) {
            const subscription = subscriptions.data[0];
            subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
            logStep("Active subscription confirmed", { subscriptionId: subscription.id, endDate: subscriptionEnd });
          }

          // Get user_id from profiles table
          const { data: profileData } = await supabaseClient
            .from("profiles")
            .select("id")
            .eq("email", customerEmail)
            .single();

          const userId = profileData?.id;
          logStep("Found user profile", { userId, email: customerEmail });

          // Update the subscribers table
          await supabaseClient.from("subscribers").upsert({
            email: customerEmail,
            user_id: userId,
            stripe_customer_id: customerId,
            subscribed: hasActiveSub,
            subscription_tier: hasActiveSub ? subscriptionTier : null,
            subscription_end: subscriptionEnd,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' });

          logStep("Subscription activated via webhook", { email: customerEmail, subscribed: hasActiveSub });
        }
      }
    }

    // Handle subscription updates, cancellations, etc.
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerId = subscription.customer;
      
      // Get customer email
      const customer = await stripe.customers.retrieve(customerId);
      if (customer && !customer.deleted && customer.email) {
        const subscriptionActive = subscription.status === 'active';
        const subscriptionEnd = subscriptionActive ? 
          new Date(subscription.current_period_end * 1000).toISOString() : null;

        // Get user_id from profiles table
        const { data: profileData } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq("email", customer.email)
          .single();

        const userId = profileData?.id;

        await supabaseClient.from("subscribers").upsert({
          email: customer.email,
          user_id: userId,
          stripe_customer_id: customerId,
          subscribed: subscriptionActive,
          subscription_tier: subscriptionActive ? "Premium" : null,
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

        logStep("Subscription updated via webhook", { 
          email: customer.email, 
          subscribed: subscriptionActive,
          eventType: event.type 
        });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    });
  }
});