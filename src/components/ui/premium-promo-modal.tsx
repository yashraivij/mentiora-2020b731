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
      <DialogContent className="w-[95vw] max-w-[900px] max-h-[95vh] rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 border-2 border-purple-300/30 shadow-2xl overflow-y-auto animate-scale-in">
        {/* Premium Background Effects with Animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-emerald-500/10 animate-pulse" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-400/20 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-gradient-to-tr from-emerald-400/15 to-teal-400/10 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 p-8 md:p-12">
          {/* Emotional Hook Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-400/30 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-purple-300" />
              <span className="text-sm font-semibold text-purple-200 uppercase tracking-wide">Mentiora Premium</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-300 via-blue-300 to-emerald-300 bg-clip-text text-transparent mb-4 leading-tight">
              Give Your Child The Grades That Open Every Door
            </h1>
            
            <p className="text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed">
              While other parents spend thousands on tutoring with uncertain results, 
              <span className="font-semibold text-emerald-300"> you can guarantee your child's academic success for just £9.99/month</span>
            </p>
          </div>

          {/* Value Comparison - The Smart Investment */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-400/30 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-emerald-300">The Smart Parent's Choice</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Traditional Tutoring */}
                <div className="relative p-6 bg-red-500/10 border-2 border-red-400/40 rounded-xl">
                  <div className="text-center">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-red-300">Traditional Tutoring</span>
                    </div>
                    <div className="text-5xl font-black text-red-400 mb-2">£3,600+</div>
                    <div className="text-red-300 font-medium mb-4">per year</div>
                    <div className="space-y-2 text-sm text-red-200">
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

                {/* Mentiora Premium */}
                <div className="relative p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border-2 border-emerald-400/50 rounded-xl shadow-lg">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-4 py-1 shadow-lg">
                      SMART CHOICE
                    </Badge>
                  </div>
                  <div className="text-center pt-3">
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-emerald-300">Mentiora Premium</span>
                    </div>
                    <div className="text-5xl font-black text-emerald-400 mb-2">£120</div>
                    <div className="text-emerald-300 font-medium mb-4">per year</div>
                    <div className="space-y-2 text-sm text-emerald-100">
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📊</span>
                        Predicted grades
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📅</span>
                        Predicted 2026 exams
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">📝</span>
                        Smart revision notebook
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">🎯</span>
                        Exam board specific content
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="w-4 h-4 flex items-center justify-center text-emerald-400 flex-shrink-0">🏆</span>
                        Proven university success rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-2 border-purple-400/40 rounded-xl">
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold px-6 py-2 text-base animate-pulse mb-4">
                  ⏰ LIMITED TIME: First Month £1 (Then £9.99/mo)
                </Badge>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Give Your Child The University Edge
                </h3>
                <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto">
                  Join 15,000+ families who've secured their child's academic future. 
                  <span className="font-semibold text-emerald-300"> Cancel anytime. Risk-free guarantee.</span>
                </p>

                <Button 
                  onClick={handleUpgrade}
                  className="w-full md:w-auto h-14 px-12 text-xl font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 hover:from-purple-700 hover:via-blue-700 hover:to-emerald-700 text-white border-2 border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  🎓 Secure My Child's Future - Start Now
                </Button>
                
                <div className="flex items-center justify-center gap-4 mt-6 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm">30-Day Money Back Guarantee</span>
                  </div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm">Cancel Anytime</span>
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