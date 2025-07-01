
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
      description: "Curated AQA GCSE questions"
    },
    {
      icon: Sparkles,
      title: "AI Feedback",
      description: "Personalized learning insights"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "See your improvement clearly"
    },
    {
      icon: Users,
      title: "Tailored Learning",
      description: "Adapted to your pace"
    }
  ];

  const howItWorksSteps = [
    {
      icon: Play,
      title: "Practice",
      description: "Answer questions matched to your level"
    },
    {
      icon: Target,
      title: "Learn",
      description: "Get detailed feedback and explanations"
    },
    {
      icon: Trophy,
      title: "Improve",
      description: "Track progress and boost confidence"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11",
      content: "Went from C to A* in Biology in 3 months. The AI feedback is incredible!",
      rating: 5
    },
    {
      name: "James K.",
      grade: "Year 10", 
      content: "Like having a personal tutor 24/7. My maths confidence has grown so much.",
      rating: 5
    },
    {
      name: "Emma L.",
      grade: "Year 11",
      content: "Perfect for focused revision. Just got an A in my Chemistry mock!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Clean Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-12 lg:mb-20 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Mentiora</h1>
          </div>
          <div className="flex gap-3">
            {user ? (
              <Button 
                onClick={() => navigate('/dashboard')} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')} 
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign In
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/register')} 
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6">
            <Sparkles className="h-3 w-3 mr-2" />
            Trusted by 10,000+ Students
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gray-900">GCSE Success</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered revision that adapts to you. Join thousands of students achieving their best grades.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3"
          >
            Start Free Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-24">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4">
              <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-16 lg:mb-24 bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-lg text-gray-600">Three simple steps to better grades</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h4>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Start Free</h3>
            <p className="text-lg text-gray-600">Everything you need to succeed</p>
          </div>
          <div className="max-w-sm mx-auto">
            <Card className="border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Free Forever
                </span>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Free Access</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mb-2">£0</div>
                <CardDescription>No credit card required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">50 questions monthly</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">AI-powered feedback</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">Progress tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                    <span className="text-sm">All GCSE subjects</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                  onClick={() => navigate('/register')}
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-16 lg:mb-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Student Success</h3>
            <p className="text-lg text-gray-600">Real results from real students</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6 border-0 shadow-lg bg-white">
                <CardContent className="p-0">
                  <div className="flex mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 text-sm italic">"{review.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
                    <div className="text-gray-500 text-xs">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-center text-white max-w-4xl mx-auto">
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Succeed?</h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of students who've improved their grades with Mentiora.
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
