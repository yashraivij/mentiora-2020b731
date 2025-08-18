import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface SubscriptionContextType {
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  isLoading: boolean;
  checkSubscription: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSubscription = async () => {
    if (!user) {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      return;
    }

    setIsLoading(true);
    try {
      console.log('Checking subscription status for user:', user.email);
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        setSubscribed(false);
        setSubscriptionTier(null);
        setSubscriptionEnd(null);
      } else {
        console.log('Subscription check result:', data);
        setSubscribed(data.subscribed || false);
        setSubscriptionTier(data.subscription_tier || null);
        setSubscriptionEnd(data.subscription_end || null);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      // Open the specific Stripe payment link
      window.open('https://buy.stripe.com/3cI28q8og4VsfiE0yI8N202', '_blank');
    } catch (error) {
      console.error('Error opening checkout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) {
        console.error('Error opening customer portal:', error);
        return;
      }
      
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check subscription when user changes
  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
    }
  }, [user]);

  // Check for payment success URL param and refresh subscription
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success' && user) {
      // Wait a moment for Stripe to process the subscription
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
  }, [user]);

  return (
    <SubscriptionContext.Provider value={{
      subscribed,
      subscriptionTier,
      subscriptionEnd,
      isLoading,
      checkSubscription,
      createCheckout,
      openCustomerPortal
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};