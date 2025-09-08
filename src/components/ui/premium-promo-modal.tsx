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
      <DialogContent className="w-[95vw] max-w-[1400px] max-h-[90vh] rounded-2xl p-0 bg-gradient-to-br from-background via-primary/5 to-accent/10 border-2 border-primary/20 shadow-2xl overflow-y-auto">
        {/* Exclusive Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-blue-500/5 to-emerald-500/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/15 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-purple-500/8 to-pink-500/8 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="relative z-10 p-12">
          {/* Exclusive Header with Immediate Offer */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 mb-6 px-10 py-5 rounded-full bg-gradient-to-r from-violet-600/30 to-purple-600/30 border-2 border-violet-400/50 backdrop-blur-sm shadow-xl">
              <Crown className="h-7 w-7 text-violet-400" />
              <span className="text-base font-black text-violet-200 tracking-widest uppercase">Exclusive Invitation</span>
              <Crown className="h-7 w-7 text-purple-400" />
            </div>
            
            {/* Immediate Limited Offer */}
            <div className="mb-8 p-8 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-3 border-orange-400/60 rounded-2xl backdrop-blur-sm shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-black px-8 py-3 text-lg shadow-xl animate-bounce border-2 border-white">
                  🔥 FLASH SALE - 50% OFF
                </Badge>
              </div>
              <div className="pt-4 text-center">
                <p className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-4">Exclusive Access - Limited Time Only</p>
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-orange-600">Was</p>
                    <span className="text-4xl text-red-600 line-through font-black">£19.99</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-orange-600">Now Only</p>
                    <span className="text-7xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent animate-pulse">£9.99</span>
                    <p className="text-lg text-orange-700">/month</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200">First 3 months at this exclusive rate</p>
              </div>
            </div>

            <h1 className="text-6xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-6 tracking-tight">
              Elite Academic Advantage
            </h1>
            <p className="text-2xl text-foreground max-w-4xl mx-auto leading-relaxed font-medium">
              Join the exclusive circle of families who've secured their child's academic success. 
              <span className="font-black bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"> Elite tools. Elite results.</span>
            </p>
          </div>

          {/* Premium Features Showcase */}
          <div className="mb-12">
            <h2 className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Exclusive Premium Arsenal
            </h2>
            <p className="text-center text-xl text-muted-foreground mb-10">What elite families get access to</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Elite Feature 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-violet-50/90 to-purple-50/80 dark:from-violet-950/50 dark:to-purple-950/40 border-2 border-violet-400/40 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl shadow-lg group-hover:animate-pulse">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-violet-700 dark:text-violet-300">AI Exam Oracle</h3>
                      <p className="text-violet-600 dark:text-violet-400 font-semibold">2026 Question Predictions</p>
                    </div>
                  </div>
                  <p className="text-violet-700 dark:text-violet-300 text-lg leading-relaxed">
                    Our AI analyzes years of exam patterns to predict exactly what questions will appear. 
                    <span className="font-bold">Give your child the ultimate advantage.</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-violet-500/20 text-violet-700 border border-violet-400/30">Predictive Analytics</Badge>
                    <Badge className="bg-violet-500/20 text-violet-700 border border-violet-400/30">Strategic Prep</Badge>
                  </div>
                </div>
              </div>

              {/* Elite Feature 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-emerald-50/90 to-green-50/80 dark:from-emerald-950/50 dark:to-green-950/40 border-2 border-emerald-400/40 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl shadow-lg group-hover:animate-pulse">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Lightning Study System</h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-semibold">15+ Hours Saved Weekly</p>
                    </div>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-300 text-lg leading-relaxed">
                    AI-generated notes, summaries, and revision schedules that cut study time while 
                    <span className="font-bold"> maximizing retention and results.</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-700 border border-emerald-400/30">Time Optimization</Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-700 border border-emerald-400/30">Smart Automation</Badge>
                  </div>
                </div>
              </div>

              {/* Elite Feature 3 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-blue-50/90 to-cyan-50/80 dark:from-blue-950/50 dark:to-cyan-950/40 border-2 border-blue-400/40 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl shadow-lg group-hover:animate-pulse">
                      <Trophy className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-blue-700 dark:text-blue-300">Grade Guarantee System</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-semibold">Performance Forecasting</p>
                    </div>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-lg leading-relaxed">
                    Real-time grade predictions and performance analytics that ensure your child stays on track for 
                    <span className="font-bold">Grade 9s and university success.</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-blue-500/20 text-blue-700 border border-blue-400/30">Grade Tracking</Badge>
                    <Badge className="bg-blue-500/20 text-blue-700 border border-blue-400/30">Success Metrics</Badge>
                  </div>
                </div>
              </div>

              {/* Elite Feature 4 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-orange-50/90 to-pink-50/80 dark:from-orange-950/50 dark:to-pink-950/40 border-2 border-orange-400/40 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-orange-600 to-pink-600 rounded-xl shadow-lg group-hover:animate-pulse">
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-orange-700 dark:text-orange-300">University Pathway</h3>
                      <p className="text-orange-600 dark:text-orange-400 font-semibold">Elite Institution Access</p>
                    </div>
                  </div>
                  <p className="text-orange-700 dark:text-orange-300 text-lg leading-relaxed">
                    Personalized strategies for Russell Group applications, with 
                    <span className="font-bold"> 85% of our premium users securing top university places.</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="bg-orange-500/20 text-orange-700 border border-orange-400/30">Elite Access</Badge>
                    <Badge className="bg-orange-500/20 text-orange-700 border border-orange-400/30">Success Rate</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Investment vs Tutoring */}
          <div className="mb-12">
            <div className="max-w-4xl mx-auto p-10 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-400/40 shadow-2xl">
              <h2 className="text-3xl font-black text-center mb-8 text-emerald-700 dark:text-emerald-300">Smart Investment Choice</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-red-500/10 border-2 border-red-400/30 rounded-xl">
                  <h3 className="text-xl font-bold text-red-700 mb-4">Traditional Tutoring</h3>
                  <div className="text-4xl font-black text-red-600 mb-2">£300+</div>
                  <div className="text-red-600 font-medium">per month</div>
                  <div className="mt-4 space-y-2 text-sm text-red-700">
                    <p>• Limited availability</p>
                    <p>• Travel time required</p>
                    <p>• One-size-fits-all approach</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-emerald-500/10 border-2 border-emerald-400/30 rounded-xl">
                  <h3 className="text-xl font-bold text-emerald-700 mb-4">Mentiora Premium</h3>
                  <div className="text-4xl font-black text-emerald-600 mb-2">£9.99</div>
                  <div className="text-emerald-600 font-medium">per month</div>
                  <div className="mt-4 space-y-2 text-sm text-emerald-700">
                    <p>• 24/7 AI availability</p>
                    <p>• Instant access anywhere</p>
                    <p>• Personalized to your child</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-8 p-6 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-2 border-emerald-400/50 rounded-xl">
                <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">Save £290+ Every Month</p>
                <p className="text-emerald-600 dark:text-emerald-400 mt-2">Better results, fraction of the cost</p>
              </div>
            </div>
          </div>

          {/* Exclusive CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="p-12 rounded-2xl bg-gradient-to-br from-white/95 to-violet-50/90 dark:from-gray-900/95 dark:to-violet-950/40 backdrop-blur-sm relative shadow-2xl border-2 border-violet-400/50">
              <div className="text-center space-y-8">
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-16 text-xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-emerald-600 hover:from-violet-700 hover:via-purple-700 hover:to-emerald-700 text-white border-2 border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse"
                >
                  Claim Your Exclusive Access - Start Free Trial
                </Button>
                
                <div className="flex items-center justify-center gap-3 text-lg font-medium text-muted-foreground">
                  <Shield className="h-6 w-6 text-emerald-600" />
                  <span>7-Day Free Trial • Elite Access • Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Elite Trust */}
          <div className="text-center mt-10 pt-8 border-t-2 border-gradient-to-r from-violet-400/30 to-purple-400/30">
            <p className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Join the exclusive circle of families securing academic excellence
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};