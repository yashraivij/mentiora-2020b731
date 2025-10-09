import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, BookOpen, CheckCircle2, Target, Brain, Sparkles, TrendingUp, Zap, RotateCcw } from "lucide-react";
import { useState } from "react";

interface WeeklyPlanProps {
  weakTopics: { topicId: string; subjectId: string; score: number }[];
  targetGrades: { subject: string; target: number }[];
}

interface DayTask {
  emoji: string;
  topic: string;
  subject: string;
  activity: string;
  duration: number;
  difficulty: "weak" | "moderate" | "strong";
}

interface DayPlan {
  day: string;
  theme: string;
  tasks: DayTask[];
  aiTip?: string;
  completed: boolean;
}

export const WeeklyPlan = ({ weakTopics, targetGrades }: WeeklyPlanProps) => {
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const dayThemes = [
    { theme: "Kickstart Week", icon: Zap },
    { theme: "Strengthen Recall", icon: Brain },
    { theme: "Mid-Week Mastery", icon: Target },
    { theme: "Apply & Connect", icon: Sparkles },
    { theme: "Checkpoint", icon: TrendingUp },
    { theme: "Light Review", icon: BookOpen },
    { theme: "Reset & Plan", icon: RotateCcw },
  ];

  const subjectEmojis: Record<string, string> = {
    biology: "🧬",
    chemistry: "⚗️",
    physics: "⚡",
    maths: "📐",
    "combined-science": "🔬",
    geography: "🌍",
    business: "💼",
  };

  // Generate AI-powered study plan
  const generatePlan = (): DayPlan[] => {
    return weekDays.map((day, index) => {
      const tasks: DayTask[] = [];
      const weakTopicsForDay = weakTopics.slice(index * 2, index * 2 + 2);
      
      // Add tasks based on day theme
      if (index === 0) { // Monday - Kickstart
        weakTopicsForDay.forEach((topic, i) => {
          if (i === 0) {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "Create 10 flashcards + do short 5-Q quiz",
              duration: 25,
              difficulty: "weak"
            });
          } else {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "Watch AI explanation → attempt questions again",
              duration: 20,
              difficulty: "weak"
            });
          }
        });
        tasks.push({
          emoji: "📈",
          topic: "Progress Review",
          subject: "General",
          activity: "Reflect on yesterday's mistakes – keep streak alive!",
          duration: 5,
          difficulty: "moderate"
        });
      } else if (index === 1) { // Tuesday - Strengthen Recall
        weakTopicsForDay.forEach((topic, i) => {
          if (i === 0) {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "Practice set + mark scheme review",
              duration: 30,
              difficulty: "weak"
            });
          } else {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "Timed quiz (10 Qs) + review AI tips",
              duration: 25,
              difficulty: "moderate"
            });
          }
        });
        tasks.push({
          emoji: "🔁",
          topic: "Flashcard Review",
          subject: "General",
          activity: "Quick review of Monday's flashcards",
          duration: 10,
          difficulty: "moderate"
        });
      } else if (index === 2) { // Wednesday - Mid-week Mastery
        const mainTopic = weakTopicsForDay[0];
        if (mainTopic) {
          tasks.push({
            emoji: subjectEmojis[mainTopic.subjectId] || "📚",
            topic: mainTopic.topicId,
            subject: mainTopic.subjectId,
            activity: "Re-test (10 Qs) — target ≥ 70%",
            duration: 25,
            difficulty: "weak"
          });
        }
        const secondTopic = weakTopicsForDay[1];
        if (secondTopic) {
          tasks.push({
            emoji: subjectEmojis[secondTopic.subjectId] || "📚",
            topic: secondTopic.topicId,
            subject: secondTopic.subjectId,
            activity: "Mini-exam (8 Qs) + step-by-step feedback",
            duration: 30,
            difficulty: "weak"
          });
        }
      } else if (index === 3) { // Thursday - Apply & Connect
        weakTopicsForDay.forEach((topic, i) => {
          if (i === 0) {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "Problem set (12 Qs) + graph interpretation",
              duration: 35,
              difficulty: "weak"
            });
          } else {
            tasks.push({
              emoji: subjectEmojis[topic.subjectId] || "📚",
              topic: topic.topicId,
              subject: topic.subjectId,
              activity: "AI explanation + summary note creation",
              duration: 25,
              difficulty: "moderate"
            });
          }
        });
      } else if (index === 4) { // Friday - Checkpoint
        const combinedTopics = weakTopicsForDay.map(t => t.topicId).join(" & ");
        if (weakTopicsForDay.length > 0) {
          tasks.push({
            emoji: "⚡",
            topic: combinedTopics,
            subject: weakTopicsForDay[0].subjectId,
            activity: "Joint test (15 Qs)",
            duration: 35,
            difficulty: "weak"
          });
        }
        tasks.push({
          emoji: "📖",
          topic: "AI Review Session",
          subject: "General",
          activity: "Automatically explain wrong answers",
          duration: 15,
          difficulty: "moderate"
        });
        tasks.push({
          emoji: "🧘‍♀️",
          topic: "Motivation Boost",
          subject: "General",
          activity: "Motivation message + streak bonus if 5 days completed",
          duration: 5,
          difficulty: "strong"
        });
      } else if (index === 5) { // Saturday - Light Review
        tasks.push({
          emoji: "📘",
          topic: "Strong Topics",
          subject: "General",
          activity: "Quick 5 Qs on your best subjects",
          duration: 15,
          difficulty: "strong"
        });
        tasks.push({
          emoji: "🌳",
          topic: "Flashcard Recap",
          subject: "General",
          activity: "Flashcard recap + teach-it-back exercise",
          duration: 20,
          difficulty: "strong"
        });
      } else if (index === 6) { // Sunday - Reset & Plan
        tasks.push({
          emoji: "🧠",
          topic: "Full Week Recap",
          subject: "General",
          activity: "Full-week recap quiz (25 Qs mix)",
          duration: 45,
          difficulty: "moderate"
        });
        tasks.push({
          emoji: "📅",
          topic: "Next Week Planning",
          subject: "General",
          activity: "Auto-generate next week's plan based on new weakness map",
          duration: 10,
          difficulty: "moderate"
        });
      }
      
      // Add AI tips for specific days
      let aiTip: string | undefined;
      if (index === 0) {
        aiTip = "Learned from your last mistakes – keep streak alive!";
      } else if (index === 2) {
        aiTip = "Add 2 new flashcards on your mistakes.";
      } else if (index === 4) {
        aiTip = "You're halfway through! Review shows 23% improvement.";
      }
      
      return {
        day,
        theme: dayThemes[index].theme,
        tasks,
        aiTip,
        completed: completedDays.has(day),
      };
    });
  };

  const weeklyPlan = generatePlan();
  const completionRate = (completedDays.size / weekDays.length) * 100;
  const totalStudyTime = weeklyPlan.reduce((sum, day) => 
    sum + day.tasks.reduce((taskSum, task) => taskSum + task.duration, 0), 0
  );

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "weak": return "text-destructive";
      case "moderate": return "text-warning";
      case "strong": return "text-success";
      default: return "text-muted-foreground";
    }
  };

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
              <div className="text-sm text-muted-foreground">Days Completed</div>
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

      {/* Weekly Calendar Layout */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {weeklyPlan.map((dayPlan) => {
          const ThemeIcon = dayThemes[weekDays.indexOf(dayPlan.day)].icon;
          return (
            <Card
              key={dayPlan.day}
              className={`border-0 shadow-lg transition-all duration-200 ${
                dayPlan.completed
                  ? "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 ring-2 ring-emerald-500/20"
                  : "hover:shadow-xl"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-base font-semibold">{dayPlan.day}</CardTitle>
                  {dayPlan.completed && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ThemeIcon className="h-4 w-4" />
                  <span className="font-medium">{dayPlan.theme}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tasks */}
                <div className="space-y-3">
                  {dayPlan.tasks.map((task, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">{task.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                              {task.topic}
                            </p>
                            {task.difficulty === "weak" && (
                              <Badge variant="destructive" className="text-xs px-1.5 py-0">weak</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                            {task.activity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Tip */}
                {dayPlan.aiTip && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-primary/90 leading-tight">{dayPlan.aiTip}</p>
                    </div>
                  </div>
                )}

                {/* Total Duration */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <Clock className="h-4 w-4" />
                  <span>{dayPlan.tasks.reduce((sum, task) => sum + task.duration, 0)} mins total</span>
                </div>

                <Button
                  size="sm"
                  variant={dayPlan.completed ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggleDay(dayPlan.day)}
                >
                  {dayPlan.completed ? "Mark Incomplete" : "Mark Complete"}
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
              {totalStudyTime} mins
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
