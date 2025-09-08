import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Target, BookOpen, TrendingUp, Clock, Shield, Star, Award, Users } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[90vh] rounded-3xl p-0 bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 border-0 text-white shadow-2xl mx-auto overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10" />
        <div className="absolute top-8 left-8 w-3 h-3 bg-gradient-to-br from-yellow-400/60 to-orange-400/40 rounded-full" />
        <div className="absolute top-12 right-12 w-2 h-2 bg-gradient-to-br from-yellow-400/40 to-orange-400/20 rounded-full" />
        <div className="absolute bottom-20 left-16 w-1 h-1 bg-gradient-to-br from-yellow-400/30 to-orange-400/15 rounded-full" />

        <div className="relative z-10 h-full flex flex-col overflow-y-auto p-8">
          {/* Top Section */}
          <div className="text-center space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-yellow-200 via-orange-200 to-yellow-300 bg-clip-text text-transparent">
                Mentiora Premium
              </h1>
              <Crown className="h-6 w-6 text-yellow-400" />
            </div>
            
            <h2 className="text-xl font-bold text-white/95">
              Secure Academic Future Success
            </h2>
            
            <p className="text-white/80 text-base leading-relaxed max-w-2xl mx-auto">
              Get the competitive edge to achieve Grade 9s and secure places at top universities
            </p>
          </div>

          {/* Offer Section */}
          <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-6 relative shadow-2xl max-w-md mx-auto mb-8">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white font-bold px-4 py-2 text-sm animate-pulse shadow-lg">
                Limited Time Offer
              </Badge>
            </div>
            
            <div className="text-center space-y-4 mt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-white/60 line-through text-lg font-medium">£19.99</span>
                  <span className="text-3xl font-black bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                    £9.99
                  </span>
                  <span className="text-white/90 text-lg font-medium">/month</span>
                </div>
                <div className="text-yellow-300 font-bold text-lg">
                  Save 50% - First 3 months
                </div>
                <p className="text-white/80 text-sm">
                  Less than a single tutoring session
                </p>
              </div>
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 hover:from-yellow-500 hover:via-orange-500 hover:to-yellow-600 text-black font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Start Free Trial
              </Button>
            </div>
          </div>

          {/* Premium Features Section */}
          <div className="mb-6">
            <h3 className="text-center text-xl font-bold text-white mb-6">Premium Features</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 - Predicted Grade 9s */}
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-orange-400/30 to-orange-600/20 p-3 rounded-xl w-fit mx-auto">
                    <TrendingUp className="h-6 w-6 text-orange-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-2">Predicted Grade 9s</h4>
                    <Badge className="bg-gradient-to-r from-green-500/40 to-green-400/30 text-green-100 text-xs font-semibold mb-3">
                      92% accuracy rate
                    </Badge>
                    <p className="text-white/85 text-sm leading-relaxed">
                      Advanced analytics predict Grade 9 outcomes across all subjects based on your performance
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 - Save 15+ Hours Weekly */}
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-blue-400/30 to-blue-600/20 p-3 rounded-xl w-fit mx-auto">
                    <Clock className="h-6 w-6 text-blue-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-2">Save 15+ Hours Weekly</h4>
                    <Badge className="bg-gradient-to-r from-blue-500/40 to-blue-400/30 text-blue-100 text-xs font-semibold mb-3">
                      Worth £300+ in tutoring
                    </Badge>
                    <p className="text-white/85 text-sm leading-relaxed">
                      Smart study recommendations and auto-generated notes reduce revision time
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 - Exam Board Mastery */}
              <div className="bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300 shadow-xl">
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-br from-purple-400/30 to-purple-600/20 p-3 rounded-xl w-fit mx-auto">
                    <Target className="h-6 w-6 text-purple-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg mb-2">Exam Board Mastery</h4>
                    <Badge className="bg-gradient-to-r from-purple-500/40 to-purple-400/30 text-purple-100 text-xs font-semibold mb-3">
                      All specifications
                    </Badge>
                    <p className="text-white/85 text-sm leading-relaxed">
                      Access to AQA, Edexcel, OCR, and WJEC predicted questions for 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="text-center space-y-3 border-t border-white/10 pt-6">
            <p className="text-yellow-300 font-semibold text-base flex items-center justify-center gap-2">
              ⏳ Limited time only — lock in this offer today.
            </p>
            <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
              <Shield className="h-4 w-4" />
              <span>Cancel anytime. No hidden fees.</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};