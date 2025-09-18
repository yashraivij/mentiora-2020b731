import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminNotificationRequest {
  userEmail: string;
  userName: string;
  rewardTitle: string;
  rewardCost: number;
  redeemedAt: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, userName, rewardTitle, rewardCost, redeemedAt }: AdminNotificationRequest = await req.json();

    console.log("Sending admin notification:", { userEmail, userName, rewardTitle, rewardCost });

    const emailResponse = await resend.emails.send({
      from: "Mentiora Rewards <notifications@resend.dev>",
      to: ["yash@mentiora.com"],
      subject: `🎁 Reward Redeemed: ${rewardTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">
            🎁 Reward Redemption Alert
          </h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-top: 0;">Student Details</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${userEmail}</p>
          </div>

          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #1976d2; margin-top: 0;">Reward Details</h2>
            <p><strong>Reward:</strong> ${rewardTitle}</p>
            <p><strong>Cost:</strong> ${rewardCost} MP</p>
            <p><strong>Redeemed At:</strong> ${new Date(redeemedAt).toLocaleString()}</p>
          </div>

          <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #f57c00; margin-top: 0;">⚡ Action Required</h3>
            <p>Please fulfill this reward request within 48 hours. Contact the student at <strong>${userEmail}</strong> to arrange delivery.</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          
          <p style="color: #666; font-size: 12px; text-align: center;">
            This is an automated notification from the Mentiora Rewards System
          </p>
        </div>
      `,
    });

    console.log("Admin notification sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailId: emailResponse.data?.id }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-admin-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);