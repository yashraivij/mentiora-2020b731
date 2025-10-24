import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCardProps {
  currentStreak: number;
}

export const StreakCard = ({ currentStreak }: StreakCardProps) => {
  const totalDays = 7;
  
  const getCircleColor = (index: number) => {
    if (index === 0) return "from-pink-500 to-pink-600";
    if (index === 1) return "from-purple-500 to-purple-600";
    if (index === 2) return "from-blue-500 to-blue-600";
    if (index === 3) return "from-cyan-500 to-cyan-600";
    if (index === 4) return "from-teal-500 to-teal-600";
    if (index === 5) return "from-green-500 to-green-600";
    return "from-emerald-500 to-emerald-600";
  };

  return (
    <Card className="relative overflow-hidden border-2 border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      
      <CardContent className="relative p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Header text */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <p className="text-sm font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wider">
              You're on a
            </p>
            <div className="flex items-center justify-center gap-2">
              <motion.h2
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-5xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
              >
                {currentStreak} day
              </motion.h2>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="text-5xl font-black bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent"
              >
                streak
              </motion.span>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.3 }}
              >
                <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Progress circles */}
          <div className="flex items-center justify-center gap-0 w-full max-w-2xl">
            {Array.from({ length: totalDays }).map((_, index) => {
              const isCompleted = index < currentStreak;
              const isNext = index === currentStreak;
              
              return (
                <div key={index} className="flex items-center">
                  {/* Circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      delay: 0.4 + (index * 0.08),
                      stiffness: 200 
                    }}
                    className="relative"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        isCompleted
                          ? `bg-gradient-to-br ${getCircleColor(index)} border-white dark:border-gray-900 shadow-lg`
                          : isNext
                          ? 'border-orange-300 dark:border-orange-800 bg-white dark:bg-gray-800 ring-2 ring-orange-400 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                          : 'border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-800'
                      }`}
                    >
                      {isCompleted && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + (index * 0.08) }}
                        >
                          <Check className="h-6 w-6 text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                      {isNext && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-3 h-3 rounded-full bg-orange-500"
                        />
                      )}
                    </div>
                  </motion.div>

                  {/* Connecting line */}
                  {index < totalDays - 1 && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.5 + (index * 0.08) }}
                      className="origin-left"
                    >
                      <div
                        className={`h-1 w-8 transition-all duration-300 ${
                          index < currentStreak - 1
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500'
                            : index === currentStreak - 1
                            ? 'bg-gradient-to-r from-blue-500 to-transparent'
                            : 'border-t-2 border-dashed border-[#E2E8F0] dark:border-gray-700'
                        }`}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Motivational text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-[#64748B] dark:text-gray-400 text-center max-w-md"
          >
            {currentStreak === 0 && "Start practicing today to begin your streak!"}
            {currentStreak > 0 && currentStreak < 3 && "Great start! Keep practicing daily to build your streak."}
            {currentStreak >= 3 && currentStreak < 7 && "You're on fire! Keep it up to reach 7 days."}
            {currentStreak >= 7 && "Amazing! You've completed a full week streak! 🎉"}
          </motion.p>
        </div>
      </CardContent>
    </Card>
  );
};
