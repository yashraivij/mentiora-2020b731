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
    <div className="w-full max-w-4xl mx-auto">
      {/* Premium Card */}
      <div className="relative">
        {/* Animated rainbow glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-40 rounded-2xl blur animate-pulse"></div>
        
        <Card className="relative bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-pink-50/90 dark:from-violet-900/30 dark:via-purple-900/30 dark:to-pink-900/30 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
          {/* Colorful Header */}
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-6 text-center">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/90 via-purple-600/90 to-pink-600/90"></div>
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                🚀 Unlock Your Academic Superpowers
              </CardTitle>
              <CardDescription className="text-white/95 text-lg font-medium">
                Join 50,000+ students boosting grades by 2+ levels
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Feature highlight */}
                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border-2 border-emerald-200 dark:border-emerald-700/50">
                  <div className="flex justify-center mb-2">
                    <Brain className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                    {feature}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{description}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="font-bold text-lg text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ✨ What You'll Get
                  </h4>
                  <div className="grid gap-2">
                    {benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                            <Zap className="h-2.5 w-2.5 text-white" />
                          </div>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-xs leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* More benefits */}
                <div className="space-y-2">
                  <div className="grid gap-2">
                    {benefits.slice(3).map((benefit, index) => (
                      <div key={index + 3} className="flex items-center space-x-2 p-2 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700/50">
                        <div className="flex-shrink-0">
                          <div className="w-5 h-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                            <Star className="h-2.5 w-2.5 text-white fill-white" />
                          </div>
                        </div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-xs leading-relaxed">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgency */}
                <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-700/50">
                  <div className="flex justify-center mb-1">
                    <Trophy className="h-5 w-5 text-orange-500" />
                  </div>
                  <h4 className="text-sm font-bold text-orange-700 dark:text-orange-300 mb-1">
                    🔥 Limited Time: First Month FREE
                  </h4>
                  <p className="text-orange-600 dark:text-orange-400 font-medium text-xs">
                    See improvements within 2 weeks!
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center py-3 px-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700/50">
                  <div className="flex items-baseline justify-center space-x-1 mb-1">
                    <span className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$7.99</span>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">/month</span>
                  </div>
                  <div className="flex items-center justify-center space-x-1 text-green-700 dark:text-green-300 font-semibold text-xs">
                    <Shield className="h-3 w-3" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button - Full Width */}
            <div className="mt-6 space-y-3">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-12 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-[1.02] transition-all duration-300 group"
              >
                <Rocket className="h-5 w-5 mr-2 group-hover:animate-bounce" />
                🎯 START FREE TRIAL NOW
                <Sparkles className="h-5 w-5 ml-2 group-hover:animate-spin" />
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  ⚡ Instant access • No commitment • Save 10+ hours per week
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};