import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GraduationCap, CheckCircle, Award, TrendingUp, X } from "lucide-react";

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

  const handleMaybeLater = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] max-w-[860px] min-h-[360px] rounded-3xl p-8 md:p-10 bg-[#0f1115] shadow-2xl border-none animate-scale-in">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
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
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">Predict GCSE results with crystal clarity</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">Focus only on exam-board content that wins marks</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">Tailored revision plans that cut stress, boost scores</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-200">Track progress so parents know their child is on course</span>
              </div>
            </div>

            {/* Social Proof */}
            <div className="space-y-3 pt-4 border-t border-gray-700">
              <p className="text-sm italic text-gray-400">
                "Mentiora helped my son jump from 6s to 8s in just 3 months. He's now on track for a Russell Group uni."
              </p>
              <p className="text-xs text-gray-500">– Parent of Year 11 student</p>
              
              <p className="text-sm italic text-gray-400">
                "I finally feel confident walking into exams."
              </p>
              <p className="text-xs text-gray-500">– GCSE Student</p>
            </div>

            {/* Closing urgency line */}
            <p className="text-base font-medium text-emerald-300 pt-2">
              Give your child the edge today — doors to top universities open with top grades.
            </p>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                🚀 Start Premium Now
              </Button>
              
              <button
                onClick={handleMaybeLater}
                className="w-full text-gray-400 hover:text-gray-300 text-sm transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>

          {/* Right Content - Proof Card */}
          <div className="hidden md:block">
            <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">97%</div>
                      <div className="text-xs text-gray-400">Grade Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-teal-400">85%</div>
                      <div className="text-xs text-gray-400">Russell Group</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">£9.99</div>
                    <div className="text-sm text-gray-400">vs £300+ tutoring</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-700">
                  <Award className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-300 font-medium">Premium Success Track</p>
                  <p className="text-xs text-gray-400">Join elite families</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};