import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Brain,
      title: "Smart Feedback", 
      description: "Revolutionary insights that understand your learning style",
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
      title: "Pick Your Subject",
      description: "Choose your subject and the exact topic you want to master.",
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
      content: "This platform saved me £2,400 on private tutoring! The personalized feedback is incredible - it knows exactly what I struggle with and adapts to my learning style. Went from C grades to A* in just 3 months while studying 60% less time.",
      rating: 5,
      color: "from-blue-50 to-indigo-50",
      accent: "border-blue-200"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "The personalization is mind-blowing - it's like having a tutor who knows me better than I know myself. I'm saving 15 hours a week compared to traditional revision and my grades have jumped from grade 5s to 8s consistently.",
      rating: 5,
      color: "from-purple-50 to-pink-50",
      accent: "border-purple-200"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "My parents love that we're saving thousands on tutoring while I'm getting better results than ever. The platform personalizes everything to my weak spots - achieved grade 9 in Chemistry after struggling with grade 6s for months!",
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
      number: "£2,847", 
      label: "Tuition Savings", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      description: "vs private tutoring",
      icon: Trophy
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
      number: "Grade 9", 
      label: "Typical Result", 
      color: "text-purple-600", 
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
      description: "After 8 weeks",
      icon: GraduationCap
    },
    { 
      number: "24/7", 
      label: "Support Availability", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-100 to-orange-200",
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
      color: "from-violet-600 to-purple-600",
      bgColor: "from-violet-50 to-purple-50",
      premium: true
    },
    {
      icon: BookOpen,
      title: "Smart Revision Notebook",
      description: "Automatically generated notes tailored to your learning style and exam board requirements",
      badge: "Personalized",
      color: "from-emerald-600 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      premium: true
    },
    {
      icon: Calendar,
      title: "Predicted Exams",
      description: "Access weekly refreshed predicted exam papers built from our advanced analysis of past papers",
      badge: "Updated Weekly",
      color: "from-blue-600 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      premium: true
    },
    {
      icon: Clock,
      title: "Study Time Optimizer",
      description: "Scheduling that maximizes your learning efficiency by analyzing your peak performance hours",
      badge: "Smart Planning",
      color: "from-amber-600 to-orange-600",
      bgColor: "from-amber-50 to-orange-50",
      premium: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 sm:mb-16 lg:mb-24 pt-12"
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
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
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
          
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              The GCSE Tutor Built For You.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            Every <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent font-bold">question</span> powers a <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">personalised plan</span> for <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent font-bold">top grades</span>.
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl mobile-touch-target"
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






        {/* Feature Showcase - Duolingo/Quizlet Style */}
        <div className="mb-16 sm:mb-24 lg:mb-32">
          {/* First Feature - Smart Practice */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 sm:mb-16 lg:mb-24"
          >
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
                <div className="space-y-6 sm:space-y-8 px-2 sm:px-0">
                  <motion.h3 
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight"
                    whileHover={{ scale: 1.02 }}
                  >
                    Every question, every answer,{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      one ultimate study experience
                    </span>
                  </motion.h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                    Practice with real exam questions from past papers, get instant feedback, and watch your understanding grow with every answer.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 mobile-touch-target w-full sm:w-auto"
                    >
                      Start Practicing Free
                    </Button>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="flex-1 bg-gray-100 rounded-full h-6 flex items-center px-4">
                          <span className="text-sm text-gray-500">Chemistry Practice</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="text-lg font-semibold text-gray-900">Question 1 of 12</div>
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-gray-700">What is the formula for calculating the rate of reaction?</p>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-3 text-emerald-800">
                            ✓ Rate = Change in concentration / Time
                          </div>
                          <div className="bg-gray-50 border rounded-lg p-3 text-gray-600">Rate = Time / Change in concentration</div>
                        </div>
                        <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                            <CheckCircle className="h-5 w-5" />
                            Correct! Well done.
                          </div>
                          <p className="text-sm text-emerald-600">You're mastering rate calculations. This type of question appears frequently in Paper 2.</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div 
                  className="relative lg:order-1"
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold text-gray-900">Smart Revision Notebook</h4>
                        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">Auto-Generated</div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-emerald-600" />
                            <div className="font-semibold text-gray-900">Chemical Bonding</div>
                          </div>
                          <div className="text-sm text-gray-700 leading-relaxed">
                            <strong>Key Points:</strong> Ionic bonds form between metals and non-metals through electron transfer. The electrostatic attraction between oppositely charged ions creates the bond.
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <div className="font-semibold text-blue-900">Your Learning Style</div>
                          </div>
                          <div className="text-sm text-blue-700">
                            Visual diagrams and step-by-step examples work best for you
                          </div>
                        </div>
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-amber-600" />
                            <div className="font-semibold text-amber-900">Exam Focus</div>
                          </div>
                          <div className="text-sm text-amber-700">
                            Practice drawing dot-and-cross diagrams for ionic compounds
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                        <div className="flex items-center gap-2 text-emerald-700 font-semibold mb-2">
                          <Sparkles className="h-5 w-5" />
                          Updated for Your Progress
                        </div>
                        <p className="text-sm text-emerald-600">Notes automatically updated based on your latest practice sessions and weak areas.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <div className="space-y-8 lg:order-2">
                  <motion.h3 
                    className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
                    whileHover={{ scale: 1.02 }}
                  >
                    Your{" "}
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      smart revision
                    </span>{" "}
                    notebook
                  </motion.h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Get automatically generated, personalized revision notes tailored to your learning style and exam board. Save hours of note-taking and focus on what matters most for your exams.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Generate My Notes
                    </Button>
                  </motion.div>
                </div>
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
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <motion.h3 
                    className="text-5xl lg:text-6xl font-bold leading-tight"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Stay motivated
                    </span>{" "}
                    with every question
                  </motion.h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Track your progress, celebrate wins, and watch your grades improve with detailed analytics that show exactly how close you are to your target grades.
                  </p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => navigate('/register')} 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Your Journey
                    </Button>
                  </motion.div>
                </div>
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.02, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-8 shadow-2xl">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Trophy className="h-12 w-12 text-white" />
                        </div>
                        <h4 className="text-2xl font-bold text-gray-900 mb-2">Streak Master!</h4>
                        <p className="text-gray-600">7 days in a row 🔥</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">124</div>
                          <div className="text-xs text-blue-500">Questions</div>
                        </div>
                        <div className="text-center p-3 bg-emerald-50 rounded-xl">
                          <div className="text-2xl font-bold text-emerald-600">89%</div>
                          <div className="text-xs text-emerald-500">Accuracy</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-xl">
                          <div className="text-2xl font-bold text-purple-600">Grade 8</div>
                          <div className="text-xs text-purple-500">Predicted</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress to Grade 9</span>
                          <span className="text-purple-600 font-semibold">87%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full" style={{width: '87%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  at a fraction of the cost
                </span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Trained to be more effective than personal tutoring, at just 5% of the cost of private tuition.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left side - Graph */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-xl">
                <div className="mb-8">
                  <h4 className="text-2xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      68% grade improvement
                    </span>
                  </h4>
                </div>
                
                {/* Graph */}
                <div className="relative h-80">
                  {/* Y-axis label */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-sm text-gray-500 whitespace-nowrap origin-center">
                    Average grades
                  </div>
                  
                  {/* Graph area */}
                  <div className="ml-12 h-full flex flex-col justify-end pb-12 relative">
                    {/* Personalized education line */}
                    <div className="absolute bottom-12 left-0 right-0 h-full">
                      <svg viewBox="0 0 400 200" className="w-full h-full">
                        <defs>
                          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                          </linearGradient>
                        </defs>
                        {/* Personalized curve */}
                        <path 
                          d="M 0 180 Q 100 100, 200 40 T 400 20" 
                          stroke="url(#blueGradient)" 
                          strokeWidth="4" 
                          fill="none"
                          strokeLinecap="round"
                        />
                        {/* Non-personal curve */}
                        <path 
                          d="M 0 180 Q 100 140, 200 110 T 400 90" 
                          stroke="#D1D5DB" 
                          strokeWidth="4" 
                          fill="none"
                          strokeLinecap="round"
                        />
                      </svg>
                      
                      {/* Labels */}
                      <div className="absolute top-8 right-8 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                        <span className="text-sm font-semibold text-gray-900">Personalised education</span>
                      </div>
                      
                      <div className="absolute bottom-16 right-8 flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-100">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span className="text-sm font-semibold text-gray-600">Non-personal education</span>
                      </div>
                    </div>
                    
                    {/* X-axis label */}
                    <div className="text-center text-sm text-gray-500 mt-4">
                      Hours spent learning
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Price comparison */}
              <div className="lg:col-span-1 space-y-6">
                {/* Personal tutoring card */}
                <motion.div 
                  className="bg-gray-100 rounded-2xl p-6 text-center"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-5xl font-bold text-gray-400 mb-2">£500</div>
                  <div className="text-gray-500 text-sm">/month</div>
                  <div className="mt-4 text-gray-600 font-semibold">Personal tutoring</div>
                </motion.div>

                {/* Mentiora card */}
                <motion.div 
                  className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-6 text-center text-white shadow-xl"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-5xl font-bold mb-2">£9.99</div>
                  <div className="text-blue-100 text-sm">/month</div>
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
                  
                  <div className="mt-6 pt-6 border-t border-blue-400/30">
                    <div className="text-2xl font-bold mb-4">
                      95% cheaper than private tutoring
                    </div>
                    <Button
                      onClick={() => navigate('/register')}
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                    >
                      Start Free Trial
                    </Button>
                    <p className="text-xs text-blue-100 mt-2">First 7 days free, then £9.99/month</p>
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
              Join thousands of students who've improved their grades by an average of <span className="font-bold text-white">two full grade boundaries</span> with our smart platform.
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
