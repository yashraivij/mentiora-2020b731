
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight, Star, Play, Target, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Exam Questions",
      description: "Practice with AQA GCSE questions"
    },
    {
      icon: CheckCircle,
      title: "AI Marking",
      description: "Get instant detailed feedback"
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      description: "Monitor your improvement"
    },
    {
      icon: Users,
      title: "Personalized",
      description: "Tailored to your needs"
    }
  ];

  const howItWorksSteps = [
    {
      icon: Play,
      title: "Start Practicing",
      description: "Choose your subject and begin with practice questions tailored to your level"
    },
    {
      icon: Target,
      title: "Get Instant Feedback",
      description: "Our AI analyzes your answers and provides detailed explanations and improvements"
    },
    {
      icon: Trophy,
      title: "Track Your Progress",
      description: "Monitor your improvement and identify areas that need more attention"
    }
  ];

  const reviews = [
    {
      name: "Sarah M.",
      grade: "Year 11 Student",
      content: "Mentiora helped me improve my Biology grades from C to A*. The AI feedback is incredibly detailed and helped me understand my mistakes.",
      rating: 5
    },
    {
      name: "James K.",
      grade: "Year 10 Student", 
      content: "The personalized practice questions are brilliant. It feels like having a tutor available 24/7. My confidence in Maths has grown so much!",
      rating: 5
    },
    {
      name: "Emma L.",
      grade: "Year 11 Student",
      content: "I love how it tracks my progress. I can see exactly which topics I need to work on. Got an A in my Chemistry mock exam!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl"></div>
            <h1 className="text-2xl font-semibold text-gray-900">Mentiora</h1>
          </div>
          <div className="space-x-3">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700 px-6">
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')} className="text-gray-600">
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700 px-6">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-24 max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Master Your
            <br />
            <span className="text-blue-600">GCSE Revision</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Personalized exam practice for AQA GCSE students with instant AI feedback and progress tracking.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')} 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
          >
            Start Revising Now - Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-24 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <feature.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in three simple steps and begin improving your grades today
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-8"></div>
                )}
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h4>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mb-24 bg-gray-50 rounded-3xl p-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h3>
            <p className="text-xl text-gray-600">Start for free, upgrade when you're ready</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-blue-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mb-2">£0</div>
                <CardDescription>Perfect to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>50 practice questions per month</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>AI-powered feedback</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Progress tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>All GCSE subjects</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Premium</CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">£9.99</div>
                <CardDescription>per month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Unlimited practice questions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced AI feedback</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Detailed analytics</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Exam predictions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6"
                  onClick={() => navigate('/register')}
                >
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h3>
            <p className="text-xl text-gray-600">Join thousands of students already improving their grades</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">"{review.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.grade}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Subject Preview */}
        <div className="text-center mb-24">
          <h3 className="text-4xl font-bold text-gray-900 mb-12">
            Complete AQA GCSE Coverage
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
              <h4 className="text-2xl font-semibold text-green-700 mb-4">Biology</h4>
              <p className="text-green-600">
                Cell Biology, Organisation, Infection & Response, Bioenergetics
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="text-2xl font-semibold text-blue-700 mb-4">Mathematics</h4>
              <p className="text-blue-600">
                Number, Algebra, Geometry, Probability, Statistics
              </p>
            </div>
            <div className="bg-purple-50 rounded-2xl p-8 border border-purple-100">
              <h4 className="text-2xl font-semibold text-purple-700 mb-4">Chemistry</h4>
              <p className="text-purple-600">
                Atomic Structure, Bonding, Quantitative Chemistry
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gray-900 rounded-3xl p-12 text-center text-white max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold mb-6">Ready to excel in your GCSEs?</h3>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join students already improving their grades with personalized AI-powered revision.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/register')} 
            className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
