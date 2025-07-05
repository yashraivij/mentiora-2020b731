
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
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: Brain,
      title: "AI Feedback",
      description: "Revolutionary AI that understands your learning style",
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Data-driven insights that predict your exam success",
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-50 to-teal-50"
    },
    {
      icon: Target,
      title: "Personalized Path",
      description: "Adaptive learning that evolves with your progress",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Take Your Assessment",
      description: "Start with our intelligent assessment to identify your current knowledge level and learning gaps",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      accent: "text-blue-600"
    },
    {
      step: "02", 
      title: "Get Your Personal Study Plan",
      description: "Receive a customized learning path designed specifically for your strengths and weaknesses",
      icon: Target,
      color: "from-purple-500 to-pink-600",
      accent: "text-purple-600"
    },
    {
      step: "03",
      title: "Practice With AI Guidance",
      description: "Work through expert-level questions with real-time AI feedback that adapts to your learning style",
      icon: Zap,
      color: "from-pink-500 to-red-600", 
      accent: "text-pink-600"
    },
    {
      step: "04",
      title: "Achieve Your Target Grade",
      description: "Watch your confidence and grades soar as you master each topic with precision and clarity",
      icon: Award,
      color: "from-emerald-500 to-cyan-600",
      accent: "text-emerald-600"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "This platform is absolutely revolutionary. The AI feedback is more detailed than my actual teachers - went from struggling with C grades to confidently achieving A* in just 3 months.",
      rating: 5,
      color: "from-blue-50 to-indigo-50",
      accent: "border-blue-200"
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "I've never seen anything like this before. It's like having the world's best tutor available 24/7. My parents are amazed at how much my confidence has grown.",
      rating: 5,
      color: "from-purple-50 to-pink-50",
      accent: "border-purple-200"
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "The personalized learning is incredible - it knows exactly what I need to work on. Just achieved an A in my Chemistry mock exam after struggling for months!",
      rating: 5,
      color: "from-emerald-50 to-teal-50",
      accent: "border-emerald-200"
    }
  ];

  const stats = [
    { number: "98%", label: "Success Rate", color: "text-emerald-600", bg: "bg-emerald-100" },
    { number: "2.8x", label: "Grade Jump", color: "text-blue-600", bg: "bg-blue-100" },
    { number: "24/7", label: "AI Support", color: "text-purple-600", bg: "bg-purple-100" },
    { number: "30min", label: "Daily Study", color: "text-orange-600", bg: "bg-orange-100" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 lg:mb-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                alt="Mentiora Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mentiora</h1>
          </div>
          <div className="flex gap-3 mt-6 sm:mt-0">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="lg"
                className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-6 py-2.5 rounded-xl transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Start Free
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-8">
            <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
            The Future of GCSE Revision
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-gray-900">Master Your</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dream Grades
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Revolutionary AI-powered revision that adapts to your unique learning style. Join the students who are transforming their academic future.
          </p>
          
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group"
          >
            Start Your Journey Free
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.bg} rounded-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.number}</div>
              </div>
              <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Why Students Choose Us */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why This Platform is Like No Other</h3>
            <p className="text-lg text-gray-600">Revolutionary technology that no other platform can match</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl group hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <CardContent className="p-0 text-center relative z-10">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">How It Works</h3>
            <p className="text-lg text-gray-600">Your path to academic excellence in 4 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((step, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl group hover:-translate-y-1 relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`} />
                <CardContent className="p-0">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className={`text-xs font-bold ${step.accent} mb-2 tracking-wider uppercase`}>Step {step.step}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Real Results From Real Students</h3>
            <p className="text-lg text-gray-600">See how students are transforming their grades</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className={`p-6 border-2 ${review.accent} shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${review.color} rounded-2xl group hover:-translate-y-2 relative overflow-hidden`}>
                <Quote className="h-6 w-6 text-gray-300 absolute top-6 right-6 opacity-50" />
                <CardContent className="p-0 relative z-10">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 text-sm leading-relaxed italic">"{review.content}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-bold text-gray-900">{review.name}</div>
                    <div className="text-gray-500 text-sm font-medium">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 rounded-3xl p-12 lg:p-16 text-center text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl" />
          <div className="relative z-10">
            <h3 className="text-3xl lg:text-4xl font-bold mb-6 tracking-tight">Ready to Transform Your Grades?</h3>
            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of students who've discovered the power of AI-driven learning.
            </p>
            <Button 
              onClick={() => navigate('/register')} 
              className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-3 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
