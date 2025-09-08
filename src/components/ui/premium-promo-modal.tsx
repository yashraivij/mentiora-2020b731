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
      <DialogContent className="w-[95vw] max-w-[1100px] max-h-[90vh] rounded-3xl p-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 border-0 text-white shadow-2xl mx-auto overflow-y-auto">
        {/* Premium background animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-purple-500/10 animate-pulse" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-400/20 to-yellow-400/15 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '5s', animationDelay: '1s' }} />

        <div className="relative z-10 p-6 space-y-6">
          {/* Top Section - Premium headline */}
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent leading-tight">
              👑 Mentiora Premium
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-white/95">
              Secure Their Academic Future
            </h2>
          </div>

          {/* Investment Value - Front and Center */}
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/50 rounded-3xl p-6 text-center">
            <h3 className="text-2xl font-black text-green-300 mb-4">💰 Your Investment Returns</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-black text-green-400">£300+</div>
                <div className="text-sm text-white/80">Saved vs Tutoring</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-black text-blue-400">15+</div>
                <div className="text-sm text-white/80">Hours Saved Weekly</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-3xl font-black text-purple-400">Grade 9s</div>
                <div className="text-sm text-white/80">+ University Place</div>
              </div>
            </div>
            <p className="text-lg font-semibold text-white/90">
              "Less than one tutoring session. Lifetime impact on their future."
            </p>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300 text-xl relative overflow-hidden group border-0 mt-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                🚀 Invest in Their Future - Start Now
              </span>
            </Button>
          </div>

          {/* Concrete Benefits - What Parents Get */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-white/95">🎯 What Your Child Gets</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/30 p-3 rounded-full">
                    <PoundSterling className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">Save £300+ on Tutoring Costs</h4>
                    <p className="text-sm text-white/80">Replace expensive 1-on-1 tutoring with AI-powered tools that deliver better results for a fraction of the cost.</p>
                  </div>
                  <div className="bg-green-500/20 border border-green-400/30 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-green-300">£300+ SAVED</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/30 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">Get Back 15+ Hours Weekly</h4>
                    <p className="text-sm text-white/80">Smart study plans, instant notes, and targeted practice mean your child studies smarter, not harder.</p>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-blue-300">15+ HOURS</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/30 p-3 rounded-full">
                    <University className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">Secure University Place</h4>
                    <p className="text-sm text-white/80">2026 exam predictions, grade forecasting, and structured revision designed to achieve Grade 9s and Russell Group admission.</p>
                  </div>
                  <div className="bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-purple-300">UNI READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-6 text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/30 to-orange-500/30 border border-red-400/50 rounded-full px-4 py-2">
              <span className="text-lg font-bold text-yellow-300">🔥 Limited Time Investment</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl text-white/60 line-through">£19.99</span>
                <span className="text-4xl font-black text-yellow-400">£9.99</span>
                <span className="text-xl text-white/80">/ month</span>
              </div>
              <p className="text-lg font-semibold text-orange-300">50% OFF — Lock in this price today</p>
              <p className="text-sm text-white/70">Less than one tutoring session. Better results guaranteed.</p>
            </div>

          </div>

          {/* Footer Section - Urgency + Reassurance */}
          <div className="text-center space-y-3">
            <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-4">
              <h4 className="text-lg font-bold text-red-300 mb-2">⏳ Limited Time Only</h4>
              <p className="text-sm text-white/80">
                "This special price expires soon. Secure their academic future today."
              </p>
            </div>
            <p className="text-sm text-white/60">
              Cancel anytime • No hidden fees • 30-day money-back guarantee
            </p>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/50 hover:text-white/70 hover:bg-white/5 py-2 text-sm"
            >
              I'll think about it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};