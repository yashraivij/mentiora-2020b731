import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Target, Zap } from "lucide-react";
import { PremiumBadge } from "@/components/ui/premium-badge";

export const PremiumAnalytics = () => {
  return (
    <Card className="border-gradient">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Advanced Analytics</CardTitle>
            <PremiumBadge size="sm" />
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Premium Feature
          </Badge>
        </div>
        <CardDescription>
          Deep insights into your learning patterns and performance trends
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Learning Velocity</span>
            </div>
            <p className="text-2xl font-bold">+24%</p>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Focus Score</span>
            </div>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-xs text-muted-foreground">Excellent</p>
          </div>
          
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Efficiency</span>
            </div>
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">Above average</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-medium">Premium Insights</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="text-sm">Your optimal study time is 2-4 PM</span>
              <Badge variant="outline">AI Insight</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="text-sm">Focus on Biology chapters 3-5 for best ROI</span>
              <Badge variant="outline">Recommendation</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <span className="text-sm">Take a 15min break to maintain peak performance</span>
              <Badge variant="outline">Health Tip</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};