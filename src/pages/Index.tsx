
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header with uploaded logo */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
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
                  className="bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Premium Hero Section */}
        <div className="text-center mb-16 lg:mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-full text-slate-700 text-sm font-medium mb-6">
            <Sparkles className="h-3 w-3 mr-2" />
            Trusted by 10,000+ GCSE Students
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
            <span className="text-slate-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto leading-relaxed">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
          >
            Start Learning Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-24 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{stat.number}</div>
              <div className="text-slate-600 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-24">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white">
              <CardContent className="p-0 text-center">
                <div className="w-12 h-12 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-5 w-5 text-slate-700" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Real Results</h3>
            <p className="text-lg text-slate-600">From students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white relative">
                <Quote className="h-6 w-6 text-slate-300 absolute top-6 right-6" />
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4 text-base leading-relaxed italic">"{review.content}"</p>
                  <div className="border-t border-slate-100 pt-3">
                    <div className="font-semibold text-slate-900">{review.name}</div>
                    <div className="text-slate-500 text-sm">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Start Today</h3>
            <p className="text-lg text-slate-600">Everything you need to succeed</p>
          </div>
          <div className="max-w-sm mx-auto">
            <Card className="border-2 border-slate-300 relative shadow-md bg-white">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  Free Forever
                </span>
              </div>
              <CardHeader className="text-center pt-10 pb-6">
                <CardTitle className="text-2xl font-bold text-slate-900">Free Access</CardTitle>
                <div className="text-4xl font-bold text-slate-900 mb-2">£0</div>
                <CardDescription className="text-slate-600">No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="space-y-3">
                  {[
                    "50 questions monthly",
                    "AI-powered feedback",
                    "Progress tracking",
                    "All GCSE subjects"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-slate-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-6 py-2.5 font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 lg:p-12 text-center text-white max-w-3xl mx-auto shadow-lg">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4 tracking-tight">Ready to Excel?</h3>
          <p className="text-lg text-slate-200 mb-6 max-w-xl mx-auto leading-relaxed">
            Join the thousands of students who've transformed their grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-2.5 text-base font-medium shadow-sm hover:shadow-md transition-all duration-200"
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
