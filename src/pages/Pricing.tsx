import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Minus, Brain, Target, TrendingUp, Zap, Heart, Shield, Star, Sparkles, Trophy, BookOpen, Clock, BarChart3, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const premiumFeatures = [
    {
      icon: Heart,
      title: "Unlimited Practice Sessions",
      description: "Study without limits - no hearts to worry about!",
      color: "from-pink-400 to-rose-400"
    },
    {
      icon: Brain,
      title: "AI-Powered Grade Predictions",
      description: "Know exactly where you stand with advanced analytics",
      color: "from-purple-400 to-indigo-400"
    },
    {
      icon: Target,
      title: "Personalized Weak Spot Analysis",
      description: "Target your revision with precision-guided learning",
      color: "from-blue-400 to-cyan-400"
    },
    {
      icon: TrendingUp,
      title: "Advanced Progress Tracking",
      description: "Detailed insights into your academic journey",
      color: "from-green-400 to-emerald-400"
    },
    {
      icon: Zap,
      title: "Priority Question Generation",
      description: "Get the most relevant questions for your exams",
      color: "from-yellow-400 to-orange-400"
    },
    {
      icon: Shield,
      title: "Ad-Free Learning Experience",
      description: "Focus on what matters - zero distractions",
      color: "from-teal-400 to-cyan-400"
    }
  ];

  const statsData = [
    { number: "3.7x", label: "more likely to achieve target grades" },
    { number: "89%", label: "of premium users see grade improvements" },
    { number: "2.5x", label: "faster exam preparation" }
  ];

  useEffect(() => {
    setIsLoading(false);
  }, [user?.id]);

  // Dynamic grade animation
  const grades = ["7", "8", "9"];
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const userName = user?.email?.split('@')[0] || "Student";

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentGradeIndex((prev) => (prev + 1) % grades.length);
        setTimeout(() => setIsAnimating(false), 50);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [grades.length]);

  const currentGrade = grades[currentGradeIndex];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
      </div>
      
      <div className="relative z-10 px-4 py-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              <span className="text-white/90 font-semibold">Mentiora Premium</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              <span className="text-green-400">3.7x</span> more likely to achieve grade{" "}
              <span 
                className={`bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent transition-all duration-300 ease-in-out transform inline-block ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {currentGrade}
              </span>
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands of students who've transformed their academic performance
            </p>
          </div>
        </motion.div>

        {/* Single Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden relative">
            {/* Best Deal Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                Best deal
              </div>
            </div>
            
            <CardContent className="p-8 pt-12 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Try 2 weeks free</h3>
              <p className="text-gray-600 mb-6">Then £4.99/month, cancel anytime</p>
              
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">£4.99</div>
                <div className="text-gray-600">/month</div>
                <p className="text-sm text-gray-500 mt-2">Recurring billing. Cancel any time.</p>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-300 mb-4"
              >
                Get Mentiora Premium
              </Button>
              
              <button
                onClick={handleNoThanks}
                className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-all duration-300 hover:underline underline-offset-4"
              >
                Maybe later
              </button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;