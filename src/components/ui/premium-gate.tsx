import { ReactNode } from "react";
import { Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumBadge } from "@/components/ui/premium-badge";
import { UpgradeButton } from "@/components/upgrade/UpgradeButton";
import { usePremium } from "@/hooks/usePremium";

interface PremiumGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const PremiumGate = ({ 
  children, 
  fallback, 
  title = "Premium Feature",
  description = "Upgrade to premium to unlock this feature and get access to all advanced tools.",
  className 
}: PremiumGateProps) => {
  const { isPremium, isLoading } = usePremium();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <Card className={className}>
          <CardContent className="p-6">
            <div className="h-32 bg-muted rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="p-3 bg-muted rounded-full">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {title}
          <PremiumBadge size="sm" />
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <UpgradeButton />
      </CardContent>
    </Card>
  );
};