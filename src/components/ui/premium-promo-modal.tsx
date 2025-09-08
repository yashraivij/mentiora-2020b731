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
      <DialogContent className="w-[95vw] max-w-[650px] max-h-[85vh] rounded-2xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 border-0 text-white shadow-2xl mx-auto overflow-auto">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/15 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tl from-yellow-400/15 to-orange-400/10 rounded-full blur-2xl" />

        <div className="relative z-10 p-6 space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Crown className="h-7 w-7 text-yellow-400" />
              <h1 className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                Mentiora Premium
              </h1>
              <Crown className="h-7 w-7 text-yellow-400" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-xl lg:text-2xl font-bold text-white/95">
                Your Child's Path to Oxford, Cambridge & Top Universities
              </h2>
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 max-w-lg mx-auto">
                <p className="text-green-200 text-lg font-bold mb-2">💰 Save £2,000+ in Tutoring Costs</p>
                <p className="text-green-100 text-sm">⏰ Your child saves 15+ hours weekly • 🎯 Direct path to Grade 9s</p>
              </div>
            </div>
          </div>

          {/* Offer Section */}
          <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-xl p-5 relative shadow-2xl max-w-md mx-auto">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-3 py-1 text-xs animate-pulse shadow-lg">
                <Clock className="h-3 w-3 mr-1" />
                LIMITED TIME OFFER
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
                  Save 50% — First 3 Months (less than 1 tutoring session)
                </p>
                <p className="text-yellow-300 text-xs font-semibold">
                  Replaces £200/month tutoring costs
                </p>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300"
              >
                🚀 Start Free Trial - Secure Their Future
              </Button>
            </div>
          </div>

          {/* ROI Section */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-xl p-5 text-center">
            <h3 className="text-lg font-bold text-emerald-200 mb-3">Your Investment Returns:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-emerald-100 font-bold">Time Saved</p>
                <p className="text-white">15+ hours/week</p>
              </div>
              <div>
                <p className="text-emerald-100 font-bold">Money Saved</p>
                <p className="text-white">£2,000+ annually</p>
              </div>
              <div>
                <p className="text-emerald-100 font-bold">Grade Improvement</p>
                <p className="text-white">2-3 grade increases</p>
              </div>
              <div>
                <p className="text-emerald-100 font-bold">University Acceptance</p>
                <p className="text-white">5x higher chance</p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h3 className="text-center text-lg font-bold text-white">Premium Features That Deliver Results:</h3>
            
            {/* Feature 1 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-emerald-400/40 to-emerald-600/30 p-3 rounded-lg shadow-lg flex-shrink-0">
                  <Target className="h-5 w-5 text-emerald-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">Predicted Exam Questions (2026)</h4>
                    <Badge className="bg-emerald-500/40 text-emerald-100 text-xs">All Boards</Badge>
                  </div>
                  <p className="text-white/85 text-sm">Eliminates exam anxiety • Saves 10+ hours of ineffective studying • Direct path to Grade 9s</p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-violet-400/40 to-violet-600/30 p-3 rounded-lg shadow-lg flex-shrink-0">
                  <TrendingUp className="h-5 w-5 text-violet-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">AI Grade Predictions & Smart Study</h4>
                    <Badge className="bg-violet-500/40 text-violet-100 text-xs">92% Accuracy</Badge>
                  </div>
                  <p className="text-white/85 text-sm">Replace expensive tutoring • Personalized study plans • Track university admission chances</p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-sm border border-white/25 rounded-xl p-4 hover:bg-white/20 transition-all duration-300 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-amber-400/40 to-amber-600/30 p-3 rounded-lg shadow-lg flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-amber-200" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-white text-sm">University-Ready Revision System</h4>
                    <Badge className="bg-amber-500/40 text-amber-100 text-xs">£300+ Value</Badge>
                  </div>
                  <p className="text-white/85 text-sm">Complete study materials • Russell Group university preparation • Career pathway guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-3 border-t border-white/10 pt-4">
            <p className="text-yellow-300 font-bold text-sm">
              ⏳ Limited spots available - Secure your child's academic advantage today
            </p>
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              <span>30-day money-back guarantee • Cancel anytime</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};