import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, BookOpen, Check, Shield } from "lucide-react";

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
      <DialogContent className="max-w-lg mx-auto rounded-3xl bg-white dark:bg-slate-900 border-0 shadow-2xl p-0 overflow-hidden">
        {/* Premium Background */}
        <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950">
          {/* Subtle Gold Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
          
          <div className="p-8 pb-6">
            {/* Headline - Serif Typography */}
            <h1 className="text-3xl font-serif text-center font-bold text-slate-800 dark:text-slate-100 mb-3 leading-tight">
              🎓 Secure Your Child's Path to University
            </h1>
            
            {/* Subheadline - Sans-serif */}
            <p className="text-center text-slate-600 dark:text-slate-300 mb-8 text-base leading-relaxed font-medium">
              For just <span className="font-bold text-slate-800 dark:text-slate-200">£9.99/month</span>, unlock the smartest tools proven to save time, save money, and boost grades — without costly tutoring.
            </p>

            {/* Core Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">📊 Predicted Grades</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Know exactly where your child stands.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">📄 Predicted 2026 GCSE Papers</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Practice with the closest thing to the real exam.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-white/60 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-lg flex items-center justify-center shadow-sm">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">📝 Smart Revision Notebook</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Saves hours, keeps revision focused and effective.</p>
                </div>
              </div>
            </div>

            {/* Premium CTA Button */}
            <div className="mb-8">
              <Button 
                onClick={handleUpgrade}
                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-amber-400/20 hover:border-amber-400/40"
              >
                👉 Invest in My Child's Future – £9.99/month
              </Button>
            </div>

            {/* Reinforcement Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 rounded-2xl p-6 mb-6 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Save £300+ compared to tutoring</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Gain 15+ hours of revision time</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">Achieve better grades → top university places</span>
                </div>
              </div>
            </div>

            {/* Reassurance */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Start today. Cancel anytime. 100% secure payment.</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};