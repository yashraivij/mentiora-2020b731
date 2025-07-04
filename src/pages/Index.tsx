
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles, Quote, Zap, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Learning",
      description: "Get instant, personalized feedback on every answer you submit",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on your weak areas with smart question recommendations",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visual analytics showing your improvement over time",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Award,
      title: "Grade Prediction",
      description: "Know exactly where you stand with accurate grade forecasting",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Subject",
      description: "Select from Mathematics, English, Science, and more",
      color: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      step: "2", 
      title: "Practice Questions",
      description: "Answer expertly crafted AQA GCSE questions",
      color: "bg-gradient-to-br from-green-500 to-teal-600"
    },
    {
      step: "3",
      title: "Get AI Feedback",
      description: "Receive detailed explanations and improvement tips",
      color: "bg-gradient-to-br from-orange-500 to-red-600"
    },
    {
      step: "4",
      title: "Track & Improve",
      description: "Monitor your progress and achieve your target grades",
      color: "bg-gradient-to-br from-purple-500 to-pink-600"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed.",
      rating: 5,
      avatar: "bg-gradient-to-br from-pink-400 to-red-500"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence has grown tremendously.",
      rating: 5,
      avatar: "bg-gradient-to-br from-blue-400 to-cyan-500"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      avatar: "bg-gradient-to-br from-green-400 to-emerald-500"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Active Students", color: "text-blue-600" },
    { number: "98%", label: "Pass Rate", color: "text-green-600" },
    { number: "2.8x", label: "Grade Improvement", color: "text-purple-600" },
    { number: "24/7", label: "AI Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-24 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium border border-transparent hover:border-slate-200 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20 lg:mb-28 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Trusted by 15,000+ GCSE Students
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs with AI
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your revision with personalized AI feedback and expert-crafted questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Learning Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-28 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`text-3xl lg:text-4xl font-bold mb-2 ${stat.color}`}>{stat.number}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20 lg:mb-28">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-4 tracking-tight">How It Works</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Get started in minutes and see results in days</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <Card className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-0 text-center">
                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      <span className="text-2xl font-bold text-white">{step.step}</span>
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-y-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-28">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm group">
              <CardContent className="p-0 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20 lg:mb-28">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent mb-4 tracking-tight">Student Success Stories</h3>
            <p className="text-xl text-slate-600">Real results from students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                <CardContent className="p-0 relative">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic">"{review.content}"</p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${review.avatar} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                      <span className="text-white font-bold text-lg">{review.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{review.name}</div>
                      <div className="text-slate-500 text-sm">{review.grade}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
          <div className="relative">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <Trophy className="h-4 w-4 mr-2" />
              Join 15,000+ Successful Students
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to Excel?</h3>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Transform your GCSE results with AI-powered learning that adapts to you.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
