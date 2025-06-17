
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
    <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* Premium Gradient Background */}
      <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{title}</CardTitle>
          <div className={`p-3 rounded-2xl ${color} shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
            {trend && (
              <span className={`text-sm font-bold px-3 py-1.5 rounded-xl ${
                trend > 0 
                  ? 'text-emerald-700 bg-emerald-100 border border-emerald-200' 
                  : 'text-red-700 bg-red-100 border border-red-200'
              }`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
          )}
          {progress !== undefined && (
            <div className="space-y-2">
              <Progress 
                value={progress} 
                className="h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner" 
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Premium Border Glow Effect */}
      <div className={`absolute inset-0 rounded-3xl ${color} p-[1px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none`}>
        <div className="w-full h-full bg-white rounded-3xl" />
      </div>
    </Card>
  );
};
