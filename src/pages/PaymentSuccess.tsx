import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PaymentSuccess: React.FC = () => {
  const { refreshSubscription } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Refresh subscription status after payment
        await refreshSubscription();
        console.log('Subscription status refreshed after payment');
      } catch (error) {
        console.error('Failed to refresh subscription:', error);
      } finally {
        setIsRefreshing(false);
      }
    };

    handlePaymentSuccess();
  }, [refreshSubscription]);

  const goHome = () => {
    // Redirect to dashboard with upgraded flag to ensure proper refresh
    window.location.href = "/dashboard?upgraded=true";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="p-8">
          <div className="mb-6">
            {isRefreshing ? (
              <>
                <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Activating Premium...
                </h1>
                <p className="text-muted-foreground">
                  We're updating your account with premium features.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Welcome to Premium!
                </h1>
                <p className="text-muted-foreground">
                  Your payment was successful. You now have access to all premium features.
                </p>
              </>
            )}
          </div>
          
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                Premium Features Unlocked:
              </h3>
              <ul className="text-sm text-green-600 dark:text-green-400 space-y-1">
                <li>• Unlimited practice questions</li>
                <li>• Predicted exam papers</li>
                <li>• Advanced analytics</li>
                <li>• AI-powered study notes</li>
              </ul>
            </div>
            
            <Button 
              onClick={goHome}
              className="w-full"
              size="lg"
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating Premium...
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;