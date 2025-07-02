
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles, Quote, Zap, Brain, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Advanced AI analyzes your answers and provides personalized feedback to accelerate your progress"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get detailed feedback within seconds and understand exactly where you need to improve"
    },
    {
      icon: Target,
      title: "Exam-Ready Questions",
      description: "Practice with real AQA GCSE questions curated by top teachers and examiners"
    },
    {
      icon: Award,
      title: "Grade Prediction",
      description: "Smart analytics predict your final grades and guide you to achieve your targets"
    }
  ];

  const reviews = [
    {
      name: "Emily R.",
      grade: "Year 11",
      content: "Absolutely incredible! I went from struggling with D grades to achieving A* in Chemistry. The AI feedback is like having the best tutor explaining everything perfectly.",
      rating: 5
    },
    {
      name: "Marcus T.",
      grade: "Year 10", 
      content: "This platform transformed my revision completely. The personalized questions and instant feedback helped me understand concepts I'd been struggling with for months.",
      rating: 5
    },
    {
      name: "Sophia K.",
      grade: "Year 11",
      content: "I can't believe how much my confidence has grown! Just scored 98% on my Biology mock - thank you Mentiora for making learning actually enjoyable.",
      rating: 5
    }
  ];

  const stats = [
    { number: "15,000+", label: "Students Excelling" },
    { number: "97%", label: "Grade Improvement" },
    { number: "3.2x", label: "Faster Learning" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Premium Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-20 lg:mb-28 gap-4">
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
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Enter Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold border border-slate-200 hover:border-slate-300 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Free Trial
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section with Premium Feel */}
        <div className="text-center mb-20 lg:mb-32 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-full text-indigo-700 text-sm font-semibold mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
            Join 15,000+ Students Achieving Their Dream Grades
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-slate-900">Transform Your</span>
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              GCSE Results
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Revolutionary AI-powered revision that adapts to your unique learning style. Watch your grades soar as you master every topic with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              Start Your Free Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-4 text-lg font-semibold bg-white/80 backdrop-blur-sm hover:bg-indigo-50/80 transition-all duration-300 rounded-xl"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Premium Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 lg:mb-32 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
              <div className="text-slate-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Premium Features */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Why Students Choose Mentiora</h3>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Experience the most advanced GCSE revision platform built specifically for your success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50/50 hover:border-indigo-300 group rounded-2xl">
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
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
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Success Stories</h3>
            <p className="text-xl text-slate-600">Real students, real results, real transformations</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-indigo-50/30 relative rounded-2xl">
                <Quote className="h-8 w-8 text-indigo-300 absolute top-6 right-6" />
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

        {/* Premium Pricing */}
        <div className="mb-24 lg:mb-32">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Start Your Success Story</h3>
            <p className="text-xl text-slate-600">Everything you need to achieve your dream grades</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-4 border-gradient-to-r from-indigo-500 to-purple-500 relative shadow-2xl bg-gradient-to-br from-white to-indigo-50/30 rounded-3xl overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  ⭐ Most Popular
                </span>
              </div>
              <CardHeader className="text-center pt-12 pb-8">
                <CardTitle className="text-3xl font-bold text-slate-900">Premium Access</CardTitle>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">FREE</div>
                <CardDescription className="text-slate-600 text-lg">Forever • No hidden fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  {[
                    "Unlimited practice questions",
                    "AI-powered instant feedback",
                    "Advanced progress tracking",
                    "All GCSE subjects included",
                    "Grade prediction analytics",
                    "24/7 AI study companion"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-4 flex-shrink-0" />
                      <span className="text-slate-700 text-lg font-medium">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl mt-8"
                  onClick={() => navigate('/register')}
                >
                  Claim Your Free Access
                  <Trophy className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight">Ready for Academic Excellence?</h3>
            <p className="text-xl text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who've transformed their grades and unlocked their full potential with Mentiora's revolutionary AI-powered learning.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-xl"
            >
              Begin Your Transformation
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
