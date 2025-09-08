import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PoundSterling, Clock, GraduationCap, Sparkles, Zap, University } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[90vh] rounded-2xl p-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl mx-auto overflow-y-auto">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              👑 Mentiora Premium 👑
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Unlock your academic potential
            </p>
          </div>

          {/* Key Benefits */}
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">£300+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Saved vs Tutoring</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">15+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours Saved Weekly</div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Grade 9s</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Target Results</div>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <PoundSterling className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-gray-900 dark:text-white font-medium">Save £300+ on tutoring costs</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-gray-900 dark:text-white font-medium">Get back 15+ hours weekly</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <University className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-900 dark:text-white font-medium">Secure university placement</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 text-center space-y-4 border border-blue-200 dark:border-blue-800">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3">
                <span className="text-xl text-gray-500 dark:text-gray-400 line-through">£19.99</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">£9.99</span>
                <span className="text-lg text-gray-600 dark:text-gray-300">/ month</span>
              </div>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">50% OFF - Limited Time</p>
            </div>
            
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
            >
              Start Premium Now
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Cancel anytime • No hidden fees • 30-day money-back guarantee
            </p>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};