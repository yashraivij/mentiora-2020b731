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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-900 border-2 border-amber-300/40 shadow-[0_0_50px_rgba(245,158,11,0.3)] overflow-y-auto animate-scale-in">
        {/* Luxury Background Effects with Dynamic Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/8 via-yellow-500/4 to-orange-500/6 animate-pulse" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-400/25 to-yellow-400/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-400/20 to-amber-400/15 rounded-full blur-3xl animate-pulse" />
        
        {/* Dynamic Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-400/60 rounded-full animate-ping" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-yellow-400/80 rounded-full animate-ping" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-orange-400/70 rounded-full animate-ping" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-amber-300/90 rounded-full animate-ping" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        </div>
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Premium Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-amber-200 via-yellow-200 to-orange-200 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-lg">
              Unlock Top Grades & Russell Group Universities
            </h1>
            
            <p className="text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed">
              While other parents spend thousands on tutoring with uncertain results, <span className="font-bold text-amber-300 drop-shadow-sm">you can guarantee your child's academic success for just £9.99/month</span>
            </p>
          </div>

          {/* Value Comparison - Premium Investment */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-amber-500/12 to-orange-500/8 border-2 border-amber-400/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(245,158,11,0.2)] backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-black text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-md">The Smart Parent's Choice</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Traditional Tutoring */}
                <div className="relative p-6 bg-gradient-to-br from-red-950/60 to-red-900/40 border-2 border-red-400/50 rounded-xl backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-xl animate-pulse"></div>
                  <div className="relative text-center">
                    <div className="mb-4">
                      <span className="text-2xl font-black text-red-200 drop-shadow-sm">Traditional Tutoring</span>
                    </div>
                    <div className="text-5xl font-black text-red-300 mb-2 drop-shadow-lg">£3,600+</div>
                    <div className="text-red-200 font-semibold mb-4">per year</div>
                    <div className="space-y-3 text-sm text-red-100">
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        Limited to 1-2 hours per week
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        Travel time & scheduling conflicts
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        Generic approach, not exam-specific
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0 animate-pulse"></span>
                        No guarantee of results
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mentiora Premium */}
                <div className="relative p-6 bg-gradient-to-br from-amber-500/25 to-yellow-500/15 border-2 border-amber-400/60 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-sm hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black px-6 py-2 shadow-lg border border-amber-300 animate-pulse">
                      ✨ PREMIUM CHOICE ✨
                    </Badge>
                  </div>
                  <div className="text-center pt-4">
                    <div className="mb-4">
                      <span className="text-2xl font-black text-amber-100 drop-shadow-sm">Mentiora Premium</span>
                    </div>
                    <div className="text-5xl font-black text-amber-300 mb-2 drop-shadow-lg animate-pulse">£120</div>
                    <div className="text-amber-200 font-semibold mb-4">per year</div>
                    <div className="space-y-3 text-sm text-amber-50">
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-amber-400 flex-shrink-0 animate-bounce" style={{ animationDelay: '0s' }}>📊</span>
                        Predicted grades with 94% accuracy
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-amber-400 flex-shrink-0 animate-bounce" style={{ animationDelay: '0.2s' }}>📅</span>
                        Predicted 2026 exams
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-amber-400 flex-shrink-0 animate-bounce" style={{ animationDelay: '0.4s' }}>📝</span>
                        Smart revision notebook
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-amber-400 flex-shrink-0 animate-bounce" style={{ animationDelay: '0.6s' }}>🎯</span>
                        Exam board specific content
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-amber-400 flex-shrink-0 animate-bounce" style={{ animationDelay: '0.8s' }}>🏆</span>
                        Proven Russell Group success rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-6 p-6 bg-gradient-to-r from-amber-600/20 to-orange-600/15 border-2 border-amber-400/50 rounded-xl backdrop-blur-sm shadow-[0_0_25px_rgba(245,158,11,0.2)]">
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-black px-6 py-2 text-sm animate-pulse mb-4 shadow-lg">
                  ⏰ LIMITED TIME: First Month £1 (Then £9.99/mo)
                </Badge>
                <h3 className="text-2xl font-black text-amber-100 mb-3 drop-shadow-md">
                  Give Your Child The Russell Group Edge
                </h3>
                <p className="text-sm text-slate-200 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Join 15,000+ families who've secured their child's future at top universities. 
                  <span className="font-bold text-amber-300"> Cancel anytime.</span>
                </p>

                <Button 
                  onClick={handleUpgrade}
                  className="w-full md:w-auto h-14 px-10 text-lg font-black bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-black border-2 border-amber-300/60 shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:scale-110 transition-all duration-300 rounded-xl animate-pulse"
                >
                  🎓 Start Premium Now
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-6 text-slate-300 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-amber-400 animate-pulse" />
                    <span className="font-semibold">30-Day Guarantee</span>
                  </div>
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-amber-400 animate-pulse" />
                    <span className="font-semibold">Cancel Anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Benefits - What Your Investment Delivers */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-center mb-8 bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
              What Your Investment Delivers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-amber-950/60 to-orange-950/40 border border-amber-400/40 backdrop-blur-sm hover:scale-[1.05] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg shadow-lg animate-pulse">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-amber-200 mb-2 drop-shadow-sm">Grade 8-9 Guarantee</h3>
                      <p className="text-amber-100/90 leading-relaxed">
                        AI-powered predictions ensure your child knows exactly what to study for maximum grade impact
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/25 to-amber-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-yellow-950/60 to-amber-950/40 border border-yellow-400/40 backdrop-blur-sm hover:scale-[1.05] transition-all duration-300 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg shadow-lg animate-pulse">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-yellow-200 mb-2 drop-shadow-sm">15+ Hours Saved Weekly</h3>
                      <p className="text-yellow-100/90 leading-relaxed">
                        Efficient, targeted study plans mean more family time and less stress for everyone
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/25 to-red-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-orange-950/60 to-red-950/40 border border-orange-400/40 backdrop-blur-sm hover:scale-[1.05] transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-lg animate-pulse">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-orange-200 mb-2 drop-shadow-sm">Russell Group Success</h3>
                      <p className="text-orange-100/90 leading-relaxed">
                        92% of our premium students secure offers from their top-choice universities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-amber-950/60 to-yellow-950/40 border border-amber-400/40 backdrop-blur-sm hover:scale-[1.05] transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg shadow-lg animate-pulse">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-amber-200 mb-2 drop-shadow-sm">Peace of Mind</h3>
                      <p className="text-amber-100/90 leading-relaxed">
                        Real-time progress tracking so you always know your child is on the right path
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Parent Testimonials */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-950/70 to-zinc-900/60 border border-amber-400/30 rounded-2xl p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-400/50 transition-all duration-300">
              <h3 className="text-2xl font-black text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-200 bg-clip-text text-transparent drop-shadow-md">What Parents Are Saying</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-amber-500/15 to-orange-500/10 border border-amber-400/30 rounded-xl hover:border-amber-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                  <p className="text-amber-100 italic mb-4 leading-relaxed font-medium">
                    "My daughter went from predicted 6s to achieving 8s and 9s. She's now at Imperial College studying Engineering. Best £120 we ever spent."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                      S
                    </div>
                    <div>
                      <p className="font-black text-amber-200">Sarah M.</p>
                      <p className="text-sm text-amber-300/80">Parent, London</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-yellow-500/15 to-amber-500/10 border border-yellow-400/30 rounded-xl hover:border-yellow-400/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-[0_0_15px_rgba(234,179,8,0.1)]">
                  <p className="text-yellow-100 italic mb-4 leading-relaxed font-medium">
                    "No more expensive tutoring sessions. My son studies confidently on his own now and got into Cambridge. The ROI is incredible."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg">
                      M
                    </div>
                    <div>
                      <p className="font-black text-yellow-200">Michael R.</p>
                      <p className="text-sm text-yellow-300/80">Parent, Manchester</p>
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