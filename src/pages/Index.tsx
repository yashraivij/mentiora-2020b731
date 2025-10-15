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
    <div className="min-h-screen bg-white overflow-x-hidden">
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
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-gray-900">
              Mentiora
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => navigate("/pricing")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate("/dashboard")} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Dashboard
            </button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              FAQ
            </button>
            <Button onClick={() => navigate("/login")} variant="ghost" size="sm" className="text-gray-600">
              Login
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => navigate("/register")} 
                size="sm" 
                className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              >
                Start Free Trial
              </Button>
            </motion.div>
          </div>

          <button className="md:hidden">
            <Menu className="h-6 w-6 text-gray-600" />
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
              className="text-6xl md:text-8xl font-extrabold mb-8 leading-[1.05] tracking-tight text-gray-900"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              The GCSE & A-Level<br />tutor built around{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                  you
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="absolute bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                />
              </span>
              .
            </motion.h1>
            
            <motion.p 
              className="text-2xl md:text-3xl text-gray-600 mb-5 max-w-4xl mx-auto leading-relaxed font-light tracking-wide"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Your personalised revision coach — built to understand how you learn.
            </motion.p>
            
            <motion.p 
              className="text-lg text-gray-500 mb-16 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Mentiora tracks your progress, predicts your grades, and creates a plan that evolves with every answer.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="relative bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-xl hover:shadow-blue-500/30 text-white px-10 py-7 text-lg font-semibold group transition-all duration-300"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  variant="outline"
                  className="px-10 py-7 text-lg font-medium border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300"
                >
                  Explore Dashboard
                </Button>
              </motion.div>
            </motion.div>

            <motion.p 
              className="text-sm text-gray-400 font-light"
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
        className="py-32 px-8 bg-[#F8FAFC]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Designed to make revision{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                personal
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
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
                <Card className="relative overflow-hidden border border-gray-200/60 bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 h-full rounded-3xl">
                  <CardContent className="p-10">
                    <motion.div
                      whileHover={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.5 }}
                      className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-[#3B82F6]/10 to-[#A78BFA]/10 mb-8"
                    >
                      <feature.icon className="h-7 w-7 text-[#3B82F6]" strokeWidth={1.5} />
                    </motion.div>
                    
                    <div className="mb-6 pb-6 border-b border-gray-100">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
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
        className="py-32 px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight text-gray-900 tracking-tight">
                Built around{" "}
                <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                  how you learn
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed font-light tracking-wide">
                Your Mentiora dashboard tracks every subject, grade, and goal — adapting automatically to your performance.
              </p>
              <p className="text-lg text-gray-500 mb-10 leading-relaxed">
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
        className="py-32 px-8 bg-gradient-to-b from-[#F3F0FF] to-[#F8FAFC]"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Learning that gets{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                smarter every week
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
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
                  <Card className="border border-gray-200/60 bg-white hover:shadow-xl transition-all duration-300 rounded-3xl h-full">
                    <CardContent className="p-10 text-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 3, 
                          repeat: Infinity,
                          delay: index * 0.3
                        }}
                        className={`inline-flex p-6 rounded-full bg-gradient-to-br ${step.color} text-white mb-8 shadow-lg`}
                      >
                        <step.icon className="h-8 w-8" strokeWidth={2} />
                      </motion.div>
                      
                      <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
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
        className="py-32 px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Smarter than tutoring —{" "}
              <span className="bg-gradient-to-r from-green-600 to-[#3B82F6] bg-clip-text text-transparent">
                95% cheaper
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto font-light leading-relaxed tracking-wide">
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
              <Card className="border border-gray-200/60 shadow-xl bg-white rounded-3xl overflow-hidden h-full">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                    <TrendingUp className="h-6 w-6 text-[#3B82F6]" strokeWidth={2} />
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
              <Card className="border border-gray-200/60 shadow-xl bg-white rounded-3xl overflow-hidden h-full">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-gray-900">
                    <Sparkles className="h-6 w-6 text-green-600" strokeWidth={2} />
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
                        <span className="text-sm font-semibold text-gray-700">Mentiora</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                          £14.99
                        </span>
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
        className="py-32 px-8 bg-[#F9FBFF]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
              Loved by students{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                across the UK
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
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
                <Card className="relative overflow-hidden border border-gray-200/60 bg-white hover:shadow-xl transition-all duration-300 h-full rounded-3xl">
                  {/* Gradient accent line on top */}
                  <div className={`h-1 bg-gradient-to-r ${testimonial.accentColor}`} />
                  
                  <CardContent className="p-8">
                    <div className="mb-6 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    
                    <blockquote className="text-lg font-medium mb-8 leading-relaxed text-gray-700">
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
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
              All-in-one{" "}
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                personalised revision
              </span>
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed tracking-wide">
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
              <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-[#3B82F6]/50 transition-all duration-300 bg-white/90 backdrop-blur-sm rounded-3xl h-full">
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Monthly</h3>
                  <div className="mb-8">
                    <span className="text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                      £14.99
                    </span>
                    <span className="text-gray-500 ml-2">/ month</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      "Smart Revision Notebook",
                      "Personalised Grade Tracking",
                      "Weekly Insights & Analytics",
                      "Unlimited Practice Sessions",
                      "All GCSE & A-Level Subjects"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] hover:shadow-lg transition-all"
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
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
              <Card className="relative overflow-hidden border-2 border-[#3B82F6] shadow-2xl shadow-blue-500/20 bg-white rounded-3xl h-full">
                <div className="absolute top-4 right-4">
                  <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-xs font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Save 33%
                  </div>
                </div>
                
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Annual</h3>
                  <div className="mb-8">
                    <span className="text-5xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#A78BFA] bg-clip-text text-transparent">
                      £120
                    </span>
                    <span className="text-gray-500 ml-2">/ year</span>
                  </div>
                  
                  <ul className="space-y-4 mb-10">
                    {[
                      "Everything in Monthly",
                      "Priority Support",
                      "Early Access to New Features",
                      "Downloadable Progress Reports",
                      "7-Day Money-Back Guarantee"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-[#3B82F6] shrink-0 mt-0.5" strokeWidth={2} />
                        <span className="text-sm font-medium text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={() => navigate("/register")}
                    className="w-full bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] hover:shadow-xl hover:shadow-blue-500/30 bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all"
                    size="lg"
                  >
                    Start Free Trial
                  </Button>
                  
                  <p className="text-xs text-center text-gray-400 mt-4">
                    No card required • 7-day guarantee
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <p className="text-center text-gray-500 mt-12 text-sm">
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
        className="py-32 px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 tracking-tight">
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
        className="py-40 px-8 relative overflow-hidden bg-gradient-to-br from-[#A78BFA]/10 via-[#3B82F6]/10 to-white"
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
          <h2 className="text-6xl md:text-7xl font-extrabold mb-8 leading-tight text-gray-900 tracking-tight">
            Ready to see your{" "}
            <span className="bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] bg-clip-text text-transparent">
              grades grow?
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            Join thousands of GCSE & A-Level students learning smarter with Mentiora.
          </p>

          <motion.div
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => navigate("/register")}
              size="lg"
              className="bg-gradient-to-r from-[#3B82F6] via-[#A78BFA] to-[#3B82F6] hover:shadow-2xl hover:shadow-blue-500/40 text-white px-14 py-8 text-xl font-semibold group bg-[length:200%_100%] hover:bg-[position:100%_0] transition-all duration-500"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>

          <div className="mt-12 p-8 rounded-3xl bg-white/80 backdrop-blur-sm border border-gray-200/60 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-6 w-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-lg font-semibold mb-2 text-gray-900">
              9 out of 10 students improved by 1 or more grades
            </p>
            <p className="text-sm text-gray-500">within 4 weeks</p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-200/60 py-12 px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
              alt="Mentiora" 
              className="h-7 w-7"
            />
            <span className="font-bold text-lg text-gray-900">Mentiora</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2025 Mentiora. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
