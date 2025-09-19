
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { PremiumWelcomeNotification } from '@/components/ui/premium-welcome-notification';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isPremium: boolean;
  refreshSubscription: (userId?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [showPremiumWelcome, setShowPremiumWelcome] = useState(false);

const refreshSubscription = async (userId?: string) => {
  const targetUserId = userId || user?.id;
  console.log("Refreshing subscription for user ID:", targetUserId);
  if (!targetUserId) {
    console.log("No user ID available, skipping refresh");
    return;
  }
  
  try {
    console.log("Attempting to fetch subscription status from Supabase");
    const { data, error } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', targetUserId)
      .maybeSingle();
    
    if (error) {
      console.error('Subscription fetch error:', error.message);
      return; // Don't reset premium status on error
    }
    
    if (data) {
      console.log("Fetched subscription status:", data.subscription_status);
      const premium = ["active", "trialing"].includes(data.subscription_status || '');
      
      // Show welcome notification if user just became premium and hasn't seen it before
      if (premium && !isPremium && user) {
        const hasSeenWelcome = localStorage.getItem(`premium_welcome_shown_${user.id}`);
        if (!hasSeenWelcome) {
          console.log("User just became premium, showing welcome notification");
          setShowPremiumWelcome(true);
          // Mark as seen immediately to prevent multiple showings
          localStorage.setItem(`premium_welcome_shown_${user.id}`, "true");
        }
      }
      
      setIsPremium(premium);
      console.log("Updated isPremium to:", premium);
    } else {
      console.log("No subscription data found");
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    // Don't reset premium status on error
  }
};

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      // Check for existing session first
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await refreshSubscription(session.user.id);
      }
      
      setIsLoading(false);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Refresh subscription and handle login rewards
        if (session?.user) {
          setTimeout(async () => {
            await refreshSubscription(session.user.id);
            // Handle daily login MP reward server-side
            if (event === 'SIGNED_IN') {
              try {
                const response = await supabase.functions.invoke('award-mp', {
                  body: { action: 'daily_login', userId: session.user.id }
                });
                
                if (response.data?.awarded > 0) {
                  console.log(`Daily login bonus: +${response.data.awarded} MP`);
                }
              } catch (error) {
                console.error('Error awarding daily login MP:', error);
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setIsPremium(false);
        }
        
        setIsLoading(false);
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign in:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      console.log('Login successful:', data.user?.email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Attempting to sign up:', email, 'with name:', name);
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            name: name
          }
        }
      });

      if (error) {
        console.error('Register error:', error.message);
        return false;
      }

      console.log('Registration successful:', data.user?.email);
      console.log('User should now appear in Supabase profiles table');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Signing out user:', user?.email);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      isPremium,
      refreshSubscription
    }}>
      {children}
      <PremiumWelcomeNotification 
        isVisible={showPremiumWelcome}
        onClose={() => setShowPremiumWelcome(false)}
      />
    </AuthContext.Provider>
  );
};
