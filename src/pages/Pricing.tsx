import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Minus } from "lucide-react";
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

  // Dynamic subject rotation every 4 seconds with smooth scroll
  const subjects = ["Math", "Science", "English", "History", "Physics", "Chemistry", "Biology"];
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [nextSubjectIndex, setNextSubjectIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const userName = user?.email?.split('@')[0] || "Student";

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        const newIndex = (currentSubjectIndex + 1) % subjects.length;
        setCurrentSubjectIndex(newIndex);
        setNextSubjectIndex((newIndex + 1) % subjects.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSubjectIndex, subjects.length]);

  const currentSubject = subjects[currentSubjectIndex];
  const nextSubject = subjects[nextSubjectIndex];

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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Dynamic Header */}
        <div className="text-center mb-8 max-w-lg animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight flex items-center justify-center flex-wrap gap-2">
            <span>Progress faster in your</span>
            <div className="relative overflow-hidden inline-block min-w-[120px]">
              <div 
                className={`transition-transform duration-700 ease-in-out ${
                  isTransitioning ? '-translate-y-full' : 'translate-y-0'
                }`}
              >
                <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent block text-center">
                  {currentSubject}
                </span>
                <span className="bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent block text-center">
                  {nextSubject}
                </span>
              </div>
            </div>
            <span>studies with Super!</span>
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