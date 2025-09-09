import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      <DialogContent className="w-[95vw] max-w-[950px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 border border-emerald-400/30 shadow-[0_0_50px_rgba(16,185,129,0.3)] overflow-y-auto animate-scale-in font-sans">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/8 to-indigo-500/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-400/10 via-blue-400/8 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-400/8 via-indigo-400/6 to-transparent rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 p-6 md:p-8 font-sans">
          {/* Hero Header */}
          <div className="text-center mb-8 relative">
            <div className="mb-2">
              <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 text-sm font-bold animate-pulse shadow-lg">
                🔥 LIMITED TIME: First Month Only £1
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-4 leading-tight">
              🎓 Secure Your Child's Path to University 🏆
            </h1>
            <p className="text-lg text-slate-200/90 max-w-2xl mx-auto leading-relaxed">
              While others spend thousands on tutoring, you secure your child's success for just £9.99/month
            </p>
          </div>

          {/* Value Comparison - Compact */}
          <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Traditional Route */}
              <div className="p-5 bg-gradient-to-br from-red-950/40 to-red-900/30 border border-red-400/30 rounded-2xl backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-red-300 mb-2">Traditional Route</h3>
                  <div className="text-3xl font-black text-red-400 mb-2">£3,600+/year</div>
                  <div className="space-y-1 text-sm text-red-200/80">
                    <p>❌ Limited hours per week</p>
                    <p>❌ No grade guarantee</p>
                    <p>❌ Generic approach</p>
                  </div>
                </div>
              </div>

              {/* Mentiora Premium */}
              <div className="relative p-5 bg-gradient-to-br from-emerald-950/40 via-blue-950/30 to-indigo-950/40 border-2 border-emerald-400/50 rounded-2xl backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold px-3 py-1 text-xs">
                    ✨ SMART CHOICE
                  </Badge>
                </div>
                <div className="text-center pt-1">
                  <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-300 to-blue-300 bg-clip-text text-transparent mb-2">Mentiora Premium</h3>
                  <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">£120/year</div>
                  <div className="space-y-1 text-sm text-emerald-100/90">
                    <p>✅ 94% prediction accuracy</p>
                    <p>✅ Grade 8-9 guarantee</p>
                    <p>✅ Russell Group success</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You Get - Premium Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-2">
                What You Get
              </h2>
              <p className="text-slate-300/80">Everything your child needs to achieve Grade 8-9 and secure university offers</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Feature 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-6 bg-gradient-to-br from-emerald-950/30 via-blue-950/20 to-indigo-950/30 border border-emerald-400/30 rounded-2xl backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-bold text-emerald-300 mb-3">Predicted Grades</h3>
                    <p className="text-sm text-slate-300/90 leading-relaxed">
                      AI-powered grade predictions with 94% accuracy. Know exactly where your child stands.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-6 bg-gradient-to-br from-blue-950/30 via-indigo-950/20 to-purple-950/30 border border-blue-400/30 rounded-2xl backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">📄</span>
                    </div>
                    <h3 className="text-lg font-bold text-blue-300 mb-3">2026 Exam Papers</h3>
                    <p className="text-sm text-slate-300/90 leading-relaxed">
                      Practice with predicted 2026 GCSE papers. The closest thing to the real exam.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative p-6 bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-pink-950/30 border border-indigo-400/30 rounded-2xl backdrop-blur-sm hover:border-indigo-400/50 transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-bold text-indigo-300 mb-3">Smart Notebook</h3>
                    <p className="text-sm text-slate-300/90 leading-relaxed">
                      AI-powered revision notes that save 15+ hours per week of study time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-950/40 to-emerald-900/30 border border-emerald-400/30 rounded-xl">
                <div className="text-2xl font-bold text-emerald-300">92%</div>
                <div className="text-xs text-emerald-200/80">Achieve Grade 8-9</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-950/40 to-blue-900/30 border border-blue-400/30 rounded-xl">
                <div className="text-2xl font-bold text-blue-300">£3,480</div>
                <div className="text-xs text-blue-200/80">Tutoring Saved</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-indigo-950/40 to-indigo-900/30 border border-indigo-400/30 rounded-xl">
                <div className="text-2xl font-bold text-indigo-300">15+hrs</div>
                <div className="text-xs text-indigo-200/80">Weekly Time Saved</div>
              </div>
            </div>
          </div>

          {/* Premium CTA Section */}
          <div className="text-center p-8 bg-gradient-to-br from-emerald-950/50 via-blue-950/40 to-indigo-950/50 border-2 border-emerald-400/60 rounded-3xl backdrop-blur-sm relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/8 to-indigo-400/10 animate-pulse"></div>
            
            {/* Social Proof */}
            <div className="mb-6 relative">
              <p className="text-lg font-semibold text-emerald-100 mb-2">
                <span className="text-emerald-300">15,000+ families</span> trust us with their child's future
              </p>
              <p className="text-base text-blue-200">
                "Best investment we ever made for our daughter's education" - <span className="font-semibold">Sarah M., Imperial College Parent</span>
              </p>
            </div>

            {/* Main CTA */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent mb-3">
                Transform Your Child's Future Today
              </h3>
              <p className="text-sm text-slate-300/90 mb-4">
                Join thousands of parents who secured their child's university success
              </p>
            </div>

            <Button 
              onClick={handleUpgrade}
              className="relative w-full md:w-auto h-14 px-10 text-xl font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-600 text-white border-2 border-emerald-300/60 shadow-[0_0_40px_rgba(16,185,129,0.6)] hover:shadow-[0_0_60px_rgba(16,185,129,0.8)] hover:scale-105 transition-all duration-500 rounded-2xl group overflow-hidden mb-4"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-blue-300/20 to-indigo-300/20 animate-pulse"></div>
              <span className="relative flex items-center justify-center gap-3">
                <span className="text-xl">🎓</span>
                Invest in My Child's Success - £1 First Month
              </span>
            </Button>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-300/90">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🛡️</span>
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">✅</span>
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🔒</span>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};