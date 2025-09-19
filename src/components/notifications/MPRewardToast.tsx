import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Zap, Sparkles } from 'lucide-react';

export interface MPRewardData {
  id: string;
  amount: number;
  reason: string;
  description: string;
}

interface MPRewardToastProps {
  reward: MPRewardData | null;
  onClose: () => void;
}

export const MPRewardToast: React.FC<MPRewardToastProps> = ({ reward, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (reward) {
      setIsVisible(true);
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [reward]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!reward) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 100, y: -50 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100, y: -50 }}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 400,
            duration: 0.6 
          }}
          className="fixed top-6 right-6 z-50 max-w-sm"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 dark:from-primary/10 dark:via-accent/10 dark:to-primary/20 border-primary/20 dark:border-primary/30 shadow-2xl shadow-primary/25 backdrop-blur-xl">
            {/* Animated sparkles and gradient overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 dark:from-primary/20 dark:via-accent/20 dark:to-primary/10" />
              
              {/* Sparkles animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 120, 240, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-6 h-6 text-primary/50 dark:text-primary/40"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 240, 120, 0],
                  opacity: [0.4, 0.8, 0.4]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-1/2 -left-1 w-5 h-5 text-accent/50 dark:text-accent/40"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-1 right-1/3 w-4 h-4 text-primary/50 dark:text-primary/40"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
            </div>

            <div className="p-5 relative">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 w-8 h-8 p-0 rounded-md hover:bg-primary/10 text-primary/60 hover:text-primary transition-colors"
              >
                <X className="h-4 w-4 mx-auto" />
              </button>

              {/* Main content */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    MP Earned!
                  </Badge>
                </div>

                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", damping: 20 }}
                  className="text-left"
                >
                  <div className="text-3xl font-bold text-primary mb-1">
                    +{reward.amount} MP
                  </div>
                  <p className="text-sm font-medium text-foreground/80">
                    {reward.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};