import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, X, GraduationCap, TrendingUp } from "lucide-react";

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
      <DialogContent className="w-[88vw] max-w-[780px] min-h-[280px] rounded-3xl p-6 md:p-8 bg-[#0f1115] border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 rounded-full p-1.5 hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-violet-500/10" />
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-violet-400/20 to-transparent rounded-full blur-2xl" />

        <div className="relative z-10 grid md:grid-cols-[1.2fr_1fr] gap-6 md:gap-8 items-center">
          {/* Left Side - Content */}
          <div className="space-y-4">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                🎓 Turn Grades Into Futures
              </h1>
              <p className="text-sm md:text-base text-gray-300/90 leading-relaxed">
                With Mentiora Premium, GCSE results aren't just marks on a page — they're the key to Russell Group universities, dream careers, and a proud future.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2">
              {[
                "Predict GCSE results with crystal clarity",
                "Focus only on exam-board content that wins marks",
                "Tailored revision plans that cut stress, boost scores",
                "Track progress so parents know their child is on course"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-white/90 text-xs md:text-sm font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-2 border-l-2 border-gradient-to-b from-emerald-500 to-teal-500 pl-3">
              <p className="text-gray-400 text-xs italic">
                "Mentiora helped my son jump from 6s to 8s in just 3 months. He's now on track for a Russell Group uni." 
                <span className="text-gray-500 not-italic"> – Parent of Year 11 student</span>
              </p>
              <p className="text-gray-400 text-xs italic">
                "I finally feel confident walking into exams." 
                <span className="text-gray-500 not-italic"> – GCSE Student</span>
              </p>
            </div>

            <p className="text-emerald-400 font-semibold text-xs md:text-sm">
              Give your child the edge today — doors to top universities open with top grades.
            </p>
          </div>

          {/* Right Side - Visual Element */}
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* Icon showcase */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-xl blur-lg" />
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-6 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-center space-x-3">
                  <GraduationCap className="h-8 w-8 text-emerald-400" />
                  <TrendingUp className="h-7 w-7 text-teal-400" />
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center w-full">
              <p className="text-white/70 text-xs">
                💫 <strong className="text-emerald-400">2,847 students</strong> upgraded this week
              </p>
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="relative z-10 flex flex-col md:flex-row gap-3 mt-6 pt-4 border-t border-white/10">
          <Button 
            onClick={handleUpgrade}
            className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:via-teal-600 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300 text-base"
          >
            🚀 Start Premium Now
          </Button>
          
          <Button 
            onClick={onClose}
            variant="ghost"
            className="md:w-auto text-white/60 hover:text-white/80 hover:bg-white/5 py-4 text-sm"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};