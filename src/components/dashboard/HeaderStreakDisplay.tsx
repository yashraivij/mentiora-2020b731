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
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
      {/* Streak count */}
      <span className="text-sm font-bold text-foreground mr-1">{currentStreak}</span>
      
      {/* Fire icons for each day */}
      <div className="flex items-center gap-1">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              whileHover={{ scale: 1.15 }}
            >
              <Flame 
                className={`h-4 w-4 transition-all duration-300 ${
                  isCompleted
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-300 dark:text-gray-600'
                } ${isToday ? 'drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]' : ''}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
