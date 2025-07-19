import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award, Calendar, TrendingUp, Clock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
      number: "99.2%", 
      label: "Mark Accuracy", 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      description: "AI marking precision"
    },
    { 
      number: "Instant", 
      label: "Results", 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      description: "Real-time analysis"
    },
    { 
      number: "100%", 
      label: "AQA Coverage", 
      color: "text-purple-600", 
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      description: "Complete curriculum"
    },
    { 
      number: "24/7", 
      label: "Always Available", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-50 to-orange-100",
      description: "Instant feedback"
    }
  ];

  const stats = [
    { 
      number: "95%", 
      label: "Grade Accuracy", 
      color: "text-emerald-600", 
      bg: "bg-gradient-to-br from-emerald-100 to-emerald-200",
      description: "Prediction accuracy"
    },
    { 
      number: "2.1x", 
      label: "Grade Jump", 
      color: "text-blue-600", 
      bg: "bg-gradient-to-br from-blue-100 to-blue-200",
      description: "Average improvement"
    },
    { 
      number: "AI", 
      label: "Smart Marking", 
      color: "text-purple-600", 
      bg: "bg-gradient-to-br from-purple-100 to-purple-200",
      description: "Real mark schemes"
    },
    { 
      number: "24/7", 
      label: "Always Available", 
      color: "text-orange-600", 
      bg: "bg-gradient-to-br from-orange-100 to-orange-200",
      description: "Instant feedback"
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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-24 animate-fade-in">
          <div className="flex items-center space-x-4 hover-scale">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain transition-transform duration-300 hover:rotate-12"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-32 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full text-blue-700 text-sm font-semibold mb-8 animate-fade-in hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600 animate-pulse" />
            The Future of GCSE Revision
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight animate-fade-in">
            <span className="text-gray-900">GCSE Grades</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              That Open Doors
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Our AI tutor creates personalised revision for every major GCSE exam board with 
            <span className="font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-300"> 2026 predicted exam papers updated weekly</span>
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl group hover:scale-105 animate-fade-in"
          >
            Start Your Journey Free
            <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {/* Trust Stats Strip */}
          <div className="mt-16 pt-8 border-t border-gray-100 animate-fade-in">
            <p className="text-sm text-gray-500 font-medium mb-6 text-center">Trusted by students across the UK</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {trustStats.map((stat, index) => (
                <div key={index} className="text-center hover-scale group">
                  <div className={`text-2xl lg:text-3xl font-bold ${stat.color} mb-1 tracking-tight group-hover:scale-110 transition-transform duration-300`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-semibold text-xs uppercase tracking-wide">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-32">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-bold mb-8 hover:scale-105 transition-transform duration-300">
              <Crown className="h-5 w-5 mr-2 text-violet-600 animate-pulse" />
              Premium Features
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything You Need to <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Ace Your GCSEs</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white rounded-3xl hover:-translate-y-2 p-0 animate-fade-in">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-700`} />
                <CardContent className="p-10 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">{feature.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {feature.badge}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works - Simplified */}
        <div className="mb-32">
          <div className="text-center mb-20 animate-fade-in">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Simple. <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Effective.</span> Proven.
            </h3>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorks.map((step, index) => (
                <div key={index} className="text-center group animate-fade-in">
                  <div className={`w-24 h-24 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl mb-8 mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12`}>
                    <step.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className={`text-sm font-bold ${step.accent} mb-4 tracking-wider uppercase group-hover:scale-105 transition-transform duration-300`}>
                    Step {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-700 transition-colors duration-300">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-violet-600 rounded-3xl p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden animate-fade-in hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl" />
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">Ready to Transform Your Grades?</h3>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students achieving their dream grades with AI-powered learning.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-white/25 transition-all duration-300 rounded-2xl group hover:scale-105"
            >
              Start Free Today
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
