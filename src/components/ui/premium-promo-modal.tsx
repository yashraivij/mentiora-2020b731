import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Sparkles, Clock, Target, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal: React.FC<PremiumPromoModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
}) => {
  const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    onClose();
    onUpgrade();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-transparent border-0 shadow-none">
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 opacity-95" />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-600 via-purple-600 to-pink-600 opacity-80 animate-pulse" />
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, -40, -20],
                  x: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              >
                <Sparkles className="h-3 w-3 text-yellow-300" />
              </motion.div>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          >
            <X className="h-4 w-4 text-white" />
          </button>

          {/* Main Content */}
          <div className="relative z-10 p-8 text-center text-white">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-4 bg-yellow-400/20 rounded-full backdrop-blur-sm border border-yellow-400/30"
                >
                  <Crown className="h-12 w-12 text-yellow-400" />
                </motion.div>
              </div>
              
              <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-yellow-200 via-white to-yellow-200 bg-clip-text text-transparent">
                UNLOCK MENTIORA PREMIUM
              </h1>
              
              <p className="text-xl font-semibold text-white/90 mb-4">
                🚀 Join 10,000+ Students Getting A*s
              </p>
            </motion.div>

            {/* Limited Time Offer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 p-4 bg-red-500/90 rounded-2xl border-2 border-red-400"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-white animate-pulse" />
                <span className="text-lg font-bold text-white">LIMITED TIME OFFER</span>
              </div>
              <div className="text-3xl font-black text-white">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-white/90 font-medium">
                This exclusive discount expires soon!
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid md:grid-cols-2 gap-4 mb-8"
            >
              {[
                {
                  icon: Target,
                  title: "2026 Predicted Questions",
                  description: "Get real exam questions before anyone else",
                  color: "from-green-400 to-emerald-500"
                },
                {
                  icon: Zap,
                  title: "AI Study Notes",
                  description: "Personalized revision notes that boost grades",
                  color: "from-blue-400 to-cyan-500"
                },
                {
                  icon: Crown,
                  title: "Grade Predictions",
                  description: "Know your predicted grades instantly",
                  color: "from-purple-400 to-pink-500"
                },
                {
                  icon: Sparkles,
                  title: "Premium Analytics",
                  description: "Track your progress like never before",
                  color: "from-yellow-400 to-orange-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                >
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${feature.color} mb-2`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/80">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ 
                      duration: 0.5, 
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-white font-semibold mb-1">
                "Mentiora Premium helped me jump from C to A* in 3 months!"
              </p>
              <p className="text-white/70 text-sm">
                - Sarah M., A-Level Student
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="space-y-4"
            >
              <Button
                onClick={handleUpgrade}
                size="lg"
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 hover:from-yellow-300 hover:via-orange-300 hover:to-red-300 text-black font-black py-6 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-xl"
              >
                <Crown className="h-6 w-6 mr-3" />
                🚀 UPGRADE TO PREMIUM NOW
                <Sparkles className="h-6 w-6 ml-3" />
              </Button>
              
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                Maybe later
              </Button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-6 flex items-center justify-center gap-6 text-white/60 text-sm"
            >
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Instant Access</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="h-4 w-4" />
                <span>Premium Support</span>
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};