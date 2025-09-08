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
      <DialogContent className="w-[90vw] max-w-[1000px] h-[85vh] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex">
          {/* Left Column - Header & Offer */}
          <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent mb-2">
                Mentiora Premium 👑
              </h1>
              <h2 className="text-2xl font-bold text-white mb-3">
                Secure Their Academic Future
              </h2>
              <p className="text-white/90 text-lg leading-relaxed">
                Help your child achieve Grade 9s and win a place at top universities with Mentiora's most powerful tools.
              </p>
            </div>

            {/* Offer Section */}
            <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-8 relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-6 py-3 text-base animate-pulse shadow-lg">
                  <Clock className="h-5 w-5 mr-2" />
                  LIMITED TIME OFFER
                </Badge>
              </div>
              
              <div className="text-center space-y-6 mt-4">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-white/70 line-through text-2xl font-medium">£19.99</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    £9.99/month
                  </span>
                </div>
                <p className="text-white/90 text-base font-medium">
                  Save 50% for the first 3 months — less than a single tutoring session.
                </p>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-5 px-10 rounded-xl shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-xl"
                >
                  🚀 Start Free Trial
                </Button>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="text-center space-y-3 border-t border-white/10 pt-4">
              <p className="text-yellow-300 font-medium italic text-base flex items-center justify-center gap-2">
                ⏳ Limited time only — lock in this special offer today.
              </p>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Shield className="h-4 w-4" />
                <span>Cancel anytime, no hidden fees.</span>
              </div>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="flex-1 p-8 flex flex-col justify-center">
            <div className="space-y-6">
              <h3 className="text-center text-2xl font-bold text-white mb-8">What's Included:</h3>
              
              {/* Feature 1: Predicted Exam Questions */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-green-400/40 to-green-600/30 p-4 rounded-2xl shadow-lg">
                    <Target className="h-7 w-7 text-green-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-white text-lg">Predicted 2026 Exam Questions</h4>
                      <Badge className="bg-gradient-to-r from-green-500/40 to-green-400/30 text-green-100 text-sm font-semibold">All specs covered</Badge>
                    </div>
                    <p className="text-white/85 text-base leading-relaxed">
                      Exclusive predictions across AQA, Edexcel, OCR & WJEC — prepare with confidence.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Predicted Grades */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-purple-400/40 to-purple-600/30 p-4 rounded-2xl shadow-lg">
                    <TrendingUp className="h-7 w-7 text-purple-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-white text-lg">Predicted Grades</h4>
                      <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-400/30 text-purple-100 text-sm font-semibold">92% accuracy</Badge>
                    </div>
                    <p className="text-white/85 text-base leading-relaxed">
                      Instantly see your child's projected results and track progress towards Grade 9s.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Revision Notebook */}
              <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="flex items-start gap-5">
                  <div className="bg-gradient-to-br from-teal-400/40 to-teal-600/30 p-4 rounded-2xl shadow-lg">
                    <BookOpen className="h-7 w-7 text-teal-200" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-bold text-white text-lg">Revision Notebook</h4>
                      <Badge className="bg-gradient-to-r from-teal-500/40 to-teal-400/30 text-teal-100 text-sm font-semibold">Worth £300+ in tutoring</Badge>
                    </div>
                    <p className="text-white/85 text-base leading-relaxed">
                      Smart, organised notes that save 15+ study hours weekly — simplifying revision.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};