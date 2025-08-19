import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, TrendingUp, User, LogOut, Flame, Trophy, Clock, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { TopicMasteryDisplay } from "@/components/dashboard/TopicMasteryDisplay";
import { PredictivePerformanceCard } from "@/components/dashboard/PredictivePerformanceCard";
import { OptimalStudyTimeCard } from "@/components/dashboard/OptimalStudyTimeCard";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";
import { PublicStreakProfiles } from '@/components/dashboard/PublicStreakProfiles';
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    
    // Load progress from localStorage
    const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserProgress(progress);
      
      // Calculate weak topics
      const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
      setWeakTopics(weak);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-card/50 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <BookOpen className="h-8 w-8 text-primary" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Premium Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.email?.split('@')[0]}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ColorThemeToggle />
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <User className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard content without restrictions */}
      <div className="p-6 space-y-8">
        {/* Premium badge */}
        <div className="flex items-center justify-center">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
            ✨ Premium Access - All Features Unlocked
          </Badge>
        </div>

        {/* Top stats row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <ProgressCard
            title="Overall Progress"
            value="85%"
            icon={TrendingUp}
            color="text-green-500"
          />
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">7</span>
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">6.8</span>
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overall Grade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-2xl font-bold">A*</span>
                <span className="text-sm text-muted-foreground">predicted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <WeakTopicsSection 
                  weakTopics={weakTopics}
                  userProgress={userProgress}
                  onPractice={(topicId) => navigate(`/practice/physics/${topicId}`)}
                />
                <AOBreakdown userProgress={userProgress} />
                <PredictedQuestionsSection />
              </div>
              <div className="space-y-6">
                <GoalsSection />
                <TopicMasteryDisplay />
                <StudyPlaylist isUnlocked={true} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PredictivePerformanceCard userProgress={userProgress} />
              <OptimalStudyTimeCard />
              <PredictedGradesGraph userProgress={userProgress} />
              <PremiumAnalyticsCard
                title="Advanced Study Patterns"
                description="Deep learning insights into your study habits and optimal learning times."
                icon={Brain}
                gradient="from-purple-500 to-pink-500"
              />
            </div>
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GoalsSection />
              <TopicMasteryDisplay />
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <PublicStreakProfiles />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PremiumDashboard;