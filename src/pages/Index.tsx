
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, TrendingUp, Award, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Learning",
      description: "Advanced AI provides instant, personalized feedback on every answer",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Detailed progress tracking with predictive grade insights",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: "Adaptive Difficulty",
      description: "Questions that evolve with your learning progress",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Award,
      title: "Expert Content",
      description: "Curated by experienced GCSE teachers and examiners",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "15,000+", label: "Active Students", color: "text-purple-600" },
    { number: "97%", label: "Pass Rate", color: "text-blue-600" },
    { number: "2.8x", label: "Grade Boost", color: "text-emerald-600" },
    { number: "24/7", label: "AI Support", color: "text-orange-600" }
  ];

  const testimonials = [
    {
      name: "Sophie Chen",
      grade: "A* in Mathematics",
      content: "Mentiora's AI feedback helped me identify exactly where I was going wrong. Improved from a C to A* in just 4 months!",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Williams", 
      grade: "A in Physics",
      content: "The adaptive questions kept me challenged but not overwhelmed. Perfect for building confidence before exams.",
      rating: 5,
      avatar: "MW"
    },
    {
      name: "Priya Patel",
      grade: "A in Chemistry",
      content: "Finally understood complex concepts thanks to the personalized explanations. Game-changer for my revision!",
      rating: 5,
      avatar: "PP"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Premium Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-28 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-6 h-6 object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Zap className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium transition-colors"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 lg:mb-32 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-full text-purple-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 15,000+ GCSE Students Worldwide
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-blue-900 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              GCSEs with AI
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI-powered revision that adapts to your unique learning style. 
            Join thousands achieving their dream grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            Start Learning Free
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 lg:mb-32 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform`}>
                {stat.number}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24 lg:mb-32 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm group hover:scale-105">
              <CardContent className="p-0">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Testimonials */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent">
                Student Success Stories
              </span>
            </h3>
            <p className="text-xl text-slate-600">Real results from students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((review, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm hover:scale-105">
                <CardContent className="p-0">
                  <div className="flex mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic">"{review.content}"</p>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{review.name}</div>
                      <div className="text-purple-600 font-medium">{review.grade}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">
              Ready to Transform Your Grades?
            </h3>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who've achieved their dream GCSE results with Mentiora's AI-powered learning.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-purple-900 hover:bg-purple-50 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="mr-3 h-5 w-5" />
              Begin Your Success Journey
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
