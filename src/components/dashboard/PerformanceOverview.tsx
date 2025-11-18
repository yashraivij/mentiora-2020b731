import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";

interface SubjectGrade {
  subject_id: string;
  grade: string;
  percentage: number;
  target_grade?: string;
}

interface PerformanceOverviewProps {
  predictedGrades: SubjectGrade[];
  userSubjects: any[];
}

export const PerformanceOverview = ({ predictedGrades, userSubjects }: PerformanceOverviewProps) => {
  // Helper to check if subject is SAT
  const isSATSubject = (subjectId: string): boolean => {
    return subjectId.startsWith('sat-');
  };

  // Convert percentage to SAT score (400-1600)
  const percentageToSATScore = (percentage: number): number => {
    return Math.round(400 + (percentage / 100) * 1200);
  };

  // Prepare radar chart data
  const radarData = predictedGrades.map((prediction) => {
    const userSubject = userSubjects.find((s) => s.subject_name === prediction.subject_id);
    const isSAT = isSATSubject(prediction.subject_id);
    
    if (isSAT) {
      // For SAT, convert percentage to SAT score
      const currentScore = percentageToSATScore(prediction.percentage);
      const targetScore = parseInt(userSubject?.target_grade || "1000");
      
      return {
        subject: prediction.subject_id.slice(4, 16), // Remove 'sat-' prefix
        current: currentScore,
        target: targetScore,
      };
    }
    
    // For GCSE/A-Level
    const targetGrade = parseInt(userSubject?.target_grade || "7");
    const gradeValue = prediction.grade || userSubject?.predicted_grade || userSubject?.target_grade || "0";
    const isUngraded = gradeValue === 'U' || gradeValue === 0 || gradeValue === "0" || gradeValue === "0.0" || parseFloat(gradeValue as string) === 0;
    const currentGrade = isUngraded ? 0 : parseInt(gradeValue as string);

    return {
      subject: prediction.subject_id.slice(0, 12),
      current: currentGrade,
      target: targetGrade,
    };
  });

  const chartConfig = {
    current: {
      label: "Current",
      color: "hsl(var(--primary))",
    },
    target: {
      label: "Target",
      color: "hsl(var(--muted-foreground))",
    },
  };

  const getStatusColor = (current: number, target: number, subjectId?: string) => {
    const isSAT = subjectId && isSATSubject(subjectId);
    const diff = isSAT ? current - target : current - target;
    const threshold = isSAT ? 100 : 1; // 100 points for SAT, 1 grade for others
    
    if (current >= target) return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
    if (current >= target - threshold) return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
  };

  const getStatusIcon = (current: number, target: number, subjectId?: string) => {
    const isSAT = subjectId && isSATSubject(subjectId);
    const threshold = isSAT ? 100 : 1;
    
    if (current >= target) return <TrendingUp className="h-4 w-4" />;
    if (current >= target - threshold) return <Minus className="h-4 w-4" />;
    return <TrendingDown className="h-4 w-4" />;
  };

  const getStatusText = (current: number, target: number, subjectId?: string) => {
    const isSAT = subjectId && isSATSubject(subjectId);
    const threshold = isSAT ? 100 : 1;
    
    if (current >= target) return "On Track";
    if (current >= target - threshold) return "Close";
    return "Needs Focus";
  };

  return (
    <div className="space-y-6">
      {/* Radar Chart Section */}
      <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Overview
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare your predicted grades against your targets
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, radarData.some(d => isSATSubject(predictedGrades.find(p => p.subject_id.slice(0, 12) === d.subject || p.subject_id.slice(4, 16) === d.subject)?.subject_id || '')) ? 1600 : 9]} 
                  tick={{ fill: "hsl(var(--muted-foreground))" }} 
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="hsl(var(--muted-foreground))"
                  fill="hsl(var(--muted))"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Current"
                  dataKey="current"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Subject Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {predictedGrades.map((prediction) => {
          const userSubject = userSubjects.find((s) => s.subject_name === prediction.subject_id);
          const isSAT = isSATSubject(prediction.subject_id);
          
          if (isSAT) {
            // SAT scoring logic
            const currentScore = percentageToSATScore(prediction.percentage);
            const targetScore = parseInt(userSubject?.target_grade || "1000");
            const progressPercent = Math.min(((currentScore - 400) / (targetScore - 400)) * 100, 100);
            
            return (
              <Card key={prediction.subject_id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{prediction.subject_id.replace('sat-', 'SAT: ')}</h3>
                      <Badge className={getStatusColor(currentScore, targetScore, prediction.subject_id)}>
                        {getStatusIcon(currentScore, targetScore, prediction.subject_id)}
                        <span className="ml-1">{getStatusText(currentScore, targetScore, prediction.subject_id)}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{currentScore}</div>
                      <div className="text-xs text-muted-foreground">Target: {targetScore}</div>
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{Math.round(progressPercent)}%</span>
                  </div>
                </CardContent>
              </Card>
            );
          }
          
          // GCSE/A-Level logic
          const targetGrade = parseInt(userSubject?.target_grade || "7");
          const gradeValue = prediction.grade || userSubject?.predicted_grade || userSubject?.target_grade || (isSATSubject(prediction.subject_id) ? "400" : "0");
          const isUngraded = gradeValue === 'U' || gradeValue === 0 || gradeValue === "0" || gradeValue === "0.0" || parseFloat(gradeValue as string) === 0;
          const currentGrade = isUngraded ? (isSATSubject(prediction.subject_id) ? 400 : 0) : parseInt(gradeValue as string);
          const progressPercent = Math.min((currentGrade / targetGrade) * 100, 100);

          return (
            <Card key={prediction.subject_id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{prediction.subject_id}</h3>
                    <Badge className={getStatusColor(currentGrade, targetGrade, prediction.subject_id)}>
                      {getStatusIcon(currentGrade, targetGrade, prediction.subject_id)}
                      <span className="ml-1">{getStatusText(currentGrade, targetGrade, prediction.subject_id)}</span>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{isUngraded ? 'U' : currentGrade}</div>
                    <div className="text-xs text-muted-foreground">/ {targetGrade}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Accuracy: <span className="font-medium text-foreground">{Math.round(prediction.percentage)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
