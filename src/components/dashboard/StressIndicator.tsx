import { Brain, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StressIndicatorProps {
  level: number; // 0-100 scale
  className?: string;
  showMessage?: boolean;
}

export const StressIndicator = ({ level, className, showMessage = true }: StressIndicatorProps) => {
  const getStressCategory = (level: number): 'low' | 'medium' | 'high' => {
    if (level <= 30) return 'low';
    if (level <= 60) return 'medium';
    return 'high';
  };

  const getStressColor = (category: 'low' | 'medium' | 'high') => {
    switch (category) {
      case 'low':
        return {
          bg: 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30',
          border: 'border-emerald-200 dark:border-emerald-800/30',
          text: 'text-emerald-600 dark:text-emerald-400',
          bar: 'bg-gradient-to-r from-emerald-400 to-green-500',
          icon: 'text-emerald-500',
          glow: 'shadow-emerald-500/20'
        };
      case 'medium':
        return {
          bg: 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30',
          border: 'border-amber-200 dark:border-amber-800/30',
          text: 'text-amber-600 dark:text-amber-400',
          bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
          icon: 'text-amber-500',
          glow: 'shadow-amber-500/20'
        };
      case 'high':
        return {
          bg: 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30',
          border: 'border-red-200 dark:border-red-800/30',
          text: 'text-red-600 dark:text-red-400',
          bar: 'bg-gradient-to-r from-red-400 to-rose-500',
          icon: 'text-red-500',
          glow: 'shadow-red-500/20'
        };
    }
  };

  const getStressMessage = (category: 'low' | 'medium' | 'high'): string => {
    switch (category) {
      case 'low':
        return "You're calm and confident in this subject. Keep going strong.";
      case 'medium':
        return "Looks like this subject's becoming tricky. Try a few practice topics to rebuild confidence.";
      case 'high':
        return "This topic might be stressing you out. Let's slow things down — want to do a calm revision session?";
    }
  };

  const getStressIcon = (category: 'low' | 'medium' | 'high') => {
    switch (category) {
      case 'low':
        return <TrendingDown className="h-4 w-4" />;
      case 'medium':
        return <Minus className="h-4 w-4" />;
      case 'high':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const category = getStressCategory(level);
  const colors = getStressColor(category);

  if (level === 0) return null; // Don't show indicator if no stress data

  return (
    <div className={cn(
      "p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300",
      colors.bg,
      colors.border,
      colors.glow,
      "shadow-lg hover:shadow-xl",
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "p-2 rounded-xl bg-background/50 backdrop-blur-sm",
            colors.icon
          )}>
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className={cn("text-sm font-semibold", colors.text)}>
              Stress Level
            </h3>
            <div className="flex items-center space-x-1">
              {getStressIcon(category)}
              <span className={cn("text-xs font-medium capitalize", colors.text)}>
                {category}
              </span>
            </div>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-bold bg-background/60 backdrop-blur-sm",
          colors.text
        )}>
          {Math.round(level)}%
        </div>
      </div>

      {/* Stress Bar */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs font-medium">
          <span className={colors.text}>Calm</span>
          <span className={colors.text}>Stressed</span>
        </div>
        <div className="h-2 bg-background/40 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500 ease-out",
              colors.bar
            )}
            style={{ width: `${Math.min(100, level)}%` }}
          />
        </div>
      </div>

      {/* Stress Message */}
      {showMessage && (
        <p className={cn(
          "text-xs leading-relaxed font-medium opacity-90",
          colors.text
        )}>
          {getStressMessage(category)}
        </p>
      )}
    </div>
  );
};