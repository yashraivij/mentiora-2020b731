import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[CREATE-CHECKOUT] Starting checkout session creation");
    
    // Try multiple secret name variations for development flexibility
    let stripeKey = Deno.env.get("STRIPE_SECRET_KEY") || 
                   Deno.env.get("STRIPE_SECRET_KEY_TEST") || 
                   Deno.env.get("STRIPE_TEST_SECRET_KEY");
    
    let priceId = Deno.env.get("STRIPE_PRICE_ID") || 
                 Deno.env.get("STRIPE_PRODUCT_ID");
    
    console.log("[CREATE-CHECKOUT] Environment check:", {
      hasStripeKey: !!stripeKey,
      hasPriceId: !!priceId,
      stripeKeyLength: stripeKey?.length || 0,
      priceIdLength: priceId?.length || 0,
      availableSecrets: Object.keys(Deno.env.toObject()).filter(key => key.includes('STRIPE'))
    });
    
    if (!stripeKey) {
      const errorMsg = "STRIPE_SECRET_KEY not found. Available Stripe secrets: " + 
                      Object.keys(Deno.env.toObject()).filter(key => key.includes('STRIPE')).join(', ');
      console.error("[CREATE-CHECKOUT] " + errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!priceId) {
      const errorMsg = "STRIPE_PRICE_ID not found. Available Stripe secrets: " + 
                      Object.keys(Deno.env.toObject()).filter(key => key.includes('STRIPE')).join(', ');
      console.error("[CREATE-CHECKOUT] " + errorMsg);
      throw new Error(errorMsg);
    }
    
    // Validate Stripe key format
    if (!stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
      throw new Error("Invalid Stripe secret key format. Must start with sk_test_ or sk_live_");
    }
    
    console.log("[CREATE-CHECKOUT] Using Stripe key:", stripeKey.substring(0, 12) + "...");
    console.log("[CREATE-CHECKOUT] Using price ID:", priceId);
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "https://mkmrasgbrhwtycwpdtke.supabase.co";
    
    // Create Supabase client for user authentication
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    let customerEmail;
    let customerId;

    // Try to get authenticated user
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabaseClient.auth.getUser(token);
        if (data.user?.email) {
          customerEmail = data.user.email;
          
          // Check for existing Stripe customer
          const customers = await stripe.customers.list({ 
            email: customerEmail, 
            limit: 1 
          });
          
          if (customers.data.length > 0) {
            customerId = customers.data[0].id;
          }
        }
      } catch (error) {
        console.log("Could not authenticate user, proceeding with guest checkout");
      }
    }

    // Create checkout session using the specific price ID
    console.log("[CREATE-CHECKOUT] Creating session for:", customerEmail || "guest user");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/?payment=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: {
        user_id: customerEmail || "guest",
      },
    });

    console.log("[CREATE-CHECKOUT] Session created successfully:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});