import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}

// Sparkle particles
const SparkleParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: 10 + Math.random() * 80,
    y: 10 + Math.random() * 80,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Milestone confetti
const MilestoneConfetti = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            background: `linear-gradient(135deg, #4A6CFF, #7CA8FF)`,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: piece.rotation * 3,
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const milestones = [7, 14, 30, 60, 100, 180, 365];
  const isMilestone = milestones.includes(streakCount);
  const nextMilestone = milestones.find(m => m > streakCount) || 365;
  const prevMilestone = milestones.filter(m => m <= streakCount).pop() || 0;
  const daysToMilestone = nextMilestone - streakCount;
  const progress = prevMilestone === nextMilestone 
    ? 100 
    : Math.min(100, ((streakCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100);

  const playCelebrationSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTone = (frequency: number, duration: number, delay: number) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      playTone(523.25, 0.2, 0);
      playTone(659.25, 0.2, 120);
      playTone(783.99, 0.25, 240);
      if (isMilestone) {
        playTone(1046.50, 0.3, 380);
      }
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  useEffect(() => {
    if (isVisible) {
      playCelebrationSound();
      
      if (isMilestone) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // Auto-minimize after 4 seconds
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(false);
    }
  }, [isVisible, isMilestone]);

  const getMotivationalMessage = () => {
    const messages = [
      "You're unstoppable — consistency builds greatness.",
      "Every day you show up, your future self thanks you.",
      "Momentum is yours — keep the streak alive.",
      "Your dedication is inspiring. This is real progress.",
      "Small steps daily create extraordinary results.",
    ];
    
    // Use streak count to rotate through messages
    return messages[streakCount % messages.length];
  };

  const handleMinimizedClick = () => {
    setIsMinimized(false);
  };

  const handleFullClose = () => {
    setIsMinimized(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && isMilestone && <MilestoneConfetti />}
          
          {/* Minimized badge in top bar */}
          {isMinimized ? (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-4 right-4 z-50 cursor-pointer"
              onClick={handleMinimizedClick}
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A6CFF] to-[#7CA8FF] rounded-full shadow-lg hover:shadow-xl transition-shadow">
                <span className="text-xl">🔥</span>
                <span className="text-white font-bold text-sm">{streakCount}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={handleFullClose}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 60, opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg"
              >
                <Card className="relative overflow-hidden border-0 shadow-2xl">
                  {/* Glowing gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A6CFF] via-[#6B8EFF] to-[#7CA8FF]" />
                  
                  {/* Subtle sparkle particles */}
                  <SparkleParticles />
                  
                  {/* Close button */}
                  <button
                    onClick={handleFullClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>

                  <CardContent className="relative p-10 text-center">
                    {/* Flame icon with glow */}
                    <motion.div
                      animate={{
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mb-6"
                    >
                      <div className="inline-block relative">
                        <div className="absolute inset-0 bg-white/30 blur-xl rounded-full" />
                        <span className="text-7xl relative z-10">🔥</span>
                      </div>
                    </motion.div>

                    {/* Streak count */}
                    <motion.h1
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-6xl font-black text-white mb-2 tracking-tight"
                    >
                      {streakCount}-Day Streak!
                    </motion.h1>

                    {/* Motivational message */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-white/90 text-lg font-medium mb-8 max-w-md mx-auto leading-relaxed"
                    >
                      {getMotivationalMessage()}
                    </motion.p>

                    {/* Progress to next milestone */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mb-6"
                    >
                      <div className="flex justify-between items-center text-sm text-white/70 mb-2 px-1">
                        <span>{prevMilestone} days</span>
                        <span className="font-semibold text-white">{daysToMilestone} days until {nextMilestone}-Day Achievement</span>
                      </div>
                      
                      <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ 
                            duration: 1.5, 
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.7
                          }}
                          className="absolute inset-y-0 left-0 bg-white rounded-full shadow-lg"
                        />
                      </div>
                    </motion.div>

                    {/* Reward capsule */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.6,
                        type: "spring",
                        damping: 12,
                        stiffness: 200
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md rounded-full mb-8 border border-white/30"
                    >
                      <span className="text-2xl">💎</span>
                      <span className="text-white font-bold text-lg">+10 MP earned</span>
                    </motion.div>

                    {/* CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Button
                        onClick={handleFullClose}
                        className="w-full bg-white hover:bg-white/90 text-[#4A6CFF] font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        Keep the Momentum
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
