import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
    console.log('Upgrade button clicked - creating subscription...');
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription');
      
      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      } else {
        console.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
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