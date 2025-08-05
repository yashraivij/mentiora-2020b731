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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      {/* Premium Modal */}
      <div className="relative w-full max-w-md mx-auto">
        {/* Animated rainbow glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 via-orange-500 to-red-500 opacity-60 rounded-2xl blur animate-pulse"></div>
        
        <Card className="relative bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-pink-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
          {/* Magical Header */}
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 p-6 text-center">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600/80 via-purple-600/80 to-pink-600/80"></div>
              <div className="absolute top-0 left-1/4 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                🚀 Unlock Your Academic Superpowers
              </CardTitle>
              <CardDescription className="text-white/95 text-lg font-medium">
                Join 50,000+ students who boosted their grades by 2+ levels
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Value Proposition */}
            <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-700/50">
              <div className="flex justify-center mb-2">
                <Brain className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                {feature}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">{description}</p>
            </div>

            {/* Benefits with colorful icons */}
            <div className="space-y-3">
              <h4 className="font-bold text-lg text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                ✨ Transform Your Study Game Forever
              </h4>
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-medium text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency + Value */}
            <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-700/50">
              <div className="flex justify-center mb-2">
                <Trophy className="h-6 w-6 text-orange-500" />
              </div>
              <h4 className="text-lg font-bold text-orange-700 dark:text-orange-300 mb-1">
                🔥 Limited Time: Get Your First Month FREE
              </h4>
              <p className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                Start your transformation today - most students see grade improvements within 2 weeks!
              </p>
            </div>

            {/* Pricing */}
            <div className="text-center py-4 px-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700/50">
              <div className="flex items-baseline justify-center space-x-2 mb-1">
                <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$7.99</span>
                <span className="text-gray-600 dark:text-gray-400 text-lg">/month</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300 font-semibold text-sm">
                <Shield className="h-3 w-3" />
                <span>Cancel anytime • Money-back guarantee</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-14 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-lg rounded-xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-[1.02] transition-all duration-300 group"
              >
                <Rocket className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                🎯 START MY FREE MONTH NOW
                <Sparkles className="h-5 w-5 ml-3 group-hover:animate-spin" />
              </Button>
              
              <p className="text-center text-xs text-gray-600 dark:text-gray-400">
                ⚡ Instant access • No commitment • Join thousands of successful students
              </p>
            </div>

            {/* Final value reinforcement */}
            <div className="text-center p-3 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg border border-cyan-200 dark:border-cyan-700/50">
              <p className="text-cyan-800 dark:text-cyan-200 font-semibold text-sm">
                💡 Most students save 10+ hours per week and improve by 2+ grade levels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};