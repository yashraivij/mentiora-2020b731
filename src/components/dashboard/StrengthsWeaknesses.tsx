import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight, Lightbulb } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";

interface UserProgress {
  subjectId: string;
  topicId: string;
  averageScore: number;
  attempts: number;
}

interface StrengthsWeaknessesProps {
  userProgress: UserProgress[];
  onPractice: (subjectId: string, topicId: string) => void;
}

export const StrengthsWeaknesses = ({ userProgress, onPractice }: StrengthsWeaknessesProps) => {
  // Sort topics by score
  const sortedTopics = [...userProgress].sort((a, b) => b.averageScore - a.averageScore);
  const strongTopics = sortedTopics.slice(0, 5);
  const weakTopics = sortedTopics.slice(-5).reverse();

  // Prepare bar chart data
  const chartData = sortedTopics.map((topic) => ({
    topic: topic.topicId.slice(0, 20),
    score: topic.averageScore,
    attempts: topic.attempts,
  }));

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 70) return "hsl(var(--primary))";
    if (score >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const improvementTips = [
    "Try short 10-min recall sessions daily",
    "Review notes within 24 hours for better retention",
    "Practice past paper questions regularly",
    "Create flashcards for key concepts",
    "Teach the topic to someone else",
  ];

  return (
    <div className="space-y-6">
      {/* Bar Chart Section */}
      <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
        <div className="absolute inset-0 bg-[var(--gradient-rainbow)] opacity-5" />
        <div className="relative backdrop-blur-sm bg-card/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              <TrendingUp className="h-6 w-6 text-primary animate-pulse" />
              Topic Performance Ranking
            </CardTitle>
          <p className="text-sm text-muted-foreground">
            All topics ranked from weakest to strongest
          </p>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis 
                  dataKey="topic" 
                  type="category" 
                  width={150}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Strong Topics Panel */}
        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
          <div className="absolute inset-0 bg-[var(--gradient-success)]" />
          <div className="relative backdrop-blur-sm bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <TrendingUp className="h-6 w-6 animate-bounce" />
                Strong Topics
              </CardTitle>
              <p className="text-sm text-success/80">
                Keep up the great work! 🌟
              </p>
            </CardHeader>
          <CardContent className="space-y-3">
            {strongTopics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-xl bg-success/10 backdrop-blur-sm border border-success/30 hover:border-success/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--success)/0.3)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{topic.topicId}</h4>
                  <Badge className="bg-success text-success-foreground shadow-[0_0_12px_hsl(var(--success)/0.5)]">
                    {Math.round(topic.averageScore)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-medium">{topic.attempts} attempts</p>
              </div>
            ))}
          </CardContent>
          </div>
        </Card>

        {/* Weak Topics Panel */}
        <Card className="relative overflow-hidden border-0 shadow-[var(--shadow-lg)]">
          <div className="absolute inset-0 bg-[var(--gradient-warning)]" />
          <div className="relative backdrop-blur-sm bg-card/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <TrendingDown className="h-6 w-6 animate-pulse" />
                Focus Areas
              </CardTitle>
              <p className="text-sm text-warning/80">
                Target these for maximum improvement 🎯
              </p>
            </CardHeader>
          <CardContent className="space-y-3">
            {weakTopics.map((topic, index) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-xl bg-warning/10 backdrop-blur-sm border border-warning/30 hover:border-warning/50 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--warning)/0.3)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{topic.topicId}</h4>
                    <div className="flex items-start gap-2 bg-info/10 p-2 rounded-lg border border-info/20">
                      <Lightbulb className="h-4 w-4 text-info mt-0.5 flex-shrink-0 animate-pulse" />
                      <p className="text-xs text-foreground font-medium">
                        {improvementTips[index % improvementTips.length]}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-warning text-warning-foreground shadow-[0_0_12px_hsl(var(--warning)/0.5)]">
                    {Math.round(topic.averageScore)}%
                  </Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => onPractice(topic.subjectId, topic.topicId)}
                  className="w-full mt-2 bg-[var(--gradient-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300"
                >
                  Practice Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};
