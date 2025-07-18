import { Brain, AlertTriangle, CheckCircle, TrendingUp, Sparkles, Crown, Zap, Shield, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StressTracker } from "@/lib/stressTracker";
import { curriculum } from "@/data/curriculum";
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
  // Always show the component, even without data

  // Get stress levels for all subjects with progress
  const subjectsWithProgress = userProgress?.reduce((acc, progress) => {
    if (!acc.includes(progress.subjectId)) {
      acc.push(progress.subjectId);
    }
    return acc;
  }, [] as string[]) || [];

  const subjectStressLevels = userId && subjectsWithProgress.length > 0 
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
      bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-red-950/40 dark:via-rose-950/40 dark:to-pink-950/40',
      border: 'border-red-200/60 dark:border-red-700/40',
      text: 'text-red-700 dark:text-red-300',
      icon: 'text-red-600 dark:text-red-400',
      badge: 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-0 shadow-lg shadow-red-500/25',
      accent: 'from-red-400 to-rose-500',
      glow: 'shadow-red-500/20 dark:shadow-red-400/15'
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-yellow-950/40',
      border: 'border-amber-200/60 dark:border-amber-700/40',
      text: 'text-amber-700 dark:text-amber-300',
      icon: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg shadow-amber-500/25',
      accent: 'from-amber-400 to-orange-500',
      glow: 'shadow-amber-500/20 dark:shadow-amber-400/15'
    },
    green: {
      bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-cyan-950/40',
      border: 'border-emerald-200/60 dark:border-emerald-700/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg shadow-emerald-500/25',
      accent: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/20 dark:shadow-emerald-400/15'
    }
  };

  const colors = colorClasses[getOverallColor()];

  return (
    <div className="mb-8">
      <Card className={cn(
        "group relative overflow-hidden backdrop-blur-xl transition-all duration-500 rounded-3xl shadow-2xl hover:shadow-3xl transform hover:scale-[1.02]",
        "border-2 animate-fade-in",
        colors.bg,
        colors.border,
        colors.glow
      )}>
        {/* Premium Animated Background Gradients */}
        <div className="absolute inset-0 opacity-60 dark:opacity-40">
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-30 animate-pulse",
            colors.accent && `bg-gradient-to-br ${colors.accent}`
          )} />
          <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 via-transparent to-accent/10 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Premium Mesh Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* Premium Floating Elements */}
        <div className="absolute top-6 left-6 w-32 h-32 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-6 right-6 w-24 h-24 rounded-full bg-gradient-to-br from-accent/10 to-primary/10 blur-2xl animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Premium Header Badge */}
        <div className="absolute top-6 right-6 z-20 flex items-center space-x-2">
          <Badge className={cn(
            "px-4 py-2 backdrop-blur-sm font-bold text-sm tracking-wide transform hover:scale-105 transition-all duration-300",
            colors.badge
          )}>
            <Crown className="h-4 w-4 mr-2 animate-pulse" />
            PREMIUM
          </Badge>
        </div>

        <CardHeader className="pb-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className={cn(
              "p-4 rounded-3xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10 transform hover:scale-110 transition-all duration-300",
              colors.icon
            )}>
              <Brain className="h-8 w-8 animate-pulse" />
            </div>
            <div className="flex-1">
              <CardTitle className={cn(
                "text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-2",
                `from-${colors.text.split(' ')[0].split('-')[1]}-600 to-${colors.text.split(' ')[0].split('-')[1]}-800 dark:from-${colors.text.split(' ')[0].split('-')[1]}-300 dark:to-${colors.text.split(' ')[0].split('-')[1]}-500`
              )}>
                AI Stress Monitor
              </CardTitle>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Zap className={cn("h-4 w-4 animate-pulse", colors.icon)} />
                  <span className={cn("text-sm font-semibold", colors.text)}>
                    Real-time Analysis
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className={cn("h-4 w-4", colors.icon)} />
                  <span className={cn("text-sm font-medium", colors.text)}>
                    Emotional Wellness
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 relative z-10 px-8 pb-8">
          {/* Premium Overall Status Card */}
          <div className={cn(
            "p-6 rounded-3xl bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border-2 shadow-2xl transform hover:scale-[1.02] transition-all duration-300",
            colors.border
          )}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-3">
                {!hasStressData ? (
                  <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", colors.icon)}>
                    <Brain className="h-6 w-6 animate-pulse" />
                  </div>
                ) : stressCounts.high > 0 ? (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 shadow-lg">
                    <AlertTriangle className="h-6 w-6 text-red-500 animate-pulse" />
                  </div>
                ) : (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 shadow-lg">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                )}
                <div>
                  <h3 className={cn("text-lg font-bold", colors.text)}>
                    {!hasStressData ? "Wellness Tracking" : "Overall Wellness"}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Star className={cn("h-4 w-4 animate-pulse", colors.icon)} />
                    <span className={cn("text-sm font-semibold", colors.text)}>
                      Premium Insights
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border border-white/20 dark:border-white/10">
                <Sparkles className={cn("h-5 w-5 animate-pulse", colors.icon)} />
                <span className={cn("text-sm font-bold", colors.text)}>
                  AI Analysis
                </span>
              </div>
            </div>
            <div className={cn(
              "p-5 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg mb-6"
            )}>
              <p className={cn("text-base leading-relaxed font-medium", colors.text)}>
                {getOverallMessage()}
              </p>
            </div>

            {/* Premium Stress Level Summary */}
            {hasStressData ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/30 dark:border-emerald-700/30 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                    {stressCounts.low}
                  </div>
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    Low Stress
                  </div>
                  <div className="w-full h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-200/30 dark:border-amber-700/30 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 animate-pulse">
                    {stressCounts.medium}
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-bold">
                    Medium Stress
                  </div>
                  <div className="w-full h-2 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-3 p-4 rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200/30 dark:border-red-700/30 shadow-lg transform hover:scale-105 transition-all duration-300">
                  <div className="text-2xl font-bold text-red-600 dark:text-red-400 animate-pulse">
                    {stressCounts.high}
                  </div>
                  <div className="text-sm text-red-600 dark:text-red-400 font-bold">
                    High Stress
                  </div>
                  <div className="w-full h-2 bg-red-200 dark:bg-red-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-400 to-rose-500 animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-6 rounded-2xl bg-gradient-to-br from-background/60 to-background/40 backdrop-blur-sm border border-white/20 dark:border-white/10 shadow-lg">
                <div className={cn("text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent", colors.accent && `bg-gradient-to-r ${colors.accent}`)}>
                  Ready to track your wellness journey?
                </div>
                <p className={cn("text-base font-medium opacity-90", colors.text)}>
                  Complete some practice questions to see personalized stress insights
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Premium Most Stressed Subject Card */}
          {mostStressedSubject && mostStressedSubject.stressLevel > 60 && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border-2 border-red-200/50 dark:border-red-700/30 shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={cn(
                    "w-4 h-4 rounded-full shadow-lg animate-pulse",
                    mostStressedSubject.category === 'high' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                    mostStressedSubject.category === 'medium' ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                  )} />
                  <div>
                    <h4 className={cn("font-bold text-base", colors.text)}>
                      Most Stressed: {mostStressedSubject.subjectName}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className={cn("text-sm font-medium", colors.text)}>
                        {Math.round(mostStressedSubject.stressLevel)}% stress level
                      </p>
                      <Badge className="bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs px-2 py-1 border-0">
                        Needs Attention
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  onClick={() => onSubjectClick(mostStressedSubject.subjectId)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </div>
            </div>
          )}

          {/* Premium Recommendation */}
          {hasStressData && stressCounts.high > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-background/80 to-background/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg transform hover:scale-[1.01] transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20">
                  <Sparkles className={cn("h-5 w-5", colors.icon)} />
                </div>
                <p className={cn("text-sm font-semibold leading-relaxed", colors.text)}>
                  💡 <strong>Premium Tip:</strong> Take a 10-minute break, then try some easier practice questions to rebuild confidence.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};