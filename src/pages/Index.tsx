
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, TrendingUp, Clock, Award } from "lucide-react";
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
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const stats = [
    { 
      number: "10,000+", 
      label: "Students", 
      icon: Users,
      color: "text-blue-600"
    },
    { 
      number: "95%", 
      label: "Pass Rate", 
      icon: TrendingUp,
      color: "text-green-600"
    },
    { 
      number: "2.3x", 
      label: "Grade Improvement", 
      icon: Award,
      color: "text-purple-600"
    },
    { 
      number: "24/7", 
      label: "Support", 
      icon: Clock,
      color: "text-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      avatar: "S",
      color: "bg-gradient-to-br from-pink-400 to-pink-500"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      avatar: "J",
      color: "bg-gradient-to-br from-blue-400 to-blue-500"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      avatar: "E",
      color: "bg-gradient-to-br from-green-400 to-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Clean Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Mentiora
            </h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 font-medium transition-colors"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Minimal Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-full text-indigo-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
            Trusted by 10,000+ GCSE Students
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Master Your GCSEs
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 rounded-xl"
          >
            Start Learning Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="mb-4 flex justify-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Colorful Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white group hover:-translate-y-1">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <CardContent className="p-8 relative">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">{feature.title}</h3>
                <p className="text-slate-600 text-center leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Colorful Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                Real Results
              </span>
            </h3>
            <p className="text-xl text-slate-600">From students just like you</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((review, index) => (
              <Card key={index} className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic">"{review.content}"</p>
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${review.color} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4`}>
                      {review.avatar}
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

        {/* Single Premium CTA */}
        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl" />
          <div className="relative">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Excel?</h3>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who've transformed their grades with AI-powered revision.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-white text-indigo-900 hover:bg-gray-100 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
            >
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
