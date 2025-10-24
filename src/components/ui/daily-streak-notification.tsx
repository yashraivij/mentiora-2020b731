import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Zap, Star, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 1.5,
    color: ['#FF6B35', '#F7931E', '#FDCA40', '#FB8500', '#FF4500'][Math.floor(Math.random() * 5)]
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

const FloatingEmoji = ({ emoji, delay }: { emoji: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, y: 20 }}
    animate={{ 
      opacity: [0, 1, 1, 0],
      scale: [0, 1.2, 1, 0.8],
      y: [20, -60, -80, -100],
      rotate: [0, 10, -10, 0]
    }}
    transition={{
      duration: 2.5,
      delay,
      ease: "easeOut"
    }}
    className="absolute text-3xl pointer-events-none"
    style={{ left: '50%', bottom: '40%' }}
  >
    {emoji}
  </motion.div>
);

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

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
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Celebration sound sequence
      playSound(523.25, 0.1, 0); // C5
      playSound(659.25, 0.1, 100); // E5
      playSound(783.99, 0.15, 200); // G5
      playSound(1046.50, 0.2, 300); // C6
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      setShowEmojis(true);
      playCelebrationSound();
      const timer = setTimeout(() => {
        setShowConfetti(false);
        setShowEmojis(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getMessage = () => {
    if (streakCount === 1) {
      return "You're back! Let's get this streak started! 🎯";
    } else if (streakCount >= 7) {
      return `${streakCount} days! You're on fire! Keep it going! 🔥`;
    } else if (streakCount >= 3) {
      return `${streakCount} day streak! You're building momentum! 💪`;
    } else {
      return `${streakCount} days in a row! Keep up the great work! ⭐`;
    }
  };

  const getMotivation = () => {
    if (streakCount === 1) {
      return "Every expert was once a beginner. Let's make today count!";
    } else if (streakCount >= 7) {
      return "Your dedication is incredible! Success is just around the corner.";
    } else if (streakCount >= 3) {
      return "Consistency is key to success. You're doing amazing!";
    } else {
      return "Small daily improvements lead to stunning results!";
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0, rotateX: -15 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.5, y: 50, opacity: 0, rotateX: 15 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-orange-50/50 to-red-50/50 dark:from-slate-900 dark:via-orange-950/20 dark:to-red-950/20 shadow-2xl">
                {/* Animated Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 animate-pulse" />
                
                {/* Premium Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 rounded-xl p-[2px]">
                  <div className="bg-gradient-to-br from-white via-orange-50/50 to-red-50/50 dark:from-slate-900 dark:via-orange-950/20 dark:to-red-950/20 rounded-[10px] h-full w-full" />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/30 hover:bg-white/50 dark:bg-black/30 dark:hover:bg-black/50 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Floating Emojis */}
                {showEmojis && (
                  <>
                    <FloatingEmoji emoji="🔥" delay={0.2} />
                    <FloatingEmoji emoji="⚡" delay={0.4} />
                    <FloatingEmoji emoji="⭐" delay={0.6} />
                  </>
                )}

                <div className="relative p-8 text-center">
                  {/* Streak Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200, delay: 0.1 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center shadow-2xl shadow-orange-500/40 relative overflow-hidden">
                      <div className="absolute inset-2 rounded-2xl bg-white/10 backdrop-blur-sm" />
                      <Flame className="h-12 w-12 text-white relative z-10 drop-shadow-2xl" />
                      
                      {/* Rotating Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-orange-300/30"
                      />
                      
                      {/* Pulse Effect */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-3xl bg-orange-400"
                      />
                    </div>
                    
                    {/* Floating Icons */}
                    <motion.div
                      animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Zap className="h-4 w-4 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-2 -left-2 w-7 h-7 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Star className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.div>

                  {/* Streak Count */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-6xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 dark:from-orange-400 dark:via-red-400 dark:to-orange-400 bg-clip-text text-transparent mb-2"
                    >
                      {streakCount}
                    </motion.div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      {getMessage()}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {getMotivation()}
                    </p>
                  </motion.div>

                  {/* Stats Card */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="p-4 bg-gradient-to-r from-orange-100/80 to-red-100/80 dark:from-orange-950/40 dark:to-red-950/40 rounded-2xl border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-sm mb-6"
                  >
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-1" />
                          <span className="text-2xl font-bold text-foreground">{streakCount}</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">Day Streak</p>
                      </div>
                      <div className="h-12 w-px bg-orange-300/50 dark:bg-orange-700/50" />
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Trophy className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-1" />
                          <span className="text-2xl font-bold text-foreground">+10</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">MP Earned</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 hover:from-orange-600 hover:via-red-600 hover:to-orange-600 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-2xl shadow-orange-500/40 hover:shadow-orange-500/60 transition-all duration-300 hover:scale-105"
                    >
                      <Zap className="h-5 w-5 mr-2" />
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
                    Keep practicing daily to maintain your streak! 🎯
                  </motion.p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
