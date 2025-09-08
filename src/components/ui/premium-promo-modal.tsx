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
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] rounded-3xl p-0 bg-gradient-to-br from-card via-primary/10 to-accent/20 border-2 border-primary/30 shadow-2xl overflow-y-auto backdrop-blur-xl">
        {/* Vibrant Background Effects */}
        <div className="absolute inset-0" style={{background: 'var(--gradient-background)'}} />
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl animate-pulse" style={{background: 'var(--gradient-primary)', opacity: 0.4}} />
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-3xl animate-pulse delay-1000" style={{background: 'var(--gradient-accent)', opacity: 0.3}} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Vibrant Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 rounded-full shadow-xl animate-bounce" style={{background: 'var(--gradient-primary)'}}>
                <Crown className="h-8 w-8 text-primary-foreground" />
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent tracking-tight animate-pulse">
                Your Child's Future
              </h1>
              <div className="p-3 rounded-full shadow-xl animate-bounce delay-200" style={{background: 'var(--gradient-accent)'}}>
                <GraduationCap className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <div className="backdrop-blur-lg border-2 border-primary/30 rounded-2xl p-6 max-w-4xl mx-auto shadow-2xl hover:shadow-3xl transition-all duration-500" style={{background: 'linear-gradient(135deg, hsl(var(--card)/0.9), hsl(var(--primary)/0.1))'}}>
              <h2 className="text-3xl font-bold text-foreground mb-4 animate-fade-in">Invest in Success, Not Just Study Hours</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Transform your child's academic journey with AI-powered tools that guarantee results. 
                <span className="font-semibold text-primary animate-pulse"> Replace expensive tutoring with smarter learning</span> — 
                and watch them secure top university places while saving you hundreds.
              </p>
            </div>
          </div>

          {/* Colorful Value Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Money Saved - Green Theme */}
            <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/10 backdrop-blur-sm border-2 border-emerald-400/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:animate-bounce">
                <PoundSterling className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-600 mb-2 group-hover:animate-pulse">Save £300+</h3>
              <p className="text-sm font-medium text-emerald-700 mb-3">vs Traditional Tutoring</p>
              <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs text-emerald-800 font-medium">Monthly investment</div>
            </div>

            {/* Time Gained - Blue Theme */}
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-600/10 backdrop-blur-sm border-2 border-blue-400/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:animate-bounce">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2 group-hover:animate-pulse">+15 Hours</h3>
              <p className="text-sm font-medium text-blue-700 mb-3">Extra Study Time Weekly</p>
              <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs text-blue-800 font-medium">Automated efficiency</div>
            </div>

            {/* Future Secured - Purple Theme */}
            <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/10 backdrop-blur-sm border-2 border-purple-400/40 rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:animate-bounce">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2 group-hover:animate-pulse">Grade 9s</h3>
              <p className="text-sm font-medium text-purple-700 mb-3">University Pathway</p>
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-xs text-purple-800 font-medium">Guaranteed results</div>
            </div>
          </div>

          {/* Vibrant Pricing Card */}
          <div className="flex justify-center mb-8">
            <div className="backdrop-blur-xl border-2 border-primary/40 rounded-3xl p-8 relative shadow-2xl max-w-xl w-full hover:shadow-3xl transition-all duration-500 group" style={{background: 'linear-gradient(135deg, hsl(var(--card)/0.9), hsl(var(--primary)/0.1), hsl(var(--accent)/0.05))'}}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="text-primary-foreground font-bold px-8 py-3 text-base animate-bounce shadow-xl border-2 border-background/20" style={{background: 'var(--gradient-primary)'}}>
                  🎯 Limited Time: 50% Off
                </Badge>
              </div>
              
              <div className="text-center space-y-6 mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Instead of £300+ monthly tutoring</div>
                  <div className="flex items-center justify-center gap-6">
                    <span className="text-3xl text-muted-foreground line-through font-medium">£19.99</span>
                    <span className="text-6xl font-black bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
                      £9.99
                    </span>
                    <span className="text-2xl text-muted-foreground">/month</span>
                  </div>
                  <p className="text-lg font-semibold text-primary group-hover:animate-pulse">Your smart investment in their future</p>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full text-primary-foreground font-bold py-6 px-10 text-xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-background/20 group-hover:animate-pulse"
                  style={{background: 'var(--gradient-primary)'}}
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

          {/* Colorful Bottom Section */}
          <div className="backdrop-blur-sm border-2 border-primary/20 rounded-2xl p-6 text-center shadow-xl" style={{background: 'linear-gradient(135deg, hsl(var(--primary)/0.1), hsl(var(--accent)/0.1))'}}>
            <h3 className="text-2xl font-bold text-foreground mb-2">What You're Really Investing In</h3>
            <p className="text-lg text-muted-foreground mb-4">Your child's pathway to top universities and career success</p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
                <span>2026 Exam Predictions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse delay-200"></div>
                <span>AI Study Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full animate-pulse delay-500"></div>
                <span>Grade Forecasting</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};