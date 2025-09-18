
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface ProgressCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  progress?: number;
  icon: LucideIcon;
  color: string;
  trend?: number;
}

export const ProgressCard = ({ title, value, subtitle, progress, icon: Icon, color, trend }: ProgressCardProps) => {
  return (
    <Card className="p-6 bg-card border-0 rounded-xl hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {progress !== undefined && (
          <Progress 
            value={progress} 
            className="h-2" 
          />
        )}
      </div>
    </Card>
  );
};
