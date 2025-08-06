import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { checkSubscription } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        // Wait a moment for payment to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Refresh subscription status
        await checkSubscription();
        
        // Redirect to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('Error checking subscription:', error);
        // Still redirect to dashboard after a delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } finally {
        setIsChecking(false);
      }
    };

    handlePaymentSuccess();
  }, [checkSubscription, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isChecking ? (
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
            ) : (
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-4">
            {isChecking ? 'Processing Payment...' : 'Payment Successful!'}
          </h1>
          
          <p className="text-muted-foreground mb-6">
            {isChecking 
              ? 'We\'re activating your premium account. Please wait...'
              : 'Your premium account is now active! Redirecting to your dashboard...'
            }
          </p>
          
          {!isChecking && (
            <div className="text-sm text-green-600">
              ✨ Premium features unlocked!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;