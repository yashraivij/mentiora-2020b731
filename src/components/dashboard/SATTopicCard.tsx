import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface SATTopicCardProps {
  topic: {
    id: string;
    name: string;
    section: string;
    color: string;
    description: string;
  };
  performance: {
    accuracy: number;
    questionsAttempted: number;
    lastPracticed: Date | null;
    trend: number[];
  };
  onOpenDrawer: (topicId: string) => void;
}

export const SATTopicCard = ({ topic, performance, onOpenDrawer }: SATTopicCardProps) => {
  const { accuracy, questionsAttempted, lastPracticed, trend } = performance;

  const getMasteryLevel = (acc: number) => {
    if (acc >= 75) return { label: 'Strong', color: 'text-emerald-600 dark:text-emerald-400', emoji: '🟢', bg: 'bg-emerald-50 dark:bg-emerald-950/30' };
    if (acc >= 60) return { label: 'Developing', color: 'text-yellow-600 dark:text-yellow-400', emoji: '🟡', bg: 'bg-yellow-50 dark:bg-yellow-950/30' };
    return { label: 'Needs Focus', color: 'text-red-500 dark:text-red-400', emoji: '🔴', bg: 'bg-red-50 dark:bg-red-950/30' };
  };

  const getTrendIcon = () => {
    if (trend.length < 2) return <Minus className="w-3 h-3" />;
    const recent = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const earlier = trend.slice(0, -3).reduce((a, b) => a + b, 0) / (trend.length - 3);
    if (recent > earlier + 5) return <TrendingUp className="w-3 h-3 text-emerald-500" />;
    if (recent < earlier - 5) return <TrendingDown className="w-3 h-3 text-red-500" />;
    return <Minus className="w-3 h-3 text-muted-foreground" />;
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'Not practiced yet';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const mastery = getMasteryLevel(accuracy);

  return (
    <Card 
      className="group relative overflow-hidden border-0 backdrop-blur-sm shadow-lg transition-all duration-500 rounded-3xl bg-card/80 hover:shadow-2xl cursor-pointer"
      onClick={() => onOpenDrawer(topic.id)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 ${topic.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between mb-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold tracking-tight">{topic.name}</CardTitle>
            <p className="text-xs text-muted-foreground">{topic.section}</p>
          </div>
          <Badge variant="outline" className={`${mastery.bg} ${mastery.color} border-0 font-semibold`}>
            {mastery.emoji} {mastery.label}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{topic.description}</p>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Accuracy Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Accuracy</span>
            <span className={`font-bold ${mastery.color}`}>{accuracy}%</span>
          </div>
          <Progress value={accuracy} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Questions</p>
            <p className="text-lg font-bold">{questionsAttempted}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Trend</p>
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className="text-sm font-medium">{trend.length > 0 ? 'Active' : 'New'}</span>
            </div>
          </div>
        </div>

        {/* Last Activity */}
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Last practiced: <span className="font-medium">{formatLastActivity(lastPracticed)}</span>
          </p>
        </div>

        {/* Hover Action */}
        <Button 
          variant="ghost" 
          size="sm"
          className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDrawer(topic.id);
          }}
        >
          View Details <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};
