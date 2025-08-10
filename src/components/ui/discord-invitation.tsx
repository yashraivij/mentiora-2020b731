import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Users, Sparkles, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DiscordInvitationProps {
  isVisible: boolean;
  onClose: () => void;
}

const Confetti = () => {
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 1.5,
    color: ['#5865F2', '#57F287', '#FEE75C', '#ED4245', '#EB459E'][Math.floor(Math.random() * 5)]
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

export function DiscordInvitation({ isVisible, onClose }: DiscordInvitationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  const playCelebrationSounds = () => {
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
          gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };

      // Discord notification sound sequence
      playSound(659.25, 0.1, 0); // E5
      playSound(783.99, 0.1, 100); // G5
      playSound(523.25, 0.15, 200); // C5

    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      playCelebrationSounds();
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleJoinDiscord = () => {
    window.open('https://discord.gg/Jq2YTZ3aMa', '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showConfetti && <Confetti />}
          
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
              transition={{ type: "spring", damping: 25, stiffness: 500, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative"
            >
              <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-blue-50/80 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/20 shadow-2xl max-w-md w-full">
                {/* Discord Brand Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-pulse" />
                
                {/* Premium Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 rounded-xl p-[2px]">
                  <div className="bg-gradient-to-br from-white via-blue-50/80 to-purple-50/80 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/20 rounded-[10px] h-full w-full" />
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white/20 hover:bg-white/30 dark:bg-black/20 dark:hover:bg-black/30 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>

                {/* Floating Elements */}
                <div className="absolute top-4 right-12 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce opacity-80" />
                <div className="absolute bottom-6 left-8 w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-pulse opacity-60" />

                <CardContent className="relative p-8 text-center">
                  {/* Discord Icon with Animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.3 }}
                    className="relative mx-auto mb-6"
                  >
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-2xl shadow-blue-500/25 relative overflow-hidden">
                      <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                      <MessageCircle className="h-10 w-10 text-white relative z-10 drop-shadow-lg" />
                      
                      {/* Rotating Ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border-4 border-blue-300/30"
                      />
                    </div>
                    
                    {/* Floating Icons */}
                    <motion.div
                      animate={{ y: [-5, 5, -5], rotate: [0, 180, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Users className="h-3 w-3 text-white drop-shadow-sm" />
                    </motion.div>
                    
                    <motion.div
                      animate={{ y: [5, -5, 5], rotate: [360, 180, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Sparkles className="h-2.5 w-2.5 text-white drop-shadow-sm" />
                    </motion.div>
                  </motion.div>

                  {/* Invitation Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4 mb-6"
                  >
                    <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      🎉 You're Making Progress!
                    </h2>
                    
                    <div className="space-y-3">
                      <p className="text-lg font-bold text-foreground">
                        Join Our Study Community
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Connect with thousands of students, share study tips, get help with questions, and celebrate achievements together!
                      </p>
                    </div>

                    {/* Community Benefits */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      className="p-4 bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-950/40 dark:to-purple-950/40 rounded-2xl border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-2xl">📚</span>
                      </div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300 bg-clip-text text-transparent mb-1">
                        Study Together
                      </h3>
                      <p className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                        Get instant help, share resources, and stay motivated with fellow students
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={handleJoinDiscord}
                      className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-600 text-white font-bold px-8 py-3 rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Join Discord Community
                    </Button>
                    
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground"
                    >
                      Maybe Later
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