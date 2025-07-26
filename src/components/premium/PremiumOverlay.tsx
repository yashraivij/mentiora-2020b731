import { Button } from "@/components/ui/button";
import { Crown, Lock } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface PremiumOverlayProps {
  title?: string;
  description?: string;
  gradient?: string;
  className?: string;
}

export const PremiumOverlay = ({ 
  title = "Premium Feature", 
  description = "Upgrade to access this feature",
  gradient = "from-violet-500 to-purple-600",
  className = ""
}: PremiumOverlayProps) => {
  const { createCheckoutSession } = useSubscription();

  return (
    <div className={`absolute inset-0 bg-background/60 dark:bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-100 transition-all duration-300 rounded-3xl ${className}`}>
      <div className="text-center space-y-3">
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
          <Lock className="h-8 w-8 text-white" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
        </div>
        <Button 
          onClick={createCheckoutSession}
          className={`bg-gradient-to-r ${gradient} hover:shadow-lg text-white border-0 px-6 py-2 rounded-xl font-semibold transition-all duration-300`}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};