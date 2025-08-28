import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const usePremiumStatus = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.email) {
        setIsPremium(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('is_premium, subscribed')
          .eq('email', user.email)
          .single();

        if (error) {
          console.log('No premium subscription found for user:', user.email);
          setIsPremium(false);
        } else {
          setIsPremium(data.is_premium === true && data.subscribed === true);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user?.email]);

  return { isPremium, isLoading };
};