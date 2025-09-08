import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, DollarSign, Trophy, TrendingUp, CheckCircle2 } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1100px] rounded-2xl p-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-0 shadow-2xl mx-auto overflow-hidden animate-scale-in">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-indigo-500/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tl from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />

        <div className="relative z-10 p-6">
          {/* Horizontal Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Header & Value Props */}
            <div className="lg:w-2/3 space-y-4">
              {/* Compact Header */}
              <div className="text-center lg:text-left">
                <div className="flex justify-center lg:justify-start mb-2">
                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-2 rounded-full animate-pulse">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in">
                  Invest in Your Child's Future 🎓
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Secure their place at dream universities
                </p>
              </div>

              {/* Horizontal Value Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Time Savings */}
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 rounded-xl p-3 hover:scale-105 transition-all duration-300 hover-scale">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-emerald-600 p-1.5 rounded-lg">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-emerald-800">Save 15+ Hours Weekly</h3>
                  </div>
                  <p className="text-xs text-emerald-700 mb-2">
                    AI-powered notes eliminate preparation time
                  </p>
                  <div className="text-xs text-emerald-600 font-semibold">
                    Worth: £300+ monthly
                  </div>
                </div>

                {/* Money Savings */}
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 rounded-xl p-3 hover:scale-105 transition-all duration-300 hover-scale">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-blue-800">Replaces £500+ Tutoring</h3>
                  </div>
                  <p className="text-xs text-blue-700 mb-2">
                    Same quality insights, fraction of cost
                  </p>
                  <div className="text-xs text-blue-600 font-semibold">
                    Save: £450+ monthly
                  </div>
                </div>

                {/* University ROI */}
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 border-2 border-amber-200 rounded-xl p-3 hover:scale-105 transition-all duration-300 hover-scale">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-amber-600 p-1.5 rounded-lg">
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-bold text-amber-800">£300K+ Lifetime ROI</h3>
                  </div>
                  <p className="text-xs text-amber-700 mb-2">
                    0.8 grades higher → better universities
                  </p>
                  <div className="text-xs text-amber-600 font-semibold">
                    5x more likely top unis
                  </div>
                </div>
              </div>

              {/* Proof Points */}
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between text-center">
                  <div className="flex-1">
                    <div className="text-xl font-bold text-yellow-300">92%</div>
                    <div className="text-xs text-purple-200">Grade Accuracy</div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-yellow-300" />
                  <div className="flex-1">
                    <div className="text-xl font-bold text-yellow-300">15+</div>
                    <div className="text-xs text-purple-200">Hours Saved Weekly</div>
                  </div>
                  <TrendingUp className="h-5 w-5 text-yellow-300" />
                  <div className="flex-1">
                    <div className="text-xl font-bold text-yellow-300">Grade 9s</div>
                    <div className="text-xs text-purple-200">Target Achievement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="lg:w-1/3 flex flex-col justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="text-center space-y-3">
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold px-3 py-1 text-xs animate-pulse">
                    50% OFF - Limited Time
                  </Badge>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-400 line-through text-sm">£19.99</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">£9.99</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      /month • Less than 1 tutoring session
                    </p>
                  </div>

                  <Button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    Start Free 7-Day Trial
                  </Button>
                  
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500 pt-1">
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>No commitment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-600" />
                      <span>Cancel anytime</span>
                    </div>
                  </div>

                  <Button 
                    onClick={onClose}
                    variant="ghost"
                    className="text-gray-400 hover:text-gray-600 text-xs mt-2"
                  >
                    I'll decide later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};