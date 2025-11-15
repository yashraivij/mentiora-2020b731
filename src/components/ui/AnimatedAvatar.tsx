import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface AnimatedAvatarProps {
  src: string;
  name: string;
  color: string;
  isHovered: boolean;
  isSelected: boolean;
  animationType: 'wave' | 'nod' | 'glasses-adjust' | 'enthusiastic-wave';
  size?: number;
  celebrationMode?: boolean;
}

export const AnimatedAvatar = ({
  src,
  name,
  color,
  isHovered,
  isSelected,
  animationType,
  size = 160,
  celebrationMode = false,
}: AnimatedAvatarProps) => {
  const [blinkKey, setBlinkKey] = useState(0);

  // Idle breathing animation
  const breathingAnimation = {
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Subtle sway animation
  const swayAnimation = {
    rotate: [-0.5, 0.5, -0.5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  // Blink effect (random)
  useEffect(() => {
    if (!celebrationMode) {
      const blinkInterval = setInterval(() => {
        setBlinkKey(prev => prev + 1);
      }, Math.random() * 3000 + 2000); // Random between 2-5 seconds

      return () => clearInterval(blinkInterval);
    }
  }, [celebrationMode]);

  // Selection gesture animations
  const getGestureAnimation = () => {
    if (!isSelected && !celebrationMode) return {};

    switch (animationType) {
      case 'wave':
        return {
          rotate: [0, 5, -5, 5, 0],
          scale: [1, 1.05, 1],
          transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as any },
        };
      case 'nod':
        return {
          rotateX: [0, 10, 0],
          scale: [1, 1.03, 1],
          transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any },
        };
      case 'glasses-adjust':
        return {
          y: [0, -5, 0],
          scale: [1, 1.02, 1],
          transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] as any },
        };
      case 'enthusiastic-wave':
        return {
          rotate: [0, -10, 10, -10, 10, 0],
          scale: [1, 1.08, 1],
          transition: { duration: 1, ease: [0.4, 0, 0.2, 1] as any },
        };
      default:
        return {};
    }
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: color }}
        animate={{
          opacity: isHovered ? 0.4 : isSelected ? 0.5 : 0.2,
          scale: isHovered ? 1.1 : isSelected ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Pulsing glow when selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{ backgroundColor: color }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1.1, 1.3, 1.1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Avatar container */}
      <motion.div
        className="relative w-full h-full rounded-full overflow-hidden border-4 border-white shadow-2xl"
        animate={
          celebrationMode || isSelected
            ? getGestureAnimation()
            : isHovered
            ? {
                scale: 1.05,
                rotate: 2,
                transition: { duration: 0.3 },
              }
            : {
                ...breathingAnimation,
                ...swayAnimation,
              }
        }
      >
        {/* Avatar image */}
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />

        {/* Blink overlay (subtle) */}
        {!celebrationMode && (
          <motion.div
            key={blinkKey}
            className="absolute inset-0 bg-black pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.15 }}
          />
        )}
      </motion.div>

      {/* Celebration particles */}
      {celebrationMode && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
              initial={{
                x: size / 2,
                y: size / 2,
                opacity: 1,
              }}
              animate={{
                x: size / 2 + Math.cos((i * Math.PI * 2) / 6) * 80,
                y: size / 2 + Math.sin((i * Math.PI * 2) / 6) * 80,
                opacity: 0,
                scale: [1, 2, 0],
              }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
