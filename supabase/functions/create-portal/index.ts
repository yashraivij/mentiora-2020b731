// supabase/functions/create-portal/index.ts
import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// --- ENV ---
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RETURN_URL =
  Deno.env.get("BILLING_PORTAL_RETURN_URL") ||
  "https://preview--mentiora.lovable.app/dashboard"; // change for prod

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// CORS (browser preflight)
const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*", // optionally restrict to your domain
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    console.log("create-portal: Function started");
    
    // 1) Auth: require the caller's Supabase JWT (invoke() sends it)
    const auth = req.headers.get("Authorization"); // "Bearer <jwt>"
    if (!auth) {
      console.log("create-portal: No authorization header");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: CORS });
    }

    const token = auth.replace("Bearer ", "");
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      console.error("create-portal: Auth error:", authError);
      return new Response(JSON.stringify({ error: "Auth failed" }), { status: 401, headers: CORS });
    }
    
    const user = authData?.user;
    if (!user) {
      console.log("create-portal: No user found");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: CORS });
    }

    console.log("create-portal: User authenticated:", user.id);

    // 2) Load customer's stripe_customer_id from your profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    console.log("create-portal: Profile query result:", { profile, error });

    if (error) {
      console.error("create-portal: Profile query error:", error);
      return new Response(JSON.stringify({ error: `Profile error: ${error.message}` }), { status: 404, headers: CORS });
    }
    
    if (!profile) {
      console.log("create-portal: No profile found for user");
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: CORS });
    }
    
    if (!profile.stripe_customer_id) {
      console.log("create-portal: No stripe_customer_id in profile");
      return new Response(JSON.stringify({ error: "No Stripe customer on file. Please subscribe first." }), { status: 409, headers: CORS });
    }

    // 3) Create a customer-specific Billing Portal session
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: RETURN_URL,
      });
      console.log("Portal session created for", profile.stripe_customer_id);
      return new Response(JSON.stringify({ url: session.url }), { headers: CORS });
    } catch (e: any) {
      // PRINT EVERYTHING USEFUL
      console.error("Stripe portal create error", {
        msg: e?.message,
        type: e?.type,
        code: e?.code,
        raw: e?.raw,
      });
      return new Response(JSON.stringify({ error: "Stripe portal create failed" }), {
        status: 500,
        headers: CORS,
      });
    }
  } catch (e) {
    console.error("create-portal error:", e);
    return new Response(JSON.stringify({ error: "Failed to create portal session" }), {
      status: 500,
      headers: CORS,
    });
  }
});