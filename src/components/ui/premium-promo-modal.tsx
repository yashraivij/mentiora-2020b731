import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, Clock, Target, X, Sparkles } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[900px] rounded-3xl p-0 bg-gradient-to-br from-purple-600 via-blue-700 to-teal-600 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Decorative elements */}
        <div className="absolute top-6 left-6">
          <Sparkles className="h-8 w-8 text-yellow-400/60" />
        </div>
        <div className="absolute top-6 right-16">
          <div className="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-teal-300/50" />
          </div>
        </div>
        <div className="absolute bottom-6 left-6">
          <div className="w-6 h-6 rounded bg-purple-400/30" />
        </div>

        <div className="relative z-10 p-8 text-center">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
                Mentiora Premium
              </h1>
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Secure Academic Future Success</h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Get the competitive edge to achieve Grade 9s and secure places at top universities
            </p>
          </div>

          {/* Pricing Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto">
            <div className="text-center mb-4">
              <p className="text-sm font-semibold text-blue-200 mb-2">Limited Time Offer</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-lg line-through text-white/60">£19.99</span>
                <span className="text-4xl font-bold">£9.99</span>
                <span className="text-lg text-white/80">/month</span>
              </div>
              <p className="text-yellow-300 font-semibold mb-2">Save 50% - First 3 months</p>
              <p className="text-sm text-white/70">Less than a single tutoring session</p>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              Start Free Trial
            </Button>
          </div>

          {/* Premium Features */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Premium Features</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Predicted Grade 9s */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-500/20 p-2 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Predicted Grade 9s</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Advanced analytics predict Grade 9 outcomes across all subjects based on your performance
                </p>
                <div className="bg-blue-500/20 rounded-lg px-3 py-1 inline-block">
                  <span className="text-blue-300 text-xs font-medium">92% accuracy rate</span>
                </div>
              </div>

              {/* Save 15+ Hours Weekly */}
              <div className="bg-gradient-to-br from-teal-500/20 to-green-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-yellow-500/20 p-2 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Save 15+ Hours Weekly</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Smart study recommendations and auto-generated notes reduce revision time
                </p>
                <div className="bg-green-500/20 rounded-lg px-3 py-1 inline-block">
                  <span className="text-green-300 text-xs font-medium">Worth £300+ in tutoring</span>
                </div>
              </div>

              {/* Exam Board Mastery */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Target className="h-6 w-6 text-green-400" />
                  </div>
                  <h4 className="text-lg font-semibold">Exam Board Mastery</h4>
                </div>
                <p className="text-white/80 text-sm mb-4">
                  Access to AQA, Edexcel, OCR, and WJEC predicted questions for 2026
                </p>
                <div className="bg-purple-500/20 rounded-lg px-3 py-1 inline-block">
                  <span className="text-purple-300 text-xs font-medium">All specifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};