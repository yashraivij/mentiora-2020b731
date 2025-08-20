import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received", { method: req.method });

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    // Get the raw body and signature
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    logStep("Verifying webhook signature");

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    logStep("Webhook verified", { type: event.type, id: event.id });

    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });

        if (session.customer_email) {
          // Update user to premium status
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true, premium: true })
            .eq('email', session.customer_email);

          if (profileError) {
            logStep("Error updating profile", { error: profileError });
          } else {
            logStep("Profile updated to premium", { email: session.customer_email });
          }

          // Update or create subscriber record
          const { error: subscriberError } = await supabase
            .from('subscribers')
            .upsert({
              email: session.customer_email,
              stripe_customer_id: session.customer as string,
              subscribed: true,
              subscription_tier: 'Premium',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' });

          if (subscriberError) {
            logStep("Error updating subscriber", { error: subscriberError });
          } else {
            logStep("Subscriber record updated", { email: session.customer_email });
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing invoice.payment_succeeded", { invoiceId: invoice.id });

        if (invoice.customer_email) {
          // Ensure user remains premium
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true, premium: true })
            .eq('email', invoice.customer_email);

          if (profileError) {
            logStep("Error updating profile on payment", { error: profileError });
          }

          // Update subscriber record
          const { error: subscriberError } = await supabase
            .from('subscribers')
            .update({
              subscribed: true,
              updated_at: new Date().toISOString(),
            })
            .eq('email', invoice.customer_email);

          if (subscriberError) {
            logStep("Error updating subscriber on payment", { error: subscriberError });
          }
        }
        break;
      }

      case 'invoice.payment_failed':
      case 'customer.subscription.deleted': {
        const obj = event.data.object as Stripe.Invoice | Stripe.Subscription;
        logStep(`Processing ${event.type}`, { id: obj.id });

        let customerEmail = '';
        
        if ('customer_email' in obj && obj.customer_email) {
          customerEmail = obj.customer_email;
        } else if ('customer' in obj) {
          // Get customer email from Stripe if not directly available
          const customer = await stripe.customers.retrieve(obj.customer as string);
          if ('email' in customer && customer.email) {
            customerEmail = customer.email;
          }
        }

        if (customerEmail) {
          // Remove premium status
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: false, premium: false })
            .eq('email', customerEmail);

          if (profileError) {
            logStep("Error removing premium status", { error: profileError });
          } else {
            logStep("Premium status removed", { email: customerEmail });
          }

          // Update subscriber record
          const { error: subscriberError } = await supabase
            .from('subscribers')
            .update({
              subscribed: false,
              updated_at: new Date().toISOString(),
            })
            .eq('email', customerEmail);

          if (subscriberError) {
            logStep("Error updating subscriber on cancellation", { error: subscriberError });
          }
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});