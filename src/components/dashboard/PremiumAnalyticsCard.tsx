
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, LucideIcon } from "lucide-react";

interface PremiumAnalyticsCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  comingSoon?: boolean;
}

export const PremiumAnalyticsCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  comingSoon = false 
}: PremiumAnalyticsCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* Premium Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
      
      {/* Lock Overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-3xl">
        <div className="text-center space-y-3">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
            <Lock className="h-8 w-8 text-white" />
          </div>
          <Button className={`bg-gradient-to-r ${gradient} hover:shadow-lg text-white border-0 px-6 py-2 rounded-xl font-semibold transition-all duration-300`}>
            <Crown className="h-4 w-4 mr-2" />
            Unlock
          </Button>
        </div>
      </div>

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {comingSoon && (
            <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 text-xs">
              Coming Soon
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 group-hover:blur-sm transition-all duration-300">
        <div className="space-y-3">
          <CardTitle className="text-lg font-bold text-slate-900 leading-tight">
            {title}
          </CardTitle>
          <p className="text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
          
          {/* Mock Data Visualization */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs text-slate-500">
              <span>This Week</span>
              <span className={`font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {comingSoon ? 'Coming Soon' : '+24%'}
              </span>
            </div>
            <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000`}
                style={{ width: comingSoon ? '0%' : '76%' }}
              />
            </div>
          </div>
        </div>
      </CardContent>

      {/* Premium Border Glow */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} p-[1px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}>
        <div className="w-full h-full bg-white rounded-3xl" />
      </div>
    </Card>
  );
};
