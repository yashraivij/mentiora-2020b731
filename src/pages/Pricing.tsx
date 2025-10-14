import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      title: "Advanced Grade Predictions",
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-8 w-8" />
              <h1 className="text-xl font-bold text-foreground">Mentiora</h1>
            </button>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-sm">Premium Features</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students achieving their target grades with Mentiora Premium
          </p>
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-16"
        >
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-4">
                  <Star className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium text-xs">Limited Time Offer</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Start Your Free Trial</h3>
                <p className="text-muted-foreground text-sm mb-4">First 7 days absolutely free</p>
                <div className="text-5xl font-bold mb-2">
                  £9.99<span className="text-xl font-medium text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">Cancel anytime, no commitment</p>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base mb-3"
                size="lg"
              >
                Get Free Trial
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleNoThanks}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Maybe Later
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Showcase Sections */}
        <div className="space-y-24 mb-16">
          {/* Grade Predictions Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Advanced Grade Predictions
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Know exactly where you stand with AI-powered predictions that track your progress across all subjects in real-time.
              </p>
              <div className="space-y-3">
                {[
                  "Real-time grade predictions for all subjects",
                  "Personalized improvement recommendations", 
                  "Track progress towards target grades",
                  "Identify weak areas before exams"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="border border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Grade Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { 
                        subject: "Mathematics", 
                        current: "B", 
                        predicted: "A",
                        color: "bg-blue-500"
                      },
                      { 
                        subject: "Physics", 
                        current: "C", 
                        predicted: "B",
                        color: "bg-purple-500"
                      },
                      { 
                        subject: "Chemistry", 
                        current: "B", 
                        predicted: "A*",
                        color: "bg-green-500"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.subject}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground text-sm">Current: {item.current}</span>
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="text-primary font-bold text-sm">Pred: {item.predicted}</span>
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
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div className="lg:order-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                2026 Predicted Exam Papers
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Practice with exam-style questions predicted for 2026, designed to match the latest curriculum and exam board requirements.
              </p>
              <div className="space-y-3">
                {[
                  "AI-predicted questions for 2026 exams",
                  "Aligned with latest curriculum changes",
                  "Full exam paper simulations",
                  "Detailed marking and feedback"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:order-1">
              <Card className="border border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-5 w-5 text-primary" />
                    2026 Predicted Exam Paper
                  </CardTitle>
                  <CardDescription className="text-xs">Mathematics Paper 1 - Sample</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="text-center mb-4 pb-3 border-b border-border">
                      <p className="text-xs text-muted-foreground">Time: 1 hour 30 minutes</p>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="border-l-2 border-primary pl-3">
                        <p className="font-medium mb-1">Question 1.</p>
                        <p className="text-muted-foreground mb-1">Solve the equation 3x + 7 = 22</p>
                        <span className="text-primary text-xs font-medium">[2 marks]</span>
                      </div>
                      
                      <div className="border-l-2 border-primary pl-3">
                        <p className="font-medium mb-1">Question 2.</p>
                        <p className="text-muted-foreground mb-1">Find the area of a circle with radius 5cm.</p>
                        <span className="text-primary text-xs font-medium">[3 marks]</span>
                      </div>
                      
                      <div className="border-l-2 border-primary pl-3">
                        <p className="font-medium mb-1">Question 3.</p>
                        <p className="text-muted-foreground mb-1">Expand and simplify (x + 3)(x - 2)</p>
                        <span className="text-primary text-xs font-medium">[3 marks]</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Smart Revision Notebook Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Smart Revision Notebook
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Automatically generate personalized revision notes from your practice sessions, highlighting key concepts and areas for improvement.
              </p>
              <div className="space-y-3">
                {[
                  "Auto-generated notes from practice",
                  "Organized by subject and topic",
                  "Highlights weak areas and key concepts",
                  "Export and share your notes"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="border border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-bold text-center mb-4">Revision Notebook</h4>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium text-sm">Mathematics</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Quadratic equations: Use the formula ax² + bx + c = 0 where a ≠ 0</p>
                    </div>
                    
                    <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-purple-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="font-medium text-sm">Physics</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Newton's Second Law: Force = mass × acceleration (F = ma)</p>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium text-sm">Chemistry</span>
                      </div>
                      <p className="text-muted-foreground text-xs">Periodic Table: Elements grouped by similar properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Final CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl font-bold mb-6">
            Everything You Need to Excel
          </h3>
          <div className="max-w-2xl mx-auto space-y-3 mb-8">
            {[
              "Unlimited practice sessions - no hearts system",
              "Advanced grade predictions and analytics", 
              "2026 predicted exam papers and questions",
              "Smart revision notebook with AI-generated notes",
              "Personalized weak spot analysis",
              "Ad-free learning experience"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 justify-center">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-foreground">{item}</span>
              </div>
            ))}
          </div>
          
          <Card className="max-w-md mx-auto border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1 mb-4">
                  <Star className="h-3 w-3 text-primary" />
                  <span className="text-primary font-medium text-xs">Best Value</span>
                </div>
                <h3 className="text-2xl font-bold mb-2">Start Your Free Trial</h3>
                <p className="text-sm text-muted-foreground mb-3">First 7 days absolutely free</p>
                <div className="text-5xl font-bold mb-2">
                  £9.99<span className="text-xl font-medium text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">Cancel anytime, no commitment</p>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base"
                size="lg"
              >
                Get Free Trial
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8"
        >
          {statsData.map((stat, index) => (
            <Card key={index} className="text-center border border-border">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;