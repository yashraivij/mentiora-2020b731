import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Initialize Stripe with test key
    const stripe = new Stripe(Deno.env.get("STRIPE_TEST_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Supabase client with service role key
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseService.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Get user's subscription info from database
    const { data: subscriber, error: subError } = await supabaseService
      .from("subscribers")
      .select("subscription_id, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (subError || !subscriber?.subscription_id) {
      throw new Error("No active subscription found for user");
    }

    logStep("Found subscription", { subscriptionId: subscriber.subscription_id });

    // Cancel the subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(subscriber.subscription_id);
    logStep("Cancelled subscription in Stripe", { 
      subscriptionId: canceledSubscription.id,
      status: canceledSubscription.status 
    });

    // Update subscriber record in database
    const { error: updateError } = await supabaseService
      .from("subscribers")
      .update({
        subscribed: false,
        subscription_tier: null,
        subscription_end: new Date(canceledSubscription.canceled_at! * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (updateError) {
      logStep("Error updating database", { error: updateError });
      throw new Error("Failed to update subscription status in database");
    }

    logStep("Updated database successfully");

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Subscription cancelled successfully",
      canceledAt: new Date(canceledSubscription.canceled_at! * 1000).toISOString()
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