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
      <DialogContent className="w-[88vw] max-w-[780px] min-h-[320px] rounded-3xl p-6 md:p-8 bg-[#0f1115] border-0 text-white shadow-2xl mx-auto overflow-hidden">
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

        <div className="relative z-10 grid md:grid-cols-[1.2fr_1fr] gap-8 md:gap-10 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                🎓 Turn Grades Into Futures
              </h1>
              <p className="text-base md:text-lg text-gray-300/90 leading-relaxed">
                With Mentiora Premium, GCSE results aren't just marks on a page — they're the key to Russell Group universities, dream careers, and a proud future.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {[
                "Predict GCSE results with crystal clarity",
                "Focus only on exam-board content that wins marks",
                "Tailored revision plans that cut stress, boost scores",
                "Track progress so parents know their child is on course"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white/90 text-sm md:text-base font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Testimonials */}
            <div className="space-y-3 border-l-2 border-gradient-to-b from-emerald-500 to-teal-500 pl-4">
              <p className="text-gray-400 text-sm italic">
                "Mentiora helped my son jump from 6s to 8s in just 3 months. He's now on track for a Russell Group uni." 
                <span className="text-gray-500 not-italic"> – Parent of Year 11 student</span>
              </p>
              <p className="text-gray-400 text-sm italic">
                "I finally feel confident walking into exams." 
                <span className="text-gray-500 not-italic"> – GCSE Student</span>
              </p>
            </div>

            <p className="text-emerald-400 font-semibold text-sm md:text-base">
              Give your child the edge today — doors to top universities open with top grades.
            </p>
          </div>

          {/* Right Side - Visual Element */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Icon showcase */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-xl" />
              <div className="relative bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-8 rounded-2xl border border-emerald-500/30">
                <div className="flex items-center justify-center space-x-4">
                  <GraduationCap className="h-12 w-12 text-emerald-400" />
                  <TrendingUp className="h-10 w-10 text-teal-400" />
                </div>
              </div>
            </div>

            {/* Social proof */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center w-full">
              <p className="text-white/70 text-sm">
                💫 <strong className="text-emerald-400">2,847 students</strong> upgraded this week
              </p>
            </div>
          </div>
        </div>

        {/* CTA Row */}
        <div className="relative z-10 flex flex-col md:flex-row gap-3 mt-8 pt-6 border-t border-white/10">
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