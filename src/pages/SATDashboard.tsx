import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Flame, Target, TrendingUp, BookOpen, Zap } from "lucide-react";
import { SATProfile, SATDailyPlan, SATActivity } from "@/types/sat";
import { motion } from "framer-motion";

export default function SATDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<SATProfile | null>(null);
  const [todaysPlan, setTodaysPlan] = useState<SATDailyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (profileData) {
        setProfile(profileData as SATProfile);
      }

      // Load today's plan
      const today = new Date().toISOString().split("T")[0];
      const { data: planData } = await supabase
        .from("sat_daily_plans")
        .select("*")
        .eq("user_id", user?.id)
        .eq("plan_date", today)
        .single();

      if (planData) {
        setTodaysPlan({
          ...planData,
          activities: (planData.activities as unknown) as SATActivity[],
        } as SATDailyPlan);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = () => {
    if (todaysPlan) {
      navigate(`/sat-session/${todaysPlan.id}`);
    }
  };

  const getScoreDisplay = () => {
    if (profile?.sat_predicted_score_low && profile?.sat_predicted_score_high) {
      return `${profile.sat_predicted_score_low}-${profile.sat_predicted_score_high}`;
    }
    if (profile?.sat_baseline_score_low && profile?.sat_baseline_score_high) {
      return `${profile.sat_baseline_score_low}-${profile.sat_baseline_score_high}`;
    }
    return "Take diagnostic";
  };

  const getPlanProgress = () => {
    if (!todaysPlan?.activities) return 0;
    const activities = Array.isArray(todaysPlan.activities) ? todaysPlan.activities : [];
    const completed = activities.filter((a: any) => a.completed).length;
    return (completed / activities.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SAT Prep Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              {profile?.sat_exam_date
                ? `Exam date: ${new Date(profile.sat_exam_date).toLocaleDateString()}`
                : "Set your exam date in settings"}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/settings")}>
            Settings
          </Button>
        </div>

        {/* Score Overview */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Estimated Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-primary">{getScoreDisplay()}</div>
                <p className="text-sm text-muted-foreground mt-1">Out of 1600</p>
              </div>
              {profile?.sat_target_band && (
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Target</div>
                  <div className="text-2xl font-semibold text-foreground">{profile.sat_target_band}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Flame className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.sat_streak_days || 0} days</div>
              <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Daily Goal</CardTitle>
              <Brain className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.sat_daily_minutes || 30} min</div>
              <p className="text-xs text-muted-foreground mt-1">Target practice time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Confidence</CardTitle>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {profile?.sat_confidence_level || "Unknown"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Current level</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Today's Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysPlan ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{Math.round(getPlanProgress())}%</span>
                  </div>
                  <Progress value={getPlanProgress()} className="h-2" />
                </div>

                {!todaysPlan.completed && (
                  <Button onClick={handleStartSession} className="w-full" size="lg">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Today's Session
                  </Button>
                )}

                {todaysPlan.completed && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="font-semibold text-foreground">Great work today!</p>
                    <p className="text-sm text-muted-foreground">Come back tomorrow for more practice</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  {profile?.sat_diagnostic_completed
                    ? "Generating your personalized plan..."
                    : "Complete your diagnostic test to get started"}
                </p>
                {!profile?.sat_diagnostic_completed && (
                  <Button onClick={() => navigate("/sat-diagnostic")}>Take Diagnostic Test</Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strengths & Focus Areas */}
        {profile?.sat_strength_domains && profile?.sat_weak_domains && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.sat_strength_domains.map((domain) => (
                    <Badge key={domain} variant="secondary" className="bg-green-500/10 text-green-700 dark:text-green-400">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Focus Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.sat_weak_domains.map((domain) => (
                    <Badge key={domain} variant="secondary" className="bg-orange-500/10 text-orange-700 dark:text-orange-400">
                      {domain}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
