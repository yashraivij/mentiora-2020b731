import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Shield, Clock, PoundSterling, BookOpen, TrendingUp, CheckCircle, Heart, Calendar, BarChart3, NotebookPen, Target, FileText, Brain } from "lucide-react";

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
      <DialogContent className="w-[95vw] max-w-[800px] max-h-[95vh] rounded-2xl p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-800 border border-blue-400/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] overflow-y-auto animate-scale-in">
        
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800 rounded-t-2xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-blue-600/5" />
          <div className="absolute top-4 right-8 opacity-10">
            <GraduationCap className="h-32 w-32 text-blue-300" />
          </div>
          
          <div className="relative z-10 px-8 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
              Secure Your Child's Path to University
            </h1>
            <p className="text-xl text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
              For just £9.99/month, unlock smarter tools that save time, save money, and lead to better grades — without costly tutoring.
            </p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Feature Section */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Predicted Grades */}
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-400/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg p-3 w-fit mb-4 shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">📊 Predicted Grades</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                See exactly where your child stands with AI-powered grade predictions that are 94% accurate.
              </p>
            </div>

            {/* Predicted Papers */}
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-400/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-3 w-fit mb-4 shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">📄 Predicted 2026 GCSE Papers</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Practice with the closest thing to the real exam — targeted questions that mirror actual papers.
              </p>
            </div>

            {/* Smart Revision Notebook */}
            <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-400/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg p-3 w-fit mb-4 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">📝 Smart Revision Notebook</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                AI-generated notes that save hours and keep revision laser-focused on what matters most.
              </p>
            </div>
          </div>

          {/* Value Highlight Bar */}
          <div className="bg-gradient-to-r from-emerald-900/20 via-blue-900/20 to-emerald-900/20 border border-emerald-400/30 rounded-xl p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">£3,480</div>
                <p className="text-sm text-slate-300">Saved vs Private Tutoring</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                <p className="text-sm text-slate-300">Hours Gained Weekly</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">92%</div>
                <p className="text-sm text-slate-300">University Success Rate</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/30 border border-blue-400/30 rounded-xl p-8">
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold px-4 py-2 text-sm mb-4">
                  ⭐ EXCLUSIVE: First Month £1
                </Badge>
                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Transform Your Child's Academic Future
                </h3>
                <p className="text-slate-300 max-w-md mx-auto">
                  Join 15,000+ families who've secured their child's university success
                </p>
              </div>

              <Button 
                onClick={handleUpgrade}
                className="relative w-full md:w-auto h-16 px-12 text-lg font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-600 text-white border border-emerald-400/30 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-105 transition-all duration-300 rounded-xl group"
              >
                <span className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6" />
                  Invest in My Child's Future – £9.99/month
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </div>
          </div>

          {/* Trust & Reassurance */}
          <div className="border-t border-slate-700/50 pt-6">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-400" />
                <span>Safe, secure payment</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span>Proven results with thousands of students</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};