import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StreakCardProps {
  currentStreak: number;
}

export const StreakCard = ({ currentStreak }: StreakCardProps) => {
  const totalDays = 7;

  return (
    <Card className="relative overflow-hidden border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-sm">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0EA5E9]/5 to-[#38BDF8]/5 rounded-full blur-2xl"></div>
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          {/* Left: Text */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider mb-1">
              Study Streak
            </p>
            <div className="flex items-center gap-2">
              <motion.h3
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="text-3xl font-bold text-[#0F172A] dark:text-white"
              >
                {currentStreak}
              </motion.h3>
              <span className="text-base font-medium text-[#64748B] dark:text-gray-400">
                {currentStreak === 1 ? 'day' : 'days'}
              </span>
              {currentStreak >= 3 && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Sparkles className="h-5 w-5 text-[#0EA5E9]" />
                </motion.div>
              )}
            </div>
            <p className="text-xs text-[#64748B] dark:text-gray-400 mt-1">
              {currentStreak === 0 && "Start practicing today"}
              {currentStreak > 0 && currentStreak < 3 && "Keep it up!"}
              {currentStreak >= 3 && currentStreak < 7 && "You're on fire"}
              {currentStreak >= 7 && "Amazing work!"}
            </p>
          </div>

          {/* Right: Progress circles */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalDays }).map((_, index) => {
              const isCompleted = index < currentStreak;
              const isNext = index === currentStreak;
              
              return (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    delay: 0.3 + (index * 0.05),
                    stiffness: 300 
                  }}
                  className="relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] border-[#0EA5E9] shadow-md'
                        : isNext
                        ? 'border-[#0EA5E9]/50 bg-[#0EA5E9]/5 ring-1 ring-[#0EA5E9]/30'
                        : 'border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + (index * 0.05) }}
                      >
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    {isNext && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 rounded-full bg-[#0EA5E9]"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
