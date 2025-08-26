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
    
    // Get Stripe keys - try all possible secret key names
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || 
                           Deno.env.get("STRIPE_TEST_SECRET_KEY") || 
                           Deno.env.get("STRIPE_SECRET_KEY_TEST");
    const stripePriceId = Deno.env.get("STRIPE_PRICE_ID") || Deno.env.get("STRIPE_PRODUCT_ID");
    
    console.log("[CREATE-CHECKOUT] Config check:", {
      secretKeyFound: !!stripeSecretKey,
      priceIdFound: !!stripePriceId,
      secretKeyPrefix: stripeSecretKey ? stripeSecretKey.substring(0, 12) + "..." : "null"
    });
    
    // Validate Stripe secret key
    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ 
        error: "Stripe secret key not configured - please set STRIPE_SECRET_KEY or STRIPE_TEST_SECRET_KEY"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    if (!stripeSecretKey.startsWith('sk_')) {
      return new Response(JSON.stringify({ 
        error: `Invalid Stripe secret key format - got ${stripeSecretKey.substring(0, 12)}... but expected sk_test_ or sk_live_`
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    // If no price ID, create a default subscription price
    let priceConfig;
    if (stripePriceId) {
      priceConfig = { price: stripePriceId, quantity: 1 };
    } else {
      // Create price on the fly if no price ID is configured
      priceConfig = {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium Subscription',
            description: 'Access to all premium features'
          },
          unit_amount: 999, // $9.99
          recurring: {
            interval: 'month'
          }
        },
        quantity: 1
      };
    }
    
    console.log("[CREATE-CHECKOUT] Using keys - Stripe:", stripeSecretKey.substring(0, 12) + "...", "Price:", stripePriceId);
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the origin for redirect URLs
    const origin = req.headers.get("origin") || "http://localhost:3000";
    
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

    // Create checkout session
    console.log("[CREATE-CHECKOUT] Creating session for:", customerEmail || "guest user");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [priceConfig],
      mode: "subscription",
      success_url: `${origin}/payment-success`,
      cancel_url: `${origin}/`,
      allow_promotion_codes: true,
      billing_address_collection: "required",
      metadata: {
        user_id: customerEmail || "guest",
      },
    });

    console.log("[CREATE-CHECKOUT] Session created successfully:", session.id);
    return new Response(JSON.stringify({ 
      id: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
    // Handle Stripe-specific errors
    if (error.type === 'StripeCardError' || error.type === 'StripeInvalidRequestError') {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    return new Response(JSON.stringify({ 
      error: error.message || "Internal server error"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});