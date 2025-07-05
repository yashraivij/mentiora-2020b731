
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Target, Trophy, Sparkles, Quote, Zap, Brain, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced algorithms adapt to your learning style",
      gradient: "from-violet-400 to-purple-600"
    },
    {
      icon: Target,
      title: "Precision Targeting",
      description: "Focus on your weakest areas for maximum improvement",
      gradient: "from-blue-400 to-cyan-600"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track progress with detailed performance insights",
      gradient: "from-emerald-400 to-teal-600"
    },
    {
      icon: Award,
      title: "Grade Prediction",
      description: "See your projected grades before exam day",
      gradient: "from-amber-400 to-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      grade: "Year 11",
      content: "Went from grade C to A* in Biology in just 8 weeks. The AI feedback is incredibly detailed.",
      rating: 5,
      subject: "Biology",
      improvement: "+3 grades"
    },
    {
      name: "Marcus Johnson", 
      grade: "Year 10",
      content: "Finally understand complex equations. My confidence in maths has grown tremendously.",
      rating: 5,
      subject: "Mathematics",
      improvement: "+2 grades"
    },
    {
      name: "Emma Rodriguez",
      grade: "Year 11",
      content: "Perfect for focused revision. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      subject: "Chemistry",
      improvement: "A grade"
    }
  ];

  const stats = [
    { number: "15K+", label: "Active Students", color: "text-violet-600" },
    { number: "97%", label: "Pass Rate", color: "text-emerald-600" },
    { number: "2.8x", label: "Faster Learning", color: "text-blue-600" },
    { number: "24/7", label: "AI Support", color: "text-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="absolute inset-0 bg-grid-slate-100/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 relative">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-24 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
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
                className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium rounded-xl"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl border-0"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20 lg:mb-28 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 15,000+ GCSE Students
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-slate-900 via-violet-900 to-purple-900 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            AI-powered revision that adapts to your learning style. 
            <span className="text-violet-600 font-semibold"> Join thousands achieving their dream grades.</span>
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:scale-105"
          >
            Start Learning Free
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-28 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.number}
              </div>
              <div className="text-slate-600 font-semibold text-sm uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-28 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <CardContent className="p-8 text-center relative">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-20 lg:mb-28 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-slate-900 to-violet-900 bg-clip-text text-transparent">Real Results</span>
            </h3>
            <p className="text-xl text-slate-600 font-medium">From students just like you</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((review, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50 to-purple-50 opacity-50" />
                
                <CardContent className="p-8 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {review.improvement}
                    </div>
                  </div>
                  
                  <Quote className="h-8 w-8 text-violet-300 mb-4" />
                  <p className="text-slate-700 mb-6 text-base leading-relaxed italic font-medium">"{review.content}"</p>
                  
                  <div className="border-t border-violet-100 pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{review.name}</div>
                        <div className="text-slate-500 text-sm">{review.grade}</div>
                      </div>
                      <div className="text-xs text-violet-600 font-semibold bg-violet-100 px-2 py-1 rounded-lg">
                        {review.subject}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-purple-600/20 rounded-3xl" />
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to Excel?</h3>
            <p className="text-xl text-violet-200 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              Join thousands of students who've transformed their grades with AI-powered learning.
            </p>
            
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-violet-900 hover:bg-violet-50 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:scale-105"
            >
              Start Your Journey Free
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            
            <p className="text-violet-300 text-sm mt-4 font-medium">No credit card required • Free forever</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
