import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Target, BookOpen, TrendingUp, Clock, Shield } from "lucide-react";

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
      <DialogContent className="w-[1400px] h-[700px] rounded-3xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-10 h-full flex flex-col">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              👑 Mentiora Premium
            </h1>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Secure Their Academic Future
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto leading-relaxed text-lg">
              "Give your child the competitive edge to achieve Grade 9s and win a place at top universities — for less than the cost of a single tutoring session."
            </p>
          </div>

          {/* Offer Section */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-lg border border-white/30 rounded-3xl p-8 mb-8 relative shadow-2xl">
            {/* LIMITED TIME OFFER ribbon */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-6 py-2 rounded-full animate-pulse shadow-lg">
                🔥 Limited Time Offer
              </div>
            </div>
            
            <div className="text-center space-y-4 mt-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/60 line-through text-2xl">£19.99</span>
                <span className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  £9.99 / month
                </span>
              </div>
              <p className="text-white/90 text-lg font-medium">
                Save 50% — First 3 Months<br />
                Smarter, more affordable than tutoring.
              </p>
              
              <Button 
                onClick={handleUpgrade}
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-6 px-12 rounded-2xl shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-xl mt-6"
              >
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              ✨ Why Parents Choose Premium
            </h3>
            
            <div className="grid grid-cols-3 gap-6 mb-6">
              {/* Save Money */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-center space-y-3">
                  <div className="text-3xl mb-2">💷</div>
                  <h4 className="font-bold text-white text-lg">Save Money</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Cut tutoring costs by over £300 while unlocking tools proven to raise grades.
                  </p>
                  <Badge className="bg-green-500/20 text-green-300 text-xs px-3 py-1">
                    Worth £300+ in tutoring
                  </Badge>
                </div>
              </div>

              {/* Save Time */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-center space-y-3">
                  <div className="text-3xl mb-2">⏳</div>
                  <h4 className="font-bold text-white text-lg">Save Time</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Your child gets back 15+ study hours weekly with smart notes, predictions, and organised revision.
                  </p>
                  <Badge className="bg-blue-500/20 text-blue-300 text-xs px-3 py-1">
                    15+ hours weekly saved
                  </Badge>
                </div>
              </div>

              {/* Secure Future */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-center space-y-3">
                  <div className="text-3xl mb-2">🎓</div>
                  <h4 className="font-bold text-white text-lg">Secure Their Future</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Exclusive 2026 exam predictions, grade forecasts, and a structured revision notebook — designed to turn effort into Grade 9s, top university places, and future career success.
                  </p>
                  <Badge className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1">
                    Pathway to University
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-3">
            <h4 className="text-lg font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              ⏳ Act Now
            </h4>
            <p className="text-yellow-300 font-medium italic">
              "Limited time only — lock in this special price today."
            </p>
            <p className="text-white/70 text-sm">
              Cancel anytime. No hidden fees. Invest now in their future success.
            </p>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/60 hover:text-white/80 hover:bg-white/5 py-2 text-sm mt-2"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};