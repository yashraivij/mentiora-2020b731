import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, X, BookOpen, Crown, TrendingUp, Sparkles } from 'lucide-react';

interface TimeSavedNotificationProps {
  timeSavedHours: number;
  onClose: () => void;
  show: boolean;
}

export const TimeSavedNotification: React.FC<TimeSavedNotificationProps> = ({
  timeSavedHours,
  onClose,
  show
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const getEncouragingMessage = () => {
    const days = Math.floor(timeSavedHours / 24);
    const totalHours = Math.round(timeSavedHours * 10) / 10;
    
    if (days >= 7) {
      return `Incredible! You've saved ${getTimeSavedDisplay()} - that's over a week of study time!`;
    } else if (days >= 2) {
      return `Outstanding! You've saved ${getTimeSavedDisplay()} - imagine what else you could do with that time!`;
    } else if (days >= 1) {
      return `Amazing! You've saved ${getTimeSavedDisplay()} - that's a whole day back in your schedule!`;
    } else if (totalHours >= 20) {
      return `Incredible efficiency! That's like skipping 20+ hours of classes - amazing work!`;
    } else if (totalHours >= 15) {
      return `Phenomenal! That's equivalent to 3+ full school days of time saved!`;
    } else if (totalHours >= 10) {
      return `You're crushing it! That's like getting 2 full school days back!`;
    } else if (totalHours >= 8) {
      return `Outstanding! That's more than a full school day of time back in your life!`;
    } else if (totalHours >= 6) {
      return `Incredible! That's like skipping 6 full class periods - pure efficiency!`;
    } else if (totalHours >= 5) {
      return `Excellent! That's equivalent to a full morning of classes saved!`;
    } else if (totalHours >= 4) {
      return `Brilliant! That's like getting 4 class periods back in your day!`;
    } else if (totalHours >= 3) {
      return `Fantastic! That's like skipping 3 full classes - time well optimized!`;
    } else if (totalHours >= 2) {
      return `Great work! That's like getting 2 class periods back - keep it up!`;
    } else {
      if (totalHours >= 1) {
        return `Every minute counts! That's over an hour of class time back in your schedule!`;
      } else {
        return `Great start! Every minute saved is building your success momentum!`;
      }
    }
  };

  const getTimeSavedDisplay = () => {
    const totalHours = Math.round(timeSavedHours * 10) / 10; // Round to 1 decimal place
    const days = Math.floor(totalHours / 24);
    const remainingHours = Math.round((totalHours - (days * 24)) * 10) / 10; // Proper rounding
    
    if (days >= 1) {
      if (remainingHours >= 0.1) { // Only show remaining hours if >= 0.1
        return `${days}d ${remainingHours}h`;
      } else {
        return `${days} day${days > 1 ? 's' : ''}`;
      }
    } else {
      return `${totalHours}h`;
    }
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
          <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/95 dark:via-purple-950/95 dark:to-pink-950/95 border-violet-200/60 dark:border-violet-700/60 shadow-2xl shadow-violet-500/25 backdrop-blur-xl">
            {/* Animated sparkles and gradient overlay */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 dark:from-violet-400/20 dark:via-purple-400/20 dark:to-pink-400/20" />
              
              {/* Multiple sparkles with different animations */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, 120, 240, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 w-6 h-6 text-violet-400/50 dark:text-violet-300/40"
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
                className="absolute top-1/2 -left-1 w-5 h-5 text-purple-400/50 dark:text-purple-300/40"
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
                className="absolute -bottom-1 right-1/3 w-4 h-4 text-pink-400/50 dark:text-pink-300/40"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
            </div>

            <div className="p-6 relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="absolute top-2 right-2 w-8 h-8 p-0 hover:bg-violet-100 dark:hover:bg-violet-900/50 text-violet-600 dark:text-violet-400"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header with premium icon */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Badge className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white shadow-lg mb-1 border-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Time Saved!
                  </Badge>
                </div>
              </div>

              {/* Main content */}
              <div className="space-y-3">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", damping: 20 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 dark:from-violet-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
                    {getTimeSavedDisplay()}
                  </div>
                  <p className="text-sm font-semibold text-violet-700 dark:text-violet-300 mb-1">
                    Total Time Saved
                  </p>
                  <p className="text-xs text-violet-600/80 dark:text-violet-400/80">
                    with Smart Auto-Notes
                  </p>
                </motion.div>

                <div className="bg-white/70 dark:bg-violet-900/40 rounded-xl p-4 border border-violet-200/60 dark:border-violet-700/60 backdrop-blur-sm">
                  <p className="text-sm font-medium text-violet-800 dark:text-violet-200 text-center leading-relaxed">
                    {getEncouragingMessage()}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-xs font-medium text-violet-600 dark:text-violet-400">
                    Keep going strong!
                  </span>
                </div>
              </div>

              {/* Action button */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-center"
              >
                <Button
                  onClick={() => window.location.href = '/premium-notebook'}
                  size="sm"
                  className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  View Notes
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};