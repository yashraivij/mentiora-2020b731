
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Zap, Target, Trophy } from "lucide-react";
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
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      gradient: "from-blue-50 to-indigo-50",
      accent: "text-blue-600"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      gradient: "from-purple-50 to-pink-50",
      accent: "text-purple-600"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      gradient: "from-emerald-50 to-teal-50",
      accent: "text-emerald-600"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", color: "text-blue-600" },
    { number: "95%", label: "Pass Rate", color: "text-emerald-600" },
    { number: "2.3x", label: "Grade Improvement", color: "text-purple-600" },
    { number: "24/7", label: "Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Minimal Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium rounded-xl transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Clean Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 rounded-full text-slate-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-blue-600" />
            Trusted by 10,000+ GCSE Students
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Master Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group"
          >
            Start Learning Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        {/* Colorful Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`text-3xl lg:text-4xl font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-200`}>
                {stat.number}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              <CardContent className="p-8 text-center relative z-10">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Colorful Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Real Results</h3>
            <p className="text-xl text-slate-600">From students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${review.gradient} rounded-3xl overflow-hidden relative`}>
                <div className="absolute top-6 right-6">
                  <Quote className="h-8 w-8 text-slate-300 group-hover:text-slate-400 transition-colors duration-300" />
                </div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-lg leading-relaxed italic font-medium">"{review.content}"</p>
                  <div className="border-t border-white/50 pt-4">
                    <div className={`font-bold text-lg ${review.accent}`}>{review.name}</div>
                    <div className="text-slate-600 font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium Pricing Card */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">Start Today</h3>
            <p className="text-xl text-slate-600">Everything you need to succeed</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-0 relative shadow-2xl bg-gradient-to-br from-white to-blue-50/50 rounded-3xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Free Forever
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />
              <CardHeader className="text-center pt-12 pb-8 relative z-10">
                <CardTitle className="text-3xl font-bold text-slate-900 mb-2">Free Access</CardTitle>
                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">£0</div>
                <CardDescription className="text-slate-600 text-lg">No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 px-8 relative z-10">
                <div className="space-y-4">
                  {[
                    "50 questions monthly",
                    "AI-powered feedback", 
                    "Progress tracking",
                    "All GCSE subjects"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center group/item">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mr-4 group-hover/item:scale-110 transition-transform duration-200">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl group/btn"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-purple-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <Trophy className="h-16 w-16 text-yellow-400" />
            </div>
            <h3 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Excel?</h3>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join the thousands of students who've transformed their grades with Mentiora.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl group"
            >
              Begin Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
