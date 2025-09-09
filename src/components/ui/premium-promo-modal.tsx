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
          <div className="text-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent blur-xl"></div>
            <h1 className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent mb-4 leading-tight tracking-tight drop-shadow-lg animate-fade-in">
              🎓 Secure Your Child's Path to University 🏆
            </h1>
            
            <p className="text-lg text-slate-200/90 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm">
              While others spend thousands on tutoring, you secure your child's success for just £9.99/month
            </p>
          </div>

          {/* What You Get Section with CTA */}
          <div className="mb-6">
            <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent">
              What You Get
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Benefit 1 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-purple-500/15 to-indigo-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 via-purple-950/20 to-indigo-950/30 border border-amber-400/30 backdrop-blur-sm hover:border-amber-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-400 rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] group-hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent mb-2">Grade 8-9 Guarantee</h3>
                      <p className="text-amber-100/80 leading-relaxed">
                        AI-powered predictions with 94% accuracy ensure your child targets exactly what examiners want
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/15 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-950/30 via-indigo-950/20 to-blue-950/30 border border-purple-400/30 backdrop-blur-sm hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent mb-2">15+ Hours Saved Weekly</h3>
                      <p className="text-purple-100/80 leading-relaxed">
                        Precision-targeted study plans eliminate wasted time, giving families more quality moments together
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-blue-500/15 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-blue-950/20 to-cyan-950/30 border border-indigo-400/30 backdrop-blur-sm hover:border-indigo-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-500 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-cyan-200 bg-clip-text text-transparent mb-2">University Success</h3>
                      <p className="text-indigo-100/80 leading-relaxed">
                        92% of our premium students secure offers from Russell Group universities including Oxbridge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-pink-500/15 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-rose-950/30 via-pink-950/20 to-purple-950/30 border border-rose-400/30 backdrop-blur-sm hover:border-rose-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.3)] group-hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-rose-300 to-pink-200 bg-clip-text text-transparent mb-2">Complete Peace of Mind</h3>
                      <p className="text-rose-100/80 leading-relaxed">
                        Real-time analytics and progress insights keep you confident in your child's academic journey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center p-8 bg-gradient-to-br from-emerald-950/40 via-blue-950/40 to-indigo-950/40 border-2 border-emerald-400/60 rounded-3xl backdrop-blur-sm relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.25)]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-blue-400/6 to-indigo-400/8 animate-pulse"></div>
              
              <p className="text-lg text-emerald-100/90 mb-6 relative leading-relaxed">
                <span className="font-bold text-emerald-300">92% of our students</span> achieve Grade 8-9 and secure <span className="font-bold text-blue-300">Russell Group offers</span>
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
                <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-emerald-300">94%</div>
                  <div className="text-sm text-emerald-200/80">Prediction Accuracy</div>
                </div>
                <div className="bg-blue-950/40 border border-blue-400/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-blue-300">£3,480</div>
                  <div className="text-sm text-blue-200/80">Tutoring Saved</div>
                </div>
                <div className="bg-indigo-950/40 border border-indigo-400/30 rounded-xl p-4">
                  <div className="text-3xl font-bold text-indigo-300">15+hrs</div>
                  <div className="text-sm text-indigo-200/80">Weekly Time Saved</div>
                </div>
              </div>

              <Button 
                onClick={handleUpgrade}
                className="relative w-full md:w-auto h-16 px-12 text-xl font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-600 text-white border-2 border-emerald-300/60 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] hover:scale-110 transition-all duration-500 rounded-2xl group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-blue-300/20 to-indigo-300/20 animate-pulse"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">🎓</span>
                  Secure My Child's Success - £1 First Month
                </span>
              </Button>
            </div>
          </div>


          {/* Premium Testimonials */}
          <div className="mb-8">
            <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 border border-amber-400/20 rounded-3xl p-8 hover:border-amber-400/40 transition-all duration-500 backdrop-blur-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-purple-400/5 to-indigo-400/5 animate-pulse"></div>
              <h3 className="relative text-2xl font-bold text-center mb-8 bg-gradient-to-r from-amber-300 via-white to-amber-300 bg-clip-text text-transparent">Elite Parent Testimonials</h3>
              
              <div className="grid md:grid-cols-2 gap-8 relative">
                <div className="p-6 bg-gradient-to-br from-amber-950/20 via-purple-950/15 to-indigo-950/20 border border-amber-400/20 rounded-2xl hover:border-amber-400/40 transition-all duration-500 hover:scale-105 group backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-purple-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <p className="relative text-amber-100/90 italic mb-4 leading-relaxed text-base">
                    "My daughter went from predicted 6s to achieving 8s and 9s. She's now at Imperial College studying Engineering. Best £120 we ever spent."
                  </p>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-400 rounded-full flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                      S
                    </div>
                    <div>
                      <p className="font-bold bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Sarah M.</p>
                      <p className="text-sm text-amber-300/80">Parent, London • Imperial College</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-950/20 via-indigo-950/15 to-blue-950/20 border border-purple-400/20 rounded-2xl hover:border-purple-400/40 transition-all duration-500 hover:scale-105 group backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-indigo-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <p className="relative text-purple-100/90 italic mb-4 leading-relaxed text-base">
                    "No more expensive tutoring sessions. My son studies confidently on his own now and got into Cambridge. The ROI is incredible."
                  </p>
                  <div className="flex items-center gap-4 relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                      M
                    </div>
                    <div>
                      <p className="font-bold bg-gradient-to-r from-purple-300 to-indigo-200 bg-clip-text text-transparent">Michael R.</p>
                      <p className="text-sm text-purple-300/80">Parent, Manchester • Cambridge University</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};