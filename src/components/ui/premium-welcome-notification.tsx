import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, Check } from 'lucide-react';

interface PremiumWelcomeNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export function PremiumWelcomeNotification({ isVisible, onClose }: PremiumWelcomeNotificationProps) {
  const premiumFeatures = [
    { text: "Predicted 2026 Exam Papers", emoji: "📝" },
    { text: "Smart Revision Notebook", emoji: "📔" },
    { text: "Adaptive Weekly Study Plan", emoji: "📅" },
    { text: "Enhanced Analytics & Insights", emoji: "📊" },
    { text: "Unlimited AI Flashcards", emoji: "🎯" },
    { text: "Priority Support", emoji: "⚡" }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-[24px] shadow-[0px_20px_80px_rgba(0,0,0,0.2)] w-[90%] max-w-[560px] p-10 max-h-[88vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#00B4D8] to-[#0BA5E9] rounded-[16px] mb-6 relative"
              >
                <Crown className="h-8 w-8 text-white" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
                >
                  <Check className="h-3 w-3 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[32px] font-[800] text-black dark:text-white mb-3"
              >
                Welcome to Premium! 🎉
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[16px] text-[#6B7280] dark:text-gray-400"
              >
                You now have access to everything you need to ace your exams
              </motion.p>
            </div>

            {/* Features List */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3 mb-8"
            >
              {premiumFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className="flex items-center gap-3 p-4 rounded-[12px] bg-[#F0F9FF] dark:bg-gray-800 border border-[#00B4D8]/20"
                >
                  <span className="text-[24px] flex-shrink-0">{feature.emoji}</span>
                  <span className="text-[15px] font-medium text-black dark:text-white flex-1">
                    {feature.text}
                  </span>
                  <Check className="w-5 h-5 text-[#00B4D8] flex-shrink-0" />
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              onClick={onClose}
              className="w-full bg-[#00B4D8] text-white font-semibold text-[16px] py-[18px] px-12 rounded-[12px] hover:bg-[#0099b8] transition-all shadow-[0px_4px_16px_rgba(0,180,216,0.3)] hover:translate-y-[-2px]"
            >
              Start Using Premium →
            </motion.button>

            {/* Footer */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="text-[14px] text-[#6B7280] dark:text-gray-500 text-center mt-6"
            >
              All features are now active in your dashboard
            </motion.p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}