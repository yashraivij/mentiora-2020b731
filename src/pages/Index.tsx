import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  TrendingUp, 
  ArrowRight,
  Menu,
  Brain,
  BarChart3,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  Zap
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

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, 100]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Subtle floating orb */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-b"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-lg font-semibold text-foreground">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </button>
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm">
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")} 
              size="sm" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Start Free Trial
            </Button>
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>
      </motion.nav>

      {/* Hero Section - Pure white with subtle gradient glow */}
      <motion.section 
        style={{ y: heroY }}
        className="relative pt-40 pb-32 px-8 overflow-hidden"
      >
        {/* Subtle radial gradient bottom right */}
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-blue-500/10 via-transparent to-transparent pointer-events-none" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.3, 0],
                y: [0, -100],
                x: [0, Math.random() * 50 - 25]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5
              }}
              className="absolute w-1 h-1 bg-blue-400/60 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${30 + Math.random() * 40}%`
              }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.h1 
              className="text-4xl md:text-5xl font-semibold mb-6 leading-tight tracking-tight text-foreground"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              The GCSE & A-Level tutor built around{" "}
              <span className="text-primary">you</span>.
            </motion.h1>
            
            <motion.p 
              className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Your personalised revision coach — built to understand how you learn.
            </motion.p>
            
            <motion.p 
              className="text-base text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Button 
                onClick={() => navigate("/register")}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={() => navigate("/dashboard")}
                size="lg"
                variant="outline"
                className="px-8"
              >
                Explore Dashboard
              </Button>
            </motion.div>

            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              Trusted by GCSE & A-Level students preparing for 2026 exams
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Section - Off-white background */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-muted/30"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              Designed to make revision <span className="text-primary">personal</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Every student learns differently — Mentiora adapts to you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Brain,
                title: "Smart Revision Notebook",
                description: "Build a study plan that adapts to your weakest topics. Updates automatically after every quiz or practice session.",
                mockup: (
                  <div className="space-y-3">
                    <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-4 w-4 text-red-500" />
                        <span className="text-xs font-semibold text-red-700">Weak Topic</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Quadratic Equations</div>
                      <div className="h-2 bg-red-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "30%" }}
                          animate={{ width: "65%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        <span className="text-xs font-semibold text-blue-700">Improving</span>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Trigonometry</div>
                      <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500" />
                      </div>
                    </div>
                  </div>
                )
              },
              {
                icon: TrendingUp,
                title: "Predicted Grades",
                description: "Watch your grade rise in real time as you improve. Each session refines your predicted mark — motivating you to hit your targets.",
                mockup: (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Current Grade</span>
                      <motion.span 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent"
                      >
                        8
                      </motion.span>
                    </div>
                    <div className="text-xs text-center text-green-600 font-medium flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      ↑ from Grade 7
                    </div>
                    <div className="h-32 flex items-end gap-2">
                      {[6, 7, 7.5, 7.8, 8].map((grade, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(grade / 9) * 100}%` }}
                          transition={{ delay: i * 0.15, duration: 0.6 }}
                          className="flex-1 bg-gradient-to-t from-[#3B82F6] to-[#A78BFA] rounded-t-lg"
                        />
                      ))}
                    </div>
                  </div>
                )
              },
              {
                icon: BarChart3,
                title: "Weekly Insights",
                description: "Track your retention, focus, and best study hours. Mentiora analyses your learning data to help you study smarter, not longer.",
                mockup: (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <span className="text-xs text-gray-600">Retention Rate</span>
                      <span className="text-sm font-bold text-[#3B82F6]">74%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 border border-purple-100">
                      <span className="text-xs flex items-center gap-1 text-gray-600">
                        <Clock className="h-3 w-3" />
                        Study Peak
                      </span>
                      <span className="text-sm font-bold text-[#A78BFA]">7-9 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                      <span className="text-xs text-gray-600">This Week</span>
                      <span className="text-sm font-bold text-green-600">5h 20m</span>
                    </div>
                    <div className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      +2h from last week
                    </div>
                  </div>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-6">
                      <feature.icon className="h-5 w-5 text-primary" strokeWidth={2} />
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                    </div>
                    
                    <div className="mt-6">
                      {feature.mockup}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Dashboard Section - Pure white */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-6 leading-tight text-foreground tracking-tight">
                Built around <span className="text-primary">how you learn</span>
              </h2>
              <p className="text-base text-muted-foreground mb-4 leading-relaxed">
                Your Mentiora dashboard tracks every subject, grade, and goal — adapting automatically to your performance.
              </p>
              <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                See your predicted grades rise, your study patterns evolve, and your retention grow.
              </p>
              <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-xl hover:shadow-blue-500/30 group transition-all duration-300"
                >
                  See How It Works
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              {/* 3D floating card effect */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
                
                <Card className="relative overflow-hidden border border-gray-200/60 shadow-2xl bg-white rounded-3xl">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-bold text-gray-900">Your Dashboard</h3>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-semibold flex items-center gap-1.5 border border-green-100"
                      >
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live
                      </motion.div>
                    </div>

                    <div className="space-y-6">
                      {/* Predicted Grade */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-600">Predicted Grade</span>
                          <TrendingUp className="h-5 w-5 text-green-500" />
                        </div>
                        <motion.div
                          initial={{ scale: 0.8 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", duration: 0.8 }}
                          className="text-6xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent"
                        >
                          8
                        </motion.div>
                        <div className="text-sm text-green-600 font-medium mt-2">
                          ↑ from Grade 7
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                          <div className="text-xs text-gray-600 mb-2">Study Time</div>
                          <div className="text-2xl font-bold text-[#3B82F6]">5h 20m</div>
                          <div className="text-xs text-green-600 font-medium mt-1">+2h this week</div>
                        </div>

                        <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                          <div className="text-xs text-gray-600 mb-2">Retention</div>
                          <div className="text-2xl font-bold text-[#A78BFA]">74%</div>
                          <div className="text-xs text-gray-500 mt-1">↑ improving</div>
                        </div>
                      </div>

                      {/* Study Peak */}
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-600" />
                            <span className="text-sm font-semibold text-gray-700">Study Peak</span>
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

      {/* Personalisation Flow - Light lavender gradient */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-gradient-to-b from-accent/5 to-muted/30"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              Learning that gets <span className="text-primary">smarter every week</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Mentiora uses your performance to refine what you learn next — building a personalised path to your target grade.
            </p>
          </div>

          <div className="relative">
            {/* Connecting gradient line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] transform -translate-y-1/2 hidden md:block opacity-20" />
            
            <div className="grid md:grid-cols-3 gap-10 relative z-10">
              {[
                {
                  icon: Target,
                  title: "Assess",
                  description: "Mentiora analyses your quiz results and answers",
                  color: "from-[#3B82F6] to-cyan-500"
                },
                {
                  icon: Zap,
                  title: "Adapt",
                  description: "Weak topics are updated in your Smart Notebook",
                  color: "from-[#A78BFA] to-pink-500"
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
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-8 text-center">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${step.color} text-white mb-6`}>
                        <step.icon className="h-6 w-6" strokeWidth={2} />
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Comparison Section - Pure white */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-background"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              Smarter than tutoring — <span className="text-primary">95% cheaper</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Personalised, data-driven learning designed to outperform private tuition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Grade Improvement Graph */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
                    <TrendingUp className="h-5 w-5 text-primary" strokeWidth={2} />
                    Grade Improvement
                  </h3>
                  
                  <div className="h-64 relative mb-8">
                    {/* Graph lines */}
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      {/* Traditional tutoring line (grey) */}
                      <motion.path
                        d="M 0 180 Q 100 170, 200 160 T 400 140"
                        fill="none"
                        stroke="#9CA3AF"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                      
                      {/* Mentiora line (blue gradient) */}
                      <defs>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#A78BFA" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        d="M 0 180 Q 100 140, 200 80 T 400 20"
                        fill="none"
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
                      />
                    </svg>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1 bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] rounded-full" />
                      <span className="text-sm text-gray-700">Mentiora (£14.99/mo)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-1 bg-gray-300 rounded-full" />
                      <span className="text-sm text-gray-500">Traditional tutoring (£500/mo)</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-green-50 border border-green-100 text-center">
                    <div className="text-4xl font-bold text-green-600 mb-1">68%</div>
                    <div className="text-sm text-gray-600">average grade improvement</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Cost Comparison */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Card className="h-full">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-foreground">
                    <Sparkles className="h-5 w-5 text-primary" strokeWidth={2} />
                    Cost Comparison
                  </h3>
                  
                  <div className="space-y-8 mb-8">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">Traditional Tutoring</span>
                        <span className="text-2xl font-bold text-gray-400">£500</span>
                      </div>
                      <div className="h-16 bg-gray-100 rounded-xl relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-gray-300 to-gray-400"
                        />
                      </div>
                      <div className="text-xs text-gray-400 mt-2">per month</div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">Mentiora</span>
                        <span className="text-xl font-semibold text-primary">£14.99</span>
                      </div>
                      <div className="h-16 bg-blue-50 rounded-xl relative overflow-hidden border border-blue-100">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "3%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA]"
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">per month</div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                    <p className="text-sm text-center text-gray-700 leading-relaxed">
                      Students achieve <span className="font-bold text-[#3B82F6]">measurable progress</span> in under 4 weeks — for less than <span className="font-bold text-green-600">5% of the cost</span>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section - Light blue mist */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-muted/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              Loved by students <span className="text-primary">across the UK</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Real stories from learners who turned revision into results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "It feels like a tutor that actually understands me.",
                author: "Maya",
                role: "Year 11",
                avatar: "M",
                accentColor: "from-[#3B82F6] to-cyan-500"
              },
              {
                quote: "My grades jumped from 6 to 8 in three weeks.",
                author: "Ethan",
                role: "GCSE Student",
                avatar: "E",
                accentColor: "from-[#A78BFA] to-pink-500"
              },
              {
                quote: "Finally, a study app that feels personal.",
                author: "Sophie",
                role: "Year 10 Parent",
                avatar: "S",
                accentColor: "from-pink-500 to-orange-500"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  {/* Gradient accent line on top */}
                  <div className={`h-1 bg-gradient-to-r ${testimonial.accentColor}`} />
                  
                  <CardContent className="p-6">
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    
                    <blockquote className="text-base mb-6 leading-relaxed text-foreground">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center gap-4">
                      <Avatar className={`h-12 w-12 border-2 bg-gradient-to-br ${testimonial.accentColor}`}>
                        <AvatarFallback className="text-white font-bold bg-transparent">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.author}</div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Pricing Section - Light gradient */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-32 px-8 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-white"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              All-in-one <span className="text-primary">personalised revision</span>
            </h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlimited access to GCSE & A-Level subjects — one simple plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Monthly</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-semibold text-primary">£14.99</span>
                    <span className="text-muted-foreground ml-2">/ month</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Smart Revision Notebook",
                      "Personalised Grade Tracking",
                      "Weekly Insights & Analytics",
                      "Unlimited Practice Sessions",
                      "All GCSE & A-Level Subjects"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Annual Plan - Featured */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card className="h-full border-primary shadow-lg">
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-xs font-medium text-primary flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Save 33%
                  </div>
                </div>
                
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-3 text-foreground">Annual</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-semibold text-primary">£120</span>
                    <span className="text-muted-foreground ml-2">/ year</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {[
                      "Everything in Monthly",
                      "Priority Support",
                      "Early Access to New Features",
                      "Downloadable Progress Reports",
                      "7-Day Money-Back Guarantee"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    No card required • 7-day guarantee
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <p className="text-center text-muted-foreground mt-10 text-sm">
            No card required • Cancel anytime • 7-day money-back guarantee
          </p>
        </div>
      </motion.section>

      {/* FAQ Section - Pure white */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-24 px-8 bg-background"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-foreground tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

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
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="border border-gray-200 rounded-2xl px-6 bg-white hover:bg-gray-50/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-[#3B82F6] transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </motion.section>

      {/* Final CTA - Lavender to blue gradient */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-150px" }}
        variants={fadeInUp}
        className="py-32 px-8 relative overflow-hidden bg-gradient-to-br from-accent/10 to-background"
      >
        {/* Gentle floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
              y: [0, -80]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.4
            }}
            className="absolute w-2 h-2 bg-blue-400/40 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              bottom: `${Math.random() * 50}%`
            }}
          />
        ))}

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 leading-tight text-foreground tracking-tight">
            Ready to see your <span className="text-primary">grades grow?</span>
          </h2>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of GCSE & A-Level students learning smarter with Mentiora.
          </p>

          <Button 
            onClick={() => navigate("/register")}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-12"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="mt-10 p-6 rounded-2xl bg-card/80 backdrop-blur-sm border max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-base font-semibold mb-1 text-foreground">
              9 out of 10 students improved by 1 or more grades
            </p>
            <p className="text-sm text-muted-foreground">within 4 weeks</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t py-10 px-8 bg-background">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-6 w-6"
            />
            <span className="font-semibold text-base text-foreground">Mentiora</span>
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
