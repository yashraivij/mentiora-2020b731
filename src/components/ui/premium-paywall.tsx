import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Brain, Zap, Trophy, Rocket, ChevronRight, Shield, Target, GraduationCap, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PremiumPaywallProps {
  feature: string;
  description: string;
  icon?: React.ReactNode;
  benefits?: string[];
}

export const PremiumPaywall = ({ 
  feature, 
  description, 
  icon = <Crown className="h-8 w-8" />,
  benefits = [
    "🎯 AI creates personalized study notes for YOUR weaknesses",
    "🔮 Get exact exam questions before they're asked",
    "📈 See your predicted grades and improve before it's too late",
    "🎵 Study playlists that boost your focus and memory",
    "⚡ Save 10+ hours per week with smart recommendations"
  ]
}: PremiumPaywallProps) => {
  const { createCheckout } = useAuth();

  const handleUpgrade = async () => {
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.open(checkoutUrl, '_blank');
      } else {
        toast.error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Premium Card */}
      <div className="relative">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-30 rounded-2xl blur animate-pulse"></div>
        
        <Card className="relative bg-card backdrop-blur-xl border shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary to-accent p-6 text-center">
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/20 backdrop-blur-sm rounded-full shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                🚀 Unlock Premium Features
              </CardTitle>
              <CardDescription className="text-white/95 text-lg font-medium">
                Join thousands of successful students
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-6 space-y-4">
            {/* Feature highlight */}
            <div className="text-center p-4 bg-muted/50 rounded-xl border">
              <div className="flex justify-center mb-2">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-1">
                {feature}
              </h3>
              <p className="text-muted-foreground text-sm font-medium">{description}</p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              <h4 className="font-bold text-lg text-center text-primary">
                ✨ What You'll Get
              </h4>
              <div className="grid gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg border hover:bg-muted/50 transition-all duration-200">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <Zap className="h-3 w-3 text-primary-foreground" />
                      </div>
                    </div>
                    <span className="text-foreground font-medium text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Urgency */}
            <div className="text-center p-4 bg-gradient-to-r from-accent/20 to-primary/20 rounded-xl border border-accent/30">
              <div className="flex justify-center mb-2">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <h4 className="text-lg font-bold text-foreground mb-1">
                🔥 Limited Time: First Month FREE
              </h4>
              <p className="text-muted-foreground font-medium text-sm">
                Start today - see improvements within 2 weeks!
              </p>
            </div>

            {/* Pricing */}
            <div className="text-center py-4 px-4 bg-muted/30 rounded-xl border">
              <div className="flex items-baseline justify-center space-x-2 mb-1">
                <span className="text-3xl font-black text-primary">$7.99</span>
                <span className="text-muted-foreground text-lg">/month</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-muted-foreground font-semibold text-sm">
                <Shield className="h-3 w-3" />
                <span>Cancel anytime • Money-back guarantee</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
              >
                <Rocket className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                🎯 START FREE TRIAL NOW
                <Sparkles className="h-5 w-5 ml-3 group-hover:animate-spin" />
              </Button>
              
              <p className="text-center text-xs text-muted-foreground">
                ⚡ Instant access • No commitment required
              </p>
            </div>

            {/* Value reinforcement */}
            <div className="text-center p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-accent font-semibold text-sm">
                💡 Save 10+ hours per week • Improve by 2+ grade levels
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};