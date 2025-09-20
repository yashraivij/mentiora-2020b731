import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, X, Sparkles } from "lucide-react";

interface MPRewardToastProps {
  amount: number;
  message: string;
  onClose: () => void;
}

export const MPRewardToast = ({ amount, message, onClose }: MPRewardToastProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 8000); // Last 8 seconds instead of 3
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

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
          <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-400/20 via-blue-400/15 to-indigo-500/20 border-cyan-300/40 shadow-2xl shadow-cyan-400/30 backdrop-blur-xl">
            {/* Animated sparkles and gradient overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/15 via-blue-400/10 to-indigo-500/15" />
              
              {/* Multiple sparkles with different animations */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 120, 240, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-6 h-6 text-cyan-400"
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
                className="absolute top-1/2 -left-1 w-5 h-5 text-blue-400"
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
                className="absolute -bottom-1 right-1/3 w-4 h-4 text-indigo-400"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
            </div>

            <div className="p-4 relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-2 right-2 w-6 h-6 p-0 hover:bg-cyan-400/20 text-cyan-600 hover:text-cyan-700"
              >
                <X className="h-3 w-3" />
              </Button>

              {/* Main content */}
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-400/40"
                >
                  <Zap className="h-5 w-5 text-white fill-current" />
                </motion.div>
                
                <div className="flex-1">
                  <motion.div 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent"
                  >
                    +{amount} MP
                  </motion.div>
                  <div className="text-sm text-gray-600 leading-tight font-medium">
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