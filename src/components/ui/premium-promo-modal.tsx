import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, TrendingUp, Sparkles, Star, Zap, Clock, Users } from "lucide-react";

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

  const features = [
    { icon: TrendingUp, text: "Predictive Grade Analysis", subtitle: "AI-powered performance forecasting" },
    { icon: Sparkles, text: "Personalized Study Plans", subtitle: "Adaptive learning pathways" },
    { icon: CheckCircle, text: "Detailed Progress Tracking", subtitle: "Real-time analytics & insights" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[480px] rounded-2xl p-0 glass-effect border-border/20 shadow-xl mx-auto overflow-hidden">
        
        {/* Header Section */}
        <div className="relative p-6 pb-0">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-full">
                <Crown className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 bg-accent rounded-full p-1">
                <Star className="h-3 w-3 text-accent-foreground" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">
              Unlock Premium Features
            </h2>
            <p className="text-muted-foreground text-sm">
              Advanced tools to accelerate learning success
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="px-6 space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-card/50 border border-border/40 hover-lift group">
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-card-foreground text-sm">{feature.text}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{feature.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="px-6">
          <div className="bg-accent/20 border border-accent/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Join 10,000+ students</span>
            </div>
            <p className="text-xs text-muted-foreground">
              "Improved my daughter's grades by 2 levels in just 6 weeks"
            </p>
            <p className="text-xs text-muted-foreground/80 mt-1">— Parent, Birmingham</p>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="p-6 pt-4 space-y-4">
          {/* Limited Time Badge */}
          <div className="flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Limited Time: £9.99/month</span>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Start Premium Trial
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground py-2 text-sm"
            >
              Continue with Free Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};