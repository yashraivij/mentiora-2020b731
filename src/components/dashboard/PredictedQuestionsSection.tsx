import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Clock, BookOpen, Target, Sparkles, Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CountdownTimer } from "./CountdownTimer";
import { useSubscription } from "@/hooks/useSubscription";

export const PredictedQuestionsSection = () => {
  const navigate = useNavigate();
  const { isPremium, openPaymentLink } = useSubscription();

  const handleButtonClick = () => {
    if (isPremium) {
      navigate('/predicted-questions');
    } else {
      openPaymentLink();
    }
  };

  return (
    <div className="mb-8">
      {/* Main Premium Feature Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 p-6 shadow-2xl border border-purple-400/20">
        
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            {/* Icon */}
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30">
              <Rocket className="h-12 w-12 text-white" />
            </div>
            
            {/* Title and Description */}
            <div className="space-y-3">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">
                  Predicted 2026 Questions
                </h2>
                <p className="text-white/80 text-lg">
                  Premium exam simulation
                </p>
              </div>
              
              {/* Badges */}
              <div className="flex items-center space-x-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-3 py-1 hover:from-yellow-300 hover:to-orange-300">
                  <Crown className="h-3 w-3 mr-1" />
                  PREMIUM EXCLUSIVE
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Weekly Updates
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Countdown Timer */}
          <div className="hidden md:block">
            <CountdownTimer />
          </div>
        </div>

        {/* Mobile Countdown */}
        <div className="md:hidden mb-6">
          <CountdownTimer />
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">Real Exam Timer</p>
                <p className="text-white/70 text-xs">Authentic pressure simulation</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">AQA Structure</p>
                <p className="text-white/70 text-xs">Exact 2026 format</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">AI Marking</p>
                <p className="text-white/70 text-xs">Instant expert feedback</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Weekly Update Notice */}
        <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-white text-sm">
                Fresh practice papers every week
              </p>
              <p className="text-white/70 text-xs">
                Content aligned with 2026 exam trends
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Button */}
        <Button 
          onClick={handleButtonClick}
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-bold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition-all duration-300 text-lg"
        >
          <Crown className="h-5 w-5 mr-3" />
          {isPremium ? 'Start Premium Exam Practice' : 'Upgrade to Premium'}
          <Sparkles className="h-5 w-5 ml-3" />
        </Button>
      </div>
    </div>
  );
};