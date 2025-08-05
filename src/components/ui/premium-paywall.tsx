import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Target, Clock, BookOpen, Zap, Trophy, Rocket, Lock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PremiumPaywallProps {
  feature: string;
  description: string;
  icon?: React.ReactNode;
  benefits?: string[];
}

export const PremiumPaywall = ({ 
  feature, 
  description, 
  icon = <Crown className="h-8 w-8" />,
  benefits = [
    "AI-generated revision notes",
    "Predicted exam questions",
    "Grade predictions & analytics",
    "Weekly content updates"
  ]
}: PremiumPaywallProps) => {
  const { createCheckout } = useAuth();

  const handleUpgrade = async () => {
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    }
  };

  return (
    <div className="relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-500/90 to-red-500/90 rounded-3xl z-10 flex items-center justify-center backdrop-blur-sm">
        <Card className="w-full max-w-md mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-white/50 dark:border-slate-700/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-2xl border border-yellow-400/30 backdrop-blur-sm">
                <Lock className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Premium Feature
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400 text-lg">
              {feature}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <p className="text-center text-slate-700 dark:text-slate-300">
              {description}
            </p>
            
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">{benefit}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-center space-x-2 py-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                PREMIUM ONLY
              </Badge>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 hover:from-purple-700 hover:via-pink-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
            >
              <Crown className="h-5 w-5 mr-3" />
              Upgrade to Premium
              <Sparkles className="h-5 w-5 ml-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Background content (blurred) */}
      <div className="filter blur-sm pointer-events-none">
        {/* This div represents the blurred content behind the paywall */}
        <div className="min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 to-slate-900 rounded-3xl p-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 rounded-2xl flex items-center justify-center">
              {icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">{feature}</h3>
            <p className="text-slate-500 dark:text-slate-500">Premium content available with subscription...</p>
          </div>
        </div>
      </div>
    </div>
  );
};