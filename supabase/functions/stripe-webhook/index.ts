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

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY_TEST') || '', {
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
        logStep("Processing checkout.session.completed", { 
          sessionId: session.id, 
          customerEmail: session.customer_email,
          customerId: session.customer,
          mode: session.mode,
          paymentStatus: session.payment_status
        });

        if (session.customer_email) {
          logStep("Attempting to update profile", { email: session.customer_email });
          
          // First, check if profile exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', session.customer_email)
            .single();
            
          logStep("Profile check result", { 
            email: session.customer_email,
            profileExists: !!existingProfile,
            checkError: checkError?.message 
          });

          // Update user to premium status in both tables
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('email', session.customer_email)
            .select();

          // Also update profiled table for premium status
          const { error: profiledError } = await supabase
            .from('profiled')
            .update({ is_premium: true, premium: true })
            .eq('email', session.customer_email);

          if (profileError) {
            logStep("Error updating profile", { error: profileError.message, email: session.customer_email });
          }
          if (profiledError) {
            logStep("Error updating profiled table", { error: profiledError.message, email: session.customer_email });
          }
          
          if (profileData && profileData.length > 0) {
            logStep("Profile updated to premium", { email: session.customer_email, updatedRows: profileData.length, updatedProfile: profileData[0] });
          } else {
            logStep("No profile found to update by email", { email: session.customer_email });
            
            // Try to find profile by user_id from auth.users
            try {
              const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(session.customer_email);
              logStep("Auth user lookup", { 
                email: session.customer_email, 
                userFound: !!authUser.user,
                authError: authError?.message 
              });
              
              if (authUser.user) {
                const { data: profileByUserId, error: profileByUserIdError } = await supabase
                  .from('profiles')
                  .update({ is_premium: true, premium: true })
                  .eq('id', authUser.user.id)
                  .select();
                  
                if (profileByUserIdError) {
                  logStep("Error updating profile by user_id", { error: profileByUserIdError.message, userId: authUser.user.id });
                } else {
                  logStep("Profile updated by user_id", { userId: authUser.user.id, updatedRows: profileByUserId?.length || 0 });
                }
              }
            } catch (authError) {
              logStep("Auth lookup failed", { error: authError.message, email: session.customer_email });
            }
          }

          // Update or create subscriber record
          const { data: subscriberData, error: subscriberError } = await supabase
            .from('subscribers')
            .upsert({
              email: session.customer_email,
              user_id: existingProfile?.id || null,
              stripe_customer_id: session.customer as string,
              subscribed: true,
              subscription_tier: 'Premium',
              updated_at: new Date().toISOString(),
            }, { onConflict: 'email' })
            .select();

          if (subscriberError) {
            logStep("Error updating subscriber", { error: subscriberError.message, email: session.customer_email });
          } else {
            logStep("Subscriber record updated", { 
              email: session.customer_email, 
              subscriberData: subscriberData?.[0] 
            });
          }
        } else {
          logStep("No customer email in session", { sessionId: session.id });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing invoice.payment_succeeded", { invoiceId: invoice.id });

        if (invoice.customer_email) {
          // Ensure user remains premium in both tables
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: true })
            .eq('email', invoice.customer_email);

          const { error: profiledError } = await supabase
            .from('profiled')
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
          // Remove premium status from both tables
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_premium: false })
            .eq('email', customerEmail);

          const { error: profiledError } = await supabase
            .from('profiled')
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