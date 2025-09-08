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
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 h-full flex flex-col overflow-y-auto">
          {/* Header & Offer Section */}
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-3">
              <div className="flex justify-center mb-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full shadow-2xl">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                  Mentiora Premium 👑
                </h1>
                <h2 className="text-base lg:text-lg font-bold text-white/95">
                  Secure Their Academic Future
                </h2>
                <p className="text-white/80 text-sm leading-relaxed max-w-sm mx-auto">
                  Help your child achieve Grade 9s and win a place at top universities.
                </p>
              </div>
            </div>

            {/* Offer Section */}
            <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-xl p-5 relative shadow-2xl max-w-md mx-auto">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-3 py-1 text-xs animate-pulse shadow-lg">
                  <Clock className="h-3 w-3 mr-1" />
                  LIMITED OFFER
                </Badge>
              </div>
              
              <div className="text-center space-y-4 mt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-white/60 line-through text-base font-medium">£19.99</span>
                    <span className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      £9.99/month
                    </span>
                  </div>
                  <p className="text-white/90 text-sm font-medium">
                    Save 50% for 3 months — less than one tutoring session.
                  </p>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-sm"
                >
                  🚀 Start Free Trial
                </Button>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="flex-1 p-6 space-y-4">
            <h3 className="text-center text-base lg:text-lg font-bold text-white mb-4">What's Included:</h3>
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-green-400/40 to-green-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <Target className="h-4 w-4 text-green-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">Predicted Exam Questions</h4>
                    <Badge className="bg-gradient-to-r from-green-500/40 to-green-400/30 text-green-100 text-xs font-semibold">All specs</Badge>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    Exclusive predictions across AQA, Edexcel, OCR & WJEC.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-purple-400/40 to-purple-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-purple-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">Predicted Grades</h4>
                    <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-400/30 text-purple-100 text-xs font-semibold">92% accuracy</Badge>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    See projected results and track progress towards Grade 9s.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-teal-400/40 to-teal-600/30 p-2 rounded-lg shadow-lg flex-shrink-0">
                  <BookOpen className="h-4 w-4 text-teal-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">Revision Notebook</h4>
                    <Badge className="bg-gradient-to-r from-teal-500/40 to-teal-400/30 text-teal-100 text-xs font-semibold">£300+ value</Badge>
                  </div>
                  <p className="text-white/85 text-sm leading-relaxed">
                    Smart notes that save 15+ study hours weekly.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="text-center space-y-2 border-t border-white/10 pt-4 mt-4">
              <p className="text-yellow-300 font-medium italic text-sm flex items-center justify-center gap-1">
                ⏳ Limited time — lock in this offer today.
              </p>
              <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                <Shield className="h-4 w-4" />
                <span>Cancel anytime, no hidden fees.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};