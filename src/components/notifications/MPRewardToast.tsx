import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X } from "lucide-react";

interface MPRewardToastProps {
  amount: number;
  message: string;
  onClose: () => void;
}

export const MPRewardToast = ({ amount, message, onClose }: MPRewardToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / 40); // Decrease over 4 seconds (40 steps of 100ms)
        return newProgress <= 0 ? 0 : newProgress;
      });
    }, 100);
    
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 500
          }}
          className="fixed top-6 right-6 z-50 w-80"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-background to-background/95 border-2 border-primary/20 shadow-2xl backdrop-blur-sm">
            {/* Animated gradient background */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: '200% 100%' }}
            />
            
            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            
            <div className="relative p-6">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-3 right-3 w-7 h-7 p-0 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Content */}
              <div className="pr-8">
                <motion.div
                  initial={{ scale: 0.8, y: 10, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  className="space-y-3"
                >
                  {/* MP Amount with glow effect */}
                  <div className="relative inline-block">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="text-5xl font-extrabold bg-gradient-to-r from-primary via-primary/90 to-primary bg-clip-text text-transparent"
                    >
                      +{amount}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.5 }}
                      transition={{ delay: 0.2 }}
                      className="absolute inset-0 blur-xl bg-primary/30 -z-10"
                    />
                  </div>
                  
                  {/* MP Label */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="text-xl font-bold text-primary tracking-wide"
                  >
                    Medly Points
                  </motion.div>
                  
                  {/* Message */}
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm text-foreground/80 font-medium leading-relaxed max-w-xs"
                  >
                    {message}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};