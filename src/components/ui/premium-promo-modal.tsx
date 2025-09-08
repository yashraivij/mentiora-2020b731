import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1400px] h-[700px] rounded-3xl p-0 bg-gradient-to-br from-background via-primary/5 to-secondary/10 border-2 border-primary/20 shadow-2xl overflow-hidden backdrop-blur-xl">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/5" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/30 to-accent/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tl from-accent/25 to-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Emotional Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight">
                Your Child's Future
              </h1>
              <div className="p-2 rounded-full bg-gradient-to-br from-accent to-primary shadow-lg">
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 max-w-4xl mx-auto shadow-xl">
              <h2 className="text-3xl font-bold text-foreground mb-4">Invest in Success, Not Just Study Hours</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your child's academic journey with AI-powered tools that guarantee results. 
                <span className="font-semibold text-primary"> Replace expensive tutoring with smarter learning</span> — 
                and watch them secure top university places while saving you hundreds.
              </p>
            </div>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Money Saved */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <PoundSterling className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Save £300+</h3>
              <p className="text-sm font-medium text-green-700">vs Traditional Tutoring</p>
              <div className="mt-3 text-xs text-muted-foreground">Monthly investment</div>
            </div>

            {/* Time Gained */}
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm border-2 border-blue-500/30 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">+15 Hours</h3>
              <p className="text-sm font-medium text-blue-700">Extra Study Time Weekly</p>
              <div className="mt-3 text-xs text-muted-foreground">Automated efficiency</div>
            </div>

            {/* Future Secured */}
            <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm border-2 border-purple-500/30 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">Grade 9s</h3>
              <p className="text-sm font-medium text-purple-700">University Pathway</p>
              <div className="mt-3 text-xs text-muted-foreground">Guaranteed results</div>
            </div>
          </div>

          {/* Premium Pricing Card */}
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl border-2 border-primary/30 rounded-3xl p-8 relative shadow-2xl max-w-xl w-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold px-8 py-3 text-base animate-bounce shadow-xl border-2 border-background">
                  🎯 Limited Time: 50% Off
                </Badge>
              </div>
              
              <div className="text-center space-y-6 mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Instead of £300+ monthly tutoring</div>
                  <div className="flex items-center justify-center gap-6">
                    <span className="text-3xl text-muted-foreground line-through font-medium">£19.99</span>
                    <span className="text-6xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      £9.99
                    </span>
                    <span className="text-2xl text-muted-foreground">/month</span>
                  </div>
                  <p className="text-lg font-semibold text-primary">Your smart investment in their future</p>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold py-6 px-10 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-background/20"
                >
                  Secure Their Future Now
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Start free • Cancel anytime • Invest in success</span>
                </div>
              </div>
            </div>
          </div>

          {/* What Parents Get Section */}
          <div className="bg-gradient-to-r from-primary/5 to-accent/5 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">What You're Really Investing In</h3>
            <p className="text-lg text-muted-foreground mb-4">Your child's pathway to top universities and career success</p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>2026 Exam Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>AI Study Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Grade Forecasting</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};