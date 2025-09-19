import { motion } from "framer-motion";
import { useEffect } from "react";
import { Zap } from "lucide-react";

interface MPRewardToastProps {
  amount: number;
  message: string;
  onClose: () => void;
}

export const MPRewardToast = ({ amount, message, onClose }: MPRewardToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      className="fixed top-4 right-4 z-50 pointer-events-none"
    >
      <div className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-white/20 min-w-[200px] relative overflow-hidden">
        {/* Sparkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: 0 }}
              animate={{ 
                scale: [0, 1, 0], 
                rotate: [0, 180, 360],
                x: [0, Math.random() * 40 - 20],
                y: [0, Math.random() * 40 - 20]
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 0.6,
              ease: "easeInOut"
            }}
            className="flex-shrink-0"
          >
            <Zap className="w-6 h-6 text-yellow-300 fill-current" />
          </motion.div>
          
          <div className="flex-1">
            <motion.div 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "backOut" }}
              className="text-lg font-bold text-white"
            >
              +{amount} MP
            </motion.div>
            <div className="text-sm text-white/90 leading-tight">
              {message}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};