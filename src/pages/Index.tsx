import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Brain, TrendingUp, Calendar, Target, Sparkles, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
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
  const howItWorksRef = useRef(null);
  const personalizationRef = useRef(null);
  const comparisonRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const finalCtaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-50px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-50px" });
  const personalizationInView = useInView(personalizationRef, { once: true, margin: "-50px" });
  const comparisonInView = useInView(comparisonRef, { once: true, margin: "-50px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-50px" });
  const pricingInView = useInView(pricingRef, { once: true, margin: "-50px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-50px" });
  const finalCtaInView = useInView(finalCtaRef, { once: true, margin: "-50px" });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const faqs = [
    {
      question: "Is Mentiora specific to GCSE and A-Level specifications?",
      answer: "Yes — all content is tailored to AQA, Edexcel, and OCR exam boards."
    },
    {
      question: "How do predicted grades work?",
      answer: "Your grades update dynamically after each quiz, tracking improvement across subjects."
    },
    {
      question: "Does Mentiora replace tutoring?",
      answer: "Mentiora works like a tutor — analysing your performance, explaining answers, and helping you focus where it matters."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel or switch plans anytime in your dashboard."
    },
    {
      question: "Does Mentiora cover all subjects?",
      answer: "Yes — from Maths and English to Biology, Chemistry, and Psychology."
    },
    {
      question: "What makes Mentiora unique?",
      answer: "It's the only platform that combines real exam-style practice, personalisation, and live predicted-grade analytics in one dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-background light">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-semibold text-foreground">Mentiora</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-8">
              <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              {user ? (
                <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
              ) : null}
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
              {!user && (
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-sm"
                >
                  Login
                </Button>
              )}
              <Button 
                onClick={() => user ? navigate('/dashboard') : navigate('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {user ? "Go to Dashboard" : "Start Free Trial"}
              </Button>
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

      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative overflow-hidden"
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-8 py-20 lg:py-32 relative">
          <motion.div
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              The GCSE and A-Level tutor<br />built for you.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Mentiora personalises your revision — tracking your progress, predicting grades, and guiding you toward your target marks with data-driven precision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button 
                onClick={() => navigate('/register')}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-6 text-lg rounded-xl"
              >
                Explore Dashboard
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Trusted by students across the UK preparing for 2026 exams.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works - 3 Feature Cards */}
      <section ref={howItWorksRef} className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Your personal tutor — reimagined<br />for modern learning.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you'd expect from a private tutor, made smarter and more affordable.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Smart Revision Notebook</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Mentiora builds a study plan around your weakest topics — updating automatically after every quiz and practice session.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Predicted Grades</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    Your progress is tracked in real time. Watch your grade grow as your performance improves across each subject.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 h-full rounded-2xl">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">Weekly Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    From retention rates to best study times, Mentiora analyses your habits and tells you exactly how to revise smarter.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Personalization Section (Dashboard Showcase) */}
      <section ref={personalizationRef} className="py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Left: Visual */}
            <motion.div
              initial="hidden"
              animate={personalizationInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl p-8 relative">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Your Dashboard</h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Live</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">Predicted Grade</p>
                        <p className="text-2xl font-bold text-primary">Grade 8</p>
                      </div>
                      <div className="bg-muted/50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">This Week</p>
                        <p className="text-2xl font-bold text-foreground">5 h 20 m</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Retention Rate</span>
                        <span className="font-semibold text-foreground">74%</span>
                      </div>
                      <div className="w-full bg-muted/50 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '74%' }}></div>
                      </div>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">Study Peak</p>
                      </div>
                      <p className="text-xs text-muted-foreground">Your best learning time is 7–9 pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial="hidden"
              animate={personalizationInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Built around how<br />you learn.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Your dashboard tracks every subject, predicted grades, weak topics, and weekly goals — adapting dynamically to your performance. It's your own intelligent revision coach.
              </p>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' })}
                className="rounded-xl"
              >
                See How It Works
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Comparison Section (Graph + Price) */}
      <section id="comparison" ref={comparisonRef} className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={comparisonInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Personalised tutoring — at a<br />fraction of the cost.
            </h2>
            <p className="text-lg text-muted-foreground">
              Smarter, faster, and 95% cheaper than private tutoring.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Graph */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-border bg-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Grade Improvement</h3>
                <div className="relative h-64">
                  {/* Simple SVG graph representation */}
                  <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                    {/* Grey line - Traditional tutoring */}
                    <path
                      d="M 0 150 Q 100 140, 200 120 T 400 80"
                      fill="none"
                      stroke="hsl(0 0% 70%)"
                      strokeWidth="3"
                      strokeDasharray="5,5"
                    />
                    {/* Blue line - Mentiora */}
                    <path
                      d="M 0 150 Q 100 100, 200 60 T 400 20"
                      fill="none"
                      stroke="hsl(195 69% 54%)"
                      strokeWidth="4"
                    />
                  </svg>
                  
                  {/* Labels */}
                  <div className="absolute top-4 right-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-primary"></div>
                      <span className="text-sm text-foreground font-medium">Mentiora £14.99/mo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 border-t-2 border-dashed border-muted-foreground"></div>
                      <span className="text-sm text-muted-foreground">Traditional £500/mo</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-4">
                  68% grade improvement with Mentiora.
                </p>
              </Card>
            </motion.div>

            {/* Right: Price Comparison */}
            <motion.div
              initial="hidden"
              animate={comparisonInView ? "visible" : "hidden"}
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-border bg-card rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-foreground mb-6">Cost Comparison</h3>
                <div className="flex items-end justify-center gap-8 h-64">
                  {/* Grey bar - Traditional */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-muted rounded-t-xl relative" style={{ height: '100%' }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-2xl font-bold text-muted-foreground">£500</p>
                        <p className="text-xs text-muted-foreground">per month</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 text-center">Private tutoring</p>
                  </div>
                  
                  {/* Blue bar - Mentiora */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-full bg-primary rounded-t-xl relative" style={{ height: '15%' }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-center">
                        <p className="text-2xl font-bold text-primary">£14.99</p>
                        <p className="text-xs text-primary">per month</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground font-medium mt-4 text-center">Mentiora</p>
                  </div>
                </div>
                <p className="text-sm text-center text-muted-foreground mt-8">
                  Mentiora helps students achieve measurable improvement in less than four weeks — for less than 5% of the cost.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className="py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Loved by students and<br />parents across the UK.
            </h2>
            <p className="text-lg text-muted-foreground">
              Real stories from learners using Mentiora to boost their GCSE & A-Level grades.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto"
          >
            {[
              { quote: "It's like having a tutor that actually knows how I learn.", author: "Emma, Year 11" },
              { quote: "My predicted grade went up two levels in a month!", author: "Daniel, Year 10" },
              { quote: "Mentiora helped me turn my weak topics into my strengths.", author: "Sophie, Year 12" },
              { quote: "It feels like my study plan finally makes sense.", author: "Parent of GCSE student" }
            ].map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 rounded-2xl p-8 h-full">
                  <CardContent className="p-0">
                    <Sparkles className="w-8 h-8 text-primary mb-4" />
                    <p className="text-lg text-foreground mb-4 leading-relaxed">
                      "{testimonial.quote}"
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by students at</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span>Harris Academy</span>
              <span>•</span>
              <span>Wren Academy</span>
              <span>•</span>
              <span>Forest School</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" ref={pricingRef} className="py-20 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              All-in-one personalised revision.
            </h2>
            <p className="text-lg text-muted-foreground">
              Unlimited access to all GCSE & A-Level subjects.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={staggerChildren}
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {/* Monthly Plan */}
            <motion.div variants={fadeInUp}>
              <Card className="border-border bg-card hover:shadow-lg transition-all duration-300 rounded-2xl p-8 h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">Monthly</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">£14.99</span>
                    <span className="text-muted-foreground"> / month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Full access, cancel anytime.</p>
                  <ul className="space-y-3">
                    {[
                      "All GCSE & A-Level subjects",
                      "Unlimited practice questions",
                      "Predicted grades tracking",
                      "Smart revision notebook",
                      "Weekly insights"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => navigate('/register')}
                    variant="outline"
                    className="w-full mt-6 rounded-xl py-6"
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Annual Plan - Highlighted */}
            <motion.div variants={fadeInUp}>
              <Card className="border-primary bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300 rounded-2xl p-8 h-full relative overflow-hidden">
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">Save 33%</Badge>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">Annual</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">£120</span>
                    <span className="text-muted-foreground"> / year</span>
                  </div>
                  <p className="text-sm text-muted-foreground">That's just £10/month</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Get unlimited access until July 2026.</p>
                  <ul className="space-y-3">
                    {[
                      "All GCSE & A-Level subjects",
                      "Unlimited practice questions",
                      "Predicted grades tracking",
                      "Smart revision notebook",
                      "Weekly insights",
                      "Priority support"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => navigate('/register')}
                    className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl py-6"
                  >
                    Start Free Trial
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={pricingInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-muted-foreground">
              No credit card required. Cancel anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" ref={faqRef} className="py-20 lg:py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
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
                <div 
                  className="border border-border rounded-2xl bg-card hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-foreground pr-8">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={finalCtaRef} className="py-20 lg:py-24 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background pointer-events-none" />
        
        <div className="container mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial="hidden"
            animate={finalCtaInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to make your<br />revision personal?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of GCSE and A-Level students improving their grades every week with Mentiora.
            </p>
            <Button 
              onClick={() => navigate('/register')}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Cancel anytime. No commitment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
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
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="/login" className="hover:text-foreground transition-colors">Login</a>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 Mentiora. Built for students, by educators.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;