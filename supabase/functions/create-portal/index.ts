import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Allow browser preflight + POST from your app
const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*", // if you want to restrict, put your domain here
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 2) Auth: require a Supabase JWT (invoke() sends this automatically)
    const authHeader = req.headers.get("Authorization"); // "Bearer <jwt>"
    if (!authHeader) return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    const token = authHeader.replace("Bearer ", "");

    const { data: auth } = await supabase.auth.getUser(token);
    const user = auth?.user;
    if (!user) return new Response("Unauthorized", { status: 401, headers: corsHeaders });

    // 3) Load Stripe customer id from your profile
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return new Response("Profile not found", { status: 404, headers: corsHeaders });
    }
    if (!profile.stripe_customer_id) {
      return new Response("No Stripe customer on file", { status: 409, headers: corsHeaders });
    }

    // 4) Create a Billing Portal session
    const returnUrl =
      Deno.env.get("BILLING_PORTAL_RETURN_URL") ||
      "https://preview--mentiora.lovable.app/dashboard"; // change for prod later

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (e) {
    console.error("create-portal error:", e);
    return new Response("Failed to create portal session", {
      status: 500,
      headers: corsHeaders,
    });
  }
});