import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, Target, Clock, BookOpen, Zap, Trophy, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";

export const PredictedQuestionsSection = () => {
  const navigate = useNavigate();

  const handleStartPredicted = () => {
    navigate('/predicted-questions');
  };

  return (
    <div className="mb-8 space-y-6">
      {/* Main Premium Feature Card */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-purple-500/20">
        {/* Animated Background Gradients - Enhanced */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-500 via-fuchsia-500 to-pink-500 opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-600 via-purple-600 to-pink-600 opacity-85 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600 via-violet-500 via-purple-500 to-rose-500 opacity-75" />
        
        {/* Enhanced Glow Effects */}
        <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-75 blur-xl" />
        
        {/* Enhanced Floating Elements */}
        <div className="absolute top-4 left-4 animate-bounce">
          <div className="relative">
            <Sparkles className="h-7 w-7 text-yellow-300 drop-shadow-lg" />
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-7 w-7 text-yellow-300 opacity-40" />
            </div>
          </div>
        </div>
        <div className="absolute top-6 right-6 animate-pulse">
          <div className="relative">
            <Crown className="h-9 w-9 text-yellow-400 drop-shadow-xl" />
            <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full" />
          </div>
        </div>
        <div className="absolute bottom-6 left-6 animate-bounce delay-300">
          <div className="relative">
            <Trophy className="h-7 w-7 text-yellow-300 drop-shadow-lg" />
            <div className="absolute inset-0 animate-ping delay-1000">
              <Trophy className="h-7 w-7 text-yellow-300 opacity-40" />
            </div>
          </div>
        </div>
        
        {/* Additional Floating Stars */}
        <div className="absolute top-1/3 right-1/4 animate-pulse delay-700">
          <Star className="h-5 w-5 text-white/60" />
        </div>
        <div className="absolute bottom-1/3 right-1/3 animate-bounce delay-1000">
          <Star className="h-4 w-4 text-white/50" />
        </div>
        <div className="absolute top-1/4 left-1/3 animate-pulse delay-500">
          <Zap className="h-5 w-5 text-cyan-300/70" />
        </div>
        
        <div className="relative backdrop-blur-md bg-white/10 border border-white/30 shadow-2xl shadow-black/20">
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
            
            {/* Premium Features Grid - Enhanced */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-4 hover:bg-gradient-to-br hover:from-white/25 hover:to-white/15 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-400/40 to-cyan-400/40 rounded-xl border border-blue-400/30 group-hover:from-blue-400/60 group-hover:to-cyan-400/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-400/30">
                    <Clock className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base group-hover:text-blue-100 transition-colors">Real Exam Timer</p>
                    <p className="text-white/80 text-sm group-hover:text-white/90 transition-colors">Authentic pressure simulation</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-4 hover:bg-gradient-to-br hover:from-white/25 hover:to-white/15 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-green-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-400/40 to-emerald-400/40 rounded-xl border border-green-400/30 group-hover:from-green-400/60 group-hover:to-emerald-400/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-400/30">
                    <BookOpen className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base group-hover:text-green-100 transition-colors">AQA Structure</p>
                    <p className="text-white/80 text-sm group-hover:text-white/90 transition-colors">Exact 2026 format</p>
                  </div>
                </div>
              </div>
              
              <div className="group bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-4 hover:bg-gradient-to-br hover:from-white/25 hover:to-white/15 hover:border-white/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-400/40 to-pink-400/40 rounded-xl border border-purple-400/30 group-hover:from-purple-400/60 group-hover:to-pink-400/60 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purple-400/30">
                    <Target className="h-6 w-6 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-base group-hover:text-purple-100 transition-colors">AI Marking</p>
                    <p className="text-white/80 text-sm group-hover:text-white/90 transition-colors">Instant expert feedback</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Weekly Update Notice */}
            <div className="group bg-gradient-to-r from-white/20 to-white/10 via-white/15 border border-white/40 rounded-2xl p-5 backdrop-blur-md hover:from-white/30 hover:to-white/20 hover:via-white/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl hover:shadow-yellow-500/20">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-yellow-400/50 to-orange-400/50 rounded-xl border border-yellow-400/40 group-hover:from-yellow-400/70 group-hover:to-orange-400/70 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-yellow-400/40">
                  <Sparkles className="h-6 w-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <p className="font-bold text-white text-base group-hover:text-yellow-100 transition-colors">
                    Fresh practice papers every week
                  </p>
                  <p className="text-white/90 text-sm group-hover:text-white transition-colors">
                    Content aligned with 2026 exam trends & AQA specifications
                  </p>
                </div>
              </div>
            </div>
            
            {/* Enhanced Premium CTA Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-400 via-red-400 to-pink-500 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <Button 
                onClick={handleStartPredicted}
                className="relative w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-black py-5 px-8 rounded-2xl shadow-2xl transform hover:scale-[1.03] transition-all duration-300 text-lg border border-white/20 hover:shadow-yellow-500/50"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Crown className="h-6 w-6 animate-pulse" />
                  <span className="tracking-wide">Start Premium Exam Practice</span>
                  <Sparkles className="h-6 w-6 animate-pulse delay-500" />
                </div>
              </Button>
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
};