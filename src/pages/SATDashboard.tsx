import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, Target, Download, Clock, Calendar, Brain, ChevronRight, TrendingUp, TrendingDown, Play, Crown, Rocket } from "lucide-react";
import { SAT_DOMAINS } from "@/services/satDomainService";
import { SATTopicCard } from "@/components/sat/SATTopicCard";
import { loadDomainProgress } from "@/services/satProgressService";
import { DomainProgress } from "@/types/sat";

interface SATProfile {
  sat_baseline_score_low: number | null;
  sat_baseline_score_high: number | null;
  sat_predicted_score_low: number | null;
  sat_predicted_score_high: number | null;
  sat_target_band: string | null;
  sat_exam_date: string | null;
  sat_diagnostic_completed: boolean | null;
  sat_streak_days: number | null;
  sat_strength_domains: string[] | null;
  sat_weak_domains: string[] | null;
}

export default function SATDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SATProfile | null>(null);
  const [domainProgress, setDomainProgress] = useState<DomainProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [targetScore, setTargetScore] = useState<number>(1200);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadProgress();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('sat_baseline_score_low, sat_baseline_score_high, sat_predicted_score_low, sat_predicted_score_high, sat_target_band, sat_exam_date, sat_diagnostic_completed, sat_streak_days, sat_strength_domains, sat_weak_domains')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      
      if (data?.sat_target_band) {
        const targetMatch = data.sat_target_band.match(/\d+/);
        if (targetMatch) {
          setTargetScore(parseInt(targetMatch[0]));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    if (!user?.id) return;
    
    try {
      const progress = await loadDomainProgress(user.id);
      setDomainProgress(progress);
    } catch (error) {
      console.error('Error loading domain progress:', error);
    }
  };

  const handleStartPractice = (domainId: string) => {
    navigate(`/sat-session?domain=${domainId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile?.sat_diagnostic_completed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Complete Your Diagnostic Test</h2>
            <p className="text-muted-foreground">
              Take the diagnostic test to unlock your personalized SAT dashboard and study plan.
            </p>
            <Button onClick={() => navigate('/sat-diagnostic')} size="lg" className="w-full">
              Start Diagnostic Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentScoreLow = profile.sat_predicted_score_low || profile.sat_baseline_score_low || 400;
  const currentScoreHigh = profile.sat_predicted_score_high || profile.sat_baseline_score_high || 600;
  const daysUntilExam = profile.sat_exam_date 
    ? Math.ceil((new Date(profile.sat_exam_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const completedDomains = domainProgress.filter(p => p.masteryLevel === 'strong' || p.masteryLevel === 'expert').length;
  const overallProgress = domainProgress.length > 0
    ? Math.round(domainProgress.reduce((sum, p) => sum + p.accuracy, 0) / domainProgress.length)
    : 0;

  const retention = Math.min(Math.round(overallProgress * 0.85), 100);
  const weekMinutes = 180;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Hero Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 p-8"
        >
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Topics
              </h1>
              <p className="text-muted-foreground text-lg">
                Master all SAT domains to reach your target score
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/custom-exam-builder')} size="lg" className="gap-2">
                <Rocket className="w-4 h-4" />
                Build My Exam
              </Button>
              <Button onClick={() => navigate('/sat-session')} variant="outline" size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Quick Practice
              </Button>
            </div>
          </div>
        </motion.div>

        {/* KPI Belt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-all cursor-help">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Current Score</p>
                        <p className="text-2xl font-bold">{currentScoreLow}-{currentScoreHigh}</p>
                        <p className="text-xs text-muted-foreground mt-1">Target: {targetScore}</p>
                      </div>
                      <Target className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your predicted SAT score range based on recent performance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-all cursor-help">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Overall Progress</p>
                        <p className="text-2xl font-bold">{overallProgress}%</p>
                        <p className="text-xs text-muted-foreground mt-1">{completedDomains}/8 Strong</p>
                      </div>
                      <Brain className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your average accuracy across all SAT domains</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-all cursor-help">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Retention Rate</p>
                        <p className="text-2xl font-bold">{retention}%</p>
                        <p className="text-xs text-muted-foreground mt-1">Knowledge retained</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-emerald-500" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>How well you're retaining what you've learned</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="hover:shadow-lg transition-all cursor-help">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {daysUntilExam ? 'Days Until Exam' : 'This Week'}
                        </p>
                        <p className="text-2xl font-bold">
                          {daysUntilExam !== null ? daysUntilExam : `${weekMinutes}m`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {daysUntilExam ? 'Stay focused!' : 'Study time'}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-primary/60" />
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{daysUntilExam ? 'Time remaining until your SAT exam' : 'Your study time this week'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Topics Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Topics</h2>
              <p className="text-muted-foreground">
                Practice all 8 SAT domains to maximize your score
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {completedDomains}/8 Strong
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAT_DOMAINS.map((domain) => {
              const progress = domainProgress.find(p => p.domainId === domain.id) || {
                domain: domain.name,
                domainId: domain.id,
                questionsAnswered: 0,
                correctAnswers: 0,
                accuracy: 0,
                lastAttempt: null,
                masteryLevel: 'beginner' as const,
                scoreContribution: 0,
                attempts: 0
              };

              return (
                <SATTopicCard
                  key={domain.id}
                  domain={domain}
                  progress={progress}
                  onStartPractice={handleStartPractice}
                  lastActivity={progress.lastAttempt}
                />
              );
            })}
          </div>
        </div>

        {/* Footer Nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-muted-foreground"
        >
          <p className="text-sm">
            💪 You're doing great! Keep practicing to reach your target score of {targetScore}.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
