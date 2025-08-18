import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
import { TimeSavedNotification } from "@/components/notifications/TimeSavedNotification";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
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

const DashboardFree = () => {
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
        .maybeSingle();

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
        .maybeSingle();

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

      if (data) {
        // Convert database records to subject IDs based on curriculum
        const subjectIds = data.map(record => {
          const examBoard = record.exam_board.toLowerCase();
          
          // Check each potential match explicitly
          if (record.subject_name === 'Physics' && examBoard === 'aqa') {
            return 'physics';
          }
          if (record.subject_name === 'Physics' && examBoard === 'edexcel') {
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
            return subject.id;
          } else {
            return null;
          }
        }).filter(Boolean) as string[];
        
        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  };

  // Streak tracking state and functions
  const [currentStreak, setCurrentStreak] = useState(0);
  const [publicStreakProfiles, setPublicStreakProfiles] = useState<any[]>([]);

  const fetchCurrentStreak = async () => {
    if (!user?.id) return;

    try {
      // Record today's activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: 'login',
          session_id: crypto.randomUUID(),
          metadata: { platform: 'web' }
        });

      // Get streak using the database function
      const { data: streakData, error: streakError } = await supabase
        .rpc('get_user_streak', { user_uuid: user.id });

      if (streakError) {
        console.error('Error fetching streak:', streakError);
        return;
      }

      const streakDays = streakData || 0;
      setCurrentStreak(streakDays);

      // Fetch daily activity data for stress monitoring using daily_usage table
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: activityData } = await supabase
        .from('daily_usage')
        .select('date, activities_count')
        .eq('user_id', user.id)
        .gte('date', sevenDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Map the activity data for stress calculation
      const mappedActivityData = activityData?.map((entry: any) => ({
        date: entry.date,
        activityCount: entry.activities_count || 0
      })) || [];

      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);

      const { data: recentActivity } = await supabase
        .from('daily_usage')
        .select('date, activities_count')
        .eq('user_id', user.id)
        .gte('date', last24Hours.toISOString().split('T')[0]);

      let recentActivityCount = 0;
      if (recentActivity && recentActivity.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const todayData = recentActivity.find((item: any) => item.date === today);
        recentActivityCount = todayData?.activities_count || 0;
      }

      // Simple stress tracking without complex metrics

      // Check for streak celebration milestones (3, 7, 14, 30, 100 days)
      const milestones = [3, 7, 14, 30, 100];
      for (const milestone of milestones) {
        if (streakDays === milestone) {
          const hasSeenCelebration = await hasSeenStreakCelebration(milestone);
          if (!hasSeenCelebration) {
            console.log(`🎉 Triggering ${milestone}-day streak celebration!`);
            setShowStreakCelebration(true);
            await markStreakCelebrationViewed(milestone);
            break; // Show only one celebration at a time
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchCurrentStreak:', error);
    }
  };

  const checkAndUpdatePublicProfile = async () => {
    if (!user?.id) return;

    try {
      // Get user's current streak
      const { data: streakData, error: streakError } = await supabase
        .rpc('get_user_streak', { user_uuid: user.id });

      if (streakError) {
        console.error('Error fetching streak for public profile:', streakError);
        return;
      }

      const streakDays = streakData || 0;

      // Fetch public profiles for streak display using public_profiles table
      const { data: publicProfiles } = await supabase
        .from('public_profiles')
        .select('*')
        .order('streak_days', { ascending: false })
        .limit(5);

      setPublicStreakProfiles(publicProfiles || []);

      // Check for 14+ day streak achievement
      const { data: highStreakProfiles } = await supabase
        .from('public_profiles')
        .select('*')
        .gte('streak_days', 14)
        .order('streak_days', { ascending: false });

      // Update user's own public profile if they have 14+ day streak
      if (streakDays >= 14 && user?.id) {
        const { data: profile } = await supabase
          .from('public_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profile) {
          // Create new public profile
          const { data: userProfile } = await supabase
            .from('public_profiles')
            .insert({
              user_id: user.id,
              username: user.email?.split('@')[0] || 'Anonymous',
              display_name: user.email?.split('@')[0] || 'Anonymous',
              streak_days: streakDays,
              avatar_url: null
            })
            .select()
            .maybeSingle();

        } else if (profile.streak_days < streakDays) {
          // Update existing profile
          await supabase
            .from('public_profiles')
            .update({ streak_days: streakDays })
            .eq('user_id', user.id);
        }
      }
    } catch (error) {
      console.error('Error updating public profile:', error);
    }
  };

  const handleSubjectToggle = async (subjectId: string, subjectName: string = '', isAdd: boolean = true) => {
    if (!user?.id) return;

    try {
      if (isAdd) {
        // Find the subject in curriculum to get proper name
        const subject = curriculum.find(s => s.id === subjectId);
        const actualSubjectName = subject?.name || subjectName;
        
        await supabase
          .from('user_subjects')
          .insert({
            user_id: user.id,
            subject_name: actualSubjectName,
            exam_board: selectedExamBoard,
            predicted_grade: 'U' // Required field
          });

        setUserSubjects(prev => [...prev, subjectId]);
        
        toast({
          title: "Subject Added",
          description: `${actualSubjectName} has been added to your subjects.`
        });
      } else {
        // Handle removal
        const subject = curriculum.find(s => s.id === subjectId);
        if (subject) {
          await supabase
            .from('user_subjects')
            .delete()
            .eq('user_id', user.id)
            .eq('subject_name', subject.name)
            .eq('exam_board', selectedExamBoard);

          setUserSubjects(prev => prev.filter(id => id !== subjectId));
          
          toast({
            title: "Subject Removed",
            description: `${subject.name} has been removed from your subjects.`
          });
        }
      }
    } catch (error) {
      console.error('Error toggling subject:', error);
      toast({
        title: "Error",
        description: "Failed to update your subjects. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePinSubject = (subjectId: string) => {
    if (!user?.id) return;

    const newPinnedSubjects = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];

    setPinnedSubjects(newPinnedSubjects);
    localStorage.setItem(`mentiora_pinned_subjects_${user.id}`, JSON.stringify(newPinnedSubjects));
  };

  // Mock stress level calculation
  const getCurrentStressLevel = () => 'low';

  // Updated notification handling
  const handleNotificationAction = () => {
    hideNotification();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Define filtered subjects based on exam board and search criteria
  const getFilteredSubjects = () => {
    const subjectsToShow = subjectsTab === 'my-subjects' ? 
      curriculum.filter(subject => userSubjects.includes(subject.id)) : 
      curriculum.filter(subject => 
        selectedExamBoard === 'all' ||
        subject.id.includes(selectedExamBoard) ||
        (selectedExamBoard === 'aqa' && !subject.id.includes('edexcel') && !subject.id.includes('ocr'))
      );

    const sorted = [...subjectsToShow].sort((a, b) => {
      // Always show pinned subjects first
      const aIsPinned = pinnedSubjects.includes(a.id);
      const bIsPinned = pinnedSubjects.includes(b.id);
      
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      
      // Then sort by the selected criteria
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'weakest') {
        const aProgress = userProgress.filter(p => p.subjectId === a.id);
        const bProgress = userProgress.filter(p => p.subjectId === b.id);
        const aAvg = aProgress.length > 0 ? aProgress.reduce((sum, p) => sum + p.averageScore, 0) / aProgress.length : 0;
        const bAvg = bProgress.length > 0 ? bProgress.reduce((sum, p) => sum + p.averageScore, 0) / bProgress.length : 0;
        return aAvg - bAvg;
      } else { // progress
        const aProgress = userProgress.filter(p => p.subjectId === a.id);
        const bProgress = userProgress.filter(p => p.subjectId === b.id);
        const aTotalAttempts = aProgress.reduce((sum, p) => sum + p.attempts, 0);
        const bTotalAttempts = bProgress.reduce((sum, p) => sum + p.attempts, 0);
        return bTotalAttempts - aTotalAttempts;
      }
    });

    return sorted;
  };

  // UI rendering

  return (
    <div className="min-h-screen bg-background">
      {/* Celebrations removed for free version */}

      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Badge variant="outline" className="flex items-center gap-1">
                <Flame className="h-3 w-3 text-orange-500" />
                {currentStreak} day streak
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              {notification && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNotificationAction}
                    className="relative"
                  >
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
                  </Button>
                  
                  {/* Notification popup */}
                  <div className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Notification</h4>
                        <p className="text-sm text-muted-foreground mb-3">You have a notification</p>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleNotificationAction}>
                            Dismiss
                          </Button>
                          <Button variant="outline" size="sm" onClick={clearNotification}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearNotification}
                        className="h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              <ColorThemeToggle />
              <ThemeToggle />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Study Playlist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="space-y-4">
                <StudyPlaylist isUnlocked={true} />
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <ProgressCard title="Study Streak" value={`${currentStreak} days`} icon={Flame} color="orange" />
              <ProgressCard title="Hours Saved" value={`${timeSavedHours}h`} icon={Clock} color="blue" />
              <ProgressCard title="Subjects" value={`${userSubjects.length}`} icon={BookOpen} color="green" />
              <ProgressCard title="Topics Mastered" value={`${userProgress.filter(p => p.averageScore >= 80).length}`} icon={Trophy} color="yellow" />
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card><CardContent className="p-6"><h3>Weak Topics</h3><p>Track your progress here</p></CardContent></Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card><CardContent className="p-6"><h3>Topic Mastery</h3><p>View your mastery levels</p></CardContent></Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card><CardContent className="p-6"><h3>Goals</h3><p>Set and track your study goals</p></CardContent></Card>
                </motion.div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Card><CardContent className="p-6"><h3>Performance Prediction</h3><p>AI-powered insights</p></CardContent></Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Card><CardContent className="p-6"><h3>Optimal Study Time</h3><p>Best times to study</p></CardContent></Card>
                </motion.div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subject Management Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Subjects</h2>
                <p className="text-muted-foreground">Manage your subjects and track progress</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 rounded border border-border bg-background"
                  >
                    <option value="progress">Sort by Progress</option>
                    <option value="alphabetical">Sort Alphabetically</option>
                    <option value="weakest">Sort by Weakest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subject Tabs */}
            <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as any)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="my-subjects">My Subjects ({userSubjects.length})</TabsTrigger>
                  <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
                </TabsList>
                
                {subjectsTab === 'all-subjects' && (
                  <select
                    value={selectedExamBoard}
                    onChange={(e) => setSelectedExamBoard(e.target.value)}
                    className="px-3 py-1 rounded border border-border bg-background"
                  >
                    <option value="aqa">AQA</option>
                    <option value="edexcel">Edexcel</option>
                    <option value="all">All Exam Boards</option>
                  </select>
                )}
              </div>

              <TabsContent value="my-subjects" className="space-y-4">
                {userSubjects.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No subjects added yet</h3>
                      <p className="text-muted-foreground mb-4">Start by adding subjects from the "All Subjects" tab</p>
                      <Button onClick={() => setSubjectsTab('all-subjects')}>
                        Browse Subjects
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getFilteredSubjects().map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={{...subject, color: 'blue'}}
                        progress={userProgress}
                        onStartPractice={(subjectId: string) => navigate(`/subjects/${subjectId}`)}
                        onTogglePin={handlePinSubject}
                        isPinned={pinnedSubjects.includes(subject.id)}
                        onToggleUserSubject={(subjectId: string) => handleSubjectToggle(subjectId, '', false)}
                        isUserSubject={true}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all-subjects" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFilteredSubjects().map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={{...subject, color: 'blue'}}
                      progress={userProgress}
                      onStartPractice={(subjectId: string) => navigate(`/subjects/${subjectId}`)}
                      onTogglePin={handlePinSubject}
                      isPinned={pinnedSubjects.includes(subject.id)}
                      onToggleUserSubject={(subjectId: string) => handleSubjectToggle(subjectId, '', true)}
                      isUserSubject={userSubjects.includes(subject.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card><CardContent className="p-6"><h3>Predicted Questions</h3><p>AI-generated practice questions</p></CardContent></Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card><CardContent className="p-6"><h3>Predicted Grades</h3><p>Track your grade predictions</p></CardContent></Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-2"
              >
                <Card><CardContent className="p-6"><h3>Assessment Breakdown</h3><p>Detailed performance analysis</p></CardContent></Card>
              </motion.div>
            </div>

            {/* Community Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Community Leaderboard
                  </CardTitle>
                  <CardDescription>
                    See how your study streak compares to other students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PublicStreakProfiles />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardFree;
