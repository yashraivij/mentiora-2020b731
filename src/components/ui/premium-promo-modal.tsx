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
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] rounded-2xl p-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 border-0 text-white shadow-2xl mx-auto overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              👑 Mentiora Premium 👑
            </h1>
            <p className="text-xl text-white/90 font-semibold">
              Transform Your Child's Academic Success
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-green-300">£300+</div>
                <div className="text-sm text-white/80">Saved vs Tutoring</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-400/30 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-300">15+</div>
                <div className="text-sm text-white/80">Hours Saved Weekly</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-purple-300">Grade 9s</div>
                <div className="text-sm text-white/80">Target Results</div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-green-400/30 rounded-xl">
                <div className="bg-green-500/30 p-2 rounded-full">
                  <PoundSterling className="h-5 w-5 text-green-300" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-lg">Save £300+ on tutoring costs</span>
                  <p className="text-white/70 text-sm">AI-powered learning at a fraction of the cost</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl">
                <div className="bg-blue-500/30 p-2 rounded-full">
                  <Clock className="h-5 w-5 text-blue-300" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-lg">Get back 15+ hours weekly</span>
                  <p className="text-white/70 text-sm">Smart study plans and instant note generation</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm border border-purple-400/30 rounded-xl">
                <div className="bg-purple-500/30 p-2 rounded-full">
                  <University className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1">
                  <span className="text-white font-semibold text-lg">Secure university placement</span>
                  <p className="text-white/70 text-sm">Grade predictions and targeted exam prep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-2 border-yellow-400/50 rounded-2xl p-6 text-center space-y-4 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl text-white/60 line-through">£19.99</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">£9.99</span>
                <span className="text-lg text-white/80">/ month</span>
              </div>
              <p className="text-lg font-semibold text-yellow-300">🔥 50% OFF - Limited Time Only</p>
              <p className="text-white/90 font-medium">Less than one tutoring session. Lifetime impact.</p>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
            >
              🚀 Unlock Premium Features Now
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-sm text-white/60">
              Cancel anytime • No hidden fees • 30-day money-back guarantee
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
      </DialogContent>
    </Dialog>
  );
};