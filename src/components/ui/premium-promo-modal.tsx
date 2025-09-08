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
      <DialogContent className="w-[95vw] max-w-[1200px] h-[500px] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 h-full grid grid-cols-12 gap-6 p-6">
          {/* Left Column - Header & Offer */}
          <div className="col-span-5 flex flex-col justify-between">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2 mb-3">
                <Crown className="h-7 w-7 text-yellow-400" />
                <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  Mentiora Premium
                </h1>
              </div>
              <h2 className="text-xl font-bold text-white/95 mb-3">Secure Their Academic Future</h2>
              <p className="text-sm text-white/85 italic">
                "Give your child the competitive edge to achieve Grade 9s and win a place at top universities — for less than the cost of a single tutoring session."
              </p>
            </div>

            {/* Offer Card */}
            <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 relative shadow-2xl">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-1 text-sm animate-pulse shadow-lg">
                  🔥 Limited Time Offer
                </Badge>
              </div>
              
              <div className="text-center space-y-3 mt-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/60 line-through text-xl">£19.99</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    £9.99 / month
                  </span>
                </div>
                <p className="text-white/90 font-semibold">Save 50% — First 3 Months</p>
                <p className="text-yellow-300 text-sm">Smarter, more affordable than tutoring.</p>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="col-span-7">
            <h3 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              ✨ Why Parents Choose Premium
            </h3>
            
            <div className="grid grid-rows-3 gap-3 h-full">
              {/* Save Money Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex items-center gap-4">
                  <PoundSterling className="h-8 w-8 text-green-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg mb-1">💷 Save Money</h4>
                    <p className="text-white/80 text-sm mb-2">Cut tutoring costs by over £300 while unlocking tools proven to raise grades.</p>
                    <Badge className="bg-green-500/40 text-green-100 text-xs">Worth £300+ in tutoring</Badge>
                  </div>
                </div>
              </div>

              {/* Save Time Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg mb-1">⏳ Save Time</h4>
                    <p className="text-white/80 text-sm mb-2">Your child gets back 15+ study hours weekly with smart notes, predictions, and organised revision.</p>
                    <Badge className="bg-blue-500/40 text-blue-100 text-xs">15+ hours weekly saved</Badge>
                  </div>
                </div>
              </div>

              {/* Secure Future Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-[1.02] shadow-lg">
                <div className="flex items-center gap-4">
                  <GraduationCap className="h-8 w-8 text-yellow-400 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg mb-1">🎓 Secure Their Future</h4>
                    <p className="text-white/80 text-sm mb-2">Exclusive 2026 exam predictions, grade forecasts, and a structured revision notebook — designed to turn effort into Grade 9s, top university places, and future career success.</p>
                    <Badge className="bg-yellow-500/40 text-yellow-100 text-xs">Pathway to University</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Spans full width at bottom */}
          <div className="col-span-12 border-t border-white/10 pt-3">
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