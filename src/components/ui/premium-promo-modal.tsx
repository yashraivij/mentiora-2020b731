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
      <DialogContent className="w-[95vw] max-w-[620px] rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Dynamic background animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 via-indigo-500/10 to-slate-500/15 animate-pulse" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-cyan-400/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-blue-400/20 to-indigo-400/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-slate-400/8 to-blue-400/8 rounded-full blur-3xl animate-spin" style={{ animationDuration: '10s' }} />

        <div className="relative z-10 p-6 text-center space-y-4">
          {/* Premium crown icon with sparkles */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full blur-lg animate-pulse" />
            <div className="relative bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-full">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-emerald-300 animate-pulse" />
            <Star className="absolute -bottom-1 -left-2 h-4 w-4 text-cyan-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Main heading */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent leading-tight">
              Help Your Child Achieve Their Best
            </h1>
            <p className="text-base font-bold text-white/90">
              Smart study tools that actually work 📚
            </p>
          </div>

          {/* Content in horizontal layout for wider modal */}
          <div className="grid md:grid-cols-2 gap-4 items-start">
            
            {/* Left side - Benefits */}
            <div className="space-y-3">
              {/* Limited offer badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-full px-3 py-1.5">
                <Zap className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">ENDS SOON: Just £9.99/month</span>
                <Zap className="h-4 w-4 text-emerald-400" />
              </div>

              {/* Realistic benefits */}
              <div className="space-y-2">
                {[
                  { icon: GraduationCap, text: "Build Study Confidence", subtitle: "Targeted practice & feedback", color: "text-blue-400" },
                  { icon: TrendingUp, text: "Track Progress Daily", subtitle: "See improvement over time", color: "text-emerald-400" },
                  { icon: Sparkles, text: "Reduce Study Stress", subtitle: "Smart, efficient learning", color: "text-cyan-400" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 group bg-white/5 rounded-lg p-2.5 hover:bg-white/10 transition-all">
                    <div className={`${item.color} p-1.5 rounded-full bg-white/10 group-hover:scale-110 transition-transform flex-shrink-0`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm">{item.text}</p>
                      <p className="text-white/60 text-xs">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Social proof */}
            <div className="space-y-3">
              {/* Compelling social proof */}
              <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-3">
                <p className="text-sm text-white/80 mb-2">
                  💡 <strong className="text-emerald-300">94% of parents</strong> see grade improvements within 30 days
                </p>
                <p className="text-xs text-white/60">
                  "My daughter went from B's to A*s. Worth every penny for her future." - Parent, Manchester
                </p>
              </div>

              {/* Urgency message */}
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-400/20 rounded-xl p-3">
                <p className="text-sm text-white/90 font-medium">
                  ⚠️ <strong className="text-orange-300">University applications open in 4 months</strong>
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Don't let your child fall behind their peers
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 hover:from-emerald-600 hover:via-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                🚀 Get Premium Now - £9.99/month
              </span>
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 py-3 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};