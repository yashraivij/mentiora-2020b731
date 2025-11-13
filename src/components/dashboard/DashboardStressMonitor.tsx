import { Brain, AlertTriangle, CheckCircle, TrendingUp, Sparkles, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StressTracker } from "@/lib/stressTracker";
import { useCurriculum } from "@/hooks/useCurriculum";
import { cn } from "@/lib/utils";

interface DashboardStressMonitorProps {
  userId: string | undefined;
  userProgress: Array<{
    subjectId: string;
    topicId: string;
    averageScore: number;
    attempts: number;
  }>;
  onSubjectClick: (subjectId: string) => void;
}

export const DashboardStressMonitor = ({ 
  userId, 
  userProgress, 
  onSubjectClick 
}: DashboardStressMonitorProps) => {
  const { curriculum, isLoading } = useCurriculum();
  
  // Always show the component, even without data

  // Get stress levels for all subjects with progress
  const subjectsWithProgress = userProgress?.reduce((acc, progress) => {
    if (!acc.includes(progress.subjectId)) {
      acc.push(progress.subjectId);
    }
    return acc;
  }, [] as string[]) || [];

  const subjectStressLevels = userId && subjectsWithProgress.length > 0 && !isLoading
    ? subjectsWithProgress.map(subjectId => {
        const stressLevel = StressTracker.getStressLevel(userId, subjectId);
        const subject = curriculum.find(s => s.id === subjectId);
        return {
          subjectId,
          subjectName: subject?.name || subjectId,
          stressLevel,
          category: StressTracker.getStressLevelCategory(stressLevel)
        };
      }).filter(s => s.stressLevel > 0) // Only show subjects with stress data
    : [];

  const hasStressData = subjectStressLevels.length > 0;

  // Find the most stressed subject (only if we have data)
  const mostStressedSubject = hasStressData 
    ? subjectStressLevels.reduce((max, subject) => 
        subject.stressLevel > max.stressLevel ? subject : max
      )
    : null;

  // Count subjects by stress level (only if we have data)
  const stressCounts = hasStressData ? {
    low: subjectStressLevels.filter(s => s.category === 'low').length,
    medium: subjectStressLevels.filter(s => s.category === 'medium').length,
    high: subjectStressLevels.filter(s => s.category === 'high').length
  } : { low: 0, medium: 0, high: 0 };

  const getOverallMessage = () => {
    if (!hasStressData) {
      return "Start practicing to begin tracking your stress levels and emotional wellness across subjects.";
    }
    if (stressCounts.high > 0) {
      return `You have ${stressCounts.high} subject${stressCounts.high > 1 ? 's' : ''} showing high stress. Consider taking a break or switching to easier topics.`;
    }
    if (stressCounts.medium > 0) {
      return `${stressCounts.medium} subject${stressCounts.medium > 1 ? 's are' : ' is'} becoming challenging. Mix in some practice questions to build confidence.`;
    }
    return "Your stress levels are healthy across all subjects. Keep up the great work!";
  };

  const getOverallColor = () => {
    if (!hasStressData) return 'green'; // Default to calm/positive for new users
    if (stressCounts.high > 0) return 'red';
    if (stressCounts.medium > 0) return 'amber';
    return 'green';
  };

  const colorClasses = {
    red: {
      bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
      border: 'border-red-200 dark:border-red-800/30',
      text: 'text-red-600 dark:text-red-400',
      icon: 'text-red-500',
      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    },
    amber: {
      bg: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
      border: 'border-amber-200 dark:border-amber-800/30',
      text: 'text-amber-600 dark:text-amber-400',
      icon: 'text-amber-500',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
    },
    green: {
      bg: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/30',
      text: 'text-emerald-600 dark:text-emerald-400',
      icon: 'text-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
    }
  };

  const colors = colorClasses[getOverallColor()];

  return (
    <div className="mb-8">
      <Card className={cn(
        "relative overflow-hidden border-0 backdrop-blur-sm transition-all duration-300 rounded-3xl shadow-lg hover:shadow-xl",
        colors.bg,
        colors.border
      )}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        </div>

        {/* Premium Badge */}
        <div className="absolute top-4 right-4 z-10">
          <Badge className={cn(
            "px-3 py-1 backdrop-blur-sm border-0 font-semibold text-xs",
            colors.badge
          )}>
            <Crown className="h-3 w-3 mr-1" />
            Premium
          </Badge>
        </div>

        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className={cn(
              "p-3 rounded-2xl bg-background/50 backdrop-blur-sm shadow-lg",
              colors.icon
            )}>
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className={cn("text-xl font-bold", colors.text)}>
                Stress Monitor
              </CardTitle>
              <p className={cn("text-sm opacity-90", colors.text)}>
                Emotional wellness tracking
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Overall Status */}
          <div className={cn(
            "p-4 rounded-2xl bg-background/30 backdrop-blur-sm border",
            colors.border
          )}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {!hasStressData ? (
                  <Brain className={cn("h-5 w-5", colors.icon)} />
                ) : stressCounts.high > 0 ? (
                  <AlertTriangle className={cn("h-5 w-5", colors.icon)} />
                ) : (
                  <CheckCircle className={cn("h-5 w-5", colors.icon)} />
                )}
                <h3 className={cn("font-semibold", colors.text)}>
                  {!hasStressData ? "Wellness Tracking" : "Overall Wellness"}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className={cn("h-4 w-4", colors.icon)} />
                <span className={cn("text-sm font-medium", colors.text)}>
                  Analysis
                </span>
              </div>
            </div>
            <p className={cn("text-sm leading-relaxed mb-4", colors.text)}>
              {getOverallMessage()}
            </p>

            {/* Stress Level Summary */}
            {hasStressData ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {stressCounts.low}
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Low Stress
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                    {stressCounts.medium}
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    Medium Stress
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <div className="text-lg font-bold text-red-600 dark:text-red-400">
                    {stressCounts.high}
                  </div>
                  <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                    High Stress
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className={cn("text-lg font-semibold mb-2", colors.text)}>
                  Ready to track your wellness journey?
                </div>
                <p className={cn("text-sm opacity-75", colors.text)}>
                  Complete some practice questions to see personalized stress insights
                </p>
              </div>
            )}
          </div>

          {/* Most Stressed Subject (if any high stress) */}
          {mostStressedSubject && mostStressedSubject.stressLevel > 60 && (
            <div className="p-4 rounded-2xl bg-background/30 backdrop-blur-sm border border-background/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    mostStressedSubject.category === 'high' ? 'bg-red-500' :
                    mostStressedSubject.category === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  )} />
                  <div>
                    <h4 className={cn("font-semibold text-sm", colors.text)}>
                      Most Stressed: {mostStressedSubject.subjectName}
                    </h4>
                    <p className={cn("text-xs opacity-75", colors.text)}>
                      {Math.round(mostStressedSubject.stressLevel)}% stress level
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onSubjectClick(mostStressedSubject.subjectId)}
                  className={cn(
                    "hover:bg-background/50 backdrop-blur-sm",
                    colors.text
                  )}
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Help
                </Button>
              </div>
            </div>
          )}

          {/* Recommendation */}
          {hasStressData && stressCounts.high > 0 && (
            <div className="p-3 rounded-xl bg-background/40 backdrop-blur-sm border border-background/40">
              <p className={cn("text-xs font-medium", colors.text)}>
                💡 <strong>Tip:</strong> Take a 10-minute break, then try some easier practice questions to rebuild confidence.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};