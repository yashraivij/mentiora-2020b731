import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Brain, Sparkles } from "lucide-react";

interface StressIndicatorProps {
  stressLevel: number; // 0-100
  subjectId: string;
  className?: string;
}

export const StressIndicator = ({ stressLevel, subjectId, className = "" }: StressIndicatorProps) => {
  const getStressColor = (level: number) => {
    if (level <= 33) return "bg-emerald-500"; // Green - Low stress
    if (level <= 66) return "bg-amber-500"; // Amber - Rising stress
    return "bg-red-500"; // Red - High stress
  };

  const getStressLabel = (level: number) => {
    if (level <= 33) return "Low stress";
    if (level <= 66) return "Rising stress";
    return "High stress";
  };

  const getStressMessage = (level: number) => {
    if (level <= 33) return "You're calm and confident in this subject. Keep going strong.";
    if (level <= 66) return "Looks like this subject's becoming tricky. Try a few practice topics to rebuild confidence.";
    return "This topic might be stressing you out. Let's slow things down — want to do a calm revision session?";
  };

  const getStressGradient = (level: number) => {
    if (level <= 33) return "from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/30 dark:border-emerald-800/30";
    if (level <= 66) return "from-amber-50 to-amber-100 border-amber-200 dark:from-amber-950/30 dark:to-amber-900/30 dark:border-amber-800/30";
    return "from-red-50 to-red-100 border-red-200 dark:from-red-950/30 dark:to-red-900/30 dark:border-red-800/30";
  };

  const getStressTextColor = (level: number) => {
    if (level <= 33) return "text-emerald-600 dark:text-emerald-400";
    if (level <= 66) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Premium Stress Indicator Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Stress Level</span>
          <div className="flex items-center space-x-1">
            <Crown className="h-3 w-3 text-amber-500" />
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Premium</span>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${getStressGradient(stressLevel)}`}>
          <span className={getStressTextColor(stressLevel)}>
            {getStressLabel(stressLevel)}
          </span>
        </div>
      </div>

      {/* Stress Progress Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Progress 
            value={stressLevel} 
            className="h-2.5 rounded-full bg-muted/30"
          />
          <div 
            className={`absolute top-0 left-0 h-2.5 rounded-full transition-all duration-500 ${getStressColor(stressLevel)}`}
            style={{ width: `${stressLevel}%` }}
          />
        </div>
        
        {/* Stress Level Indicators */}
        <div className="flex justify-between text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-amber-600 dark:text-amber-400 font-medium">Rising</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-600 dark:text-red-400 font-medium">High</span>
          </div>
        </div>
      </div>

      {/* Stress Message */}
      <Card className={`border-0 ${getStressGradient(stressLevel)} backdrop-blur-sm`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`p-2 rounded-xl ${getStressColor(stressLevel)} bg-opacity-20`}>
              <Sparkles className={`h-4 w-4 ${getStressTextColor(stressLevel)}`} />
            </div>
            <div className="flex-1">
              <p className={`text-sm leading-relaxed ${getStressTextColor(stressLevel)} font-medium`}>
                {getStressMessage(stressLevel)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};