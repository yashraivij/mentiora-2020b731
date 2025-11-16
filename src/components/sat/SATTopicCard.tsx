import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Circle, Calendar, ArrowRight, Lock } from "lucide-react";
import { DomainProgress } from "@/types/sat";

interface SATTopicCardProps {
  domain: {
    id: string;
    name: string;
    color: string;
    icon: string;
    category: string;
    description: string;
    status: string;
  };
  progress: DomainProgress;
  onStartPractice: (domainId: string) => void;
  lastActivity?: Date | null;
}

export const SATTopicCard = ({ 
  domain, 
  progress,
  onStartPractice, 
  lastActivity
}: SATTopicCardProps) => {
  const { accuracy, questionsAnswered, masteryLevel } = progress;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 dark:from-emerald-950/30 dark:to-emerald-900/30 dark:border-emerald-800/30';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 dark:from-yellow-950/30 dark:to-yellow-900/30 dark:border-yellow-800/30';
    return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200 dark:from-red-950/30 dark:to-red-900/30 dark:border-red-800/30';
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'No activity yet';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getMasteryBadge = () => {
    const badges = {
      beginner: { label: 'Beginner', variant: 'secondary' as const, icon: Circle },
      developing: { label: 'Developing', variant: 'secondary' as const, icon: AlertCircle },
      strong: { label: 'Strong', variant: 'default' as const, icon: CheckCircle },
      expert: { label: 'Expert', variant: 'default' as const, icon: CheckCircle }
    };
    return badges[masteryLevel];
  };

  const masteryBadge = getMasteryBadge();
  const MasteryIcon = masteryBadge.icon;

  return (
    <Card 
      className="group relative overflow-hidden border-0 backdrop-blur-sm shadow-lg transition-all duration-500 rounded-3xl bg-card/80 hover:shadow-2xl cursor-pointer"
      onClick={() => onStartPractice(domain.id)}
    >
      {/* Premium Background Gradient */}
      <div className={`absolute inset-0 ${domain.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

      <CardContent className="relative p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl ${domain.color} flex items-center justify-center text-3xl shadow-lg`}>
              {domain.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                {domain.name}
              </h3>
              <Badge variant="outline" className="text-xs font-medium">
                {domain.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className={`rounded-xl p-4 border transition-all duration-300 ${getScoreBg(accuracy)}`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
            <span className={`text-2xl font-bold ${getScoreColor(accuracy)}`}>
              {accuracy}%
            </span>
          </div>
          <Progress value={accuracy} className="h-2" />
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {questionsAnswered} questions answered
            </span>
            <Badge variant={masteryBadge.variant} className="flex items-center gap-1">
              <MasteryIcon className="w-3 h-3" />
              {masteryBadge.label}
            </Badge>
          </div>
        </div>

        {/* Last Activity */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Last practiced: {formatLastActivity(progress.lastAttempt)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onStartPractice(domain.id);
          }}
          className="w-full group/btn"
          size="lg"
        >
          <span>Practice Now</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
