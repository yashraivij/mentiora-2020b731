import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Star, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GradeCelebrationProps {
  isVisible: boolean;
  onClose: () => void;
  grade: string;
  subject: string;
  previousGrade?: string;
}

const Confetti = ({ colors }: { colors: string[] }) => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
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

const getGradeTheme = (grade: string) => {
  const gradeNum = parseInt(grade);
  
  if (gradeNum >= 7 || grade === '7' || grade === '8' || grade === '9') {
    return {
      type: 'excellent',
      colors: ['#10B981', '#059669', '#047857', '#065F46'], // Emerald greens
      gradientFrom: 'from-emerald-500',
      gradientVia: 'via-green-500',
      gradientTo: 'to-teal-500',
      bgGradient: 'from-emerald-50/80 to-green-50/80 dark:from-emerald-950/20 dark:to-green-950/20',
      borderGradient: 'from-emerald-400 via-green-400 to-teal-400',
      glowEffect: 'from-emerald-500/20 via-green-500/20 to-teal-500/20',
      textGradient: 'from-emerald-600 via-green-600 to-teal-600 dark:from-emerald-400 dark:via-green-400 dark:to-teal-400',
      icon: Trophy,
      title: '🎉 Excellent Grade!',
      message: 'Outstanding achievement!',
      confettiColors: ['#10B981', '#059669', '#047857', '#065F46']
    };
  } else if (gradeNum >= 5 || grade === '5' || grade === '6') {
    return {
      type: 'good',
      colors: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'], // Blue
      gradientFrom: 'from-blue-500',
      gradientVia: 'via-indigo-500',
      gradientTo: 'to-purple-500',
      bgGradient: 'from-blue-50/80 to-indigo-50/80 dark:from-blue-950/20 dark:to-indigo-950/20',
      borderGradient: 'from-blue-400 via-indigo-400 to-purple-400',
      glowEffect: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
      textGradient: 'from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400',
      icon: Award,
      title: '👏 Good Grade!',
      message: 'Well done! Keep it up!',
      confettiColors: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF']
    };
  } else if (gradeNum >= 1 || grade === '1' || grade === '2' || grade === '3' || grade === '4') {
    return {
      type: 'improving',
      colors: ['#F59E0B', '#D97706', '#B45309', '#92400E'], // Amber/Orange
      gradientFrom: 'from-amber-500',
      gradientVia: 'via-orange-500',
      gradientTo: 'to-yellow-500',
      bgGradient: 'from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20',
      borderGradient: 'from-amber-400 via-orange-400 to-yellow-400',
      glowEffect: 'from-amber-500/20 via-orange-500/20 to-yellow-500/20',
      textGradient: 'from-amber-600 via-orange-600 to-yellow-600 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-400',
      icon: TrendingUp,
      title: '📚 Every Grade Counts!',
      message: 'Building your knowledge step by step!',
      confettiColors: ['#F59E0B', '#D97706', '#B45309', '#92400E']
    };
  } else {
    return {
      type: 'encouraging',
      colors: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B'], // Red
      gradientFrom: 'from-red-500',
      gradientVia: 'via-pink-500',
      gradientTo: 'to-rose-500',
      bgGradient: 'from-red-50/80 to-pink-50/80 dark:from-red-950/20 dark:to-pink-950/20',
      borderGradient: 'from-red-400 via-pink-400 to-rose-400',
      glowEffect: 'from-red-500/20 via-pink-500/20 to-rose-500/20',
      textGradient: 'from-red-600 via-pink-600 to-rose-600 dark:from-red-400 dark:via-pink-400 dark:to-rose-400',
      icon: TrendingDown,
      title: '💪 Keep Trying!',
      message: 'Every step counts towards improvement!',
      confettiColors: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B']
    };
  }
};

export function GradeCelebration({ isVisible, onClose, grade, subject, previousGrade }: GradeCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const theme = getGradeTheme(grade);

  // Function to play celebration sounds (only for grade 7+)
  const playCelebrationSounds = () => {
    const gradeNum = parseInt(grade);
    if (gradeNum < 7 && grade !== '7' && grade !== '8' && grade !== '9' || grade === 'U') return;
    
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

      // Play celebration sound sequence (same as streak celebration)
      playSound(523.25, 0.15, 0); // C5
      playSound(659.25, 0.15, 100); // E5
      playSound(783.99, 0.15, 200); // G5
      playSound(1046.5, 0.2, 300); // C6
      
      playSound(1318.5, 0.1, 450, 'square'); // E6
      playSound(1567.98, 0.1, 550, 'square'); // G6
      playSound(2093, 0.15, 650, 'triangle'); // C7

      setTimeout(() => {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = 'triangle';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
          
          oscillator.start(audioContext.currentTime + index * 0.05);
          oscillator.stop(audioContext.currentTime + 0.8);
        });
      }, 800);

    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playCelebrationSounds();
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const IconComponent = theme.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <Confetti colors={theme.confettiColors} />}
          
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
              <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${theme.bgGradient} shadow-2xl max-w-md w-full`}>
                {/* Premium Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.glowEffect} animate-pulse`} />
                
                {/* Sophisticated Border */}
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.borderGradient} rounded-xl p-[2px]`}>
                  <div className={`bg-gradient-to-br ${theme.bgGradient} rounded-[10px] h-full w-full`} />
                </div>

                {/* Floating Elements */}
                <div className={`absolute top-4 right-6 w-4 h-4 bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientTo} rounded-full animate-bounce opacity-80`} />
                <div className={`absolute bottom-6 left-8 w-3 h-3 bg-gradient-to-r ${theme.gradientVia} ${theme.gradientTo} rounded-full animate-pulse opacity-60`} />
                <div className={`absolute top-8 left-6 w-2 h-2 bg-gradient-to-r ${theme.gradientTo} rounded-full animate-ping opacity-70`} />

                <CardContent className="relative p-8 text-center">
                  {/* Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.5 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} flex items-center justify-center shadow-2xl relative overflow-hidden`}>
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <IconComponent className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                      
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
                      className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${theme.gradientFrom} ${theme.gradientVia} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      <Star className="h-3 w-3 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className={`absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br ${theme.gradientVia} ${theme.gradientTo} rounded-full flex items-center justify-center shadow-lg`}
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
                    <h2 className={`text-3xl font-black bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                      {theme.title}
                    </h2>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-bold text-foreground">
                        Grade {grade} in {subject}
                      </p>
                      <p className="text-muted-foreground">
                        {theme.message}
                      </p>
                      {previousGrade && (
                        <p className="text-sm text-muted-foreground">
                          Previous: Grade {previousGrade}
                        </p>
                      )}
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
                      className={`bg-gradient-to-r ${theme.gradientFrom} ${theme.gradientVia} ${theme.gradientTo} hover:scale-105 text-white font-bold px-8 py-3 rounded-xl shadow-2xl transition-all duration-300`}
                    >
                      <IconComponent className="h-4 w-4 mr-2" />
                      Continue Learning
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