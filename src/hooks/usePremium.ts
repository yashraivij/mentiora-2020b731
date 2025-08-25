import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface PremiumStatus {
  isPremium: boolean;
  isLoading: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  hasStripeCustomer: boolean;
}

export const usePremium = (): PremiumStatus => {
  const { user } = useAuth();
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    isLoading: true,
    subscriptionTier: null,
    subscriptionEnd: null,
    hasStripeCustomer: false,
  });

  const checkPremiumStatus = async () => {
    if (!user?.email) {
      setPremiumStatus({
        isPremium: false,
        isLoading: false,
        subscriptionTier: null,
        subscriptionEnd: null,
        hasStripeCustomer: false,
      });
      return;
    }

    try {
      // Check profile premium status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_premium, premium')
        .eq('email', user.email)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Check subscriber status for additional details including stripe_customer_id
      const { data: subscriber, error: subscriberError } = await supabase
        .from('subscribers')
        .select('subscribed, subscription_tier, subscription_end, stripe_customer_id')
        .eq('email', user.email)
        .maybeSingle();

      if (subscriberError) {
        console.error('Error fetching subscriber:', subscriberError);
      }

      const isPremium = profile?.is_premium || profile?.premium || subscriber?.subscribed || false;
      const hasStripeCustomer = !!subscriber?.stripe_customer_id;
      
      console.log('Premium Status Debug:', {
        userEmail: user.email,
        profile: profile,
        subscriber: subscriber,
        isPremium: isPremium,
        hasStripeCustomer: hasStripeCustomer,
        stripeCustomerId: subscriber?.stripe_customer_id,
        profileIsPremium: profile?.is_premium,
        profilePremium: profile?.premium,
        subscriberSubscribed: subscriber?.subscribed
      });

      setPremiumStatus({
        isPremium,
        isLoading: false,
        subscriptionTier: subscriber?.subscription_tier || null,
        subscriptionEnd: subscriber?.subscription_end || null,
        hasStripeCustomer,
      });
    } catch (error) {
      console.error('Error checking premium status:', error);
      setPremiumStatus({
        isPremium: false,
        isLoading: false,
        subscriptionTier: null,
        subscriptionEnd: null,
        hasStripeCustomer: false,
      });
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [user]);

  return premiumStatus;
};