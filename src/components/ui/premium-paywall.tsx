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
        {/* Animated premium glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 opacity-50 rounded-3xl blur animate-pulse"></div>
        
        <Card className="relative bg-gradient-to-br from-white via-violet-50/30 to-purple-50/30 dark:from-gray-900 dark:via-violet-900/20 dark:to-purple-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Premium Header */}
          <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-8 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/95 via-purple-600/95 to-indigo-600/95"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full shadow-xl">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-black text-white mb-3 bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                ⚡ Supercharge Your Studies
              </CardTitle>
              <CardDescription className="text-white/95 text-xl font-semibold">
                AI-powered tools that guarantee better grades
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-8">
            {/* Time Saved Highlight */}
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-2xl border-2 border-emerald-200 dark:border-emerald-700/50 shadow-lg">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Save 15+ Hours Every Week
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg font-semibold">
                Get personalized study materials instantly instead of spending hours creating them
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Key Benefits */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-4">
                  🎯 What You Get
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">AI creates notes for YOUR weak topics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-l-4 border-purple-500">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">Predict your exact exam questions</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-l-4 border-green-500">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-semibold">See your predicted grades improve</span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="space-y-6">
                {/* Special Offer */}
                <div className="text-center p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-orange-300 dark:border-orange-700/50 shadow-lg">
                  <div className="flex justify-center mb-3">
                    <Trophy className="h-8 w-8 text-orange-500" />
                  </div>
                  <h4 className="text-xl font-black text-orange-700 dark:text-orange-300 mb-2">
                    🔥 First Month FREE
                  </h4>
                  <p className="text-orange-600 dark:text-orange-400 font-semibold">
                    Try it risk-free, see results in 2 weeks
                  </p>
                </div>

                {/* Pricing */}
                <div className="text-center py-6 px-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border-2 border-green-300 dark:border-green-700/50 shadow-lg">
                  <div className="flex items-baseline justify-center space-x-2 mb-2">
                    <span className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">$7.99</span>
                    <span className="text-gray-600 dark:text-gray-400 text-xl font-semibold">/month</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300 font-bold">
                    <Shield className="h-4 w-4" />
                    <span>Cancel anytime • Money-back guarantee</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-16 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-violet-500/25 transform hover:scale-[1.02] transition-all duration-300 group"
                >
                  <Rocket className="h-6 w-6 mr-3 group-hover:animate-bounce" />
                  🚀 START FREE TRIAL
                  <Sparkles className="h-6 w-6 ml-3 group-hover:animate-spin" />
                </Button>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="text-center p-4 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-700/50">
              <p className="text-cyan-800 dark:text-cyan-200 font-bold text-lg">
                💎 Used by ambitious students worldwide • Average grade improvement: 2+ levels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};