import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, { apiVersion: "2024-06-20" });
const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  try {
    // 1) Identify the caller via their JWT sent by supabase.functions.invoke
    const authHeader = req.headers.get("Authorization"); // "Bearer <jwt>"
    if (!authHeader) return new Response("Unauthorized", { status: 401 });
    const token = authHeader.replace("Bearer ", "");

    const { data: auth } = await supabase.auth.getUser(token);
    const user = auth?.user;
    if (!user) return new Response("Unauthorized", { status: 401 });

    // 2) Get their Stripe customer id from your profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("email, stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (error || !profile) return new Response("Profile not found", { status: 404 });
    if (!profile.stripe_customer_id) return new Response("No Stripe customer on file", { status: 409 });

    // 3) Create the portal session
    const returnUrl =
      Deno.env.get("BILLING_PORTAL_RETURN_URL") || "https://preview--mentiora.lovable.app/dashboard";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("customer-portal error:", e);
    return new Response("Failed to create portal session", { status: 500 });
  }
});