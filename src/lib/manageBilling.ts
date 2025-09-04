// manageBilling.ts
import { supabase } from "@/integrations/supabase/client";

export async function openManageBilling() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) { 
    window.location.href = "/login"; 
    return; 
  }

  const { data, error } = await supabase.functions.invoke("create-portal", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error || !data?.url) {
    alert(error?.message || "Could not open billing portal");
    return;
  }
  window.location.href = data.url; // go to Stripe portal
}