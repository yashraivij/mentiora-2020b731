import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, Target, BookOpen, Clock, Brain, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-10, -30, -10],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              <Star className="h-2 w-2 text-emerald-400" />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 p-8">
          <DialogHeader className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl"
              >
                <Crown className="h-12 w-12 text-white" />
              </motion.div>
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Unlock Mentiora Premium 🚀
            </DialogTitle>
            <DialogDescription className="text-lg text-foreground/80 mt-2">
              Get smarter revision, faster results, and exam-ready confidence
            </DialogDescription>
          </DialogHeader>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 dark:bg-gray-900/30 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-lg">
                  <Target className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-foreground">Predicted Exam Questions</h3>
              </div>
              <p className="text-sm text-foreground/70">AI-powered 2026 predictions with real exam timers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 dark:bg-gray-900/30 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-lg">
                  <BookOpen className="h-5 w-5 text-teal-600" />
                </div>
                <h3 className="font-semibold text-foreground">Smart Revision Notes</h3>
              </div>
              <p className="text-sm text-foreground/70">Personalized bulletproof notes from your mistakes</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/60 dark:bg-gray-900/30 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-lg">
                  <Brain className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-foreground">Grade Predictions</h3>
              </div>
              <p className="text-sm text-foreground/70">Track your progress toward target grades</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/60 dark:bg-gray-900/30 p-4 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-lg">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground">Save 10+ Hours Weekly</h3>
              </div>
              <p className="text-sm text-foreground/70">Focus only on what you need to improve</p>
            </motion.div>
          </div>

          {/* Value proposition */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-emerald-800 dark:text-emerald-300">Limited Time</span>
              </div>
              <p className="text-emerald-700 dark:text-emerald-200 text-sm">
                Join thousands of students already achieving their target grades
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            >
              Maybe Later
            </Button>
            <motion.div className="flex-1">
              <Button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg shadow-xl hover:shadow-emerald-500/25 transform hover:scale-[1.02] transition-all duration-300"
              >
                <Crown className="h-5 w-5 mr-2" />
                Upgrade to Premium
                <Sparkles className="h-5 w-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};