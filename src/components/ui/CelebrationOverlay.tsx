import { motion, AnimatePresence } from "framer-motion";
import { AnimatedAvatar } from "./AnimatedAvatar";

interface CelebrationOverlayProps {
  isVisible: boolean;
  tutorName: string;
  tutorAvatar: string;
  tutorColor: string;
  animationType: 'wave' | 'nod' | 'glasses-adjust' | 'enthusiastic-wave';
}

export const CelebrationOverlay = ({
  isVisible,
  tutorName,
  tutorAvatar,
  tutorColor,
  animationType,
}: CelebrationOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Central celebration content */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Large avatar with celebration animation */}
            <AnimatedAvatar
              src={tutorAvatar}
              name={tutorName}
              color={tutorColor}
              isHovered={false}
              isSelected={true}
              animationType={animationType}
              size={200}
              celebrationMode={true}
            />

            {/* Text below avatar */}
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                {tutorName} is ready to help you!
              </h3>
              <p className="text-white/80 text-sm">
                Let's get started on your learning journey
              </p>
            </motion.div>

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: tutorColor,
                  left: `${50 + Math.cos((i * Math.PI * 2) / 12) * 150}px`,
                  top: `${50 + Math.sin((i * Math.PI * 2) / 12) * 150}px`,
                }}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -100],
                }}
                transition={{
                  duration: 1.2,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
