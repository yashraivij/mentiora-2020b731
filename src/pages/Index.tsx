import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award, Play, Clock, TrendingUp, Calendar, LineChart, MousePointer, Eye, BookCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const howItWorksSteps = [
    {
      step: "01",
      title: "Pick a Topic",
      description: "Choose any subject or topic from the AQA spec",
      icon: MousePointer,
      color: "from-indigo-500 to-purple-600",
      accent: "text-indigo-600"
    },
    {
      step: "02", 
      title: "Answer Questions",
      description: "Get marked instantly using real mark schemes",
      icon: BookCheck,
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-600"
    },
    {
      step: "03",
      title: "Track Progress",
      description: "See predictions, weak spots, and daily goals",
      icon: TrendingUp,
      color: "from-emerald-500 to-cyan-600",
      accent: "text-emerald-600"
    }
  ];

  const premiumFeatures = [
    {
      icon: LineChart,
      title: "Grade Prediction Graph",
      description: "AI-powered grade forecasting based on your performance trends",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
      delay: "100"
    },
    {
      icon: Calendar,
      title: "2026 Predicted Papers",
      description: "Fresh exam papers refreshed weekly, tailored to your exam board",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      delay: "200"
    },
    {
      icon: Clock,
      title: "AI Study Time Optimiser",
      description: "Intelligent scheduling that maximizes your revision efficiency",
      color: "from-emerald-500 to-teal-600",
      bgColor: "from-emerald-50 to-teal-50",
      delay: "300"
    },
    {
      icon: Target,
      title: "Daily Goals + Retention Tracking",
      description: "Personalized goals with spaced repetition for long-term memory",
      color: "from-orange-500 to-red-600", 
      bgColor: "from-orange-50 to-red-50",
      delay: "400"
    }
  ];

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
      icon: Trophy,
      title: "Personalized Path",
      description: "Adaptive learning that evolves with your progress",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 font-inter">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 animate-fade-in">
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
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
                >
                  Try Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 max-w-5xl mx-auto animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold mb-8 hover:scale-105 transition-transform duration-300">
            <Sparkles className="h-4 w-4 mr-2 text-indigo-500 animate-spin" />
            The Future of GCSE Revision
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-gray-900">GCSE Grades</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              That Open Doors
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Our AI tutor creates personalised revision for every major GCSE exam board
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 rounded-2xl group hover:scale-105 animate-pulse"
            >
              Start Your Journey Free
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-gray-300 hover:border-indigo-300 text-gray-700 hover:text-indigo-700 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 glass-effect"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* How It Works - Prominent Section */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Your path to academic excellence in 3 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <Card key={index} className="p-10 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white rounded-3xl group hover:-translate-y-4 relative overflow-hidden glass-effect">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${step.color}`} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-0 relative z-10">
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-125 transition-transform duration-500`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className={`text-sm font-black ${step.accent} mb-4 tracking-widest uppercase`}>Step {step.step}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">{step.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-32 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`relative p-8 ${stat.bg} rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-4 border border-white/50 glass-effect hover-lift`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
                <div className="relative z-10">
                  <div className={`text-4xl lg:text-5xl font-black ${stat.color} mb-3 tracking-tight`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-700 font-bold text-sm mb-2 uppercase tracking-wider">
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

        {/* Premium Features Section */}
        <div className="mb-32" ref={observerRef}>
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Premium Features</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Unlock the full potential of AI-powered learning</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {premiumFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className={`p-8 border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 bg-white rounded-3xl group hover:-translate-y-6 relative overflow-hidden glass-effect ${
                  isVisible ? `animate-fade-in` : 'opacity-0'
                }`}
                style={{ animationDelay: `${feature.delay}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="p-0 relative z-10">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-125 transition-transform duration-500`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Features */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Why This Platform is Like No Other</h3>
            <p className="text-xl text-gray-600">Revolutionary technology that no other platform can match</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl group hover:-translate-y-4 relative overflow-hidden glass-effect">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="p-0 text-center relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 transition-transform duration-300 shadow-xl`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Real Results From Real Students</h3>
            <p className="text-xl text-gray-600">See how students are transforming their grades</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-8 border-2 ${review.accent} shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-3xl group hover:-translate-y-4 relative overflow-hidden glass-effect`}>
                <Quote className="h-8 w-8 text-gray-300 absolute top-8 right-8 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed italic text-lg">"{review.content}"</p>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                    <div className="text-gray-500 font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 rounded-3xl p-12 lg:p-20 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">Ready to Transform Your Grades?</h3>
            <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students who've discovered the power of AI-driven learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={() => navigate('/register')} 
                className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl group hover:scale-110"
              >
                Start Free Today
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
              <Button 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;