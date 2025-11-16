import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, Calendar, Flame, Play, Crown, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SATTopicCard } from "./SATTopicCard";
import { SAT_TOPICS } from "@/services/satTopicsConfig";
import { useState } from "react";

interface SATMedlyTopicsViewProps {
  profile: {
    currentScoreLow: number;
    currentScoreHigh: number;
    targetScore: number;
    daysUntilExam: number;
    examDate: string;
    weeklyMinutes: number;
    dailyGoalMinutes: number;
    streakDays: number;
  };
  topicPerformance: Array<{
    topicId: string;
    accuracy: number;
    questionsAttempted: number;
    lastPracticed: Date | null;
    trend: number[];
  }>;
  onOpenTopicDrawer: (topicId: string) => void;
  isPremium?: boolean;
  onUpgradeToPremium?: () => void;
}

export function SATMedlyTopicsView({
  profile,
  topicPerformance,
  onOpenTopicDrawer,
  isPremium = false,
  onUpgradeToPremium,
}: SATMedlyTopicsViewProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | null>(null);

  const getScoreProgress = () => {
    const current = Math.round((profile.currentScoreLow + profile.currentScoreHigh) / 2);
    const gap = profile.targetScore - current;
    const progress = gap > 0 ? ((current - 400) / (profile.targetScore - 400)) * 100 : 100;
    return { current, gap, progress: Math.min(Math.max(progress, 0), 100) };
  };

  const scoreData = getScoreProgress();

  const filteredTopics = SAT_TOPICS.map(topic => {
    const perf = topicPerformance.find(p => p.topicId === topic.id) || {
      accuracy: 0,
      questionsAttempted: 0,
      lastPracticed: null,
      trend: []
    };
    return { topic, performance: perf };
  }).filter(({ performance }) => {
    if (filter === 'needs-focus') return performance.accuracy < 60;
    if (filter === 'strong') return performance.accuracy >= 75;
    return true;
  });

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          My Topics
        </h1>
        <p className="text-muted-foreground text-lg">
          SAT performance, focus areas & weekly plan at a glance
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button 
          size="lg"
          onClick={() => navigate('/sat-session')}
          className="gap-2 shadow-lg"
        >
          <Play className="w-5 h-5" />
          Start Practice Session
        </Button>
        {!isPremium && onUpgradeToPremium && (
          <Button 
            size="lg"
            variant="outline"
            onClick={onUpgradeToPremium}
            className="gap-2 border-2 border-primary/20 hover:border-primary/40"
          >
            <Crown className="w-5 h-5 text-primary" />
            Upgrade to Premium
          </Button>
        )}
      </div>

      {/* KPI Belt */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score Progress */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/60 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Score Progress</p>
                <p className="text-2xl font-black">
                  {profile.currentScoreLow}-{profile.currentScoreHigh}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Target: {profile.targetScore}</span>
                <span className="font-bold text-primary">{scoreData.gap > 0 ? `+${scoreData.gap}` : 'Goal Reached!'}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${scoreData.progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Days Until Exam */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/60 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Days Until Exam</p>
                <p className="text-2xl font-black">{profile.daysUntilExam}</p>
                <p className="text-xs text-muted-foreground">{profile.examDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Study Time */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/60 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Clock className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">This Week</p>
                <p className="text-2xl font-black">{profile.weeklyMinutes} min</p>
                <p className="text-xs text-muted-foreground">Daily goal: {profile.dailyGoalMinutes} min</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Streak */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card/80 to-card/60 backdrop-blur">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
                <p className="text-2xl font-black">{profile.streakDays} days</p>
                <p className="text-xs text-muted-foreground">Keep it going!</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Topics</h2>
          <div className="flex gap-2">
            <Button
              variant={filter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            <Button
              variant={filter === 'needs-focus' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('needs-focus')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Needs Focus
            </Button>
            <Button
              variant={filter === 'strong' ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter('strong')}
            >
              <Filter className="w-4 h-4 mr-2" />
              Strong
            </Button>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map(({ topic, performance }) => (
            <SATTopicCard
              key={topic.id}
              topic={topic}
              performance={performance}
              onOpenDrawer={onOpenTopicDrawer}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
