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

// Confetti burst animation - explosive burst from center
const ConfettiBurst = () => {
  const confetti = Array.from({ length: 80 }, (_, i) => {
    const angle = (Math.random() * 360) * (Math.PI / 180);
    const velocity = 150 + Math.random() * 250;
    const colors = ['#0BA5E9', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444'];
    
    return {
      id: i,
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity - 100,
      rotation: Math.random() * 720,
      delay: Math.random() * 0.1,
      duration: 1.5 + Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'rounded-sm' : 'rounded-full',
      width: Math.random() > 0.5 ? 'w-3' : 'w-2',
      height: Math.random() > 0.5 ? 'h-3' : 'h-4',
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden flex items-center justify-center">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.width} ${piece.height} ${piece.shape}`}
          style={{
            backgroundColor: piece.color,
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            rotate: 0,
            scale: 1,
          }}
          animate={{
            x: piece.x,
            y: piece.y,
            opacity: [1, 1, 0.8, 0],
            rotate: piece.rotation,
            scale: [1, 1, 0.8],
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

// Extra milestone confetti - falling from top
const MilestoneConfetti = () => {
  const confetti = Array.from({ length: 100 }, (_, i) => {
    const colors = ['#0BA5E9', '#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'];
    
    return {
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 1.5,
      rotation: Math.random() * 720,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() > 0.5 ? 'rounded-sm' : 'rounded-full',
      width: Math.random() > 0.5 ? 'w-3' : 'w-2',
      height: Math.random() > 0.5 ? 'h-3' : 'h-4',
    };
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.width} ${piece.height} ${piece.shape}`}
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            backgroundColor: piece.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0.8, 0],
            rotate: piece.rotation,
            scale: [1, 1, 0.8],
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
  
  // Calculate MP reward: 100 MP for every 7 days
  const calculateMPReward = (days: number) => Math.floor(days / 7) * 100;
  const currentMPReward = calculateMPReward(streakCount);
  const nextMilestoneMPReward = calculateMPReward(nextMilestone);

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
      setTimeout(() => setShowConfetti(false), 2500);
      
      // Show extra confetti for milestones
      if (isMilestone) {
        setShowMilestoneConfetti(true);
        setTimeout(() => setShowMilestoneConfetti(false), 4000);
      }
    } else {
      setShowConfetti(false);
      setShowMilestoneConfetti(false);
    }
  }, [isVisible, isMilestone]);

  const getRewardInfo = () => {
    if (streakCount === 3) {
      return {
        reward: "+100 MP",
        message: "4 days until 24h Premium Boost!",
        emoji: "💎"
      };
    } else if (streakCount === 7) {
      return {
        reward: "24h Premium Boost",
        message: "Enjoy Premium for a day — or keep it free for 7 days!",
        emoji: "⚡"
      };
    } else if (streakCount === 14) {
      return {
        reward: "50% off first month",
        message: "You've proven consistency — get rewarded with Premium discount.",
        emoji: "🎁"
      };
    } else if (streakCount === 30) {
      return {
        reward: "Mentiora Elite Badge",
        message: "Elite users get full access — unlock yours permanently.",
        emoji: "👑"
      };
    } else if (isMilestone) {
      return {
        reward: `+${currentMPReward} MP BONUS!`,
        message: `${streakCount}-Day Milestone Unlocked!`,
        emoji: "🏆"
      };
    } else {
      const messages = [
        "Consistency compounds — every day builds momentum.",
        "Small steps today create massive progress tomorrow.",
        "You're building mastery one focused day at a time.",
        "Discipline beats motivation — and you're showing up.",
      ];
      return {
        reward: "+10 MP earned",
        message: messages[streakCount % messages.length],
        emoji: "💎"
      };
    }
  };

  const rewardInfo = getRewardInfo();

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <ConfettiBurst />}
          {showMilestoneConfetti && <MilestoneConfetti />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={onClose}
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
                  onClick={onClose}
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
                    {rewardInfo.message}
                  </motion.p>

                  {/* Progress to next milestone with smooth animation */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mb-6 bg-gray-50 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-3 px-1">
                      {prevMilestone > 0 && <span className="font-semibold">{prevMilestone} days</span>}
                      <span className="font-bold text-black ml-auto flex items-center gap-1.5">
                        {daysToMilestone} {daysToMilestone === 1 ? 'day' : 'days'} until 
                        <span className="text-lg font-black bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                          {nextMilestoneMPReward} MP
                        </span>
                        <span className="text-base">🏆</span>
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
                    className={`inline-flex items-center gap-3 px-6 py-4 rounded-xl mb-8 relative overflow-hidden ${
                      (isMilestone || [3, 7, 14, 30].includes(streakCount))
                        ? 'bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 shadow-lg' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {(isMilestone || [3, 7, 14, 30].includes(streakCount)) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ['-100%', '200%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    <motion.span 
                      className={(isMilestone || [3, 7, 14, 30].includes(streakCount)) ? 'text-3xl' : 'text-2xl'}
                      animate={{ 
                        rotate: [0, -10, 10, -10, 0],
                        scale: (isMilestone || [3, 7, 14, 30].includes(streakCount)) ? [1, 1.2, 1.2, 1.2, 1] : [1, 1.1, 1.1, 1.1, 1]
                      }}
                      transition={{ 
                        delay: 0.9,
                        duration: 0.6
                      }}
                    >
                      {rewardInfo.emoji}
                    </motion.span>
                    <div className="relative z-10">
                      <span className={`font-black ${(isMilestone || [3, 7, 14, 30].includes(streakCount)) ? 'text-2xl text-white drop-shadow-lg' : 'text-lg text-black'}`}>
                        {rewardInfo.reward}
                      </span>
                    </div>
                  </motion.div>

                  {/* CTA button(s) */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className={streakCount === 7 ? "flex gap-3" : ""}
                  >
                    {streakCount === 7 ? (
                      <>
                        <Button
                          onClick={onClose}
                          className="flex-1 text-white font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                          style={{ backgroundColor: '#0BA5E9' }}
                        >
                          Claim 24h Boost
                        </Button>
                        <Button
                          onClick={onClose}
                          variant="outline"
                          className="flex-1 font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl border-2"
                          style={{ borderColor: '#0BA5E9', color: '#0BA5E9' }}
                        >
                          Claim 7 Day Boost
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={onClose}
                        className="w-full text-white font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl"
                        style={{ backgroundColor: '#0BA5E9' }}
                      >
                        Keep the Momentum
                      </Button>
                    )}
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
