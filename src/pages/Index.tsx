
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles, Quote, Brain, Zap, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "Smart Questions",
      description: "AI-curated questions that adapt to your learning level",
      gradient: "from-violet-500 to-purple-600"
    },
    {
      icon: Zap,
      title: "Instant Feedback",
      description: "Get detailed explanations the moment you answer",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Visual insights into your improvement journey",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Award,
      title: "Grade Prediction",
      description: "Know where you stand before exam day",
      gradient: "from-orange-500 to-red-600"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject",
      description: "Pick from all major GCSE subjects",
      icon: BookOpen
    },
    {
      step: "02", 
      title: "Practice Questions",
      description: "Answer expertly crafted questions",
      icon: Target
    },
    {
      step: "03",
      title: "Get AI Feedback",
      description: "Receive instant detailed explanations",
      icon: Sparkles
    },
    {
      step: "04",
      title: "Track & Improve",
      description: "Monitor progress and achieve your goals",
      icon: Trophy
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Achieved A* in Biology after 3 months. The feedback is incredibly detailed.",
      rating: 5,
      avatar: "SM"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor 24/7. My maths confidence has soared.",
      rating: 5,
      avatar: "JK"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision. Just got an A in my Chemistry mock!",
      rating: 5,
      avatar: "EL"
    }
  ];

  const stats = [
    { number: "25,000+", label: "Active Students", color: "text-violet-600" },
    { number: "98%", label: "Pass Rate", color: "text-emerald-600" },
    { number: "2.8x", label: "Grade Jump", color: "text-blue-600" },
    { number: "24/7", label: "AI Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-violet-600 hover:bg-violet-50 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 25,000+ GCSE Students
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-violet-800 to-purple-800 bg-clip-text text-transparent">
              Ace Your GCSEs
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered revision that transforms how you learn. Join thousands achieving their dream grades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-8 py-4 text-lg font-medium"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-violet-800 bg-clip-text text-transparent mb-4">
              Why Students Love Us
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to excel in your GCSEs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-violet-800 bg-clip-text text-transparent mb-4">
              How It Works
            </h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start improving your grades in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                <div className="bg-gradient-to-r from-violet-100 to-purple-100 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 -mt-16 pt-4">
                  <item.icon className="h-8 w-8 text-violet-600" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-600">{item.description}</p>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-violet-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-violet-800 bg-clip-text text-transparent mb-4">
              Student Success Stories
            </h3>
            <p className="text-xl text-slate-600">Real results from students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500"></div>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{review.name}</div>
                      <div className="text-slate-500 text-sm">{review.grade}</div>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">"{review.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-violet-900 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Excel?</h3>
          <p className="text-xl text-violet-200 mb-8 max-w-2xl mx-auto">
            Join thousands transforming their grades with AI-powered learning
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            size="lg"
            className="bg-white text-violet-900 hover:bg-violet-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
