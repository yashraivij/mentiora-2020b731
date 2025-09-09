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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-blue-600/40 via-purple-600/50 to-cyan-600/40 border border-cyan-400/40 shadow-[0_0_50px_rgba(34,211,238,0.3)] overflow-y-auto animate-scale-in font-sans">
        {/* Dynamic Premium Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/8 via-blue-400/12 to-purple-400/8 animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-cyan-300/20 via-blue-300/15 to-transparent rounded-full blur-3xl animate-pulse animation-delay-1000" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-300/18 via-blue-300/12 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-200/8 via-blue-200/12 to-purple-200/8 rounded-full blur-3xl animate-pulse animation-delay-3000" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-300/50 rounded-full animate-bounce animation-delay-500"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-blue-300/50 rounded-full animate-bounce animation-delay-1500"></div>
          <div className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-purple-300/50 rounded-full animate-bounce animation-delay-2500"></div>
          <div className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-200/60 rounded-full animate-bounce animation-delay-3500"></div>
        </div>
        
        <div className="relative z-10 p-6 md:p-8 font-sans">
          {/* Premium Header with Dynamic Effects */}
          <div className="text-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/8 to-transparent blur-xl"></div>
            <h1 className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 leading-tight tracking-tight drop-shadow-lg animate-fade-in">
              🎓 Secure Your Child's Path to University 🏆
            </h1>
            
            <p className="text-lg text-white/90 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm">
              While others spend thousands on tutoring, you secure your child's success for just £9.99/month
            </p>
          </div>

          {/* Premium Benefits Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-transparent">
              What You Get
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Benefit 1 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/25 via-blue-400/20 to-purple-400/25 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-800/20 via-blue-800/15 to-purple-800/20 border border-cyan-300/40 backdrop-blur-sm hover:border-cyan-300/60 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-cyan-400 via-blue-400 to-cyan-300 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-blue-100 bg-clip-text text-transparent mb-2">Grade 8-9 Guarantee</h3>
                      <p className="text-cyan-100/80 leading-relaxed">
                        AI-powered predictions with 94% accuracy ensure your child targets exactly what examiners want
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/25 via-purple-400/20 to-cyan-400/25 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-800/20 via-purple-800/15 to-cyan-800/20 border border-blue-300/40 backdrop-blur-sm hover:border-blue-300/60 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-400 via-purple-400 to-blue-300 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-100 bg-clip-text text-transparent mb-2">15+ Hours Saved Weekly</h3>
                      <p className="text-blue-100/80 leading-relaxed">
                        Precision-targeted study plans eliminate wasted time, giving families more quality moments together
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/25 via-cyan-400/20 to-blue-400/25 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-purple-800/20 via-cyan-800/15 to-blue-800/20 border border-purple-300/40 backdrop-blur-sm hover:border-purple-300/60 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-purple-400 via-cyan-400 to-purple-300 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] group-hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-cyan-100 bg-clip-text text-transparent mb-2">University Success</h3>
                      <p className="text-purple-100/80 leading-relaxed">
                        92% of our premium students secure offers from Russell Group universities including Oxbridge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 - Enhanced */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/25 via-purple-400/20 to-blue-400/25 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-800/20 via-purple-800/15 to-blue-800/20 border border-cyan-300/40 backdrop-blur-sm hover:border-cyan-300/60 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-cyan-400 via-purple-400 to-blue-400 rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.4)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-500 flex items-center justify-center">
                      <span className="text-2xl">❤️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-purple-100 bg-clip-text text-transparent mb-2">Complete Peace of Mind</h3>
                      <p className="text-cyan-100/80 leading-relaxed">
                        Real-time analytics and progress insights keep you confident in your child's academic journey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium CTA Section */}
            <div className="text-center p-8 bg-gradient-to-br from-cyan-700/30 via-blue-700/35 to-purple-700/30 border-2 border-cyan-300/50 rounded-3xl backdrop-blur-sm relative overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/10 via-blue-300/8 to-purple-300/10 animate-pulse"></div>
              
              <p className="text-lg text-white/90 mb-6 relative leading-relaxed">
                <span className="font-bold text-cyan-200">92% of our students</span> achieve Grade 8-9 and secure <span className="font-bold text-purple-200">Russell Group offers</span>
              </p>

              <Button 
                onClick={handleUpgrade}
                className="relative w-full md:w-auto h-16 px-12 text-xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-2 border-cyan-300/60 shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:shadow-[0_0_60px_rgba(34,211,238,0.7)] hover:scale-110 transition-all duration-500 rounded-2xl group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 via-blue-300/20 to-purple-300/20 animate-pulse"></div>
                <span className="relative flex items-center justify-center gap-3">
                  <span className="text-2xl">🎓</span>
                  Secure My Child's Success - £1 First Month
                </span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};