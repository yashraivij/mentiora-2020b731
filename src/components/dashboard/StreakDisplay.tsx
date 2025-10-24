import { Card, CardContent } from "@/components/ui/card";
import { Zap, Trophy, Target } from "lucide-react";
import { motion } from "framer-motion";

interface StreakDisplayProps {
  currentStreak: number;
}

export const StreakDisplay = ({ currentStreak }: StreakDisplayProps) => {
  const nextMilestone = currentStreak < 7 ? 7 : currentStreak < 14 ? 14 : currentStreak < 30 ? 30 : currentStreak < 50 ? 50 : currentStreak < 100 ? 100 : currentStreak + 50;
  const progress = (currentStreak / nextMilestone) * 100;
  const daysUntilMilestone = nextMilestone - currentStreak;

  const getStreakMessage = () => {
    if (currentStreak === 0) return "Start your streak today!";
    if (currentStreak < 3) return "Keep it up!";
    if (currentStreak < 7) return "You're on fire!";
    if (currentStreak < 14) return "Incredible dedication!";
    if (currentStreak < 30) return "Unstoppable!";
    return "Legendary streak!";
  };

  const getStreakColor = () => {
    if (currentStreak === 0) return "from-gray-400 to-gray-500";
    if (currentStreak < 7) return "from-orange-400 to-orange-600";
    if (currentStreak < 14) return "from-orange-500 to-red-500";
    if (currentStreak < 30) return "from-red-500 to-pink-600";
    return "from-purple-500 to-pink-600";
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/10 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50"></div>
      
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Study Streak
            </h3>
            <p className="text-sm text-muted-foreground">{getStreakMessage()}</p>
          </div>
          
          {/* Streak counter */}
          <motion.div
            className="flex flex-col items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/30"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="text-4xl font-black text-white drop-shadow-lg">
              {currentStreak}
            </div>
            <div className="text-xs font-semibold text-white/90 uppercase tracking-wide">
              {currentStreak === 1 ? "Day" : "Days"}
            </div>
          </motion.div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="h-3.5 w-3.5" />
              <span className="font-medium">
                {daysUntilMilestone === 0 ? "Milestone reached!" : `${daysUntilMilestone} day${daysUntilMilestone === 1 ? '' : 's'} to ${nextMilestone}`}
              </span>
            </div>
            <span className="font-bold text-foreground">{Math.min(progress, 100).toFixed(0)}%</span>
          </div>
          
          <div className="relative h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
            {/* Shine effect */}
            <motion.div
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1,
              }}
            />
          </div>
        </div>

        {/* Milestone indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${currentStreak >= 7 ? 'bg-green-500' : 'bg-muted'}`}></div>
              <span className={`text-xs font-medium ${currentStreak >= 7 ? 'text-foreground' : 'text-muted-foreground'}`}>7d</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${currentStreak >= 14 ? 'bg-blue-500' : 'bg-muted'}`}></div>
              <span className={`text-xs font-medium ${currentStreak >= 14 ? 'text-foreground' : 'text-muted-foreground'}`}>14d</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${currentStreak >= 30 ? 'bg-purple-500' : 'bg-muted'}`}></div>
              <span className={`text-xs font-medium ${currentStreak >= 30 ? 'text-foreground' : 'text-muted-foreground'}`}>30d</span>
            </div>
          </div>
          
          {currentStreak >= 7 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-primary/80 shadow-md"
            >
              <Trophy className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-bold text-white">Streak Master</span>
            </motion.div>
          )}
        </div>

        {/* Motivational hint */}
        {currentStreak > 0 && currentStreak < 7 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20"
          >
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-foreground font-medium">
                Keep practicing daily to unlock the <span className="font-bold text-primary">500 MP</span> bonus at 7 days!
              </p>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
