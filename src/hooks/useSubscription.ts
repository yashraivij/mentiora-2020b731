// useSubscription.ts
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  subscription_status: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Premium only if status is active or trialing
  const isPremium = ["active", "trialing"].includes(profile?.subscription_status || '');

  const fetchProfile = async () => {
    if (!user?.id) {
      console.log('[useSubscription] No user, skipping fetch');
      setProfile(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log('[useSubscription] Fetching profile for user.id =', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)         // <-- make sure profiles.id == auth user id
        .single();                 // use .single() so we see an error if no row

      if (error) {
        console.error('[useSubscription] Fetch error:', error);
        setProfile(null);
      } else {
        console.log('[useSubscription] Profile data:', data);
        setProfile(data);
      }
    } catch (error) {
      console.error('[useSubscription] Fetch exception:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentLink = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      window.location.href = "/login";
      return;
    }
    const base = "https://buy.stripe.com/test_3cI28q8og4VsfiE0yI8N202"; // <--- PUT YOUR LINK HERE
    const join = base.includes("?") ? "&" : "?";

    // success_url is ignored by Payment Links – set redirect in Stripe dashboard instead
    window.location.href =
      base + join +
      "client_reference_id=" + encodeURIComponent(authUser.id) +
      "&prefilled_email=" + encodeURIComponent(authUser.email || "");
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]);

  return {
    profile,
    isPremium,
    isLoading,
    openPaymentLink,
    refetch: fetchProfile
  };
};

