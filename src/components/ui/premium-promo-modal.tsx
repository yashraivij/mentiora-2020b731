import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, X, GraduationCap, TrendingUp, Sparkles, Star, Zap, Clock, Target, BookOpen, Brain, Award, BarChart3, Users, Timer, AlertTriangle } from "lucide-react";

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
      <DialogContent className="w-[90vw] max-w-[800px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 border-0 text-white shadow-2xl mx-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-orange-500/20 animate-pulse" />
          <div className="relative z-10">
            <div className="flex justify-center items-center gap-3 mb-3">
              <AlertTriangle className="h-6 w-6 text-yellow-300 animate-pulse" />
              <span className="text-lg font-black text-yellow-300">LAST 48 HOURS</span>
              <AlertTriangle className="h-6 w-6 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Give Your Child The <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Competitive Edge</span>
            </h1>
            <p className="text-xl font-bold text-red-100">
              🎓 University Applications Close Soon - Don't Let Them Fall Behind
            </p>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* Urgency Timer */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-400/50 rounded-2xl p-4 text-center animate-pulse">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Timer className="h-5 w-5 text-red-300" />
              <span className="text-lg font-bold text-red-200">Special Launch Offer Ends Soon</span>
            </div>
            <p className="text-red-100">⏰ Only 247 spots left at this price</p>
          </div>

          {/* Parent Benefits */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              What Every Parent Wants For Their Child
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: Target, title: "Predictive Grade Analysis", desc: "Know exactly where your child stands before exams", color: "text-green-400" },
                { icon: Clock, title: "Save 15+ Hours Per Week", desc: "AI-powered study plans eliminate wasted time", color: "text-blue-400" },
                { icon: Brain, title: "Personalized Learning Path", desc: "Adapts to your child's learning style", color: "text-purple-400" },
                { icon: BarChart3, title: "Real-Time Progress Tracking", desc: "See improvement week by week", color: "text-yellow-400" },
                { icon: BookOpen, title: "Exam Board Mastery", desc: "Tailored to AQA, Edexcel, OCR specifications", color: "text-pink-400" },
                { icon: Award, title: "University Readiness", desc: "Build skills for A-Levels and beyond", color: "text-cyan-400" }
              ].map((item, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`${item.color} p-2 rounded-lg bg-white/10`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-white/70">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Features List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              🎯 Complete Premium Features
            </h2>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "✅ AI Grade Predictions (GCSE & A-Level)",
                  "✅ Personalized Study Timetables",
                  "✅ Weak Topic Identification & Fixes",
                  "✅ Past Paper Analysis & Questions",
                  "✅ Stress Level Monitoring",
                  "✅ Parent Progress Reports",
                  "✅ University Application Prep",
                  "✅ Revision Notes Generator",
                  "✅ Mock Exam Simulator",
                  "✅ Study Streak Tracking",
                  "✅ Subject Mastery Dashboard",
                  "✅ 24/7 AI Study Assistant"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-white/90">
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-2xl p-6">
            <div className="text-center mb-4">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-lg font-bold text-green-300">Trusted by 12,000+ Parents</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/90 mb-2">"My son went from struggling with maths to getting 8s and 9s. The prediction feature showed us exactly what to focus on."</p>
                <p className="text-white/60">- Sarah M., Parent (London)</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="text-white/90 mb-2">"Saved us £1000s on tutoring. My daughter is now confident and on track for Oxford applications."</p>
                <p className="text-white/60">- James T., Parent (Manchester)</p>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-green-300 font-bold">📈 94% of parents see grade improvements within 30 days</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-400/50 rounded-2xl p-6 text-center">
            <div className="mb-4">
              <div className="flex justify-center items-baseline gap-2 mb-2">
                <span className="text-3xl font-black text-white">£9.99</span>
                <span className="text-lg text-white/70">/month</span>
              </div>
              <div className="bg-red-500 text-white px-4 py-2 rounded-full inline-block">
                <span className="font-bold">🔥 50% OFF - Usually £19.99</span>
              </div>
            </div>
            
            <div className="flex justify-center items-center gap-4 text-sm text-white/80 mb-4">
              <span>✅ Cancel Anytime</span>
              <span>✅ No Setup Fees</span>
              <span>✅ Instant Access</span>
            </div>
          </div>

          {/* Final Urgency */}
          <div className="bg-gradient-to-r from-red-500/30 to-orange-500/30 border border-red-400/50 rounded-2xl p-4 text-center">
            <p className="text-white/90 mb-2">
              <strong className="text-red-300">⚠️ University Applications Open in 4 Months</strong>
            </p>
            <p className="text-white/70 text-sm">
              Don't let your child fall behind their peers who are already using AI to get ahead
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3 pt-2">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 text-lg relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                🚀 Secure Your Child's Future - Start Now £9.99/month
              </span>
            </Button>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full text-white/60 hover:text-white/80 hover:bg-white/5 py-3 text-sm"
            >
              I'll think about it (and watch them fall behind)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};