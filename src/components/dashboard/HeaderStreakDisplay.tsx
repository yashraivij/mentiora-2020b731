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
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
      {/* Flame icon with streak count */}
      <div className="flex items-center gap-1.5">
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
        <span className="text-sm font-bold text-foreground">{currentStreak}</span>
      </div>
      
      {/* Week dots */}
      <div className="flex items-center gap-0.5">
        {daysOfWeek.map((day, index) => {
          const isCompleted = isDayCompleted(index);
          const isToday = index === todayIndex;
          
          return (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-orange-500'
                  : 'bg-muted-foreground/20'
              } ${isToday ? 'ring-1 ring-orange-400 ring-offset-1 ring-offset-background scale-125' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
};
