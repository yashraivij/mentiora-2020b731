import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Lock, Flame } from "lucide-react";

interface TodaysPlanCardProps {
  currentScore: number;
  targetScore: number;
  streakDays: number;
  dayNumber: number;
  onStartSession: () => void;
}

export function TodaysPlanCard({
  currentScore = 790,
  targetScore = 980,
  streakDays = 2,
  dayNumber = 2,
  onStartSession,
}: TodaysPlanCardProps) {
  const progressPercentage = (currentScore / targetScore) * 100;
  const daysToExam = 58; // This should come from user data

  const sessions = [
    {
      id: 1,
      title: "Part 1: Diagnostic",
      subtitle: "5 questions, 3 mins",
      locked: false,
      completed: false,
    },
    {
      id: 2,
      title: "Part 2: Focus Practice",
      subtitle: "12 questions, 8 mins",
      locked: true,
      completed: false,
    },
    {
      id: 3,
      title: "Part 3: Retention",
      subtitle: "8 questions, 6 mins",
      locked: true,
      completed: false,
    },
    {
      id: 4,
      title: "Part 4: Challenge",
      subtitle: "5 questions, 3 mins",
      locked: true,
      completed: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="overflow-hidden border border-border bg-card shadow-lg">
        <CardHeader className="border-b border-border bg-muted/30 pb-4">
          <div className="flex items-center justify-between">
            {/* Left side - Day badge */}
            <Badge className="bg-[#B4FF39]/20 text-[#B4FF39] border-0 px-4 py-1.5 text-xs font-bold uppercase tracking-wider">
              DAY {dayNumber}
            </Badge>

            {/* Right side - Streak */}
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              <span>{streakDays}-day streak</span>
            </div>
          </div>

          {/* Heading and subheading */}
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              📋 Today's Plan
            </h2>
            <p className="text-sm text-muted-foreground">
              Day {dayNumber} • Focus: Linear Equations (your weakest area)
            </p>
          </div>

          {/* Progress bar - one line */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                <span>Current: {currentScore}</span>
                <span>Target: {targetScore}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
              <span>{daysToExam} days to exam</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Four mini session cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-xl p-4 transition-all ${
                  session.locked
                    ? "bg-muted/50 border border-border cursor-not-allowed opacity-60"
                    : session.completed
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500"
                    : "bg-card border-2 border-primary hover:shadow-lg cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground text-sm mb-1">
                      {session.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {session.subtitle}
                    </p>
                  </div>
                  <div className="ml-2">
                    {session.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : session.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : null}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Big CTA button */}
          <Button
            onClick={onStartSession}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold rounded-xl shadow-lg"
          >
            Start Diagnostic →
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
