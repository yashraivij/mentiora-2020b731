import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Brain, TrendingUp, Calendar, Target, Sparkles, ChevronDown, ChevronUp, ArrowRight, BarChart3, Clock, BookOpen, Zap, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

      {/* Hero Section - Premium with deeper gradients and energy */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden pt-24 pb-40 lg:pt-40 lg:pb-56"
      >
        {/* Multi-layer animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
        <div className="absolute top-1/3 -right-64 w-[600px] h-[600px] bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/3 -left-64 w-[600px] h-[600px] bg-gradient-radial from-blue-500/15 via-primary/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Floating gradient orb */}
        <motion.div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"
          animate={{
            x: [-50, 50, -50],
            y: [-30, 30, -30],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 relative max-w-7xl">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto text-center"
          >
            {/* Glowing backdrop for headline */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
            
            <motion.h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold text-foreground mb-10 leading-[1.05] tracking-tight relative"
              initial={{ opacity: 0, y: 40 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              The GCSE & A-Level<br />tutor built around{" "}
              <span className="text-primary relative inline-block font-extrabold">
                you
                <motion.span
                  className="absolute -bottom-3 left-0 right-0 h-4 bg-gradient-to-r from-primary/30 via-primary/40 to-primary/30 -z-10 rounded-full blur-sm"
                  initial={{ width: 0, opacity: 0 }}
                  animate={heroInView ? { width: "110%", opacity: 1 } : { width: 0, opacity: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                />
              </span>
              .
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl lg:text-3xl text-muted-foreground/90 mb-6 max-w-4xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.3 }}
            >
              Your personalised revision coach — built to understand how you learn.
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl text-muted-foreground/70 mb-16 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.5 }}
            >
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.9, delay: 0.7 }}
            >
              <motion.div 
                whileHover={{ scale: 1.08, y: -3 }} 
                whileTap={{ scale: 0.97 }}
                className="relative group"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                <Button 
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="relative bg-gradient-to-r from-primary via-primary to-blue-500 text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 px-12 py-8 text-lg font-bold rounded-2xl transition-all duration-300 bg-[length:200%_100%] hover:bg-[position:100%_0] animate-shimmer"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/dashboard')}
                  className="px-12 py-8 text-lg font-semibold rounded-2xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  Explore Dashboard
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-sm text-muted-foreground/70 font-light"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
            >
              Trusted by GCSE & A-Level students across the UK preparing for 2026 exams.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Three Feature Cards Section - Enhanced with deeper gradients */}
      <section ref={featuresRef} className="py-32 lg:py-40 relative">
        {/* Thin divider with blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
              Your personal tutor —<br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                reimagined for modern learning
              </span>
              .
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
              Everything you'd expect from a private tutor, redesigned to be smarter, simpler, and made for you.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto"
          >
            {[
              {
                icon: Brain,
                title: "Smart Revision Notebook",
                description: "Turn weak topics into strengths with a personalised study plan that updates after every quiz or practice session.",
                gradient: "from-blue-500/20 via-cyan-500/15 to-blue-500/10",
                iconBg: "from-blue-500/20 to-cyan-500/20"
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "Watch your grade rise in real time. Every session updates your predicted grade — motivating you to reach your goals faster.",
                gradient: "from-primary/20 via-blue-500/15 to-primary/10",
                iconBg: "from-primary/20 to-blue-500/20"
              },
              {
                icon: Calendar,
                title: "Weekly Insights",
                description: "Understand your learning habits at a glance. Track your retention, study focus, and best hours to revise for maximum results.",
                gradient: "from-cyan-500/20 via-primary/15 to-cyan-500/10",
                iconBg: "from-cyan-500/20 to-primary/20"
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -12, transition: { duration: 0.4, ease: "easeOut" } }}
                className="group"
              >
                <Card className={`relative border-border/40 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 h-full rounded-3xl overflow-hidden`}>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardHeader className="pb-6 relative">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20 transition-all duration-300`}
                      whileHover={{ rotate: [0, -8, 8, -8, 0], scale: 1.1, transition: { duration: 0.6 } }}
                    >
                      <feature.icon className="w-8 h-8 text-primary drop-shadow-sm" />
                    </motion.div>
                    <CardTitle className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-muted-foreground/90 leading-relaxed text-base md:text-lg">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Visual Section - Product showcase with motion */}
      <section ref={dashboardRef} className="py-32 lg:py-40 relative overflow-hidden">
        {/* Background with floating blur circles */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-blue-500/5 to-background" />
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Enhanced Mockup */}
            <motion.div
              initial="hidden"
              animate={dashboardInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.03, transition: { duration: 0.4 } }}
              >
                {/* Enhanced multi-layer glow */}
                <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-blue-500/25 to-primary/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute -inset-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-3xl blur-xl" />
                
                <div className="relative bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-10 shadow-2xl">
                  <div className="space-y-7">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold text-foreground">Your Dashboard</h3>
                      <Badge className="bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary border-primary/30 px-4 py-1.5 shadow-lg">
                        <motion.span 
                          className="w-2.5 h-2.5 bg-primary rounded-full inline-block mr-2"
                          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        Live
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <motion.div 
                        className="bg-gradient-to-br from-primary/15 to-blue-500/10 rounded-2xl p-6 border border-primary/20 shadow-lg"
                        whileHover={{ scale: 1.05, y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Predicted Grade</p>
                        <p className="text-4xl font-bold text-primary mb-1">Grade 8</p>
                        <motion.p 
                          className="text-xs text-primary/80 mt-2 flex items-center gap-1"
                          initial={{ x: -5, opacity: 0 }}
                          animate={dashboardInView ? { x: 0, opacity: 1 } : { x: -5, opacity: 0 }}
                          transition={{ delay: 1 }}
                        >
                          <TrendingUp className="w-3 h-3" />
                          ↑ from Grade 7
                        </motion.p>
                      </motion.div>
                      <motion.div 
                        className="bg-muted/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg"
                        whileHover={{ scale: 1.05, y: -4 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">This Week</p>
                        <p className="text-4xl font-bold text-foreground mb-1">5h 20m</p>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          +2h from last week
                        </p>
                      </motion.div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Retention Rate ↑</span>
                        <span className="font-bold text-foreground text-lg">74%</span>
                      </div>
                      <div className="relative w-full bg-muted/50 rounded-full h-4 overflow-hidden shadow-inner">
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-primary h-4 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={dashboardInView ? { width: '74%' } : { width: 0 }}
                          transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                        />
                        {/* Animated shimmer */}
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, delay: 2.5, ease: "easeInOut" }}
                        />
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/10 via-blue-500/5 to-primary/10 rounded-2xl p-6 border border-primary/15 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shadow-sm">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Study Peak</p>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">Your best learning time is <span className="text-primary font-semibold">7–9 pm</span></p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Enhanced Text */}
            <motion.div
              initial="hidden"
              animate={dashboardInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="order-1 lg:order-2 space-y-8"
            >
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05]">
                Built around<br />
                <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  how you learn
                </span>
                .
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground/90 leading-relaxed font-light">
                Your Mentiora dashboard is your personal command centre — tracking every subject, predicted grade, and weekly goal in one place.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-light">
                It adapts automatically to your performance, helping you revise smarter, not longer.
              </p>
              <motion.div 
                whileHover={{ x: 8 }} 
                transition={{ duration: 0.3 }}
                className="pt-4"
              >
                <Button 
                  size="lg"
                  onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-primary to-blue-500 text-primary-foreground rounded-2xl px-10 py-7 text-lg font-bold hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 group"
                >
                  See How It Works
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Graph Comparison Section - Enhanced with depth */}
      <section id="comparison" ref={comparisonRef} className="py-32 lg:py-40 relative">
        {/* Thin divider with blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <motion.div
            initial="hidden"
            animate={comparisonInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.05]">
              Personalised tutoring —<br />
              <span className="text-primary">at a fraction of the cost</span>
              .
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/80 font-light">
              Smarter, faster, and 95% cheaper than private tutoring.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Graph Card - Enhanced with glow */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ y: -6, transition: { duration: 0.4 } }}
              className="group"
            >
              <Card className="relative border-2 border-border/40 bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500 h-full overflow-hidden">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:via-transparent group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
                
                <div className="relative">
                  <h3 className="text-3xl font-bold text-foreground mb-10 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-primary" />
                    Grade Improvement
                  </h3>
                  <div className="relative h-80 bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl p-8 backdrop-blur-sm shadow-inner">
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
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={comparisonInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        transition={{ duration: 2, delay: 0.5 }}
                      />
                      
                      {/* Blue gradient line - Mentiora with glow */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(195 69% 54%)" />
                          <stop offset="50%" stopColor="hsl(200 100% 60%)" />
                          <stop offset="100%" stopColor="hsl(195 69% 54%)" />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>
                      <motion.path
                        d="M 0 200 Q 100 120, 200 60 T 400 20"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="5"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={comparisonInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                        transition={{ duration: 2.5, delay: 0.8 }}
                      />
                    </svg>
                    
                    {/* Legend with enhanced styling */}
                    <div className="absolute top-6 right-6 space-y-4 bg-card/95 backdrop-blur-md rounded-2xl p-5 border-2 border-border/50 shadow-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-sm shadow-primary/50"></div>
                        <div>
                          <p className="text-sm font-bold text-foreground">Mentiora</p>
                          <p className="text-xs text-primary font-medium">£14.99/mo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-1.5 border-t-2 border-dashed border-muted-foreground/60 rounded-full"></div>
                        <div>
                          <p className="text-sm font-semibold text-muted-foreground/80">Traditional</p>
                          <p className="text-xs text-muted-foreground/70">£500/mo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="text-center mt-8 px-6 py-4 bg-gradient-to-r from-primary/10 via-blue-500/10 to-primary/10 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 3 }}
                  >
                    <p className="text-muted-foreground font-medium">
                      <span className="text-primary font-bold text-2xl">68%</span> average grade improvement with Mentiora
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">Students achieve measurable progress in under four weeks.</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Cost Comparison Card - Enhanced */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ y: -6, transition: { duration: 0.4 } }}
              className="group"
            >
              <Card className="relative border-2 border-border/40 bg-gradient-to-br from-card via-card to-blue-500/5 rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 h-full overflow-hidden">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-primary/0 to-primary/0 group-hover:from-blue-500/5 group-hover:via-transparent group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />
                
                <div className="relative">
                  <h3 className="text-3xl font-bold text-foreground mb-10 flex items-center gap-3">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Cost Comparison
                  </h3>
                  <div className="flex items-end justify-center gap-16 h-80 bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl p-10 backdrop-blur-sm shadow-inner">
                    {/* Grey bar - Traditional */}
                    <div className="flex flex-col items-center flex-1">
                      <motion.div 
                        className="w-full bg-gradient-to-t from-muted via-muted/80 to-muted/60 rounded-t-2xl relative shadow-xl"
                        style={{ height: '100%' }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={comparisonInView ? { height: '100%', opacity: 1 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                      >
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-center">
                          <p className="text-4xl font-bold text-muted-foreground">£500</p>
                          <p className="text-xs text-muted-foreground/70 font-medium mt-1">per month</p>
                        </div>
                      </motion.div>
                      <p className="text-sm text-muted-foreground/80 mt-7 text-center font-semibold">Private tutoring</p>
                    </div>
                    
                    {/* Blue bar - Mentiora with glow */}
                    <div className="flex flex-col items-center flex-1">
                      <motion.div 
                        className="w-full bg-gradient-to-t from-primary via-primary/90 to-blue-500 rounded-t-2xl relative shadow-2xl shadow-primary/40"
                        style={{ height: '15%' }}
                        initial={{ height: 0, opacity: 0 }}
                        animate={comparisonInView ? { height: '15%', opacity: 1 } : { height: 0, opacity: 0 }}
                        transition={{ duration: 1.8, delay: 1.3, ease: "easeOut" }}
                      >
                        <motion.div 
                          className="absolute inset-0 bg-primary/30 rounded-t-2xl blur-md"
                          animate={{ opacity: [0.5, 0.8, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 text-center">
                          <p className="text-4xl font-bold text-primary">£14.99</p>
                          <p className="text-xs text-primary/80 font-medium mt-1">per month</p>
                        </div>
                      </motion.div>
                      <p className="text-sm text-foreground font-bold mt-7 text-center">Mentiora</p>
                    </div>
                  </div>
                  <motion.div
                    className="text-center mt-8 px-6 py-4 bg-gradient-to-r from-blue-500/10 via-primary/10 to-blue-500/10 rounded-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 3.5 }}
                  >
                    <p className="text-muted-foreground leading-relaxed font-medium">
                      One plan. All subjects. <span className="text-primary font-bold">Unlimited progress.</span>
                    </p>
                    <p className="text-sm text-muted-foreground/70 mt-1">For under <span className="text-primary font-bold">5%</span> of the cost.</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced with avatars */}
      <section ref={testimonialsRef} className="py-32 lg:py-40 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-blue-500/5 to-background" />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-24"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.05]">
              Loved by students and<br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                parents across the UK
              </span>
              .
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/80 font-light">
              Real stories from learners who turned revision into results.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto mb-16"
          >
            {[
              { quote: "It feels like a tutor that actually understands me.", author: "Maya", role: "Year 11", highlight: "actually understands me", avatar: "M" },
              { quote: "My grades jumped from 6 to 8 in three weeks.", author: "Ethan", role: "GCSE Student", highlight: "6 to 8 in three weeks", avatar: "E" },
              { quote: "Finally, a study app that feels personal.", author: "Sophie", role: "Year 10 Parent", highlight: "feels personal", avatar: "S" }
            ].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.4 } }}
                className="group"
              >
                <Card className="relative border-2 border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-500 rounded-3xl p-10 h-full overflow-hidden">
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />
                  
                  <CardContent className="p-0 relative">
                    <motion.div
                      className="mb-8"
                      whileHover={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center border-2 border-primary/30 shadow-lg">
                        <Avatar className="w-full h-full">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-blue-500 text-primary-foreground font-bold text-lg">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="mb-6"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={testimonialsInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <Star className="w-8 h-8 text-primary fill-primary opacity-80" />
                    </motion.div>
                    
                    <p className="text-lg md:text-xl text-foreground/90 mb-8 leading-relaxed font-light">
                      "{testimonial.quote.split(testimonial.highlight)[0]}
                      <span className="text-primary font-semibold">{testimonial.highlight}</span>
                      {testimonial.quote.split(testimonial.highlight)[1]}"
                    </p>
                    <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                      <div>
                        <p className="text-base font-bold text-foreground">
                          {testimonial.author}
                        </p>
                        <p className="text-sm text-muted-foreground/80">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center"
          >
            <p className="text-base text-muted-foreground/80 mb-6 font-medium">Used by 30,000+ students in top UK schools</p>
            <div className="flex flex-wrap justify-center gap-10 text-base text-muted-foreground/60">
              <span className="font-semibold">Harris Academy</span>
              <span className="opacity-50">•</span>
              <span className="font-semibold">Wren Academy</span>
              <span className="opacity-50">•</span>
              <span className="font-semibold">Forest School</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section with Tabs - Enhanced with gradient background */}
      <section id="pricing" ref={pricingRef} className="py-32 lg:py-40 relative overflow-hidden">
        {/* Horizontal gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-blue-500/5" />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl relative">
          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.05]">
              All-in-one personalised revision<br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                — for one simple plan
              </span>
              .
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground/80 font-light">
              Unlimited access to GCSE & A-Level subjects, all in one plan.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-6xl mx-auto"
          >
            <Tabs defaultValue="2026" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-16 h-16 bg-muted/60 backdrop-blur-sm p-1.5 rounded-2xl shadow-lg border border-border/30">
                <TabsTrigger value="2026" className="rounded-xl text-base font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                  2026 Exams
                </TabsTrigger>
                <TabsTrigger value="2027" className="rounded-xl text-base font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all">
                  2027 Exams
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="2026" className="mt-0">
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Monthly Plan - Enhanced */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Card className="relative border-2 border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:border-border/60 transition-all duration-500 rounded-3xl p-12 h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-muted/20 group-hover:via-transparent group-hover:to-muted/20 transition-all duration-500 pointer-events-none" />
                      
                      <CardHeader className="p-0 mb-10 relative">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-8">Monthly</CardTitle>
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-6xl font-bold text-foreground">£14.99</span>
                          <span className="text-2xl text-muted-foreground/70 font-light">/ month</span>
                        </div>
                        <p className="text-muted-foreground/90 text-base font-light">Cancel anytime.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8 relative">
                        <ul className="space-y-5">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                              <span className="text-foreground/90 text-base">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            variant="outline"
                            className="w-full mt-10 rounded-2xl py-8 text-lg font-bold border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all group"
                          >
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Annual Plan - Highlighted with enhanced spark */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Card className="relative border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/60 transition-all duration-500 rounded-3xl p-12 h-full overflow-hidden">
                      {/* Animated glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Enhanced Save badge with sparkle */}
                      <motion.div 
                        className="absolute top-0 right-0 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground px-8 py-3 rounded-bl-3xl font-bold text-base shadow-xl flex items-center gap-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Save 33%
                      </motion.div>
                      
                      <CardHeader className="p-0 mb-10 relative">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-8">Annual</CardTitle>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-6xl font-bold text-foreground">£120</span>
                          <span className="text-2xl text-muted-foreground/70 font-light">/ year</span>
                        </div>
                        <p className="text-primary font-bold text-lg mb-3">That's just £10/month</p>
                        <p className="text-muted-foreground/90 text-base font-light">Get unlimited access until July 2026.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8 relative">
                        <ul className="space-y-5">
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
                              className="flex items-start gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                              <span className="text-foreground/90 text-base">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div 
                          whileHover={{ scale: 1.04 }} 
                          whileTap={{ scale: 0.97 }}
                          className="relative"
                        >
                          {/* Button glow effect */}
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                          <Button 
                            onClick={() => navigate('/register')}
                            className="relative w-full mt-10 bg-gradient-to-r from-primary via-primary to-blue-500 text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 rounded-2xl py-8 text-lg font-bold transition-all group bg-[length:200%_100%] hover:bg-[position:100%_0]"
                          >
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="2027" className="mt-0">
                <div className="grid md:grid-cols-2 gap-10">
                  {/* Monthly Plan - 2027 */}
                  <motion.div
                    whileHover={{ y: -10, scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Card className="relative border-2 border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-2xl hover:border-border/60 transition-all duration-500 rounded-3xl p-12 h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-muted/20 group-hover:via-transparent group-hover:to-muted/20 transition-all duration-500 pointer-events-none" />
                      
                      <CardHeader className="p-0 mb-10 relative">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-8">Monthly</CardTitle>
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-6xl font-bold text-foreground">£14.99</span>
                          <span className="text-2xl text-muted-foreground/70 font-light">/ month</span>
                        </div>
                        <p className="text-muted-foreground/90 text-base font-light">Cancel anytime.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8 relative">
                        <ul className="space-y-5">
                          {[
                            "All GCSE & A-Level subjects",
                            "Unlimited practice questions",
                            "Predicted grades tracking",
                            "Smart revision notebook",
                            "Weekly insights & analytics"
                          ].map((feature, i) => (
                            <motion.li 
                              key={i} 
                              className="flex items-start gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                              <span className="text-foreground/90 text-base">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                          <Button 
                            onClick={() => navigate('/register')}
                            variant="outline"
                            className="w-full mt-10 rounded-2xl py-8 text-lg font-bold border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all group"
                          >
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -10, scale: 1.01 }}
                    transition={{ duration: 0.4 }}
                    className="group"
                  >
                    <Card className="relative border-2 border-primary/40 bg-gradient-to-br from-primary/15 via-primary/5 to-background backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/30 hover:border-primary/60 transition-all duration-500 rounded-3xl p-12 h-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      <motion.div 
                        className="absolute top-0 right-0 bg-gradient-to-r from-primary to-blue-500 text-primary-foreground px-8 py-3 rounded-bl-3xl font-bold text-base shadow-xl flex items-center gap-2"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Save 33%
                      </motion.div>
                      
                      <CardHeader className="p-0 mb-10 relative">
                        <CardTitle className="text-3xl md:text-4xl font-bold text-foreground mb-8">Annual</CardTitle>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-6xl font-bold text-foreground">£120</span>
                          <span className="text-2xl text-muted-foreground/70 font-light">/ year</span>
                        </div>
                        <p className="text-primary font-bold text-lg mb-3">That's just £10/month</p>
                        <p className="text-muted-foreground/90 text-base font-light">Get unlimited access until July 2027.</p>
                      </CardHeader>
                      <CardContent className="p-0 space-y-8 relative">
                        <ul className="space-y-5">
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
                              className="flex items-start gap-4"
                              initial={{ opacity: 0, x: -20 }}
                              animate={pricingInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                              transition={{ delay: i * 0.1 + 0.3 }}
                            >
                              <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                              <span className="text-foreground/90 text-base">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                        <motion.div 
                          whileHover={{ scale: 1.04 }} 
                          whileTap={{ scale: 0.97 }}
                          className="relative"
                        >
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500" />
                          <Button 
                            onClick={() => navigate('/register')}
                            className="relative w-full mt-10 bg-gradient-to-r from-primary via-primary to-blue-500 text-primary-foreground hover:shadow-2xl hover:shadow-primary/50 rounded-2xl py-8 text-lg font-bold transition-all group bg-[length:200%_100%] hover:bg-[position:100%_0]"
                          >
                            Start Free Trial
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-center mt-12"
            >
              <p className="text-base text-muted-foreground/80 font-light">
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

      {/* Footer - Enhanced */}
      <footer className="border-t-2 border-border/30 py-16 bg-gradient-to-b from-muted/30 to-muted/20">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <motion.div 
              className="flex items-center gap-4"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-foreground tracking-tight">Mentiora</span>
            </motion.div>
            
            <div className="flex flex-wrap justify-center gap-8 text-base text-muted-foreground/80 font-medium">
              <a href="#pricing" className="hover:text-primary transition-colors hover:underline underline-offset-4">Pricing</a>
              <a href="#faq" className="hover:text-primary transition-colors hover:underline underline-offset-4">FAQ</a>
              <a href="/login" className="hover:text-primary transition-colors hover:underline underline-offset-4">Login</a>
            </div>
            
            <p className="text-sm text-muted-foreground/70 font-light">
              © 2025 Mentiora. Built for students, by educators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;