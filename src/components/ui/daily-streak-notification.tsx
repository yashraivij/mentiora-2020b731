import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, ArrowRight, Flame, Sparkles } from 'lucide-react';
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


export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [startCountUp, setStartCountUp] = useState(false);
  const displayCount = useCountUp(startCountUp ? streakCount : 0, 800);

  const milestones = [7, 14, 30, 60, 100, 180, 365];
  const isMilestone = milestones.includes(streakCount);
  const nextMilestone = milestones.find(m => m > streakCount) || 365;
  const prevMilestone = milestones.filter(m => m <= streakCount).pop() || 0;
  const daysToMilestone = nextMilestone - streakCount;
  const progress = prevMilestone === nextMilestone 
    ? 100 
    : Math.min(100, ((streakCount - prevMilestone) / (nextMilestone - prevMilestone)) * 100);
  
  // Calculate next reward
  const nextRewardMP = nextMilestone === 7 ? 15 : nextMilestone === 14 ? 25 : nextMilestone === 30 ? 50 : 100;

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
      
      // Start count-up animation after a brief delay
      setTimeout(() => setStartCountUp(true), 300);
      
      // Auto-minimize after 4 seconds
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 4000);
      
      return () => {
        clearTimeout(timer);
        setStartCountUp(false);
      };
    } else {
      setIsMinimized(false);
      setStartCountUp(false);
    }
  }, [isVisible]);

  const getMotivationalMessage = () => {
    const messages = [
      "Consistency compounds. You're building momentum.",
      "Each day you show up, your future self thanks you.",
      "You're proving what's possible — keep going.",
      "Every login brings you closer to mastery.",
      "Your dedication is turning into real progress.",
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
          {/* Minimized badge in top bar */}
          {isMinimized ? (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-4 right-4 z-50 cursor-pointer group"
              onClick={handleMinimizedClick}
            >
              <div 
                className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-white border border-gray-200 relative overflow-hidden"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Flame className="h-5 w-5 text-orange-500" />
                </motion.div>
                <span className="font-bold text-sm text-black">{streakCount}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
              onClick={handleFullClose}
            >
              <motion.div
                initial={{ y: 60, opacity: 0, scale: 0.95 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                  scale: 1
                }}
                exit={{ y: 40, opacity: 0, scale: 0.98 }}
                transition={{ 
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  duration: 0.6
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg"
              >
                {/* Premium floating card with gradient background */}
                <Card 
                  className="relative overflow-hidden border-0"
                  style={{ 
                    borderRadius: '24px',
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #E9F0FF 100%)',
                    boxShadow: '0 20px 60px rgba(74, 108, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={handleFullClose}
                    className="absolute top-5 right-5 z-10 p-2 rounded-lg hover:bg-white/50 backdrop-blur-sm transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>

                  <CardContent className="relative p-12 text-center">
                    {/* Decorative glow effect */}
                    <div 
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 opacity-20 blur-3xl pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle, #4A6CFF 0%, transparent 70%)',
                      }}
                    />
                    {/* Premium pulsing flame icon */}
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{
                        type: "spring",
                        damping: 15,
                        stiffness: 200,
                        delay: 0.1
                      }}
                      className="mb-8 inline-flex items-center justify-center relative"
                    >
                      {/* Glowing halo */}
                      <motion.div 
                        className="absolute inset-0 rounded-full opacity-40 blur-2xl"
                        style={{ 
                          background: 'radial-gradient(circle, #FF6B35 0%, #FFA500 50%, transparent 70%)',
                        }}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      {/* Flame icon with pulse */}
                      <motion.div 
                        className="relative p-8 rounded-full"
                        style={{ 
                          background: 'linear-gradient(135deg, rgba(74, 108, 255, 0.1), rgba(165, 191, 255, 0.1))',
                          backdropFilter: 'blur(10px)',
                        }}
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Flame 
                          className="h-24 w-24 relative z-10" 
                          strokeWidth={1.5}
                          style={{
                            filter: 'drop-shadow(0 4px 12px rgba(255, 107, 53, 0.4))'
                          }}
                          fill="url(#flameGradient)"
                          stroke="url(#flameGradient)"
                        />
                        <svg width="0" height="0">
                          <defs>
                            <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#FF6B35" />
                              <stop offset="50%" stopColor="#FFA500" />
                              <stop offset="100%" stopColor="#FFD700" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    </motion.div>

                    {/* Glowing gradient headline with count-up */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.5 }}
                      className="mb-4 relative"
                    >
                      <h1
                        className="text-7xl font-black tracking-tight relative inline-block"
                        style={{
                          background: 'linear-gradient(135deg, #4A6CFF 0%, #1E3AFF 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          filter: 'drop-shadow(0 4px 20px rgba(74, 108, 255, 0.3))',
                        }}
                      >
                        🔥 {displayCount}-Day Streak!
                      </h1>
                    </motion.div>

                    {/* Motivational subheading */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.5 }}
                      className="text-gray-700 text-xl font-medium mb-10 max-w-md mx-auto leading-relaxed"
                    >
                      {getMotivationalMessage()}
                    </motion.p>

                    {/* Animated glowing progress bar */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45, duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="flex justify-between items-center text-sm font-semibold text-gray-600 mb-3">
                        <span>{prevMilestone} days</span>
                        <span className="text-gray-800">
                          {daysToMilestone} days until next milestone
                        </span>
                      </div>
                      
                      <div 
                        className="relative h-3 rounded-full overflow-hidden"
                        style={{
                          background: 'linear-gradient(90deg, rgba(74, 108, 255, 0.1) 0%, rgba(165, 191, 255, 0.1) 100%)',
                        }}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ 
                            duration: 1.5, 
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.7
                          }}
                          className="absolute inset-y-0 left-0 rounded-full relative"
                          style={{ 
                            background: 'linear-gradient(90deg, #4A6CFF 0%, #1E3AFF 100%)',
                            boxShadow: '0 0 20px rgba(74, 108, 255, 0.5)',
                          }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
                            }}
                            animate={{
                              x: ['-100%', '200%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              delay: 1
                            }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Glassmorphism stat card */}
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ 
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                        delay: 0.55
                      }}
                      className="rounded-2xl p-6 mb-8 space-y-4 relative backdrop-blur-xl border"
                      style={{
                        background: 'rgba(255, 255, 255, 0.4)',
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 8px 32px rgba(74, 108, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {/* MP Earned with sparkle animation */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            className="p-2 rounded-lg relative"
                            style={{
                              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 193, 7, 0.2))',
                            }}
                            animate={{
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: 1
                            }}
                          >
                            <Sparkles className="h-5 w-5 text-yellow-600" />
                            {/* Sparkle burst */}
                            <motion.div
                              className="absolute inset-0 rounded-lg"
                              style={{
                                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                              }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 0, 0.5],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeOut",
                                delay: 1.2
                              }}
                            />
                          </motion.div>
                          <span className="font-bold text-black text-lg">+10 MP Earned</span>
                        </div>
                      </div>

                      {/* Current Streak */}
                      <div className="flex items-center justify-between py-3 border-t border-white/40">
                        <div className="flex items-center gap-3">
                          <Flame className="h-5 w-5 text-orange-500" />
                          <span className="font-medium text-gray-700">Current Streak</span>
                        </div>
                        <span className="font-bold text-black">{streakCount} Days</span>
                      </div>

                      {/* Next Reward */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/40">
                        <span className="text-sm font-medium text-gray-600">Next Reward</span>
                        <span 
                          className="text-sm font-bold"
                          style={{
                            background: 'linear-gradient(135deg, #4A6CFF, #1E3AFF)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                          }}
                        >
                          {nextRewardMP} MP
                        </span>
                      </div>
                    </motion.div>

                    {/* Premium gradient CTA button with glow and ripple */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65, duration: 0.5 }}
                    >
                      <motion.button
                        onClick={handleFullClose}
                        className="w-full text-white font-bold py-5 text-lg rounded-xl flex items-center justify-center gap-2 relative overflow-hidden group"
                        style={{ 
                          background: 'linear-gradient(135deg, #4A6CFF 0%, #1E3AFF 100%)',
                          boxShadow: '0 8px 24px rgba(74, 108, 255, 0.4)',
                        }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: '0 12px 32px rgba(74, 108, 255, 0.5)',
                        }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Hover ripple effect */}
                        <motion.div
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)',
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 2, opacity: [0, 1, 0] }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10">Keep the Momentum</span>
                        <ArrowRight className="h-5 w-5 relative z-10" />
                      </motion.button>
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
