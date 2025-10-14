import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  BookOpen, 
  TrendingUp, 
  Calendar,
  Zap,
  Star,
  ArrowRight,
  Menu,
  Brain,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [activeCard, setActiveCard] = useState(0);

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  // Auto-rotate feature cards
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border/40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Dashboard
            </button>
            <button className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              FAQ
            </button>
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm">
              Login
            </Button>
            <Button onClick={() => navigate("/register")} size="sm" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
              Start Free Trial
            </Button>
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-32 pb-24 px-6 overflow-hidden"
      >
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-blue-50/30 to-purple-50/30 dark:from-background dark:via-blue-950/10 dark:to-purple-950/10" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0.2, 0.5, 0.2],
                y: [-20, -100],
                x: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              The GCSE & A-Level tutor{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  built around you.
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-blue-400/30 to-purple-400/30 -z-0"
                />
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto leading-relaxed">
              Your personalised revision coach — built to understand how you learn.
            </p>
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-3xl mx-auto">
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-6 text-lg group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{ opacity: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
              
              <Button 
                onClick={() => navigate("/dashboard")}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2 hover:bg-accent"
              >
                Explore Dashboard
              </Button>
            </div>

            <p className="text-sm text-muted-foreground/60">
              Trusted by GCSE & A-Level students preparing for 2026 exams
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Showcase Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 relative bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-950/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Designed to make revision{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                personal
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every student learns differently — Mentiora adapts to you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Smart Revision Notebook",
                description: "Build a study plan that adapts to your weakest topics. Updates automatically after every quiz or practice session.",
                mockup: (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg p-3 border border-red-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-semibold">Weak Topic</span>
                      </div>
                      <div className="text-xs">Quadratic Equations</div>
                      <div className="mt-2 h-2 bg-red-500/20 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "30%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        />
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-semibold">Improving</span>
                      </div>
                      <div className="text-xs">Trigonometry</div>
                      <div className="mt-2 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500" />
                      </div>
                    </div>
                  </div>
                ),
                gradient: "from-red-500/10 to-orange-500/10"
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "Watch your grade rise in real time as you improve. Each session refines your predicted mark — motivating you to hit your targets.",
                mockup: (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Current</span>
                      <motion.span 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      >
                        Grade 8
                      </motion.span>
                    </div>
                    <div className="text-xs text-center text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ↑ from Grade 7
                    </div>
                    <div className="h-32 flex items-end gap-2">
                      {[6, 7, 7.5, 7.8, 8].map((grade, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(grade / 9) * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="flex-1 bg-gradient-to-t from-blue-600 to-purple-600 rounded-t-lg"
                        />
                      ))}
                    </div>
                  </div>
                ),
                gradient: "from-blue-500/10 to-purple-500/10"
              },
              {
                icon: BarChart3,
                title: "Weekly Insights",
                description: "Track your retention, focus, and best study hours. Mentiora analyses your learning data to help you study smarter, not longer.",
                mockup: (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                      <span className="text-xs">Retention Rate</span>
                      <span className="text-sm font-bold text-blue-600">74%</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                      <span className="text-xs flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Study Peak
                      </span>
                      <span className="text-sm font-bold text-purple-600">7-9 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-accent/50">
                      <span className="text-xs">This Week</span>
                      <span className="text-sm font-bold text-green-600">5h 20m</span>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      +2h from last week
                    </div>
                  </div>
                ),
                gradient: "from-purple-500/10 to-pink-500/10"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 h-full bg-gradient-to-br ${feature.gradient}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                  
                  <CardContent className="p-8 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6"
                    >
                      <feature.icon className="h-7 w-7" />
                    </motion.div>
                    
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                    
                    <div className="mt-6 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50">
                      {feature.mockup}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Dashboard Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 bg-gradient-to-b from-background via-purple-50/20 to-background dark:via-purple-950/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Built around{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  how you learn
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                Your Mentiora dashboard tracks every subject, grade, and goal — adapting automatically to your performance.
              </p>
              <p className="text-lg text-muted-foreground/80 mb-8">
                See your predicted grades rise, your study patterns evolve, and your retention grow.
              </p>
              <Button 
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 group"
              >
                See How It Works
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="relative"
            >
              {/* Dashboard Mockup */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-3xl" />
                
                <Card className="relative overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-gradient-to-br from-card to-blue-50/50 dark:to-blue-950/30">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-2xl font-bold">Your Dashboard</h3>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1 rounded-full bg-green-500/20 text-green-600 dark:text-green-400 text-sm font-semibold flex items-center gap-1"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </motion.div>
                    </div>

                    <div className="space-y-6">
                      {/* Predicted Grade */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-muted-foreground">Predicted Grade</span>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                        >
                          Grade 8
                        </motion.div>
                        <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                          ↑ from Grade 7
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-2">Study Time</div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-2xl font-bold text-blue-600"
                          >
                            5h 20m
                          </motion.div>
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                            +2h this week
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-accent/50 border border-border/50">
                          <div className="text-xs text-muted-foreground mb-2">Retention</div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-2xl font-bold text-purple-600"
                          >
                            74%
                          </motion.div>
                          <div className="text-xs text-muted-foreground mt-1">
                            ↑ improving
                          </div>
                        </div>
                      </div>

                      {/* Study Peak */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-semibold">Study Peak</span>
                          </div>
                          <span className="text-lg font-bold text-orange-600">7-9 PM</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How Personalisation Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 bg-gradient-to-b from-background to-blue-50/30 dark:to-blue-950/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Learning that gets{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                smarter every week
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mentiora uses your performance to refine what you learn next — building a personalised path to your target grade.
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2 hidden md:block" />
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                {
                  icon: Target,
                  title: "Assess",
                  description: "Mentiora analyses your quiz results and answers",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Zap,
                  title: "Adapt",
                  description: "Weak topics are updated in your Smart Notebook",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  icon: TrendingUp,
                  title: "Accelerate",
                  description: "Your plan evolves weekly to maximise improvement",
                  color: "from-pink-500 to-orange-500"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <Card className="border-2 hover:border-blue-500/50 transition-all duration-300 bg-card/90 backdrop-blur">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                        className={`inline-flex p-5 rounded-full bg-gradient-to-br ${step.color} text-white mb-6 shadow-lg`}
                      >
                        <step.icon className="h-8 w-8" />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Comparison Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 bg-gradient-to-b from-purple-50/30 via-background to-background dark:from-purple-950/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Smarter than tutoring —{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                95% cheaper
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Personalised, data-driven learning designed to outperform private tuition.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Grade Improvement Graph */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-blue-500/30 shadow-xl bg-gradient-to-br from-card to-blue-50/30 dark:to-blue-950/20 overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                    Grade Improvement
                  </h3>
                  
                  <div className="h-64 relative">
                    {/* Graph lines */}
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {/* Traditional tutoring line (grey) */}
                      <motion.path
                        d="M 0 180 Q 100 170, 200 160 T 400 140"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-muted-foreground/30"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      
                      {/* Mentiora line (blue gradient) */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 0 180 Q 100 140, 200 80 T 400 20"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                      />
                    </svg>
                  </div>

                  <div className="space-y-3 mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                      <span className="text-sm">Mentiora (£14.99/mo)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1 bg-muted-foreground/30 rounded-full" />
                      <span className="text-sm text-muted-foreground">Traditional tutoring (£500/mo)</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">68%</div>
                    <div className="text-sm text-muted-foreground">average grade improvement</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cost Comparison */}
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-green-500/30 shadow-xl bg-gradient-to-br from-card to-green-50/30 dark:to-green-950/20 overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-green-600" />
                    Cost Comparison
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">Traditional Tutoring</span>
                        <span className="text-2xl font-bold text-muted-foreground">£500</span>
                      </div>
                      <div className="h-16 bg-muted-foreground/20 rounded-lg relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-gray-400 to-gray-500"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">per month</div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-semibold">Mentiora</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          £14.99
                        </span>
                      </div>
                      <div className="h-16 bg-blue-500/10 rounded-lg relative overflow-hidden border-2 border-blue-500/30">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "3%" }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">per month</div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-center">
                      Students achieve <span className="font-bold text-blue-600">measurable progress</span> in under 4 weeks — for less than <span className="font-bold text-green-600">5% of the cost</span>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 bg-gradient-to-b from-background via-blue-50/20 to-background dark:via-blue-950/10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by students{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                across the UK
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from learners who turned revision into results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "It feels like a tutor that actually understands me.",
                author: "Maya",
                role: "Year 11",
                gradient: "from-blue-500/10 to-cyan-500/10",
                avatar: "M"
              },
              {
                quote: "My grades jumped from 6 to 8 in three weeks.",
                author: "Ethan",
                role: "GCSE Student",
                gradient: "from-purple-500/10 to-pink-500/10",
                avatar: "E"
              },
              {
                quote: "Finally, a study app that feels personal.",
                author: "Sophie",
                role: "Year 10 Parent",
                gradient: "from-pink-500/10 to-orange-500/10",
                avatar: "S"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className={`relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 h-full bg-gradient-to-br ${testimonial.gradient}`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />
                  
                  <CardContent className="p-8 relative z-10">
                    <div className="mb-6">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 inline" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 inline" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 inline" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 inline" />
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 inline" />
                    </div>
                    
                    <blockquote className="text-lg font-medium mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12 border-2 border-blue-500/30 bg-gradient-to-br from-blue-600 to-purple-600">
                        <AvatarFallback className="text-white font-bold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 relative overflow-hidden"
      >
        {/* Glassmorphism background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              All-in-one{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                personalised revision
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlimited access to GCSE & A-Level subjects — one simple plan.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-2 hover:border-blue-500/50 transition-all duration-300 bg-card/90 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Monthly</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      £14.99
                    </span>
                    <span className="text-muted-foreground ml-2">/ month</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Smart Revision Notebook",
                      "Personalised Grade Tracking",
                      "Weekly Insights & Analytics",
                      "Unlimited Practice Sessions",
                      "All GCSE & A-Level Subjects"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Annual Plan - Featured */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="relative overflow-hidden border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10">
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white flex items-center gap-1"
                  >
                    <Sparkles className="h-3 w-3" />
                    Save 33%
                  </motion.div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-2">Annual</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      £120
                    </span>
                    <span className="text-muted-foreground ml-2">/ year</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Everything in Monthly",
                      "Priority Support",
                      "Early Access to New Features",
                      "Downloadable Progress Reports",
                      "7-Day Money-Back Guarantee"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    No card required • 7-day guarantee
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-24 px-6 bg-background"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  question: "Is Mentiora specific to my exam board?",
                  answer: "Yes — all content is tailored to AQA, Edexcel, and OCR exam boards for both GCSE and A-Level specifications."
                },
                {
                  question: "How are grades predicted?",
                  answer: "Your grades update dynamically after each quiz and practice session, using performance analytics to track improvement across all subjects."
                },
                {
                  question: "Can I cancel anytime?",
                  answer: "Absolutely. You can cancel or switch plans anytime directly from your dashboard settings."
                },
                {
                  question: "Does Mentiora cover all subjects?",
                  answer: "Yes — from Maths and English to Biology, Chemistry, Psychology, and more. All GCSE and A-Level subjects are included."
                },
                {
                  question: "What makes Mentiora unique?",
                  answer: "It's the only platform that combines exam-style practice, real-time personalisation, and live predicted-grade analytics in one intelligent dashboard."
                },
                {
                  question: "Does Mentiora replace tutoring?",
                  answer: "Mentiora works like a tutor — analysing your performance, explaining answers, and helping you focus where it matters most, but at a fraction of the cost."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6 bg-card/50 backdrop-blur-sm">
                  <AccordionTrigger className="text-left font-semibold hover:text-blue-600 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </motion.section>

      {/* Final CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-32 px-6 relative overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        
        {/* Floating sparkles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [0, -100]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants}>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to see your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                grades grow?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of GCSE & A-Level students learning smarter with Mentiora.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-8 text-xl group shadow-2xl"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                <span className="relative z-10 flex items-center gap-3">
                  Start Free Trial
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </Button>
            </motion.div>

            <div className="mt-8 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-lg font-semibold mb-1">
                9 out of 10 students improved by 1 or more grades
              </p>
              <p className="text-sm text-muted-foreground">within 4 weeks</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-6 w-6"
            />
            <span className="font-semibold">Mentiora</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Mentiora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
