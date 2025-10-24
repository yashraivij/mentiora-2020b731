import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DailyStreakNotificationProps {
  isVisible: boolean;
  onClose: () => void;
  streakCount: number;
}


export function DailyStreakNotification({ isVisible, onClose, streakCount }: DailyStreakNotificationProps) {
  const [isMinimized, setIsMinimized] = useState(false);

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
      
      // Auto-minimize after 4 seconds
      const timer = setTimeout(() => {
        setIsMinimized(true);
      }, 4000);
      
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(false);
    }
  }, [isVisible]);

  const getMotivationalMessage = () => {
    const messages = [
      "Every day you show up, you're getting closer to mastery.",
      "Progress compounds. Keep showing up.",
      "Another day closer to your best results.",
      "You're on fire — consistency is everything.",
      "Your dedication is building something real.",
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
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-white border border-gray-200">
                <Flame className="h-5 w-5 text-orange-500" />
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
                initial={{ y: 40, opacity: 0 }}
                animate={{ 
                  y: 0, 
                  opacity: 1,
                }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-lg"
              >
                {/* Mentiora-style card - clean white with 24px radius */}
                <Card className="relative overflow-hidden bg-white border border-gray-100"
                  style={{ 
                    borderRadius: '24px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)'
                  }}
                >
                  {/* Close button */}
                  <button
                    onClick={handleFullClose}
                    className="absolute top-5 right-5 z-10 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>

                  <CardContent className="relative p-12 text-center">
                    {/* Clean vector flame icon */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                      }}
                      transition={{
                        type: "spring",
                        damping: 20,
                        stiffness: 200,
                        delay: 0.1
                      }}
                      className="mb-6 inline-flex items-center justify-center"
                    >
                      <div className="relative">
                        {/* Subtle glow effect */}
                        <div 
                          className="absolute inset-0 blur-3xl rounded-full opacity-30"
                          style={{ 
                            background: 'linear-gradient(135deg, #4A6CFF, #A5BFFF)',
                            transform: 'scale(1.5)'
                          }}
                        />
                        <div 
                          className="relative p-6 rounded-full"
                          style={{ 
                            background: 'linear-gradient(135deg, #4A6CFF15, #A5BFFF15)',
                          }}
                        >
                          <Flame className="h-20 w-20 text-orange-500" strokeWidth={2} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Gradient streak headline */}
                    <motion.h1
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-6xl font-black mb-3 tracking-tight"
                      style={{
                        background: 'linear-gradient(135deg, #4A6CFF, #A5BFFF)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {streakCount}-Day Streak!
                    </motion.h1>

                    {/* Motivational subheading */}
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-gray-600 text-lg font-medium mb-10 max-w-md mx-auto leading-relaxed"
                    >
                      {getMotivationalMessage()}
                    </motion.p>

                    {/* Progress bar section */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-3">
                        <span>{prevMilestone} days</span>
                        <span className="text-gray-800">
                          {daysToMilestone} days until next milestone
                        </span>
                      </div>
                      
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ 
                            duration: 1.2, 
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.6
                          }}
                          className="absolute inset-y-0 left-0 rounded-full"
                          style={{ 
                            background: 'linear-gradient(90deg, #4A6CFF, #A5BFFF)',
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Clean stat card */}
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.5,
                        duration: 0.5
                      }}
                      className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-4"
                    >
                      {/* MP Earned */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white">
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                          </div>
                          <span className="font-bold text-black text-lg">+10 MP Earned</span>
                        </div>
                      </div>

                      {/* Current Streak */}
                      <div className="flex items-center justify-between py-3 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                          <Flame className="h-5 w-5 text-orange-500" />
                          <span className="font-medium text-gray-700">Current Streak</span>
                        </div>
                        <span className="font-bold text-black">{streakCount} Days</span>
                      </div>

                      {/* Next Reward */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-500">Next Reward</span>
                        <span className="text-sm font-bold text-gray-800">{nextRewardMP} MP</span>
                      </div>
                    </motion.div>

                    {/* Mentiora blue CTA button */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Button
                        onClick={handleFullClose}
                        className="w-full text-white font-bold py-4 text-lg rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:opacity-90"
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
