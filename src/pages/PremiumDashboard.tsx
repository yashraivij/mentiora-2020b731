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
  const handlePhysicsToggle = async (subjectId: string) => {
    console.log('handlePhysicsToggle called with:', subjectId);
    console.log('User ID:', user?.id);
    console.log('Current userSubjects:', userSubjects);
    
    // Force immediate feedback
    if (!user?.id) {
      console.error('No user ID found');
      toast({
        title: "Error",
        description: "You must be logged in to add subjects",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('Calling toggleUserSubject with:', subjectId);
      await toggleUserSubject(subjectId);
      console.log('toggleUserSubject completed successfully');
    } catch (error) {
      console.error('Error in handlePhysicsToggle:', error);
      toast({
        title: "Error",
        description: "Failed to update subjects. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleUserSubject = async (subjectId: string) => {
    if (!user?.id) return;

    console.log('toggleUserSubject called with subjectId:', subjectId);
    
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) {
      console.error('Subject not found for id:', subjectId);
      return;
    }
    
    console.log('Found subject:', subject.name);
    
    const subjectName = getSubjectName(subject);
    const examBoard = getExamBoard(subjectId);
    console.log('Subject name mapping:', subjectName, 'Exam board:', examBoard);

    const isCurrentlySelected = userSubjects.includes(subjectId);

    try {
      if (isCurrentlySelected) {
        // Remove from database
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', getSubjectName(subject))
          .eq('exam_board', getExamBoard(subjectId));

        if (error) {
          console.error('Error removing subject:', error);
          toast({
            title: "Error",
            description: `Failed to remove ${subject.name} from your subjects. Please try again.`,
            variant: "destructive"
          });
        } else {
          setUserSubjects(prev => prev.filter(id => id !== subjectId));
          toast({
            title: "Success", 
            description: `${subject.name} removed from your subjects.`,
          });
        }
      } else {
        // Check if subject already exists in database first
        const { data: existingSubject } = await supabase
          .from('user_subjects')
          .select('id')
          .eq('user_id', user.id)
          .eq('subject_name', getSubjectName(subject))
          .eq('exam_board', getExamBoard(subjectId))
          .single();

        if (existingSubject) {
          console.log('Subject already exists in database, updating local state');
          setUserSubjects(prev => prev.includes(subjectId) ? prev : [...prev, subjectId]);
          toast({
            title: "Already Added",
            description: `${subject.name} is already in your subjects.`,
          });
          return;
        }

        // Add to database
        console.log('Attempting to insert:', {
          user_id: user.id,
          subject_name: getSubjectName(subject),
          exam_board: getExamBoard(subjectId),
          predicted_grade: 'U',
          target_grade: null,
          priority_level: 3
        });
        
        const { error } = await supabase
          .from('user_subjects')
          .insert({
            user_id: user.id,
            subject_name: getSubjectName(subject),
            exam_board: getExamBoard(subjectId),
            predicted_grade: 'U',
            target_grade: null,
            priority_level: 3
          });

        if (error) {
          console.error('Database error adding subject:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
          toast({
            title: "Error",
            description: `Failed to add ${subject.name} to your subjects. Please try again.`,
            variant: "destructive"
          });
        } else {
          setUserSubjects(prev => [...prev, subjectId]);
          toast({
            title: "Success",
            description: `${subject.name} added to your subjects!`,
          });
        }
      }
    } catch (error) {
      console.error('Error toggling user subject:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getSubjectName = (subject: any) => {
    // Convert curriculum names to database names
    if (subject.name === 'Maths (Edexcel)') return 'Mathematics';
    if (subject.name === 'Business (Edexcel IGCSE)') return 'IGCSE Business';
    if (subject.name === 'Chemistry (Edexcel)') return 'Chemistry';
    if (subject.name === 'Physics (Edexcel)') return 'Physics';
    
    // Handle both physics subjects - use consistent naming
    if (subject.id === 'physics-edexcel') return 'Physics';
    if (subject.id === 'physics-aqa') return 'Physics';
    
    return subject.name;
  };

  const getExamBoard = (subjectId: string) => {
    if (subjectId.includes('edexcel')) return 'Edexcel';
    return 'AQA'; // Default to AQA for most subjects
  };

  // Update weak topics whenever progress changes
  useEffect(() => {
    if (!user?.id || userProgress.length === 0) return;

    const weak = userProgress.filter(p => p.averageScore < 70).map(p => p.topicId);
    if (JSON.stringify(weak) !== JSON.stringify(weakTopics)) {
      setWeakTopics(weak);
      saveWeakTopicsToDatabase(weak);
    }
  }, [userProgress, user?.id]);

  const getTopicProgress = (subjectId: string, topicId: string) => {
    const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const [currentStreak, setCurrentStreak] = useState(0);

  const getStudyStreak = () => {
    return currentStreak;
  };

  // Record user activity and update streak
  const recordActivity = async () => {
    if (!user?.id) return;
    
    try {
      // Insert/update today's usage in daily_usage table
      await supabase
        .from('daily_usage')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          activities_count: 1,
          total_minutes: 5
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });
      
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  // Fetch current streak from database using the built-in function
  const fetchCurrentStreak = async () => {
    if (!user?.id) return;
    
    try {
      // First record today's activity in daily_usage to ensure streak is current
      await recordActivity();
      
      // Use the database function to get streak
      const { data, error } = await supabase
        .rpc('get_user_streak', { user_uuid: user.id });

      if (error) {
        console.error('Error fetching streak:', error);
        setCurrentStreak(0);
        return;
      }

      const streak = data || 0;
      setCurrentStreak(streak);
      
      console.log('Current streak:', streak);
      
      // Check for streak celebration after setting the streak
      setTimeout(async () => {        
        // Check 14-day streak first (highest milestone)
        if (streak >= 14) {
          const hasSeenCelebration = await hasSeenStreakCelebration(14);
          if (!hasSeenCelebration) {
            setTimeout(() => {
              setShowStreakCelebration(true);
            }, 1000);
            await markStreakCelebrationViewed(14);
            return; // Exit early to avoid multiple celebrations
          }
        }
        
        // Check 7-day streak
        if (streak >= 7) {
          const hasSeenCelebration = await hasSeenStreakCelebration(7);
          if (!hasSeenCelebration) {
            setTimeout(() => {
              setShowStreakCelebration(true);
            }, 1000);
            await markStreakCelebrationViewed(7);
            return; // Exit early to avoid multiple celebrations
          }
        }
        
        // Check 3-day streak (new milestone for early encouragement)
        if (streak >= 3) {
          const hasSeenCelebration = await hasSeenStreakCelebration(3);
          if (!hasSeenCelebration) {
            setTimeout(() => {
              setShowStreakCelebration(true);
            }, 1000);
            await markStreakCelebrationViewed(3);
          }
        }
      }, 500);
      
    } catch (error) {
      console.error('Error calculating streak:', error);
      setCurrentStreak(0);
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
    const lastAttempt = Math.max(...subjectProgress.map(p => new Date(p.lastAttempt).getTime()));
    return new Date(lastAttempt);
  };

  const getSubjectColor = (subjectId: string) => {
    // Return a color based on subject ID
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

  const allSubjects = [...curriculum].filter(subject => subject.id !== 'geography-paper-2');
  
  // Filter to show only selected subjects, or all if none selected
  const filteredSubjects = userSubjects.length > 0 
    ? allSubjects.filter(subject => userSubjects.includes(subject.id))
    : allSubjects;

  const sortedSubjects = filteredSubjects.sort((a, b) => {
    const isPinnedA = pinnedSubjects.includes(a.id);
    const isPinnedB = pinnedSubjects.includes(b.id);
    
    if (isPinnedA && !isPinnedB) return -1;
    if (!isPinnedA && isPinnedB) return 1;
    
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'weakest':
        return getSubjectProgress(a.id) - getSubjectProgress(b.id);
      case 'progress':
        return getSubjectProgress(b.id) - getSubjectProgress(a.id);
      default:
        return 0;
    }
  });

  const togglePinSubject = (subjectId: string) => {
    const newPinned = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(newPinned);
    localStorage.setItem(`mentiora_pinned_subjects_${user?.id}`, JSON.stringify(newPinned));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePractice = async (subjectId: string, topicId?: string) => {
    await recordActivity();
    if (topicId) {
      navigate(`/practice/${subjectId}/${topicId}`);
    } else {
      navigate(`/subject/${subjectId}`);
    }
  };

  const getFirstName = () => {
    if (!user) return 'there';
    
    // Try to get name from user_metadata first (from registration)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      const firstName = fullName.split(' ')[0];
      return firstName;
    }
    
    // Fallback to email if no name is available
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  };

  const handleNotifyClick = () => {
    setIsNotifyClicked(true);
  };

  const handleNotificationAction = () => {
    if (notification.type === "weak-topic-recommendation" && notification.subjectId) {
      navigate(`/subject/${notification.subjectId}`);
    } else if (notification.type === "exam-recommendation" && notification.subjectId) {
      navigate('/predicted-questions');
    } else if (notification.type === "study-recommendation") {
      navigate('/predicted-questions');
    }
  };

  
  // Function to automatically create/update public profile for 14+ day streaks
  const checkAndUpdatePublicProfile = async () => {
    if (!user?.id) return;
    
    const currentStreak = getStudyStreak();
    
    // Only auto-create profile if user has 14+ day streak
    if (currentStreak >= 14) {
      try {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('public_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        const profileData = {
          user_id: user.id,
          username: user.email?.split('@')[0] || 'anonymous',
          display_name: getFirstName(),
          avatar_url: null, // Will be set when user manually edits profile
          streak_days: currentStreak
        };
        
        if (existingProfile) {
          // Update existing profile with current streak
          await supabase
            .from('public_profiles')
            .update({ streak_days: currentStreak })
            .eq('user_id', user.id);
        } else {
          // Create new profile
          await supabase
            .from('public_profiles')
            .insert(profileData);
        }
      } catch (error) {
        console.error('Error managing public profile:', error);
      }
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Premium Header with Glassmorphism */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/lovable-uploads/99dd490e-1b20-4181-b127-6915d3c47932.png" 
                    alt="Mentiora Logo" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Mentiora
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">Premium</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => window.open('https://discord.gg/Jq2YTZ3aMa', '_blank')}
                className="bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white border-2 border-emerald-300 shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all duration-300 rounded-xl px-6 py-3 h-11 hover:scale-110 font-bold ring-2 ring-emerald-200/50"
              >
                <Gamepad2 className="h-5 w-5 mr-2" />
                <span className="text-sm font-extrabold">Join Community</span>
              </Button>
              <ThemeToggle />
              {getStudyStreak() >= 3 && <ColorThemeToggle />}
              {getStudyStreak() >= 7 && <StudyPlaylist isUnlocked={true} />}
              
              <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Premium Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {getGreeting()}, {getFirstName()}
              </h2>
              <p className="text-muted-foreground text-lg">Ready to elevate your GCSE revision journey?</p>
            </div>
          </div>
        </div>

        {/* Predicted GCSE Grades Section */}
        <PredictedGradesGraph userProgress={userProgress} />

        {/* Predicted 2026 Questions Section */}
        <PredictedQuestionsSection />

        {/* Subjects Section - Premium */}
        <div id="subjects-section" className="mb-8">
          <Card className="border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-blue-950/20 dark:to-purple-950/10 shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    My GCSE Subjects
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      Premium
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Access all subjects without restrictions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allSubjects.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  subject={{
                    ...subject,
                    color: getSubjectColor(subject.id)
                  }}
                  progress={userProgress.filter(p => p.subjectId === subject.id)}
                  onStartPractice={handlePractice}
                  isPinned={pinnedSubjects.includes(subject.id)}
                />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        {showStreakCelebration && (
          <StreakCelebration
            streakDays={getStudyStreak()}
            onClose={() => setShowStreakCelebration(false)}
          />
        )}

        {showTimeSavedNotification && (
          <TimeSavedNotification 
            hoursSaved={timeSavedHours}
            onClose={() => setShowTimeSavedNotification(false)}
          />
        )}

        {showGradeCelebration && (
          <GradeCelebration
            grade={celebrationGrade}
            subject={celebrationSubject}
            onClose={() => setShowGradeCelebration(false)}
          />
        )}

        {showDiscordInvitation && (
          <DiscordInvitation 
            onClose={() => setShowDiscordInvitation(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PremiumDashboard;