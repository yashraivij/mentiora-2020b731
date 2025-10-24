import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: 0,
    duration: 2.5 + Math.random() * 1.5,
    color: ['#00B4D8', '#0BA5E9', '#60A5FA', '#38BDF8', '#7DD3FC', '#93C5FD'][Math.floor(Math.random() * 6)],
    size: 3 + Math.random() * 4,
    rotation: Math.random() * 360,
    xMovement: (Math.random() - 0.5) * 200
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            top: '-30px',
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            rotate: piece.rotation
          }}
          initial={{ y: -30, opacity: 1, scale: 1, x: 0 }}
          animate={{
            y: [0, window.innerHeight + 100],
            opacity: [0, 1, 1, 0.8, 0],
            scale: [0.5, 1, 1, 0.8, 0.3],
            rotate: [piece.rotation, piece.rotation + 720],
            x: [0, piece.xMovement, piece.xMovement * 1.5]
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
      // Immediate confetti on open
      setShowConfetti(true);
      playCelebrationSound();
      
      // Animate progress bar
      setTimeout(() => {
        setProgressValue(100);
      }, 400);
      
      const timer = setTimeout(() => setShowConfetti(false), 5000);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg"
            >
              <Card className="relative bg-card border-2 border-[#00B4D8]/20 shadow-2xl overflow-hidden">
                {/* Premium gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/[0.03] via-transparent to-[#0BA5E9]/[0.03]" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 z-10 p-2 rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <CardContent className="p-10 text-center relative">
                  {/* Circular Progress with Flame */}
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                    className="relative mx-auto mb-8 w-[140px] h-[140px]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgress progress={progressToMilestone} size={140} />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", damping: 12 }}
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00B4D8] to-[#0BA5E9] flex items-center justify-center shadow-xl"
                      >
                        <Flame className="h-10 w-10 text-white" />
                      </motion.div>
                    </div>
                    
                    {/* Streak Count Badge */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", damping: 15 }}
                      className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] rounded-full shadow-lg"
                    >
                      <span className="text-white font-bold text-xl">{streakCount} Days</span>
                    </motion.div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8 mt-4"
                  >
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                      {getMessage()}
                    </h2>
                    
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                      {getMotivation()}
                    </p>
                  </motion.div>

                  {/* Progress Bar to Next Milestone */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8 space-y-3"
                  >
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-muted-foreground">{prevMilestone} days</span>
                      <span className="text-[#00B4D8] font-semibold">Next: {nextMilestone} days</span>
                    </div>
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ duration: 1.8, ease: "easeOut", delay: 0.6 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] rounded-full shadow-sm"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium text-muted-foreground">
                        {nextMilestone - streakCount} more {nextMilestone - streakCount === 1 ? 'day' : 'days'} to reach milestone
                      </span>
                    </div>
                  </motion.div>

                  {/* Reward Display */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-[#00B4D8]/10 to-[#0BA5E9]/10 rounded-2xl p-6 mb-8 border border-[#00B4D8]/20"
                  >
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] mb-2">
                      +10 MP
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Daily login reward earned
                    </p>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9] hover:from-[#0099b8] hover:to-[#0990d0] text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-[#00B4D8]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#00B4D8]/40"
                    >
                      Continue Your Journey
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
