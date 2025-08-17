import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
import { TimeSavedNotification } from "@/components/notifications/TimeSavedNotification";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { TopicMasteryDisplay } from "@/components/dashboard/TopicMasteryDisplay";
import { PredictivePerformanceCard } from "@/components/dashboard/PredictivePerformanceCard";
import { OptimalStudyTimeCard } from "@/components/dashboard/OptimalStudyTimeCard";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";
import { supabase } from "@/integrations/supabase/client";
import { StressTracker } from "@/lib/stressTracker";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { StreakCelebration } from "@/components/ui/streak-celebration";
import { GradeCelebration } from "@/components/ui/grade-celebration";
import { DiscordInvitation } from "@/components/ui/discord-invitation";
import { PublicStreakProfiles } from '@/components/dashboard/PublicStreakProfiles';
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'weakest' | 'progress'>('progress');
  const [selectedExamBoard, setSelectedExamBoard] = useState('aqa');
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [subjectsTab, setSubjectsTab] = useState<'my-subjects' | 'all-subjects'>('my-subjects');

  const {
    notification,
    checkForWeakTopicRecommendation,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;
      
      // Load progress from localStorage to mirror the original dashboard
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
        setWeakTopics(weak);
      }

      // Load pinned subjects from localStorage
      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }
    };

    loadUserData();
  }, [user?.id]);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
  };

  const handleStartPractice = (subjectId: string, topicId: string) => {
    navigate(`/practice?subject=${subjectId}&topic=${topicId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-4 flex h-16 items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Premium Dashboard
            </h1>
            <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
              <Crown className="h-3 w-3 mr-1 text-purple-500" />
              Premium
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <ColorThemeToggle />
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
        {/* Notifications */}
        {notification && notification.type && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            {/* Notification content would go here */}
          </motion.div>
        )}

        {/* Premium Dashboard Content */}
        <div className="text-center p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-purple-500 mr-3" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Premium Dashboard
            </h2>
          </div>
          <p className="text-muted-foreground text-lg">
            This is an exact duplicate of your dashboard. Premium features will be added here soon.
          </p>
        </div>

        {/* Copy of main dashboard sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overview section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ProgressCard
                    title="Topics Completed"
                    value={userProgress.filter(p => p.attempts > 0).length.toString()}
                    progress={Math.min((userProgress.filter(p => p.attempts > 0).length / 50) * 100, 100)}
                    icon={CheckCircle}
                    color="text-green-600"
                  />
                  <ProgressCard
                    title="Average Score"
                    value={userProgress.length > 0 ? Math.round(userProgress.reduce((sum, p) => sum + p.averageScore, 0) / userProgress.length) + "%" : "0%"}
                    progress={userProgress.length > 0 ? userProgress.reduce((sum, p) => sum + p.averageScore, 0) / userProgress.length : 0}
                    icon={TrendingUp}
                    color="text-blue-600"
                  />
                  <ProgressCard
                    title="Study Streak"
                    value="0 days"
                    progress={0}
                    icon={Flame}
                    color="text-orange-600"
                  />
                  <ProgressCard
                    title="Weak Topics"
                    value={weakTopics.length.toString()}
                    progress={Math.max(0, 100 - (weakTopics.length * 10))}
                    icon={Target}
                    color="text-red-600"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Subjects section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  My Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {curriculum.slice(0, 4).map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={{
                        ...subject,
                        color: subject.id === 'physics-edexcel' ? 'blue' : 
                               subject.id === 'chemistry-aqa' ? 'green' :
                               subject.id === 'biology-aqa' ? 'red' : 'purple'
                      }}
                      progress={userProgress.filter(p => p.subjectId === subject.id)}
                      onStartPractice={() => handleStartPractice(subject.id, '')}
                      isPinned={pinnedSubjects.includes(subject.id)}
                      onTogglePin={() => {}}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <GoalsSection />
            <WeakTopicsSection
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={handleStartPractice}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;