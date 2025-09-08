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
      <DialogContent className="w-[95vw] max-w-[900px] rounded-3xl p-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 border border-gold/20 text-white shadow-2xl shadow-purple-900/50 mx-auto overflow-hidden backdrop-blur-xl">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/3 to-indigo-500/5" />
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/15 to-orange-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tl from-yellow-400/10 to-orange-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500/3 via-blue-500/2 to-indigo-500/3 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 space-y-8">
          {/* Main Content */}
          <div className="text-center space-y-6">
            {/* Premium Crown Header */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full blur-lg animate-pulse opacity-75" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 rounded-full blur-md animate-pulse opacity-50" />
                <div className="relative bg-gradient-to-br from-yellow-400 via-orange-400 to-yellow-500 p-4 rounded-full shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300/30">
                  <Crown className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent tracking-tight">
                Mentiora Premium
              </h1>
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/20 rounded-full px-6 py-2">
                  <span className="text-xl font-bold text-yellow-200">👑 Elite Academic Success</span>
                </div>
              </div>
              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
                Transform your child's academic journey with AI-powered predictions and personalized learning that guarantees Grade 9s.
              </p>
            </div>

            {/* Premium Offer Section */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 relative shadow-2xl shadow-purple-900/30">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-black px-4 py-2 rounded-full text-sm animate-pulse shadow-lg shadow-red-500/30 border border-red-300/20">
                  <Clock className="h-4 w-4 mr-2 inline" />
                  LIMITED TIME — 50% OFF
                </div>
              </div>
              
              <div className="text-center space-y-4 mt-4">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/50 line-through text-lg font-semibold">£19.99</span>
                  <div className="text-4xl font-black bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                    £9.99
                  </div>
                  <span className="text-white/80 font-semibold">/month</span>
                </div>
                <p className="text-white/70 text-sm font-medium">
                  Less than a single tutoring session — unlimited AI-powered academic success.
                </p>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-300 hover:via-orange-300 hover:to-yellow-400 text-black font-black py-4 px-8 rounded-xl text-lg shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300/30 hover:border-yellow-200/50"
                >
                  <Crown className="h-5 w-5 mr-2" />
                  Start Premium Journey
                </Button>
              </div>
            </div>
            {/* Premium Features */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent mb-6">
                What's Included in Premium
              </h3>
              
              {/* Feature 1: Predicted Exam Questions */}
              <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 backdrop-blur-sm border border-green-400/20 rounded-xl p-4 hover:bg-green-500/20 transition-all duration-300 shadow-lg shadow-green-500/10">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg shadow-green-500/30">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white text-lg">Predicted 2026 Exam Questions</h4>
                      <div className="bg-gradient-to-r from-green-400/20 to-emerald-400/20 border border-green-300/30 rounded-full px-3 py-1">
                        <span className="text-green-200 text-xs font-bold">All Specs Covered</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Exclusive AI predictions across AQA, Edexcel, OCR & WJEC — prepare with absolute confidence for 2026 exams.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Predicted Grades */}
              <div className="bg-gradient-to-r from-purple-500/10 via-violet-500/5 to-purple-500/10 backdrop-blur-sm border border-purple-400/20 rounded-xl p-4 hover:bg-purple-500/20 transition-all duration-300 shadow-lg shadow-purple-500/10">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-purple-400 to-violet-500 p-3 rounded-xl shadow-lg shadow-purple-500/30">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white text-lg">Predicted Grades</h4>
                      <div className="bg-gradient-to-r from-purple-400/20 to-violet-400/20 border border-purple-300/30 rounded-full px-3 py-1">
                        <span className="text-purple-200 text-xs font-bold">92% Accuracy</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Instantly see your child's projected results and track their progress towards Grade 9s with precision AI analytics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Revision Notebook */}
              <div className="bg-gradient-to-r from-teal-500/10 via-cyan-500/5 to-teal-500/10 backdrop-blur-sm border border-teal-400/20 rounded-xl p-4 hover:bg-teal-500/20 transition-all duration-300 shadow-lg shadow-teal-500/10">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-teal-400 to-cyan-500 p-3 rounded-xl shadow-lg shadow-teal-500/30">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-white text-lg">AI Revision Notebook</h4>
                      <div className="bg-gradient-to-r from-teal-400/20 to-cyan-400/20 border border-teal-300/30 rounded-full px-3 py-1">
                        <span className="text-teal-200 text-xs font-bold">Worth £300+ in Tutoring</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Smart, organized notes that save 15+ study hours weekly — revolutionizing how your child revises and learns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-4 border-t border-white/10 pt-6">
            <p className="text-yellow-200 font-bold italic text-lg flex items-center justify-center gap-2">
              ⏳ Limited time offer — secure this exclusive pricing today
            </p>
            <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
              <Shield className="h-4 w-4" />
              <span>Cancel anytime, no hidden fees — 100% satisfaction guaranteed</span>
            </div>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-white/60 hover:text-white/80 hover:bg-white/5 py-2 text-sm font-medium"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};