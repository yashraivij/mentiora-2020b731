import { motion } from "framer-motion";
import { Flame, Check } from "lucide-react";

interface WeeklyStreakBannerProps {
  currentStreak: number;
}

export const WeeklyStreakBanner = ({ currentStreak }: WeeklyStreakBannerProps) => {
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate which days should be filled based on current streak
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon-Sun (0-6)
  
  const isDayCompleted = (index: number) => {
    if (currentStreak === 0) return false;
    
    // If streak is 7+, all days are filled
    if (currentStreak >= 7) return true;
    
    // Calculate which days should be filled based on streak
    const startIndex = todayIndex - currentStreak + 1;
    if (startIndex < 0) {
      // Wrap around to previous week
      return index > (7 + startIndex) || index <= todayIndex;
    }
    return index >= startIndex && index <= todayIndex;
  };
  
  const getStreakColor = () => {
    if (currentStreak === 0) return "from-gray-400 to-gray-500";
    if (currentStreak < 3) return "from-orange-400 to-orange-500";
    if (currentStreak < 7) return "from-orange-500 to-red-500";
    return "from-red-500 to-pink-600";
  };
  
  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak < 3) return "Keep it up!";
    if (currentStreak < 7) return "You're on fire!";
    if (currentStreak === 7) return "Amazing! One week streak! 🎉";
    return "Legendary streak!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/95 to-orange-50/50 dark:from-gray-800/95 dark:to-orange-950/30 border-2 border-orange-500/20 dark:border-orange-500/30 shadow-lg p-4"
    >
      {/* Background glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getStreakColor()} opacity-5`}></div>
      
      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Left: Streak info */}
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: currentStreak > 0 ? [1, 1.15, 1] : 1,
              rotate: currentStreak > 0 ? [0, 5, -5, 0] : 0,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${getStreakColor()} shadow-lg`}
          >
            <Flame className="h-6 w-6 text-white" />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#0F172A] dark:text-white">
                {currentStreak}
              </span>
              <span className="text-sm font-semibold text-[#64748B] dark:text-gray-400">
                day{currentStreak === 1 ? '' : 's'} streak
              </span>
            </div>
            <p className="text-xs font-medium text-[#64748B] dark:text-gray-400">
              {getStreakMessage()}
            </p>
          </div>
        </div>

        {/* Right: Week visualization */}
        <div className="flex items-center gap-2">
          {daysOfWeek.map((day, index) => {
            const isCompleted = isDayCompleted(index);
            const isToday = index === todayIndex;
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: "spring" }}
                className="flex flex-col items-center gap-1"
              >
                <span className={`text-[10px] font-bold uppercase tracking-wide ${
                  isToday ? 'text-orange-500' : 'text-[#64748B] dark:text-gray-400'
                }`}>
                  {day}
                </span>
                <motion.div
                  className={`relative w-8 h-8 rounded-lg border-2 transition-all duration-300 ${
                    isCompleted
                      ? `bg-gradient-to-br ${getStreakColor()} border-orange-500 shadow-md`
                      : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  } ${isToday ? 'ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-800' : ''}`}
                  whileHover={{ scale: 1.1 }}
                  animate={isToday && currentStreak > 0 ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: index * 0.05 + 0.2 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <Check className="h-4 w-4 text-white" />
                    </motion.div>
                  )}
                  
                  {isToday && !isCompleted && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Milestone hint */}
      {currentStreak > 0 && currentStreak < 7 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-orange-500/20"
        >
          <p className="text-xs font-medium text-[#64748B] dark:text-gray-400 text-center">
            🎯 {7 - currentStreak} more day{7 - currentStreak === 1 ? '' : 's'} to unlock <span className="font-bold text-orange-500">500 MP</span>
          </p>
        </motion.div>
      )}
      
      {currentStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-orange-500/20"
        >
          <p className="text-xs font-bold text-center bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            🏆 7-Day Streak Unlocked! Keep going!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
