import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] rounded-3xl p-0 bg-gradient-to-br from-purple-600/20 via-blue-500/15 to-emerald-500/20 border-2 border-primary/30 shadow-2xl overflow-y-auto backdrop-blur-xl">
        {/* Dynamic Colorful Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-500/20 via-emerald-500/25 to-orange-500/20" />
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-3xl animate-pulse opacity-40" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tl from-blue-500 to-cyan-400 rounded-full blur-3xl animate-pulse delay-1000 opacity-35" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full blur-3xl animate-pulse delay-500 opacity-30" />
        <div className="absolute bottom-1/3 left-1/4 w-36 h-36 bg-gradient-to-tr from-purple-500 to-violet-400 rounded-full blur-3xl animate-pulse delay-700 opacity-35" />

        <div className="relative z-10 h-full flex flex-col p-8">
          {/* Premium Header with Value Focus */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="p-4 rounded-full shadow-2xl animate-bounce bg-gradient-to-br from-orange-500 to-pink-500">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-500 to-emerald-500 bg-clip-text text-transparent tracking-tight animate-pulse">
                  Premium Investment
                </h1>
                <p className="text-xl font-semibold text-orange-600 animate-bounce">In Your Child's Success</p>
              </div>
              <div className="p-4 rounded-full shadow-2xl animate-bounce delay-200 bg-gradient-to-br from-emerald-500 to-blue-500">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* What Parents Are Paying For - Clear Value */}
          <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-xl border-3 border-blue-400/50 rounded-3xl p-8 mb-8 shadow-2xl">
            <h2 className="text-3xl font-black text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🎯 What You're Actually Buying
            </h2>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">✅ Your Complete Package Includes:</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-emerald-500/20 rounded-xl border-2 border-emerald-400/30">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">2026 Exam Question Predictions</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-500/20 rounded-xl border-2 border-blue-400/30">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">AI-Generated Study Notes & Summaries</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-500/20 rounded-xl border-2 border-purple-400/30">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">Grade Forecasting & Progress Tracking</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-500/20 rounded-xl border-2 border-orange-400/30">
                    <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-gray-800">Personalized Revision Schedules</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">💰 Money You're Saving:</h3>
                <div className="bg-gradient-to-br from-emerald-100 to-green-50 p-6 rounded-2xl border-3 border-emerald-400/40">
                  <div className="text-center space-y-3">
                    <p className="text-lg text-gray-700">Traditional Tutoring Cost:</p>
                    <p className="text-4xl font-black text-red-600 line-through">£300+ /month</p>
                    <p className="text-lg text-gray-700">Mentiora Premium:</p>
                    <p className="text-5xl font-black text-emerald-600">£9.99 /month</p>
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-xl animate-bounce">
                      You Save £290+ Every Month!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* The Real Benefits - What Success Looks Like */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            {/* Academic Success */}
            <div className="bg-gradient-to-br from-purple-500/30 to-violet-600/20 backdrop-blur-sm border-3 border-purple-400/50 rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:animate-bounce">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-purple-700 mb-3">Grade 9s Achieved</h3>
              <p className="text-lg font-semibold text-purple-800 mb-2">Top University Places</p>
              <div className="bg-purple-500/30 border-2 border-purple-400/50 rounded-xl p-3">
                <p className="text-sm font-medium text-purple-900">Russell Group Universities</p>
                <p className="text-sm font-medium text-purple-900">Medicine, Law, Engineering</p>
              </div>
            </div>

            {/* Time Investment Return */}
            <div className="bg-gradient-to-br from-blue-500/30 to-cyan-600/20 backdrop-blur-sm border-3 border-blue-400/50 rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:animate-bounce">
                <Clock className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-3">15+ Hours Saved</h3>
              <p className="text-lg font-semibold text-blue-800 mb-2">Every Single Week</p>
              <div className="bg-blue-500/30 border-2 border-blue-400/50 rounded-xl p-3">
                <p className="text-sm font-medium text-blue-900">= 60+ hours monthly</p>
                <p className="text-sm font-medium text-blue-900">= 720+ hours yearly</p>
              </div>
            </div>

            {/* Financial Return */}
            <div className="bg-gradient-to-br from-emerald-500/30 to-green-600/20 backdrop-blur-sm border-3 border-emerald-400/50 rounded-2xl p-6 text-center shadow-2xl hover:scale-105 transition-all duration-300 group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:animate-bounce">
                <PoundSterling className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-700 mb-3">£3,480 Saved</h3>
              <p className="text-lg font-semibold text-emerald-800 mb-2">Per Year vs Tutoring</p>
              <div className="bg-emerald-500/30 border-2 border-emerald-400/50 rounded-xl p-3">
                <p className="text-sm font-medium text-emerald-900">Better Results</p>
                <p className="text-sm font-medium text-emerald-900">Fraction of the Cost</p>
              </div>
            </div>
          </div>

          {/* Premium CTA with Clear Value */}
          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-white/95 to-orange-50/90 backdrop-blur-xl border-3 border-orange-400/60 rounded-3xl p-10 relative shadow-2xl max-w-2xl w-full">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-10 py-4 text-lg animate-bounce shadow-2xl border-3 border-white">
                  🔥 50% OFF - Limited Time Only
                </Badge>
              </div>
              
              <div className="text-center space-y-6 mt-6">
                <div className="space-y-4">
                  <p className="text-xl font-bold text-gray-800">Instead of paying £300+ monthly for tutoring</p>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Regular Price</p>
                      <span className="text-4xl text-gray-500 line-through font-bold">£19.99</span>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Your Investment</p>
                      <span className="text-7xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent animate-pulse">
                        £9.99
                      </span>
                      <p className="text-xl text-gray-700">/month</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/40 rounded-xl p-4">
                    <p className="text-2xl font-bold text-emerald-800">Total Annual Investment: £119.88</p>
                    <p className="text-lg text-emerald-700">vs £3,600+ for traditional tutoring</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold py-8 px-12 text-2xl rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300 border-3 border-white/50 animate-pulse"
                >
                  Secure Your Child's Future - Start Now
                </Button>
                
                <div className="flex items-center justify-center gap-3 text-lg text-gray-700">
                  <Shield className="h-6 w-6 text-emerald-600" />
                  <span>7-Day Free Trial • Cancel Anytime • Guaranteed Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};