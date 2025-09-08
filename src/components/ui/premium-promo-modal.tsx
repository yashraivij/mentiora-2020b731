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
      <DialogContent className="w-[95vw] max-w-[900px] h-[600px] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header Area (20%) */}
          <div className="h-[20%] bg-gradient-to-r from-purple-800 to-blue-800 p-6 text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                Mentiora Premium 👑
              </h1>
            </div>
            <h2 className="text-lg font-bold text-white/95 mb-1">An Investment in Their Future</h2>
            <p className="text-sm text-white/80">Help your child achieve Grade 9s and secure their place at top universities — at a fraction of tutoring costs.</p>
          </div>

          {/* Offer Area (30%) */}
          <div className="h-[30%] flex items-center justify-center px-6">
            <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 relative shadow-2xl w-full max-w-md">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold px-4 py-1 text-sm animate-pulse shadow-lg">
                  Limited Time Offer
                </Badge>
              </div>
              
              <div className="text-center space-y-4 mt-2">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/60 line-through text-xl">£19.99</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    £9.99/month
                  </span>
                </div>
                <p className="text-white/90 font-semibold">Save 50% — First 3 Months</p>
                <p className="text-yellow-300 text-sm">Less than a single tutoring session</p>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                >
                  🚀 Start Free Trial
                </Button>
              </div>
            </div>
          </div>

          {/* Feature Cards (40%) */}
          <div className="h-[40%] px-6">
            <div className="grid grid-cols-3 gap-4 h-full">
              {/* Save Money Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col justify-between">
                  <div>
                    <PoundSterling className="h-8 w-8 text-green-400 mx-auto mb-3" />
                    <h3 className="font-bold text-white text-lg mb-2">Save Money 💷</h3>
                    <p className="text-white/80 text-sm mb-2">Worth £300+ in tutoring savings</p>
                  </div>
                  <Badge className="bg-green-500/40 text-green-100 text-xs mx-auto">Smarter Investment</Badge>
                </div>
              </div>

              {/* Save Time Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col justify-between">
                  <div>
                    <Clock className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-bold text-white text-lg mb-2">Save Time ⏳</h3>
                    <p className="text-white/80 text-sm mb-2">15+ study hours saved weekly with organised revision tools</p>
                  </div>
                  <Badge className="bg-blue-500/40 text-blue-100 text-xs mx-auto">More Family Time</Badge>
                </div>
              </div>

              {/* Secure Future Card */}
              <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:from-white/20 hover:to-white/10 transition-all duration-300 hover:scale-105 shadow-lg">
                <div className="text-center h-full flex flex-col justify-between">
                  <div>
                    <GraduationCap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                    <h3 className="font-bold text-white text-lg mb-2">Secure Future 🎓</h3>
                    <p className="text-white/80 text-sm mb-2">Predicted exam questions + grade forecasts → better university chances</p>
                  </div>
                  <Badge className="bg-yellow-500/40 text-yellow-100 text-xs mx-auto">Pathway to Success</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Area (10%) */}
          <div className="h-[10%] flex items-center justify-center px-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-yellow-300 font-semibold text-sm mb-1">⏳ Limited time only — lock in this offer today</p>
              <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                <Shield className="h-3 w-3" />
                <span>Cancel anytime. No hidden fees.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};