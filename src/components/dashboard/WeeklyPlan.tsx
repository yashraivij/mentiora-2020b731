import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Book, Video, FileText, Target, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WeeklyPlanProps {
  weakTopics: { topicId: string; subjectId: string; score: number }[];
  targetGrades: { subject: string; target: number }[];
}

export const WeeklyPlan = ({ weakTopics, targetGrades }: WeeklyPlanProps) => {
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Generate AI-powered study plan
  const generatePlan = () => {
    const resources = [
      "Past Paper Questions - Practice Paper 1",
      "Video Tutorial - Core Concepts",
      "Interactive Quiz - Topic Mastery",
      "Revision Notes - Key Points",
      "Practice Questions - Mixed Topics",
      "Video Lesson - Advanced Topics",
      "Past Paper - Full Mock Exam",
    ];
    
    return weekDays.map((day, index) => {
      const topic = weakTopics[index % weakTopics.length];
      const duration = `${45 + Math.floor(Math.random() * 30)} mins`;
      
      return {
        day,
        topic: topic?.topicId || "Review strong topics",
        subject: topic?.subjectId || "General",
        duration,
        resource: resources[index],
      };
    });
  };

  const weeklyPlan = generatePlan();

  const toggleDay = (day: string) => {
    setCompletedDays((prev) => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const averageTarget = targetGrades.length > 0
    ? Math.round(targetGrades.reduce((sum, g) => sum + g.target, 0) / targetGrades.length)
    : 7;

  return (
    <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
      <div className="absolute inset-0 bg-[var(--gradient-rainbow)] opacity-5" />
      <div className="relative backdrop-blur-sm bg-card/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary via-success to-info bg-clip-text text-transparent">
            <BookOpen className="h-6 w-6 text-primary animate-pulse" />
            Your Weekly Improvement Plan
          </CardTitle>
          <p className="text-sm text-muted-foreground font-medium">
            Here's your optimized plan to reach grade {averageTarget}. Focus on these key areas this week.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weeklyPlan.map((dayPlan, idx) => {
            const isCompleted = completedDays.includes(dayPlan.day);
            const gradients = [
              'from-primary/20 to-info/20',
              'from-success/20 to-primary/20',
              'from-warning/20 to-success/20',
              'from-info/20 to-warning/20',
              'from-primary/20 to-success/20',
              'from-success/20 to-info/20',
              'from-info/20 to-primary/20',
            ];
            
            return (
              <div
                key={idx}
                className={cn(
                  "relative overflow-hidden p-5 rounded-xl border-2 transition-all duration-300 group",
                  isCompleted
                    ? "bg-success/20 border-success shadow-[0_0_20px_hsl(var(--success)/0.4)]"
                    : "bg-card/50 border-border hover:border-primary/50 hover:shadow-[var(--shadow-md)]"
                )}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradients[idx]} opacity-30 group-hover:opacity-50 transition-opacity`} />
                <div className="relative flex items-center justify-between mb-3">
                  <h3 className="font-bold text-xl text-foreground">{dayPlan.day}</h3>
                  <Button
                    size="sm"
                    variant={isCompleted ? "default" : "outline"}
                    onClick={() => toggleDay(dayPlan.day)}
                    className={cn(
                      "transition-all duration-300 hover:scale-110",
                      isCompleted && "bg-success hover:bg-success shadow-[0_0_16px_hsl(var(--success)/0.6)]"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Circle className="h-5 w-5" />
                    )}
                  </Button>
                </div>

                <div className="relative space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <Book className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-foreground">{dayPlan.subject}</p>
                      <p className="text-xs text-muted-foreground font-medium">{dayPlan.topic}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-info/10">
                    <Clock className="h-5 w-5 text-info flex-shrink-0" />
                    <p className="text-sm font-semibold text-foreground">{dayPlan.duration}</p>
                  </div>

                  <div className="flex items-start gap-3 p-2 rounded-lg bg-warning/10">
                    <Target className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                    <p className="text-xs text-foreground font-medium">{dayPlan.resource}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Badge className="py-2 px-4 bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-md)]">
                <Target className="h-4 w-4 mr-2" />
                {completedDays.length}/{weeklyPlan.length} days complete
              </Badge>
              <div className="flex flex-col gap-2">
                <Progress
                  value={(completedDays.length / weeklyPlan.length) * 100}
                  className="w-40 h-3"
                />
                <p className="text-xs text-muted-foreground font-medium">
                  {Math.round((completedDays.length / weeklyPlan.length) * 100)}% completed
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground font-semibold bg-success/10 py-2 px-4 rounded-lg border border-success/20">
              Keep going! Stay consistent 🚀
            </p>
          </div>
        </div>
      </CardContent>
      </div>
    </Card>
  );
};
