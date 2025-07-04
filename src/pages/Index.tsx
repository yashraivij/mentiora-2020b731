
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Zap, Target, Award, ArrowRight, Star, Sparkles, Trophy, Play, BookOpen, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Advanced algorithms analyze your performance and deliver personalized learning pathways",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: Zap,
      title: "Instant Expert Feedback",
      description: "Get detailed explanations and improvement strategies within seconds of answering",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    {
      icon: Target,
      title: "Exam-Perfect Questions",
      description: "Practice with authentic AQA GCSE questions vetted by top examiners and teachers",
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-50 to-teal-50"
    },
    {
      icon: Award,
      title: "Grade Prediction Engine",
      description: "Sophisticated analytics predict your exam performance and guide you to A* success",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    }
  ];

  const howItWorks = [
    {
      icon: Play,
      title: "Start Practicing",
      description: "Choose your subject and begin with AI-curated questions tailored to your level"
    },
    {
      icon: BookOpen,
      title: "Get Instant Feedback",
      description: "Receive detailed explanations and personalized tips for every answer you submit"
    },
    {
      icon: BarChart3,
      title: "Track Your Progress",
      description: "Watch your performance improve with detailed analytics and grade predictions"
    }
  ];

  const testimonials = [
    {
      name: "Sophie M.",
      grade: "Year 11",
      content: "Went from struggling with Chemistry to achieving A* in my mocks. The AI feedback is absolutely game-changing.",
      rating: 5
    },
    {
      name: "James L.",
      grade: "Year 10", 
      content: "This platform completely transformed how I study. Finally understand concepts that confused me for months.",
      rating: 5
    },
    {
      name: "Amara K.",
      grade: "Year 11",
      content: "Scored 96% on my Biology mock after using this for just 3 weeks. The personalized questions are incredible.",
      rating: 5
    }
  ];

  const stats = [
    { number: "1000+", label: "Practice Questions" },
    { number: "< 3 sec", label: "AI Response Time" },
    { number: "3", label: "Core GCSE Subjects" },
    { number: "100%", label: "Free Access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-7 h-7 object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
              >
                Enter Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold border border-slate-200 hover:border-slate-300 transition-all duration-200 rounded-xl"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
            The Future of GCSE Revision is Here
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-slate-900">Achieve Your</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dream Grades
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Revolutionary AI technology that adapts to your learning style and accelerates your path to GCSE success.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
          >
            Personalise My Revision
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 lg:mb-24 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
              <div className="text-slate-600 font-semibold text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">How It Works</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Get started in three simple steps and watch your grades soar</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg mx-auto">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <div className="text-xl font-bold text-slate-900 mb-4">{step.title}</div>
                <p className="text-slate-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Why Top Students Choose Mentiora</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Experience the most advanced GCSE preparation platform ever created</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br ${feature.bgGradient} hover:border-indigo-300 group rounded-2xl`}>
                <CardContent className="p-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Testimonials */}
        <div className="mb-20 lg:mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Real Results, Real Success</h3>
            <p className="text-xl text-slate-600">Join students already achieving their highest grades</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((review, index) => (
              <Card key={index} className="p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic font-medium">"{review.content}"</p>
                  <div className="border-t border-slate-200 pt-4">
                    <div className="font-bold text-slate-900 text-lg">{review.name}</div>
                    <div className="text-indigo-600 font-semibold">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to Excel?</h3>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your journey to GCSE excellence with the most advanced AI-powered revision platform available.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl"
            >
              Personalise My Revision
              <Trophy className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
