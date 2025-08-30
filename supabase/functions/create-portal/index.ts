import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const supaUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const returnUrl = Deno.env.get("BILLING_PORTAL_RETURN_URL") || "https://preview--mentiora.lovable.app/dashboard";

const cors = {
  "Access-Control-Allow-Origin": "*", // restrict to your domain later
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

if (!stripeKey || !supaUrl || !serviceKey) {
  console.error("Missing env:", {
    hasStripe: !!stripeKey,
    hasSupaUrl: !!supaUrl,
    hasServiceKey: !!serviceKey,
  });
}

const stripe = new Stripe(stripeKey!, { apiVersion: "2024-06-20" });
const supabase = createClient(supaUrl!, serviceKey!);

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    // 1) Auth: require the caller's JWT (invoke() sends it)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
    const token = authHeader.replace("Bearer ", "");

    const { data: auth } = await supabase.auth.getUser(token);
    const user = auth?.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });

    // 2) Load profile and Stripe customer id
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      console.error("Profile load error:", error);
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: cors });
    }
    if (!profile.stripe_customer_id) {
      return new Response(JSON.stringify({ error: "No Stripe customer on file" }), { status: 409, headers: cors });
    }

    // 3) Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), { headers: cors });
  } catch (e: any) {
    console.error("create-portal error:", e?.message || e);
    return new Response(JSON.stringify({ error: "Failed to create portal session" }), {
      status: 500,
      headers: cors,
    });
  }
});