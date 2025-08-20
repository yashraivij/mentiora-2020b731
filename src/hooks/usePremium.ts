import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PremiumStatus {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
}

export const usePremium = (): PremiumStatus => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    isLoading: true,
    subscriptionTier: null,
    subscriptionEnd: null,
  });

  const checkPremiumStatus = async () => {
    if (!user?.email) {
      setPremiumStatus({
        isPremium: false,
        isLoading: false,
        subscriptionTier: null,
        subscriptionEnd: null,
      });
      return;
    }

    try {
      // Check profile premium status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium, premium')
        .eq('email', user.email)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Check subscriber status for additional details
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end')
        .eq('email', user.email)
        .single();

      if (subscriberError && subscriberError.code !== 'PGRST116') {
        console.error('Error fetching subscriber:', subscriberError);
      }

      const isPremium = profile?.is_premium || profile?.premium || subscriber?.subscribed || false;

      setPremiumStatus({
        isPremium,
        isLoading: false,
        subscriptionTier: subscriber?.subscription_tier || null,
        subscriptionEnd: subscriber?.subscription_end || null,
      });
    } catch (error) {
      console.error('Error checking premium status:', error);
      setPremiumStatus({
        isPremium: false,
        isLoading: false,
        subscriptionTier: null,
        subscriptionEnd: null,
      });
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  return premiumStatus;
};