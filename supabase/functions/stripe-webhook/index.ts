import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Use the service role key for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const body = await req.text();
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret || "");
      logStep("Event verified", { type: event.type, id: event.id });
    } catch (err) {
      logStep("Webhook signature verification failed", { error: err.message });
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Processing checkout.session.completed", { sessionId: session.id });

      // Get the customer details
      const customer = session.customer as string;
      const customerEmail = session.customer_details?.email || session.customer_email;
      
      logStep("Customer details", { customerId: customer, email: customerEmail });

      if (!customerEmail) {
        logStep("No customer email found in session");
        return new Response("No customer email found", { status: 400 });
      }

      // Get the user ID from metadata (if provided) or find by email
      let userId = session.metadata?.user_id;
      
      if (!userId) {
        // Try to find the user by email
        const { data: users, error: userError } = await supabaseClient.auth.admin.listUsers();
        if (userError) {
          logStep("Error fetching users", { error: userError });
          throw userError;
        }
        
        const user = users.users.find(u => u.email === customerEmail);
        if (user) {
          userId = user.id;
          logStep("Found user by email", { userId, email: customerEmail });
        }
      }

      if (!userId) {
        logStep("No user found for email", { email: customerEmail });
        return new Response("User not found", { status: 400 });
      }

      // Determine subscription tier based on payment
      let subscriptionTier = "Premium";
      let subscriptionEnd = null;

      // For subscriptions, get the subscription details
      if (session.mode === "subscription" && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        
        // Determine tier based on price
        const priceId = subscription.items.data[0].price.id;
        const price = await stripe.prices.retrieve(priceId);
        const amount = price.unit_amount || 0;
        
        if (amount <= 999) {
          subscriptionTier = "Basic";
        } else if (amount <= 1999) {
          subscriptionTier = "Premium";
        } else {
          subscriptionTier = "Enterprise";
        }
        
        logStep("Subscription details", { subscriptionId: subscription.id, tier: subscriptionTier, endDate: subscriptionEnd });
      } else {
        // For one-time payments, set subscription end to 1 year from now
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        subscriptionEnd = oneYearFromNow.toISOString();
        logStep("One-time payment detected, setting 1 year subscription");
      }

      // Update or insert subscriber record
      const { error: upsertError } = await supabaseClient
        .from("subscribers")
        .upsert({
          user_id: userId,
          email: customerEmail,
          stripe_customer_id: customer,
          subscribed: true,
          subscription_tier: subscriptionTier,
          subscription_end: subscriptionEnd,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' });

      if (upsertError) {
        logStep("Error updating subscriber", { error: upsertError });
        throw upsertError;
      }

      logStep("Successfully updated subscriber", { userId, email: customerEmail, tier: subscriptionTier });
    }

    // Handle subscription invoice.paid events
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      
      if (invoice.subscription) {
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
        
        if (subscription.status === "active") {
          const customer = await stripe.customers.retrieve(subscription.customer as string);
          const customerEmail = (customer as Stripe.Customer).email;
          
          if (customerEmail) {
            const subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
            
            // Determine tier based on price
            let subscriptionTier = "Premium";
            const priceId = subscription.items.data[0].price.id;
            const price = await stripe.prices.retrieve(priceId);
            const amount = price.unit_amount || 0;
            
            if (amount <= 999) {
              subscriptionTier = "Basic";
            } else if (amount <= 1999) {
              subscriptionTier = "Premium";
            } else {
              subscriptionTier = "Enterprise";
            }

            const { error: updateError } = await supabaseClient
              .from("subscribers")
              .upsert({
                email: customerEmail,
                stripe_customer_id: subscription.customer as string,
                subscribed: true,
                subscription_tier: subscriptionTier,
                subscription_end: subscriptionEnd,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'email' });

            if (updateError) {
              logStep("Error updating subscription from invoice.paid", { error: updateError });
            } else {
              logStep("Successfully updated subscription from invoice.paid", { email: customerEmail, tier: subscriptionTier });
            }
          }
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});