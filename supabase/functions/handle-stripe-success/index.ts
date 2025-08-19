import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");

    // Update user's premium status to true
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ premium: true })
      .eq('id', user.id);

    if (updateError) {
      throw new Error(`Failed to update premium status: ${updateError.message}`);
    }

    console.log(`Successfully updated premium status for user: ${user.email}`);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Premium status updated successfully",
      redirectUrl: "/premium-dashboard"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Error updating premium status:', error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to update premium status" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});