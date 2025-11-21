import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Target, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface TodaysPlanProps {
  userId: string;
  userSubjects: Array<{
    id: string;
    name: string;
    icon?: string;
    status: string;
    pred?: number;
    target: number;
  }>;
  onStartPractice?: (subjectId: string) => void;
}

interface DailyPlan {
  focus: string;
  subjectId: string;
  subjectName: string;
  emoji: string;
  reason: string;
  tasks: Array<{
    title: string;
    duration: string;
    completed: boolean;
  }>;
  totalMinutes: number;
}

export function TodaysPlan({ userId, userSubjects, onStartPractice }: TodaysPlanProps) {
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate adaptive plan based on user's weakest subject and today's date
  useEffect(() => {
    const generatePlan = async () => {
      if (!userId || userSubjects.length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Find the subject with the biggest gap (lowest pred vs target)
        const subjectWithGap = userSubjects
          .map(s => ({
            ...s,
            gap: s.target - (s.pred || 0)
          }))
          .filter(s => s.gap > 0)
          .sort((a, b) => b.gap - a.gap)[0];

        if (!subjectWithGap) {
          // If no gaps, focus on first subject
          const firstSubject = userSubjects[0];
          setPlan({
            focus: "Maintain Excellence",
            subjectId: firstSubject.id,
            subjectName: firstSubject.name,
            emoji: firstSubject.icon || "📚",
            reason: "Keep your momentum going",
            tasks: [
              { title: "5-min warm-up questions", duration: "5 min", completed: false },
              { title: "Practice 3 challenging problems", duration: "10 min", completed: false },
              { title: "Quick review", duration: "5 min", completed: false },
            ],
            totalMinutes: 20
          });
          setLoading(false);
          return;
        }

        // Get subject emoji
        const emojiMap: { [key: string]: string } = {
          "math": "📐",
          "reading": "📖",
          "writing": "✍️",
          "physics": "🧲",
          "chemistry": "🧪",
          "biology": "🧬",
          "english": "📝",
          "history": "⏳",
          "geography": "🌍",
        };

        const subjectKey = subjectWithGap.id.toLowerCase().split('-')[0];
        const emoji = emojiMap[subjectKey] || subjectWithGap.icon || "📚";

        // Check for completed tasks today
        const today = new Date().toISOString().split('T')[0];
        const { data: completedTasks } = await supabase
          .from('subject_daily_tasks')
          .select('task_id')
          .eq('user_id', userId)
          .eq('subject_id', subjectWithGap.id)
          .eq('date', today)
          .eq('completed', true);

        const completedTaskIds = new Set(completedTasks?.map(t => t.task_id) || []);

        setPlan({
          focus: subjectWithGap.name,
          subjectId: subjectWithGap.id,
          subjectName: subjectWithGap.name,
          emoji,
          reason: `${Math.round(subjectWithGap.gap)} grade points to your target`,
          tasks: [
            { 
              title: "5-min focused lesson", 
              duration: "5 min", 
              completed: completedTaskIds.has('lesson-1')
            },
            { 
              title: "10 practice questions", 
              duration: "10 min", 
              completed: completedTaskIds.has('practice-1')
            },
            { 
              title: "Quick review & notes", 
              duration: "5 min", 
              completed: completedTaskIds.has('review-1')
            },
          ],
          totalMinutes: 20
        });
      } catch (error) {
        console.error('Error generating plan:', error);
      } finally {
        setLoading(false);
      }
    };

    generatePlan();
  }, [userId, userSubjects]);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-border/50 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="rounded-3xl border border-border/50 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-8">
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Ready to start?</h3>
            <p className="text-muted-foreground">Add subjects to get your personalized daily plan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const completedCount = plan.tasks.filter(t => t.completed).length;
  const progressPercent = (completedCount / plan.tasks.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="rounded-3xl border-2 border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 via-background to-primary/5 overflow-hidden relative">
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-50"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{ backgroundSize: '200% 200%' }}
        />

        <CardContent className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                  <Calendar className="h-3 w-3 mr-1" />
                  TODAY
                </Badge>
                <Badge variant="outline" className="font-medium">
                  <Clock className="h-3 w-3 mr-1" />
                  {plan.totalMinutes} min
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-1">
                Today's Focus: {plan.emoji} {plan.focus}
              </h2>
              <p className="text-muted-foreground text-lg">
                {plan.reason}
              </p>
            </div>
            {progressPercent > 0 && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary">
                  {completedCount}/{plan.tasks.length}
                </div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Done
                </div>
              </motion.div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-primary to-primary/60"
              />
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-3 mb-6">
            {plan.tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  task.completed
                    ? 'bg-primary/5 border-primary/30'
                    : 'bg-card border-border hover:border-primary/30'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.completed
                    ? 'bg-primary border-primary'
                    : 'border-muted-foreground'
                }`}>
                  {task.completed && (
                    <svg className="w-4 h-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {task.duration}
                </Badge>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <Button
            size="lg"
            onClick={() => onStartPractice?.(plan.subjectId)}
            className="w-full rounded-2xl h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {completedCount === plan.tasks.length ? (
              <>Great work! Continue tomorrow</>
            ) : completedCount > 0 ? (
              <>Continue Today's Plan</>
            ) : (
              <>Start Today's Plan</>
            )}
            <ChevronRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
