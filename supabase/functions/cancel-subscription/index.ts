import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function for debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CANCEL-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_TEST_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_TEST_SECRET_KEY is not set");
    logStep("Stripe test key verified");

    // Initialize Supabase client with the service role key to update database
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Find the customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found for this user");
    }
    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscriptions found for this user");
    }

    // Cancel all active subscriptions immediately
    const cancelledSubscriptions = [];
    for (const subscription of subscriptions.data) {
      const cancelled = await stripe.subscriptions.cancel(subscription.id);
      cancelledSubscriptions.push(cancelled.id);
      logStep("Subscription cancelled", { subscriptionId: cancelled.id });
    }

    // Update the user's premium status in database
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ is_premium: false, premium: false })
      .eq('email', user.email);

    if (profileError) {
      logStep("Error updating profile", { error: profileError.message });
    } else {
      logStep("Profile updated - premium status removed");
    }

    // Update subscriber record
    const { error: subscriberError } = await supabaseClient
      .from('subscribers')
      .update({
        subscribed: false,
        subscription_end: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('email', user.email);

    if (subscriberError) {
      logStep("Error updating subscriber", { error: subscriberError.message });
    } else {
      logStep("Subscriber record updated");
    }

    return new Response(JSON.stringify({ 
      success: true, 
      cancelledSubscriptions: cancelledSubscriptions,
      message: "Subscription cancelled successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in cancel-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});