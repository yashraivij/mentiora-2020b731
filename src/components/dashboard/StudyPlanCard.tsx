import { ReactNode } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyPlanCardProps {
  subject: string;
  icon: ReactNode;
  topic: string;
  duration: string;
  progress: number;
  variant: 'yellow' | 'pink' | 'green' | 'blue' | 'purple';
  onClick?: () => void;
}

const variantStyles = {
  yellow: {
    bg: 'bg-sticky-yellow',
    border: 'border-sticky-yellow-border',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressBg: 'bg-amber-200',
    progressFill: 'bg-amber-500',
  },
  pink: {
    bg: 'bg-sticky-pink',
    border: 'border-sticky-pink-border',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    progressBg: 'bg-pink-200',
    progressFill: 'bg-pink-500',
  },
  green: {
    bg: 'bg-sticky-green',
    border: 'border-sticky-green-border',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    progressBg: 'bg-emerald-200',
    progressFill: 'bg-emerald-500',
  },
  blue: {
    bg: 'bg-sticky-blue',
    border: 'border-sticky-blue-border',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    progressBg: 'bg-blue-200',
    progressFill: 'bg-blue-500',
  },
  purple: {
    bg: 'bg-sticky-purple',
    border: 'border-sticky-purple-border',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    progressBg: 'bg-purple-200',
    progressFill: 'bg-purple-500',
  },
};

export const StudyPlanCard = ({
  subject,
  icon,
  topic,
  duration,
  progress,
  variant,
  onClick,
}: StudyPlanCardProps) => {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border-2 p-5 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1",
        styles.bg,
        styles.border
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", styles.iconBg)}>
            <span className={styles.iconColor}>{icon}</span>
          </div>
          <h3 className="font-playfair text-lg font-semibold text-foreground">{subject}</h3>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Clock className="h-4 w-4" />
          <span>{duration}</span>
        </div>
      </div>

      {/* Next Up */}
      <div className="mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Next up:</span>
        <div className="mt-2 border-2 border-dashed border-muted-foreground/30 rounded-lg p-3">
          <p className="text-sm font-medium text-foreground">{topic}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className={cn("h-2 rounded-full", styles.progressBg)}>
          <div
            className={cn("h-full rounded-full transition-all", styles.progressFill)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
