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

// Count-up animation hook
const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
};

// Confetti burst animation
const ConfettiBurst = () => {
  const confetti = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 40,
    y: 50,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.2,
    duration: 1.2 + Math.random() * 0.8,
    xOffset: (Math.random() - 0.5) * 200,
    yOffset: -100 - Math.random() * 100,
    colors: ['#0BA5E9', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6'],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            backgroundColor: piece.colors[Math.floor(Math.random() * piece.colors.length)],
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: piece.xOffset,
            y: piece.yOffset,
            opacity: [1, 1, 0],
            rotate: piece.rotation * 2,
            scale: [1, 1.2, 0.8],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
};

// Extra milestone confetti for achievements
const MilestoneConfetti = () => {
  const confetti = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 100,
    delay: Math.random() * 0.5,
    duration: 2.5 + Math.random() * 1.5,
    rotation: Math.random() * 360,
    colors: ['#0BA5E9', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444'],
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.colors[Math.floor(Math.random() * piece.colors.length)],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: piece.rotation * 3,
            scale: [1, 1.2, 0.8],
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
  const [showMilestoneConfetti, setShowMilestoneConfetti] = useState(false);
  const animatedCount = useCountUp(streakCount, 800);

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
      
      // Always show confetti burst on open
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Show extra confetti for milestones
      if (isMilestone) {
        setShowMilestoneConfetti(true);
        setTimeout(() => setShowMilestoneConfetti(false), 4000);
      }
      
      // Auto-minimize after 4 seconds
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(false);
      setShowConfetti(false);
      setShowMilestoneConfetti(false);
    }
  }, [isVisible, isMilestone]);

  const getMotivationalMessage = () => {
    const messages = [
      "Consistency compounds. You're building momentum.",
      "Each day you show up, your future self thanks you.",
      "You're proving what's possible — keep going.",
      "Progress is built one day at a time.",
      "Every streak is a step toward mastery.",
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
          {showConfetti && <ConfettiBurst />}
          {showMilestoneConfetti && <MilestoneConfetti />}
          
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
              <div className="flex items-center gap-2 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#0BA5E9' }}
              >
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
                {/* Medly-style card - clean white with soft shadow */}
                <Card className="relative overflow-hidden bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-gray-100">
                  {/* Close button */}
                  <button
                    onClick={handleFullClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>

                  <CardContent className="relative p-10 text-center">
                    {/* Flame icon with subtle glow and flicker animation */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.1
                      }}
                      className="mb-6"
                    >
                      <div className="inline-block relative">
                        <div className="absolute inset-0 blur-2xl rounded-full opacity-20"
                          style={{ backgroundColor: '#0BA5E9' }}
                        />
                        <motion.span 
                          className="text-8xl relative z-10"
                          animate={{
                            scale: [1, 1.05, 0.98, 1.03, 1],
                          }}
                          transition={{
                            duration: 0.8,
                            times: [0, 0.2, 0.4, 0.7, 1],
                            delay: 0.1
                          }}
                        >
                          🔥
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Streak count with count-up animation */}
                    <motion.h1
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5, type: "spring", damping: 20 }}
                      className="text-6xl font-black text-black mb-3 tracking-tight"
                    >
                      {animatedCount}-Day Streak!
                    </motion.h1>

                    {/* Motivational message */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-gray-600 text-lg font-medium mb-8 max-w-md mx-auto leading-relaxed"
                    >
                      {getMotivationalMessage()}
                    </motion.p>

                    {/* Progress to next milestone with smooth animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mb-6 bg-gray-50 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-3 px-1">
                        <span className="font-semibold">{prevMilestone} days</span>
                        <span className="font-semibold text-black">
                          {daysToMilestone} days until {nextMilestone}
                        </span>
                      </div>
                      
                      <div className="relative h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ 
                            duration: 1.5, 
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.7
                          }}
                          className="absolute inset-y-0 left-0 rounded-full shadow-sm"
                          style={{ backgroundColor: '#0BA5E9' }}
                        />
                      </div>
                    </motion.div>

                    {/* Reward capsule with bounce animation */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.6,
                        type: "spring",
                        damping: 12,
                        stiffness: 200
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 rounded-xl mb-8 border border-gray-200"
                    >
                      <motion.span 
                        className="text-2xl"
                        animate={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: [1, 1.1, 1.1, 1.1, 1]
                        }}
                        transition={{ 
                          delay: 0.9,
                          duration: 0.6
                        }}
                      >
                        💎
                      </motion.span>
                      <span className="font-bold text-lg text-black">+10 MP earned</span>
                    </motion.div>

                    {/* CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Button
                        onClick={handleFullClose}
                        className="w-full text-white font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-2"
                        style={{ backgroundColor: '#0BA5E9' }}
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
