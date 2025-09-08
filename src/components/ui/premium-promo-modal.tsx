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
      <DialogContent className="w-[90vw] max-w-[700px] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-4 space-y-4">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-full shadow-2xl">
                  <Crown className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
              Mentiora Premium 👑
            </h1>
            <h2 className="text-base md:text-lg font-bold text-white">
              Secure Their Academic Future
            </h2>
            <p className="text-white/90 text-xs md:text-sm leading-relaxed max-w-lg mx-auto">
              Help your child achieve Grade 9s and win a place at top universities with Mentiora's most powerful tools.
            </p>
          </div>

          {/* Offer Section */}
          <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-xl p-4 relative shadow-2xl">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-3 py-1 text-xs animate-pulse shadow-lg">
                <Clock className="h-3 w-3 mr-1" />
                LIMITED TIME OFFER
              </Badge>
            </div>
            
            <div className="text-center space-y-3 mt-3">
              <div className="flex items-center justify-center gap-2">
                <span className="text-white/70 line-through text-base font-medium">£19.99</span>
                <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  £9.99/month
                </span>
              </div>
              <p className="text-white/90 text-xs md:text-sm font-medium">
                Save 50% for the first 3 months — less than a single tutoring session.
              </p>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full max-w-sm mx-auto bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-sm md:text-base"
              >
                🚀 Start Free Trial
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-3">
            <h3 className="text-center text-base md:text-lg font-bold text-white mb-3">What's Included:</h3>
            
            {/* Feature 1: Predicted Exam Questions */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-lg p-3 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-green-400/40 to-green-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <Target className="h-4 w-4 text-green-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                    <h4 className="font-bold text-white text-xs md:text-sm">Predicted 2026 Exam Questions</h4>
                    <Badge className="bg-gradient-to-r from-green-500/40 to-green-400/30 text-green-100 text-xs font-semibold w-fit">All specs covered</Badge>
                  </div>
                  <p className="text-white/85 text-xs leading-relaxed">
                    Exclusive predictions across AQA, Edexcel, OCR & WJEC — prepare with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Predicted Grades */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-lg p-3 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-purple-400/40 to-purple-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                    <h4 className="font-bold text-white text-xs md:text-sm">Predicted Grades</h4>
                    <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-400/30 text-purple-100 text-xs font-semibold w-fit">92% accuracy</Badge>
                  </div>
                  <p className="text-white/85 text-xs leading-relaxed">
                    Instantly see your child's projected results and track progress towards Grade 9s.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Revision Notebook */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-lg p-3 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-teal-400/40 to-teal-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-teal-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 mb-1">
                    <h4 className="font-bold text-white text-xs md:text-sm">Revision Notebook</h4>
                    <Badge className="bg-gradient-to-r from-teal-500/40 to-teal-400/30 text-teal-100 text-xs font-semibold w-fit">Worth £300+ in tutoring</Badge>
                  </div>
                  <p className="text-white/85 text-xs leading-relaxed">
                    Smart, organised notes that save 15+ study hours weekly — simplifying revision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-1 border-t border-white/10 pt-3">
            <p className="text-yellow-300 font-medium italic text-xs flex items-center justify-center gap-1">
              ⏳ Limited time only — lock in this special offer today.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-xs">
              <Shield className="h-3 w-3" />
              <span>Cancel anytime, no hidden fees.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};