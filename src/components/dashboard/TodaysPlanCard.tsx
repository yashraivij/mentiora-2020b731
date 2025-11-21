import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, Circle, CheckCircle2 } from "lucide-react";

interface Part {
  number: number;
  name: string;
  description: string;
  questions: number;
  minutes: number;
  xp: number;
  status: "not_started" | "completed" | "locked";
  locked: boolean;
  unlock_message?: string;
}

interface TodaysPlanCardProps {
  dayNumber: number;
  focusTopic: string;
  focusReason: string;
  parts: Part[];
  allCompleted: boolean;
  onStartPart: (partNumber: number) => void;
}

export function TodaysPlanCard({
  dayNumber,
  focusTopic,
  focusReason,
  parts,
  allCompleted,
  onStartPart,
}: TodaysPlanCardProps) {
  const activePart = parts.find((p) => p.status === "not_started" && !p.locked);

  if (allCompleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10 mb-8"
      >
        <Card className="border border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Day {dayNumber} Complete!
            </h2>
            <p className="text-xl font-medium text-primary mb-2">
              25/30 correct (83%)
            </p>
            <p className="text-base text-muted-foreground mb-6">
              +150 XP earned
            </p>
            <p className="text-base font-medium text-green-600 mb-4">
              Linear Equations: 40% → 75% 📈
            </p>
            <p className="text-base font-medium text-orange-500 mb-8">
              🔥 3-day streak maintained
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Button
                variant="outline"
                className="flex-1 h-12"
                onClick={() => {}}
              >
                View Results
              </Button>
              <Button className="flex-1 h-12" onClick={() => {}}>
                Extra Practice →
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-10 mb-8"
    >
      <Card className="border border-border bg-card shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <h2 className="text-2xl font-bold text-foreground">
                Today's Plan
              </h2>
            </div>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary text-sm font-medium px-3 py-1"
            >
              Day {dayNumber}
            </Badge>
          </div>
          <p className="text-base text-muted-foreground">
            Focus: {focusTopic} • {focusReason}
          </p>
        </CardHeader>

        <CardContent className="pb-8">
          {/* 4 Part Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {parts.map((part, index) => (
              <motion.div
                key={part.number}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className={`
                    rounded-xl p-5 transition-all duration-150
                    ${
                      part.status === "completed"
                        ? "border-2 border-green-500 bg-green-50/50 dark:bg-green-950/20 opacity-80"
                        : part.status === "not_started" && !part.locked
                        ? "border-2 border-primary bg-primary/5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md"
                        : "border-2 border-border bg-muted/50 opacity-60 cursor-not-allowed"
                    }
                  `}
                  onClick={() => {
                    if (part.status === "not_started" && !part.locked) {
                      onStartPart(part.number);
                    }
                  }}
                >
                  {/* Title Row */}
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-bold text-foreground">
                      Part {part.number}: {part.name}
                    </h3>
                    <div className="ml-2 flex-shrink-0">
                      {part.status === "completed" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : part.locked ? (
                        <Lock className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Circle className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-1">
                    → {part.description}
                  </p>

                  {/* Meta */}
                  <p className="text-xs text-muted-foreground/80">
                    {part.questions} questions • {part.minutes} mins • +
                    {part.xp} XP
                  </p>

                  {/* Lock Message */}
                  {part.locked && part.unlock_message && (
                    <p className="text-xs italic text-muted-foreground/70 mt-1.5">
                      {part.unlock_message}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Start Button */}
          <Button
            className="w-full h-[52px] text-base font-bold"
            onClick={() => activePart && onStartPart(activePart.number)}
            disabled={!activePart}
          >
            Start Part {activePart?.number || 1} →
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
