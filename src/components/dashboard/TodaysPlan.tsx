import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Target, Brain, CheckCircle2, PlayCircle } from "lucide-react";
import { useState } from "react";

interface TodaysPlanProps {
  userId: string;
}

export function TodaysPlan({ userId }: TodaysPlanProps) {
  // Mock data - in real app this would come from backend based on user's diagnostic results
  const [completedSessions, setCompletedSessions] = useState<Set<number>>(new Set());
  
  const todaysPlan = {
    dayNumber: 1,
    focus: "Algebra",
    reason: "your weakest area",
    totalMinutes: 20,
    sessions: [
      {
        id: 1,
        type: "Learn",
        title: "Linear Equations Fundamentals",
        description: "Master the basics of solving linear equations",
        duration: 5,
        xp: 15,
      },
      {
        id: 2,
        type: "Practice",
        title: "Solve 10 Algebra Problems",
        description: "Apply what you learned with practice questions",
        duration: 12,
        xp: 30,
      },
      {
        id: 3,
        type: "Review",
        title: "Quick Review & Reflection",
        description: "Solidify your understanding",
        duration: 3,
        xp: 10,
      },
    ],
  };

  const handleStartSession = (sessionId: number) => {
    // In real app, navigate to the session
    console.log(`Starting session ${sessionId}`);
  };

  const totalXP = todaysPlan.sessions.reduce((sum, session) => sum + session.xp, 0);
  const completedXP = Array.from(completedSessions).reduce(
    (sum, id) => sum + (todaysPlan.sessions.find(s => s.id === id)?.xp || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-primary/5 dark:from-gray-900 dark:via-gray-900 dark:to-primary/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-primary/10 dark:border-primary/20"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-0 px-4 py-1.5 text-sm font-bold uppercase tracking-wide">
                Day {todaysPlan.dayNumber}
              </Badge>
              <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-0 px-4 py-1.5 text-sm font-medium">
                🔥 Active
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total XP Available</div>
              <div className="text-2xl font-bold text-foreground">+{totalXP}</div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Your Plan for Today
            </h1>
            <div className="flex items-center gap-2 text-lg text-primary font-medium">
              <Target className="w-5 h-5" />
              <span>Focus: {todaysPlan.focus}</span>
              <span className="text-muted-foreground">({todaysPlan.reason})</span>
            </div>
          </div>

          {/* Why This Plan */}
          <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 mb-6">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Brain className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Why we chose this</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Your diagnostic showed that Algebra is your biggest opportunity for improvement 
                    (40% accuracy). Focusing here first gives you the highest score gains with the 
                    least amount of time. We'll tackle this systematically over the next few days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Time Commitment */}
          <div className="flex items-center gap-2 text-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">Total time: {todaysPlan.totalMinutes} minutes</span>
            <span className="text-muted-foreground text-sm">• Just 20 mins to level up</span>
          </div>
        </div>
      </motion.div>

      {/* Session Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground px-1">Today's Sessions</h2>
        
        {todaysPlan.sessions.map((session, index) => {
          const isCompleted = completedSessions.has(session.id);
          const isLocked = index > 0 && !completedSessions.has(todaysPlan.sessions[index - 1].id);
          
          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`overflow-hidden transition-all duration-200 ${
                  isCompleted
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900"
                    : isLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge
                          variant="outline"
                          className="font-medium text-xs bg-background"
                        >
                          {session.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Session {session.id}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {session.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {session.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {session.duration} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          +{session.xp} XP
                        </span>
                      </div>
                    </div>

                    {/* Right Action */}
                    <div className="flex flex-col items-center gap-2">
                      {isCompleted ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                          </div>
                          <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Completed
                          </span>
                        </>
                      ) : isLocked ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-2xl">🔒</span>
                          </div>
                          <span className="text-xs text-muted-foreground text-center max-w-[80px]">
                            Complete Session {index} first
                          </span>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleStartSession(session.id)}
                          className="w-16 h-16 rounded-full p-0 bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                          <PlayCircle className="w-8 h-8" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      {completedSessions.size === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Ready to start? Click on Session 1 above to begin your journey.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8"
                onClick={() => handleStartSession(1)}
              >
                Start Session 1 →
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* All Completed State */}
      {completedSessions.size === todaysPlan.sessions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-8"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Day {todaysPlan.dayNumber} Complete!
          </h2>
          <p className="text-muted-foreground mb-6">
            Great work! You earned +{completedXP} XP today.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="lg">
              View Today's Results
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              Extra Practice →
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
