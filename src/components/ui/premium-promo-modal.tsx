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
      <DialogContent className="w-[95vw] max-w-[1400px] h-[700px] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 h-full flex flex-col p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                👑 Mentiora Premium
              </h1>
            </div>
            <h2 className="text-lg font-bold text-white/95 mb-2">Secure Their Academic Future</h2>
            <p className="text-sm text-white/85 italic max-w-2xl mx-auto">
              "Give your child the competitive edge to achieve Grade 9s and win a place at top universities — for less than the cost of a single tutoring session."
            </p>
          </div>

          {/* Offer Card */}
          <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-md border border-white/30 rounded-xl p-5 relative shadow-2xl max-w-md mx-auto">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-1 text-sm animate-pulse shadow-lg">
                🔥 Limited Time Offer
              </Badge>
            </div>
            
            <div className="text-center space-y-2 mt-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-white/60 line-through text-lg">£19.99</span>
                <span className="text-2xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  £9.99 / month
                </span>
              </div>
              <p className="text-white/90 font-semibold text-sm">Save 50% — First 3 Months</p>
              <p className="text-yellow-300 text-sm">Smarter, more affordable than tutoring.</p>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-bold py-2 px-6 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl text-sm"
              >
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              ✨ Why Parents Choose Premium
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Save Money Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex flex-col items-center text-center gap-3">
                  <PoundSterling className="h-6 w-6 text-green-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">💷 Save Money</h4>
                    <p className="text-white/80 text-xs mb-2">Cut tutoring costs by over £300 while unlocking tools proven to raise grades.</p>
                    <Badge className="bg-green-500/40 text-green-100 text-xs">Worth £300+ in tutoring</Badge>
                  </div>
                </div>
              </div>

              {/* Save Time Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex flex-col items-center text-center gap-3">
                  <Clock className="h-6 w-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">⏳ Save Time</h4>
                    <p className="text-white/80 text-xs mb-2">Your child gets back 15+ study hours weekly with smart notes, predictions, and organised revision.</p>
                    <Badge className="bg-blue-500/40 text-blue-100 text-xs">15+ hours weekly saved</Badge>
                  </div>
                </div>
              </div>

              {/* Secure Future Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex flex-col items-center text-center gap-3">
                  <GraduationCap className="h-6 w-6 text-yellow-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm mb-2">🎓 Secure Their Future</h4>
                    <p className="text-white/80 text-xs mb-2">Exclusive 2026 exam predictions, grade forecasts, and a structured revision notebook — designed to turn effort into Grade 9s, top university places, and future career success.</p>
                    <Badge className="bg-yellow-500/40 text-yellow-100 text-xs">Pathway to University</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-3">
            <div className="text-center">
              <p className="text-yellow-300 font-semibold text-sm mb-1">⏳ Act Now</p>
              <p className="text-white/80 text-sm mb-1">"Limited time only — lock in this special price today."</p>
              <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                <Shield className="h-3 w-3" />
                <span>Cancel anytime. No hidden fees. Invest now in their future success.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};