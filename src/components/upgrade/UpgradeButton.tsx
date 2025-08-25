import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

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
  
  const handleUpgrade = () => {
    console.log('Upgrade button clicked - redirecting to Stripe...');
    // Try multiple methods to ensure redirect works
    try {
      const baseUrl = 'https://buy.stripe.com/3cI28q8og4VsfiE0yI8N202';
      const stripeUrl = user?.id ? `${baseUrl}?client_reference_id=${user.id}` : baseUrl;
      
      // Method 1: Create a temporary anchor and click it
      const link = document.createElement('a');
      link.href = stripeUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Method 2: Fallback to window.location if above doesn't work
      setTimeout(() => {
        window.location.href = stripeUrl;
      }, 100);
    } catch (error) {
      console.error('Error redirecting to Stripe:', error);
      // Final fallback
      const fallbackUrl = user?.id ? `https://buy.stripe.com/3cI28q8og4VsfiE0yI8N202?client_reference_id=${user.id}` : 'https://buy.stripe.com/3cI28q8og4VsfiE0yI8N202';
      window.location.href = fallbackUrl;
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