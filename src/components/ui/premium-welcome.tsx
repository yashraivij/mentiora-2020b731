import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Sparkles, Star, Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface PremiumWelcomeProps {
  isVisible: boolean;
  onClose: () => void;
}

const Confetti = ({ colors }: { colors: string[] }) => {
  const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 2,
    color: colors[Math.floor(Math.random() * colors.length)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full"
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

const premiumTheme = {
  colors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520'], // Gold colors
  gradientFrom: 'from-yellow-400',
  gradientVia: 'via-amber-500',
  gradientTo: 'to-orange-500',
  bgGradient: 'from-yellow-50/90 to-amber-50/90 dark:from-yellow-950/30 dark:to-amber-950/30',
  borderGradient: 'from-yellow-400 via-amber-400 to-orange-400',
  glowEffect: 'from-yellow-500/30 via-amber-500/30 to-orange-500/30',
  textGradient: 'from-yellow-600 via-amber-600 to-orange-600 dark:from-yellow-400 dark:via-amber-400 dark:to-orange-400',
  confettiColors: ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#FFFF00']
};

export function PremiumWelcome({ isVisible, onClose }: PremiumWelcomeProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  // Function to play premium celebration sounds
  const playPremiumSounds = () => {
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
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Play premium celebration sound sequence - triumphant melody
      playSound(440, 0.2, 0); // A4
      playSound(554.37, 0.2, 150); // C#5
      playSound(659.25, 0.2, 300); // E5
      playSound(880, 0.3, 450); // A5
      
      playSound(1108.73, 0.15, 600, 'square'); // C#6
      playSound(1318.51, 0.15, 750, 'square'); // E6
      playSound(1760, 0.2, 900, 'triangle'); // A6

      // Final chord
      setTimeout(() => {
        [440, 554.37, 659.25, 880].forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
          
          oscillator.start(audioContext.currentTime + index * 0.02);
          oscillator.stop(audioContext.currentTime + 1.2);
        });
      }, 1100);

    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playPremiumSounds();
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <Confetti colors={premiumTheme.confettiColors} />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
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
              <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${premiumTheme.bgGradient} shadow-2xl max-w-md w-full`}>
                {/* Premium Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${premiumTheme.glowEffect} animate-pulse`} />
                
                {/* Sophisticated Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${premiumTheme.borderGradient} rounded-xl p-[2px]`}>
                  <div className={`bg-gradient-to-br ${premiumTheme.bgGradient} rounded-[10px] h-full w-full`} />
                </div>

                {/* Floating Elements */}
                <div className={`absolute top-4 right-6 w-4 h-4 bg-gradient-to-r ${premiumTheme.gradientFrom} ${premiumTheme.gradientTo} rounded-full animate-bounce opacity-80`} />
                <div className={`absolute bottom-6 left-8 w-3 h-3 bg-gradient-to-r ${premiumTheme.gradientVia} ${premiumTheme.gradientTo} rounded-full animate-pulse opacity-60`} />
                <div className={`absolute top-8 left-6 w-2 h-2 bg-gradient-to-r ${premiumTheme.gradientTo} rounded-full animate-ping opacity-70`} />

                <CardContent className="relative p-8 text-center">
                  {/* Crown Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.5 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${premiumTheme.gradientFrom} ${premiumTheme.gradientVia} ${premiumTheme.gradientTo} flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <Crown className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Rotating Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-white/30"
                      />
                    </div>
                    
                    {/* Floating Stars */}
                    <motion.div
                      animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${premiumTheme.gradientFrom} ${premiumTheme.gradientVia} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <Star className="h-3 w-3 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className={`absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br ${premiumTheme.gradientVia} ${premiumTheme.gradientTo} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <Sparkles className="h-2.5 w-2.5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.div>

                  {/* Celebration Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="space-y-4 mb-6"
                  >
                    <h2 className={`text-3xl font-black bg-gradient-to-r ${premiumTheme.textGradient} bg-clip-text text-transparent`}>
                      🎉 Welcome to Premium!
                    </h2>
                    
                    <div className="space-y-3">
                      <p className="text-lg font-bold text-foreground">
                        You're now a Premium member!
                      </p>
                      <p className="text-muted-foreground">
                        Unlock personalized AI insights, unlimited predicted exams, and advanced analytics to maximize your exam success!
                      </p>
                      
                      {/* Premium Features */}
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          <span>Unlimited Predicted 2026 Exams</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span>Advanced Performance Analytics</span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <span>AI-Powered Study Insights</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <Button
                      onClick={onClose}
                      className={`bg-gradient-to-r ${premiumTheme.gradientFrom} ${premiumTheme.gradientVia} ${premiumTheme.gradientTo} hover:scale-105 text-white font-bold px-8 py-3 rounded-xl shadow-2xl transition-all duration-300`}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Start Learning Premium
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