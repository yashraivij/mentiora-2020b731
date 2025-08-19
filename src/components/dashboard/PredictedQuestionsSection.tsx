import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Target, Clock, BookOpen, Zap, Trophy, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const PredictedQuestionsSection = () => {
  const navigate = useNavigate();
  const { subscribed, createCheckout } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleStartPredicted = () => {
    if (!subscribed) {
      setShowPremiumModal(true);
      return;
    }
    navigate('/predicted-questions');
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Main Premium Feature Card */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-80 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600 via-purple-500 to-pink-500 opacity-70" />
        
        {/* Floating Sparkles */}
        <div className="absolute top-4 left-4 animate-bounce">
          <Sparkles className="h-6 w-6 text-yellow-300" />
        </div>
        <div className="absolute top-8 right-8 animate-pulse">
          <Crown className="h-8 w-8 text-yellow-400" />
        </div>
        <div className="absolute bottom-8 left-8 animate-bounce delay-300">
          <Trophy className="h-6 w-6 text-yellow-300" />
        </div>
        
        <div className="relative backdrop-blur-sm bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="pb-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-2xl border border-yellow-400/30 backdrop-blur-sm">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-white mb-2">
                      Predicted 2026 Questions
                    </CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      Premium exam simulation
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
                    <Crown className="h-3 w-3 mr-1" />
                    PREMIUM EXCLUSIVE
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    <Zap className="h-3 w-3 mr-1" />
                    Weekly Updates
                  </Badge>
                </div>
              </div>
              
              {/* Compact Countdown Timer */}
              <div className="hidden md:block">
                <CountdownTimer />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Mobile Countdown */}
            <div className="md:hidden">
              <CountdownTimer />
            </div>
            
            {/* Premium Features Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-xl">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Real Exam Timer</p>
                    <p className="text-white/80 text-xs">Authentic pressure simulation</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-green-400/30 to-emerald-400/30 rounded-xl">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">All Exam Boards</p>
                    <p className="text-white/80 text-xs">Exact 2026 format</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-xl">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Smart Marking</p>
                    <p className="text-white/80 text-xs">Instant expert feedback</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weekly Update Notice */}
            <div className="bg-gradient-to-r from-white/15 to-white/10 border border-white/30 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    Fresh practice papers every week
                  </p>
                  <p className="text-white/90 text-xs">
                    Content aligned with 2026 exam trends
                  </p>
                </div>
              </div>
            </div>
            
            {/* Premium CTA Button */}
            <Button 
              onClick={handleStartPredicted}
              className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-300 text-lg"
            >
              <Rocket className="h-5 w-5 mr-3" />
              Start Exam Practice
              <Sparkles className="h-5 w-5 ml-3" />
            </Button>
          </CardContent>
        </div>
      </div>

      {/* Premium Modal */}
      <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
        <DialogContent className="max-w-2xl bg-gradient-to-br from-purple-50/95 via-blue-50/95 to-emerald-50/95 dark:from-purple-900/95 dark:via-blue-900/95 dark:to-emerald-900/95 backdrop-blur-xl border-2 border-purple-200/60 dark:border-purple-700/40">
          <DialogHeader>
            <div className="relative p-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 rounded-2xl border border-purple-200/50 dark:border-purple-700/40 overflow-hidden">
              {/* Premium background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-emerald-500/5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-purple-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-full blur-xl" />
              
              {/* Floating sparkle elements */}
              <div className="absolute top-4 right-12 w-1 h-1 bg-amber-400 rounded-full animate-ping" />
              <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
              <div className="absolute bottom-6 left-8 w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-1000" />
              
              <div className="relative flex flex-col items-center text-center space-y-6">
                {/* Premium icon with effects */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/25 animate-pulse">
                    <Rocket className="h-10 w-10 text-white drop-shadow-lg" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-4 border-background animate-bounce shadow-lg">
                    <Sparkles className="h-4 w-4 text-white m-auto mt-1" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-2 border-background animate-pulse shadow-md">
                    <Crown className="h-3 w-3 text-white m-auto mt-1" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    ✨ Unlock Premium 2026 Exam Practice
                  </DialogTitle>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
                    Get access to AI-powered exam simulations with detailed insights and real exam timing
                  </p>
                </div>
                
                {/* Premium benefits grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Full-length predicted papers</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Real exam timing & pressure</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">AI-powered smart marking</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-700" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Weekly updated questions</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-1000" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Detailed performance insights</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-white/10 rounded-xl">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-1200" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Grade predictions & trends</span>
                  </div>
                </div>
                
                {/* Premium upgrade button */}
                <div className="flex flex-col items-center space-y-3 pt-4">
                  <Button 
                    onClick={() => {
                      setShowPremiumModal(false);
                      createCheckout();
                    }}
                    className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:from-purple-700 hover:via-blue-700 hover:to-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 hover:border-white/30"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <Crown className="h-5 w-5" />
                      <span>Upgrade to Premium</span>
                      <Sparkles className="h-4 w-4 animate-spin" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-xl" />
                  </Button>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>Instant access to all premium features</span>
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};