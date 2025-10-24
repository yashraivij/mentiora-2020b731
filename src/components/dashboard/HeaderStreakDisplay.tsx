import { motion } from "framer-motion";
import { Flame } from "lucide-react";

interface HeaderStreakDisplayProps {
  currentStreak: number;
}

export const HeaderStreakDisplay = ({ currentStreak }: HeaderStreakDisplayProps) => {
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon-Sun (0-6)
  
  const isDayCompleted = (index: number) => {
    if (currentStreak === 0) return false;
    if (currentStreak >= 7) return true;
    
    const startIndex = todayIndex - currentStreak + 1;
    if (startIndex < 0) {
      return index > (7 + startIndex) || index <= todayIndex;
    }
    return index >= startIndex && index <= todayIndex;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-[#E2E8F0]/50 dark:border-gray-700/50 shadow-sm">
      {/* Streak counter */}
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-[#CBD5E1] dark:text-gray-600'}`} />
        </motion.div>
        <span className="text-base font-bold text-[#0F172A] dark:text-white">{currentStreak}</span>
      </div>
      
      {/* Divider */}
      <div className="w-px h-5 bg-[#E2E8F0] dark:bg-gray-700"></div>
      
      {/* Week fires */}
      <div className="flex items-center gap-1.5">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: "spring" }}
              className="relative group"
            >
              <Flame 
                className={`h-3.5 w-3.5 transition-all duration-200 ${
                  isCompleted
                    ? 'text-orange-500 fill-orange-500'
                    : 'text-[#CBD5E1] dark:text-gray-600'
                } ${isToday ? 'scale-110' : ''}`}
              />
              {isToday && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500"></div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
