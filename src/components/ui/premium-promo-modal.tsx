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
      <DialogContent className="w-[95vw] max-w-[900px] rounded-3xl p-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Premium background animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-purple-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-400/20 to-yellow-400/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        <div className="relative z-10 p-8 space-y-8">
          {/* Top Section - Premium headline */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent leading-tight">
              👑 Mentiora Premium
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-white/95">
              Secure Their Academic Future
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              "Give your child the competitive edge to achieve Grade 9s and win a place at top universities — for less than the cost of a single tutoring session."
            </p>
          </div>

          {/* Offer Section - Center focus */}
          <div className="bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 border border-red-400/50 rounded-full px-4 py-2">
              <span className="text-lg font-bold text-yellow-300">🔥 Limited Time Offer</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl text-white/60 line-through">£19.99</span>
                <span className="text-4xl font-black text-yellow-400">£9.99</span>
                <span className="text-xl text-white/80">/ month</span>
              </div>
              <p className="text-lg font-semibold text-orange-300">Save 50% — First 3 Months</p>
              <p className="text-sm text-white/70">Smarter, more affordable than tutoring.</p>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 text-xl relative overflow-hidden group border-0"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                Start Free Trial
              </span>
            </Button>
          </div>

          {/* Feature Section - 3 rounded cards */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-white/95">✨ Why Parents Choose Premium</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-3 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 p-3 rounded-full">
                    <PoundSterling className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">💷 Save Money</h4>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Cut tutoring costs by over £300 while unlocking tools proven to raise grades.
                </p>
                <div className="inline-block bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-green-300">Worth £300+ in tutoring</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-3 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">⏳ Save Time</h4>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Your child gets back 15+ study hours weekly with smart notes, predictions, and organised revision.
                </p>
                <div className="inline-block bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-blue-300">15+ hours weekly saved</span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-3 hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/20 p-3 rounded-full">
                    <University className="h-6 w-6 text-purple-400" />
                  </div>
                  <h4 className="text-lg font-bold text-white">🎓 Secure Their Future</h4>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">
                  Exclusive 2026 exam predictions, grade forecasts, and a structured revision notebook — designed to turn effort into Grade 9s, top university places, and future career success.
                </p>
                <div className="inline-block bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">
                  <span className="text-xs font-semibold text-purple-300">Pathway to University</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section - Urgency + Reassurance */}
          <div className="text-center space-y-3">
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
              <h4 className="text-lg font-bold text-red-300 mb-2">⏳ Act Now</h4>
              <p className="text-sm text-white/80">
                "Limited time only — lock in this special price today."
              </p>
            </div>
            <p className="text-sm text-white/60">
              Cancel anytime. No hidden fees. Invest now in their future success.
            </p>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/50 hover:text-white/70 hover:bg-white/5 py-2 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};