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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
            The Future of GCSE Revision
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-gray-900">GCSE Grades</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              That Open Doors
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Our AI tutor creates personalised revision for every major GCSE exam board
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group"
          >
            Start Your Journey Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-24 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`relative p-8 ${stat.bg} rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-white/50`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 tracking-tight`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-bold text-sm mb-1 uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-xs text-gray-600 font-medium">
                    {stat.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features - Primary Focus */}
        <div className="mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          <div className="relative z-10 p-8 lg:p-12">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-semibold mb-6">
                <Crown className="h-4 w-4 mr-2 text-violet-600" />
                Premium Features
              </div>
              <h3 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                Unlock Your Full <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Academic Potential</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Access cutting-edge AI technology that gives you the unfair advantage every top student needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-700 bg-white rounded-3xl hover:-translate-y-3">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
                      {feature.badge}
                    </span>
                  </div>
                  <CardContent className="p-8 relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 rounded-2xl group"
              >
                Get Premium Access
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Core Technology - Differentiated Design */}
        <div className="mb-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 lg:p-12 border border-gray-200">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Revolutionary AI Technology</h3>
            <p className="text-lg text-gray-600">The core innovations that power your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-500 bg-white rounded-xl group hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-50 transition-opacity duration-500`} />
                <CardContent className="p-0 text-center relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works - Clean Process Flow */}
        <div className="mb-24 bg-white">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simple 3-Step Process</h3>
            <p className="text-lg text-gray-600">Get started in minutes, see results in days</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between relative">
              {/* Connection line for desktop */}
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-emerald-200 z-0"></div>
              
              {howItWorks.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative z-10 mb-12 lg:mb-0 lg:flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-xl mb-6 relative`}>
                    <div className="absolute inset-0 bg-white/20 rounded-full"></div>
                    <step.icon className="h-7 w-7 text-white relative z-10" />
                  </div>
                  <div className={`text-xs font-bold ${step.accent} mb-2 tracking-wider uppercase bg-gray-100 px-3 py-1 rounded-full`}>
                    Step {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 max-w-xs">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Real Results From Real Students</h3>
            <p className="text-lg text-gray-600">See how students are transforming their grades</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-6 border-2 ${review.accent} shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-2xl group hover:-translate-y-2 relative overflow-hidden`}>
                <Quote className="h-6 w-6 text-gray-300 absolute top-6 right-6 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed italic">"{review.content}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-gray-500 text-sm font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl" />
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight">Ready to Transform Your Grades?</h3>
            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who've discovered the power of AI-driven learning.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
