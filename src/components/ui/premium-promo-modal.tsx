import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, X, GraduationCap, TrendingUp, Sparkles, Star, Zap } from "lucide-react";

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
      <DialogContent className="w-[90vw] max-w-[480px] rounded-3xl p-0 bg-gradient-to-br from-purple-900 via-blue-900 to-violet-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Dynamic background animations */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-violet-500/20 animate-pulse" />
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-yellow-400/30 to-orange-400/20 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-0 right-0 w-28 h-28 bg-gradient-to-tl from-pink-400/30 to-purple-400/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '10s' }} />

        <div className="relative z-10 p-8 text-center space-y-6">
          {/* Premium crown icon with sparkles */}
          <div className="flex justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-lg animate-pulse" />
            <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-full">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-yellow-300 animate-pulse" />
            <Star className="absolute -bottom-1 -left-2 h-4 w-4 text-yellow-400 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* Main heading */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent leading-tight animate-pulse">
              Unlock Your Future
            </h1>
            <p className="text-lg font-bold text-white/90">
              Turn Every Grade Into Gold ✨
            </p>
          </div>

          {/* Limited offer badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-full px-4 py-2 animate-pulse">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-bold text-yellow-300">LIMITED OFFER: £9.99/month</span>
            <Zap className="h-4 w-4 text-yellow-400" />
          </div>

          {/* Key benefits - simplified */}
          <div className="space-y-3">
            {[
              { icon: TrendingUp, text: "Predict Your GCSE Results", color: "text-green-400" },
              { icon: GraduationCap, text: "Russell Group Ready", color: "text-blue-400" },
              { icon: Sparkles, text: "Stress-Free Success", color: "text-purple-400" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 group">
                <div className={`${item.color} p-2 rounded-full bg-white/10 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="text-white font-semibold">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
            <p className="text-sm text-white/80">
              🔥 <strong className="text-yellow-300">3,247 students</strong> upgraded this week
            </p>
            <p className="text-xs text-white/60 mt-1">
              "Finally got the grades I needed!" - Sarah, Year 11
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                🚀 Get Premium Now - £9.99/month
              </span>
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 py-3 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};