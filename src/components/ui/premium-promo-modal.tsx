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
        
        <div className="relative z-10 p-4 md:p-5 font-sans">
          {/* Premium Header with Dynamic Effects */}
          <div className="text-center mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent blur-xl"></div>
            <h1 className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent mb-3 leading-tight tracking-tight drop-shadow-lg animate-fade-in">
              🎓 Secure Your Child's Path to University 🏆
            </h1>
            
            <p className="text-base text-slate-200/90 max-w-2xl mx-auto leading-relaxed backdrop-blur-sm">
              While others spend thousands on tutoring, you secure your child's success for just £9.99/month
            </p>
          </div>

          {/* Premium Value Comparison */}
          <div className="mb-4">
            <div className="relative bg-gradient-to-br from-emerald-950/40 via-blue-950/40 to-indigo-950/40 border-2 border-emerald-400/40 rounded-2xl p-4 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-blue-400/6 to-indigo-400/8 rounded-2xl animate-pulse"></div>
              <h2 className="relative text-xl md:text-2xl font-bold text-center mb-4 bg-gradient-to-r from-emerald-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">The Smart Parent's Choice</h2>
              
              <div className="grid md:grid-cols-2 gap-4 relative">
                {/* Traditional Tutoring */}
                <div className="relative p-4 bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-400/40 rounded-xl shadow-lg backdrop-blur-sm group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="text-center relative">
                    <div className="mb-3">
                      <span className="text-lg font-bold text-red-300">Traditional Tutoring</span>
                    </div>
                    <div className="text-3xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-1">£3,600+</div>
                    <div className="text-red-300 font-medium mb-3 text-sm">per year</div>
                    <div className="space-y-1 text-xs text-red-200/80">
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        Limited to 1-2 hours per week
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 animate-pulse animation-delay-500"></span>
                        Travel time & scheduling conflicts
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0 animate-pulse animation-delay-1000"></span>
                        Generic approach, not exam-specific
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentiora Premium */}
                <div className="relative p-4 bg-gradient-to-br from-emerald-950/50 via-blue-950/40 to-indigo-950/50 border-2 border-emerald-400/60 rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.2)] backdrop-blur-sm group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/15 via-blue-400/10 to-indigo-400/15 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 text-white font-bold px-3 py-1 text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-bounce">
                      ✨ SMART CHOICE
                    </Badge>
                  </div>
                  <div className="text-center pt-2 relative">
                    <div className="mb-3">
                      <span className="text-lg font-bold bg-gradient-to-r from-emerald-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">Mentiora Premium</span>
                    </div>
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent mb-1 drop-shadow-lg">£120</div>
                    <div className="text-emerald-300 font-medium mb-3 text-sm">per year</div>
                    <div className="space-y-1 text-xs text-emerald-100/90">
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 flex items-center justify-center text-emerald-400 flex-shrink-0">📊</span>
                        Predicted grades with 94% accuracy
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 flex items-center justify-center text-emerald-400 flex-shrink-0">📝</span>
                        AI-powered revision notebook
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-3 h-3 flex items-center justify-center text-emerald-400 flex-shrink-0">🏆</span>
                        92% university success rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Streamlined CTA Section */}
              <div className="text-center mt-5 p-5 bg-gradient-to-br from-emerald-950/40 via-blue-950/40 to-indigo-950/40 border-2 border-emerald-400/60 rounded-2xl backdrop-blur-sm relative overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.25)]">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-blue-400/6 to-indigo-400/8 animate-pulse"></div>
                
                <p className="text-base text-emerald-100/90 mb-4 relative leading-relaxed">
                  <span className="font-bold text-emerald-300">92% of our students</span> achieve Grade 8-9 and secure <span className="font-bold text-blue-300">Russell Group offers</span>
                </p>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-5">
                  <div className="bg-emerald-950/40 border border-emerald-400/30 rounded-lg p-2">
                    <div className="text-xl font-bold text-emerald-300">94%</div>
                    <div className="text-xs text-emerald-200/80">Prediction Accuracy</div>
                  </div>
                  <div className="bg-blue-950/40 border border-blue-400/30 rounded-lg p-2">
                    <div className="text-xl font-bold text-blue-300">£3,480</div>
                    <div className="text-xs text-blue-200/80">Tutoring Saved</div>
                  </div>
                  <div className="bg-indigo-950/40 border border-indigo-400/30 rounded-lg p-2">
                    <div className="text-xl font-bold text-indigo-300">15+hrs</div>
                    <div className="text-xs text-indigo-200/80">Weekly Time Saved</div>
                  </div>
                </div>

                <Button 
                  onClick={handleUpgrade}
                  className="relative w-full h-12 px-6 text-lg font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 hover:from-emerald-600 hover:via-blue-600 hover:to-indigo-600 text-white border-2 border-emerald-300/60 shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_rgba(16,185,129,0.7)] hover:scale-105 transition-all duration-500 rounded-xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-300/20 via-blue-300/20 to-indigo-300/20 animate-pulse"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <span className="text-lg">🎓</span>
                    Secure My Child's Success - £1 First Month
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