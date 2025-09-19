import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Minus, Sparkles, Zap, Heart, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const features = [
    { name: "Learning content", free: true, premium: true, icon: Target },
    { name: "Unlimited Hearts", free: false, premium: true, icon: Heart },
    { name: "Skills practice", free: false, premium: true, icon: Zap },
    { name: "Mistakes review", free: false, premium: true, icon: Sparkles },
    { name: "Free challenge entry", free: false, premium: true, icon: Target },
    { name: "No ads", free: false, premium: true, icon: Sparkles },
  ];

  useEffect(() => {
    // Dynamic content - no database query needed
    setIsLoading(false);
  }, [user?.id]);

  // Dynamic subject based on common study subjects
  const subjects = ["Math", "Science", "English", "History", "Physics", "Chemistry", "Biology"];
  const primarySubject = subjects[Math.floor(Math.random() * subjects.length)];
  const userName = user?.email?.split('@')[0] || "Student";

  const handleStartTrial = () => {
    openPaymentLink();
  };

  const handleNoThanks = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700 flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-72 h-72 bg-white/5 rounded-full -top-36 -left-36 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-white/3 rounded-full -bottom-48 -right-48 animate-pulse"></div>
        <div className="absolute w-24 h-24 bg-cyan-400/20 rounded-full top-1/4 right-1/3 animate-bounce"></div>
        <div className="absolute w-16 h-16 bg-green-400/20 rounded-full top-3/4 left-1/4 animate-bounce" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Super badge */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white px-3 py-1.5 rounded-full font-bold text-xs shadow-lg animate-pulse">
          <Sparkles className="inline w-3 h-3 mr-1" />
          SUPER
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Dynamic Header */}
        <div className="text-center mb-8 max-w-lg animate-fade-in">
          <div className="mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 mx-auto animate-bounce" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            Progress faster in your
          </h1>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
              {primarySubject}
            </span> studies with Super!
          </h1>
          <p className="text-white/80 text-sm mt-2">
            Welcome back, {userName}! Ready to supercharge your learning?
          </p>
        </div>

        {/* Premium comparison card */}
        <Card className="w-full max-w-md bg-white/15 border border-white/30 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden transform hover:scale-105 transition-all duration-300 animate-scale-in">
          <CardContent className="p-0">
            {/* Header row */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm">
              <div className="p-4"></div>
              <div className="p-4 text-center border-x border-white/20">
                <h3 className="text-white/90 text-base font-semibold tracking-wide">FREE</h3>
              </div>
              <div className="p-4 text-center">
                <div className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 text-white px-3 py-1.5 rounded-full font-bold text-xs inline-flex items-center shadow-lg animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  SUPER
                </div>
              </div>
            </div>

            {/* Feature rows with enhanced styling */}
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={feature.name} 
                  className={`grid grid-cols-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-200 ${
                    index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3 flex items-center space-x-2">
                    <IconComponent className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                    <span className="text-white text-sm font-medium tracking-wide">{feature.name}</span>
                  </div>
                  <div className="p-3 flex items-center justify-center border-x border-white/10">
                    {feature.free ? (
                      <Check className="h-4 w-4 text-green-400 drop-shadow-lg" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-center">
                    <Check className="h-4 w-4 text-green-400 drop-shadow-lg animate-pulse" />
                  </div>
                </div>
              );
            })}
            
            {/* Premium highlight footer */}
            <div className="bg-gradient-to-r from-green-400/10 to-cyan-400/10 p-3 text-center">
              <div className="flex items-center justify-center space-x-2 text-white/90 text-xs font-medium">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Unlock your full potential</span>
                <Zap className="w-3 h-3 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced CTA Buttons */}
        <div className="mt-8 flex flex-col items-center space-y-4 w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={handleStartTrial}
            className="group w-full bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white font-bold py-4 px-6 rounded-2xl text-base shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20"
          >
            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-spin" />
            START MY FREE 14 DAYS
            <Sparkles className="w-4 h-4 ml-2 group-hover:animate-spin" />
          </Button>
          
          <button
            onClick={handleNoThanks}
            className="text-white/70 hover:text-white font-medium text-sm transition-all duration-300 hover:underline underline-offset-4 tracking-wide"
          >
            NO THANKS
          </button>
          
          {/* Trust indicators */}
          <div className="mt-4 text-center text-white/60 text-xs max-w-xs">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <div className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-400" />
                <span>No commitment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
            <p className="leading-relaxed">
              Join thousands of students accelerating their learning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;