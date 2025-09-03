import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, Sparkles, X } from "lucide-react";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 24, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleUpgrade = () => {
    onClose();
    onUpgrade();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800/50 text-white rounded-3xl p-0 overflow-hidden shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-20 rounded-full p-2 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
        >
          <X className="h-5 w-5 text-white/70 hover:text-white" />
        </button>

        {/* Enhanced background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-purple-500/10" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-transparent rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 p-8">
          <DialogHeader className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-full shadow-lg">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-4 tracking-tight">
              Unlock Premium 🎓
            </DialogTitle>
            <p className="text-white/80 text-base leading-relaxed max-w-sm mx-auto">
              Get crystal-clear grade predictions, smarter revision plans, and full access—no paywalls.
            </p>
          </DialogHeader>

          {/* Enhanced countdown timer */}
          <div className="bg-gradient-to-r from-red-500/15 to-orange-500/15 border border-red-400/20 rounded-2xl p-5 mb-8 text-center backdrop-blur-sm">
            <p className="text-red-300 text-sm font-semibold mb-3 tracking-wide">⏰ LIMITED TIME OFFER</p>
            <div className="flex justify-center space-x-3">
              <div className="bg-gradient-to-b from-red-500/30 to-red-600/20 border border-red-400/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-white font-bold text-lg">{String(timeLeft.hours).padStart(2, '0')}</div>
                <div className="text-red-200 text-xs font-medium">hours</div>
              </div>
              <div className="bg-gradient-to-b from-red-500/30 to-red-600/20 border border-red-400/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-white font-bold text-lg">{String(timeLeft.minutes).padStart(2, '0')}</div>
                <div className="text-red-200 text-xs font-medium">mins</div>
              </div>
              <div className="bg-gradient-to-b from-red-500/30 to-red-600/20 border border-red-400/30 px-4 py-2 rounded-xl backdrop-blur-sm">
                <div className="text-white font-bold text-lg">{String(timeLeft.seconds).padStart(2, '0')}</div>
                <div className="text-red-200 text-xs font-medium">secs</div>
              </div>
            </div>
          </div>

          {/* Enhanced benefits */}
          <div className="space-y-4 mb-8">
            {[
              "Predict your exact GCSE grades",
              "Targeted, exam-board-specific practice",
              "Instant weak-area fixes"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-4 group">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-full shadow-lg group-hover:shadow-emerald-500/25 transition-all duration-200">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-white text-base font-medium group-hover:text-emerald-200 transition-colors duration-200">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Enhanced social proof */}
          <div className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-2xl p-4 mb-8 backdrop-blur-sm">
            <p className="text-white/80 text-sm text-center">
              💫 <strong className="text-emerald-300 font-semibold">2,847 students</strong> upgraded this week
            </p>
          </div>

          {/* Enhanced action buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold py-5 rounded-2xl shadow-2xl hover:shadow-emerald-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg border-0"
            >
              <Crown className="h-6 w-6 mr-3" />
              Start Premium
              <Sparkles className="h-5 w-5 ml-3" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/90 hover:bg-white/5 py-3 text-base rounded-xl transition-all duration-200"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};