import { Card, CardContent } from "@/components/ui/card";
import { Flame, Target, Trophy } from "lucide-react";
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

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-card via-card to-primary/5">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-xl opacity-30"></div>
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between gap-6">
          {/* Left side - Text and streak */}
          <div className="flex items-center gap-4 flex-1">
            <motion.div
              animate={{
                scale: currentStreak > 0 ? [1, 1.15, 1] : 1,
                rotate: currentStreak > 0 ? [0, -8, 8, 0] : 0,
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex-shrink-0"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                currentStreak > 0 
                  ? 'bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30' 
                  : 'bg-muted'
              }`}>
                <Flame className={`h-8 w-8 ${currentStreak > 0 ? 'text-white' : 'text-muted-foreground'}`} />
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="text-2xl font-bold text-foreground">Study Streak</h3>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30"
                >
                  <span className="text-xl font-black text-primary">{currentStreak}</span>
                  <span className="text-xs font-semibold text-primary uppercase">
                    {currentStreak === 1 ? "day" : "days"}
                  </span>
                </motion.div>
              </div>
              <p className="text-sm text-muted-foreground font-medium">{getStreakMessage()}</p>
            </div>
          </div>

          {/* Right side - Milestone badge */}
          {currentStreak >= 7 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="flex-shrink-0"
            >
              <div className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30">
                <Trophy className="h-5 w-5 text-white" />
                <span className="text-xs font-bold text-white whitespace-nowrap">Streak Master</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress section */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium">
                {daysUntilMilestone === 0 ? "Milestone reached!" : `${daysUntilMilestone} day${daysUntilMilestone === 1 ? '' : 's'} to ${nextMilestone}`}
              </span>
            </div>
            <span className="font-bold text-primary">{Math.min(progress, 100).toFixed(0)}%</span>
          </div>
          
          <div className="relative h-2.5 bg-muted rounded-full overflow-hidden border border-border">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {/* Animated shine */}
            <motion.div
              className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
              }}
            />
          </div>

          {/* Milestone dots */}
          <div className="flex items-center gap-3 pt-2">
            {[7, 14, 30, 50].map((milestone) => (
              <div key={milestone} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentStreak >= milestone 
                    ? 'bg-primary shadow-sm shadow-primary/50 scale-110' 
                    : 'bg-muted'
                }`}></div>
                <span className={`text-xs font-medium transition-colors ${
                  currentStreak >= milestone ? 'text-primary' : 'text-muted-foreground'
                }`}>{milestone}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message for new streakers */}
        {currentStreak > 0 && currentStreak < 7 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
          >
            <p className="text-xs text-foreground font-medium text-center">
              🎯 Keep practicing daily to unlock <span className="font-bold text-primary">500 MP</span> at 7 days!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
