import { motion } from "framer-motion";

interface OwlCharacterProps {
  pose?: "waving" | "listening" | "encouraging" | "excited" | "celebrating";
  size?: number;
}

export const OwlCharacter = ({ pose = "waving", size = 120 }: OwlCharacterProps) => {
  const renderOwl = () => {
    switch (pose) {
      case "waving":
        return (
          <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {/* Body */}
            <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D4F663" />
            
            {/* Ear tufts */}
            <ellipse cx="40" cy="35" rx="8" ry="12" fill="#D4F663" />
            <ellipse cx="80" cy="35" rx="8" ry="12" fill="#D4F663" />
            
            {/* Eyes background */}
            <circle cx="48" cy="60" r="14" fill="white" />
            <circle cx="72" cy="60" r="14" fill="white" />
            
            {/* Pupils */}
            <circle cx="50" cy="62" r="6" fill="#0F4C45" />
            <circle cx="74" cy="62" r="6" fill="#0F4C45" />
            
            {/* Eye highlights */}
            <circle cx="48" cy="58" r="3" fill="white" opacity="0.8" />
            <circle cx="72" cy="58" r="3" fill="white" opacity="0.8" />
            
            {/* Beak */}
            <path d="M 60 70 L 55 78 L 65 78 Z" fill="#FFA500" />
            
            {/* Left wing (normal) */}
            <path d="M 30 70 Q 20 75 25 85" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            {/* Right wing (raised - waving) */}
            <motion.path
              d="M 90 65 Q 100 55 95 45"
              stroke="#D4F663"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [0, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "90px 65px" }}
            />
            
            {/* Feet */}
            <ellipse cx="50" cy="108" rx="8" ry="4" fill="#FFA500" />
            <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FFA500" />
          </svg>
        );

      case "listening":
        return (
          <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {/* Body - slightly tilted */}
            <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D4F663" transform="rotate(-5 60 70)" />
            
            {/* Ear tufts */}
            <ellipse cx="42" cy="33" rx="8" ry="12" fill="#D4F663" />
            <ellipse cx="78" cy="37" rx="8" ry="12" fill="#D4F663" />
            
            {/* Eyes background - looking up slightly */}
            <circle cx="48" cy="58" r="14" fill="white" />
            <circle cx="72" cy="58" r="14" fill="white" />
            
            {/* Pupils - looking up */}
            <circle cx="48" cy="56" r="6" fill="#0F4C45" />
            <circle cx="72" cy="56" r="6" fill="#0F4C45" />
            
            {/* Eye highlights */}
            <circle cx="47" cy="54" r="3" fill="white" opacity="0.8" />
            <circle cx="71" cy="54" r="3" fill="white" opacity="0.8" />
            
            {/* Beak */}
            <path d="M 60 68 L 55 76 L 65 76 Z" fill="#FFA500" />
            
            {/* Wings (both down) */}
            <path d="M 30 70 Q 20 75 25 85" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 90 70 Q 100 75 95 85" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            {/* Feet */}
            <ellipse cx="50" cy="108" rx="8" ry="4" fill="#FFA500" />
            <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FFA500" />
          </svg>
        );

      case "encouraging":
        return (
          <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {/* Body */}
            <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D4F663" />
            
            {/* Ear tufts */}
            <ellipse cx="40" cy="35" rx="8" ry="12" fill="#D4F663" />
            <ellipse cx="80" cy="35" rx="8" ry="12" fill="#D4F663" />
            
            {/* Eyes background */}
            <circle cx="48" cy="60" r="14" fill="white" />
            <circle cx="72" cy="60" r="14" fill="white" />
            
            {/* Pupils - happy/encouraging look */}
            <circle cx="48" cy="62" r="6" fill="#0F4C45" />
            <circle cx="72" cy="62" r="6" fill="#0F4C45" />
            
            {/* Eye highlights */}
            <circle cx="47" cy="58" r="3" fill="white" opacity="0.8" />
            <circle cx="71" cy="58" r="3" fill="white" opacity="0.8" />
            
            {/* Happy curved eyes */}
            <path d="M 40 55 Q 48 52 56 55" stroke="#0F4C45" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M 64 55 Q 72 52 80 55" stroke="#0F4C45" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Beak */}
            <path d="M 60 70 L 55 78 L 65 78 Z" fill="#FFA500" />
            
            {/* Smile */}
            <path d="M 50 82 Q 60 88 70 82" stroke="#0F4C45" strokeWidth="2" strokeLinecap="round" fill="none" />
            
            {/* Wings (slightly out) */}
            <path d="M 28 68 Q 18 70 22 80" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 92 68 Q 102 70 98 80" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            {/* Feet */}
            <ellipse cx="50" cy="108" rx="8" ry="4" fill="#FFA500" />
            <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FFA500" />
          </svg>
        );

      case "excited":
        return (
          <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {/* Body */}
            <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D4F663" />
            
            {/* Ear tufts - perked up */}
            <ellipse cx="38" cy="32" rx="8" ry="14" fill="#D4F663" />
            <ellipse cx="82" cy="32" rx="8" ry="14" fill="#D4F663" />
            
            {/* Eyes background - wide and excited */}
            <circle cx="46" cy="58" r="15" fill="white" />
            <circle cx="74" cy="58" r="15" fill="white" />
            
            {/* Pupils - large and excited */}
            <circle cx="46" cy="60" r="7" fill="#0F4C45" />
            <circle cx="74" cy="60" r="7" fill="#0F4C45" />
            
            {/* Eye highlights */}
            <circle cx="44" cy="56" r="4" fill="white" opacity="0.8" />
            <circle cx="72" cy="56" r="4" fill="white" opacity="0.8" />
            
            {/* Beak */}
            <path d="M 60 68 L 54 76 L 66 76 Z" fill="#FFA500" />
            
            {/* Big smile */}
            <path d="M 48 80 Q 60 90 72 80" stroke="#0F4C45" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            
            {/* Wings (raised up excited) */}
            <path d="M 30 62 Q 20 50 25 40" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M 90 62 Q 100 50 95 40" stroke="#D4F663" strokeWidth="12" strokeLinecap="round" fill="none" />
            
            {/* Feet */}
            <ellipse cx="50" cy="108" rx="8" ry="4" fill="#FFA500" />
            <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FFA500" />
            
            {/* Sparkle */}
            <path d="M 100 30 L 102 35 L 107 37 L 102 39 L 100 44 L 98 39 L 93 37 L 98 35 Z" fill="#D4F663" />
          </svg>
        );

      case "celebrating":
        return (
          <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
            {/* Body */}
            <ellipse cx="60" cy="70" rx="38" ry="42" fill="#D4F663" />
            
            {/* Ear tufts */}
            <ellipse cx="38" cy="32" rx="8" ry="14" fill="#D4F663" />
            <ellipse cx="82" cy="32" rx="8" ry="14" fill="#D4F663" />
            
            {/* Eyes background - very happy */}
            <circle cx="46" cy="58" r="14" fill="white" />
            <circle cx="74" cy="58" r="14" fill="white" />
            
            {/* Happy closed eyes (curved lines) */}
            <path d="M 38 58 Q 46 54 54 58" stroke="#0F4C45" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 66 58 Q 74 54 82 58" stroke="#0F4C45" strokeWidth="3" strokeLinecap="round" fill="none" />
            
            {/* Beak */}
            <path d="M 60 68 L 54 76 L 66 76 Z" fill="#FFA500" />
            
            {/* Big happy smile */}
            <path d="M 45 82 Q 60 92 75 82" stroke="#0F4C45" strokeWidth="3" strokeLinecap="round" fill="none" />
            
            {/* Wings (fully raised celebrating) */}
            <motion.path
              d="M 28 58 Q 18 45 22 32"
              stroke="#D4F663"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [-5, 5, -5] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: "28px 58px" }}
            />
            <motion.path
              d="M 92 58 Q 102 45 98 32"
              stroke="#D4F663"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
              animate={{ rotate: [5, -5, 5] }}
              transition={{ duration: 0.4, repeat: Infinity }}
              style={{ transformOrigin: "92px 58px" }}
            />
            
            {/* Feet */}
            <ellipse cx="50" cy="108" rx="8" ry="4" fill="#FFA500" />
            <ellipse cx="70" cy="108" rx="8" ry="4" fill="#FFA500" />
            
            {/* Celebration stars */}
            <motion.path
              d="M 20 35 L 22 40 L 27 42 L 22 44 L 20 49 L 18 44 L 13 42 L 18 40 Z"
              fill="#D4F663"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.path
              d="M 100 40 L 102 45 L 107 47 L 102 49 L 100 54 L 98 49 L 93 47 L 98 45 Z"
              fill="#D4F663"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <motion.path
              d="M 60 25 L 61 28 L 64 29 L 61 30 L 60 33 L 59 30 L 56 29 L 59 28 Z"
              fill="white"
              animate={{ scale: [1, 1.3, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return <div className="inline-block">{renderOwl()}</div>;
};
