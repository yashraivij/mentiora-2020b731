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
      <DialogContent className="w-[95vw] max-w-[900px] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-6 space-y-6">
          {/* Main Content - Horizontal Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
            {/* Left Section - Header & Offer */}
            <div className="space-y-4">
              <div className="text-center lg:text-left space-y-3">
                <div className="flex justify-center lg:justify-start mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-md animate-pulse" />
                    <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
                  Mentiora Premium 👑
                </h1>
                <h2 className="text-lg font-semibold text-white">
                  Secure Their Academic Future
                </h2>
                <p className="text-white/80 text-sm leading-relaxed">
                  Help your child achieve Grade 9s and win a place at top universities with Mentiora's most powerful tools.
                </p>
              </div>

              {/* Offer Section */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 relative">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-xs animate-pulse">
                    <Clock className="h-3 w-3 mr-1" />
                    LIMITED TIME OFFER
                  </Badge>
                </div>
                
                <div className="text-center space-y-3 mt-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-white/60 line-through text-sm">£19.99</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      £9.99/month
                    </span>
                  </div>
                  <p className="text-white/80 text-xs">
                    Save 50% for the first 3 months — less than a single tutoring session.
                  </p>
                  
                  <Button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Section - Features */}
            <div className="space-y-3">
              {/* Feature 1: Predicted Exam Questions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <Target className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">Predicted 2026 Exam Questions</h3>
                      <Badge className="bg-green-500/20 text-green-300 text-xs">All specs covered</Badge>
                    </div>
                    <p className="text-white/70 text-xs">
                      Exclusive predictions across AQA, Edexcel, OCR & WJEC — prepare with confidence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Predicted Grades */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-purple-500/20 p-2 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">Predicted Grades</h3>
                      <Badge className="bg-purple-500/20 text-purple-300 text-xs">92% accuracy</Badge>
                    </div>
                    <p className="text-white/70 text-xs">
                      Instantly see your child's projected results and track progress towards Grade 9s.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Revision Notebook */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="bg-teal-500/20 p-2 rounded-lg">
                    <BookOpen className="h-4 w-4 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">Revision Notebook</h3>
                      <Badge className="bg-teal-500/20 text-teal-300 text-xs">Worth £300+ in tutoring</Badge>
                    </div>
                    <p className="text-white/70 text-xs">
                      Smart, organised notes that save 15+ study hours weekly — simplifying revision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-3 border-t border-white/10 pt-4">
            <p className="text-yellow-300 font-medium italic text-sm flex items-center justify-center gap-2">
              ⏳ Limited time only — lock in this special offer today.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
              <Shield className="h-3 w-3" />
              <span>Cancel anytime, no hidden fees.</span>
            </div>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/60 hover:text-white/80 hover:bg-white/5 py-1 text-xs"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};