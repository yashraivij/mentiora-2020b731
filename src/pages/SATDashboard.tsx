import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { User, Menu, Crown, Loader2, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SATMedlyTopicsView } from "@/components/dashboard/SATMedlyTopicsView";
import { SATPredictedScoresGraph } from "@/components/dashboard/SATPredictedScoresGraph";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { StudyInsights } from "@/components/dashboard/StudyInsights";
import { SATTopicDrawer } from "@/components/dashboard/SATTopicDrawer";
import { SAT_TOPICS, DOMAIN_TO_TOPIC_MAP } from "@/services/satTopicsConfig";

const SATDashboard = () => {
  const { user } = useAuth();
  const { isPremium, isLoading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("learn");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [topicPerformance, setTopicPerformance] = useState<any[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [topicDrawerOpen, setTopicDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (user?.id) {
      loadSATDashboardData();
    }
  }, [user?.id]);

  const loadSATDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        // Check if diagnostic is completed
        if (!profileData.sat_diagnostic_completed) {
          setLoading(false);
          return;
        }

        // Calculate days until exam
        const examDate = profileData.sat_exam_date ? new Date(profileData.sat_exam_date) : null;
        const daysUntilExam = examDate 
          ? Math.ceil((examDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          : 0;

        setProfile({
          currentScoreLow: profileData.sat_predicted_score_low || profileData.sat_baseline_score_low || 400,
          currentScoreHigh: profileData.sat_predicted_score_high || profileData.sat_baseline_score_high || 600,
          targetScore: profileData.sat_target_score || 1300,
          daysUntilExam: Math.max(0, daysUntilExam),
          examDate: examDate ? examDate.toLocaleDateString() : 'Not set',
          weeklyMinutes: 0,
          dailyGoalMinutes: profileData.sat_daily_minutes || 30,
          streakDays: profileData.sat_streak_days || 0,
          diagnosticCompleted: profileData.sat_diagnostic_completed
        });
      }

      // Load weekly study time
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const { data: sessionLogs } = await supabase
        .from('sat_session_logs')
        .select('time_spent_minutes')
        .eq('user_id', user.id)
        .gte('session_date', weekStart.toISOString().split('T')[0]);

      const weeklyMinutes = sessionLogs?.reduce((sum, log) => sum + log.time_spent_minutes, 0) || 0;
      setProfile((prev: any) => prev ? { ...prev, weeklyMinutes } : prev);

      // Calculate topic performance
      const { data: allSessions } = await supabase
        .from('sat_session_logs')
        .select('answers, session_date')
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      // Process performance by topic
      const topicStats: Record<string, any> = {};
      SAT_TOPICS.forEach(topic => {
        topicStats[topic.id] = {
          topicId: topic.id,
          correct: 0,
          total: 0,
          lastPracticed: null as Date | null,
          dailyAccuracy: [] as number[]
        };
      });

      allSessions?.forEach(session => {
        const answers = session.answers as any[];
        const sessionDate = new Date(session.session_date);
        
        answers?.forEach((answer: any) => {
          const domain = answer.domain || '';
          const topicId = DOMAIN_TO_TOPIC_MAP[domain] || null;
          
          if (topicId && topicStats[topicId]) {
            topicStats[topicId].total++;
            if (answer.is_correct) topicStats[topicId].correct++;
            if (!topicStats[topicId].lastPracticed || sessionDate > topicStats[topicId].lastPracticed) {
              topicStats[topicId].lastPracticed = sessionDate;
            }
          }
        });
      });

      // Convert to array with calculated metrics
      const performance = Object.values(topicStats).map((stats: any) => ({
        topicId: stats.topicId,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        questionsAttempted: stats.total,
        lastPracticed: stats.lastPracticed,
        trend: stats.dailyAccuracy,
        strongAreas: stats.accuracy >= 75 ? ['Consistently accurate', 'Good understanding'] : [],
        focusAreas: stats.accuracy < 60 ? ['Needs more practice', 'Review fundamentals'] : []
      }));

      setTopicPerformance(performance);
    } catch (error) {
      console.error('Error loading SAT dashboard data:', error);
      toast({
        title: "Error loading dashboard",
        description: "Please try refreshing the page",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTopicDrawer = (topicId: string) => {
    setSelectedTopicId(topicId);
    setTopicDrawerOpen(true);
  };

  const selectedTopicPerformance = selectedTopicId 
    ? topicPerformance.find(p => p.topicId === selectedTopicId) || {
        accuracy: 0,
        questionsAttempted: 0,
        lastPracticed: null,
        trend: [],
        strongAreas: [],
        focusAreas: []
      }
    : {
        accuracy: 0,
        questionsAttempted: 0,
        lastPracticed: null,
        trend: [],
        strongAreas: [],
        focusAreas: []
      };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your SAT dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile?.diagnosticCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        <div className="text-center space-y-4 max-w-md">
          <Trophy className="h-16 w-16 text-primary mx-auto" />
          <h1 className="text-3xl font-bold">Start Your SAT Journey</h1>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={mentioraLogo} alt="Mentiora" className="h-8 w-auto" />
            {!isMobile && <span className="font-bold text-lg">Mentiora SAT</span>}
          </div>

          {!isMobile && (
            <nav className="flex items-center gap-6">
              <Button variant="ghost" onClick={() => setActiveTab("learn")} className={activeTab === "learn" ? "bg-muted" : ""}>Learn</Button>
              <Button variant="ghost" onClick={() => setActiveTab("progress")} className={activeTab === "progress" ? "bg-muted" : ""}>Progress</Button>
            </nav>
          )}

          <div className="flex items-center gap-3">
            {isMobile ? (
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}><Menu className="h-5 w-5" /></Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}><User className="h-5 w-5" /></Button>
            )}
          </div>
        </div>
      </header>


      <main className="container px-4 py-8">
        {activeTab === "learn" && (
          <SATMedlyTopicsView profile={profile} topicPerformance={topicPerformance} onOpenTopicDrawer={handleOpenTopicDrawer} isPremium={isPremium} onUpgradeToPremium={() => navigate('/pricing')} />
        )}

        {activeTab === "progress" && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Your Progress</h1>
              <p className="text-muted-foreground text-lg">Track your SAT score predictions and performance metrics</p>
            </div>
            <div className="grid gap-6">
              <SATPredictedScoresGraph onUpgrade={() => navigate('/pricing')} />
              {!isPremium && (
                <Card className="border-2 border-primary/20">
                  <CardContent className="pt-6 text-center space-y-4">
                    <Crown className="w-12 h-12 mx-auto text-primary" />
                    <div>
                      <h3 className="font-semibold text-lg">Unlock Advanced Analytics</h3>
                      <p className="text-sm text-muted-foreground">Get detailed performance insights</p>
                    </div>
                    <Button onClick={() => navigate('/pricing')}>Upgrade to Premium</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>

      <SATTopicDrawer open={topicDrawerOpen} onOpenChange={setTopicDrawerOpen} topicId={selectedTopicId} performance={selectedTopicPerformance} />
    </div>
  );
};

export default SATDashboard;
