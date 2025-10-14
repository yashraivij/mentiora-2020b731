import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Brain, TrendingUp, Calendar, Target, Sparkles, ChevronDown, ChevronUp, ArrowRight, BarChart3, Clock, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  // Check for password reset tokens in URL hash and redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);
  
  // Animation refs
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const dashboardRef = useRef(null);
  const comparisonRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const finalCtaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-50px" });
  const dashboardInView = useInView(dashboardRef, { once: true, margin: "-50px" });
  const comparisonInView = useInView(comparisonRef, { once: true, margin: "-50px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-50px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-50px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-50px" });
  const finalCtaInView = useInView(finalCtaRef, { once: true, margin: "-50px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const faqs = [
    {
      question: "Is Mentiora specific to my exam board?",
      answer: "Yes — all content is tailored to AQA, Edexcel, and OCR exam boards, ensuring you practice with questions that match your exact specification."
    },
    {
      question: "How are grades predicted?",
      answer: "Your grades update dynamically after each quiz, using AI to track improvement patterns across subjects and predict your likely exam performance."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel or switch plans anytime in your dashboard with no questions asked."
    },
    {
      question: "Does Mentiora cover all subjects?",
      answer: "Yes — from Maths and English to Biology, Chemistry, Physics, Psychology, and more. All GCSE and A-Level subjects are included."
    },
    {
      question: "What makes Mentiora unique?",
      answer: "It's the only platform combining real exam-style practice, AI personalisation, and live predicted-grade analytics in one intelligent dashboard."
    },
    {
      question: "Do I need a credit card for the free trial?",
      answer: "No credit card required. Start practicing immediately and upgrade whenever you're ready."
    }
  ];

  return (
    <div className="min-h-screen bg-background light overflow-x-hidden">
      {/* Header - Glass effect */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 lg:px-8 py-5">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-9 h-9 object-contain"
              />
              <span className="text-xl font-semibold text-foreground tracking-tight">Mentiora</span>
            </motion.div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
              {user ? (
                <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Dashboard</a>
              ) : null}
              <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">FAQ</a>
              {!user && (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium"
                >
                  Login
                </Button>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                >
                  {user ? "Go to Dashboard" : "Start Free Trial"}
                </Button>
              </motion.div>
            </nav>

            {/* Mobile menu */}
            <div className="md:hidden flex items-center gap-2">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')}
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/login')}
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/register')}
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Start Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Premium gradient background */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-primary/5 pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              The GCSE and A-Level<br />tutor built for{" "}
              <span className="text-primary relative inline-block">
                you
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -z-10 rounded-full"
                  initial={{ width: 0 }}
                  animate={heroInView ? { width: "100%" } : { width: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
              .
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Mentiora personalises your revision — tracking progress, predicting grades, and guiding you with data-driven precision.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-2xl hover:shadow-primary/40 px-10 py-7 text-lg font-semibold rounded-2xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="px-10 py-7 text-lg font-semibold rounded-2xl border-2 hover:bg-muted/50 hover:shadow-lg transition-all duration-300"
                >
                  Explore Dashboard
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-sm text-muted-foreground/80 font-light"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Trusted by students across the UK preparing for 2026 exams.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Three Feature Cards Section */}
      <section ref={featuresRef} className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Your personal tutor —<br />reimagined for modern learning.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Everything you'd expect from a private tutor, made smarter and more affordable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Brain,
                title: "Smart Revision Notebook",
                description: "Mentiora builds your study plan around weak topics, updating after every quiz or session.",
                gradient: "from-blue-500/10 to-cyan-500/10"
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "See real-time grade predictions that evolve as your performance improves.",
                gradient: "from-primary/10 to-blue-500/10"
              },
              {
                icon: Calendar,
                title: "Weekly Insights",
                description: "Understand your retention, study patterns, and best times to learn.",
                gradient: "from-cyan-500/10 to-primary/10"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className={`border-border/50 bg-gradient-to-br ${feature.gradient} hover:shadow-2xl transition-all duration-500 h-full rounded-3xl overflow-hidden group`}>
                  <CardHeader className="pb-4">
                    <motion.div 
                      className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                    >
                      <feature.icon className="w-7 h-7 text-primary" />
                    </motion.div>
                    <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground leading-relaxed text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Visual Section */}
      <section ref={dashboardRef} className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Mockup */}
            <motion.div
              initial="hidden"
              animate={dashboardInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
              >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-3xl blur-2xl opacity-50" />
                
                <div className="relative bg-card border border-border/50 rounded-3xl p-8 shadow-2xl">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-foreground">Your Dashboard</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                        <span className="w-2 h-2 bg-primary rounded-full inline-block mr-2 animate-pulse" />
                        Live
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div 
                        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 border border-primary/10"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-xs text-muted-foreground mb-2 font-medium">Predicted Grade</p>
                        <p className="text-3xl font-bold text-primary">Grade 8</p>
                        <p className="text-xs text-primary/70 mt-1">↑ from Grade 7</p>
                      </motion.div>
                      <motion.div 
                        className="bg-muted/50 rounded-2xl p-5 border border-border/50"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-xs text-muted-foreground mb-2 font-medium">This Week</p>
                        <p className="text-3xl font-bold text-foreground">5h 20m</p>
                        <p className="text-xs text-muted-foreground mt-1">+2h from last week</p>
                      </motion.div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Retention Rate</span>
                        <span className="font-bold text-foreground">74%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
                        <motion.div 
                          className="bg-gradient-to-r from-primary to-blue-500 h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={dashboardInView ? { width: '74%' } : { width: 0 }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-2xl p-5 border border-primary/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-primary" />
                        </div>
                        <p className="text-sm font-semibold text-foreground">Study Peak</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Your best learning time is 7–9 pm</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial="hidden"
              animate={dashboardInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
                Built around<br />how you learn.
              </h2>
              <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-light">
                Your dashboard tracks subjects, predicted grades, and weak areas — dynamically adapting to your performance. It's your own intelligent revision coach.
              </p>
              <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.3 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl px-8 py-6 text-base font-semibold border-2 hover:bg-muted/50 hover:shadow-lg transition-all"
                >
                  See How It Works
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Graph Comparison Section */}
      <section id="comparison" ref={comparisonRef} className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={comparisonInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Personalised tutoring — at a<br />fraction of the cost.
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Smarter, faster, and 95% cheaper than private tutoring.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Graph Card */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-border/50 bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                <h3 className="text-2xl font-bold text-foreground mb-8">Grade Improvement</h3>
                <div className="relative h-80 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-6">
                  <svg className="w-full h-full" viewBox="0 0 400 250" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="200" x2="400" y2="200" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="150" x2="400" y2="150" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
                    
                    {/* Grey dashed line - Traditional tutoring */}
                    <motion.path
                      d="M 0 200 Q 100 180, 200 140 T 400 100"
                      fill="none"
                      stroke="hsl(0 0% 60%)"
                      strokeWidth="3"
                      strokeDasharray="8,8"
                      initial={{ pathLength: 0 }}
                      animate={comparisonInView ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 2, delay: 0.5 }}
                    />
                    
                    {/* Blue gradient line - Mentiora */}
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(195 69% 54%)" />
                        <stop offset="100%" stopColor="hsl(200 100% 60%)" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      d="M 0 200 Q 100 120, 200 60 T 400 20"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={comparisonInView ? { pathLength: 1 } : { pathLength: 0 }}
                      transition={{ duration: 2, delay: 0.8 }}
                    />
                  </svg>
                  
                  {/* Legend */}
                  <div className="absolute top-4 right-4 space-y-3 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Mentiora</p>
                        <p className="text-xs text-muted-foreground">£14.99/mo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1 border-t-2 border-dashed border-muted-foreground rounded-full"></div>
                      <div>
                        <p className="text-sm font-semibold text-muted-foreground">Traditional</p>
                        <p className="text-xs text-muted-foreground">£500/mo</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-muted-foreground mt-6 font-medium">
                  <span className="text-primary font-bold text-lg">68%</span> grade improvement with Mentiora.
                </p>
              </Card>
            </motion.div>

            {/* Cost Comparison Card */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-border/50 bg-card rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                <h3 className="text-2xl font-bold text-foreground mb-8">Cost Comparison</h3>
                <div className="flex items-end justify-center gap-12 h-80 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8">
                  {/* Grey bar - Traditional */}
                  <div className="flex flex-col items-center flex-1">
                    <motion.div 
                      className="w-full bg-gradient-to-t from-muted to-muted/60 rounded-t-2xl relative shadow-lg"
                      style={{ height: '100%' }}
                      initial={{ height: 0 }}
                      animate={comparisonInView ? { height: '100%' } : { height: 0 }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                    >
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-3xl font-bold text-muted-foreground">£500</p>
                        <p className="text-xs text-muted-foreground font-medium">per month</p>
                      </div>
                    </motion.div>
                    <p className="text-sm text-muted-foreground mt-6 text-center font-medium">Private tutoring</p>
                  </div>
                  
                  {/* Blue bar - Mentiora */}
                  <div className="flex flex-col items-center flex-1">
                    <motion.div 
                      className="w-full bg-gradient-to-t from-primary to-primary/80 rounded-t-2xl relative shadow-lg shadow-primary/30"
                      style={{ height: '15%' }}
                      initial={{ height: 0 }}
                      animate={comparisonInView ? { height: '15%' } : { height: 0 }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    >
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-3xl font-bold text-primary">£14.99</p>
                        <p className="text-xs text-primary font-medium">per month</p>
                      </div>
                    </motion.div>
                    <p className="text-sm text-foreground font-semibold mt-6 text-center">Mentiora</p>
                  </div>
                </div>
                <p className="text-center text-muted-foreground mt-6 leading-relaxed">
                  Students achieve measurable progress in less than 4 weeks — for under <span className="text-primary font-bold">5%</span> of the cost.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Loved by students and<br />parents across the UK.
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Real stories from learners using Mentiora to boost their grades.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12"
          >
            {[
              { quote: "It feels like a tutor that actually knows how I learn.", author: "Emma, Year 11", highlight: "knows how I learn" },
              { quote: "My predicted grade went up two levels.", author: "Daniel, Year 10", highlight: "two levels" },
              { quote: "Mentiora made revision feel easy and personal.", author: "Sophie, Year 12", highlight: "easy and personal" }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -8 }}
              >
                <Card className="border-border/50 bg-card hover:shadow-2xl transition-all duration-500 rounded-3xl p-8 h-full">
                  <CardContent className="p-0">
                    <motion.div
                      whileHover={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Sparkles className="w-10 h-10 text-primary mb-6" />
                    </motion.div>
                    <p className="text-lg text-foreground mb-6 leading-relaxed">
                      "{testimonial.quote.split(testimonial.highlight)[0]}
                      <span className="text-primary font-semibold">{testimonial.highlight}</span>
                      {testimonial.quote.split(testimonial.highlight)[1]}"
                    </p>
                    <p className="text-sm text-muted-foreground font-medium">
                      — {testimonial.author}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-4 font-medium">Used by 30,000+ students in top UK schools</p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground/60">
              <span className="font-medium">Harris Academy</span>
              <span>•</span>
              <span className="font-medium">Wren Academy</span>
              <span>•</span>
              <span className="font-medium">Forest School</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with Tabs */}
      <section id="pricing" ref={pricingRef} className="py-24 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              All-in-one personalised revision<br />— for one simple plan.
            </h2>
            <p className="text-xl text-muted-foreground font-light">
              Unlimited access to all GCSE & A-Level subjects.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-5xl mx-auto"
          >
            <Tabs defaultValue="2026" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-14 bg-muted/50 p-1 rounded-2xl">
                <TabsTrigger value="2026" className="rounded-xl text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  2026 Exams
                </TabsTrigger>
                <TabsTrigger value="2027" className="rounded-xl text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                  2027 Exams
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="2026" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Monthly Plan */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50 bg-card hover:shadow-2xl transition-all duration-500 rounded-3xl p-10 h-full">
                      <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-3xl font-bold text-foreground mb-6">Monthly</CardTitle>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-foreground">£14.99</span>
                          <span className="text-xl text-muted-foreground font-light">/ month</span>
                        </div>
                        <p className="text-muted-foreground mt-3 font-light">Full access, cancel anytime.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6">
                        <ul className="space-y-4">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            variant="outline"
                            className="w-full mt-8 rounded-2xl py-7 text-base font-semibold border-2 hover:bg-muted/50 hover:shadow-lg transition-all"
                          >
                            Start Free Trial
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Annual Plan - Highlighted */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-3xl p-10 h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-2 rounded-bl-3xl font-semibold text-sm">
                        Save 33%
                      </div>
                      <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-3xl font-bold text-foreground mb-6">Annual</CardTitle>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-foreground">£120</span>
                          <span className="text-xl text-muted-foreground font-light">/ year</span>
                        </div>
                        <p className="text-primary font-semibold mt-2">That's just £10/month</p>
                        <p className="text-muted-foreground mt-2 font-light">Get unlimited access until July 2026.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6">
                        <ul className="space-y-4">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics",
                            "Priority support access"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            className="w-full mt-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-2xl hover:shadow-primary/40 rounded-2xl py-7 text-base font-semibold transition-all"
                          >
                            Start Free Trial
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="2027" className="mt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Same structure for 2027 */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-border/50 bg-card hover:shadow-2xl transition-all duration-500 rounded-3xl p-10 h-full">
                      <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-3xl font-bold text-foreground mb-6">Monthly</CardTitle>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-foreground">£14.99</span>
                          <span className="text-xl text-muted-foreground font-light">/ month</span>
                        </div>
                        <p className="text-muted-foreground mt-3 font-light">Full access, cancel anytime.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6">
                        <ul className="space-y-4">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            variant="outline"
                            className="w-full mt-8 rounded-2xl py-7 text-base font-semibold border-2 hover:bg-muted/50 hover:shadow-lg transition-all"
                          >
                            Start Free Trial
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-primary/50 bg-gradient-to-br from-primary/10 via-primary/5 to-background hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 rounded-3xl p-10 h-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-2 rounded-bl-3xl font-semibold text-sm">
                        Save 33%
                      </div>
                      <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-3xl font-bold text-foreground mb-6">Annual</CardTitle>
                        <div className="flex items-baseline gap-2">
                          <span className="text-5xl font-bold text-foreground">£120</span>
                          <span className="text-xl text-muted-foreground font-light">/ year</span>
                        </div>
                        <p className="text-primary font-semibold mt-2">That's just £10/month</p>
                        <p className="text-muted-foreground mt-2 font-light">Get unlimited access until July 2027.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-6">
                        <ul className="space-y-4">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics",
                            "Priority support access"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-foreground">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            className="w-full mt-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-2xl hover:shadow-primary/40 rounded-2xl py-7 text-base font-semibold transition-all"
                          >
                            Start Free Trial
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>

            <motion.div
              initial="hidden"
              animate={pricingInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-center mt-10"
            >
              <p className="text-sm text-muted-foreground font-light">
                No credit card required. Cancel anytime.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Frequently Asked Questions.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div 
                  className="border border-border/50 rounded-2xl bg-card hover:shadow-xl transition-all duration-300 overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className="font-semibold text-foreground pr-8 group-hover:text-primary transition-colors">{faq.question}</span>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFaq === index ? "auto" : 0,
                      opacity: openFaq === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={finalCtaRef} className="py-24 lg:py-32 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-background pointer-events-none" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate={finalCtaInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              Ready to make revision<br />personal?
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of GCSE and A-Level students using Mentiora to boost their grades.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 px-12 py-7 text-lg font-semibold rounded-2xl transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="px-12 py-7 text-lg font-semibold rounded-2xl border-2 hover:bg-muted/50 hover:shadow-lg transition-all"
                >
                  Go to Dashboard
                </Button>
              </motion.div>
            </div>
            <p className="text-sm text-muted-foreground mt-6 font-light">
              Cancel anytime. No commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 bg-muted/20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-semibold text-foreground">Mentiora</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground font-medium">
              <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              <a href="/login" className="hover:text-primary transition-colors">Login</a>
            </div>
            
            <p className="text-sm text-muted-foreground font-light">
              © 2025 Mentiora. Built for students, by educators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;