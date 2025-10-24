import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    left: 20 + Math.random() * 60, // More centered distribution
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1.5,
    color: ['#00B4D8', '#0BA5E9', '#60A5FA', '#38BDF8', '#7DD3FC', '#BFDBFE'][Math.floor(Math.random() * 6)],
    size: 4 + Math.random() * 6,
    rotation: Math.random() * 360,
    xMovement: (Math.random() - 0.5) * 300,
    initialY: -50 - Math.random() * 50
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.left}%`,
            top: `${piece.initialY}px`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            rotate: piece.rotation
          }}
          initial={{ y: 0, opacity: 0, scale: 0 }}
          animate={{
            y: [0, window.innerHeight * 0.3, window.innerHeight + 100],
            opacity: [0, 1, 1, 0.8, 0],
            scale: [0, 1.2, 1, 0.9, 0.3],
            rotate: [piece.rotation, piece.rotation + 1080],
            x: [0, piece.xMovement * 0.5, piece.xMovement]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{ backgroundColor: piece.color }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const CircularProgress = ({ progress, size = 160 }: { progress: number; size?: number }) => {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle with glow */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B4D8" />
          <stop offset="50%" stopColor="#0BA5E9" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      
      {/* Background track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth="8"
        className="text-muted opacity-20"
      />
      
      {/* Progress arc */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#progressGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
        filter="url(#glow)"
      />
    </svg>
  );
};

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

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
          gainNode.gain.linearRampToValueAtTime(0.18, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Triumphant celebration sound
      playSound(523.25, 0.15, 0); // C5
      playSound(659.25, 0.15, 120); // E5
      playSound(783.99, 0.2, 240); // G5
      playSound(1046.50, 0.25, 380); // C6
    } catch (error) {
      console.log('Audio not supported:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playCelebrationSound();
      
      // Show checkmark after a brief delay
      setTimeout(() => setShowCheckmark(true), 600);
      
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setShowCheckmark(false);
    }
  }, [isVisible]);

  const getMessage = () => {
    if (streakCount === 1) {
      return "You're Back!";
    } else if (streakCount >= 30) {
      return `${streakCount} Day Streak! 🌟`;
    } else if (streakCount >= 7) {
      return `${streakCount} Day Streak!`;
    } else {
      return `${streakCount} Days Strong!`;
    }
  };

  const getMotivation = () => {
    if (streakCount === 1) {
      return "Welcome back! Every journey starts with a single step. Let's build something amazing together.";
    } else if (streakCount >= 30) {
      return "Incredible dedication! You're proving that consistency creates excellence. Keep this momentum going!";
    } else if (streakCount >= 7) {
      return "Outstanding commitment! You're building habits that will transform your results. Keep it up!";
    } else {
      return "Great progress! Daily consistency is the secret to mastery. You're on the right path!";
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
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 30 }}
              transition={{ 
                type: "spring", 
                damping: 25, 
                stiffness: 300,
                mass: 0.8
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg"
            >
              <Card className="relative bg-gradient-to-b from-card via-card to-card/95 border-0 shadow-2xl overflow-hidden">
                {/* Ambient glow effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B4D8]/10 via-transparent to-[#0BA5E9]/10" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#00B4D8]/20 to-transparent blur-3xl" />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-10 p-2.5 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 backdrop-blur-sm"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>

                <CardContent className="p-12 text-center relative">
                  {/* Circular Progress with Flame Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      damping: 12, 
                      stiffness: 150,
                      delay: 0.1 
                    }}
                    className="relative mx-auto mb-10 w-[160px] h-[160px]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CircularProgress progress={progressToMilestone} size={160} />
                    </div>
                    
                    {/* Center icon container */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          type: "spring",
                          damping: 10,
                          delay: 0.4 
                        }}
                        className="relative"
                      >
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] flex items-center justify-center shadow-2xl relative overflow-hidden">
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
                          <Flame className="h-12 w-12 text-white relative z-10 drop-shadow-lg" />
                        </div>
                        
                        {/* Success checkmark overlay */}
                        <AnimatePresence>
                          {showCheckmark && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ type: "spring", damping: 15 }}
                              className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg border-4 border-card"
                            >
                              <CheckCircle2 className="h-5 w-5 text-white" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    
                    {/* Streak count badge */}
                    <motion.div
                      initial={{ scale: 0, y: 10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ 
                        type: "spring",
                        damping: 15,
                        delay: 0.6 
                      }}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                    >
                      <div className="px-6 py-2.5 bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] rounded-full shadow-xl border-4 border-card">
                        <span className="text-white font-bold text-xl tracking-tight">{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</span>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mb-8 mt-6"
                  >
                    <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">
                      {getMessage()}
                    </h2>
                    
                    <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                      {getMotivation()}
                    </p>
                  </motion.div>

                  {/* Progress to Next Milestone */}
                  {nextMilestone !== streakCount && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="flex items-center justify-between text-sm font-medium mb-3 px-2">
                        <span className="text-muted-foreground">{prevMilestone} days</span>
                        <span className="text-[#00B4D8] font-semibold">Next: {nextMilestone} days</span>
                      </div>
                      
                      <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressToMilestone}%` }}
                          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] rounded-full"
                        />
                      </div>
                      
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-sm text-muted-foreground mt-3"
                      >
                        {nextMilestone - streakCount} more {nextMilestone - streakCount === 1 ? 'day' : 'days'} to milestone
                      </motion.p>
                    </motion.div>
                  )}

                  {/* Reward Highlight */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                    className="relative bg-gradient-to-br from-[#00B4D8]/15 via-[#0BA5E9]/10 to-[#60A5FA]/15 rounded-2xl p-8 mb-8 overflow-hidden border border-[#00B4D8]/20"
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      animate={{ 
                        x: ["-100%", "200%"]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 2
                      }}
                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                    />
                    
                    <div className="relative">
                      <div className="text-6xl font-black mb-2">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA]">
                          +10 MP
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-muted-foreground">
                        Daily login reward earned
                      </p>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] hover:from-[#0099b8] hover:via-[#0990d0] hover:to-[#4a9fdb] text-white font-bold py-4 text-lg rounded-xl shadow-lg shadow-[#00B4D8]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#00B4D8]/50 hover:-translate-y-0.5"
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
