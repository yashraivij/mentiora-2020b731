
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Expert Questions",
      description: "Curated AQA GCSE questions from experienced teachers"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students" },
    { number: "95%", label: "Pass Rate" },
    { number: "2.3x", label: "Grade Improvement" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Refined Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-24 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Premium Hero Section */}
        <div className="text-center mb-20 lg:mb-32 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-3 w-3 mr-2" />
            Trusted by 10,000+ GCSE Students
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
            <span className="text-slate-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Start Learning Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 lg:mb-32 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">{stat.number}</div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Enhanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20 lg:mb-32">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-0 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Premium Testimonials */}
        <div className="mb-20 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Real Results</h3>
            <p className="text-xl text-slate-600 font-light">From students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm relative">
                <Quote className="h-8 w-8 text-indigo-200 absolute top-6 right-6" />
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 text-base leading-relaxed italic">"{review.content}"</p>
                  <div className="border-t border-slate-100 pt-4">
                    <div className="font-semibold text-slate-900">{review.name}</div>
                    <div className="text-slate-500 text-sm">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Refined Pricing */}
        <div className="mb-20 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Start Today</h3>
            <p className="text-xl text-slate-600 font-light">Everything you need to succeed</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-indigo-200 relative shadow-xl bg-white/90 backdrop-blur-sm">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Free Forever
                </span>
              </div>
              <CardHeader className="text-center pt-12 pb-8">
                <CardTitle className="text-3xl font-bold text-slate-900">Free Access</CardTitle>
                <div className="text-5xl font-bold text-indigo-600 mb-2">£0</div>
                <CardDescription className="text-slate-600">No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                <div className="space-y-3">
                  {[
                    "50 questions monthly",
                    "AI-powered feedback",
                    "Progress tracking",
                    "All GCSE subjects"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-8 py-3 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready to Excel?</h3>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto leading-relaxed font-light">
            Join the thousands of students who've transformed their grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-white text-indigo-600 hover:bg-slate-50 px-8 py-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
