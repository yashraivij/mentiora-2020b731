import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, PoundSterling, Clock, GraduationCap, Sparkles, Zap, University } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1100px] max-h-[90vh] rounded-3xl p-0 bg-card/95 backdrop-blur-xl border border-border/50 text-foreground shadow-2xl mx-auto overflow-y-auto">
        {/* Premium background animations using design system */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,hsl(var(--primary)/0.1),hsl(var(--accent)/0.05),hsl(var(--secondary)/0.1))] animate-pulse" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-[radial-gradient(circle,hsl(var(--primary)/0.2),hsl(var(--accent)/0.1))] rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle,hsl(var(--accent)/0.2),hsl(var(--primary)/0.1))] rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        <div className="relative z-10 p-6 space-y-6">
          {/* Top Section - Premium headline */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-[var(--gradient-primary)] p-4 rounded-full shadow-xl border border-border/20">
                <Crown className="h-10 w-10 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-[var(--gradient-primary)] bg-clip-text text-transparent leading-tight tracking-tight">
              👑 Mentiora Premium
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground/90 tracking-wide">
              Secure Their Academic Future
            </h2>
          </div>

          {/* CTA Section - Below header */}
          <div className="bg-card/60 backdrop-blur-sm border border-primary/30 rounded-3xl p-8 text-center space-y-6">
            <div className="inline-flex items-center gap-3 bg-destructive/20 border border-destructive/40 rounded-full px-6 py-3">
              <span className="text-xl font-bold text-destructive">🔥 Limited Time Investment</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl text-muted-foreground line-through">£19.99</span>
                <span className="text-5xl font-black text-primary">£9.99</span>
                <span className="text-2xl text-foreground/80">/ month</span>
              </div>
              <p className="text-xl font-semibold text-accent-foreground">50% OFF — Lock in this price today</p>
              <p className="text-base text-muted-foreground">Less than one tutoring session. Better results guaranteed.</p>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-[var(--gradient-primary)] hover:opacity-90 text-primary-foreground font-bold py-6 px-10 rounded-2xl shadow-2xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300 text-xl relative overflow-hidden group border-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-3">
                🚀 Invest in Their Future - Start Now
              </span>
            </Button>
          </div>

          {/* Investment Value - Front and Center */}
          <div className="bg-card/40 border-2 border-primary/50 rounded-3xl p-8 text-center glass-effect">
            <h3 className="text-3xl font-black text-primary mb-6">💰 Your Investment Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-card/60 rounded-2xl p-6 border border-border/30">
                <div className="text-4xl font-black text-primary">£300+</div>
                <div className="text-sm text-muted-foreground font-medium">Saved vs Tutoring</div>
              </div>
              <div className="bg-card/60 rounded-2xl p-6 border border-border/30">
                <div className="text-4xl font-black text-accent">15+</div>
                <div className="text-sm text-muted-foreground font-medium">Hours Saved Weekly</div>
              </div>
              <div className="bg-card/60 rounded-2xl p-6 border border-border/30">
                <div className="text-4xl font-black text-secondary-foreground">Grade 9s</div>
                <div className="text-sm text-muted-foreground font-medium">+ University Place</div>
              </div>
            </div>
            <p className="text-xl font-semibold text-foreground/90">
              "Less than one tutoring session. Lifetime impact on their future."
            </p>
          </div>

          {/* Concrete Benefits - What Parents Get */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-center text-foreground">🎯 What Your Child Gets</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-card/60 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 space-y-4 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/20 p-4 rounded-full border border-primary/30">
                    <PoundSterling className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground">Save £300+ on Tutoring Costs</h4>
                    <p className="text-base text-muted-foreground">Replace expensive 1-on-1 tutoring with AI-powered tools that deliver better results for a fraction of the cost.</p>
                  </div>
                  <div className="bg-primary/20 border border-primary/30 rounded-full px-4 py-2">
                    <span className="text-sm font-bold text-primary">£300+ SAVED</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-accent/30 rounded-2xl p-6 space-y-4 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/20 p-4 rounded-full border border-accent/30">
                    <Clock className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground">Get Back 15+ Hours Weekly</h4>
                    <p className="text-base text-muted-foreground">Smart study plans, instant notes, and targeted practice mean your child studies smarter, not harder.</p>
                  </div>
                  <div className="bg-accent/20 border border-accent/30 rounded-full px-4 py-2">
                    <span className="text-sm font-bold text-accent">15+ HOURS</span>
                  </div>
                </div>
              </div>

              <div className="bg-card/60 backdrop-blur-sm border border-secondary/30 rounded-2xl p-6 space-y-4 hover-lift">
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 p-4 rounded-full border border-secondary/30">
                    <University className="h-8 w-8 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground">Secure University Place</h4>
                    <p className="text-base text-muted-foreground">2026 exam predictions, grade forecasting, and structured revision designed to achieve Grade 9s and Russell Group admission.</p>
                  </div>
                  <div className="bg-secondary/20 border border-secondary/30 rounded-full px-4 py-2">
                    <span className="text-sm font-bold text-secondary-foreground">UNI READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section - Urgency + Reassurance */}
          <div className="text-center space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6">
              <h4 className="text-xl font-bold text-destructive mb-3">⏳ Limited Time Only</h4>
              <p className="text-base text-muted-foreground">
                "This special price expires soon. Secure their academic future today."
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Cancel anytime • No hidden fees • 30-day money-back guarantee
            </p>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/50 py-3 text-base"
            >
              I'll think about it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};