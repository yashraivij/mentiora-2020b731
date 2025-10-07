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
      <Card className="border-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
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
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Strong Topics Panel */}
        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              Strong Topics
            </CardTitle>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
              Keep up the great work!
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {strongTopics.map((topic) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-lg bg-white/50 dark:bg-card/50 border border-emerald-200/50 dark:border-emerald-800/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{topic.topicId}</h4>
                  <Badge className="bg-emerald-500 text-white">{Math.round(topic.averageScore)}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{topic.attempts} attempts</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weak Topics Panel */}
        <Card className="border-0 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <TrendingDown className="h-5 w-5" />
              Weak Topics
            </CardTitle>
            <p className="text-sm text-red-600/80 dark:text-red-400/80">
              Focus here for maximum improvement
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {weakTopics.map((topic, index) => (
              <div
                key={topic.topicId}
                className="p-4 rounded-lg bg-white/50 dark:bg-card/50 border border-red-200/50 dark:border-red-800/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">{topic.topicId}</h4>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-muted-foreground">
                        {improvementTips[index % improvementTips.length]}
                      </p>
                    </div>
                  </div>
                  <Badge variant="destructive">{Math.round(topic.averageScore)}%</Badge>
                </div>
                <Button
                  size="sm"
                  onClick={() => onPractice(topic.subjectId, topic.topicId)}
                  className="w-full mt-2"
                  variant="outline"
                >
                  Practice Now
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
