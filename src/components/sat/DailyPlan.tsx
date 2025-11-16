import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Play, Clock, Target } from "lucide-react";

interface DailyActivity {
  type: 'warmup' | 'core_focus' | 'boost';
  domain: string;
  question_ids: string[];
  estimated_minutes: number;
  completed: boolean;
}

interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  activities: DailyActivity[];
  completed: boolean;
}

interface DailyPlanProps {
  plan: DailyPlan | null;
  loading?: boolean;
}

const activityTypeConfig = {
  warmup: {
    label: '⭐ Warm-up',
    color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    description: 'Build confidence with easier questions',
    icon: '⭐'
  },
  core_focus: {
    label: '🔥 Focus',
    color: 'bg-primary/10 text-primary border-primary/20',
    description: 'Target your weak areas',
    icon: '🔥'
  },
  boost: {
    label: '⚡ Optional Challenge',
    color: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    description: 'Push your limits',
    icon: '⚡'
  },
  review: {
    label: '🔄 Review Your Mistakes',
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    description: 'Learn from past errors',
    icon: '🔄'
  }
};

export function DailyPlan({ plan, loading }: DailyPlanProps) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Today's Study Plan</CardTitle>
          <CardDescription>Loading your personalized plan...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
            <div className="h-20 bg-muted animate-pulse rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!plan) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Today's Study Plan</CardTitle>
          <CardDescription>No plan available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Your personalized study plan will be generated after you complete the diagnostic test.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activities = plan.activities as DailyActivity[];
  const completedCount = activities.filter(a => a.completed).length;
  const totalActivities = activities.length;
  const progressPercentage = (completedCount / totalActivities) * 100;
  const totalMinutes = activities.reduce((sum, a) => sum + a.estimated_minutes, 0);
  const totalQuestions = activities.reduce((sum, a) => sum + a.question_ids.length, 0);

  const isAllCompleted = plan.completed;

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Today's Plan
            </CardTitle>
            <CardDescription>
              {isAllCompleted ? (
                <span className="text-green-500 font-medium">🎉 All activities completed!</span>
              ) : (
                <span className="text-muted-foreground font-medium">~{totalMinutes} minutes</span>
              )}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-muted-foreground">{totalQuestions}</div>
            <div className="text-xs text-muted-foreground">questions</div>
          </div>
        </div>
        <Progress value={progressPercentage} className="h-2 mt-4" />
      </CardHeader>

      <CardContent className="space-y-3">
        {activities.map((activity, index) => {
          const config = activityTypeConfig[activity.type as keyof typeof activityTypeConfig] || activityTypeConfig.core_focus;
          const questionCount = activity.question_ids.length;
          
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                activity.completed
                  ? 'bg-muted/50 opacity-75'
                  : 'bg-card hover:border-primary/30'
              } ${config.color}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{config.icon}</span>
                    <span className="font-semibold text-sm">{config.label.replace(/^[🔥⭐⚡🔄]\s*/, '')}</span>
                    {activity.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                    )}
                  </div>
                  <h4 className="font-semibold">{activity.domain}</h4>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.estimated_minutes} min
                    </span>
                    <span>{questionCount} question{questionCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 space-y-2">
          {isAllCompleted ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/sat-session')}
            >
              Start Another Session
            </Button>
          ) : (
            <Button
              className="w-full"
              size="lg"
              onClick={() => navigate('/sat-session')}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session ({totalQuestions} questions)
            </Button>
          )}
          <p className="text-xs text-center text-muted-foreground">
            Complete activities in order for best results
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
