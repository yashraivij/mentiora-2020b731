import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2, Menu, X, Globe } from "lucide-react";
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
import { OptimalLearningTimeCard } from "@/components/dashboard/OptimalLearningTimeCard";

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
  const [isNotifyClicked, setIsNotifyClicked] = useState(false);
  const [selectedExamBoard, setSelectedExamBoard] = useState('aqa');
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [subjectsTab, setSubjectsTab] = useState<'my-subjects' | 'all-subjects'>('my-subjects');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showTimeSavedNotification, setShowTimeSavedNotification] = useState(false);
  const [timeSavedHours, setTimeSavedHours] = useState(0);
  const [previousTimeSaved, setPreviousTimeSaved] = useState(0);
  const [showGradeCelebration, setShowGradeCelebration] = useState(false);
  const [celebrationGrade, setCelebrationGrade] = useState('');
  const [celebrationSubject, setCelebrationSubject] = useState('');
  const [showDiscordInvitation, setShowDiscordInvitation] = useState(false);

  const {
    notification,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
    showStudyRecommendation,
    clearNotificationCache,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  // Check if user has seen streak celebration for specific streak count
  const hasSeenStreakCelebration = async (streakDays: number): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const { data, error } = await supabase
        .from('streak_celebrations_viewed')
        .select('id')
        .eq('user_id', user.id)
        .eq('streak_days', streakDays)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error checking streak celebration viewed:', error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error checking streak celebration viewed:', error);
      return false;
    }
  };

  // Mark streak celebration as viewed
  const markStreakCelebrationViewed = async (streakDays: number) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('streak_celebrations_viewed')
        .insert({
          user_id: user.id,
          streak_days: streakDays
        });
    } catch (error) {
      console.error('Error marking streak celebration as viewed:', error);
    }
  };

  // Load time saved statistics from notebook entries
  const loadTimeSavedStats = async () => {
    if (!user?.id) return;

    try {
      // Get the stored previous value first
      const savedTimeSaved = localStorage.getItem(`mentiora_time_saved_${user.id}`);
      const storedPreviousTime = savedTimeSaved ? parseFloat(savedTimeSaved) : 0;

      const { data: entries, error } = await supabase
        .from('notebook_entries')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading notebook entries for time saved:', error);
        return;
      }

      const totalEntries = entries?.length || 0;
      // Calculate time saved: Assume each note saves 10 minutes of manual revision time (more realistic)
      const timeSavedMinutes = totalEntries * 10;
      const newTimeSavedHours = Math.round(timeSavedMinutes / 6) / 10; // Convert to hours and round to 1 decimal

      console.log('Time saved calculation:', { 
        totalEntries, 
        newTimeSavedHours, 
        storedPreviousTime
      });

      // Show notification whenever time saved has increased and user has actual savings
      if (newTimeSavedHours > storedPreviousTime && newTimeSavedHours > 0) {
        console.log('🎉 Triggering time saved notification!', { 
          newTime: newTimeSavedHours, 
          oldTime: storedPreviousTime,
          isFirstTime: storedPreviousTime === 0
        });
        
        // Ensure notification shows with a slight delay to avoid state conflicts
        setTimeout(() => {
          setShowTimeSavedNotification(true);
        }, 100);
        
        localStorage.setItem(`mentiora_time_saved_${user.id}`, newTimeSavedHours.toString());
        
        // Auto-hide notification after 10 seconds
        setTimeout(() => {
          setShowTimeSavedNotification(false);
        }, 10000);
      }

      // Update states
      setTimeSavedHours(newTimeSavedHours);
      setPreviousTimeSaved(newTimeSavedHours);
    } catch (error) {
      console.error('Error calculating time saved:', error);
    }
  };

  // Check if user should see Discord invitation
  const checkForDiscordInvitation = async () => {
    if (!user?.id) {
      console.log('Discord check: No user ID');
      return;
    }

    // Check if user has already seen the Discord invitation - PREVENT MULTIPLE SHOWINGS
    const hasSeenDiscord = localStorage.getItem(`discord_invitation_shown_${user.id}`);
    console.log('Discord check: Has user seen invitation before?', !!hasSeenDiscord);
    if (hasSeenDiscord) {
      console.log('Discord check: User has already seen invitation, skipping to prevent annoyance');
      return;
    }

    try {
      // Count completed topics from practice progress
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      let topicsCompleted = 0;
      
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        topicsCompleted = progress.filter((p: UserProgress) => p.attempts > 0).length;
      }
      console.log('Discord check: Practice topics completed:', topicsCompleted);

      // Count completed predicted exams
      const { data: examCompletions, error } = await supabase
        .from('predicted_exam_completions')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching exam completions:', error);
        return;
      }

      const examsCompleted = examCompletions?.length || 0;
      console.log('Discord check: Predicted exams completed:', examsCompleted);

      // Calculate total activities (practice topics + predicted exams)
      const totalActivities = topicsCompleted + examsCompleted;
      console.log('Discord check: Total activities:', totalActivities);
      console.log('Discord check: Should show invitation?', totalActivities >= 2);

      // Show Discord invitation if user has completed 2+ activities total
      if (totalActivities >= 2) {
        console.log('🎉 Showing Discord invitation for the FIRST AND LAST time!');
        setShowDiscordInvitation(true);
        // CRITICAL: Mark as shown immediately to prevent any future showings
        localStorage.setItem(`discord_invitation_shown_${user.id}`, 'true');
        console.log('Discord check: User permanently marked as having seen invitation');
      }
    } catch (error) {
      console.error('Error checking Discord invitation criteria:', error);
    }
  };

  // Check for new predicted exam results and trigger grade celebrations
  const checkForNewGrades = async () => {
    if (!user?.id) return;

    try {
      // Get the most recent predicted exam completion
      const { data: recentResult, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !recentResult) return;

      // Check if this result was created in the last 5 minutes (indicating it's new)
      const resultTime = new Date(recentResult.completed_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      if (resultTime > fiveMinutesAgo) {
        // Check if we've already shown a celebration for this result
        const celebrationKey = `grade_celebration_${recentResult.id}`;
        const hasShownCelebration = localStorage.getItem(celebrationKey);
        
        if (!hasShownCelebration) {
          // Get subject name and format it properly
          const subjectName = curriculum.find(s => s.id === recentResult.subject_id)?.name || recentResult.subject_id;
          const formattedSubjectName = subjectName.replace(/-/g, ' ');
          
          // Trigger grade celebration
          setCelebrationGrade(recentResult.grade);
          setCelebrationSubject(formattedSubjectName);
          
          // Small delay to ensure page is loaded
          setTimeout(() => {
            setShowGradeCelebration(true);
          }, 1500);
          
          // Mark this celebration as shown
          localStorage.setItem(celebrationKey, 'true');
        }
      }
    } catch (error) {
      console.error('Error checking for new grades:', error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Apply natural stress decay when dashboard loads
      StressTracker.applyTimeDecay(user.id);

      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        
        // Calculate and save weak topics to database
        const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
        await saveWeakTopicsToDatabase(weak);
        setWeakTopics(weak);
      }

      // Load weak topics from database
      await loadWeakTopicsFromDatabase();

      // Load pinned subjects from localStorage
      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }

      // Load user's selected subjects from database
      await loadUserSubjects();

      // Record login activity and fetch current streak
      await fetchCurrentStreak();

      // Check and update public profile for 14+ day streaks
      await checkAndUpdatePublicProfile();

      // Initialize previous time saved from localStorage (this happens before loadTimeSavedStats)
      const savedTimeSaved = localStorage.getItem(`mentiora_time_saved_${user.id}`);
      if (savedTimeSaved) {
        setPreviousTimeSaved(parseFloat(savedTimeSaved));
      }

      // Load and track time saved from notebook entries
      await loadTimeSavedStats();

      // Check for recommendations on dashboard load
      console.log('Dashboard loading, checking for weak topic recommendations...');
      await checkForWeakTopicRecommendation();
      
      // Check for new predicted exam results
      await checkForNewGrades();
      
      // Check for Discord invitation eligibility
      await checkForDiscordInvitation();
    };

    loadUserData();
    
    // Also fetch streak on component mount
    if (user?.id) {
      fetchCurrentStreak();
    }
    
  }, [user?.id]);

  const loadWeakTopicsFromDatabase = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('topics')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading weak topics:', error);
        return;
      }

      if (data?.topics && Array.isArray(data.topics)) {
        setWeakTopics(data.topics as string[]);
      }
    } catch (error) {
      console.error('Error loading weak topics:', error);
    }
  };

  const saveWeakTopicsToDatabase = async (topics: string[]) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('weak_topics')
        .upsert(
          {
            user_id: user.id,
            topics: topics,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error('Error saving weak topics:', error);
      }
    } catch (error) {
      console.error('Error saving weak topics:', error);
    }
  };

  const loadUserSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_subjects')
        .select('subject_name, exam_board')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading user subjects:', error);
        return;
      }

      console.log('=== DEBUG: Database records ===', data);

      if (data) {
        // Convert database records to subject IDs based on curriculum
        const subjectIds = data.map(record => {
          console.log(`=== Processing record: ${record.subject_name} | ${record.exam_board} ===`);
          const examBoard = record.exam_board.toLowerCase();
          
          // Check each potential match explicitly
          if (record.subject_name === 'Physics' && examBoard === 'aqa') {
            console.log('✅ Matched Physics AQA to physics ID');
            return 'physics';
          }
          if (record.subject_name === 'Physics' && examBoard === 'edexcel') {
            console.log('✅ Matched Physics Edexcel to physics-edexcel ID');
            return 'physics-edexcel';
          }
          
          // Find matching subject in curriculum for other subjects
          const subject = curriculum.find(s => 
            (record.subject_name === 'Mathematics' && s.name === 'Maths (Edexcel)') ||
            (record.subject_name === 'IGCSE Business' && s.name === 'Business (Edexcel IGCSE)') ||
            (record.subject_name === 'Chemistry' && examBoard === 'edexcel' && s.id === 'chemistry-edexcel') ||
            s.name.toLowerCase() === record.subject_name.toLowerCase()
          );
          
          if (subject) {
            console.log(`✅ Found subject: ${subject.id} for ${record.subject_name}`);
            return subject.id;
          } else {
            console.log(`❌ No match found for: ${record.subject_name} | ${record.exam_board}`);
            return null;
          }
        }).filter(Boolean) as string[];
        
        console.log('=== Final subject IDs ===', subjectIds);
        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  };

  // Wrapper function specifically for physics button clicks
  const handlePhysicsPractice = (topicId: string) => {
    navigate(`/premium-practice/physics/${topicId}`);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleStartPractice = (subjectId: string, topicId?: string) => {
    if (topicId) {
      navigate(`/premium-practice/${subjectId}/${topicId}`);
    } else {
      navigate(`/premium-subject-topics/${subjectId}`);
    }
  };

  const handleTogglePin = (subjectId: string) => {
    const newPinned = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(newPinned);
    localStorage.setItem(`mentiora_pinned_subjects_${user?.id}`, JSON.stringify(newPinned));
    
    toast({
      title: pinnedSubjects.includes(subjectId) ? "Subject unpinned" : "Subject pinned",
      description: pinnedSubjects.includes(subjectId) 
        ? "Subject removed from dashboard" 
        : "Subject added to dashboard",
    });
  };

  const handleAddToMySubjects = async (subjectId: string) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to add subjects",
        variant: "destructive",
      });
      return;
    }

    // Find the subject in curriculum
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;

    // Update local state
    setUserSubjects(prev => [...prev, subjectId]);
    toast({
      title: "Subject added",
      description: `${subject.name} added to your subjects`,
    });
  };

  const getSubjectName = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    return subject?.name || subjectId;
  };

  const getExamBoard = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    return subject?.name || 'Unknown';
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    const totalScore = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / subjectProgress.length);
  };

  const getCurrentStreak = () => {
    if (!user?.id) return 0;
    const streakData = localStorage.getItem(`mentiora_streak_${user.id}`);
    if (streakData) {
      const parsed = JSON.parse(streakData);
      return parsed.currentStreak || 0;
    }
    return 0;
  };

  const getLongestStreak = () => {
    if (!user?.id) return 0;
    const streakData = localStorage.getItem(`mentiora_streak_${user.id}`);
    if (streakData) {
      const parsed = JSON.parse(streakData);
      return parsed.longestStreak || 0;
    }
    return 0;
  };

  const getTotalAttempts = () => {
    return userProgress.reduce((sum, p) => sum + p.attempts, 0);
  };

  const getWeeklyQuestions = () => {
    // Simple approximation based on attempts in the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    return userProgress.filter(p => 
      new Date(p.lastAttempt) > lastWeek
    ).reduce((sum, p) => sum + p.attempts, 0);
  };

  const getAverageScore = () => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  // Simplified streak functions using localStorage
  const fetchCurrentStreak = async () => {
    // Just use localStorage data for premium dashboard
  };

  const checkAndUpdatePublicProfile = async () => {
    // Simplified for premium dashboard
  };

  const getSubjectColor = (subjectId: string): string => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-teal-500 to-teal-600'
    ];
    
    const index = subjectId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Mentiora Premium</h1>
                  <p className="text-xs text-muted-foreground">Welcome back, {user?.email?.split('@')[0]}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/premium-analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/premium-predicted-questions')}>
                <Brain className="h-4 w-4 mr-2" />
                Predicted Questions
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/premium-notebook')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Notebook
              </Button>
              <ThemeToggle />
              <ColorThemeToggle />
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Personalized Greeting */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-foreground">
              Welcome back! 👋
            </h2>
            {notification && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsNotifyClicked(!isNotifyClicked)}
                className="relative"
              >
                <Bell className={`h-4 w-4 mr-2 ${isNotifyClicked ? '' : 'animate-bounce'}`} />
                Notification
                {!isNotifyClicked && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </Button>
            )}
          </div>
          
          {/* Show personalized notification */}
          {notification && isNotifyClicked && (
            <div className="mb-4 p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-primary/20 rounded-full">
                  <notification.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary">{notification.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  {notification.action && (
                    <Button 
                      size="sm" 
                      className="mt-3"
                      onClick={() => {
                        notification.action?.();
                        hideNotification();
                        setIsNotifyClicked(false);
                      }}
                    >
                      {notification.actionText}
                    </Button>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    clearNotification();
                    setIsNotifyClicked(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <p className="text-muted-foreground">
            Track your GCSE progress with AI-powered insights and personalized learning paths
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Topics Mastered"
            value={getMasteredTopics()}
            subtitle={`${Math.round((getMasteredTopics() / Math.max(userProgress.length, 1)) * 100)}% of studied topics`}
            progress={(getMasteredTopics() / Math.max(userProgress.length, 1)) * 100}
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
            value={getCurrentStreak()}
            subtitle={`Longest: ${getLongestStreak()} days`}
            progress={(getCurrentStreak() / Math.max(getLongestStreak(), 1)) * 100}
            icon={Flame}
            color="text-orange-600"
            trend={getCurrentStreak() > 0 ? 5 : 0}
          />
          
          <ProgressCard
            title="Questions This Week"
            value={getWeeklyQuestions()}
            subtitle={`${getAverageScore()}% average score`}
            progress={getAverageScore()}
            icon={CheckCircle}
            color="text-purple-600"
            trend={15}
          />
        </div>

        {/* Advanced Analytics - Premium Features without restrictions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PremiumAnalyticsCard
            title="Predicted Grade Calculator"
            description="Get AI-powered grade predictions based on your current performance"
            icon={Trophy}
            gradient="from-yellow-500 to-orange-600"
            onClick={() => navigate('/premium-predicted-results')}
          />
          
          <PremiumAnalyticsCard
            title="Advanced Performance Analytics"
            description="Deep insights into your learning patterns and progress trends"
            icon={LineChart}
            gradient="from-purple-500 to-indigo-600"
            onClick={() => navigate('/premium-analytics')}
          />
        </div>

        {/* AI-Powered Study Tools */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <OptimalStudyTimeCard userId={user?.id} />
          <OptimalLearningTimeCard userId={user?.id} />
          <StudyPlaylist />
        </div>

        {/* Goals and Topic Mastery */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <GoalsSection />
          <TopicMasteryDisplay userProgress={userProgress} />
        </div>

        {/* Predictive Performance and Graphs */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PredictivePerformanceCard userProgress={userProgress} />
          <PredictedGradesGraph userProgress={userProgress} />
        </div>

        {/* Community Features */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PublicStreakProfiles />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Study Groups
              </CardTitle>
              <CardDescription>
                Connect with other students and form study groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Study groups feature coming soon!</p>
                <Button disabled variant="outline">
                  Join Study Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics Section */}
        {weakTopics.length > 0 && (
          <div className="mb-8">
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={(subjectId, topicId) => navigate(`/premium-practice/${subjectId}/${topicId}`)}
            />
          </div>
        )}

        {/* Predicted Questions Section */}
        <div className="mb-8">
          <PredictedQuestionsSection />
        </div>

        {/* Subject Management */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Your Subjects</h3>
            <div className="flex items-center space-x-4">
              <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as 'my-subjects' | 'all-subjects')}>
                <TabsList>
                  <TabsTrigger value="my-subjects">My Subjects ({userSubjects.length})</TabsTrigger>
                  <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Exam Board Filter for All Subjects */}
          {subjectsTab === 'all-subjects' && (
            <div className="mb-6">
              <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard}>
                <TabsList>
                  <TabsTrigger value="aqa">AQA</TabsTrigger>
                  <TabsTrigger value="edexcel">Edexcel</TabsTrigger>
                  <TabsTrigger value="ocr">OCR</TabsTrigger>
                  <TabsTrigger value="wjec">WJEC</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <TabsContent value="my-subjects" className={subjectsTab === 'my-subjects' ? '' : 'hidden'}>
            {userSubjects.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No subjects added yet</p>
                    <p className="text-muted-foreground mb-4">
                      Add subjects to your dashboard to start tracking your progress
                    </p>
                    <Button onClick={() => setSubjectsTab('all-subjects')}>
                      Browse All Subjects
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userSubjects.map((subjectId) => {
                  const subject = curriculum.find(s => s.id === subjectId);
                  if (!subject) return null;
                  
                  return (
                    <SubjectCard
                      key={subject.id}
                      subject={{
                        ...subject,
                        color: getSubjectColor(subject.id)
                      }}
                      progress={userProgress}
                      onStartPractice={(subjectId) => navigate(`/premium-subject-topics/${subjectId}`)}
                      onTogglePin={handleTogglePin}
                      isPinned={pinnedSubjects.includes(subject.id)}
                      showAddButton={false}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all-subjects" className={subjectsTab === 'all-subjects' ? '' : 'hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curriculum
                .filter(subject => 
                  selectedExamBoard === 'aqa' ? !subject.id.includes('-') :
                  selectedExamBoard === 'edexcel' ? subject.id.includes('edexcel') :
                  selectedExamBoard === 'ocr' ? subject.id.includes('ocr') :
                  selectedExamBoard === 'wjec' ? subject.id.includes('wjec') :
                  true
                )
                .sort((a, b) => {
                  const aIsPinned = pinnedSubjects.includes(a.id);
                  const bIsPinned = pinnedSubjects.includes(b.id);
                  const aIsUserSubject = userSubjects.includes(a.id);
                  const bIsUserSubject = userSubjects.includes(b.id);
                  
                  // Sort order: pinned first, then user subjects, then alphabetical
                  if (aIsPinned && !bIsPinned) return -1;
                  if (!aIsPinned && bIsPinned) return 1;
                  if (aIsUserSubject && !bIsUserSubject) return -1;
                  if (!aIsUserSubject && bIsUserSubject) return 1;
                  return a.name.localeCompare(b.name);
                })
                .map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={{
                      ...subject,
                      color: getSubjectColor(subject.id)
                    }}
                    progress={userProgress}
                    onStartPractice={(subjectId) => navigate(`/premium-subject-topics/${subjectId}`)}
                    onTogglePin={handleTogglePin}
                    onAddToMySubjects={handleAddToMySubjects}
                    isPinned={pinnedSubjects.includes(subject.id)}
                    isUserSubject={userSubjects.includes(subject.id)}
                    showAddButton={!userSubjects.includes(subject.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into your study session with these popular features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/premium-predicted-questions')}
                >
                  <Brain className="h-6 w-6" />
                  <span>Predicted Questions</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/premium-predicted-exam')}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Practice Exam</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/premium-notebook')}
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Study Notes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assessment Objective Breakdown */}
        {userProgress.length > 0 && (
          <div className="mb-8">
            <AOBreakdown userProgress={userProgress} />
          </div>
        )}

      </div>

      {/* Celebrations and Notifications */}
      <StreakCelebration
        isVisible={showStreakCelebration}
        streakDays={getCurrentStreak()}
        onClose={() => setShowStreakCelebration(false)}
        rewardText="Keep up the incredible momentum! 🎯"
        rewardEmoji="🔥"
      />

      <TimeSavedNotification
        show={showTimeSavedNotification}
        timeSavedHours={timeSavedHours}
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

      {showDiscordInvitation && (
        <DiscordInvitation
          isOpen={showDiscordInvitation}
          onClose={() => setShowDiscordInvitation(false)}
        />
      )}
    </div>
  );
};

export default PremiumDashboard;
