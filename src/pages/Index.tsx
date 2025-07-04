
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles, Quote, Zap, Brain, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Smart algorithms adapt to your learning style"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on your weakest areas first"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Progress",
      description: "Track improvements with detailed analytics"
    },
    {
      icon: Trophy,
      title: "Grade Predictions",
      description: "AI predicts your likely exam performance"
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Take Assessment",
      description: "Quick diagnostic to identify knowledge gaps",
      icon: Play
    },
    {
      step: "2", 
      title: "Get Personalized Plan",
      description: "AI creates your custom revision roadmap",
      icon: Target
    },
    {
      step: "3",
      title: "Practice & Improve",
      description: "Work through tailored questions and get instant feedback",
      icon: Zap
    },
    {
      step: "4",
      title: "Track Success",
      description: "Monitor progress and watch your grades improve",
      icon: TrendingUp
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Jumped from C to A* in Biology. The AI feedback is incredibly detailed.",
      rating: 5,
      improvement: "+3 grades"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor 24/7. My maths confidence has soared.",
      rating: 5,
      improvement: "+2 grades"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision. Just got an A in my Chemistry mock!",
      rating: 5,
      improvement: "+4 grades"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Active Students", premium: true },
    { number: "97%", label: "Grade Improvements", premium: true },
    { number: "2.8x", label: "Faster Learning", premium: true },
    { number: "24/7", label: "AI Support", premium: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Premium Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 15,000+ Students Achieving A*s
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-slate-900">Ace Your</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI that learns how you learn. Personalized revision that gets results.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
          >
            Personalise My Revision
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 lg:mb-28 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center relative">
              {stat.premium && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Star className="h-3 w-3 text-white fill-current" />
                </div>
              )}
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
              <div className="text-slate-600 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20 lg:mb-28">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">How It Works</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Your path to GCSE success in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-purple-200 transform -translate-x-1/2"></div>
                )}
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <step.icon className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {step.step}
                </div>
                <h4 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h4>
                <p className="text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-28 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 group">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Testimonials */}
        <div className="mb-20 lg:mb-28">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Real Success Stories</h3>
            <p className="text-xl text-slate-600">Students achieving their dream grades</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-bl-3xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{review.improvement}</span>
                </div>
                <Quote className="h-6 w-6 text-indigo-300 mb-4" />
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic">"{review.content}"</p>
                  <div className="border-t border-slate-100 pt-4">
                    <div className="font-semibold text-slate-900 text-lg">{review.name}</div>
                    <div className="text-indigo-600 font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
              <Trophy className="h-4 w-4 mr-2" />
              Join 15,000+ Students Getting A*s
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to Excel?</h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your personalized revision journey today. Free forever.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-indigo-600 hover:bg-slate-100 px-8 py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
            >
              Personalise My Revision
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
