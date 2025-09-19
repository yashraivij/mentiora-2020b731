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
  const grades = ["A*", "A", "B", "C"];
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
              <span className="text-white/90 font-semibold">Premium students are</span>
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
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Join thousands of students who've transformed their academic performance with Mentiora Premium
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {statsData.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-xl border-white/20 text-center hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">{stat.number}</div>
                <div className="text-white/80">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Premium Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Unlock Your Academic Potential
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="h-full bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl">
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-white/70 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
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

          {/* Unlimited Practice Feature */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="lg:order-2">
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
            
            <div className="lg:order-1 relative">
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

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <Card className="max-w-lg mx-auto bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-green-400/20 rounded-full px-4 py-2 mb-4">
                  <Star className="h-4 w-4 text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">Limited Time Offer</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Start Your Free Trial
                </h3>
                <p className="text-white/80">
                  2 weeks of premium features, completely free. No commitment required.
                </p>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-gradient-to-r from-green-400 to-emerald-400 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 px-6 rounded-2xl text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 mb-4"
              >
                <Flame className="h-5 w-5 mr-2" />
                TRY 2 WEEKS FREE
              </Button>
              
              <button
                onClick={handleNoThanks}
                className="text-white/60 hover:text-white font-medium text-sm transition-all duration-300 hover:underline underline-offset-4"
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