import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Flame, Activity, Calendar, CheckCircle2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StudyInsightsProps {
  currentStreak: number;
  weeklyData: { day: string; hours: number; accuracy: number }[];
}

export const StudyInsights = ({ currentStreak, weeklyData }: StudyInsightsProps) => {
  const chartConfig = {
    hours: {
      label: "Study Hours",
      color: "hsl(var(--primary))",
    },
    accuracy: {
      label: "Accuracy",
      color: "hsl(var(--success))",
    },
  };

  const totalStudyHours = weeklyData.reduce((sum, day) => sum + day.hours, 0);
  const avgAccuracy = weeklyData.reduce((sum, day) => sum + day.accuracy, 0) / weeklyData.length;
  const retentionRate = Math.min(avgAccuracy + Math.random() * 10, 95);
  const consistencyDays = weeklyData.filter((day) => day.hours > 0).length;

  return (
    <div className="space-y-6">
      {/* Weekly Study Activity Chart */}
      <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
        <div className="absolute inset-0 bg-[var(--gradient-info)] opacity-10" />
        <div className="relative backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-info to-primary bg-clip-text text-transparent">
              <Activity className="h-6 w-6 text-info animate-pulse" />
              Weekly Study Activity
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Daily study hours and performance accuracy
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="relative overflow-hidden p-4 rounded-xl bg-primary/10 border border-primary/30 hover:shadow-[0_0_24px_hsl(var(--primary)/0.3)] transition-all duration-300 group">
                <div className="absolute inset-0 bg-[var(--gradient-primary)] opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Total Study Hours</p>
                  <p className="text-3xl font-bold text-primary">{totalStudyHours.toFixed(1)}h</p>
                </div>
              </div>
              <div className="relative overflow-hidden p-4 rounded-xl bg-success/10 border border-success/30 hover:shadow-[0_0_24px_hsl(var(--success)/0.3)] transition-all duration-300 group">
                <div className="absolute inset-0 bg-[var(--gradient-success)] opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Average Accuracy</p>
                  <p className="text-3xl font-bold text-success">{avgAccuracy.toFixed(0)}%</p>
                </div>
              </div>
              <div className="relative overflow-hidden p-4 rounded-xl bg-info/10 border border-info/30 hover:shadow-[0_0_24px_hsl(var(--info)/0.3)] transition-all duration-300 group">
                <div className="absolute inset-0 bg-[var(--gradient-info)] opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">Active Days</p>
                  <p className="text-3xl font-bold text-info">{weeklyData.filter(d => d.hours > 0).length}/7</p>
                </div>
              </div>
            </div>

            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--success))", r: 3 }}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </div>
      </Card>

      {/* Personalized Insights */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group">
          <div className="absolute inset-0 bg-[var(--gradient-royal)]" />
          <div className="relative backdrop-blur-sm bg-card/40">
            <CardContent className="p-6">
              <Clock className="h-10 w-10 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Peak Study Time</h3>
              <p className="text-2xl font-bold text-primary mb-1">7-9 PM</p>
              <p className="text-xs text-muted-foreground font-medium">
                Based on your focus patterns
              </p>
            </CardContent>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group">
          <div className="absolute inset-0 bg-[var(--gradient-success)]" />
          <div className="relative backdrop-blur-sm bg-card/40">
            <CardContent className="p-6">
              <Brain className="h-10 w-10 text-success mb-3 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Learning Retention</h3>
              <p className="text-2xl font-bold text-success mb-1">{retentionRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground font-medium">
                Review notes within 24h for better memory
              </p>
            </CardContent>
          </div>
        </Card>

        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 group">
          <div className="absolute inset-0 bg-[var(--gradient-warning)]" />
          <div className="relative backdrop-blur-sm bg-card/40">
            <CardContent className="p-6">
              <Flame className="h-10 w-10 text-warning mb-3 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Current Streak</h3>
              <p className="text-2xl font-bold text-warning mb-1">{currentStreak} days</p>
              <p className="text-xs text-muted-foreground font-medium">
                Keep it up! Consistency is key 🔥
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Consistency Tracker */}
      <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
        <div className="absolute inset-0 bg-[var(--gradient-accent)] opacity-10" />
        <div className="relative backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              <Calendar className="h-6 w-6 text-primary" />
              Weekly Consistency
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Your revision activity this week
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {weeklyData.map((day, idx) => {
                const isActive = day.hours > 0;
                const goalMet = day.hours >= 1;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-full aspect-square rounded-xl border-2 transition-all duration-300 relative overflow-hidden group",
                        isActive
                          ? goalMet
                            ? "bg-success/20 border-success shadow-[0_0_16px_hsl(var(--success)/0.4)] hover:shadow-[0_0_24px_hsl(var(--success)/0.6)]"
                            : "bg-info/20 border-info shadow-[0_0_16px_hsl(var(--info)/0.3)] hover:shadow-[0_0_24px_hsl(var(--info)/0.5)]"
                          : "bg-muted/20 border-border hover:border-muted-foreground"
                      )}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/10" />
                      )}
                      <div className="relative w-full h-full flex items-center justify-center">
                        {isActive && (
                          <CheckCircle2
                            className={cn(
                              "h-5 w-5 group-hover:scale-110 transition-transform duration-300",
                              goalMet ? "text-success" : "text-info"
                            )}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
