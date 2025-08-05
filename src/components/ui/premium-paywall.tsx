import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Brain, Zap, Trophy, Rocket, ChevronRight, Shield, Target, GraduationCap, BookOpen } from "lucide-react";
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
    "🎯 AI creates personalized study notes for YOUR weaknesses",
    "🔮 Get exact exam questions before they're asked",
    "📈 See your predicted grades and improve before it's too late",
    "🎵 Study playlists that boost your focus and memory",
    "⚡ Save 10+ hours per week with smart recommendations"
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
    <div className="w-full max-w-3xl mx-auto">
      {/* Premium Card */}
      <div className="relative">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-30 rounded-2xl blur animate-pulse"></div>
        
        <Card className="relative bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl border border-purple-200/50 dark:border-purple-700/50 shadow-2xl rounded-2xl overflow-hidden">
          {/* Compact Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-4 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/95 via-pink-600/95 to-blue-600/95"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-white mb-1 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                💎 Premium AI Study Experience
              </CardTitle>
              <CardDescription className="text-white/95 text-sm font-medium">
                Save 15+ hours every week • Get better grades faster
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-4">
            {/* Time Savings Highlight */}
            <div className="text-center p-3 mb-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-400/20 dark:to-teal-400/20 rounded-xl border border-emerald-300/50 dark:border-emerald-600/50">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Zap className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Save 15+ Hours Every Week
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-xs font-medium">
                More time for friends & hobbies while improving grades
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              {/* Benefits Column */}
              <div className="md:col-span-2 space-y-3">
                <h4 className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center">
                  ✨ Premium Features Included
                </h4>
                <div className="grid gap-2">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-lg border border-blue-200/50 dark:border-blue-700/30">
                      <div className="flex-shrink-0">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Star className="h-2 w-2 text-white fill-white" />
                        </div>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200 font-medium text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing & CTA Column */}
              <div className="space-y-3">
                {/* Pricing */}
                <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-600/50">
                  <div className="flex items-baseline justify-center space-x-1 mb-1">
                    <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">£14.99</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">/month</span>
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium text-xs">
                    Less than £0.50/day
                  </p>
                </div>

                {/* Offer */}
                <div className="text-center p-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-600/50">
                  <h4 className="text-xs font-bold text-orange-700 dark:text-orange-300 mb-1">
                    🔥 First Month FREE
                  </h4>
                  <p className="text-orange-600 dark:text-orange-400 font-medium text-xs">
                    See results in 2 weeks!
                  </p>
                </div>

                {/* Guarantee */}
                <div className="text-center p-2 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-lg border border-violet-200 dark:border-violet-600/50">
                  <div className="flex items-center justify-center space-x-1 text-violet-600 dark:text-violet-400 text-xs font-semibold">
                    <Shield className="h-3 w-3" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleUpgrade}
              className="w-full h-10 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-bold text-sm rounded-xl shadow-xl hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 group"
            >
              <Rocket className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              🎯 START FREE TRIAL NOW
              <Sparkles className="h-4 w-4 ml-2 group-hover:animate-spin" />
            </Button>
            
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ⚡ Instant access • No commitment required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};