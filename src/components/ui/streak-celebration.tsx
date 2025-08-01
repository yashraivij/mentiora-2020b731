import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star, Gift, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface StreakCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  streakDays: number;
  rewardText: string;
  rewardEmoji: string;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            top: '-10px'
          }}
          initial={{ y: -10, rotate: 0, scale: 1, opacity: 1 }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
            scale: [1, 1.2, 0.8, 1],
            opacity: [1, 1, 0.8, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
};

export function StreakCelebration({ isVisible, onClose, streakDays, rewardText, rewardEmoji }: StreakCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <Confetti />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500, delay: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-yellow-50/80 to-orange-50/80 dark:from-slate-900 dark:via-yellow-950/20 dark:to-orange-950/20 shadow-2xl max-w-md w-full">
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 animate-pulse" />
                
                {/* Sophisticated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl p-[2px]">
                  <div className="bg-gradient-to-br from-white via-yellow-50/80 to-orange-50/80 dark:from-slate-900 dark:via-yellow-950/20 dark:to-orange-950/20 rounded-[10px] h-full w-full" />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-4 right-6 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-bounce opacity-80" />
                <div className="absolute bottom-6 left-8 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute top-8 left-6 w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-ping opacity-70" />

                <CardContent className="relative p-8 text-center">
                  {/* Trophy Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.5 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 flex items-center justify-center shadow-2xl shadow-yellow-500/25 relative overflow-hidden">
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <Trophy className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Rotating Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-yellow-300/30"
                      />
                    </div>
                    
                    {/* Floating Stars */}
                    <motion.div
                      animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Star className="h-3 w-3 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="h-2.5 w-2.5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.div>

                  {/* Celebration Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-4 mb-6"
                  >
                    <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 dark:from-yellow-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                      🎉 Streak Milestone!
                    </h2>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">
                        {streakDays} Day Study Streak Complete!
                      </p>
                      <p className="text-muted-foreground">
                        You've unlocked your second reward!
                      </p>
                    </div>

                    {/* Reward Display */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                      className="p-4 bg-gradient-to-r from-emerald-100/80 to-blue-100/80 dark:from-emerald-950/40 dark:to-blue-950/40 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center space-x-3 mb-2">
                        <span className="text-2xl">{rewardEmoji}</span>
                        <Palette className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-700 to-blue-700 dark:from-emerald-300 dark:to-blue-300 bg-clip-text text-transparent">
                        Reward Unlocked!
                      </h3>
                      <p className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80">
                        {rewardText}
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 hover:from-yellow-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Awesome! Continue Studying
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}