import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, Award, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

const Particles = () => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 40 + Math.random() * 20,
    delay: Math.random() * 0.8,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full bg-[#00B4D8]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0.6, 0],
            scale: [0, 1.5, 1, 0],
            y: [-20, -80, -120],
            x: [(Math.random() - 0.5) * 60],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

const ProgressRing = ({ progress, size = 200 }: { progress: number; size?: number }) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <defs>
        <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#0BA5E9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
        </linearGradient>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-border opacity-30"
      />
      
      {/* Progress ring */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ 
          duration: 2.5, 
          ease: [0.16, 1, 0.3, 1],
          delay: 0.5
        }}
        filter="url(#softGlow)"
      />
    </svg>
  );
};

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [showParticles, setShowParticles] = useState(false);

  const playCelebrationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (frequency: number, duration: number, delay: number, gain = 0.15) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(gain, audioContext.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Sophisticated chime sequence
      playTone(523.25, 0.2, 0); // C5
      playTone(659.25, 0.2, 150); // E5
      playTone(783.99, 0.25, 300); // G5
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowParticles(true);
      playCelebrationSound();
      const timer = setTimeout(() => setShowParticles(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getHeadline = () => {
    if (streakCount === 1) {
      return "Welcome Back";
    } else if (streakCount >= 30) {
      return "Outstanding Commitment";
    } else if (streakCount >= 14) {
      return "Remarkable Progress";
    } else if (streakCount >= 7) {
      return "Building Momentum";
    } else {
      return "Consistency Counts";
    }
  };

  const getMessage = () => {
    if (streakCount === 1) {
      return "Every journey begins with showing up. You've taken the first step today.";
    } else if (streakCount >= 30) {
      return `${streakCount} consecutive days of dedication. You're proving that greatness is built through daily commitment.`;
    } else if (streakCount >= 14) {
      return `${streakCount} days strong. Your consistency is creating the foundation for lasting success.`;
    } else if (streakCount >= 7) {
      return `${streakCount} days of focus. You're developing the habits that separate good from great.`;
    } else {
      return `${streakCount} days in a row. Small actions repeated daily create extraordinary results.`;
    }
  };

  // Calculate progress
  const milestones = [7, 14, 30, 60, 90, 180, 365];
  const nextMilestone = milestones.find(m => m > streakCount) || 365;
  const prevMilestone = milestones.filter(m => m <= streakCount).pop() || 0;
  const progress = prevMilestone === nextMilestone 
    ? 100 
    : Math.min(100, ((streakCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ 
              type: "spring", 
              damping: 30, 
              stiffness: 300,
              mass: 0.8
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl"
          >
            {showParticles && <Particles />}
            
            <Card className="relative bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Subtle ambient gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#00B4D8]/5 via-transparent to-transparent pointer-events-none" />
              
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>

              <CardContent className="p-12 text-center relative">
                {/* Streak number - hero element */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-8"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00B4D8]/20 to-[#0BA5E9]/20 blur-3xl" />
                    <h1 className="relative text-8xl font-black tracking-tighter">
                      <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA]">
                        {streakCount}
                      </span>
                    </h1>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-muted-foreground text-sm font-medium tracking-wider uppercase mt-2"
                  >
                    {streakCount === 1 ? 'Day' : 'Days'} Consecutive
                  </motion.p>
                </motion.div>

                {/* Headline */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-3xl font-bold text-foreground mb-4 tracking-tight"
                >
                  {getHeadline()}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto mb-10"
                >
                  {getMessage()}
                </motion.p>

                {/* Progress visualization */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className="flex items-center justify-between text-sm mb-4 px-2">
                    <span className="text-muted-foreground font-medium">{prevMilestone}</span>
                    <span className="text-[#00B4D8] font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Next: {nextMilestone} days
                    </span>
                  </div>
                  
                  <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ 
                        duration: 2, 
                        ease: [0.16, 1, 0.3, 1],
                        delay: 0.6
                      }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] rounded-full"
                    />
                  </div>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-xs text-muted-foreground mt-3 font-medium"
                  >
                    {nextMilestone - streakCount} more {nextMilestone - streakCount === 1 ? 'day' : 'days'} until next milestone
                  </motion.p>
                </motion.div>

                {/* Reward section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="mb-8 py-6 px-8 bg-gradient-to-r from-[#00B4D8]/10 via-[#0BA5E9]/10 to-transparent rounded-2xl border border-[#00B4D8]/20"
                >
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Award className="h-5 w-5 text-[#00B4D8]" />
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00B4D8] to-[#0BA5E9]">
                          +10
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">MP Earned</p>
                    </div>
                    <div className="h-12 w-px bg-border/50" />
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className="h-5 w-5 text-[#00B4D8]" />
                        <span className="text-3xl font-bold text-foreground">{streakCount}</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">Day Streak</p>
                    </div>
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-[#00B4D8] via-[#0BA5E9] to-[#60A5FA] hover:opacity-90 text-white font-semibold py-4 text-base rounded-xl shadow-lg shadow-[#00B4D8]/20 transition-all duration-200"
                  >
                    Continue
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
