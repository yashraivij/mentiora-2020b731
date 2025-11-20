import { motion } from "framer-motion";
import { FoxCharacter } from "./FoxCharacter";

interface TutorCharacterProps {
  pose?: "waving" | "listening" | "nodding" | "excited" | "celebrating";
  size?: "small" | "medium" | "large";
  message?: string;
  position?: "center" | "top" | "side";
  animated?: boolean;
  userName?: string;
}

const SIZE_MAP = {
  small: 80,
  medium: 100,
  large: 180,
};

export const TutorCharacter = ({
  pose = "waving",
  size = "large",
  message,
  position = "center",
  animated = true,
  userName,
}: TutorCharacterProps) => {
  const characterSize = SIZE_MAP[size];

  // Personalize message with user's name if provided
  const personalizedMessage = message && userName 
    ? message.replace("[Name]", userName)
    : message;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    },
  };

  const floatAnimation = animated ? {
    y: [0, -8, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
    }
  } : {};

  const celebrateAnimation = pose === "celebrating" ? {
    rotate: [0, -10, 10, -10, 10, 0],
    scale: [1, 1.1, 1, 1.1, 1],
    transition: {
      duration: 0.6,
    }
  } : {};

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`flex flex-col items-center ${
        position === "side" ? "flex-row gap-4" : "gap-3"
      }`}
    >
      {/* Speech bubble */}
      {personalizedMessage && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="relative bg-white rounded-xl px-4 py-2.5 shadow-md"
          style={{ maxWidth: "280px" }}
        >
          <p className="text-[15px] font-medium text-[#0F4C45]">
            {personalizedMessage}
          </p>
          {/* Speech bubble tail */}
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent border-t-white"
          />
        </motion.div>
      )}

      {/* Character */}
      <div>
        <FoxCharacter pose={pose} size={characterSize} />
      </div>

      {/* Confetti for celebration */}
      {pose === "celebrating" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 1,
                y: "50%",
                x: "50%",
                scale: 0 
              }}
              animate={{ 
                opacity: 0,
                y: [0, -200, -400],
                x: [0, (i % 2 === 0 ? 1 : -1) * (50 + i * 20)],
                scale: [0, 1, 0.5],
                rotate: [0, 360]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
              style={{
                backgroundColor: i % 3 === 0 ? "#D4F663" : i % 3 === 1 ? "#fff" : "#15685E"
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};
