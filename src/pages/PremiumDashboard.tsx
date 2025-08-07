import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { PremiumPaywall } from "@/components/ui/premium-paywall";

const PremiumDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user?.id) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <PremiumPaywall 
          feature="Predicted 2026 Questions"
          description="Access AI-generated exam questions based on latest 2026 exam trends"
          benefits={[
            "🔮 Predicted 2026 questions for your exact exam board",
            "📓 Smart notebook auto-saves key revision points", 
            "📊 Grade predictions updated with every quiz you take",
            "🎯 Targeted revision based on your weak topics"
          ]}
          hideButton={true}
        />
      </div>
    </div>
  );
};

export default PremiumDashboard;