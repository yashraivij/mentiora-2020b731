import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Target, Clock, BookOpen, Zap, Trophy, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";
import { supabase } from "@/integrations/supabase/client";
import { usePremium } from "@/hooks/usePremium";

export const PredictedQuestionsSection = () => {
  const navigate = useNavigate();
  const { isPremium } = usePremium();

  const handleStartPredicted = async () => {
    if (isPremium) {
      navigate('/predicted-questions');
    } else {
      // Create Stripe checkout for non-premium users
      try {
        const { data, error } = await supabase.functions.invoke('create-subscription');
        
        if (error) {
          console.error('Error creating subscription:', error);
          return;
        }
        
        if (data?.url) {
          window.location.href = data.url; // Redirect to Stripe checkout
        }
      } catch (error) {
        console.error('Error creating subscription:', error);
      }
    }
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
              <Crown className="h-5 w-5 mr-3" />
              Start Premium Exam Practice
              <Sparkles className="h-5 w-5 ml-3" />
            </Button>
          </CardContent>
        </div>
      </div>
    </div>
  );
};