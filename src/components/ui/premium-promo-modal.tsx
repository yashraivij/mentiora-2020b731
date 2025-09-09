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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 border border-amber-400/30 shadow-[0_0_50px_rgba(251,191,36,0.2)] overflow-y-auto animate-scale-in font-sans">
        {/* Dynamic Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-purple-500/10 to-indigo-500/5 animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-amber-400/15 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-400/12 via-indigo-400/8 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-300/5 via-purple-300/8 to-indigo-300/5 rounded-full blur-3xl animate-pulse animation-delay-3000" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-amber-400/40 rounded-full animate-bounce animation-delay-500"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce animation-delay-1500"></div>
          <div className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-indigo-400/40 rounded-full animate-bounce animation-delay-2500"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-amber-300/50 rounded-full animate-bounce animation-delay-3500"></div>
        </div>
        
        <div className="relative z-10 p-6 md:p-8 font-sans">
          {/* Premium Header with Dynamic Effects */}
          <div className="text-center mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent blur-2xl"></div>
            <div className="relative inline-block mb-3">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-purple-400/20 to-indigo-400/20 blur-xl rounded-full"></div>
              <h1 className="relative text-2xl md:text-3xl font-black leading-tight tracking-wide drop-shadow-2xl">
                <span className="text-2xl md:text-3xl">🎓</span>
                <span className="bg-gradient-to-r from-amber-200 via-white to-amber-200 bg-clip-text text-transparent"> SECURE YOUR CHILD'S UNIVERSITY SUCCESS </span>
                <span className="text-2xl md:text-3xl">🏆</span>
              </h1>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/5 via-blue-400/5 to-indigo-400/5 blur-lg rounded-xl"></div>
              <p className="relative text-base font-medium bg-gradient-to-r from-emerald-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent max-w-2xl mx-auto leading-relaxed backdrop-blur-sm">
                Join 10,000+ families saving £3,480+ on tutoring while achieving Grade 8-9 success
              </p>
            </div>
          </div>

          {/* Premium Benefits Section with CTA */}
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {/* Benefit 1 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-indigo-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-amber-950/30 via-purple-950/20 to-indigo-950/30 border border-amber-400/30 backdrop-blur-sm hover:border-amber-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-400 rounded-lg shadow-[0_0_15px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-lg">📈</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-1">Grade 8-9 Guarantee</h3>
                      <p className="text-sm text-amber-100/80 leading-snug">
                        AI-powered predictions with 94% accuracy ensure your child targets exactly what examiners want
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/15 to-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-blue-950/30 border border-purple-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-lg shadow-[0_0_15px_rgba(147,51,234,0.3)] group-hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-lg">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent mb-1">15+ Hours Saved Weekly</h3>
                      <p className="text-sm text-purple-100/80 leading-snug">
                        Precision-targeted study plans eliminate wasted time, giving families more quality moments together
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-blue-500/15 to-cyan-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 via-blue-950/20 to-cyan-950/30 border border-indigo-400/30 backdrop-blur-sm hover:border-indigo-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-lg">🎓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-transparent mb-1">University Success</h3>
                      <p className="text-sm text-indigo-100/80 leading-snug">
                        92% of our premium students secure offers from Russell Group universities including Oxbridge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-purple-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-4 rounded-xl bg-gradient-to-br from-rose-950/30 via-pink-950/20 to-purple-950/30 border border-rose-400/30 backdrop-blur-sm hover:border-rose-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-lg shadow-[0_0_15px_rgba(244,63,94,0.3)] group-hover:shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-lg">❤️</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-rose-300 to-pink-200 bg-clip-text text-transparent mb-1">Complete Peace of Mind</h3>
                      <p className="text-sm text-rose-100/80 leading-snug">
                        Real-time analytics and progress insights keep you confident in your child's academic journey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium CTA Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/25 via-blue-500/20 to-indigo-500/25 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-emerald-950/40 via-blue-950/30 to-indigo-950/40 border-2 border-emerald-400/60 backdrop-blur-sm hover:border-emerald-400/80 transition-all duration-500 hover:scale-105 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-500 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-500 flex items-center justify-center">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent mb-2">Transform Your Child's Future Today</h3>
                    <p className="text-sm text-emerald-100/90 leading-snug mb-4">
                      <span className="font-bold text-emerald-300">92% of our students</span> achieve Grade 8-9 and secure <span className="font-bold text-blue-300">Russell Group offers</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-emerald-950/50 border border-emerald-400/40 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-xl font-bold text-emerald-300">94%</div>
                    <div className="text-xs text-emerald-200/80">Prediction Accuracy</div>
                  </div>
                  <div className="bg-blue-950/50 border border-blue-400/40 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-xl font-bold text-blue-300">£3,480</div>
                    <div className="text-xs text-blue-200/80">Tutoring Saved</div>
                  </div>
                  <div className="bg-indigo-950/50 border border-indigo-400/40 rounded-lg p-2 backdrop-blur-sm">
                    <div className="text-xl font-bold text-indigo-300">15+hrs</div>
                    <div className="text-xs text-indigo-200/80">Weekly Time Saved</div>
                  </div>
                </div>

                {/* Limited Time Offer Badge */}
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/25 via-orange-500/20 to-amber-500/25 rounded-lg blur-lg animate-pulse"></div>
                  <div className="relative p-2 rounded-lg bg-gradient-to-r from-red-950/50 via-orange-950/40 to-amber-950/50 border-2 border-red-400/60 backdrop-blur-sm text-center">
                    <div className="text-xs font-bold text-red-300 mb-1">⚡ LIMITED TIME OFFER ⚡</div>
                    <div className="text-base font-black text-white">
                      <span className="line-through text-red-300/70">£19.99</span> 
                      <span className="text-lg text-amber-300 mx-1">→</span> 
                      <span className="text-emerald-300">£9.99/month</span>
                    </div>
                    <div className="text-xs text-orange-200/80">Price increases to £19.99 next week - Secure your spot now!</div>
                  </div>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  className="relative w-full h-14 px-8 text-lg font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-600 text-white border-2 border-emerald-300/60 shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:scale-105 transition-all duration-500 rounded-xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-blue-300/20 to-indigo-300/20 animate-pulse"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <span className="text-xl">🔓</span>
                    Unlock Premium for £9.99
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>


      </DialogContent>
    </Dialog>
  );
};