import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award, Calendar, TrendingUp, Clock, Crown, GraduationCap, TimerIcon, TrendingUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { DynamicTestimonials } from "@/components/ui/dynamic-testimonials";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check for password reset tokens in URL hash and redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      // Use navigate to properly redirect to reset password page
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }
  }, [navigate]);
  
  // Animation refs
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const impactRef = useRef(null);
  const ctaRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: BookOpen,
      title: "Expert Questions",
      description: "Curated AQA GCSE questions from experienced teachers",
      color: "bg-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Brain,
      title: "Smart Feedback", 
      description: "Revolutionary insights that understand your learning style",
      color: "bg-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights that predict your exam success",
      color: "bg-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Target,
      title: "Personalized Path",
      description: "Adaptive learning that evolves with your progress",
      color: "bg-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Pick Your Subject",
      description: "Choose your subject and the exact topic you want to master.",
      icon: Target,
      color: "bg-primary",
      accent: "text-primary"
    },
    {
      step: "02",
      title: "Answer Real Exam Questions",
      description: "Get exam-style questions that match your spec and practice just like the real thing.",
      icon: Zap,
      color: "bg-primary",
      accent: "text-primary"
    },
    {
      step: "03",
      title: "Get Instant Marking & Feedback",
      description: "See exactly what the examiner wants, where you lost marks, and how to improve.",
      icon: Award,
      color: "bg-primary",
      accent: "text-primary"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "This platform saved me £2,400 on private tutoring! The personalized feedback is incredible - it knows exactly what I struggle with and adapts to my learning style. Went from C grades to A* in just 3 months while studying 60% less time.",
      rating: 5,
      color: "bg-primary/10",
      accent: "border-primary/20"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "The personalization is mind-blowing - it's like having a tutor who knows me better than I know myself. I'm saving 15 hours a week compared to traditional revision and my grades have jumped from grade 5s to 8s consistently.",
      rating: 5,
      color: "bg-primary/10",
      accent: "border-primary/20"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "My parents love that we're saving thousands on tutoring while I'm getting better results than ever. The platform personalizes everything to my weak spots - achieved grade 9 in Chemistry after struggling with grade 6s for months!",
      rating: 5,
      color: "bg-primary/10",
      accent: "border-primary/20"
    }
  ];

  const trustStats = [
    { 
      number: "2.3", 
      label: "Grades Higher", 
      color: "text-primary", 
      bg: "bg-primary/10",
      description: "Average grade improvement",
      icon: TrendingUpIcon
    },
    { 
      number: "67%", 
      label: "Study Time Saved", 
      color: "text-primary", 
      bg: "bg-primary/10",
      description: "Efficient learning",
      icon: TimerIcon
    },
    { 
      number: "94%", 
      label: "Achieve Target Grade", 
      color: "text-primary", 
      bg: "bg-primary/10",
      description: "Student success rate",
      icon: Target
    },
    { 
      number: "£2,847", 
      label: "Tuition Savings", 
      color: "text-primary", 
      bg: "bg-primary/10",
      description: "vs private tutoring",
      icon: Trophy
    }
  ];

  const impactStats = [
    { 
      number: "£2,847", 
      label: "Tuition Savings", 
      color: "text-primary", 
      bg: "bg-primary/20",
      description: "vs private tutoring",
      icon: Trophy
    },
    { 
      number: "89%", 
      label: "Faster Learning", 
      color: "text-primary", 
      bg: "bg-primary/20",
      description: "Compared to textbooks",
      icon: Brain
    },
    { 
      number: "Grade 9", 
      label: "Typical Result", 
      color: "text-primary", 
      bg: "bg-primary/20",
      description: "After 8 weeks",
      icon: GraduationCap
    },
    { 
      number: "24/7", 
      label: "Support Availability", 
      color: "text-primary", 
      bg: "bg-primary/20",
      description: "Never wait for help",
      icon: Clock
    }
  ];

  const premiumFeatures = [
    {
      icon: Target,
      title: "What Should I Study?",
      description: "Personalized study recommendations that tell you exactly what to focus on next",
      badge: "Smart-Powered",
      color: "bg-primary",
      bgColor: "bg-primary/10",
      premium: true
    },
    {
      icon: BookOpen,
      title: "Smart Revision Notebook",
      description: "Automatically generated notes tailored to your learning style and exam board requirements",
      badge: "Personalized",
      color: "bg-primary",
      bgColor: "bg-primary/10",
      premium: true
    },
    {
      icon: Calendar,
      title: "Predicted Exams",
      description: "Access weekly refreshed predicted exam papers built from our advanced analysis of past papers",
      badge: "Updated Weekly",
      color: "bg-primary",
      bgColor: "bg-primary/10",
      premium: true
    },
    {
      icon: Clock,
      title: "Study Time Optimizer",
      description: "Scheduling that maximizes your learning efficiency by analyzing your peak performance hours",
      badge: "Smart Planning",
      color: "bg-primary",
      bgColor: "bg-primary/10",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-background light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 lg:mb-24 pt-4"
        >
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <motion.img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain"
                whileHover={{ rotate: 12 }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Mentiora</h1>
          </motion.div>
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Dashboard
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="lg"
                    onClick={() => navigate('/login')} 
                    className="text-muted-foreground hover:text-foreground hover:bg-muted font-semibold px-8 py-3 rounded-2xl transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/register')} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Free
                  </Button>
                </motion.div>
              </>
            )}
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          className="text-center mb-32 max-w-5xl mx-auto"
        >
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight"
          >
            <span className="text-primary">
              Your personal GCSE and A-Level tutor.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            Mentiora adapts to how you learn — identifying what to revise next and helping you make every study session count.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300 rounded-2xl mobile-touch-target"
            >
              Try Now For Free
            </Button>
          </motion.div>
          
          {/* Dynamic Testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16"
          >
            <DynamicTestimonials />
          </motion.div>
          
        </motion.div>

        {/* Subjects and Exam Boards Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-32 max-w-7xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-primary">
                All Your GCSE & A-Level Subjects
              </span>
            </motion.h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage across all major exam boards
            </p>
          </div>

          {/* Exam Boards */}
          <div className="mb-12">
            <h3 className="text-center text-xl font-semibold text-foreground mb-6">Supported Exam Boards</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {['AQA', 'Edexcel', 'OCR', 'Eduqas'].map((board, index) => (
                <motion.div
                  key={board}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-card rounded-2xl px-8 py-4 shadow-lg border-2 border-border"
                >
                  <span className="text-2xl font-bold text-foreground">{board}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Mathematics', icon: '📐', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE & A-Level' },
              { name: 'Biology', icon: '🧬', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE & A-Level' },
              { name: 'Chemistry', icon: '⚗️', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE & A-Level' },
              { name: 'Physics', icon: '⚛️', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE & A-Level' },
              { name: 'Psychology', icon: '🧠', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE & A-Level' },
              { name: 'English Language', icon: '📖', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'Computer Science', icon: '💻', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'History', icon: '📚', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'Geography', icon: '🌍', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'Business', icon: '💼', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'Religious Studies', icon: '🕊️', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
              { name: 'Music', icon: '🎵', color: 'text-primary', bgColor: 'bg-primary/10', levels: 'GCSE' },
            ].map((subject, index) => (
              <motion.div
                key={subject.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`${subject.bgColor} rounded-2xl p-6 text-center shadow-lg border border-border hover:shadow-xl transition-all duration-300`}
              >
                <div className="text-4xl mb-3">{subject.icon}</div>
                <h4 className={`text-lg font-bold ${subject.color}`}>
                  {subject.name}
                </h4>
                <div className="mt-2 flex items-center justify-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-xs text-muted-foreground">{subject.levels}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats below subjects */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-primary/10 rounded-full px-8 py-4 border border-primary/20">
              <CheckCircle className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Thousands of exam-style questions across all subjects
              </span>
            </div>
          </motion.div>
        </motion.div>




        {/* Feature Showcase - Clean Professional Style */}
        <div className="mb-16 sm:mb-24 lg:mb-32">
          {/* First Feature - Smart Practice */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 lg:mb-24"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <motion.h3 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                  >
                    Every question, every answer,{" "}
                    <span className="text-primary">one ultimate study experience</span>
                  </motion.h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Practice with real exam questions from past papers, get instant feedback, and watch your understanding grow with every answer.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/register')} 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                    >
                      Start Practicing Free
                    </Button>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 shadow-xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Chemistry Practice</CardTitle>
                        <Badge variant="secondary" className="font-normal">Question 1 of 12</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground">What is the formula for calculating the rate of reaction?</p>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-primary/10 border-2 border-primary rounded-lg p-3 flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm font-medium text-primary">Rate = Change in concentration / Time</span>
                        </div>
                        <div className="bg-background border rounded-lg p-3">
                          <span className="text-sm text-muted-foreground">Rate = Time / Change in concentration</span>
                        </div>
                      </div>
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="text-sm font-medium text-primary mb-1">Correct! Well done.</p>
                        <p className="text-xs text-muted-foreground">You&apos;re mastering rate calculations. This appears frequently in Paper 2.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Second Feature - Personalized Learning */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 lg:order-2">
                  <motion.h3 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                  >
                    Your <span className="text-primary">smart revision</span> notebook
                  </motion.h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Get automatically generated, personalized revision notes tailored to your learning style and exam board. Save hours of note-taking and focus on what matters most for your exams.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/register')}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                    >
                      Generate My Notes
                    </Button>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative lg:order-1"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 shadow-xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Smart Revision Notebook</CardTitle>
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-normal">Auto-Generated</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div className="font-semibold text-sm">Chemical Bonding</div>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          <strong>Key Points:</strong> Ionic bonds form between metals and non-metals through electron transfer. The electrostatic attraction between oppositely charged ions creates the bond.
                        </p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="h-4 w-4 text-primary" />
                          <div className="font-semibold text-xs text-primary">Your Learning Style</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Visual diagrams and step-by-step examples work best for you
                        </p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="h-4 w-4 text-primary" />
                          <div className="font-semibold text-xs text-primary">Exam Focus</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Practice drawing dot-and-cross diagrams for ionic compounds
                        </p>
                      </div>
                      <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <div className="font-semibold text-xs text-primary">Updated for Your Progress</div>
                        </div>
                        <p className="text-xs text-muted-foreground">Notes automatically updated based on your latest practice sessions.</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Third Feature - Stay Motivated */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <motion.h3 
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
                  >
                    <span className="text-primary">Stay motivated</span> with every question
                  </motion.h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Track your progress, celebrate wins, and watch your grades improve with detailed analytics that show exactly how close you are to your target grades.
                  </p>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      onClick={() => navigate('/register')} 
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
                    >
                      Start Your Journey
                    </Button>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-2 shadow-xl">
                    <CardHeader className="text-center pb-3">
                      <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center">
                        <Trophy className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl">Streak Master!</CardTitle>
                      <CardDescription>7 days in a row 🔥</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-xl font-bold text-primary">124</div>
                          <div className="text-xs text-muted-foreground">Questions</div>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-xl font-bold text-primary">89%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-primary/10 rounded-lg">
                          <div className="text-xl font-bold text-primary">Grade 8</div>
                          <div className="text-xs text-muted-foreground">Predicted</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress to Grade 9</span>
                          <span className="text-primary font-semibold">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Price Comparison Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-32"
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Personalised tutoring{" "}
                <span className="text-primary">
                  at a fraction of the cost
                </span>
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Trained to be more effective than personal tutoring, at just 5% of the cost of private tuition.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left side - Graph */}
              <div className="lg:col-span-2 bg-card rounded-3xl p-8 shadow-xl">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold mb-2">
                    <span className="text-primary">
                      68% grade improvement
                    </span>
                  </h4>
                </div>
                
                {/* Graph */}
                <div className="relative h-80">
                  {/* Y-axis label */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-muted-foreground whitespace-nowrap origin-center">
                    Average grades
                  </div>
                  
                  {/* Graph area */}
                  <div className="ml-12 h-full flex flex-col justify-end pb-12 relative">
                    {/* Personalized education line */}
                    <div className="absolute bottom-12 left-0 right-0 h-full">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        <defs>
                          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'hsl(195 69% 54%)', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: 'hsl(195 60% 60%)', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        {/* Personalized curve */}
                        <path 
                          d="M 0 180 Q 100 100, 200 40 T 400 20" 
                          stroke="url(#primaryGradient)" 
                          strokeWidth="4" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Non-personal curve */}
                        <path 
                          d="M 0 180 Q 100 140, 200 110 T 400 90" 
                          stroke="hsl(var(--muted-foreground) / 0.3)" 
                          strokeWidth="4" 
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Labels */}
                      <div className="absolute top-8 right-8 flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sm border border-border">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span className="text-sm font-semibold text-foreground">Personalised education</span>
                      </div>
                      
                      <div className="absolute bottom-16 right-8 flex items-center gap-2 bg-card px-3 py-2 rounded-lg shadow-sm border border-border">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <span className="text-sm font-semibold text-muted-foreground">Non-personal education</span>
                      </div>
                    </div>
                    
                    {/* X-axis label */}
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      Hours spent learning
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Price comparison */}
              <div className="lg:col-span-1 space-y-6">
                {/* Personal tutoring card */}
                <motion.div 
                  className="bg-muted rounded-2xl p-6 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-5xl font-bold text-muted-foreground mb-2">£500</div>
                  <div className="text-muted-foreground text-sm">/month</div>
                  <div className="mt-4 text-muted-foreground font-semibold">Personal tutoring</div>
                </motion.div>

                {/* Mentiora card */}
                <motion.div 
                  className="bg-primary rounded-2xl p-6 text-center text-primary-foreground shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-5xl font-bold mb-2">£9.99</div>
                  <div className="text-primary-foreground/80 text-sm">/month</div>
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                        alt="Mentiora" 
                        className="w-6 h-6 object-contain brightness-0 invert"
                      />
                    </div>
                    <span className="font-bold text-lg">mentiora</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-primary/30">
                    <div className="text-2xl font-bold mb-4">
                      95% cheaper than private tutoring
                    </div>
                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                    <p className="text-xs text-primary-foreground/80 mt-2">First 7 days free, then £9.99/month</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          className="bg-primary rounded-3xl p-16 text-center text-primary-foreground max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary-foreground/10 rounded-3xl" />
          <motion.div 
            className="absolute inset-0 bg-primary/20 rounded-3xl"
            animate={{ 
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="relative z-10">
            <motion.h3 
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight"
            >
              Ready to Unlock Your Potential?
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-primary-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Join thousands of students who've improved their grades by an average of <span className="font-bold text-primary-foreground">two full grade boundaries</span> with our smart platform.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-background text-foreground hover:bg-background/90 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-primary-foreground/25 transition-all duration-300 rounded-2xl group"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
