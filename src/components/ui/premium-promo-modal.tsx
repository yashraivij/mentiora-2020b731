import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, X, GraduationCap, TrendingUp, Sparkles, Star, Zap } from "lucide-react";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  const handleUpgrade = () => {
    onClose();
    onUpgrade();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[520px] rounded-3xl p-0 bg-gradient-to-br from-background to-muted border-0 shadow-2xl mx-auto overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5" />
        
        <div className="relative z-10 p-8 space-y-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Urgency banner */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-2 text-destructive font-bold text-sm">
              <Zap className="h-4 w-4" />
              <span>⏰ LIMITED TIME: 48 HOURS LEFT</span>
              <Zap className="h-4 w-4" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-full">
                <Crown className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Give Your Child The
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Unfair Advantage</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg font-medium">
                While others struggle, your child succeeds with confidence
              </p>
            </div>
          </div>

          {/* Parent-focused benefits */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-center text-lg">What Premium Gets Your Child:</h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                { 
                  icon: TrendingUp, 
                  title: "Predicted Grade 9s", 
                  desc: "Know exactly which topics to focus on for top grades",
                  color: "text-green-500"
                },
                { 
                  icon: GraduationCap, 
                  title: "Russell Group Universities", 
                  desc: "Direct path to Oxford, Cambridge & top universities",
                  color: "text-blue-500"
                },
                { 
                  icon: Sparkles, 
                  title: "Stress-Free Revision", 
                  desc: "AI creates personalized study plans - no more panic",
                  color: "text-purple-500"
                },
                { 
                  icon: Star, 
                  title: "15+ Hours Saved Weekly", 
                  desc: "More family time, less academic stress",
                  color: "text-yellow-500"
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className={`${benefit.color} p-2 rounded-lg bg-background`}>
                    <benefit.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold text-foreground">£9.99</span>
                <span className="text-muted-foreground">/month</span>
                <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs font-bold">
                  50% OFF
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Less than £0.33/day for your child's future
              </p>
              <p className="text-xs text-primary font-medium">
                First 7 days FREE • Cancel anytime
              </p>
            </div>
          </div>

          {/* Social proof */}
          <div className="bg-muted/30 border border-border/50 rounded-2xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              🔥 <strong className="text-foreground">8,247 parents</strong> chose Premium this month
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              "My daughter went from grade 6s to 9s!" - Parent Review
            </p>
          </div>

          {/* Fear of missing out */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 text-center">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Don't let your child fall behind while others get ahead
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 text-lg"
            >
              🚀 Secure Your Child's Future - Start Free Trial
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground py-3 text-sm"
            >
              I'll risk it and stay with basic
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};