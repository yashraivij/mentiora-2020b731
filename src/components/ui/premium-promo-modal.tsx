import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, PoundSterling, Clock, GraduationCap, Shield, Star, TrendingUp, Award, Target, Zap, Brain, Trophy, BarChart3, Users, BookOpen } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[1200px] max-h-[85vh] rounded-xl p-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800 shadow-2xl overflow-y-auto">
        {/* Vibrant Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-emerald-500/10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400/15 to-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 p-8">
          {/* Eye-Catching Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
              <Crown className="h-5 w-5" />
              <span className="text-sm font-bold tracking-wider">PREMIUM ACCESS</span>
              <Crown className="h-5 w-5" />
            </div>
            
            {/* Compelling Offer */}
            <div className="mb-6 p-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/40 dark:to-red-900/40 border-2 border-orange-300 dark:border-orange-700 rounded-xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold px-6 py-2 shadow-lg animate-bounce">
                  🔥 50% OFF - Limited Time
                </Badge>
              </div>
              <div className="pt-3 text-center">
                <p className="text-lg font-bold text-orange-800 dark:text-orange-200 mb-4">Give Your Child the Competitive Edge</p>
                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-orange-600">Regular Price</p>
                    <span className="text-3xl text-red-600 line-through font-bold">£19.99</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-orange-600">Your Investment</p>
                    <span className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">£9.99</span>
                    <p className="text-lg text-orange-700">/month</p>
                  </div>
                </div>
                <p className="text-base font-semibold text-orange-700 dark:text-orange-300">First 3 months • Then £19.99/month</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Secure Your Child's Academic Future
            </h1>
            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Join elite families who've unlocked their child's potential with AI-powered learning tools that deliver 
              <span className="font-bold text-purple-600"> measurable results and university success.</span>
            </p>
          </div>

          {/* Success Metrics Parents Care About */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 border-2 border-blue-400/50 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-black text-blue-700 dark:text-blue-300">97%</div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">Grade Improvement</div>
              <div className="text-xs text-blue-500">Average increase</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 border-2 border-emerald-400/50 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300">85%</div>
              <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">University Success</div>
              <div className="text-xs text-emerald-500">Top institutions</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 border-2 border-purple-400/50 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl font-black text-purple-700 dark:text-purple-300">50K+</div>
              <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">Happy Families</div>
              <div className="text-xs text-purple-500">Trusted by parents</div>
            </div>
          </div>

          {/* What Parents Get - Premium Features */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-center mb-2 text-slate-800 dark:text-slate-200">
              What Your Investment Unlocks
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 mb-6">Everything your child needs to excel academically</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Premium Feature 1 */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border-2 border-blue-300 dark:border-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 mb-2">AI Exam Predictions</h3>
                    <p className="text-blue-700 dark:text-blue-300 mb-3 leading-relaxed">
                      Know exactly what questions will appear on 2026 exams. Give your child the ultimate preparation advantage.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-600/20 text-blue-800 border border-blue-400">2026 Ready</Badge>
                      <Badge className="bg-blue-600/20 text-blue-800 border border-blue-400">Predictive AI</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Feature 2 */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 border-2 border-emerald-300 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">15+ Hours Saved Weekly</h3>
                    <p className="text-emerald-700 dark:text-emerald-300 mb-3 leading-relaxed">
                      AI-generated notes and smart revision schedules free up time for family while boosting performance.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-emerald-600/20 text-emerald-800 border border-emerald-400">Time Saver</Badge>
                      <Badge className="bg-emerald-600/20 text-emerald-800 border border-emerald-400">Smart Learning</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Feature 3 */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 border-2 border-purple-300 dark:border-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-purple-800 dark:text-purple-200 mb-2">Grade 9 Pathway</h3>
                    <p className="text-purple-700 dark:text-purple-300 mb-3 leading-relaxed">
                      Real-time progress tracking with personalized strategies to achieve top grades and university offers.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-600/20 text-purple-800 border border-purple-400">Grade 9s</Badge>
                      <Badge className="bg-purple-600/20 text-purple-800 border border-purple-400">Success Track</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium Feature 4 */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 border-2 border-orange-300 dark:border-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">University Success Plan</h3>
                    <p className="text-orange-700 dark:text-orange-300 mb-3 leading-relaxed">
                      Exclusive guidance for Russell Group applications with strategies that secure top university places.
                    </p>
                    <div className="flex gap-2">
                      <Badge className="bg-orange-600/20 text-orange-800 border border-orange-400">Elite Unis</Badge>
                      <Badge className="bg-orange-600/20 text-orange-800 border border-orange-400">Career Ready</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Investment Choice - Enhanced */}
          <div className="mb-8">
            <div className="max-w-5xl mx-auto p-8 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-950/30 border-2 border-emerald-300 dark:border-emerald-700 shadow-xl">
              <h2 className="text-2xl font-bold text-center mb-6 text-emerald-800 dark:text-emerald-200">
                Smart Investment vs Traditional Tutoring
              </h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center p-6 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border-2 border-red-300 dark:border-red-700 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PoundSterling className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-800 dark:text-red-200 mb-3">Traditional Tutoring</h3>
                  <div className="text-4xl font-black text-red-600 mb-2">£300+</div>
                  <div className="text-base font-semibold text-red-700">per month</div>
                  <div className="mt-4 space-y-2 text-sm text-red-700 dark:text-red-300">
                    <p>• Limited availability & scheduling</p>
                    <p>• Travel time and logistics</p>
                    <p>• Generic one-size-fits-all approach</p>
                    <p>• No exam prediction insights</p>
                  </div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 border-2 border-emerald-300 dark:border-emerald-700 rounded-xl shadow-lg">
                  <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-3">Mentiora Premium</h3>
                  <div className="text-4xl font-black text-emerald-600 mb-2">£9.99</div>
                  <div className="text-base font-semibold text-emerald-700">per month</div>
                  <div className="mt-4 space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    <p>• 24/7 AI-powered availability</p>
                    <p>• Instant access from anywhere</p>
                    <p>• Personalized to your child's needs</p>
                    <p>• Exclusive 2026 exam predictions</p>
                  </div>
                </div>
              </div>
              <div className="text-center mt-6 p-6 bg-gradient-to-r from-emerald-200 to-green-200 dark:from-emerald-800/50 dark:to-green-800/50 border-2 border-emerald-400 dark:border-emerald-600 rounded-xl shadow-lg">
                <p className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mb-2">Save £290+ Every Month</p>
                <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">Superior results • Smarter investment • Your child's competitive advantage</p>
              </div>
            </div>
          </div>

          {/* Compelling CTA */}
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-xl bg-gradient-to-br from-white/95 to-blue-50/95 dark:from-slate-800/95 dark:to-blue-950/95 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white">
                  <p className="text-lg font-bold mb-2">🎯 Your Child Deserves the Best</p>
                  <p className="text-blue-100">Join thousands of families who've secured their child's academic success</p>
                </div>
                
                <Button 
                  onClick={handleUpgrade}
                  className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 hover:from-blue-700 hover:via-purple-700 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse"
                >
                  Start Your 7-Day Free Trial Now
                </Button>
                
                <div className="flex items-center justify-center gap-3 text-base font-medium text-slate-600 dark:text-slate-400">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span>Risk-free trial • Full premium access • Cancel anytime</span>
                </div>
                
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  "The best investment we've made in our daughter's education" - Sarah M., Parent
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};