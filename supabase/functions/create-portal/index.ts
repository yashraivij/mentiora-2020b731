// supabase/functions/create-portal/index.ts
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Read env (trim to avoid stray spaces/newlines)
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY")?.trim();
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")?.trim();
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();

const stripe = new Stripe(STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*"); // or your domain if you want to lock it down
  h.set("Access-Control-Allow-Headers", "authorization, content-type");
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return new Response(res.body, { ...res, headers: h });
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return cors(new Response(null, { status: 200 }));
  }
  if (req.method !== "POST") {
    return cors(new Response("Method not allowed", { status: 405 }));
  }

  try {
    // Quick env sanity
    const missing = {
      hasStripe: !!STRIPE_SECRET_KEY,
      hasSupaUrl: !!SUPABASE_URL,
      hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
    };
    if (!missing.hasStripe || !missing.hasSupaUrl || !missing.hasServiceRole) {
      console.error("Missing env:", missing);
      return cors(new Response("Server misconfigured", { status: 500 }));
    }

    // Read the Supabase Auth JWT sent from the browser
    const authHeader = req.headers.get("Authorization"); // "Bearer <JWT>"
    if (!authHeader?.startsWith("Bearer ")) {
      return cors(new Response("Unauthorized", { status: 401 }));
    }
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    // Validate JWT and get user id
    const {
      data: { user },
      error: getUserErr,
    } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (getUserErr || !user) {
      console.error("getUser error:", getUserErr);
      return cors(new Response("Unauthorized", { status: 401 }));
    }

    // Look up stripe_customer_id in your profiles table
    const { data: profiles, error: profErr } = await supabase
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .limit(1);
    if (profErr) {
      console.error("profiles query error:", profErr);
      return cors(new Response("Server error", { status: 500 }));
    }
    const profile = profiles?.[0];
    if (!profile?.stripe_customer_id) {
      // If you prefer, you can create a Stripe customer here, but usually this should exist.
      return cors(new Response("No Stripe customer on file", { status: 400 }));
    }

    // Create the billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      // Optional: configure return_url
      return_url: "https://preview--mentiora.lovable.app/dashboard",
    });

    return cors(
      new Response(JSON.stringify({ url: session.url }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
  } catch (e) {
    console.error("create-portal error:", e);
    return cors(new Response("Server error", { status: 500 }));
  }
});