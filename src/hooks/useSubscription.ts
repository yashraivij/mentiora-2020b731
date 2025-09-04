You said:
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

  const isPremium = ["active", "trialing"].includes(profile?.subscription_status || '');

  const fetchProfile = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentLink = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const join = "https://buy.stripe.com/test_3cI28q8og4VsfiE0yI8N202".includes("?") ? "&" : "?";
    window.location.href =
      "https://buy.stripe.com/test_3cI28q8og4VsfiE0yI8N202" + join +
      "client_reference_id=" + encodeURIComponent(user.id) +
      "&prefilled_email=" + encodeURIComponent(user.email || "") +
      "&success_url=" + encodeURIComponent("https://mentiora.com/dashboard");
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
