
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Sparkles, Quote, Target, Trophy, Zap, Brain, Clock, Award } from "lucide-react";
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

  const howItWorks = [
    {
      step: "01",
      title: "Choose Your Subject",
      description: "Select from our comprehensive range of GCSE subjects and exam boards",
      icon: Target,
      gradient: "from-blue-600 to-purple-600"
    },
    {
      step: "02", 
      title: "Practice & Learn",
      description: "Answer questions tailored to your level with instant AI-powered feedback",
      icon: Brain,
      gradient: "from-purple-600 to-pink-600"
    },
    {
      step: "03",
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics and personalized insights",
      icon: BarChart3,
      gradient: "from-pink-600 to-orange-600"
    },
    {
      step: "04",
      title: "Achieve Excellence",
      description: "Reach your target grades with confidence and comprehensive preparation",
      icon: Trophy,
      gradient: "from-orange-600 to-yellow-500"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in just 3 months. The AI feedback is incredibly detailed and helpful.",
      rating: 5,
      color: "from-blue-50 to-indigo-50",
      accent: "border-blue-200"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor available 24/7. My confidence in maths has grown tremendously.",
      rating: 5,
      color: "from-purple-50 to-pink-50",
      accent: "border-purple-200"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision sessions. Just achieved an A in my Chemistry mock exam!",
      rating: 5,
      color: "from-emerald-50 to-teal-50",
      accent: "border-emerald-200"
    }
  ];

  const stats = [
    { number: "50K+", label: "Questions Available", color: "text-blue-600", bg: "bg-blue-50", icon: BookOpen },
    { number: "99%", label: "Accuracy Rate", color: "text-emerald-600", bg: "bg-emerald-50", icon: CheckCircle },
    { number: "2.5x", label: "Faster Learning", color: "text-purple-600", bg: "bg-purple-50", icon: Zap },
    { number: "24/7", label: "AI Support", color: "text-orange-600", bg: "bg-orange-50", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-32 lg:mb-40">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-8 h-8 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-4 mt-8 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white font-medium px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-white/60 font-medium px-10 py-4 rounded-2xl transition-all duration-300 backdrop-blur-sm border border-gray-200/50"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-medium px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-40 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-100/50 rounded-full text-blue-700 text-sm font-semibold mb-16 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 mr-3 text-blue-500" />
            Powered by Advanced AI Technology
            <Award className="h-5 w-5 ml-3 text-purple-500" />
          </div>
          
          <h2 className="text-7xl lg:text-8xl font-bold mb-16 leading-tight tracking-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              GCSEs
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 mb-20 max-w-3xl mx-auto leading-relaxed font-light">
            Revolutionary AI-powered revision that adapts to your unique learning style. 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-medium">
              Transform your grades today.
            </span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl transform hover:-translate-y-2 hover:scale-105"
            >
              Start Learning Free
              <ArrowRight className="ml-4 h-6 w-6" />
            </Button>
            <div className="flex items-center space-x-2 text-gray-500">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-medium">No credit card required</span>
            </div>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-40 max-w-5xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className={`${stat.bg} p-8 rounded-3xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-white/50`}>
              <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className={`text-4xl lg:text-5xl font-bold mb-3 ${stat.color}`}>{stat.number}</div>
              <div className="text-gray-600 font-semibold text-lg">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">Why Students Choose Us</h3>
            <p className="text-2xl text-gray-600 font-light max-w-2xl mx-auto">Everything you need to excel in your GCSEs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-10 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white/80 backdrop-blur-sm rounded-3xl group hover:-translate-y-4 hover:scale-105 border border-gray-100/50">
                <CardContent className="p-0 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-9 w-9 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-40">
          <div className="text-center mb-24">
            <h3 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8 tracking-tight">How It Works</h3>
            <p className="text-2xl text-gray-600 font-light max-w-2xl mx-auto">Your journey to GCSE success in 4 simple steps</p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {howItWorks.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start space-x-8">
                    <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-xl`}>
                      {step.step}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center mb-4">
                        <step.icon className={`h-8 w-8 mr-4 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`} />
                        <h4 className="text-2xl font-bold text-gray-900">{step.title}</h4>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed font-light">{step.description}</p>
                    </div>
                  </div>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-24 left-10 w-px h-20 bg-gradient-to-b from-gray-300 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
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
              <Card key={index} className={`p-10 border-2 ${review.accent} shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-3xl group hover:-translate-y-4 relative overflow-hidden backdrop-blur-sm`}>
                <Quote className="h-10 w-10 text-gray-300 absolute top-8 right-8 opacity-60" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-8">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-10 text-xl leading-relaxed font-light italic">"{review.content}"</p>
                  <div className="border-t border-gray-200 pt-8">
                    <div className="font-bold text-gray-900 text-xl">{review.name}</div>
                    <div className="text-gray-500 font-medium text-lg">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 via-purple-900 to-pink-900 rounded-3xl p-20 lg:p-24 text-center text-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h3 className="text-5xl lg:text-6xl font-bold mb-10 tracking-tight">Ready to Excel?</h3>
            <p className="text-2xl text-gray-200 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
              Join the revolution in GCSE preparation. Start your journey to academic excellence with 
              <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-semibold"> AI-powered learning.</span>
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-gray-900 hover:bg-gray-100 px-16 py-6 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl transform hover:-translate-y-2 hover:scale-105"
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
