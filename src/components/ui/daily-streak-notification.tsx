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
  const confettiPieces = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 1,
    color: ['#00B4D8', '#0BA5E9', '#60A5FA'][Math.floor(Math.random() * 3)]
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
          initial={{ y: -10, opacity: 1 }}
          animate={{
            y: window.innerHeight + 10,
            opacity: [1, 1, 0]
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
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <Card className="relative bg-card border border-border shadow-lg">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <CardContent className="p-8 text-center">
                  {/* Streak Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className="relative mx-auto mb-6 w-20 h-20"
                  >
                    <div className="w-20 h-20 rounded-2xl bg-[#00B4D8] flex items-center justify-center shadow-lg">
                      <Flame className="h-10 w-10 text-white" />
                    </div>
                    
                    {/* Streak Count Badge */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-md border-2 border-card">
                      <span className="text-[#00B4D8] font-bold text-base">{streakCount}</span>
                    </div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {getMessage()}
                    </h2>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {getMotivation()}
                    </p>
                  </motion.div>

                  {/* Stats Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-muted rounded-xl mb-6"
                  >
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <Flame className="h-4 w-4 text-[#00B4D8]" />
                          <span className="text-2xl font-bold text-foreground">{streakCount}</span>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground">Day Streak</p>
                      </div>
                      <div className="h-10 w-px bg-border" />
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">+10</div>
                        <p className="text-xs font-medium text-muted-foreground">MP Earned</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-[#00B4D8] hover:bg-[#0099b8] text-white font-semibold py-3 rounded-xl"
                    >
                      Continue Learning
                    </Button>
                  </motion.div>

                  {/* Footer */}
                  <p className="text-xs text-muted-foreground mt-4">
                    Keep practicing daily to maintain your streak
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
