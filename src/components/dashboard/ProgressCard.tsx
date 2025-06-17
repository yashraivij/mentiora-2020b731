
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
            <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-900">{value}</span>
            {trend && (
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                trend > 0 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-red-600 bg-red-50'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
          {progress !== undefined && (
            <Progress value={progress} className="h-1.5 bg-slate-100" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
