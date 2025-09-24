import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Check for password reset tokens in URL hash and redirect
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (accessToken && type === 'recovery') {
      navigate('/reset-password' + window.location.hash, { replace: true });
      return;
    }

    // Redirect logged-in users to dashboard
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-16 pt-12">
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
          <div className="flex items-center gap-3 mt-6 sm:mt-0">
            <Button 
              variant="ghost" 
              size="lg"
              onClick={() => navigate('/login')} 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-semibold px-8 py-3 rounded-2xl transition-all duration-300"
            >
              Sign In
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/register')} 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </Button>
          </div>
        </header>

        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Welcome to Mentiora
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Your personalized GCSE learning platform
          </p>
          <Button 
            onClick={() => navigate('/register')} 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Learning Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
