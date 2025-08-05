import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Star, Sparkles, TrendingUp, Clock, BookOpen, Zap, Trophy, Rocket, Lock, ChevronRight, Shield, Target } from "lucide-react";
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
    "AI-generated revision notes tailored to your weaknesses",
    "Predicted exam questions with 95% accuracy",
    "Real-time grade predictions & performance analytics",
    "Exclusive study playlists & mood-based content",
    "Priority access to new features"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      {/* Premium Modal */}
      <div className="relative w-full max-w-lg">
        {/* Animated glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary opacity-50 rounded-3xl blur animate-pulse"></div>
        
        <Card className="relative bg-card/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl overflow-hidden">
          {/* Header with gradient */}
          <div className="relative bg-gradient-to-br from-primary to-accent p-8 text-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Unlock Premium
              </CardTitle>
              <CardDescription className="text-white/90 text-lg font-medium">
                Join thousands of students achieving their goals
              </CardDescription>
            </div>
          </div>

          <CardContent className="p-8 space-y-6">
            {/* Feature highlight */}
            <div className="text-center p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl border border-accent/20">
              <h3 className="text-xl font-bold text-foreground mb-1">{feature}</h3>
              <p className="text-muted-foreground text-sm">{description}</p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                What you'll get:
              </h4>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Star className="h-3 w-3 text-white fill-white" />
                    </div>
                  </div>
                  <span className="text-sm text-foreground font-medium leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center justify-center space-x-4 py-4 px-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded-2xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-xs text-muted-foreground">Students</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9★</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>

            {/* Pricing */}
            <div className="text-center py-4">
              <div className="flex items-baseline justify-center space-x-2">
                <span className="text-3xl font-bold text-foreground">$7.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Cancel anytime • 7-day free trial</p>
            </div>

            {/* CTA Button */}
            <div className="space-y-3">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-14 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 group"
              >
                <Rocket className="h-5 w-5 mr-3 group-hover:animate-bounce" />
                Start Free Trial
                <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure Payment
                </div>
                <div>•</div>
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  Money-back Guarantee
                </div>
              </div>
            </div>

            {/* Premium badge */}
            <div className="flex justify-center">
              <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0 px-4 py-2 text-sm font-bold">
                <Crown className="h-3 w-3 mr-2" />
                PREMIUM FEATURE
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};