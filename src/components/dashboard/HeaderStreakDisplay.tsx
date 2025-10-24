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
    <div className="flex items-center gap-3">
      {/* Streak counter */}
      <div className="flex items-center gap-1.5">
        <motion.div
          animate={{
            scale: currentStreak > 0 ? [1, 1.08, 1] : 1,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground'}`} />
        </motion.div>
        <span className="text-sm font-semibold text-foreground">{currentStreak}</span>
      </div>
      
      {/* Week fires */}
      <div className="flex items-center gap-1">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, type: "spring" }}
            >
              <Flame 
                className={`h-3.5 w-3.5 transition-all duration-200 ${
                  isCompleted
                    ? 'text-orange-500 fill-orange-500'
                    : 'text-muted-foreground/30'
                } ${isToday ? 'scale-110' : ''}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
