// manageBilling.ts
import { supabase } from "@/integrations/supabase/client";

export async function openManageBilling() {
  console.log('Starting billing portal...');
  
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session check:', { session: !!session, sessionError });
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      alert(`Session error: ${sessionError.message}`);
      return;
    }
    
    if (!session?.user) { 
      console.log('No session, redirecting to login');
      window.location.href = "/login"; 
      return; 
    }

    console.log('User authenticated:', session.user.email);
    console.log('Invoking create-portal function...');
    
    const { data, error } = await supabase.functions.invoke("create-portal", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });
    
    console.log('Function response:', { data, error });

    if (error) { 
      console.error('Billing portal error:', error);
      alert(`Could not open billing portal: ${error.message || 'Unknown error'}`); 
      return; 
    }

    if (!data?.url) {
      console.error('No URL returned from function');
      alert('Could not open billing portal: No URL returned');
      return;
    }

    console.log('Redirecting to:', data.url);
    window.location.href = data.url;
  } catch (err) {
    console.error('Unexpected error:', err);
    alert(`Unexpected error: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}