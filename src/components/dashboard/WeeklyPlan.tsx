import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, Video, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface WeeklyPlanProps {
  weakTopics: { topicId: string; subjectId: string; score: number }[];
  targetGrades: { subject: string; target: number }[];
}

export const WeeklyPlan = ({ weakTopics, targetGrades }: WeeklyPlanProps) => {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Generate AI-powered study plan
  const generatePlan = () => {
    const plan = weekDays.map((day, index) => {
      const topic = weakTopics[index % weakTopics.length];
      const resources = [
        { type: "past-paper", label: "Past Paper", icon: FileText },
        { type: "video", label: "Video Tutorial", icon: Video },
        { type: "quiz", label: "Practice Quiz", icon: BookOpen },
      ];
      
      return {
        day,
        topic: topic?.topicId || "Review strong topics",
        subject: topic?.subjectId || "General",
        duration: 45 + Math.floor(Math.random() * 30),
        resource: resources[index % resources.length],
        completed: completedDays.has(day),
      };
    });
    return plan;
  };

  const weeklyPlan = generatePlan();
  const completionRate = (completedDays.size / weekDays.length) * 100;

  const toggleDay = (day: string) => {
    setCompletedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  };

  const averageTarget = targetGrades.length > 0
    ? Math.round(targetGrades.reduce((sum, g) => sum + g.target, 0) / targetGrades.length)
    : 7;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Your Weekly Improvement Plan
              </h2>
              <p className="text-muted-foreground">
                Here's your optimized plan to reach grade {averageTarget}. Focus on these key areas this week.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{completedDays.size}/7</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyPlan.map((plan) => {
          const ResourceIcon = plan.resource.icon;
          return (
            <Card
              key={plan.day}
              className={`border-0 shadow-lg transition-all duration-200 ${
                plan.completed
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 ring-2 ring-emerald-500/20"
                  : "hover:shadow-xl"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">{plan.day}</CardTitle>
                  {plan.completed && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {plan.subject}
                  </Badge>
                  <h3 className="font-medium text-foreground mb-2">{plan.topic}</h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{plan.duration} mins</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <ResourceIcon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{plan.resource.label}</span>
                </div>

                <Button
                  size="sm"
                  variant={plan.completed ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggleDay(plan.day)}
                >
                  {plan.completed ? "Mark Incomplete" : "Mark Complete"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">{weeklyPlan.length}</div>
            <div className="text-sm text-muted-foreground">Days Planned</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-success mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">
              {weeklyPlan.reduce((sum, p) => sum + p.duration, 0)} mins
            </div>
            <div className="text-sm text-muted-foreground">Total Study Time</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <BookOpen className="h-8 w-8 text-warning mx-auto mb-3" />
            <div className="text-2xl font-bold text-foreground">{weakTopics.length}</div>
            <div className="text-sm text-muted-foreground">Topics to Master</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
