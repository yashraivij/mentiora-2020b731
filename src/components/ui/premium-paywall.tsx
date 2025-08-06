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
    "🔮 Predicted 2026 questions for your exact exam board",
    "📓 Smart notebook auto-saves key revision points",
    "📊 Grade predictions updated with every quiz you take",
    "🎯 Targeted revision based on your weak topics"
  ]
}: PremiumPaywallProps) => {
  const { createCheckout } = useAuth();

  const handleUpgrade = async () => {
    try {
      console.log('Starting checkout process...');
      const checkoutUrl = await createCheckout();
      console.log('Checkout URL received:', checkoutUrl);
      
      if (checkoutUrl) {
        console.log('Redirecting to:', checkoutUrl);
        window.location.href = checkoutUrl;
      } else {
        console.error('No checkout URL received');
        toast("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast("Failed to create checkout session. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Premium Card */}
      <div className="relative">
        {/* Multi-layered premium dynamic glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 opacity-40 rounded-3xl blur-2xl animate-pulse"></div>
        <div className="absolute -inset-3 bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 opacity-30 rounded-3xl blur-xl animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 opacity-20 rounded-2xl blur-lg animate-[pulse_2s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-sky-200 via-blue-200 to-indigo-200 opacity-15 rounded-xl blur animate-[pulse_4s_ease-in-out_infinite]"></div>
        
        <Card className="relative bg-white dark:bg-gray-900 border-2 border-transparent bg-clip-padding shadow-2xl rounded-2xl overflow-hidden">
          {/* Dynamic gradient border with rotation */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-2xl shadow-lg animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-[2px] bg-white dark:bg-gray-900 rounded-[14px]"></div>
          
          
          {/* Premium Header */}
          <div className="relative bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 p-4 text-center overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-3 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full shadow-xl transform hover:scale-110 transition-transform duration-300">
                <Crown className="h-8 w-8 text-white animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-black text-white mb-2 bg-gradient-to-r from-yellow-200 via-white to-pink-200 bg-clip-text text-transparent drop-shadow-lg">
                ⚡ EduClara Premium: Smarter, Faster Results
              </CardTitle>
              <CardDescription className="text-white/95 text-base font-semibold">
                🚀 Save 15+ hours weekly • 📊 Reach your target grade faster
              </CardDescription>
            </div>
          </div>

          <CardContent className="relative z-20 p-4">
            {/* Time Savings Highlight */}
            <div className="text-center p-3 mb-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-xl border border-emerald-300/50 dark:border-emerald-600/50">
              <div className="flex items-center justify-center space-x-2 mb-1">
                <Target className="h-5 w-5 text-emerald-600" />
                <h3 className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Learn Exactly What You Need
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Get straight to the answers examiners want
              </p>
            </div>

            <div className="max-w-2xl mx-auto mb-3">
              <div className="grid gap-3">
                {benefits.map((benefit, index) => {
                  // Custom gradients for each emoji
                  const emojiGradients = [
                    "from-purple-500 via-violet-500 to-indigo-500", // 🔮 crystal ball - mystical purple
                    "from-orange-500 via-amber-500 to-yellow-500", // 📓 notebook - warm orange/brown
                    "from-blue-500 via-cyan-500 to-teal-500", // 📊 chart - data blue
                    "from-red-500 via-pink-500 to-rose-500" // 🎯 target - red/pink
                  ];
                  const bgGradients = [
                    "from-purple-50 via-violet-50 to-indigo-50 dark:from-purple-900/20 dark:via-violet-900/20 dark:to-indigo-900/20",
                    "from-orange-50 via-amber-50 to-yellow-50 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20",
                    "from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20",
                    "from-red-50 via-pink-50 to-rose-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-rose-900/20"
                  ];
                  const borderColors = [
                    "border-purple-300/60 dark:border-purple-600/40",
                    "border-orange-300/60 dark:border-orange-600/40",
                    "border-blue-300/60 dark:border-blue-600/40",
                    "border-red-300/60 dark:border-red-600/40"
                  ];
                  
                  // Extract emoji and remove it from text
                  const emoji = benefit.split(' ')[0];
                  const textWithoutEmoji = benefit.split(' ').slice(1).join(' ');
                  
                  return (
                    <div 
                      key={index} 
                      className={`group flex items-center space-x-3 p-3 bg-gradient-to-r ${bgGradients[index]} rounded-xl border ${borderColors[index]} hover:scale-105 transition-all duration-300 hover:shadow-lg`}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 bg-gradient-to-r ${emojiGradients[index]} rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                          <span className="text-sm group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                        </div>
                      </div>
                      <span className="text-gray-800 dark:text-gray-100 font-semibold text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                        {textWithoutEmoji}
                      </span>
                      <div className="ml-auto">
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <Button 
              onClick={handleUpgrade}
              className="w-full h-10 bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 hover:from-sky-500 hover:via-blue-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl hover:shadow-blue-500/25 transform hover:scale-[1.02] transition-all duration-300 group"
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