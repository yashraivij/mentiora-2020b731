import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Zap, Target, BookOpen, Clock, Brain, Star, Trophy, Rocket, Bolt, Gift, Flame, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ isOpen, onClose, onUpgrade }: PremiumPromoModalProps) => {
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
  
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-0 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 relative shadow-2xl shadow-purple-500/50">
        {/* Explosive animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/30 via-pink-500/30 to-red-500/30" />
        
        {/* Floating premium elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -60, -20],
                x: [-10, 10, -10],
                opacity: [0.4, 1, 0.4],
                scale: [0.3, 1.2, 0.3],
                rotate: [0, 360, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {i % 4 === 0 && <Crown className="h-3 w-3 text-yellow-300" />}
              {i % 4 === 1 && <Sparkles className="h-3 w-3 text-pink-300" />}
              {i % 4 === 2 && <Bolt className="h-3 w-3 text-cyan-300" />}
              {i % 4 === 3 && <Flame className="h-3 w-3 text-orange-300" />}
            </motion.div>
          ))}
        </div>

        {/* Urgent timer banner */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white text-center py-2 z-20">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="flex items-center justify-center gap-2 font-bold text-sm"
          >
            <Flame className="h-4 w-4" />
            <span>LIMITED TIME: Special Offer Expires in {formatTime(timeLeft)}</span>
            <Flame className="h-4 w-4" />
          </motion.div>
        </div>

        <div className="relative z-10 p-8 pt-16">
          <DialogHeader className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.2, 1],
                  y: [0, -10, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity
                }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-lg opacity-75 animate-pulse" />
                <div className="relative p-6 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl shadow-2xl">
                  <Crown className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
                {/* Orbiting icons */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Trophy className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-yellow-300" />
                  <Rocket className="absolute top-1/2 -right-2 transform -translate-y-1/2 h-6 w-6 text-pink-300" />
                  <Bolt className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-cyan-300" />
                  <Gift className="absolute top-1/2 -left-2 transform -translate-y-1/2 h-6 w-6 text-purple-300" />
                </motion.div>
              </motion.div>
            </div>
            <motion.div
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-yellow-300 via-pink-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent bg-size-200"
              style={{ backgroundSize: "200% 100%" }}
            >
              <DialogTitle className="text-4xl font-black mb-2">
                🔥 UNLOCK PREMIUM NOW! 🔥
              </DialogTitle>
            </motion.div>
            <DialogDescription className="text-xl text-white font-bold mt-4 drop-shadow-lg">
              ⚡ Join 10,000+ Students Getting A* Grades ⚡
            </DialogDescription>
            <div className="mt-4 bg-gradient-to-r from-yellow-400/20 to-red-400/20 border border-yellow-400/50 rounded-lg p-3">
              <p className="text-yellow-200 font-bold text-lg">
                🎯 Parents: Give your child the UNFAIR ADVANTAGE
              </p>
            </div>
          </DialogHeader>

          {/* Explosive benefits showcase */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-red-500/80 to-pink-600/80 p-6 rounded-2xl border border-yellow-400/50 shadow-xl backdrop-blur-sm group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-full animate-pulse">🔥 HOT</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-white text-lg">Predicted 2026 Questions</h3>
              </div>
              <p className="text-white/90 font-semibold">🎯 Know EXACTLY what's coming in your exams!</p>
              <div className="mt-2 text-yellow-300 font-bold text-sm">
                ✅ 94% accuracy rate • ✅ Real exam conditions
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative bg-gradient-to-br from-purple-500/80 to-blue-600/80 p-6 rounded-2xl border border-cyan-400/50 shadow-xl backdrop-blur-sm group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-2 right-2">
                <span className="bg-cyan-400 text-black text-xs font-black px-2 py-1 rounded-full animate-pulse">⚡ SMART</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl shadow-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-white text-lg">AI Grade Predictor</h3>
              </div>
              <p className="text-white/90 font-semibold">📈 See your future grades BEFORE the exam!</p>
              <div className="mt-2 text-cyan-300 font-bold text-sm">
                ✅ Personalized insights • ✅ Track progress live
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative bg-gradient-to-br from-green-500/80 to-teal-600/80 p-6 rounded-2xl border border-yellow-400/50 shadow-xl backdrop-blur-sm group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-2 right-2">
                <span className="bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-full animate-pulse">💎 VIP</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-yellow-400 to-green-500 rounded-xl shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-white text-lg">Smart Revision Notes</h3>
              </div>
              <p className="text-white/90 font-semibold">🧠 Turn your mistakes into A* knowledge!</p>
              <div className="mt-2 text-yellow-300 font-bold text-sm">
                ✅ Bulletproof notes • ✅ Never forget again
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative bg-gradient-to-br from-orange-500/80 to-red-600/80 p-6 rounded-2xl border border-pink-400/50 shadow-xl backdrop-blur-sm group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute top-2 right-2">
                <span className="bg-pink-400 text-black text-xs font-black px-2 py-1 rounded-full animate-pulse">⏰ SAVE</span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <div className="p-3 bg-gradient-to-br from-pink-400 to-red-500 rounded-xl shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-black text-white text-lg">10+ Hours Saved Weekly</h3>
              </div>
              <p className="text-white/90 font-semibold">⚡ Study SMARTER, not harder!</p>
              <div className="mt-2 text-pink-300 font-bold text-sm">
                ✅ Focus on weak spots • ✅ Skip what you know
              </div>
            </motion.div>
          </div>

          {/* Social proof and urgency */}
          <div className="text-center mb-8 space-y-4">
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 p-6 rounded-2xl border-2 border-white/50 shadow-2xl"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-white animate-bounce" />
                <span className="font-black text-white text-xl">10,000+ SUCCESS STORIES</span>
                <TrendingUp className="h-6 w-6 text-white animate-bounce" />
              </div>
              <p className="text-white font-bold text-lg mb-2">
                🎓 Parents report average grade improvements of 2+ levels!
              </p>
              <div className="flex justify-center gap-8 text-white font-bold">
                <div className="text-center">
                  <div className="text-2xl">94%</div>
                  <div className="text-xs">Hit Target Grade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">15hrs</div>
                  <div className="text-xs">Saved Weekly</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl">A*</div>
                  <div className="text-xs">Average Grade</div>
                </div>
              </div>
            </motion.div>
            
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 p-4 rounded-xl border border-yellow-400/50">
              <p className="text-white font-black text-lg animate-pulse">
                ⚠️ WARNING: Only 50 spots left this month at this price! ⚠️
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/30 text-white/70 hover:bg-white/10 backdrop-blur-sm font-semibold py-3"
            >
              😔 Miss Out (Regret Later)
            </Button>
            <motion.div className="flex-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onUpgrade}
                  className="w-full relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-black font-black py-4 px-8 rounded-xl shadow-2xl border-2 border-white/50 text-lg group"
                >
                  <motion.div
                    animate={{ x: [-1000, 1000] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                  />
                  <div className="relative flex items-center justify-center gap-2">
                    <Crown className="h-6 w-6 animate-bounce" />
                    <span>🚀 YES! UNLOCK MY SUCCESS NOW!</span>
                    <Sparkles className="h-6 w-6 animate-spin" />
                  </div>
                </Button>
              </motion.div>
              <p className="text-center text-yellow-200 text-xs mt-2 font-bold animate-pulse">
                ⏰ Secure your spot before price goes up!
              </p>
            </motion.div>
          </div>
          
          {/* Final urgency message */}
          <div className="mt-6 text-center">
            <p className="text-white/90 text-sm font-semibold">
              💝 <span className="text-yellow-300">BONUS:</span> First 100 students get FREE 1-on-1 tutoring session (Worth £50)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};