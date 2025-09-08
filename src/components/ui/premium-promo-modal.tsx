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

        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Mentiora Premium
              </h1>
              <Crown className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white/95 mb-4">Secure Their Academic Future</h2>
            <p className="text-lg text-white/85 max-w-3xl mx-auto">
              Give your child the competitive edge to achieve Grade 9s and win a place at top universities — for less than the cost of a single tutoring session.
            </p>
          </div>

          {/* Offer Card */}
          <div className="flex justify-center mb-10">
            <div className="bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 relative shadow-2xl max-w-lg w-full">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-6 py-2 text-base animate-pulse shadow-lg">
                  🔥 Limited Time Offer
                </Badge>
              </div>
              
              <div className="text-center space-y-4 mt-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/60 line-through text-2xl">£19.99</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    £9.99
                  </span>
                  <span className="text-xl text-white/90">/month</span>
                </div>
                <p className="text-white/95 font-semibold text-lg">Save 50% — First 3 Months</p>
                <p className="text-yellow-300 text-base">Smarter, more affordable than tutoring.</p>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-xl shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl text-lg"
                >
                  Start Free Trial
                </Button>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
              Premium Features
            </h3>
            
            <div className="grid grid-cols-3 gap-6 h-full max-h-64">
              {/* Save Money Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col">
                  <PoundSterling className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white text-xl mb-3">💷 Save Money</h4>
                  <p className="text-white/85 text-base mb-4 flex-1">Cut tutoring costs by over £300 while unlocking tools proven to raise grades.</p>
                  <Badge className="bg-green-500/40 text-green-100 text-sm mx-auto">Worth £300+ in tutoring</Badge>
                </div>
              </div>

              {/* Save Time Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col">
                  <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white text-xl mb-3">⏳ Save Time</h4>
                  <p className="text-white/85 text-base mb-4 flex-1">Your child gets back 15+ study hours weekly with smart notes, predictions, and organised revision.</p>
                  <Badge className="bg-blue-500/40 text-blue-100 text-sm mx-auto">15+ hours weekly saved</Badge>
                </div>
              </div>

              {/* Secure Future Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col">
                  <GraduationCap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                  <h4 className="font-bold text-white text-xl mb-3">🎓 Secure Their Future</h4>
                  <p className="text-white/85 text-base mb-4 flex-1">Exclusive 2026 exam predictions, grade forecasts, and a structured revision notebook — designed to turn effort into Grade 9s, top university places, and future career success.</p>
                  <Badge className="bg-yellow-500/40 text-yellow-100 text-sm mx-auto">Pathway to University</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 pt-6 mt-8">
            <div className="text-center">
              <p className="text-yellow-300 font-semibold text-lg mb-2">⏳ Act Now</p>
              <p className="text-white/85 text-base mb-2">"Limited time only — lock in this special price today."</p>
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <Shield className="h-4 w-4" />
                <span>Cancel anytime. No hidden fees. Invest now in their future success.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};