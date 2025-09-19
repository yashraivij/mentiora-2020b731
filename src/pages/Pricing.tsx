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
      
      {/* Header with Logo */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/90 hover:text-white transition-colors duration-200"
        >
          <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-12 w-auto" />
        </button>
      </div>
      
      <div className="relative z-10 px-4 py-4 max-w-6xl mx-auto">
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
              <span className="text-green-400">3.7x</span> more likely to achieve{" "}
              <span 
                className={`bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent transition-all duration-300 ease-in-out transform inline-block ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {currentGrade}
              </span>{" "}
              grades!
            </h1>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <Card className="max-w-sm mx-auto bg-white/10 backdrop-blur-xl border-white/20 shadow-lg rounded-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm rounded-full px-3 py-1 mb-4">
                  <Star className="h-3 w-3 text-yellow-400" />
                  <span className="text-yellow-400 font-medium text-xs">Best Deal</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-sans">
                  Pay monthly
                </h3>
                <p className="text-sm text-white/70 mb-2 font-sans">Amount billed today</p>
                <div className="text-4xl font-bold text-white mb-4 font-sans">
                  £7.99<span className="text-lg font-medium text-white/80">/month</span>
                </div>
                <p className="text-white/70 text-sm font-sans">
                  Recurring billing. Cancel any time.
                </p>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-slate-900 font-semibold py-4 px-6 rounded-xl text-base transition-all duration-300 mb-3 border-0"
              >
                Get Mentiora Premium
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Showcase Sections */}
        <div className="space-y-20 mb-16">
          {/* Grade Predictions Feature */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Get accurate grade predictions with AI
              </h3>
              <p className="text-xl text-white/80 mb-6">
                Know exactly where you stand and what you need to improve with our advanced AI analytics that track your progress across all subjects.
              </p>
              <div className="space-y-4">
                {[
                  "Real-time grade predictions for all subjects",
                  "Personalized improvement recommendations", 
                  "Track progress towards your target grades",
                  "Identify weak areas before it's too late"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-400" />
                    Grade Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        subject: "Mathematics", 
                        current: "B", 
                        predicted: "A", 
                        iconColor: "text-green-400" 
                      },
                      { 
                        subject: "Physics", 
                        current: "C", 
                        predicted: "B", 
                        iconColor: "text-blue-400" 
                      },
                      { 
                        subject: "Chemistry", 
                        current: "B", 
                        predicted: "A*", 
                        iconColor: "text-purple-400" 
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white font-medium">{item.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70">Current: {item.current}</span>
                          <TrendingUp className={`h-4 w-4 ${item.iconColor}`} />
                          <span className="text-green-400 font-bold">Pred: {item.predicted}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Predicted 2026 Questions Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="lg:order-2">
              <h3 className="text-3xl font-bold text-white mb-6">
                Get predicted 2026 exam questions
              </h3>
              <p className="text-xl text-white/80 mb-6">
                Stay ahead of the curve with AI-generated questions that mirror the style and content of upcoming 2026 exams across all subjects.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered question predictions for 2026 exams",
                  "Subject-specific content aligned with new curriculum",
                  "Practice with the latest question formats",
                  "Stay prepared for exam board changes"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-400 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:order-1 relative">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-400" />
                    Predicted 2026 Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        subject: "Mathematics", 
                        topic: "Integration by Parts", 
                        status: "High Priority",
                        iconColor: "text-red-400" 
                      },
                      { 
                        subject: "Physics", 
                        topic: "Quantum Mechanics", 
                        status: "Likely Topic",
                        iconColor: "text-yellow-400" 
                      },
                      { 
                        subject: "Chemistry", 
                        topic: "Organic Synthesis", 
                        status: "Expected",
                        iconColor: "text-green-400" 
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white font-medium">{item.subject}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70">{item.topic}</span>
                          <Zap className={`h-4 w-4 ${item.iconColor}`} />
                          <span className={`font-bold ${item.iconColor}`}>{item.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Unlimited Practice Feature */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                Practice without limits
              </h3>
              <p className="text-xl text-white/80 mb-6">
                No more hearts, no more waiting. Practice as much as you want, whenever you want. The only limit is your ambition.
              </p>
              <div className="space-y-4">
                {[
                  "Unlimited practice sessions across all subjects",
                  "No daily limits or cooldown periods",
                  "Access to premium question banks",
                  "Instant feedback and explanations"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-2">Unlimited Hearts</h4>
                  <p className="text-white/70 mb-4">Practice as much as you want!</p>
                  <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Heart key={i} className="h-6 w-6 text-pink-400 fill-current" />
                    ))}
                    <span className="text-white/90 ml-2">∞</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;