import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2 + Math.random() * 1,
    color: ['#00B4D8', '#0BA5E9', '#60A5FA', '#38BDF8', '#7DD3FC'][Math.floor(Math.random() * 5)],
    size: 2 + Math.random() * 2,
    rotation: Math.random() * 360
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            top: '-20px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            rotate: piece.rotation
          }}
          initial={{ y: -20, opacity: 1, scale: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            rotate: [piece.rotation, piece.rotation + 360]
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

const CircularProgress = ({ progress, size = 120 }: { progress: number; size?: number }) => {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        className="text-muted"
        opacity="0.2"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B4D8" />
          <stop offset="100%" stopColor="#0BA5E9" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

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
      playSound(1046.50, 0.2, 350); // C6
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playCelebrationSound();
      
      // Animate progress bar
      setTimeout(() => {
        setProgressValue(100);
      }, 300);
      
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setProgressValue(0);
    }
  }, [isVisible]);

  const getMessage = () => {
    if (streakCount === 1) {
      return "Welcome back!";
    } else if (streakCount >= 7) {
      return `${streakCount} Day Streak! 🔥`;
    } else if (streakCount >= 3) {
      return `${streakCount} Days Strong!`;
    } else {
      return `${streakCount} Day Streak!`;
    }
  };

  const getMotivation = () => {
    if (streakCount === 1) {
      return "You're back on track. Let's make today count and build momentum!";
    } else if (streakCount >= 7) {
      return "Outstanding dedication! You're building habits that lead to success.";
    } else if (streakCount >= 3) {
      return "Great consistency! Keep this momentum going to achieve your goals.";
    } else {
      return "You're building a winning habit! Consistency is the key to mastery.";
    }
  };

  // Calculate progress to next milestone
  const milestones = [3, 7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find(m => m > streakCount) || streakCount;
  const prevMilestone = milestones.filter(m => m <= streakCount).pop() || 0;
  const progressToMilestone = prevMilestone === nextMilestone 
    ? 100 
    : ((streakCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100;

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
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <Card className="relative bg-card border border-border shadow-2xl overflow-hidden">
                {/* Gradient glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/5 via-transparent to-[#0BA5E9]/5 pointer-events-none" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <CardContent className="p-8 text-center relative">
                  {/* Circular Progress with Flame Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
                    className="relative mx-auto mb-6 w-[120px] h-[120px]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgress progress={progressToMilestone} size={120} />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.3, type: "spring", damping: 10 }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0BA5E9] flex items-center justify-center shadow-lg"
                      >
                        <Flame className="h-8 w-8 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Streak Count Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring", damping: 15 }}
                      className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-[#00B4D8] to-[#0BA5E9] rounded-full flex items-center justify-center shadow-lg border-4 border-card"
                    >
                      <span className="text-white font-bold text-lg">{streakCount}</span>
                    </motion.div>
                    
                    {/* Sparkle effects */}
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="h-5 w-5 text-[#00B4D8]" />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="absolute -bottom-2 -left-2"
                    >
                      <Sparkles className="h-4 w-4 text-[#0BA5E9]" />
                    </motion.div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {getMessage()}
                    </h2>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {getMotivation()}
                    </p>

                    {/* Next Milestone */}
                    {nextMilestone !== streakCount && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-medium text-muted-foreground"
                      >
                        <TrendingUp className="h-3 w-3 text-[#00B4D8]" />
                        <span>{nextMilestone - streakCount} days to {nextMilestone}-day milestone</span>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Progress Bar */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-6 space-y-2"
                  >
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>{prevMilestone} days</span>
                      <span>{nextMilestone} days</span>
                    </div>
                    <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] rounded-full"
                      />
                    </div>
                  </motion.div>

                  {/* Stats Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-2 gap-3 mb-6"
                  >
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Flame className="h-4 w-4 text-[#00B4D8]" />
                        <span className="text-2xl font-bold text-foreground">{streakCount}</span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">Day Streak</p>
                    </div>
                    <div className="p-4 bg-muted rounded-xl">
                      <div className="text-2xl font-bold text-foreground mb-1">+10</div>
                      <p className="text-xs font-medium text-muted-foreground">MP Earned</p>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] hover:from-[#0099b8] hover:to-[#0990d0] text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#00B4D8]/20"
                    >
                      Continue Learning
                    </Button>
                  </motion.div>

                  {/* Footer */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-xs text-muted-foreground mt-4"
                  >
                    Keep practicing daily to maintain your streak
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
