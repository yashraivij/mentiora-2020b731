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
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
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
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price: "price_1RzsBhCtgl2dlnVO2C1G5vcO", // Using provided price ID
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

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});