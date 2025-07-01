
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, BarChart3, Users, ArrowRight } from "lucide-react";
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
            Start Revising Now
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
