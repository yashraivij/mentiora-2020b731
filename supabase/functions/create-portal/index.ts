import Stripe from "https://esm.sh/stripe@14.23.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!.trim(), { apiVersion: "2024-06-20" });
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!.trim(),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!.trim()
);

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");      // OK to keep * while testing
  h.set("Access-Control-Allow-Headers", "authorization, content-type");
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return new Response(res.body, { status: res.status, headers: h });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors(new Response(null, { status: 200 }));
  if (req.method !== "POST") return cors(new Response("Method not allowed", { status: 405 }));

  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return cors(new Response("Unauthorized", { status: 401 }));
  const jwt = auth.replace("Bearer ", "");

  const { data: { user }, error: userErr } = await supabase.auth.getUser(jwt);
  if (userErr || !user) return cors(new Response("Unauthorized", { status: 401 }));

  const { data: rows, error: profErr } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .limit(1);

  if (profErr) return cors(new Response("Server error", { status: 500 }));
  const customerId = rows?.[0]?.stripe_customer_id;
  if (!customerId) return cors(new Response("No Stripe customer on file", { status: 400 }));

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: "https://preview--mentiora.lovable.app/dashboard",
  });

  return cors(new Response(JSON.stringify({ url: session.url }), {
    status: 200, headers: { "Content-Type": "application/json" }
  }));
});