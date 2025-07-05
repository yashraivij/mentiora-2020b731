
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Award } from "lucide-react";
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
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress reports and grade predictions",
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive difficulty based on your performance",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject",
      description: "Select from Biology, Chemistry, Physics, and Mathematics to start your personalized learning journey.",
      icon: Target,
      color: "from-violet-500 to-purple-600",
      bgColor: "bg-gradient-to-br from-violet-50 to-purple-50"
    },
    {
      step: "02", 
      title: "Practice Questions",
      description: "Answer expertly crafted questions tailored to AQA GCSE standards with varying difficulty levels.",
      icon: Brain,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-indigo-50"
    },
    {
      step: "03",
      title: "Get AI Feedback",
      description: "Receive instant, detailed feedback and explanations to understand concepts deeply.",
      icon: Zap,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-gradient-to-br from-amber-50 to-orange-50"
    },
    {
      step: "04",
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and achieve your target grades.",
      icon: Award,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-gradient-to-br from-emerald-50 to-green-50"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      color: "from-blue-50 to-indigo-50",
      avatar: "bg-gradient-to-br from-blue-400 to-indigo-500"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      color: "from-purple-50 to-pink-50",
      avatar: "bg-gradient-to-br from-purple-400 to-pink-500"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      color: "from-emerald-50 to-teal-50",
      avatar: "bg-gradient-to-br from-emerald-400 to-teal-500"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students", color: "text-blue-600", bg: "bg-gradient-to-br from-blue-50 to-blue-100" },
    { number: "95%", label: "Pass Rate", color: "text-emerald-600", bg: "bg-gradient-to-br from-emerald-50 to-emerald-100" },
    { number: "2.3x", label: "Grade Improvement", color: "text-purple-600", bg: "bg-gradient-to-br from-purple-50 to-purple-100" },
    { number: "24/7", label: "Support", color: "text-orange-600", bg: "bg-gradient-to-br from-orange-50 to-orange-100" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-32 lg:mb-40">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain filter brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-6 mt-8 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-white/60 font-semibold px-8 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-40 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200/50 rounded-full text-blue-700 text-sm font-semibold mb-16 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 mr-3 text-blue-500" />
            Trusted by 10,000+ GCSE Students
            <Trophy className="h-5 w-5 ml-3 text-purple-500" />
          </div>
          
          <h2 className="text-7xl lg:text-8xl font-bold mb-16 leading-tight tracking-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 mb-20 max-w-3xl mx-auto leading-relaxed font-light">
            AI-powered revision that adapts to your learning style. Join thousands achieving their dream grades with personalized feedback and expert-crafted questions.
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl hover:scale-105"
          >
            Start Learning Free
            <ArrowRight className="ml-4 h-6 w-6" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-40 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className={`text-center p-8 rounded-3xl ${stat.bg} border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <div className={`text-5xl lg:text-6xl font-bold mb-4 ${stat.color}`}>{stat.number}</div>
              <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">How It Works</h3>
            <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto">Simple steps to transform your GCSE results</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {howItWorks.map((step, index) => (
              <Card key={index} className={`p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${step.bgColor} rounded-3xl group hover:-translate-y-3 relative overflow-hidden`}>
                <div className="absolute top-4 right-4 text-6xl font-bold text-white/10">
                  {step.step}
                </div>
                <CardContent className="p-0 text-center relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className={`text-3xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-6`}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Why Students Choose Us</h3>
            <p className="text-2xl text-gray-600 font-light">Everything you need to excel in your GCSEs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className={`p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${feature.bgColor} rounded-3xl group hover:-translate-y-3`}>
                <CardContent className="p-0 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Real Results</h3>
            <p className="text-2xl text-gray-600 font-light">From students just like you</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-3xl group hover:-translate-y-3 relative overflow-hidden`}>
                <Quote className="h-10 w-10 text-gray-300 absolute top-8 right-8 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-8">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-10 text-xl leading-relaxed font-light italic">"{review.content}"</p>
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full ${review.avatar} flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{review.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                      <div className="text-gray-500 font-medium">{review.grade}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-20 lg:p-24 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
          <div className="relative z-10">
            <h3 className="text-5xl lg:text-6xl font-bold mb-10 tracking-tight">Ready to Excel?</h3>
            <p className="text-2xl text-gray-200 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Join the thousands of students who've transformed their grades with Mentiora.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-white to-gray-100 text-gray-900 hover:from-gray-100 hover:to-white px-16 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl hover:scale-105"
            >
              Begin Your Journey
              <ArrowRight className="ml-4 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
