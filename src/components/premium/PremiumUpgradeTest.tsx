import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePremium } from "@/hooks/usePremium";
import { Crown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UpgradeButton } from "@/components/upgrade/UpgradeButton";
import { useAuth } from "@/contexts/AuthContext";

export const PremiumUpgradeTest = () => {
  const { isPremium, isLoading, subscriptionTier, subscriptionEnd } = usePremium();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleUpgrade = () => {
    const baseUrl = 'https://buy.stripe.com/14A28qbAs87E9Yk5T28N203';
    const stripeUrl = user?.id ? `${baseUrl}?client_reference_id=${user.id}` : baseUrl;
    window.open(stripeUrl, '_blank');
  };

  const refreshStatus = () => {
    // Force refresh by reloading the page - the premium status will be rechecked
    window.location.reload();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Premium Status Test
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshStatus}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Test the premium upgrade functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Premium Status:</p>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Premium" : "Free"}
            </Badge>
          </div>
          
          {subscriptionTier && (
            <div>
              <p className="text-sm font-medium">Tier:</p>
              <Badge variant="outline">{subscriptionTier}</Badge>
            </div>
          )}
          
          {subscriptionEnd && (
            <div className="col-span-2">
              <p className="text-sm font-medium">Expires:</p>
              <p className="text-sm text-muted-foreground">
                {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {!isPremium && (
          <div className="pt-4 border-t">
            <UpgradeButton className="w-full" />
          </div>
        )}

        {isPremium && (
          <div className="pt-4 border-t">
            <div className="text-center text-green-600 font-medium">
              ✅ Premium features unlocked!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};