import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award, Calendar, TrendingUp, Clock, Crown, GraduationCap, TimerIcon, TrendingUpIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Brain,
      title: "AI Feedback", 
      description: "Revolutionary AI that understands your learning style",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights that predict your exam success",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: Target,
      title: "Personalized Path",
      description: "Adaptive learning that evolves with your progress",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject & Topic",
      description: "Pick your AQA GCSE subject and the exact topic you want to master.",
      icon: Target,
      color: "from-blue-500 to-purple-600",
      accent: "text-blue-600"
    },
    {
      step: "02",
      title: "Answer Real Exam Questions",
      description: "Get exam-style questions that match your spec and practice just like the real thing.",
      icon: Zap,
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-600"
    },
    {
      step: "03",
      title: "Get Instant Marking & Feedback",
      description: "See exactly what the examiner wants, where you lost marks, and how to improve.",
      icon: Award,
      color: "from-emerald-500 to-cyan-600",
      accent: "text-emerald-600"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "This platform is absolutely revolutionary. The AI feedback is more detailed than my actual teachers - went from struggling with C grades to confidently achieving A* in just 3 months.",
      rating: 5,
      color: "from-blue-50 to-indigo-50",
      accent: "border-blue-200"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "I've never seen anything like this before. It's like having the world's best tutor available 24/7. My parents are amazed at how much my confidence has grown.",
      rating: 5,
      color: "from-purple-50 to-pink-50",
      accent: "border-purple-200"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "The personalized learning is incredible - it knows exactly what I need to work on. Just achieved an A in my Chemistry mock exam after struggling for months!",
      rating: 5,
      color: "from-emerald-50 to-teal-50",
      accent: "border-emerald-200"
    }
  ];

  const trustStats = [
    { 
      number: "2.3", 
      label: "Grades Higher", 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      description: "Average grade improvement",
      icon: TrendingUpIcon
    },
    { 
      number: "67%", 
      label: "Study Time Saved", 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      description: "Efficient learning",
      icon: TimerIcon
    },
    { 
      number: "94%", 
      label: "Achieve Target Grade", 
      color: "text-purple-600", 
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      description: "Student success rate",
      icon: Target
    },
    { 
      number: "3 Weeks", 
      label: "To See Results", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      description: "Fastest improvements",
      icon: Zap
    }
  ];

  const impactStats = [
    { 
      number: "£2,847", 
      label: "Tuition Savings", 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      description: "vs private tutoring",
      icon: Trophy
    },
    { 
      number: "89%", 
      label: "Faster Learning", 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-100 to-blue-200",
      description: "Compared to textbooks",
      icon: Brain
    },
    { 
      number: "A*-A", 
      label: "Typical Result", 
      color: "text-purple-600", 
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
      description: "After 8 weeks",
      icon: GraduationCap
    },
    { 
      number: "24/7", 
      label: "AI Availability", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-100 to-orange-200",
      description: "Never wait for help",
      icon: Clock
    }
  ];

  const premiumFeatures = [
    {
      icon: Calendar,
      title: "2026 Predicted Exam Papers",
      description: "Access weekly refreshed predicted exam papers built from our advanced AI analysis of past papers and mark schemes",
      badge: "Updated Weekly",
      color: "from-violet-600 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      premium: true
    },
    {
      icon: TrendingUp,
      title: "Grade Prediction Graph",
      description: "Real-time grade predictions with confidence intervals based on your performance data and learning trajectory",
      badge: "AI-Powered",
      color: "from-emerald-600 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      premium: true
    },
    {
      icon: Clock,
      title: "AI Study Time Optimizer",
      description: "Intelligent scheduling that maximizes your learning efficiency by analyzing your peak performance hours",
      badge: "Smart Planning",
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      premium: true
    },
    {
      icon: Trophy,
      title: "Daily Goals + Retention Tracking",
      description: "Personalized daily targets with spaced repetition algorithms to ensure long-term knowledge retention",
      badge: "Proven Method",
      color: "from-amber-600 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-24"
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
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
          </motion.div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            {user ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="lg"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-8 py-3 rounded-2xl transition-all duration-300"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg"
                    onClick={() => navigate('/register')} 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
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
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="h-4 w-4 mr-2 text-blue-600 animate-pulse" />
            The Future of GCSE Revision
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight"
          >
            <span className="text-gray-900">Transform Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSE Results
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed"
          >
            Students using our AI improve by <span className="font-bold text-emerald-600">2.3 grades on average</span> while studying <span className="font-bold text-blue-600">67% less time</span>. 
            Join the revolution with <span className="font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300">2026 predicted papers</span>
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl group"
            >
              Start Your Journey Free
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          {/* Trust Stats Strip */}
          <motion.div 
            ref={statsRef}
            initial={{ opacity: 0, y: 40 }}
            animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 pt-8 border-t border-gray-100"
          >
            <p className="text-sm text-gray-500 font-medium mb-8 text-center">Proven Results From Real Students</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {trustStats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="text-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.bg} rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 tracking-tight`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-900 font-semibold text-sm mb-1">
                    {stat.label}
                  </div>
                  <div className="text-gray-500 text-xs">
                    {stat.description}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          ref={featuresRef}
          className="mb-32"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-bold mb-8"
            >
              <Crown className="h-5 w-5 mr-2 text-violet-600 animate-pulse" />
              Premium AI Features
            </motion.div>
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything You Need to <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Dominate Your GCSEs</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology that adapts to your learning style and accelerates your progress
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white rounded-3xl p-0 h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-15 transition-opacity duration-700`} />
                  <div className="absolute top-4 right-4">
                    <motion.span 
                      className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white shadow-lg`}
                      whileHover={{ scale: 1.1 }}
                    >
                      {feature.badge}
                    </motion.span>
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start space-x-6">
                      <motion.div 
                        className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ scale: 1.1, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">{feature.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div 
          ref={impactRef}
          className="mb-32 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-16"
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={impactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              The <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Real Impact</span> On Your Future
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how students transform their academic journey with measurable results
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={impactInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.9 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center group cursor-pointer"
              >
                <motion.div 
                  className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${stat.bg} rounded-3xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500`}
                  whileHover={{ rotate: 12 }}
                >
                  <stat.icon className={`h-10 w-10 ${stat.color}`} />
                </motion.div>
                <div className={`text-4xl lg:text-5xl font-bold ${stat.color} mb-3 tracking-tight`}>
                  {stat.number}
                </div>
                <div className="text-gray-900 font-bold text-lg mb-2">
                  {stat.label}
                </div>
                <div className="text-gray-600 text-sm">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works - Simplified */}
        <div className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Simple. <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Effective.</span> Proven.
            </h3>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorks.map((step, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="text-center group"
                >
                  <motion.div 
                    className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl mb-8 mx-auto`}
                    whileHover={{ scale: 1.1, rotate: 12 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <step.icon className="h-12 w-12 text-white" />
                  </motion.div>
                  <div className={`text-sm font-bold ${step.accent} mb-4 tracking-wider uppercase`}>
                    Step {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>


        {/* Final CTA */}
        <motion.div 
          ref={ctaRef}
          initial={{ opacity: 0, y: 50 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-3xl p-16 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl" />
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl"
            animate={{ 
              background: [
                "linear-gradient(to right, rgba(37, 99, 235, 0.2), rgba(147, 51, 234, 0.2))",
                "linear-gradient(to right, rgba(147, 51, 234, 0.2), rgba(37, 99, 235, 0.2))",
                "linear-gradient(to right, rgba(37, 99, 235, 0.2), rgba(147, 51, 234, 0.2))"
              ]
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
              className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Join over 10,000 students who've improved their grades by an average of <span className="font-bold text-white">2.3 levels</span> with our AI-powered platform.
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
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 rounded-2xl group"
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
