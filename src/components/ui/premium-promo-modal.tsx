import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, GraduationCap, Target, TrendingUp, Star, X } from "lucide-react";

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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <DialogContent className="w-[92vw] max-w-[860px] min-h-[360px] rounded-3xl bg-[#0f1115] shadow-2xl border border-gray-800/50 p-8 md:p-10 animate-scale-in overflow-hidden relative">
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Subtle Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 rounded-3xl"></div>
          
          <div className="relative z-10 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                🎓 Turn Grades Into Futures
              </h1>
              
              {/* Body Text */}
              <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                With Mentiora Premium, GCSE results aren't just marks on a page — they're the key to Russell Group universities, dream careers, and a proud future.
              </p>

              {/* Value Bullets */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-base">Predict GCSE results with crystal clarity</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-base">Focus only on exam-board content that wins marks</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-base">Tailored revision plans that cut stress, boost scores</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-base">Track progress so parents know their child is on course</span>
                </div>
              </div>

              {/* Testimonials */}
              <div className="space-y-3 border-l-2 border-emerald-500/30 pl-4">
                <p className="text-sm text-gray-400 italic">
                  "Mentiora helped my son jump from 6s to 8s in just 3 months. He's now on track for a Russell Group uni."
                  <span className="block text-gray-500 text-xs mt-1">– Parent of Year 11 student</span>
                </p>
                <p className="text-sm text-gray-400 italic">
                  "I finally feel confident walking into exams."
                  <span className="block text-gray-500 text-xs mt-1">– GCSE Student</span>
                </p>
              </div>

              {/* Closing Line */}
              <p className="text-base text-gray-300 font-medium">
                Give your child the edge today — doors to top universities open with top grades.
              </p>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  onClick={handleUpgrade}
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                >
                  🚀 Start Premium Now
                </Button>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="h-12 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl transition-colors"
                >
                  Maybe later
                </Button>
              </div>
            </div>

            {/* Right Content - Proof Card */}
            <div className="hidden md:flex flex-col items-center justify-center space-y-6">
              
              {/* Success Icon */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-6 backdrop-blur-sm space-y-4 w-full">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Target className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm font-medium text-gray-300">Success Metrics</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">87%</div>
                      <div className="text-xs text-gray-500">Grade 8-9s</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">92%</div>
                      <div className="text-xs text-gray-500">Russell Group</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Premium students outperform by 2+ grades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};