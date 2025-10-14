import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Brain, Target, TrendingUp, Zap, BookOpen, BarChart3, Star, Sparkles, Clock, Trophy, Shield, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const Pricing = () => {
  const navigate = useNavigate();
  const { openPaymentLink } = useSubscription();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const premiumFeatures = [
    {
      icon: Brain,
      title: "Advanced Grade Predictions",
      description: "AI-powered predictions across all subjects",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "Personalized Weak Spot Analysis",
      description: "Target your weakest topics with precision",
      color: "text-primary"
    },
    {
      icon: BookOpen,
      title: "2026 Predicted Exam Papers",
      description: "Practice with predicted questions for upcoming exams",
      color: "text-primary"
    },
    {
      icon: Trophy,
      title: "Smart Revision Notebook",
      description: "Auto-generated notes from your practice",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "Unlimited Practice",
      description: "No hearts, no limits on your learning",
      color: "text-primary"
    },
    {
      icon: Shield,
      title: "Ad-Free Experience",
      description: "Focus on what matters most",
      color: "text-primary"
    }
  ];

  const statsData = [
    { number: "3.7x", label: "More likely to achieve target grades" },
    { number: "89%", label: "Of premium users see grade improvements" },
    { number: "15hrs", label: "Average time saved per month" }
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
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center justify-between px-6 lg:px-8 py-4 max-w-7xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <img src="/src/assets/mentiora-logo.png" alt="Mentiora" className="h-7 w-7" />
            <h1 className="text-lg font-semibold text-foreground">Mentiora</h1>
          </button>
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="px-6 py-16 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-medium border-primary/20 text-primary">
            <Sparkles className="h-3 w-3 mr-1.5" />
            Premium Features
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Achieve Your Target Grades
          </h1>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thousands of students using Mentiora Premium to excel in their GCSEs
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-20"
        >
          {statsData.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">{stat.number}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Pricing Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-md mx-auto mb-24"
        >
          <Card className="border border-border/50 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium">
                  <Star className="h-3 w-3 mr-1" />
                  Limited Time Offer
                </Badge>
                <h3 className="text-xl font-semibold mb-3">Start Your Free Trial</h3>
                <p className="text-sm text-muted-foreground mb-6">Try Premium free for 7 days</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold">£9.99</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cancel anytime</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-8">
                <Button
                  onClick={handleStartTrial}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-5 text-sm"
                  size="lg"
                >
                  Start Free Trial
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleNoThanks}
                  className="w-full text-sm text-muted-foreground hover:text-foreground"
                >
                  Maybe Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Feature Sections */}
        <div className="space-y-32 mb-24">
          {/* Grade Predictions Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-5">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                Advanced Grade Predictions
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Know exactly where you stand with AI-powered predictions that analyze your performance across all subjects and topics in real-time.
              </p>
              <div className="space-y-2.5">
                {[
                  "Real-time grade predictions",
                  "Personalized improvement paths", 
                  "Track progress to target grades",
                  "Identify weak areas early"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="border border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Grade Predictions</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      subject: "Mathematics", 
                      current: 5, 
                      predicted: 8,
                      target: 9,
                      color: "bg-blue-500"
                    },
                    { 
                      subject: "Physics", 
                      current: 4, 
                      predicted: 6,
                      target: 7,
                      color: "bg-purple-500"
                    },
                    { 
                      subject: "Chemistry", 
                      current: 6, 
                      predicted: 8,
                      target: 9,
                      color: "bg-green-500"
                    }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${item.color}`}></div>
                          <span className="text-sm font-medium">{item.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-muted-foreground">Current: {item.current}</span>
                          <TrendingUp className="h-3 w-3 text-primary" />
                          <span className="text-primary font-semibold">Pred: {item.predicted}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-foreground font-semibold">Target: {item.target}</span>
                        </div>
                      </div>
                      <Progress 
                        value={(item.predicted / item.target) * 100} 
                        className="h-1.5"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Predicted 2026 Questions Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="lg:order-2">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-5">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                2026 Predicted Exam Papers
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Practice with AI-predicted exam questions designed to match the 2026 curriculum and exam board specifications.
              </p>
              <div className="space-y-2.5">
                {[
                  "AI-predicted exam questions",
                  "Aligned with 2026 curriculum",
                  "Full exam simulations",
                  "Detailed marking feedback"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:order-1">
              <Card className="border border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold mb-1">2026 Predicted Exam</CardTitle>
                      <CardDescription className="text-xs">Mathematics Paper 1</CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      90 mins
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                    {[
                      { q: "Question 1", text: "Solve the equation 3x + 7 = 22", marks: 2 },
                      { q: "Question 2", text: "Find the area of a circle with radius 5cm", marks: 3 },
                      { q: "Question 3", text: "Expand and simplify (x + 3)(x - 2)", marks: 3 }
                    ].map((item, index) => (
                      <div key={index} className="border-l-2 border-primary pl-3 py-1">
                        <p className="text-xs font-semibold mb-1">{item.q}</p>
                        <p className="text-xs text-muted-foreground mb-1.5">{item.text}</p>
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          {item.marks} marks
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Smart Revision Notebook Feature */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div>
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 mb-5">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight">
                Smart Revision Notebook
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Automatically generate personalized revision notes from your practice sessions, organized by subject and topic.
              </p>
              <div className="space-y-2.5">
                {[
                  "Auto-generated from practice",
                  "Organized by subject & topic",
                  "Highlights weak areas",
                  "Export and share notes"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Card className="border border-border/50 shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">Revision Notes</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { subject: "Mathematics", topic: "Quadratic Equations", color: "border-blue-500", dot: "bg-blue-500", text: "Use the formula ax² + bx + c = 0 where a ≠ 0" },
                    { subject: "Physics", topic: "Newton's Laws", color: "border-purple-500", dot: "bg-purple-500", text: "Force = mass × acceleration (F = ma)" },
                    { subject: "Chemistry", topic: "Periodic Table", color: "border-green-500", dot: "bg-green-500", text: "Elements grouped by similar properties" }
                  ].map((item, index) => (
                    <div key={index} className={`bg-muted/30 rounded-lg p-3 border-l-2 ${item.color}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`}></div>
                        <span className="text-xs font-semibold">{item.subject}</span>
                        <span className="text-xs text-muted-foreground">• {item.topic}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* All Features Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-3 tracking-tight">
              Everything You Need to Excel
            </h3>
            <p className="text-sm text-muted-foreground">
              All premium features included in your subscription
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="border border-border/50 hover:border-border transition-colors">
                <CardContent className="p-6">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-4`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h4 className="text-sm font-semibold mb-2">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          <Card className="max-w-md mx-auto border border-border/50 shadow-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-medium">
                  <Star className="h-3 w-3 mr-1" />
                  Best Value
                </Badge>
                <h3 className="text-xl font-semibold mb-3">Start Your Free Trial</h3>
                <p className="text-sm text-muted-foreground mb-6">Try Premium free for 7 days</p>
                <div className="mb-6">
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-bold">£9.99</span>
                    <span className="text-lg text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Cancel anytime</p>
                </div>
              </div>
              
              <Button
                onClick={handleStartTrial}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-5 text-sm"
                size="lg"
              >
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;