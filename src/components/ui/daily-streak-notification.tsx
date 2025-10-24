import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 1.5,
    color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'][Math.floor(Math.random() * 5)]
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

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const playCelebrationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playSound = (frequency: number, duration: number, delay: number) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Celebration sound sequence
      playSound(523.25, 0.1, 0); // C5
      playSound(659.25, 0.1, 100); // E5
      playSound(783.99, 0.15, 200); // G5
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playCelebrationSound();
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getMessage = () => {
    if (streakCount === 1) {
      return "Welcome back!";
    } else if (streakCount >= 7) {
      return `${streakCount} Day Streak! 🔥`;
    } else if (streakCount >= 3) {
      return `${streakCount} Day Streak!`;
    } else {
      return `${streakCount} Day Streak!`;
    }
  };

  const getMotivation = () => {
    if (streakCount === 1) {
      return "You're back on track. Let's make today count and build that streak!";
    } else if (streakCount >= 7) {
      return "Your dedication is paying off! Keep up this amazing consistency.";
    } else if (streakCount >= 3) {
      return "You're building great study habits! Stay consistent to see real results.";
    } else {
      return "Consistency is key to success. Keep showing up every day!";
    }
  };

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
              transition={{ type: "spring", damping: 25, stiffness: 500, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/80 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20 shadow-2xl max-w-md w-full">
                {/* Mentiora Brand Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 animate-pulse" />
                
                {/* Premium Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-xl p-[2px]">
                  <div className="bg-gradient-to-br from-white via-emerald-50/80 to-teal-50/80 dark:from-slate-900 dark:via-emerald-950/20 dark:to-teal-950/20 rounded-[10px] h-full w-full" />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Floating Elements */}
                <div className="absolute top-4 right-12 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-bounce opacity-80" />
                <div className="absolute bottom-6 left-8 w-2 h-2 bg-gradient-to-r from-teal-400 to-green-400 rounded-full animate-pulse opacity-60" />

                <CardContent className="relative p-8 text-center">
                  {/* Streak Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.1 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 flex items-center justify-center shadow-2xl shadow-emerald-500/25 relative overflow-hidden">
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <Flame className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Rotating Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-emerald-300/30"
                      />
                    </div>
                    
                    {/* Streak Count Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.3, stiffness: 200 }}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-teal-400 to-green-400 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900"
                    >
                      <span className="text-white font-black text-lg drop-shadow-sm">{streakCount}</span>
                    </motion.div>
                  </motion.div>

                  {/* Welcome Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 mb-6"
                  >
                    <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 dark:from-emerald-400 dark:via-teal-400 dark:to-green-400 bg-clip-text text-transparent">
                      {getMessage()}
                    </h2>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {getMotivation()}
                    </p>

                    {/* Stats Highlight */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                      className="p-4 bg-gradient-to-r from-emerald-100/80 to-teal-100/80 dark:from-emerald-950/40 dark:to-teal-950/40 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Flame className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-1" />
                            <span className="text-2xl font-bold text-foreground">{streakCount}</span>
                          </div>
                          <p className="text-xs font-medium text-muted-foreground">Days</p>
                        </div>
                        <div className="h-12 w-px bg-emerald-300/50 dark:bg-emerald-700/50" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-foreground mb-1">+10</div>
                          <p className="text-xs font-medium text-muted-foreground">MP Earned</p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 hover:from-emerald-600 hover:via-teal-600 hover:to-green-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-105"
                    >
                      Continue Learning
                    </Button>
                  </motion.div>

                  {/* Footer Message */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Keep your streak alive by practicing daily
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
