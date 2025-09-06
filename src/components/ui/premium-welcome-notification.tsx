import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Star, Sparkles, X, Trophy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumWelcomeNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

const PremiumConfetti = () => {
  const confettiPieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
    color: ['#FFD700', '#FFA500', '#FF6B35', '#F7931E', '#FFE135'][Math.floor(Math.random() * 5)]
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
            rotate: 720,
            scale: [1, 1.5, 0.8, 1],
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

export function PremiumWelcomeNotification({ isVisible, onClose }: PremiumWelcomeNotificationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const playPremiumSound = () => {
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
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Premium success sound sequence - ascending notes
      playSound(523.25, 0.2, 0); // C5
      playSound(659.25, 0.2, 150); // E5
      playSound(783.99, 0.2, 300); // G5
      playSound(1046.50, 0.3, 450); // C6

    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playPremiumSound();
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <PremiumConfetti />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.3, y: 100, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.3, y: 100, opacity: 0, rotate: 10 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 shadow-2xl max-w-lg w-full">
                {/* Premium Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-yellow-400/20 to-orange-400/20 animate-pulse" />
                
                {/* Luxury Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-xl p-[3px]">
                  <div className="bg-gradient-to-br from-amber-50 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/30 dark:via-yellow-950/20 dark:to-orange-950/20 rounded-[9px] h-full w-full" />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/30 hover:bg-white/40 dark:bg-black/30 dark:hover:bg-black/40 transition-colors shadow-lg"
                >
                  <X className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                </button>

                {/* Floating Premium Elements */}
                <div className="absolute top-6 right-16 w-4 h-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full animate-bounce opacity-80" />
                <div className="absolute bottom-8 left-6 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse opacity-60" />
                <div className="absolute top-12 left-8 w-2 h-2 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-bounce opacity-70" style={{ animationDelay: '0.5s' }} />

                <CardContent className="relative p-8 text-center">
                  {/* Premium Crown Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.3 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 flex items-center justify-center shadow-2xl shadow-amber-500/40 relative overflow-hidden">
                      <div className="absolute inset-3 rounded-full bg-white/30 backdrop-blur-sm" />
                      <Crown className="h-12 w-12 text-white relative z-10 drop-shadow-2xl" />
                      
                      {/* Rotating Premium Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-4 border-amber-300/40"
                      />
                      
                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/20 to-white/40" />
                    </div>
                    
                    {/* Floating Premium Icons */}
                    <motion.div
                      animate={{ y: [-8, 8, -8], rotate: [0, 360, 720] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Star className="h-4 w-4 text-white drop-shadow-lg" fill="currentColor" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [8, -8, 8], rotate: [720, 360, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
                      className="absolute -bottom-3 -left-3 w-7 h-7 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-full flex items-center justify-center shadow-xl"
                    >
                      <Trophy className="h-3.5 w-3.5 text-white drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute top-2 -left-4 w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Zap className="h-3 w-3 text-white drop-shadow-sm" fill="currentColor" />
                    </motion.div>
                  </motion.div>

                  {/* Welcome Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-5 mb-8"
                  >
                    <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-400 dark:to-orange-400 bg-clip-text text-transparent">
                      🎉 Welcome to Premium!
                    </h1>
                    
                    <div className="space-y-3">
                      <p className="text-xl font-bold text-foreground">
                        You've Unlocked Excellence
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Boost your results with exclusive predicted 2026 questions, real-time grade insights, and a revision notebook that simplifies your study.
                      </p>
                    </div>

                    {/* Premium Features Showcase */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                      className="grid grid-cols-2 gap-3 mt-6"
                    >
                      <div className="p-4 bg-gradient-to-br from-amber-100/80 to-yellow-100/80 dark:from-amber-950/40 dark:to-yellow-950/40 rounded-xl border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-2">
                          <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" fill="currentColor" />
                        </div>
                        <h3 className="text-sm font-bold bg-gradient-to-r from-amber-700 to-yellow-700 dark:from-amber-300 dark:to-yellow-300 bg-clip-text text-transparent">
                          2026 Predictions
                        </h3>
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                          Exclusive questions
                        </p>
                      </div>

                      <div className="p-4 bg-gradient-to-br from-yellow-100/80 to-orange-100/80 dark:from-yellow-950/40 dark:to-orange-950/40 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30 backdrop-blur-sm">
                        <div className="flex items-center justify-center mb-2">
                          <Trophy className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="text-sm font-bold bg-gradient-to-r from-yellow-700 to-orange-700 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
                          Grade Insights
                        </h3>
                        <p className="text-xs text-yellow-600/80 dark:text-yellow-400/80">
                          Real-time tracking
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <Button
                      onClick={onClose}
                      className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-600 hover:via-yellow-600 hover:to-orange-600 text-white font-bold px-8 py-4 rounded-xl shadow-2xl shadow-amber-500/40 hover:shadow-amber-500/60 transition-all duration-300 hover:scale-105"
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Start Your Premium Journey
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