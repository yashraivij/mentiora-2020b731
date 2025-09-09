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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-purple-950 to-blue-950 border-2 border-purple-400/40 shadow-2xl overflow-y-auto animate-scale-in backdrop-blur-sm">
        {/* Premium Background Effects with Enhanced Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/15 to-emerald-500/20 animate-pulse" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-400/30 to-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-emerald-400/25 to-teal-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/10 to-violet-500/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 p-6 md:p-8">
          {/* Emotional Hook Header - Enhanced */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-emerald-500 shadow-2xl animate-pulse">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-200 via-blue-200 to-emerald-200 bg-clip-text text-transparent mb-4 leading-tight drop-shadow-lg">
              Unlock Top Grades & Russell Group Universities
            </h1>
            
            <p className="text-lg md:text-xl text-slate-100/90 max-w-3xl mx-auto leading-relaxed">
              While other parents spend thousands on tutoring with uncertain results, 
              <span className="font-bold text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-lg"> you can guarantee your child's academic success for just £9.99/month</span>
            </p>
          </div>

          {/* Value Comparison - Enhanced Premium Design */}
          <div className="mb-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/50 rounded-3xl p-6 shadow-2xl backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-black text-center mb-6 bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">The Smart Parent's Choice</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Traditional Tutoring - Enhanced */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative p-6 bg-gradient-to-br from-red-900/60 to-pink-900/60 border-2 border-red-400/60 rounded-2xl backdrop-blur-sm">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-red-500 to-pink-500 shadow-lg">
                        <span className="text-white font-bold text-lg">❌</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-red-200">Traditional Tutoring</span>
                      </div>
                      <div className="text-5xl font-black text-red-300 mb-2">£3,600+</div>
                      <div className="text-red-200 font-medium mb-4">per year</div>
                      <div className="space-y-2 text-sm text-red-100">
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                          Limited to 1-2 hours per week
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                          Travel time & scheduling conflicts
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                          Generic approach, not exam-specific
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-400 rounded-full flex-shrink-0"></span>
                          No guarantee of results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mentiora Premium - Ultra Premium Design */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-teal-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative p-6 bg-gradient-to-br from-emerald-500/30 to-teal-500/30 border-2 border-emerald-300/70 rounded-2xl backdrop-blur-sm shadow-2xl">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-black px-4 py-2 shadow-lg animate-bounce">
                        ⭐ SMART CHOICE ⭐
                      </Badge>
                    </div>
                    <div className="text-center pt-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 shadow-lg">
                        <span className="text-white font-bold text-lg">✅</span>
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-emerald-200 to-teal-200 bg-clip-text text-transparent">Mentiora Premium</span>
                      </div>
                      <div className="text-5xl font-black bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent mb-2">£120</div>
                      <div className="text-emerald-200 font-medium mb-4">per year</div>
                      <div className="space-y-3 text-sm text-emerald-50">
                        <p className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg">
                          <span className="w-4 h-4 flex items-center justify-center text-emerald-300 flex-shrink-0">📊</span>
                          <span className="font-medium">Predicted grades</span>
                        </p>
                        <p className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg">
                          <span className="w-4 h-4 flex items-center justify-center text-emerald-300 flex-shrink-0">📅</span>
                          <span className="font-medium">Predicted 2026 exams</span>
                        </p>
                        <p className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg">
                          <span className="w-4 h-4 flex items-center justify-center text-emerald-300 flex-shrink-0">📝</span>
                          <span className="font-medium">Smart revision notebook</span>
                        </p>
                        <p className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg">
                          <span className="w-4 h-4 flex items-center justify-center text-emerald-300 flex-shrink-0">🎯</span>
                          <span className="font-medium">Exam board specific content</span>
                        </p>
                        <p className="flex items-center gap-2 bg-emerald-500/10 p-2 rounded-lg">
                          <span className="w-4 h-4 flex items-center justify-center text-emerald-300 flex-shrink-0">🏆</span>
                          <span className="font-medium">Proven university success rate</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Premium CTA Section - Ultra Enticing */}
              <div className="text-center mt-4 p-6 bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-3 border-purple-300/60 rounded-2xl shadow-2xl backdrop-blur-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 shadow-2xl animate-pulse">
                  <span className="text-white font-black text-2xl">⚡</span>
                </div>
                
                <Badge className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white font-black px-6 py-2 text-base animate-bounce mb-4 shadow-lg">
                  ⏰ LIMITED TIME: First Month £1 (Then £9.99/mo)
                </Badge>
                
                <h3 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent mb-3 drop-shadow-lg">
                  Give Your Child The University Edge
                </h3>
                
                <p className="text-base text-slate-100/90 mb-6 max-w-2xl mx-auto leading-relaxed">
                  Join 15,000+ families who've secured their child's future. 
                  <span className="font-black text-emerald-300 bg-emerald-500/20 px-2 py-1 rounded-lg"> Cancel anytime. Risk-free.</span>
                </p>

                <div className="relative group mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-75"></div>
                  <Button 
                    onClick={handleUpgrade}
                    className="relative w-full md:w-auto h-14 px-10 text-xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:from-purple-500 hover:via-blue-500 hover:to-emerald-500 text-white border-2 border-white/30 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 rounded-2xl"
                  >
                    <span className="flex items-center gap-3">
                      🎓 <span>Start Premium Now</span> 🚀
                    </span>
                  </Button>
                </div>
                
                <div className="flex items-center justify-center gap-4 text-slate-200 text-sm bg-white/5 p-3 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium">30-Day Guarantee</span>
                  </div>
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium">Cancel Anytime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Concrete Benefits - What Your Child Gets */}
          <div className="mb-10">
            <h2 className="text-3xl font-black text-center mb-8 text-white">
              What Your Investment Delivers
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Benefit 1 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-400/30 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-purple-200 mb-2">Grade 8-9 Guarantee</h3>
                      <p className="text-purple-100/80 leading-relaxed">
                        AI-powered predictions ensure your child knows exactly what to study for maximum grade impact
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border border-emerald-400/30 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-emerald-200 mb-2">15+ Hours Saved Weekly</h3>
                      <p className="text-emerald-100/80 leading-relaxed">
                        Efficient, targeted study plans mean more family time and less stress for everyone
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-400/30 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-blue-200 mb-2">University Success</h3>
                      <p className="text-blue-100/80 leading-relaxed">
                        92% of our premium students secure offers from their top-choice universities
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative p-6 rounded-xl bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-400/30 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-pink-200 mb-2">Peace of Mind</h3>
                      <p className="text-pink-100/80 leading-relaxed">
                        Real-time progress tracking so you always know your child is on the right path
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parent Testimonials */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/30 rounded-2xl p-8 hover:border-slate-500/40 transition-all duration-300">
              <h3 className="text-2xl font-bold text-center mb-6 text-white">What Parents Are Saying</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-xl hover:border-purple-400/30 transition-all duration-300 hover:scale-105">
                  <p className="text-purple-100 italic mb-3 leading-relaxed">
                    "My daughter went from predicted 6s to achieving 8s and 9s. She's now at Imperial College studying Engineering. Best £120 we ever spent."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      S
                    </div>
                    <div>
                      <p className="font-semibold text-purple-200">Sarah M.</p>
                      <p className="text-sm text-purple-300">Parent, London</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-400/20 rounded-xl hover:border-emerald-400/30 transition-all duration-300 hover:scale-105">
                  <p className="text-emerald-100 italic mb-3 leading-relaxed">
                    "No more expensive tutoring sessions. My son studies confidently on his own now and got into Cambridge. The ROI is incredible."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                      M
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-200">Michael R.</p>
                      <p className="text-sm text-emerald-300">Parent, Manchester</p>
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