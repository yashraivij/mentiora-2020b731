import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const supaUrl = Deno.env.get("SUPABASE_URL");
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const returnUrl = Deno.env.get("BILLING_PORTAL_RETURN_URL") || "https://preview--mentiora.lovable.app/dashboard";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

// Log what envs we see (no secrets printed)
console.log("ENV CHECK", {
  hasStripe: !!stripeKey,
  hasSupaUrl: !!supaUrl,
  hasServiceKey: !!serviceKey,
  returnUrl,
});

const stripe = stripeKey ? new Stripe(stripeKey, { apiVersion: "2024-06-20" }) : null as any;
const supabase = createClient(supaUrl!, serviceKey!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    if (!stripeKey) {
      console.error("MISSING STRIPE_SECRET_KEY");
      return new Response(JSON.stringify({ error: "Server misconfig: STRIPE_SECRET_KEY missing" }), { status: 500, headers: cors });
    }

    // Auth via the caller's JWT (invoke() sends it automatically)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No Authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
    }
    const token = authHeader.replace("Bearer ", "");

    const { data: auth, error: authErr } = await supabase.auth.getUser(token);
    if (authErr) console.error("getUser error:", authErr);
    const user = auth?.user;
    if (!user) {
      console.error("No user from token");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: cors });
    }
    console.log("Caller uid:", user.id);

    // Load profile
    const { data: profile, error: profErr } = await supabase
      .from("profiles")
      .select("email, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profErr || !profile) {
      console.error("Profile load error:", profErr);
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: cors });
    }

    console.log("Profile OK", { email: profile.email, hasCustomer: !!profile.stripe_customer_id });

    if (!profile.stripe_customer_id) {
      console.error("No stripe_customer_id on profile");
      return new Response(JSON.stringify({ error: "No Stripe customer on file" }), { status: 409, headers: cors });
    }

    // Create portal session
    let session;
    try {
      session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: returnUrl,
      });
    } catch (e: any) {
      console.error("Stripe portal create error:", e?.message || e);
      return new Response(JSON.stringify({ error: "Stripe portal create failed" }), { status: 500, headers: cors });
    }

    console.log("Portal session created");
    return new Response(JSON.stringify({ url: session.url }), { headers: cors });
  } catch (e: any) {
    console.error("Unhandled create-portal error:", e?.message || e);
    return new Response(JSON.stringify({ error: "Failed to create portal session" }), { status: 500, headers: cors });
  }
});