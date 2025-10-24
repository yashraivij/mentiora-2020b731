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
  
  const getStreakColor = () => {
    if (currentStreak === 0) return "bg-gray-300 dark:bg-gray-600";
    if (currentStreak < 3) return "bg-orange-400";
    if (currentStreak < 7) return "bg-orange-500";
    return "bg-gradient-to-r from-red-500 to-pink-500";
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border border-border">
      {/* Flame icon with streak count */}
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
          <Flame className={`h-4 w-4 ${currentStreak > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
        </motion.div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground leading-none">{currentStreak}</span>
          <span className="text-[9px] text-muted-foreground leading-none">day{currentStreak === 1 ? '' : 's'}</span>
        </div>
      </div>
      
      {/* Divider */}
      <div className="w-px h-6 bg-border"></div>
      
      {/* Week dots */}
      <div className="flex items-center gap-1">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, type: "spring" }}
              className="flex flex-col items-center gap-0.5"
            >
              <span className={`text-[8px] font-semibold uppercase ${
                isToday ? 'text-orange-500' : 'text-muted-foreground'
              }`}>
                {day}
              </span>
              <motion.div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isCompleted
                    ? getStreakColor()
                    : 'bg-muted-foreground/20'
                } ${isToday ? 'ring-1 ring-orange-400 ring-offset-1 ring-offset-background' : ''}`}
                whileHover={{ scale: 1.2 }}
                animate={isToday && currentStreak > 0 ? {
                  scale: [1, 1.15, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
