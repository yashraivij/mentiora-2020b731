import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Star, Zap, Target, Brain, BookOpen, TrendingUp, Clock, X, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PremiumPromoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export const PremiumPromoModal = ({ open, onOpenChange, onUpgrade }: PremiumPromoModalProps) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown

  useEffect(() => {
    if (!open) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpgrade = () => {
    onOpenChange(false);
    onUpgrade();
  };

  const features = [
    { icon: Brain, text: "AI-Generated Revision Notes", highlight: "Save 10+ hours/week" },
    { icon: Target, text: "Predicted Exam Questions", highlight: "95% accuracy rate" },
    { icon: TrendingUp, text: "Grade Predictions", highlight: "Know your grades early" },
    { icon: BookOpen, text: "Smart Study Planner", highlight: "Personalized schedules" },
    { icon: Zap, text: "Instant Answer Marking", highlight: "Real-time feedback" },
    { icon: Trophy, text: "Performance Analytics", highlight: "Track improvement" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 border-0 bg-transparent overflow-hidden">
        <div className="relative">
          {/* Animated background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-90 rounded-3xl animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-bl from-indigo-600/80 via-purple-500/80 to-pink-500/80 rounded-3xl" />
          
          {/* Floating elements */}
          <motion.div 
            className="absolute top-6 left-6 text-yellow-300"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 0.9, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Crown className="h-8 w-8" />
          </motion.div>
          
          <motion.div 
            className="absolute top-4 right-16 text-yellow-200"
            animate={{ 
              y: [-5, 5, -5],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>

          <motion.div 
            className="absolute bottom-8 left-8 text-yellow-300"
            animate={{ 
              rotate: [0, -15, 15, 0],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Star className="h-7 w-7" />
          </motion.div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white/80 hover:text-white hover:bg-white/20 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {/* Content */}
          <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl border border-white/20 p-8">
            <DialogHeader className="text-center mb-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center mb-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-xl opacity-50" />
                  <div className="relative bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-full">
                    <Crown className="h-12 w-12 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <DialogTitle className="text-4xl font-black text-white mb-2">
                🚀 Unlock Mentiora Premium
              </DialogTitle>
              
              <motion.p 
                className="text-xl text-white/90 font-semibold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Join 50,000+ students achieving their dream grades
              </motion.p>
            </DialogHeader>

            {/* Urgency Timer */}
            <motion.div 
              className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-400/30 rounded-2xl p-4 mb-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-red-300" />
                <span className="text-red-200 font-bold text-lg">LIMITED TIME OFFER</span>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {formatTime(timeLeft)}
              </div>
              <p className="text-red-200 text-sm font-medium">
                ⚡ Exclusive pricing expires soon - Don't miss out!
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gradient-to-br from-white/20 to-white/10 rounded-lg">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{feature.text}</h4>
                      <p className="text-yellow-200 text-xs font-medium">{feature.highlight}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Proof */}
            <motion.div 
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-4 mb-6"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-white font-bold">4.9/5</span>
              </div>
              <p className="text-green-200 text-sm font-medium">
                💬 "<strong>Increased my grades by 2 levels!</strong> The AI predictions were spot-on for my actual exams."
              </p>
              <p className="text-green-300/80 text-xs mt-1">- Sarah, Year 11 Student</p>
            </motion.div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleUpgrade}
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 text-black font-black py-6 text-xl rounded-2xl shadow-2xl border-2 border-yellow-300/50 relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  <div className="relative flex items-center justify-center gap-3">
                    <Crown className="h-7 w-7" />
                    <span>🚀 UPGRADE TO PREMIUM NOW</span>
                    <Sparkles className="h-7 w-7" />
                  </div>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="w-full text-white/80 hover:text-white hover:bg-white/10 py-3 text-base rounded-xl"
                >
                  Maybe Later
                </Button>
              </motion.div>
            </div>

            {/* Money back guarantee */}
            <motion.p 
              className="text-center text-white/70 text-sm mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              💰 30-day money-back guarantee • 🔒 Secure payment • ⚡ Instant access
            </motion.p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};