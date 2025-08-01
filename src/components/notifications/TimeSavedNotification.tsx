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
    if (timeSavedHours >= 10) {
      return "You're absolutely crushing it! That's over 10 hours saved!";
    } else if (timeSavedHours >= 5) {
      return "Amazing progress! You've saved so much time with smart notes!";
    } else if (timeSavedHours >= 2) {
      return "Great work! Your AI notes are saving you precious study time!";
    } else {
      return "Fantastic! Every minute saved adds up to success!";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -50 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.5 
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950/90 dark:via-green-950/90 dark:to-teal-950/90 border-emerald-200/50 dark:border-emerald-700/50 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
            {/* Animated sparkles background */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-8 h-8 text-emerald-300/30 dark:text-emerald-400/20"
              >
                <Sparkles className="w-full h-full" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1.2, 1, 1.2],
                  rotate: [360, 270, 180, 90, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
                className="absolute -bottom-2 -left-2 w-6 h-6 text-teal-300/30 dark:text-teal-400/20"
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
                className="absolute top-2 right-2 w-8 h-8 p-0 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Header with icon */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg mb-1">
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
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent mb-2">
                    {timeSavedHours}h
                  </div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-1">
                    Total Time Saved
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">
                    with AI Auto-Notes
                  </p>
                </motion.div>

                <div className="bg-white/60 dark:bg-emerald-900/30 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-700/50">
                  <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 text-center leading-relaxed">
                    {getEncouragingMessage()}
                  </p>
                </div>

                {/* Progress indicator */}
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
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
                  onClick={() => window.location.href = '/notebook'}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
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