import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  CheckCircle, 
  ArrowRight, 
  Target, 
  Trophy, 
  Brain, 
  TrendingUp,
  Zap,
  Star,
  Clock,
  BarChart3,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Marking",
      description: "Get instant, detailed feedback on your answers just like a real examiner would mark them"
    },
    {
      icon: Target,
      title: "Personalized Study Plans",
      description: "Smart recommendations on what to study next based on your performance and goals"
    },
    {
      icon: BookOpen,
      title: "Smart Revision Notes",
      description: "Automatically generated notes tailored to your learning style and weak areas"
    },
    {
      icon: TrendingUp,
      title: "Grade Predictions",
      description: "See your predicted grades and track your progress towards your target"
    },
    {
      icon: Zap,
      title: "Exam-Style Questions",
      description: "Practice with thousands of real past paper questions across all subjects"
    },
    {
      icon: BarChart3,
      title: "Detailed Analytics",
      description: "Understand your strengths and weaknesses with comprehensive performance insights"
    }
  ];

  const subjects = [
    { name: "Mathematics", icon: "📐" },
    { name: "Biology", icon: "🧬" },
    { name: "Chemistry", icon: "⚗️" },
    { name: "Physics", icon: "⚛️" },
    { name: "English", icon: "📖" },
    { name: "Computer Science", icon: "💻" },
    { name: "History", icon: "📚" },
    { name: "Geography", icon: "🌍" }
  ];

  const stats = [
    { label: "Average Grade Improvement", value: "2.3 Grades", icon: TrendingUp },
    { label: "Study Time Saved", value: "67%", icon: Clock },
    { label: "Student Success Rate", value: "94%", icon: Trophy },
    { label: "Questions Practiced", value: "50K+", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-foreground">Mentiora</span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              Powered by AI
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Your Personal AI Tutor for <span className="text-primary">GCSE & A-Levels</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Practice with real exam questions, get instant AI marking, and track your progress. 
              Everything you need to ace your exams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-12"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/pricing')}
                className="text-lg px-8 h-12"
              >
                View Pricing
              </Button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you achieve your target grades
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              All Your Subjects in One Place
            </h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive coverage for GCSE & A-Level across all exam boards
            </p>
          </div>

          {/* Exam Boards */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board) => (
              <Badge key={board} variant="outline" className="px-6 py-2 text-base font-semibold">
                {board}
              </Badge>
            ))}
          </div>

          {/* Subject Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {subjects.map((subject, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-3">{subject.icon}</div>
                    <div className="font-semibold text-foreground">{subject.name}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              How Mentiora Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose Your Subjects",
                description: "Select your GCSE or A-Level subjects and exam boards"
              },
              {
                step: "2", 
                title: "Practice & Learn",
                description: "Answer exam-style questions and get instant AI feedback"
              },
              {
                step: "3",
                title: "Track Progress",
                description: "Watch your grades improve with personalized insights"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="border-2 h-full">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Students Everywhere
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Sarah M.",
                role: "Year 11 Student",
                content: "Mentiora helped me improve from a grade 5 to a grade 8 in Chemistry. The AI feedback is incredibly detailed and helped me understand exactly where I was going wrong."
              },
              {
                name: "James K.",
                role: "Year 13 Student", 
                content: "The personalized study plans saved me so much time. Instead of guessing what to revise, Mentiora tells me exactly what I need to work on."
              },
              {
                name: "Emma L.",
                role: "Year 10 Student",
                content: "I love how it tracks my progress and shows me my predicted grades. It's really motivating to see how much I've improved over time."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 h-full">
                  <CardContent className="pt-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4">&quot;{testimonial.content}&quot;</p>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Better Than Private Tutoring
            </h2>
            <p className="text-lg text-muted-foreground">
              Get the same quality education at 5% of the cost
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-center">Private Tutoring</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-muted-foreground mb-2">£500</div>
                <div className="text-muted-foreground mb-4">per month</div>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Limited hours per week</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>Fixed schedule</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span>One subject focus</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary shadow-lg">
              <CardHeader>
                <Badge className="w-fit mx-auto mb-2 bg-primary text-primary-foreground">
                  Best Value
                </Badge>
                <CardTitle className="text-center">Mentiora Premium</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">£9.99</div>
                <div className="text-muted-foreground mb-4">per month</div>
                <ul className="text-left space-y-2 text-sm mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Unlimited practice 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">Study anytime, anywhere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">All subjects included</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="font-medium">AI-powered insights</span>
                  </li>
                </ul>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => navigate('/register')}
                >
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-primary max-w-4xl mx-auto">
            <CardContent className="pt-12 pb-12 text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Ace Your Exams?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already improving their grades with Mentiora. 
                Start your free trial today.
              </p>
              <Button 
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 h-12"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 7-day free trial
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-6 h-6 object-contain"
              />
              <span className="font-semibold text-foreground">Mentiora</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Mentiora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;