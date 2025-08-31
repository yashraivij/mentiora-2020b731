// manageBilling.ts
import { supabase } from "@/integrations/supabase/client";

export async function openManageBilling() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) { 
    window.location.href = "/login"; 
    return; 
  }

  const { data, error } = await supabase.functions.invoke("create-portal");

  if (error) { 
    alert('Could not open billing portal'); 
    return; 
  }

  window.location.href = data.url;
}