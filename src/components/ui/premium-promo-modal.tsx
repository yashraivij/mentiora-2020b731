import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star, TrendingUp, Award, Target } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] rounded-2xl p-0 bg-gradient-to-br from-background via-primary/5 to-accent/10 border-2 border-primary/20 shadow-2xl overflow-y-auto">
        {/* Modern Colorful Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative z-10 p-12">
          {/* Vibrant Premium Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-400/30 backdrop-blur-sm">
              <Crown className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-bold text-blue-700 tracking-wide uppercase">Premium Access</span>
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6 tracking-tight">
              Invest in Academic Excellence
            </h1>
            <p className="text-xl text-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your child's educational journey with AI-powered insights that deliver measurable results. 
              <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> A strategic investment in their future success.</span>
            </p>
          </div>

          {/* Colorful Value Proposition Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Investment Breakdown - Blue Theme */}
            <div className="space-y-6">
              <div className="border-2 border-blue-400/40 rounded-xl p-8 bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  Your Investment Breakdown
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 px-4 bg-red-50/80 dark:bg-red-950/20 rounded-lg border border-red-300/40">
                    <span className="text-gray-700 dark:text-gray-300">Traditional Tutoring (Monthly)</span>
                    <span className="text-xl font-bold text-red-600 line-through">£300+</span>
                  </div>
                  <div className="flex items-center justify-between py-4 px-4 bg-blue-50/80 dark:bg-blue-950/20 rounded-lg border border-blue-300/40">
                    <span className="text-gray-700 dark:text-gray-300">Mentiora Premium (Monthly)</span>
                    <span className="text-xl font-bold text-blue-600">£9.99</span>
                  </div>
                  <div className="flex items-center justify-between py-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-lg px-6 border-2 border-emerald-400/40">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">Monthly Savings</span>
                    <span className="text-3xl font-black text-emerald-600">£290+</span>
                  </div>
                  <div className="flex items-center justify-between py-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg px-6 border-2 border-purple-400/40">
                    <span className="font-bold text-purple-800 dark:text-purple-300">Annual Investment</span>
                    <span className="text-2xl font-black text-purple-600">£119.88</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Features - Purple Theme */}
            <div className="space-y-6">
              <div className="border-2 border-purple-400/40 rounded-xl p-8 bg-gradient-to-br from-purple-50/80 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20 backdrop-blur-sm shadow-xl">
                <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  Premium Features Included
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-400/30 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 group">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-3 flex-shrink-0 group-hover:animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">2026 Exam Predictions</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400">AI-generated question forecasts for strategic preparation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-2 border-emerald-400/30 hover:from-emerald-500/20 hover:to-green-500/20 transition-all duration-300 group">
                    <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-3 flex-shrink-0 group-hover:animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-emerald-700 dark:text-emerald-300 mb-2">Intelligent Study Analytics</h3>
                      <p className="text-sm text-emerald-600 dark:text-emerald-400">Performance tracking and personalized recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-400/30 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 group">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-3 flex-shrink-0 group-hover:animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">Grade Forecasting</h3>
                      <p className="text-sm text-purple-600 dark:text-purple-400">Predictive analysis for academic trajectory planning</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border-2 border-orange-400/30 hover:from-orange-500/20 hover:to-yellow-500/20 transition-all duration-300 group">
                    <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full mt-3 flex-shrink-0 group-hover:animate-pulse"></div>
                    <div>
                      <h3 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Automated Study Plans</h3>
                      <p className="text-sm text-orange-600 dark:text-orange-400">Optimized revision schedules and resource allocation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vibrant ROI Metrics */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-400/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-black text-blue-600 mb-2">15+</div>
              <div className="text-sm font-bold text-blue-700 mb-2">Hours Saved Weekly</div>
              <div className="text-xs text-blue-600">Automated efficiency gains</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-black text-emerald-600 mb-2">97%</div>
              <div className="text-sm font-bold text-emerald-700 mb-2">Grade Improvement</div>
              <div className="text-xs text-emerald-600">Average student outcome</div>
            </div>
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="text-4xl font-black text-purple-600 mb-2">85%</div>
              <div className="text-sm font-bold text-purple-700 mb-2">University Acceptance</div>
              <div className="text-xs text-purple-600">Premium users success rate</div>
            </div>
          </div>

          {/* Colorful Pricing CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-2xl p-10 bg-gradient-to-br from-white/95 to-blue-50/80 dark:from-gray-900/95 dark:to-blue-950/40 backdrop-blur-sm relative shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-6 py-2 text-base border-2 border-white shadow-lg animate-bounce">
                  🔥 Limited Time Offer
                </Badge>
              </div>
              
              <div className="text-center space-y-8 pt-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-4">Monthly Investment</div>
                  <div className="flex items-center justify-center gap-6 mb-6">
                    <span className="text-3xl text-red-500 line-through font-bold">£19.99</span>
                    <span className="text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">£9.99</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/40 rounded-xl text-base font-bold text-emerald-700 dark:text-emerald-300">
                    <span>Save 50% for the first 3 months</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-14 text-lg font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white border-2 border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Start 7-Day Free Trial
                </Button>
                
                <div className="flex items-center justify-center gap-3 text-base text-muted-foreground">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span>No commitment • Cancel anytime • Full access during trial</span>
                </div>
              </div>
            </div>
          </div>

          {/* Colorful Trust Indicators */}
          <div className="text-center mt-8 pt-8 border-t-2 border-gradient-to-r from-blue-400/30 to-purple-400/30">
            <p className="text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Join thousands of families investing in academic excellence
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};