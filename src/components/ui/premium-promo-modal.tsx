import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PoundSterling, Clock, GraduationCap, Sparkles, Zap, University } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1000px] max-h-[90vh] rounded-3xl p-0 bg-gradient-to-br from-rose-500 via-pink-600 to-violet-700 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        <div className="flex min-h-[600px]">
          {/* Left Section - Benefits */}
          <div className="flex-1 p-8 space-y-6 bg-gradient-to-br from-rose-500/20 to-transparent backdrop-blur-sm">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-300 via-rose-300 to-violet-300 bg-clip-text text-transparent animate-pulse">
                👑 Mentiora Premium 👑
              </h1>
              <p className="text-xl text-white/90 font-semibold">
                Transform Your Child's Academic Success
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-400/40 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="bg-emerald-500/40 p-3 rounded-full">
                  <PoundSterling className="h-6 w-6 text-emerald-200" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-emerald-200">£300+</div>
                  <div className="text-sm text-white/80">Saved vs Private Tutoring</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="bg-cyan-500/40 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-cyan-200" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-cyan-200">15+ Hours</div>
                  <div className="text-sm text-white/80">Saved Weekly</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-violet-500/20 to-purple-500/20 border border-violet-400/40 rounded-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                <div className="bg-violet-500/40 p-3 rounded-full">
                  <University className="h-6 w-6 text-violet-200" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-violet-200">Grade 9s</div>
                  <div className="text-sm text-white/80">Target Achievement</div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/90">
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span className="font-medium">AI-powered personalized learning paths</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <Zap className="h-5 w-5 text-cyan-300" />
                <span className="font-medium">Instant note generation & summarization</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <GraduationCap className="h-5 w-5 text-emerald-300" />
                <span className="font-medium">Grade prediction & exam preparation</span>
              </div>
            </div>
          </div>

          {/* Right Section - Pricing & CTA */}
          <div className="w-80 bg-gradient-to-br from-violet-600/30 to-rose-600/30 backdrop-blur-sm border-l border-white/20 flex flex-col justify-center p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-amber-400/20 to-rose-400/20 border-2 border-amber-400/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg text-white/60 line-through">£19.99</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">£9.99</span>
                  </div>
                  <p className="text-lg font-semibold text-amber-300">🔥 50% OFF Launch Offer</p>
                  <p className="text-white/90 text-sm">Less than one tutoring session. Lifetime impact.</p>
                </div>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 hover:from-amber-600 hover:via-rose-600 hover:to-violet-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg border-2 border-white/20"
              >
                ✨ Get Premium Access Now
              </Button>
            </div>

            <div className="text-center space-y-3 border-t border-white/20 pt-6">
              <p className="text-xs text-white/60">
                ✓ Cancel anytime • ✓ 30-day guarantee • ✓ Instant access
              </p>
              <Button 
                onClick={onClose}
                variant="ghost"
                className="text-white/50 hover:text-white/70 hover:bg-white/10 text-sm"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};