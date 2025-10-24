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
    <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-orange-50/80 to-red-50/80 dark:from-orange-950/20 dark:to-red-950/20 border border-orange-200/50 dark:border-orange-800/30 shadow-sm">
      {/* Streak counter with flame */}
      <div className="flex items-center gap-2 pr-4 border-r border-orange-200/50 dark:border-orange-800/30">
        <motion.div
          animate={{
            scale: currentStreak > 0 ? [1, 1.15, 1] : 1,
            rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0,
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flame className={`h-5 w-5 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
        </motion.div>
        <div className="flex flex-col leading-none">
          <span className="text-lg font-black text-orange-600 dark:text-orange-400">{currentStreak}</span>
          <span className="text-[10px] font-semibold text-orange-500/70 dark:text-orange-400/70 uppercase tracking-wide">streak</span>
        </div>
      </div>
      
      {/* Week fire icons */}
      <div className="flex items-center gap-2">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.2, y: -2 }}
              className="flex flex-col items-center gap-1"
            >
              <Flame 
                className={`h-5 w-5 transition-all duration-300 ${
                  isCompleted
                    ? 'text-red-500 fill-red-500 drop-shadow-[0_2px_8px_rgba(239,68,68,0.4)]'
                    : 'text-gray-300 dark:text-gray-600'
                } ${isToday && isCompleted ? 'animate-pulse' : ''}`}
              />
              <span className={`text-[9px] font-bold uppercase tracking-wider ${
                isToday ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {day}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
