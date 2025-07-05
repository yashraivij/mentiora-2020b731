
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Play, Zap, Brain } from "lucide-react";
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
      color: "from-violet-500 to-purple-600"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Instant, detailed feedback on every answer",
      color: "from-blue-500 to-cyan-500"
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
      color: "from-rose-500 to-pink-500"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject",
      description: "Select from all GCSE subjects and exam boards",
      icon: Target,
      gradient: "from-violet-600 to-purple-700"
    },
    {
      step: "02", 
      title: "Answer Questions",
      description: "Practice with past paper questions tailored to your level",
      icon: Brain,
      gradient: "from-blue-600 to-cyan-700"
    },
    {
      step: "03",
      title: "Get AI Feedback",
      description: "Receive instant, detailed explanations and improve",
      icon: Zap,
      gradient: "from-emerald-600 to-teal-700"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      color: "from-violet-50 to-purple-50"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      color: "from-blue-50 to-cyan-50"
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
    { number: "50,000+", label: "Questions Available", color: "text-violet-600" },
    { number: "15+", label: "GCSE Subjects", color: "text-blue-600" },
    { number: "24/7", label: "AI Support", color: "text-emerald-600" },
    { number: "Instant", label: "Feedback", color: "text-rose-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="container mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-32 lg:mb-40">
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
          <div className="flex gap-4 mt-8 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-white/50 font-medium px-8 py-3 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-40 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200 rounded-full text-violet-700 text-sm font-medium mb-16">
            <Sparkles className="h-4 w-4 mr-3 text-violet-500" />
            AI-Powered GCSE Revision Platform
          </div>
          
          <h2 className="text-7xl lg:text-8xl font-bold mb-16 leading-tight tracking-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-20 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your revision with AI-powered feedback, personalized learning paths, and thousands of expertly crafted questions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
            >
              Start Learning Free
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-violet-200 text-violet-700 hover:bg-violet-50 px-12 py-4 text-lg font-medium rounded-xl transition-all duration-300"
            >
              <Play className="mr-3 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-40 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-4xl lg:text-5xl font-bold mb-4 ${stat.color}`}>{stat.number}</div>
              <div className="text-gray-500 font-medium text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">How It Works</h3>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Get started in minutes and see results in weeks
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
              {/* Connection lines for desktop */}
              <div className="hidden lg:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200"></div>
              
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className={`w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg relative z-10`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 text-sm font-bold px-4 py-2 rounded-full inline-block mb-6">
                      STEP {step.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-light text-lg">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Why Students Choose Us</h3>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Everything you need to excel in your GCSEs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-3xl group hover:-translate-y-2">
                <CardContent className="p-0 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}>
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
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Real Results</h3>
            <p className="text-xl text-gray-600 font-light">From students just like you</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-3xl group hover:-translate-y-2 relative overflow-hidden`}>
                <Quote className="h-8 w-8 text-gray-300 absolute top-8 right-8 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-8">
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

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-pink-900 rounded-3xl p-16 lg:p-24 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-pink-600/20"></div>
          <div className="relative z-10">
            <h3 className="text-5xl lg:text-6xl font-bold mb-8 tracking-tight">Ready to Excel?</h3>
            <p className="text-xl text-violet-100 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of students who've transformed their grades with AI-powered revision.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-violet-900 hover:bg-violet-50 px-12 py-4 text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl"
            >
              Begin Your Journey
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
