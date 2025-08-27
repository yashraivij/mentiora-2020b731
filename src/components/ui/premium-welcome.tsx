import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Star, Zap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumWelcomeProps {
  isVisible: boolean;
  onClose: () => void;
  userName?: string;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: ['#7C3AED', '#A855F7', '#C084FC', '#DDD6FE', '#F3E8FF'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            backgroundColor: piece.color,
            left: `${piece.left}%`,
            top: '-10px'
          }}
          initial={{ y: -10, rotate: 0, scale: 1, opacity: 1 }}
          animate={{
            y: window.innerHeight + 10,
            rotate: 360,
            scale: [1, 1.2, 0.8, 1],
            opacity: [1, 1, 0.8, 0]
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

export function PremiumWelcome({ isVisible, onClose, userName }: PremiumWelcomeProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Function to play premium welcome sounds
  const playWelcomeSounds = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playSound = (frequency: number, duration: number, delay: number, type: OscillatorType = 'sine') => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Premium welcome sound sequence - ascending and majestic
      playSound(523.25, 0.2, 0); // C5
      playSound(659.25, 0.2, 150); // E5
      playSound(783.99, 0.2, 300); // G5
      playSound(1046.5, 0.3, 450); // C6
      playSound(1318.5, 0.25, 600); // E6

      // Final triumphant chord
      setTimeout(() => {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 1.2);
        });
      }, 900);

    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playWelcomeSounds();
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const firstName = userName ? userName.split(' ')[0] : 'there';

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <Confetti />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.5, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 500, delay: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-violet-50/95 via-purple-50/95 to-indigo-50/95 dark:from-violet-950/90 dark:via-purple-950/90 dark:to-indigo-950/90 shadow-2xl max-w-lg w-full backdrop-blur-xl">
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse" />
                
                {/* Sophisticated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 rounded-xl p-[2px]">
                  <div className="bg-gradient-to-br from-violet-50/95 via-purple-50/95 to-indigo-50/95 dark:from-violet-950/90 dark:via-purple-950/90 dark:to-indigo-950/90 rounded-[10px] h-full w-full backdrop-blur-xl" />
                </div>

                {/* Floating Premium Elements */}
                <div className="absolute top-6 right-8 w-5 h-5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full animate-bounce opacity-70" />
                <div className="absolute bottom-8 left-10 w-4 h-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse opacity-60" />
                <div className="absolute top-12 left-8 w-3 h-3 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-ping opacity-50" />

                <CardContent className="relative p-10 text-center">
                  {/* Premium Crown Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.5 }}
                    className="relative mx-auto mb-8"
                  >
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <Crown className="h-12 w-12 text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Rotating Premium Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-white/30"
                      />
                      
                      {/* Inner Glow */}
                      <div className="absolute inset-1 rounded-2xl bg-gradient-to-br from-violet-400/30 via-purple-400/30 to-indigo-400/30 animate-pulse" />
                    </div>
                    
                    {/* Floating Premium Stars */}
                    <motion.div
                      animate={{ y: [-8, 8, -8], rotate: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Star className="h-4 w-4 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [8, -8, 8], rotate: [360, 180, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                      className="absolute -bottom-3 -left-3 w-7 h-7 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Zap className="h-3.5 w-3.5 text-white drop-shadow-sm" />
                    </motion.div>

                    <motion.div
                      animate={{ y: [-6, 6, -6], rotate: [0, 360] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                      className="absolute top-2 -left-4 w-6 h-6 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Sparkles className="h-3 w-3 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.div>

                  {/* Premium Welcome Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="space-y-6 mb-8"
                  >
                    <h2 className="text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      🎉 Welcome to Premium!
                    </h2>
                    
                    <div className="space-y-3">
                      <p className="text-xl font-bold text-foreground">
                        Hey {firstName}! 👋
                      </p>
                      <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                        You're now part of an exclusive community that has consistently achieved higher grades, faster revision times, and better exam performance. Get ready to transform your study results and unlock your full academic potential!
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-violet-600 dark:text-violet-400 font-medium">
                        <Trophy className="h-4 w-4" />
                        <span>Premium Member Since Today</span>
                        <Trophy className="h-4 w-4" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    <Button
                      onClick={onClose}
                      className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 hover:scale-105 text-white font-bold px-10 py-4 rounded-xl shadow-2xl transition-all duration-300 text-lg"
                    >
                      <Crown className="h-5 w-5 mr-3" />
                      Explore Premium Features
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