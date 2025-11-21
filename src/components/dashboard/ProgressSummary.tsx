import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";

interface ProgressSummaryProps {
  currentScore: number;
  targetScore: number;
  daysToExam: number;
  streakDays: number;
}

export function ProgressSummary({
  currentScore,
  targetScore,
  daysToExam,
  streakDays,
}: ProgressSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8"
    >
      <Card className="border border-border bg-card shadow-sm">
        <div className="p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6">
          {/* Score Progress */}
          <div className="flex items-center gap-2 text-base font-medium text-foreground">
            <span>Current: {currentScore}</span>
            <span className="text-primary">→</span>
            <span>Target: {targetScore}</span>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Days to Exam */}
          <div className="flex items-center gap-2 text-base font-medium text-foreground">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{daysToExam} days to exam</span>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Streak */}
          <div className="flex items-center gap-2 text-base font-medium text-foreground">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>{streakDays}-day streak</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
