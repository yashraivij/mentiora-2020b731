import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, BookOpen, Check, Shield, GraduationCap, Star } from "lucide-react";

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
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950/50 rounded-2xl shadow-2xl border-0 p-0 animate-scale-in">
          
          {/* Premium Gold Accent Border */}
          <div className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-r from-amber-400/50 via-yellow-500/50 to-amber-400/50">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950/50"></div>
          </div>

          <div className="relative z-10 p-8 lg:p-12">
            
            {/* Hero Header Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <GraduationCap className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">
                Secure Their University Future
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                Join elite families who've unlocked the smartest path to academic excellence — 
                <span className="font-semibold text-slate-800 dark:text-slate-200"> for just £9.99/month</span>
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              
              {/* Predicted Grades */}
              <div className="group p-6 bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Predicted Grades</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  AI-powered grade forecasting shows exactly where your child stands and what they need for Grade 9s.
                </p>
              </div>

              {/* Predicted 2026 Papers */}
              <div className="group p-6 bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Predicted 2026 Papers</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Practice with AI-generated papers that mirror the real 2026 GCSE exams — the ultimate preparation advantage.
                </p>
              </div>

              {/* Smart Revision Notebook */}
              <div className="group p-6 bg-white/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Smart Revision Notebook</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  AI-generated personalized notes and revision plans that cut study time while maximizing retention.
                </p>
              </div>
            </div>

            {/* Value Highlight Bar */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-8 mb-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-yellow-500/10"></div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                
                <div>
                  <div className="text-4xl font-bold text-amber-400 mb-2">£300+</div>
                  <div className="text-slate-300 font-medium">Saved vs. Tutoring</div>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-emerald-400 mb-2">15+</div>
                  <div className="text-slate-300 font-medium">Hours Gained Weekly</div>
                </div>
                
                <div>
                  <div className="text-4xl font-bold text-blue-400 mb-2">85%</div>
                  <div className="text-slate-300 font-medium">University Success Rate</div>
                </div>
              </div>
            </div>

            {/* Premium CTA Section */}
            <div className="text-center mb-8">
              <Button 
                onClick={handleUpgrade}
                className="group relative overflow-hidden bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-400 text-slate-900 font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-amber-500/25 transition-all duration-300 border-2 border-amber-300/50 hover:scale-105"
              >
                <span className="relative z-10">
                  Invest in My Child's Future – £9.99/month
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 font-medium">
                Start your 7-day free trial today
              </p>
            </div>

            {/* Trust Signals */}
            <div className="bg-white/60 dark:bg-slate-800/30 rounded-xl p-6 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                
                <div className="flex items-center justify-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Cancel Anytime</span>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">100% Secure Payment</span>
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <Star className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Proven Results</span>
                </div>
              </div>
            </div>

          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};