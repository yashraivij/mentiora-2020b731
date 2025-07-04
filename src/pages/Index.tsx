
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Star, Zap, Target, TrendingUp, Award, Users, Trophy, BarChart3, Brain, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const analytics = [
    {
      icon: Users,
      number: "25,000+",
      label: "Active Students",
      change: "+12% this month",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      icon: TrendingUp,
      number: "94%",
      label: "Pass Rate",
      change: "+8% vs last year",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50"
    },
    {
      icon: Award,
      number: "2.8x",
      label: "Grade Improvement",
      change: "Average increase",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "AI Support",
      change: "Always available",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get instant, personalized feedback on every answer",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Target,
      title: "Targeted Practice",
      description: "Focus on weak areas with smart recommendations",
      color: "from-green-500 to-teal-600"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed insights",
      color: "from-blue-500 to-cyan-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months!",
      rating: 5,
      color: "from-pink-400 to-rose-500"
    },
    {
      name: "James K.",
      grade: "Year 10",
      content: "Like having a personal tutor available 24/7.",
      rating: 5,
      color: "from-blue-400 to-indigo-500"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      color: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">Mentiora</h1>
          </div>
          {!user && (
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')} 
              className="text-slate-600 hover:text-slate-900"
            >
              Sign In
            </Button>
          )}
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Trophy className="h-4 w-4 mr-2" />
            Trusted by 25,000+ GCSE Students
          </div>
          
          <h2 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs with AI
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Transform your revision with personalized AI feedback and analytics-driven learning.
          </p>
          
          <Button 
            onClick={() => user ? navigate('/dashboard') : navigate('/register')} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            {user ? 'Go to Dashboard' : 'Start Learning Free'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Premium Analytics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {analytics.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} shadow-lg`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-bold mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-slate-700 font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-slate-500">{stat.change}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Student Success */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-purple-900 bg-clip-text text-transparent mb-4">
              Student Success Stories
            </h3>
            <p className="text-xl text-slate-600">Real results from students just like you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic">"{review.content}"</p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${review.color} rounded-full flex items-center justify-center mr-4 shadow-lg`}>
                      <span className="text-white font-bold">{review.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{review.name}</div>
                      <div className="text-slate-500 text-sm">{review.grade}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 rounded-3xl p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative">
            <h3 className="text-5xl font-bold mb-6">Ready to Excel?</h3>
            <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Join thousands of students achieving their target grades with AI-powered learning.
            </p>
            <Button 
              onClick={() => user ? navigate('/dashboard') : navigate('/register')} 
              size="lg"
              className="bg-white text-slate-900 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {user ? 'Continue Learning' : 'Start Your Journey Free'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
