import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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