import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Target, TrendingUp, Clock, AlertTriangle, CheckCircle, Calendar, Crown, User, Settings, Menu, X, BarChart3, Brain, Zap, Trophy, Star, Sparkles, Flame, Globe, Heart, Shield, Award, Lock } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictivePerformanceCard } from "@/components/dashboard/PredictivePerformanceCard";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { DashboardStressMonitor } from "@/components/dashboard/DashboardStressMonitor";
import { OptimalStudyTimeCard } from "@/components/dashboard/OptimalStudyTimeCard";
import { OptimalLearningTimeCard } from "@/components/dashboard/OptimalLearningTimeCard";
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";
import { PublicStreakProfiles } from "@/components/dashboard/PublicStreakProfiles";
import { TopicMasteryDisplay } from "@/components/dashboard/TopicMasteryDisplay";
import { CountdownTimer } from "@/components/dashboard/CountdownTimer";
import { StreakCelebration } from "@/components/ui/streak-celebration";
import { TimeSavedNotification } from "@/components/notifications/TimeSavedNotification";
import { GradeCelebration } from "@/components/ui/grade-celebration";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { playCelebratorySound } from "@/lib/celebratory-sound";
import { StressTracker } from "@/lib/stressTracker";

interface UserProgress {
  subjectId: string;
  topicId: string;
  averageScore: number;
  attempts: number;
  lastAttempt: Date;
}

interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string;
}

interface WeeklyStats {
  questionsAnswered: number;
  averageScore: number;
  streakDays: number;
  timeSavedHours: number;
}

const PremiumDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [studyStreak, setStudyStreak] = useState<StudyStreak>({ currentStreak: 0, longestStreak: 0, lastStudyDate: '' });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({ questionsAnswered: 0, averageScore: 0, streakDays: 0, timeSavedHours: 0 });
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showTimeSavedNotification, setShowTimeSavedNotification] = useState(false);
  const [showGradeCelebration, setShowGradeCelebration] = useState(false);
  const [celebrationGrade, setCelebrationGrade] = useState('');
  const [celebrationSubject, setCelebrationSubject] = useState('');
  const [currentStressLevel, setCurrentStressLevel] = useState(30);

  const {
    notification,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  useEffect(() => {
    if (user?.id) {
      loadUserProgress();
      loadWeakTopics();
      loadStudyStreak();
      loadWeeklyStats();
      loadPinnedSubjects();
      simulateStressLevel();
    }
  }, [user?.id]);

  const simulateStressLevel = () => {
    // Use a simple static stress level for now
    setCurrentStressLevel(35);
  };

  const loadUserProgress = () => {
    if (!user?.id) return;
    
    const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const loadWeakTopics = () => {
    if (!user?.id) return;
    
    const savedWeakTopics = localStorage.getItem(`mentiora_weak_topics_${user.id}`);
    if (savedWeakTopics) {
      setWeakTopics(JSON.parse(savedWeakTopics));
    }
  };

  const loadStudyStreak = () => {
    if (!user?.id) return;
    
    const savedStreak = localStorage.getItem(`mentiora_streak_${user.id}`);
    if (savedStreak) {
      const streak = JSON.parse(savedStreak);
      setStudyStreak(streak);
      
      // Check if we should show streak celebration
      if (streak.currentStreak > 0 && streak.currentStreak % 7 === 0) {
        setShowStreakCelebration(true);
        playCelebratorySound();
      }
    }
  };

  const loadWeeklyStats = () => {
    if (!user?.id) return;
    
    const savedStats = localStorage.getItem(`mentiora_weekly_stats_${user.id}`);
    if (savedStats) {
      const stats = JSON.parse(savedStats);
      setWeeklyStats(stats);
      
      // Show time saved notification if significant time saved
      if (stats.timeSavedHours > 10) {
        setShowTimeSavedNotification(true);
      }
    }
  };

  const loadPinnedSubjects = () => {
    if (!user?.id) return;
    
    const savedPinned = localStorage.getItem(`mentiora_pinned_${user.id}`);
    if (savedPinned) {
      setPinnedSubjects(JSON.parse(savedPinned));
    }
  };

  const handleStartPractice = (subjectId: string, topicId: string) => {
    navigate(`/premium-practice/${subjectId}/${topicId}`);
  };

  const handlePractice = (subjectId: string, topicId: string) => {
    navigate(`/premium-practice/${subjectId}/${topicId}`);
  };

  const handleTogglePin = (subjectId: string) => {
    const newPinned = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(newPinned);
    localStorage.setItem(`mentiora_pinned_${user?.id}`, JSON.stringify(newPinned));
    
    toast.success(
      pinnedSubjects.includes(subjectId) 
        ? "Subject unpinned from dashboard" 
        : "Subject pinned to dashboard"
    );
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const getTotalTopics = () => {
    return curriculum.reduce((total, subject) => total + subject.topics.length, 0);
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalProgress = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalProgress / userProgress.length);
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = subjectId.length % colors.length;
    return colors[index];
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sortedSubjects = [...curriculum].sort((a, b) => {
    const aIsPinned = pinnedSubjects.includes(a.id);
    const bIsPinned = pinnedSubjects.includes(b.id);
    
    if (aIsPinned && !bIsPinned) return -1;
    if (!aIsPinned && bIsPinned) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/50">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50 shadow-xl shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                  <img 
                    src="/lovable-uploads/b9fc36e7-121c-4ea0-8b31-fa15ba6d226c.png" 
                    alt="Mentiora Logo" 
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Crown className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              
              {/* Title and Status */}
              <div className="hidden sm:block">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 dark:from-violet-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    Mentiora
                  </h1>
                  <div className="flex items-center space-x-2">
                    <User className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">Free Account</span>
                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="sm:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center space-x-3">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/premium-analytics')}
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/premium-predicted-questions')}
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Crown className="h-4 w-4 mr-2" />
                Predicted 2026
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/premium-notebook')}
                className="text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Notebook
              </Button>
              <ThemeToggle />
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="sm:hidden mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex flex-col space-y-2">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/premium-analytics');
                    setShowMobileMenu(false);
                  }}
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/premium-predicted-questions');
                    setShowMobileMenu(false);
                  }}
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Predicted 2026
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/premium-notebook');
                    setShowMobileMenu(false);
                  }}
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Notebook
                </Button>
                <div className="flex items-center justify-between pt-2">
                  <ThemeToggle />
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    size="sm"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-blue-700 dark:from-slate-200 dark:via-purple-300 dark:to-blue-300 bg-clip-text text-transparent mb-4">
              Premium Dashboard
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your GCSE revision progress with AI-powered insights and personalized learning paths
            </p>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Topics Mastered"
            value={getMasteredTopics()}
            subtitle={`of ${getTotalTopics()} total topics`}
            progress={(getMasteredTopics() / getTotalTopics()) * 100}
            icon={Target}
            color="text-green-600"
            trend={12}
          />
          <ProgressCard
            title="Overall Progress"
            value={`${getOverallProgress()}%`}
            subtitle="Average across all subjects"
            progress={getOverallProgress()}
            icon={TrendingUp}
            color="text-blue-600"
            trend={8}
          />
          <ProgressCard
            title="Study Streak"
            value={studyStreak.currentStreak}
            subtitle={`Longest: ${studyStreak.longestStreak} days`}
            progress={(studyStreak.currentStreak / Math.max(studyStreak.longestStreak, 1)) * 100}
            icon={Flame}
            color="text-orange-600"
            trend={studyStreak.currentStreak > 0 ? 1 : 0}
          />
          <ProgressCard
            title="Questions This Week"
            value={weeklyStats.questionsAnswered}
            subtitle={`${weeklyStats.averageScore}% average`}
            progress={weeklyStats.averageScore}
            icon={CheckCircle}
            color="text-purple-600"
            trend={15}
          />
        </div>

        {/* Advanced Analytics Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PredictivePerformanceCard userProgress={userProgress} />
          <Card>
            <CardHeader>
              <CardTitle>Stress Monitor</CardTitle>
              <CardDescription>Track your study stress levels</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Stress monitoring feature coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Features Row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <OptimalStudyTimeCard />
          <OptimalLearningTimeCard />
          <Card>
            <CardHeader>
              <CardTitle>Study Playlist</CardTitle>
              <CardDescription>Curated music for studying</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Study playlist feature coming soon</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Mastery Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <GoalsSection />
          <TopicMasteryDisplay />
        </div>

        {/* Premium Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PremiumAnalyticsCard
            title="Advanced Performance Metrics"
            description="Deep dive into your learning patterns with AI-powered insights"
            icon={Brain}
            gradient="from-violet-500 to-purple-600"
          />
          <PremiumAnalyticsCard
            title="Predicted Grade Calculator"
            description="Get accurate GCSE grade predictions based on your progress"
            icon={Trophy}
            gradient="from-blue-500 to-indigo-600"
          />
        </div>

        {/* Weak Topics Section */}
        <div className="mb-8">
          <WeakTopicsSection 
            weakTopics={weakTopics} 
            userProgress={userProgress}
            onPractice={handlePractice}
          />
        </div>

        {/* Predicted Questions Section */}
        <div className="mb-8">
          <PredictedQuestionsSection />
        </div>

        {/* Community Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PublicStreakProfiles />
          <PremiumAnalyticsCard
            title="Study Groups & Competitions"
            description="Join study groups and compete with other students"
            icon={Globe}
            gradient="from-green-500 to-emerald-600"
            comingSoon
          />
        </div>

        {/* Subjects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Your Subjects</h3>
            <Badge variant="outline" className="text-muted-foreground">
              {curriculum.length} subjects available
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSubjects.map((subject) => (
              <div key={subject.id} onClick={() => navigate(`/premium-subject/${subject.id}`)}>
                <SubjectCard
                  subject={{
                    ...subject,
                    color: getSubjectColor(subject.id)
                  }}
                  progress={userProgress}
                  onStartPractice={(subjectId: string) => handleStartPractice(subjectId, '')}
                  onTogglePin={handleTogglePin}
                  isPinned={pinnedSubjects.includes(subject.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Celebrations and Notifications */}
      <StreakCelebration
        isVisible={showStreakCelebration}
        streakDays={studyStreak.currentStreak}
        onClose={() => setShowStreakCelebration(false)}
        rewardText="Amazing dedication! Keep up the fantastic work!"
        rewardEmoji="🔥"
      />
      
      <TimeSavedNotification
        show={showTimeSavedNotification}
        timeSavedHours={weeklyStats.timeSavedHours}
        onClose={() => setShowTimeSavedNotification(false)}
      />
      
      {showGradeCelebration && (
        <GradeCelebration
          isVisible={showGradeCelebration}
          grade={celebrationGrade}
          subject={celebrationSubject}
          onClose={() => setShowGradeCelebration(false)}
        />
      )}

      {notification && (
        <div>
          {/* Notification placeholder - component needs to be fixed */}
        </div>
      )}
    </div>
  );
};

export default PremiumDashboard;