import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Crown, Eye } from "lucide-react";

interface BlurredPreviewProps {
  children: React.ReactNode;
  showPreview?: boolean;
  className?: string;
}

export const BlurredPreview = ({ 
  children, 
  showPreview = false, 
  className = "" 
}: BlurredPreviewProps) => {
  const { isSubscribed, createCheckoutSession } = useSubscription();

  if (isSubscribed) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Blurred content */}
      <div className={showPreview ? "blur-sm" : "blur-md opacity-50"}>
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 via-background/20 to-transparent">
        <div className="text-center space-y-3 bg-background/90 backdrop-blur-sm p-6 rounded-2xl border shadow-lg">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
            <Eye className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">Unlock Full Results</h3>
            <p className="text-sm text-muted-foreground">Get detailed insights with Premium</p>
          </div>
          <Button 
            onClick={createCheckoutSession}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:shadow-lg text-white border-0 px-6 py-2 rounded-xl font-semibold transition-all duration-300"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      </div>
    </div>
  );
};