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
      <DialogContent className="w-[95vw] max-w-[800px] rounded-3xl p-0 bg-white border-0 shadow-2xl mx-auto overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">
              Invest in Your Child's Future
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
              Give them the tools they need to secure a place at their dream university
            </p>
          </div>

          {/* Value Proposition Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Time Savings */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-800">Save 15+ Hours Weekly</h3>
              </div>
              <p className="text-green-700 mb-4">
                Our AI-powered revision notes and predicted questions eliminate hours of preparation time, letting your child focus on actual learning.
              </p>
              <div className="text-sm text-green-600 font-semibold">
                Value: £300+ worth of tutoring time saved monthly
              </div>
            </div>

            {/* Money Savings */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Replaces £500+ Tutoring</h3>
              </div>
              <p className="text-blue-700 mb-4">
                Get the same quality insights as expensive private tutors for a fraction of the cost. Predicted grades with 92% accuracy.
              </p>
              <div className="text-sm text-blue-600 font-semibold">
                Save over £450 monthly vs private tutoring
              </div>
            </div>
          </div>

          {/* University Investment ROI */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
            <Trophy className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3">University Investment ROI</h2>
            <p className="text-lg mb-4 text-purple-100">
              Students using Mentiora achieve 0.8 grades higher on average
            </p>
            <div className="flex justify-center items-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-300">£300K+</div>
                <div className="text-sm text-purple-200">Lifetime earnings boost from better grades</div>
              </div>
              <TrendingUp className="h-8 w-8 text-yellow-300" />
              <div>
                <div className="text-3xl font-bold text-yellow-300">5x</div>
                <div className="text-sm text-purple-200">More likely to reach top universities</div>
              </div>
            </div>
          </div>

          {/* Pricing & CTA */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="text-center space-y-4">
              <Badge className="bg-red-600 text-white font-bold px-4 py-1 text-sm">
                50% OFF - Limited Time Only
              </Badge>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-500 line-through text-lg">£19.99/month</span>
                  <span className="text-4xl font-bold text-gray-900">£9.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">
                  Less than one tutoring session • Cancel anytime
                </p>
              </div>

              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl text-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free 7-Day Trial
              </Button>
              
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-2">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>No commitment</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Instant access</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center">
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              I'll decide later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};