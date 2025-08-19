import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Use anon key for user authentication
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    // Check subscription status in database
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscribers")
      .select("subscribed, subscription_tier, subscription_end")
      .eq("user_id", user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') { // PGRST116 is "not found"
      logStep("Error checking subscription", { error: subError });
      throw subError;
    }

    let subscribed = false;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (subscription) {
      // Check if subscription is still valid
      if (subscription.subscribed && subscription.subscription_end) {
        const endDate = new Date(subscription.subscription_end);
        const now = new Date();
        
        if (endDate > now) {
          subscribed = true;
          subscriptionTier = subscription.subscription_tier;
          subscriptionEnd = subscription.subscription_end;
        } else {
          // Subscription expired, update database
          const supabaseService = createClient(
            Deno.env.get("SUPABASE_URL") ?? "",
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
            { auth: { persistSession: false } }
          );
          
          await supabaseService
            .from("subscribers")
            .update({ 
              subscribed: false, 
              subscription_tier: null,
              updated_at: new Date().toISOString()
            })
            .eq("user_id", user.id);
          
          logStep("Subscription expired, updated database");
        }
      }
    }

    logStep("Subscription check complete", { subscribed, subscriptionTier, subscriptionEnd });

    return new Response(JSON.stringify({
      subscribed,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});