import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Minus, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const features = [
    { name: "Learning content", free: true, premium: true },
    { name: "Unlimited Hearts", free: false, premium: true },
    { name: "Skills practice", free: false, premium: true },
    { name: "Mistakes review", free: false, premium: true },
    { name: "Free challenge entry", free: false, premium: true },
    { name: "No ads", free: false, premium: true },
  ];

  useEffect(() => {
    setIsLoading(false);
  }, [user?.id]);

  // Dynamic subject rotation every 3 seconds
  const subjects = ["Math", "Science", "English", "History", "Physics", "Chemistry", "Biology"];
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const userName = user?.email?.split('@')[0] || "Student";

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubjectIndex((prev) => (prev + 1) % subjects.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [subjects.length]);

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
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-blue-600 to-purple-700 relative">
      {/* Header with logo and navigation */}
      <header className="absolute top-0 left-0 w-full z-20 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black tracking-tight">MENTIORA</h1>
            <nav className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wide">PROGRESS</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors cursor-pointer">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium uppercase tracking-wide">NOTES</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Dynamic Header */}
        <div className="text-center mb-8 max-w-lg animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
            Progress faster in your
          </h1>
          <div className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight relative h-12 overflow-hidden">
            <div 
              className="absolute inset-0 flex flex-col transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateY(-${currentSubjectIndex * 100}%)`,
              }}
            >
              {subjects.map((subject, index) => (
                <div key={index} className="h-12 flex items-center justify-center">
                  <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                    {subject}
                  </span>
                  <span className="text-white ml-1">studies with Super!</span>
                </div>
              ))}
            </div>
          </div>
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
                <div className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 text-white px-3 py-1.5 rounded-full font-bold text-xs inline-flex items-center shadow-lg">
                  SUPER
                </div>
              </div>
            </div>

            {/* Feature rows */}
            {features.map((feature, index) => (
              <div 
                key={feature.name} 
                className={`grid grid-cols-3 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-200 ${
                  index % 2 === 0 ? 'bg-white/5' : 'bg-transparent'
                }`}
              >
                <div className="p-3 flex items-center">
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
                  <Check className="h-4 w-4 text-green-400 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center space-y-4 w-full max-w-sm animate-fade-in">
          <Button
            onClick={handleStartTrial}
            className="w-full bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white font-bold py-4 px-6 rounded-2xl text-base shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20"
          >
            START MY FREE 14 DAYS
          </Button>
          
          <button
            onClick={handleNoThanks}
            className="text-white/70 hover:text-white font-medium text-sm transition-all duration-300 hover:underline underline-offset-4 tracking-wide"
          >
            NO THANKS
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;