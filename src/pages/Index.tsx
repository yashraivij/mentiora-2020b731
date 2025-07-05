
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote } from "lucide-react";
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
      color: "bg-blue-50 border-blue-100"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      color: "bg-purple-50 border-purple-100"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions",
      color: "bg-green-50 border-green-100"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance",
      color: "bg-orange-50 border-orange-100"
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
    { number: "10,000+", label: "Students", color: "text-blue-600" },
    { number: "95%", label: "Pass Rate", color: "text-green-600" },
    { number: "2.3x", label: "Grade Improvement", color: "text-purple-600" },  
    { number: "24/7", label: "Support", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                  alt="Mentiora Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-inter">Mentiora</h1>
            </div>
            <div className="flex gap-3">
              {user ? (
                <Button 
                  onClick={() => navigate('/dashboard')} 
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full px-6 shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/login')} 
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium rounded-full px-6"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate('/register')} 
                    className="bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full px-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    Start Free
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 rounded-3xl mx-6 my-12 py-20 px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
            Trusted by 10,000+ GCSE Students
          </div>
          <h2 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight font-inter">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed font-inter">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-inter"
          >
            Start Learning Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats Section */}
        <div className="py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-3xl lg:text-4xl font-bold mb-2 ${stat.color} font-inter`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm font-inter">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16"></div>

        {/* Features Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-inter">
              Everything You Need
            </h3>
            <p className="text-xl text-gray-600 font-inter">Powerful tools for GCSE success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden`}>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <feature.icon className="h-7 w-7 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-inter">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-inter">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16"></div>

        {/* Testimonials Section */}
        <div className="py-16 bg-gray-50 rounded-3xl mx-6">
          <div className="text-center mb-16 px-8">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-inter">
              Real Results
            </h3>
            <p className="text-xl text-gray-600 font-inter">From students just like you</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-8">
            {reviews.map((review, index) => (
              <Card key={index} className="bg-white border-2 border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative">
                <Quote className="h-6 w-6 text-gray-300 absolute top-6 right-6" />
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-base leading-relaxed italic font-inter">
                    "{review.content}"
                  </p>
                  <div className="border-t border-gray-100 pt-4">
                    <div className="font-bold text-gray-900 font-inter">{review.name}</div>
                    <div className="text-gray-500 text-sm font-inter">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-16"></div>

        {/* Pricing Section */}
        <div className="py-16">
          <div className="text-center mb-16">
            <h3 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight font-inter">
              Start Today
            </h3>
            <p className="text-xl text-gray-600 font-inter">Everything you need to succeed</p>
          </div>
          <div className="max-w-sm mx-auto">
            <Card className="border-2 border-gray-200 relative shadow-lg bg-white rounded-2xl overflow-hidden">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg font-inter">
                  Free Forever
                </span>
              </div>
              <CardHeader className="text-center pt-12 pb-8">
                <CardTitle className="text-3xl font-bold text-gray-900 font-inter">Free Access</CardTitle>
                <div className="text-5xl font-bold text-gray-900 mb-3 font-inter">£0</div>
                <CardDescription className="text-gray-600 font-inter">No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 px-8">
                <div className="space-y-4">
                  {[
                    "50 questions monthly",
                    "AI-powered feedback", 
                    "Progress tracking",
                    "All GCSE subjects"
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 text-base font-inter">{item}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white mt-8 py-4 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-inter"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto my-16 shadow-xl">
          <h3 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight font-inter">Ready to Excel?</h3>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed font-inter">
            Join the thousands of students who've transformed their grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-inter"
          >
            Begin Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
