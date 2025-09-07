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
      <DialogContent className="w-[90vw] max-w-[600px] rounded-3xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-8 space-y-8">
          {/* Top Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-md animate-pulse" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-full">
                  <Crown className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Mentiora Premium 👑
            </h1>
            <h2 className="text-xl font-semibold text-white">
              Secure Their Academic Future
            </h2>
            <p className="text-white/80 max-w-md mx-auto leading-relaxed">
              Help your child achieve Grade 9s and win a place at top universities with Mentiora's most powerful tools.
            </p>
          </div>

          {/* Offer Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 relative">
            {/* LIMITED TIME OFFER ribbon */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-4 py-1 animate-pulse">
                <Clock className="h-3 w-3 mr-1" />
                LIMITED TIME OFFER
              </Badge>
            </div>
            
            <div className="text-center space-y-3 mt-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-white/60 line-through text-lg">£19.99</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  £9.99/month
                </span>
              </div>
              <p className="text-white/80 text-sm">
                Save 50% for the first 3 months — less than a single tutoring session.
              </p>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300 text-lg mt-4"
              >
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 gap-4">
            {/* Feature 1: Predicted Exam Questions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Target className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">Predicted 2026 Exam Questions</h3>
                    <Badge className="bg-green-500/20 text-green-300 text-xs">All specifications covered</Badge>
                  </div>
                  <p className="text-white/70 text-sm">
                    Exclusive predictions across AQA, Edexcel, OCR & WJEC — prepare with confidence.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Predicted Grades */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-purple-500/20 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">Predicted Grades</h3>
                    <Badge className="bg-purple-500/20 text-purple-300 text-xs">92% accuracy rate</Badge>
                  </div>
                  <p className="text-white/70 text-sm">
                    Instantly see your child's projected results and track progress towards Grade 9s.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Revision Notebook */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="bg-teal-500/20 p-2 rounded-lg">
                  <BookOpen className="h-5 w-5 text-teal-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-white">Revision Notebook</h3>
                    <Badge className="bg-teal-500/20 text-teal-300 text-xs">Worth £300+ in tutoring</Badge>
                  </div>
                  <p className="text-white/70 text-sm">
                    Smart, organised notes that save 15+ study hours weekly — simplifying revision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-4">
            <p className="text-yellow-300 font-medium italic flex items-center justify-center gap-2">
              ⏳ Limited time only — lock in this special offer today.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Shield className="h-4 w-4" />
              <span>Cancel anytime, no hidden fees.</span>
            </div>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/60 hover:text-white/80 hover:bg-white/5 py-2 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};