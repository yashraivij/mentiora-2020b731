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
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 text-white rounded-2xl p-0 overflow-hidden">
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

        <div className="relative z-10 p-6">
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-lg opacity-75 animate-pulse" />
                <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-full">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400 animate-bounce" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-semibold text-white mb-2">
              Unlock Premium 🎓
            </DialogTitle>
            <p className="text-white/80 text-sm leading-relaxed">
              Get crystal-clear grade predictions, smarter revision plans, and full access—no paywalls.
            </p>
          </DialogHeader>

          {/* Limited time countdown */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-300 text-xs font-medium mb-2">⏰ LIMITED TIME OFFER</p>
            <div className="flex justify-center space-x-2 text-white font-mono">
              <div className="bg-red-500/20 px-2 py-1 rounded text-sm">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <div className="bg-red-500/20 px-2 py-1 rounded text-sm">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <div className="bg-red-500/20 px-2 py-1 rounded text-sm">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {[
              "Predict your exact GCSE grades",
              "Targeted, exam-board-specific practice",
              "Instant weak-area fixes"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-white/90 text-sm font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 mb-6">
            <p className="text-white/70 text-xs text-center">
              💫 <strong className="text-emerald-400">2,847 students</strong> upgraded this week
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300 text-base"
            >
              <Crown className="h-5 w-5 mr-2" />
              Start Premium
              <Sparkles className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 py-2 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};