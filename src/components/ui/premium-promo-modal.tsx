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
      <DialogContent className="w-[95vw] max-w-[1200px] max-h-[85vh] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-6">
          {/* Header Section */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex justify-center items-center gap-2">
              <Crown className="h-7 w-7 text-yellow-400" />
              <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                Mentiora Premium
              </h1>
              <Crown className="h-7 w-7 text-yellow-400" />
            </div>
            <h2 className="text-lg font-bold text-white/95">
              Path to Oxford, Cambridge & Top Universities
            </h2>
          </div>

          {/* Main Content - Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Column - Savings & Offer */}
            <div className="space-y-4">
              {/* Main Savings Highlight */}
              <div className="bg-gradient-to-r from-green-500/25 to-emerald-500/25 backdrop-blur-sm border border-green-400/40 rounded-xl p-4 text-center">
                <p className="text-green-200 text-xl font-bold mb-2">💰 Save £2,000+ Annually</p>
                <p className="text-green-100 text-sm">⏰ Child saves 15+ hours/week • 🎯 5x higher university acceptance</p>
              </div>

              {/* Offer Section */}
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-xl p-4 relative shadow-2xl">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-3 py-1 text-xs animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    LIMITED OFFER
                  </Badge>
                </div>
                
                <div className="text-center space-y-3 mt-2">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-white/60 line-through text-lg">£19.99</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      £9.99/month
                    </span>
                  </div>
                  <p className="text-white/90 text-sm">Save 50% — First 3 Months</p>
                  <p className="text-yellow-300 text-xs">Replaces £200/month tutoring</p>
                  
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    🚀 Start Free Trial
                  </Button>
                </div>
              </div>

              {/* ROI Grid */}
              <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-4">
                <h3 className="text-base font-bold text-emerald-200 mb-3 text-center">Investment Returns:</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <p className="text-emerald-100 font-semibold">Time Saved</p>
                    <p className="text-white font-bold">15+ hours/week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-100 font-semibold">Money Saved</p>
                    <p className="text-white font-bold">£2,000+/year</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-100 font-semibold">Grade Boost</p>
                    <p className="text-white font-bold">2-3 grades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-100 font-semibold">Uni Chances</p>
                    <p className="text-white font-bold">5x higher</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="space-y-4">
              <h3 className="text-center text-lg font-bold text-white">What's Included:</h3>
              
              {/* Feature 1 */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-emerald-400/40 to-emerald-600/30 p-2 rounded-lg flex-shrink-0">
                    <Target className="h-5 w-5 text-emerald-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">Predicted Exam Questions</h4>
                      <Badge className="bg-emerald-500/40 text-emerald-100 text-xs">All Boards</Badge>
                    </div>
                    <p className="text-white/85 text-xs">Eliminates exam stress • Saves 10+ study hours • Direct path to Grade 9s</p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-violet-400/40 to-violet-600/30 p-2 rounded-lg flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-violet-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">AI Grade Predictions</h4>
                      <Badge className="bg-violet-500/40 text-violet-100 text-xs">92% Accurate</Badge>
                    </div>
                    <p className="text-white/85 text-xs">Replace expensive tutoring • Track uni admission chances • Personalized plans</p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-gradient-to-br from-amber-400/40 to-amber-600/30 p-2 rounded-lg flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-amber-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">University-Ready Materials</h4>
                      <Badge className="bg-amber-500/40 text-amber-100 text-xs">£300+ Value</Badge>
                    </div>
                    <p className="text-white/85 text-xs">Russell Group prep • Career guidance • Complete study system</p>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="text-center space-y-2 border-t border-white/10 pt-4">
                <p className="text-yellow-300 font-bold text-sm">
                  ⏳ Limited spots - Secure academic advantage today
                </p>
                <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
                  <Shield className="h-4 w-4" />
                  <span>30-day guarantee • Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};