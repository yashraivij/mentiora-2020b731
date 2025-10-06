import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SignupNotification {
  user_id: string;
  email: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, email, created_at }: SignupNotification = await req.json();
    
    console.log("Processing signup notification for:", email);

    // Send to Make.com webhook (non-blocking)
    const webhookUrl = "https://hook.eu2.make.com/7beadax49mfvbirz618mconvlx7rcr5e";
    
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id,
          email,
          created_at,
        }),
      });
      
      console.log("Webhook response status:", response.status);
      
      if (!response.ok) {
        console.error("Webhook failed:", await response.text());
      }
    } catch (webhookError) {
      // Log error but don't fail the function
      console.error("Webhook error (non-critical):", webhookError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification processed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-signup function:", error);
    
    // Still return success to not block signup
    return new Response(
      JSON.stringify({ success: true, error: error.message }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
