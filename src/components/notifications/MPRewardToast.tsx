import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, X } from "lucide-react";

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
          <Card className="relative overflow-hidden bg-white dark:bg-gray-900 border-2 border-[#0EA5E9]/30 shadow-lg shadow-[#0EA5E9]/10">
            {/* Progress bar at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#0EA5E9]/20">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>
            
            <div className="p-5">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-3 right-3 w-7 h-7 p-0 hover:bg-[#0EA5E9]/10 text-[#64748B] hover:text-[#0EA5E9] rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Content */}
              <div className="flex items-start gap-4 pr-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                  }}
                  className="w-12 h-12 bg-[#0EA5E9]/5 rounded-full flex items-center justify-center border-2 border-[#0EA5E9]/30 flex-shrink-0"
                >
                  <Trophy className="h-6 w-6 text-[#0EA5E9]" />
                </motion.div>
                
                <div className="flex-1 min-w-0 pt-1">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="text-2xl font-bold text-[#0EA5E9] mb-1"
                  >
                    +{amount} MP
                  </motion.div>
                  <div className="text-sm text-[#0F172A] dark:text-white font-medium leading-snug">
                    {message}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};