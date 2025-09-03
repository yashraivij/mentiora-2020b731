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
      <DialogContent className="max-w-2xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 text-white rounded-2xl p-0 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full p-1 hover:bg-white/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-purple-500/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-400/30 to-transparent rounded-full blur-xl animate-pulse delay-1000" />

        <div className="relative z-10 p-8">
          <DialogHeader className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-xl opacity-75 animate-pulse" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-4 rounded-full">
                  <Crown className="h-10 w-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-4">
              🎓 Unlock Your Child's Full Potential
            </DialogTitle>
            <p className="text-white/90 text-base leading-relaxed max-w-lg mx-auto">
              Mentiora Premium gives students the exact tools top performers use to get ahead. Stop guessing and start revising smarter: every feature is designed to boost grades faster, with less stress.
            </p>
          </DialogHeader>

          {/* Limited time countdown */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl p-5 mb-8 text-center">
            <p className="text-red-300 text-sm font-medium mb-3">⏰ LIMITED TIME OFFER</p>
            <div className="flex justify-center space-x-3 text-white font-mono">
              <div className="bg-red-500/20 px-3 py-2 rounded-lg text-base font-bold">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <div className="bg-red-500/20 px-3 py-2 rounded-lg text-base font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <div className="bg-red-500/20 px-3 py-2 rounded-lg text-base font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4 mb-8">
            {[
              "See crystal-clear predictions of your child's GCSE grades",
              "AI-driven revision plans tailored to their exam board & weak spots",
              "Practice only what gets marks — no wasted effort",
              "Track progress so parents know exactly where their child stands"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/95 text-base font-medium leading-relaxed">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Closing urgency line */}
          <div className="text-center mb-6">
            <p className="text-white/95 text-base font-semibold">
              Give your child the edge they deserve today — exam success starts now.
            </p>
          </div>

          {/* Social proof */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
            <p className="text-white/70 text-sm text-center">
              💫 <strong className="text-emerald-400">2,847 students</strong> upgraded this week
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold py-5 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300 text-lg"
            >
              🚀 Start Premium Now
              <Sparkles className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 py-3 text-base"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};