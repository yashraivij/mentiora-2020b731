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

        <div className="relative z-10 p-8 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full shadow-2xl">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent mb-2">
              Mentiora Premium 👑
            </h1>
            <h2 className="text-xl font-bold text-white mb-3">
              Secure Their Academic Future
            </h2>
            <p className="text-white/90 text-base leading-relaxed max-w-2xl mx-auto">
              Help your child achieve Grade 9s and win a place at top universities with Mentiora's most powerful tools.
            </p>
          </div>

          {/* Offer Section */}
          <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-6 relative shadow-2xl">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-4 py-2 text-sm animate-pulse shadow-lg">
                <Clock className="h-4 w-4 mr-2" />
                LIMITED TIME OFFER
              </Badge>
            </div>
            
            <div className="text-center space-y-4 mt-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-white/70 line-through text-lg font-medium">£19.99</span>
                <span className="text-3xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                  £9.99/month
                </span>
              </div>
              <p className="text-white/90 text-sm font-medium">
                Save 50% for the first 3 months — less than a single tutoring session.
              </p>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full max-w-md mx-auto bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                🚀 Start Free Trial
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-center text-lg font-semibold text-white/90 mb-6">What's Included:</h3>
            
            {/* Feature 1: Predicted Exam Questions */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-400/30 to-green-600/20 p-3 rounded-xl shadow-lg">
                  <Target className="h-5 w-5 text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-base">Predicted 2026 Exam Questions</h4>
                    <Badge className="bg-gradient-to-r from-green-500/30 to-green-400/20 text-green-200 text-xs font-semibold">All specs covered</Badge>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Exclusive predictions across AQA, Edexcel, OCR & WJEC — prepare with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Predicted Grades */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400/30 to-purple-600/20 p-3 rounded-xl shadow-lg">
                  <TrendingUp className="h-5 w-5 text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-base">Predicted Grades</h4>
                    <Badge className="bg-gradient-to-r from-purple-500/30 to-purple-400/20 text-purple-200 text-xs font-semibold">92% accuracy</Badge>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Instantly see your child's projected results and track progress towards Grade 9s.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Revision Notebook */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-teal-400/30 to-teal-600/20 p-3 rounded-xl shadow-lg">
                  <BookOpen className="h-5 w-5 text-teal-300" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-white text-base">Revision Notebook</h4>
                    <Badge className="bg-gradient-to-r from-teal-500/30 to-teal-400/20 text-teal-200 text-xs font-semibold">Worth £300+ in tutoring</Badge>
                  </div>
                  <p className="text-white/80 text-sm leading-relaxed">
                    Smart, organised notes that save 15+ study hours weekly — simplifying revision.
                  </p>
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