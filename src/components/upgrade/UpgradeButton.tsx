import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { stripePromise } from "@/lib/stripe";

interface UpgradeButtonProps {
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
}

export const UpgradeButton = ({ 
  className, 
  variant = "default", 
  size = "default", 
  children = "Upgrade to Premium" 
}: UpgradeButtonProps) => {
  const { user } = useAuth();
  
  const handleUpgrade = async () => {
    console.log('Upgrade button clicked - creating checkout session...');
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: user ? {
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        } : {}
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        alert(`Payment setup error: ${error.message || error.toString()}`);
        return;
      }

      if (data?.error) {
        console.error('Stripe configuration error:', data.error);
        alert(`Stripe configuration error: ${data.error}`);
        return;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else if (data?.id) {
        // Fallback: Use Stripe.js to redirect to checkout
        const stripe = await stripePromise;
        if (stripe) {
          const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: data.id,
          });
          if (stripeError) {
            console.error('Stripe redirect error:', stripeError);
            alert(`Stripe redirect error: ${stripeError.message}`);
          }
        }
      } else {
        console.error('No session URL or ID received:', data);
        alert('Payment system error: No checkout session created. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      variant={variant}
      size={size}
      className={cn(
        "bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white",
        className
      )}
    >
      <Crown className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};