import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, Trophy, Target, Calendar, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface SATProfile {
  sat_baseline_score_low: number | null;
  sat_baseline_score_high: number | null;
  sat_predicted_score_low: number | null;
  sat_predicted_score_high: number | null;
  sat_strength_domains: string[] | null;
  sat_weak_domains: string[] | null;
  sat_exam_date: string | null;
  sat_daily_minutes: number | null;
  sat_streak_days: number | null;
  sat_diagnostic_completed: boolean | null;
}

export default function SATDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SATProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('sat_baseline_score_low, sat_baseline_score_high, sat_predicted_score_low, sat_predicted_score_high, sat_strength_domains, sat_weak_domains, sat_exam_date, sat_daily_minutes, sat_streak_days, sat_diagnostic_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading SAT profile:', error);
      toast.error('Failed to load your SAT profile');
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilExam = () => {
    if (!profile?.sat_exam_date) return null;
    const examDate = new Date(profile.sat_exam_date);
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile?.sat_diagnostic_completed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center space-y-4 max-w-md">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Start Your SAT Journey</h1>
          <p className="text-muted-foreground">
            Complete your diagnostic test to get a personalized study plan and track your progress toward your target score.
          </p>
          <Button onClick={() => navigate('/sat-diagnostic')} size="lg" className="w-full">
            Begin Diagnostic Test
          </Button>
        </div>
      </div>
    );
  }

  const daysUntilExam = getDaysUntilExam();
  const currentScore = profile.sat_predicted_score_low && profile.sat_predicted_score_high
    ? `${profile.sat_predicted_score_low}-${profile.sat_predicted_score_high}`
    : 'Not yet calculated';

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SAT Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and stay on target</p>
          </div>
          {profile.sat_streak_days && profile.sat_streak_days > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">{profile.sat_streak_days} day streak!</span>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Score Range */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Score Range</p>
                <p className="text-3xl font-bold text-foreground mt-1">{currentScore}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <Progress 
              value={profile.sat_predicted_score_low ? ((profile.sat_predicted_score_low - 400) / 1200) * 100 : 0} 
              className="h-2"
            />
          </Card>

          {/* Days Until Exam */}
          {daysUntilExam !== null && (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Days Until Exam</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{daysUntilExam}</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {profile.sat_exam_date && new Date(profile.sat_exam_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </Card>
          )}

          {/* Daily Goal */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Daily Study Goal</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {profile.sat_daily_minutes || 30} <span className="text-lg">min</span>
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Stay consistent to improve!</p>
          </Card>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold text-foreground">Your Strengths</h2>
            </div>
            {profile.sat_strength_domains && profile.sat_strength_domains.length > 0 ? (
              <div className="space-y-2">
                {profile.sat_strength_domains.map((domain, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-foreground">{domain}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete more practice sessions to identify your strengths</p>
            )}
          </Card>

          {/* Focus Areas */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-bold text-foreground">Focus Areas</h2>
            </div>
            {profile.sat_weak_domains && profile.sat_weak_domains.length > 0 ? (
              <div className="space-y-2">
                {profile.sat_weak_domains.map((domain, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="text-sm text-foreground">{domain}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Complete more practice sessions to identify focus areas</p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button onClick={() => navigate('/sat-session')} size="lg" className="w-full">
              <BookOpen className="h-5 w-5 mr-2" />
              Start Practice Session
            </Button>
            <Button onClick={() => navigate('/sat-diagnostic')} variant="outline" size="lg" className="w-full">
              <Target className="h-5 w-5 mr-2" />
              Retake Diagnostic
            </Button>
            <Button onClick={() => toast.info('Progress tracking coming soon!')} variant="outline" size="lg" className="w-full">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Detailed Progress
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
