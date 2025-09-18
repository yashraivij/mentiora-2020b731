
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, LucideIcon } from "lucide-react";

interface PremiumAnalyticsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  comingSoon?: boolean;
}

export const PremiumAnalyticsCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  comingSoon = false 
}: PremiumAnalyticsCardProps) => {
  return (
    <Card className="relative p-6 bg-card border-0 rounded-xl hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Icon className="h-5 w-5 text-muted-foreground" />
          {comingSoon && (
            <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="pt-4">
          <Button size="sm" className="w-full">
            <Lock className="h-4 w-4 mr-2" />
            Upgrade to Access
          </Button>
        </div>
      </div>
    </Card>
  );
};
