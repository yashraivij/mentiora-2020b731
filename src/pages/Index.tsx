
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Expert Questions",
      description: "Curated AQA GCSE questions from top educators"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Insights",
      description: "Advanced feedback that adapts to your learning style"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Detailed progress tracking with predictive insights"
    },
    {
      icon: Users,
      title: "Personalized Journey",
      description: "Tailored learning paths for optimal results"
    }
  ];

  const howItWorksSteps = [
    {
      icon: Play,
      title: "Begin Your Journey",
      description: "Select your subjects and start with intelligently matched practice questions"
    },
    {
      icon: Target,
      title: "Receive Expert Guidance",
      description: "Get comprehensive AI analysis with detailed explanations and improvement strategies"
    },
    {
      icon: Trophy,
      title: "Excel in Your Exams",
      description: "Track your mastery and watch your confidence soar as you prepare for success"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11 Student",
      content: "Mentiora transformed my Biology revision completely. The AI feedback helped me understand complex concepts I'd struggled with for months. Went from C to A* in just 3 months!",
      rating: 5
    },
    {
      name: "James K.",
      grade: "Year 10 Student", 
      content: "Having a personal tutor available 24/7 changed everything for me. My Mathematics confidence has grown tremendously, and the practice questions are perfectly tailored to my needs.",
      rating: 5
    },
    {
      name: "Emma L.",
      grade: "Year 11 Student",
      content: "The progress tracking feature is incredible - I can see exactly which topics need attention. Just achieved an A in my Chemistry mock exam thanks to focused revision!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Premium Header */}
        <header className="flex justify-between items-center mb-32">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Mentiora
            </h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-8 py-3 h-auto shadow-lg"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900 px-6 py-3 h-auto"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/register')} 
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 px-8 py-3 h-auto shadow-lg"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Premium Hero Section */}
        <div className="text-center mb-32 max-w-5xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4 mr-2" />
            Trusted by 10,000+ GCSE Students
          </div>
          <h2 className="text-7xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Excellence in
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              GCSE Mastery
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Transform your revision with AI-powered personalized learning. Join thousands of students who've already elevated their grades with our premium GCSE preparation platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')} 
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-lg px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Start Your Success Journey
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>

        {/* Premium Features Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-32 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:shadow-lg transition-all duration-300">
                <feature.icon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Premium How It Works Section */}
        <div className="mb-32 bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-16">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">How Excellence Unfolds</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Experience the seamless journey from practice to mastery in three refined steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-16 max-w-6xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-blue-200 to-indigo-200 transform translate-x-10"></div>
                )}
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-8 relative z-10 shadow-lg">
                  <step.icon className="h-10 w-10 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed font-light text-lg">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Pricing Section */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">Investment in Excellence</h3>
            <p className="text-xl text-gray-600 font-light">Begin your journey to academic success today</p>
          </div>
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-200 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  Perfect to Start
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none"></div>
              <CardHeader className="text-center pt-12 relative z-10">
                <CardTitle className="text-3xl font-light">Free Access</CardTitle>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-4">£0</div>
                <CardDescription className="text-lg">Everything you need to begin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mr-4" />
                    <span className="text-lg">50 premium practice questions monthly</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mr-4" />
                    <span className="text-lg">Advanced AI-powered feedback</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mr-4" />
                    <span className="text-lg">Comprehensive progress tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-6 w-6 text-emerald-500 mr-4" />
                    <span className="text-lg">Complete GCSE subject coverage</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 mt-8 py-4 text-lg shadow-lg"
                  onClick={() => navigate('/register')}
                >
                  Begin Your Journey
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Reviews Section */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-bold text-gray-900 mb-6">Success Stories</h3>
            <p className="text-xl text-gray-600 font-light">From our community of high-achieving students</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-8 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg font-light italic">"{review.content}"</p>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{review.name}</div>
                    <div className="text-gray-500">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Premium CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-16 text-center text-white max-w-5xl mx-auto shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-5xl font-bold mb-8 leading-tight">Ready to Achieve Excellence?</h3>
            <p className="text-xl text-blue-100 mb-12 font-light leading-relaxed">
              Join the elite community of students who've transformed their academic journey with our premium AI-powered revision platform.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')} 
              className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-12 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold"
            >
              Begin Your Success Story
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
