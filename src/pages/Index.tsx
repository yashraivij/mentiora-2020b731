
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy } from "lucide-react";
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
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance",
      color: "from-orange-500 to-red-500"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      color: "from-blue-50 to-indigo-50"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      color: "from-purple-50 to-pink-50"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      color: "from-emerald-50 to-teal-50"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", color: "text-blue-600" },
    { number: "95%", label: "Pass Rate", color: "text-emerald-600" },
    { number: "2.3x", label: "Grade Improvement", color: "text-purple-600" },
    { number: "24/7", label: "Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-24 lg:mb-32">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-4 mt-6 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-32 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full text-blue-700 text-sm font-medium mb-12">
            <Sparkles className="h-4 w-4 mr-3 text-blue-500" />
            Trusted by 10,000+ GCSE Students
          </div>
          
          <h2 className="text-6xl lg:text-7xl font-bold mb-12 leading-tight tracking-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto leading-relaxed font-light">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
          >
            Start Learning Free
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-32 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl lg:text-5xl font-bold mb-3 ${stat.color}`}>{stat.number}</div>
              <div className="text-gray-500 font-medium text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Why Students Choose Us</h3>
            <p className="text-xl text-gray-600 font-light">Everything you need to excel in your GCSEs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl group hover:-translate-y-2">
                <CardContent className="p-0 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Real Results</h3>
            <p className="text-xl text-gray-600 font-light">From students just like you</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-2xl group hover:-translate-y-2 relative overflow-hidden`}>
                <Quote className="h-8 w-8 text-gray-300 absolute top-8 right-8 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed font-light italic">"{review.content}"</p>
                  <div className="border-t border-gray-200 pt-6">
                    <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                    <div className="text-gray-500 font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Start Today</h3>
            <p className="text-xl text-gray-600 font-light">Everything you need to succeed</p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-gray-200 relative shadow-xl bg-white rounded-2xl overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Free Forever
                </span>
              </div>
              <CardHeader className="text-center pt-16 pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 mb-4">Free Access</CardTitle>
                <div className="text-6xl font-bold text-gray-900 mb-4">£0</div>
                <CardDescription className="text-gray-600 text-lg font-light">No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8">
                <div className="space-y-4">
                  {[
                    "50 questions monthly",
                    "AI-powered feedback",
                    "Progress tracking",
                    "All GCSE subjects"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-6 w-6 text-emerald-500 mr-4 flex-shrink-0" />
                      <span className="text-gray-700 text-lg font-light">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-8 py-4 font-medium shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl text-lg"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-16 lg:p-20 text-center text-white max-w-4xl mx-auto shadow-2xl">
          <h3 className="text-4xl lg:text-5xl font-bold mb-8 tracking-tight">Ready to Excel?</h3>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
            Join the thousands of students who've transformed their grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-white text-gray-900 hover:bg-gray-100 px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
          >
            Begin Your Journey
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
