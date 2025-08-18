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

  // User activity tracking functions
  const recordUserActivity = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('daily_activity')
        .upsert(
          {
            user_id: user.id,
            activity_date: today,
            last_active: new Date().toISOString()
          },
          {
            onConflict: 'user_id,activity_date'
          }
        );

      if (error) {
        console.error('Error recording activity:', error);
      }
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  const [currentStreak, setCurrentStreak] = useState(0);

  const fetchCurrentStreak = async () => {
    if (!user?.id) return;

    try {
      await recordUserActivity();
      
      const { data, error } = await supabase
        .from('daily_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false });

      if (error) {
        console.error('Error fetching streak:', error);
        return;
      }

      if (!data || data.length === 0) {
        setCurrentStreak(0);
        return;
      }

      // Calculate streak
      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Convert activity dates to Date objects and sort
      const sortedDates = data
        .map(item => new Date(item.activity_date))
        .sort((a, b) => b.getTime() - a.getTime());

      // Check if there's activity today or yesterday
      const latestActivity = sortedDates[0];
      const daysDifference = Math.floor((today.getTime() - latestActivity.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDifference > 1) {
        // If latest activity is more than 1 day ago, streak is broken
        setCurrentStreak(0);
        return;
      }

      // Count consecutive days
      let expectedDate = new Date(today);
      if (daysDifference === 1) {
        // If latest activity was yesterday, start counting from yesterday
        expectedDate.setDate(expectedDate.getDate() - 1);
      }

      for (const activityDate of sortedDates) {
        const activityDateOnly = new Date(activityDate);
        activityDateOnly.setHours(0, 0, 0, 0);
        
        if (activityDateOnly.getTime() === expectedDate.getTime()) {
          streak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else {
          break;
        }
      }

      setCurrentStreak(streak);

      // Check for streak celebrations
      const hasSeenStreak3 = await hasSeenStreakCelebration(3);
      const hasSeenStreak7 = await hasSeenStreakCelebration(7);
      const hasSeenStreak14 = await hasSeenStreakCelebration(14);

      // Show celebration for new milestones
      if (streak >= 14 && !hasSeenStreak14) {
        setTimeout(() => setShowStreakCelebration(true), 2000);
      } else if (streak >= 7 && !hasSeenStreak7) {
        setTimeout(() => setShowStreakCelebration(true), 2000);
      } else if (streak >= 3 && !hasSeenStreak3) {
        setTimeout(() => setShowStreakCelebration(true), 2000);
      }

    } catch (error) {
      console.error('Error fetching streak:', error);
    }
  };

  const getStudyStreak = () => {
    return currentStreak;
  };

  // Create or update public profile for users with 14+ day streaks
  const checkAndUpdatePublicProfile = async () => {
    if (!user?.id) return;

    try {
      const streak = currentStreak;
      
      if (streak >= 14) {
        // Check if public profile already exists
        const { data: existingProfile, error: checkError } = await supabase
          .from('public_streak_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking public profile:', checkError);
          return;
        }

        // Get user's first name for the profile
        const firstName = getFirstName();
        
        if (!existingProfile) {
          // Create new public profile
          const { error: insertError } = await supabase
            .from('public_streak_profiles')
            .insert({
              user_id: user.id,
              display_name: firstName,
              current_streak: streak,
              is_visible: true,
              created_at: new Date().toISOString()
            });

          if (insertError) {
            console.error('Error creating public profile:', insertError);
          } else {
            console.log('✅ Created public streak profile for user with 14+ day streak');
          }
        } else {
          // Update existing profile with current streak
          const { error: updateError } = await supabase
            .from('public_streak_profiles')
            .update({
              current_streak: streak,
              display_name: firstName
            })
            .eq('user_id', user.id);

          if (updateError) {
            console.error('Error updating public profile:', updateError);
          } else {
            console.log('✅ Updated public streak profile with current streak');
          }
        }
      }
    } catch (error) {
      console.error('Error managing public profile:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handlePractice = (subjectId: string) => {
    navigate(`/practice/${subjectId}`);
  };

  const getFirstName = () => {
    if (!user?.email) return 'Student';
    const emailName = user.email.split('@')[0];
    const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    return capitalizedName;
  };

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour < 12) {
      return "Good morning";
    } else if (hour < 17) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    return Math.round(subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length);
  };

  const getLastActivity = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return null;
    const latest = subjectProgress.reduce((latest, current) => 
      new Date(current.lastAttempt) > new Date(latest.lastAttempt) ? current : latest
    );
    return new Date(latest.lastAttempt);
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-orange-500 to-orange-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-teal-500 to-teal-600',
    ];
    const index = Math.abs(subjectId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length;
    return colors[index];
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    return Math.round(userProgress.reduce((sum, p) => sum + p.averageScore, 0) / userProgress.length);
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const togglePinSubject = (subjectId: string) => {
    const updatedPinned = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(updatedPinned);
    localStorage.setItem(`mentiora_pinned_subjects_${user?.id}`, JSON.stringify(updatedPinned));
  };

  const toggleUserSubject = async (subjectId: string, subjectName: string, isAdd: boolean) => {
    if (!user?.id) return;

    try {
      if (isAdd) {
        // Add subject to user's list
        const { error } = await supabase
          .from('user_subjects')
          .insert({
            user_id: user.id,
            subject_name: subjectName,
            exam_board: selectedExamBoard.toUpperCase()
          });

        if (error) {
          console.error('Error adding subject:', error);
          toast({
            title: "Error",
            description: "Failed to add subject. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setUserSubjects(prev => [...prev, subjectId]);
        toast({
          title: "Subject Added",
          description: `${subjectName} has been added to your subjects.`,
        });
      } else {
        // Remove subject from user's list
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', subjectName)
          .eq('exam_board', selectedExamBoard.toUpperCase());

        if (error) {
          console.error('Error removing subject:', error);
          toast({
            title: "Error",
            description: "Failed to remove subject. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setUserSubjects(prev => prev.filter(id => id !== subjectId));
        toast({
          title: "Subject Removed",
          description: `${subjectName} has been removed from your subjects.`,
        });
      }
    } catch (error) {
      console.error('Error toggling subject:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getSortedSubjects = () => {
    const subjects = curriculum.filter(subject => {
      if (subjectsTab === 'my-subjects') {
        return userSubjects.includes(subject.id);
      }
      return true;
    });
    
    const pinnedFirst = subjects.sort((a, b) => {
      const aPinned = pinnedSubjects.includes(a.id);
      const bPinned = pinnedSubjects.includes(b.id);
      
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;
      
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'weakest') {
        return getSubjectProgress(a.id) - getSubjectProgress(b.id);
      } else if (sortBy === 'progress') {
        return getSubjectProgress(b.id) - getSubjectProgress(a.id);
      }
      
      return 0;
    });
    
    return pinnedFirst;
  };

  const examBoards = [
    { id: 'aqa', name: 'AQA' },
    { id: 'edexcel', name: 'Edexcel' },
    { id: 'ccea', name: 'CCEA' },
    { id: 'ocr', name: 'OCR' },
    { id: 'wjec', name: 'WJEC' }
  ];

  // Notification handlers
  const handleNotificationClick = () => {
    if (notification?.action === 'practice' && notification?.subjectId) {
      handlePractice(notification.subjectId);
      clearNotification();
    } else if (notification?.action === 'exam') {
      navigate('/predicted-questions');
      clearNotification();
    }
  };

  const handleNotifyClick = () => {
    setIsNotifyClicked(true);
    
    // Optional: Add actual notification signup logic here
    setTimeout(() => {
      setIsNotifyClicked(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Mentiora
            </h1>
            <Badge variant="secondary" className="hidden md:inline-flex">
              Free Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4">
            <ColorThemeToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9"
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
          <div className="space-y-2">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-foreground"
            >
              {getTimeBasedGreeting()}, {getFirstName()}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg"
            >
              Ready to ace your GCSEs? Let's continue your journey.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-3 pt-2"
            >
              <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 text-sm font-medium px-3 py-1">
                <Flame className="h-4 w-4 mr-1" />
                {getStudyStreak()} day streak
              </Badge>
              {userProgress.length > 0 && (
                <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {userProgress.reduce((sum, p) => sum + p.attempts, 0)} questions completed
                </Badge>
              )}
            </motion.div>
          </div>

          {currentStreak >= 14 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <PublicStreakProfiles />
            </motion.div>
          )}
        </div>

        {/* Personalized Notification */}
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{notification.title}</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleNotificationClick} size="sm">
                      {notification.action === 'practice' ? 'Practice Now' : 'Start Exam'}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={hideNotification}>
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        )}

        {/* Predicted Grades */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <PredictedGradesGraph userProgress={userProgress} />
        </motion.div>

        {/* Predicted Questions - Fully accessible in free version */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <PredictedQuestionsSection />
        </motion.div>

        {/* Study Playlist - Free to use */}
        {getStudyStreak() >= 7 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <StudyPlaylist />
          </motion.div>
        )}

        {/* Subject Selection */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Your Subjects</h2>
              <p className="text-muted-foreground">Practice questions and track your progress</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as any)} className="w-full sm:w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="my-subjects">My Subjects</TabsTrigger>
                  <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background border border-border rounded-md px-3 py-1 text-sm"
                >
                  <option value="progress">Sort by Progress</option>
                  <option value="alphabetical">Sort Alphabetically</option>
                  <option value="weakest">Sort by Weakest</option>
                </select>
              </div>
            </div>
          </div>

          <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard}>
            <TabsList className="grid w-full grid-cols-5">
              {examBoards.map(board => (
                <TabsTrigger key={board.id} value={board.id}>
                  {board.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {examBoards.map(examBoard => (
              <TabsContent key={examBoard.id} value={examBoard.id} className="mt-6">
                {subjectsTab === 'my-subjects' && userSubjects.length === 0 ? (
                  <Card className="p-8 text-center">
                    <CardContent>
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No subjects added yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Switch to "All Subjects" to browse and add subjects to your list.
                      </p>
                      <Button onClick={() => setSubjectsTab('all-subjects')}>
                        Browse All Subjects
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {getSortedSubjects()
                      .filter(subject => {
                        if (examBoard.id === 'aqa') {
                          return subject.id === 'physics' || subject.id === 'maths' || subject.id === 'chemistry' || subject.id === 'biology' || subject.id === 'computer-science' || subject.id === 'english-language' || subject.id === 'english-literature' || subject.id === 'french' || subject.id === 'spanish' || subject.id === 'german' || subject.id === 'history' || subject.id === 'geography' || subject.id === 'business' || subject.id === 'religious-studies' || subject.id === 'art' || subject.id === 'music' || subject.id === 'drama' || subject.id === 'psychology';
                        } else if (examBoard.id === 'edexcel') {
                          return subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel';
                        }
                        return false;
                      })
                      .map((subject) => {
                        // Modify subject name for Edexcel subjects to remove brackets
                        let modifiedSubject = { ...subject };
                          if (examBoard.id === 'edexcel') {
                            if (subject.id === 'maths-edexcel') {
                              modifiedSubject = { ...subject, name: 'Mathematics' };
                            } else if (subject.id === 'business-edexcel-igcse') {
                              modifiedSubject = { ...subject, name: 'IGCSE Business' };
                            } else if (subject.id === 'chemistry-edexcel') {
                              modifiedSubject = { ...subject, name: 'Chemistry' };
                           } else if (subject.id === 'physics-edexcel') {
                             modifiedSubject = { ...subject, name: 'Physics' };
                           }
                          }
                        
                          return (
                          <SubjectCard
                            key={subject.id}
                            subject={{
                              ...modifiedSubject,
                              color: getSubjectColor(subject.id)
                            }}
                            progress={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel' ? userProgress : []}
                            onStartPractice={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel' ? handlePractice : () => {}}
                            onTogglePin={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel' ? togglePinSubject : () => {}}
                            isPinned={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel' ? pinnedSubjects.includes(subject.id) : false}
                            lastActivity={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel' ? getLastActivity(subject.id) : null}
                            comingSoon={!((subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard.id === 'edexcel')}
                            userId={user?.id}
                            onToggleUserSubject={toggleUserSubject}
                            isUserSubject={userSubjects.includes(subject.id)}
                            showAddButton={subjectsTab === 'all-subjects'}
                      />
                         );
                        })}
                   </div>
                )}
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" style={{ display: 'none' }}>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Overall Progress"
            value={`${getOverallProgress()}%`}
            subtitle="Average across subjects"
            progress={getOverallProgress()}
            icon={TrendingUp}
            color="bg-gradient-to-br from-primary via-primary/90 to-primary/80"
            trend={userProgress.length > 0 ? 5 : undefined}
          />
          
          <ProgressCard
            title="Topics Mastered"
            value={getMasteredTopics()}
            subtitle="85%+ average score"
            icon={Trophy}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          
          <ProgressCard
            title="Practice Sessions"
            value={userProgress.reduce((sum, p) => sum + p.attempts, 0)}
            subtitle="Questions completed"
            icon={BookOpen}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          
          <ProgressCard
            title="Study Streak"
            value={`${getStudyStreak()} days`}
            subtitle="Keep it up!"
            icon={Flame}
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <AOBreakdown userProgress={userProgress} />
            <GoalsSection />
            <TopicMasteryDisplay />
          </div>
          <div className="lg:col-span-2">
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={handlePractice}
            />
          </div>
        </div>

        {/* Advanced Analytics - Available in free version */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Brain className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">Advanced Analytics</h3>
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0">
              Available
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <PredictivePerformanceCard userProgress={userProgress} />
            <OptimalStudyTimeCard userId={user?.id || ''} />
          </div>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      <StreakCelebration
        isVisible={showStreakCelebration}
        onClose={async () => {
          setShowStreakCelebration(false);
          const streak = getStudyStreak();
          // Mark the appropriate celebration as viewed
          if (streak >= 14) {
            const hasSeenCelebration = await hasSeenStreakCelebration(14);
            if (!hasSeenCelebration) {
              await markStreakCelebrationViewed(14);
            } else {
              await markStreakCelebrationViewed(7);
            }
          } else if (streak >= 7) {
            await markStreakCelebrationViewed(7);
          } else if (streak >= 3) {
            await markStreakCelebrationViewed(3);
          }
        }}
        streakDays={getStudyStreak()}
        rewardText={
          getStudyStreak() >= 14 
            ? "Claim Your Free Tutoring Session" 
            : getStudyStreak() >= 7 
            ? "Study Playlist & Background Sounds"
            : "Color Theme Customization"
        }
        rewardEmoji={
          getStudyStreak() >= 14 
            ? "👨‍🏫" 
            : getStudyStreak() >= 7 
            ? "🎵"
            : "🎨"
        }
      />

      {/* Time Saved Notification */}
      <TimeSavedNotification
        timeSavedHours={timeSavedHours}
        show={showTimeSavedNotification}
        onClose={() => setShowTimeSavedNotification(false)}
      />

      {/* Grade Celebration Modal */}
      <GradeCelebration
        isVisible={showGradeCelebration}
        onClose={() => setShowGradeCelebration(false)}
        grade={celebrationGrade}
        subject={celebrationSubject}
      />

      {/* Discord Invitation Modal */}
      <DiscordInvitation
        isVisible={showDiscordInvitation}
        onClose={() => setShowDiscordInvitation(false)}
      />

      {/* Feedback Fish Button */}
      <button
        data-feedback-fish
        data-feedback-fish-userid={user?.email}
        className="fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
        aria-label="Send Feedback"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
        >
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
};

export default DashboardFree;
