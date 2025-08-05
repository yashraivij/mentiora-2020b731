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
    "🔮 Predicted 2026 questions for your exact exam board",
    "📓 Smart notebook auto-saves key revision points",
    "📊 Grade predictions updated with every quiz you take",
    "🎯 Targeted revision based on your weak topics"
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Premium Card with enhanced glass effect */}
      <div className="relative">
        {/* Sophisticated ambient glow using design system colors */}
        <div className="absolute -inset-6 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-50 rounded-3xl blur-3xl animate-pulse"></div>
        <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/20 to-primary/30 opacity-40 rounded-2xl blur-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-accent/15 to-primary/20 opacity-30 rounded-xl blur-lg animate-[pulse_2s_ease-in-out_infinite_reverse]"></div>
        
        <Card className="relative glass-effect border-2 border-primary/20 shadow-2xl rounded-2xl overflow-hidden backdrop-blur-xl">
          {/* Animated gradient border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl opacity-40 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-[2px] bg-background/95 backdrop-blur-xl rounded-[14px]"></div>
          
          {/* Floating premium particles matching design system */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="absolute top-16 left-8 w-3 h-3 bg-primary/60 rounded-full animate-[bounce_2s_ease-in-out_infinite] shadow-lg"></div>
            <div className="absolute top-28 right-12 w-2 h-2 bg-accent/60 rounded-full animate-[bounce_2.5s_ease-in-out_infinite_reverse] shadow-md"></div>
            <div className="absolute bottom-20 left-16 w-2.5 h-2.5 bg-primary/50 rounded-full animate-[bounce_3s_ease-in-out_infinite] shadow-lg"></div>
            <div className="absolute bottom-32 right-8 w-2 h-2 bg-secondary/60 rounded-full animate-[bounce_1.8s_ease-in-out_infinite_reverse] shadow-md"></div>
            <div className="absolute top-40 left-1/2 w-1.5 h-1.5 bg-accent/70 rounded-full animate-[bounce_2.2s_ease-in-out_infinite] shadow-sm"></div>
          </div>
          
          {/* Premium Header with design system gradient */}
          <div className="relative bg-gradient-to-r from-primary via-accent to-primary p-6 text-center overflow-hidden">
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-pulse"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-gradient-to-br from-primary-foreground/90 to-primary-foreground/70 rounded-full shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <Crown className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-3xl font-black text-primary-foreground mb-3 drop-shadow-lg">
                ⚡ EduClara Premium
              </CardTitle>
              <CardDescription className="text-primary-foreground/90 text-lg font-semibold">
                🚀 Smarter studying • 📊 Better grades
              </CardDescription>
            </div>
          </div>

          <CardContent className="relative z-20 p-6 space-y-6">
            {/* Value proposition with design system theming */}
            <div className="text-center p-4 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-xl border border-accent/20">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <Target className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-black text-foreground">
                  Learn Exactly What You Need
                </h3>
              </div>
              <p className="text-muted-foreground font-medium">
                Stop wasting time - get straight to what examiners want
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Premium Features Column */}
              <div className="md:col-span-2 space-y-4">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-black text-foreground mb-2">
                    🌟 Game-Changing Features
                  </h4>
                  <p className="text-sm text-muted-foreground font-medium">
                    Transform your study experience with intelligent technology
                  </p>
                </div>
                
                <div className="grid gap-4">
                  {benefits.map((benefit, index) => {
                    // Design system aligned colors
                    const gradients = [
                      "from-primary/20 to-accent/20", // Primary brand colors
                      "from-secondary/20 to-muted/20", // Secondary theme
                      "from-accent/20 to-primary/20", // Accent variation
                      "from-primary/15 to-secondary/15" // Subtle variation
                    ];
                    const borderColors = [
                      "border-primary/30",
                      "border-secondary/30", 
                      "border-accent/30",
                      "border-primary/20"
                    ];
                    const iconGradients = [
                      "from-primary to-accent",
                      "from-secondary to-muted",
                      "from-accent to-primary",
                      "from-primary/80 to-accent/80"
                    ];
                    
                    // Extract emoji and text
                    const emoji = benefit.split(' ')[0];
                    const textWithoutEmoji = benefit.split(' ').slice(1).join(' ');
                    
                    return (
                      <div 
                        key={index} 
                        className={`group flex items-center space-x-4 p-4 bg-gradient-to-r ${gradients[index]} rounded-xl border ${borderColors[index]} hover:scale-105 transition-all duration-300 hover:shadow-lg glass-effect`}
                      >
                        <div className="flex-shrink-0">
                          <div className={`w-10 h-10 bg-gradient-to-r ${iconGradients[index]} rounded-full flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                            <span className="text-base text-primary-foreground group-hover:scale-110 transition-transform duration-300">{emoji}</span>
                          </div>
                        </div>
                        <span className="text-foreground font-semibold group-hover:text-foreground/90 transition-colors duration-300 flex-grow">
                          {textWithoutEmoji}
                        </span>
                        <div className="flex-shrink-0">
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pricing & CTA Column */}
              <div className="space-y-4">
                {/* Pricing with design system colors */}
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
                  <div className="flex items-baseline justify-center space-x-2 mb-2">
                    <span className="text-3xl font-black text-primary">£14.99</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-primary font-medium text-sm">
                    Less than £0.50/day
                  </p>
                </div>

                {/* Offer with accent colors */}
                <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg border border-accent/20">
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    🔥 First Week FREE
                  </h4>
                  <p className="text-muted-foreground font-medium text-xs">
                    93% of students hit or exceed their predicted grades
                  </p>
                </div>

                {/* Guarantee */}
                <div className="text-center p-3 bg-gradient-to-br from-secondary/10 to-muted/10 rounded-lg border border-secondary/20">
                  <div className="flex items-center justify-center space-x-2 text-foreground text-sm font-semibold">
                    <Shield className="h-4 w-4 text-primary" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button with design system styling */}
            <Button 
              onClick={handleUpgrade}
              className="w-full h-12 bg-gradient-to-r from-primary via-accent to-primary hover:from-primary/90 hover:via-accent/90 hover:to-primary/90 text-primary-foreground font-bold text-base rounded-xl shadow-xl hover:shadow-primary/25 transform hover:scale-[1.02] transition-all duration-300 group border border-primary/20"
            >
              <Rocket className="h-5 w-5 mr-3 group-hover:animate-bounce" />
              🎯 START FREE TRIAL NOW
              <Sparkles className="h-5 w-5 ml-3 group-hover:animate-spin" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                ⚡ Instant access • No commitment required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};