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
        {/* Multi-layered animated glow effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-40 rounded-3xl blur-lg animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-20 rounded-2xl blur animate-ping"></div>
        
        <Card className="relative bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40 dark:from-gray-900 dark:via-purple-900/30 dark:to-pink-900/30 backdrop-blur-xl border-2 border-transparent bg-clip-padding shadow-2xl rounded-2xl overflow-hidden">
          {/* Dynamic gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl"></div>
          <div className="absolute inset-[2px] bg-gradient-to-br from-white via-purple-50/40 to-pink-50/40 dark:from-gray-900 dark:via-purple-900/30 dark:to-pink-900/30 rounded-[14px]"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
            <div className="absolute top-32 right-16 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-24 left-20 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-500"></div>
            <div className="absolute bottom-40 right-12 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-700"></div>
          </div>
          
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300">
                <Crown className="h-8 w-8 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-black text-white mb-2 bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                ⚡ Premium AI Study Revolution
              </CardTitle>
              <CardDescription className="text-white/95 text-base font-semibold">
                🚀 Save 15+ hours weekly • 📊 Get A+ grades faster
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

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Premium Features Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-1">
                    🌟 Game-Changing Features
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    Transform your study experience with AI superpowers
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {benefits.map((benefit, index) => {
                    const gradients = [
                      "from-purple-500 via-pink-500 to-red-500",
                      "from-blue-500 via-cyan-500 to-teal-500", 
                      "from-green-500 via-emerald-500 to-lime-500",
                      "from-orange-500 via-yellow-500 to-amber-500",
                      "from-indigo-500 via-purple-500 to-pink-500"
                    ];
                    const bgGradients = [
                      "from-purple-50 via-pink-50 to-red-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-red-900/20",
                      "from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20",
                      "from-green-50 via-emerald-50 to-lime-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-lime-900/20",
                      "from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-900/20 dark:via-yellow-900/20 dark:to-amber-900/20",
                      "from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20"
                    ];
                    const borderColors = [
                      "border-purple-300/60 dark:border-purple-600/40",
                      "border-blue-300/60 dark:border-blue-600/40",
                      "border-green-300/60 dark:border-green-600/40",
                      "border-orange-300/60 dark:border-orange-600/40",
                      "border-indigo-300/60 dark:border-indigo-600/40"
                    ];
                    
                    return (
                      <div 
                        key={index} 
                        className={`group flex items-center space-x-3 p-3 bg-gradient-to-r ${bgGradients[index]} rounded-xl border ${borderColors[index]} hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 bg-gradient-to-r ${gradients[index]} rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                            <Star className="h-4 w-4 text-white fill-white group-hover:scale-110 transition-transform duration-300" />
                          </div>
                        </div>
                        <span className="text-gray-800 dark:text-gray-100 font-semibold text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                          {benefit}
                        </span>
                        <div className="ml-auto">
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    );
                  })}
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