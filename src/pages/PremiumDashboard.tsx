import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import Dashboard from "./Dashboard";

const PremiumDashboard = () => {
  const { subscription } = useAuth();
  const navigate = useNavigate();

  // Check if user has premium access
  useEffect(() => {
    if (!subscription.subscribed || subscription.subscription_tier !== "Premium") {
      navigate('/dashboard');
    }
  }, [subscription, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Premium Header */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Premium Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-sm"
            >
              Regular Dashboard
            </Button>
            <ThemeToggle />
            <ColorThemeToggle />
            <ProfileDropdown streakDays={0} firstName="User" />
          </div>
        </div>
      </div>

      {/* Premium Content - Same as regular dashboard */}
      <Dashboard />
    </div>
  );
};

export default PremiumDashboard;