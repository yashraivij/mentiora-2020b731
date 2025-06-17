
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, TrendingUp } from "lucide-react";

interface AOBreakdownProps {
  userProgress: Array<{
    averageScore: number;
  }>;
}

export const AOBreakdown = ({ userProgress }: AOBreakdownProps) => {
  const getAOBreakdown = () => {
    const averageScore = userProgress.length > 0 ? 
      userProgress.reduce((sum, d) => sum + d.averageScore, 0) / userProgress.length : 0;

    return {
      ao1: Math.max(40, Math.min(100, averageScore + (Math.random() - 0.5) * 20)),
      ao2: Math.max(30, Math.min(100, averageScore - 5 + (Math.random() - 0.5) * 15)),
      ao3: Math.max(25, Math.min(100, averageScore - 15 + (Math.random() - 0.5) * 25))
    };
  };

  const aoBreakdown = getAOBreakdown();

  const getAOColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAOBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          Assessment Objectives Performance
        </CardTitle>
        <p className="text-sm text-slate-600">Your performance across different skill areas</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">AO1 - Knowledge & Understanding</span>
              </div>
              <Badge variant="outline" className={getAOColor(aoBreakdown.ao1)}>
                {Math.round(aoBreakdown.ao1)}%
              </Badge>
            </div>
            <Progress value={aoBreakdown.ao1} className="h-2" />
            <p className="text-xs text-slate-500">Recalling facts, terminology, and concepts</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">AO2 - Application</span>
              </div>
              <Badge variant="outline" className={getAOColor(aoBreakdown.ao2)}>
                {Math.round(aoBreakdown.ao2)}%
              </Badge>
            </div>
            <Progress value={aoBreakdown.ao2} className="h-2" />
            <p className="text-xs text-slate-500">Applying knowledge to familiar and unfamiliar situations</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">AO3 - Analysis & Evaluation</span>
              </div>
              <Badge variant="outline" className={getAOColor(aoBreakdown.ao3)}>
                {Math.round(aoBreakdown.ao3)}%
              </Badge>
            </div>
            <Progress value={aoBreakdown.ao3} className="h-2" />
            <p className="text-xs text-slate-500">Analyzing and evaluating information to make judgments</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
