import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Clock, PoundSterling, BookOpen, TrendingUp, CheckCircle, Heart, Calendar, BarChart3, NotebookPen } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.15)] overflow-y-auto animate-scale-in">
        {/* Trustworthy Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-slate-500/8 to-blue-600/5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-400/8 via-slate-400/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-slate-400/8 via-blue-400/5 to-transparent rounded-full blur-3xl" />
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Professional Header */}
          <div className="text-center mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/3 to-transparent blur-lg"></div>
            <h1 className="relative text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent mb-4 leading-tight tracking-tight">
              Unlock Top Grades & Russell Group Universities
            </h1>
            
            <p className="text-lg text-slate-200/90 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm">
              While other parents spend thousands on tutoring with uncertain results, <span className="font-semibold text-emerald-300 bg-emerald-900/20 px-2 py-1 rounded-md border border-emerald-500/30">you can guarantee your child's academic success for just £9.99/month</span>
            </p>
          </div>

          {/* Premium Value Comparison */}
          <div className="mb-6">
            <div className="relative bg-gradient-to-br from-blue-500/8 via-slate-500/8 to-blue-600/8 border border-blue-400/25 rounded-3xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.1)] backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/3 to-slate-400/3 rounded-3xl"></div>
              <h2 className="relative text-2xl md:text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-300 to-slate-200 bg-clip-text text-transparent">The Smart Parent's Choice</h2>
              
              <div className="grid md:grid-cols-2 gap-6 relative">
                {/* Traditional Tutoring */}
                <div className="relative p-6 bg-gradient-to-br from-red-950/50 to-red-900/30 border border-red-400/40 rounded-2xl shadow-lg backdrop-blur-sm group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="text-center relative">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-red-300">Traditional Tutoring</span>
                    </div>
                    <div className="text-5xl font-black bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent mb-2">£3,600+</div>
                    <div className="text-red-300 font-medium mb-4">per year</div>
                    <div className="space-y-2 text-sm text-red-200/80">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        Limited to 1-2 hours per week
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse animation-delay-500"></span>
                        Travel time & scheduling conflicts
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse animation-delay-1000"></span>
                        Generic approach, not exam-specific
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse animation-delay-1500"></span>
                        No guarantee of results
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Solution */}
                <div className="relative p-6 bg-gradient-to-br from-emerald-950/40 via-blue-950/30 to-slate-950/40 border border-emerald-400/40 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.12)] backdrop-blur-sm group hover:scale-105 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-blue-400/5 to-slate-400/8 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white font-bold px-4 py-1 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                      ✓ TRUSTED CHOICE
                    </Badge>
                  </div>
                  <div className="text-center pt-3 relative">
                    <div className="mb-4">
                      <span className="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">Premium Solution</span>
                    </div>
                    <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-300 bg-clip-text text-transparent mb-2">£120</div>
                    <div className="text-emerald-300 font-medium mb-4">per year</div>
                    <div className="space-y-2 text-sm text-emerald-100/90">
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📊</span>
                        Predicted grades with 94% accuracy
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📅</span>
                        Predicted 2026 exams (exact questions)
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📝</span>
                        AI-powered revision notebook
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">🎯</span>
                        Exam board specific predictions
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">🏆</span>
                        92% university success rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional CTA Section */}
              <div className="text-center mt-6 p-6 bg-gradient-to-br from-blue-900/25 via-slate-900/25 to-blue-900/25 border border-blue-400/30 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/3 via-slate-400/3 to-blue-400/3"></div>
                <Badge className="relative bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 text-white font-bold px-6 py-2 text-sm mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                  💎 EXCLUSIVE: First Month £1 (Then £9.99/mo)
                </Badge>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent mb-3">
                  Secure Your Child's University Future Today
                </h3>
                <p className="text-sm text-slate-200/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Join 15,000+ families who've secured their child's future with our premium platform. 
                  <span className="font-bold text-transparent bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text"> Cancel anytime.</span>
                </p>

                <Button 
                  onClick={handleUpgrade}
                  className="relative w-full md:w-auto h-14 px-10 text-lg font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white border border-blue-400/30 shadow-[0_0_25px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-105 transition-all duration-300 rounded-xl group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-blue-500/10"></div>
                  <span className="relative flex items-center gap-2">
                    🎓 Start Premium Journey
                    <div className="w-2 h-2 bg-white/30 rounded-full group-hover:animate-pulse"></div>
                  </span>
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-6 text-slate-300/80 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-blue-400/50 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span>Cancel Anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Benefits Section */}
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-300 via-white to-blue-300 bg-clip-text text-transparent">
              Proven Academic Results
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 - Grade Guarantee */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/15 via-green-500/10 to-emerald-600/15 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-green-950/25 to-emerald-900/30 border border-emerald-400/25 backdrop-blur-sm hover:border-emerald-400/40 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-500 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all duration-500">
                      <TrendingUp className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent mb-2">Grade 8-9 Guarantee</h3>
                      <p className="text-emerald-100/80 leading-relaxed">
                        AI-powered predictions with 94% accuracy ensure your child targets exactly what examiners want
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 - Time Saving */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 via-indigo-500/10 to-blue-600/15 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-950/30 via-indigo-950/25 to-blue-900/30 border border-blue-400/25 backdrop-blur-sm hover:border-blue-400/40 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.25)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all duration-500">
                      <Clock className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent mb-2">15+ Hours Saved Weekly</h3>
                      <p className="text-blue-100/80 leading-relaxed">
                        Precision-targeted study plans eliminate wasted time, giving families more quality moments together
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 - University Success */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-blue-500/10 to-slate-500/15 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-blue-950/25 to-slate-900/30 border border-indigo-400/25 backdrop-blur-sm hover:border-indigo-400/40 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-indigo-600 via-blue-600 to-slate-600 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.25)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-500">
                      <GraduationCap className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-blue-200 bg-clip-text text-transparent mb-2">University Success</h3>
                      <p className="text-indigo-100/80 leading-relaxed">
                        92% of our premium students secure offers from Russell Group universities including Oxbridge
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 - Peace of Mind */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-500/15 via-blue-500/10 to-slate-600/15 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-950/30 via-blue-950/25 to-slate-900/30 border border-slate-400/25 backdrop-blur-sm hover:border-slate-400/40 transition-all duration-500 hover:scale-105">
                  <div className="flex items-start gap-4">
                    <div className="p-4 bg-gradient-to-br from-slate-600 via-blue-600 to-slate-500 rounded-xl shadow-[0_0_15px_rgba(100,116,139,0.25)] group-hover:shadow-[0_0_20px_rgba(100,116,139,0.35)] transition-all duration-500">
                      <Heart className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold bg-gradient-to-r from-slate-300 to-blue-200 bg-clip-text text-transparent mb-2">Complete Peace of Mind</h3>
                      <p className="text-slate-100/80 leading-relaxed">
                        Real-time analytics and progress insights keep you confident in your child's academic journey
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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