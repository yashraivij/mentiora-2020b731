import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star, TrendingUp, Award, Target, Zap, Brain, Trophy } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1200px] max-h-[85vh] rounded-xl p-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/30 border border-slate-200 dark:border-slate-700 shadow-2xl overflow-y-auto">
        {/* Subtle Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 via-purple-500/2 to-emerald-500/3" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-purple-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-500/6 to-blue-500/4 rounded-full blur-3xl" />

        <div className="relative z-10 p-8">
          {/* Refined Header with Immediate Offer */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-2 rounded-full bg-gradient-to-r from-slate-100 to-blue-50 dark:from-slate-800 dark:to-blue-950 border border-slate-200 dark:border-slate-700">
              <Crown className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 tracking-wider uppercase">Premium Access</span>
            </div>
            
            {/* Elegant Limited Offer */}
            <div className="mb-6 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200 dark:border-orange-800 rounded-xl backdrop-blur-sm shadow-lg relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium px-4 py-1 text-sm shadow-md">
                  Limited Time: 50% Off
                </Badge>
              </div>
              <div className="pt-2 text-center">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-3">Exclusive Offer for New Members</p>
                <div className="flex items-center justify-center gap-6 mb-3">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Regular Price</p>
                    <span className="text-xl text-red-500 line-through font-semibold">£19.99</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Your Price</p>
                    <span className="text-4xl font-bold text-emerald-600">£9.99</span>
                    <p className="text-sm text-slate-600">/month</p>
                  </div>
                </div>
                <p className="text-sm text-orange-600 dark:text-orange-400">First 3 months at this exclusive rate</p>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-3 tracking-tight">
              Premium Academic Support
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Give your child the advantage they need with AI-powered learning tools designed for academic excellence.
            </p>
          </div>

          {/* Sophisticated Premium Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-6 text-slate-800 dark:text-slate-200">
              What's Included in Premium
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Premium Feature 1 */}
              <div className="p-5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mt-1">
                    <Brain className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Exam Predictions</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      AI analysis of exam patterns to predict likely questions for strategic preparation.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">2026 Ready</Badge>
                  </div>
                </div>
              </div>

              {/* Premium Feature 2 */}
              <div className="p-5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg mt-1">
                    <Zap className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Smart Study Tools</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Automated note generation and revision schedules that save 15+ hours weekly.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Time Saver</Badge>
                  </div>
                </div>
              </div>

              {/* Premium Feature 3 */}
              <div className="p-5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg mt-1">
                    <Trophy className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">Grade Forecasting</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Real-time performance tracking with predictive grade analysis and improvement plans.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Success Tracking</Badge>
                  </div>
                </div>
              </div>

              {/* Premium Feature 4 */}
              <div className="p-5 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg mt-1">
                    <GraduationCap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">University Guidance</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Personalized pathways to top universities with application strategy and preparation.
                    </p>
                    <Badge variant="secondary" className="mt-2 text-xs">Future Ready</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Investment Choice - Keep as user liked it */}
          <div className="mb-8">
            <div className="max-w-4xl mx-auto p-6 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 shadow-sm">
              <h2 className="text-xl font-semibold text-center mb-6 text-emerald-800 dark:text-emerald-200">Smart Investment Choice</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h3 className="text-base font-semibold text-red-700 dark:text-red-300 mb-2">Traditional Tutoring</h3>
                  <div className="text-2xl font-bold text-red-600 mb-1">£300+</div>
                  <div className="text-sm text-red-600">per month</div>
                  <div className="mt-3 space-y-1 text-xs text-red-700 dark:text-red-300">
                    <p>• Limited availability</p>
                    <p>• Travel time required</p>
                    <p>• One-size-fits-all</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <h3 className="text-base font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Mentiora Premium</h3>
                  <div className="text-2xl font-bold text-emerald-600 mb-1">£9.99</div>
                  <div className="text-sm text-emerald-600">per month</div>
                  <div className="mt-3 space-y-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <p>• 24/7 AI availability</p>
                    <p>• Instant access anywhere</p>
                    <p>• Personalized learning</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-4 p-3 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-300 dark:border-emerald-700 rounded-lg">
                <p className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">Save £290+ Every Month</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">Better results, smarter investment</p>
              </div>
            </div>
          </div>

          {/* Refined CTA */}
          <div className="max-w-xl mx-auto">
            <div className="p-6 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="text-center space-y-4">
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Start Your 7-Day Free Trial
                </Button>
                
                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Shield className="h-4 w-4 text-emerald-600" />
                  <span>No commitment • Full access • Cancel anytime</span>
                </div>
                
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join thousands of families investing in their child's academic success
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
