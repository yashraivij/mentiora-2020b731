// manageBilling.ts
import { supabase } from "@/integrations/supabase/client";

export async function openManageBilling() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { 
    window.location.href = "/login"; 
    return; 
  }

  const { data, error } = await supabase.functions.invoke("create-portal", {
    method: "POST",
  });

  if (error || !data?.url) {
    alert(error?.message || "Could not open billing portal");
    return;
  }
  window.location.href = data.url; // go to Stripe portal
}