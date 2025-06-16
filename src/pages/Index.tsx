
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
      title: "Exam-Style Questions",
      description: "Practice with realistic AQA GCSE questions across Biology, Maths, and Chemistry"
    },
    {
      icon: CheckCircle,
      title: "AI-Powered Marking",
      description: "Get detailed feedback with model answers and Assessment Objective breakdowns"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress and identify weak topics with comprehensive dashboards"
    },
    {
      icon: Users,
      title: "Personalized Learning",
      description: "Adaptive revision focused on your individual needs and learning gaps"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-slate-900">Mentiora</h1>
          </div>
          <div className="space-x-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            Master Your <span className="text-blue-600">GCSE Revision</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Personalized exam practice for AQA GCSE students. Get instant feedback, 
            track your progress, and focus on what matters most.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
              Start Revising Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
              Already have an account?
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subject Preview */}
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-8">
            Complete AQA GCSE Coverage
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-700">Biology</CardTitle>
                <CardDescription>
                  Cell Biology, Organisation, Infection & Response, Bioenergetics, and more
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Mathematics</CardTitle>
                <CardDescription>
                  Number, Algebra, Geometry, Probability, Statistics, and more
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-purple-700">Chemistry</CardTitle>
                <CardDescription>
                  Atomic Structure, Bonding, Quantitative Chemistry, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-900 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to excel in your GCSEs?</h3>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of students already improving their grades with Mentiora
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="bg-blue-600 hover:bg-blue-700">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
