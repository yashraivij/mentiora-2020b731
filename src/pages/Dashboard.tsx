import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
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
import { DashboardStressMonitor } from "@/components/dashboard/DashboardStressMonitor";
import { supabase } from "@/integrations/supabase/client";
import { StressTracker } from "@/lib/stressTracker";
import { PersonalizedNotification } from "@/components/notifications/PersonalizedNotification";
import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { StreakCelebration } from "@/components/ui/streak-celebration";
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
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

const Dashboard = () => {
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

  const {
    notification,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
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

      // Check and update public profile for 14+ day streaks
      await checkAndUpdatePublicProfile();

      // Check for recommendations on dashboard load
      console.log('Dashboard loading, checking for weak topic recommendations...');
      await checkForWeakTopicRecommendation();
    };

    loadUserData();
    
    const checkStreakCelebration = async () => {
      // Show celebration for streak achievements (prioritize highest unseen milestone)
      const streak = getStudyStreak();
      
      // Check 14-day streak first (highest milestone)
      if (streak >= 14) {
        const hasSeenCelebration = await hasSeenStreakCelebration(14);
        if (!hasSeenCelebration) {
          setTimeout(() => {
            setShowStreakCelebration(true);
          }, 1000); // Delay to let page load first
          return;
        }
      }
      
      // Check 7-day streak if 14-day already seen or not reached
      if (streak >= 7) {
        const hasSeenCelebration = await hasSeenStreakCelebration(7);
        if (!hasSeenCelebration) {
          setTimeout(() => {
            setShowStreakCelebration(true);
          }, 1000); // Delay to let page load first
        }
      }
    };

    checkStreakCelebration();
    
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

      if (data) {
        // Convert database records to subject IDs based on curriculum
        const subjectIds = data.map(record => {
          // Find matching subject in curriculum
          const subject = curriculum.find(s => 
            s.name.toLowerCase() === record.subject_name.toLowerCase() ||
            (record.subject_name === 'Mathematics' && s.name === 'Maths (Edexcel)') ||
            (record.subject_name === 'IGCSE Business' && s.name === 'Business (Edexcel IGCSE)') ||
            (record.subject_name === 'Chemistry' && record.exam_board.toLowerCase() === 'edexcel' && s.name === 'Chemistry (Edexcel)') ||
            (record.subject_name === 'Physics' && record.exam_board.toLowerCase() === 'edexcel' && s.name === 'Physics (Edexcel)')
          );
          return subject?.id;
        }).filter(Boolean) as string[];
        
        
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

  const getStudyStreak = () => {
    if (!user?.id) return 0;
    
    // For testing: only test@gmail.com gets a 14-day streak
    if (user.email === 'test@gmail.com') {
      return 14;
    }
    
    // Get streak from localStorage for other accounts
    const savedStreak = localStorage.getItem(`mentiora_streak_${user.id}`);
    return savedStreak ? parseInt(savedStreak, 10) : 0;
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

  const handlePractice = (subjectId: string, topicId?: string) => {
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
              <ProfileDropdown streakDays={getStudyStreak()} firstName={getFirstName()} />
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
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Insights</span>
            </div>
          </div>
        </div>

        {/* PREMIUM MOTIVATION ZONE - First impression that drives engagement */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ULTRA PREMIUM Study Streak Card - Designed for maximum motivation */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-orange-50/90 to-red-50/90 dark:from-slate-900 dark:via-orange-950/30 dark:to-red-950/30 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-xl transform hover:scale-[1.02]">
            {/* Multi-layer premium glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-300/10 via-transparent to-red-300/10 animate-pulse" />
            
            {/* Luxurious animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-xl p-[2px] group-hover:p-[3px] transition-all duration-300">
              <div className="bg-gradient-to-br from-white via-orange-50/90 to-red-50/90 dark:from-slate-900 dark:via-orange-950/30 dark:to-red-950/30 rounded-[10px] h-full w-full backdrop-blur-xl" />
            </div>
            
            {/* Premium floating particles */}
            <div className="absolute top-3 right-4 w-2 h-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full animate-bounce opacity-80" />
            <div className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-gradient-to-r from-red-400 to-pink-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-5 left-12 w-1 h-1 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full animate-ping opacity-50" />
            
            <CardContent className="relative p-4">
              <div className="space-y-3">
                {/* Hero Achievement Display */}
                <div className="text-center space-y-2">
                  <div className="relative inline-block">
                    {/* Ultra premium fire icon with multiple effects */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-orange-500/40 transition-all duration-300 group-hover:scale-110 relative overflow-hidden mx-auto">
                      <div className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                      <Flame className="h-6 w-6 text-white relative z-10 drop-shadow-xl animate-pulse" />
                    </div>
                    {/* Achievement ring */}
                    <div className="absolute inset-0 bg-orange-400/30 rounded-2xl animate-ping opacity-20" />
                    {/* Premium badge */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Crown className="h-2 w-2 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  
                  {/* Massive streak number for impact */}
                  <div className="space-y-1">
                    <h3 className="text-4xl font-black bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                      {getStudyStreak()}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                        Day{getStudyStreak() !== 1 ? 's' : ''} Strong!
                      </span>
                      <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {getStudyStreak() === 0 ? "🔥 Start your journey today!" :
                       getStudyStreak() < 3 ? "🚀 You're building momentum!" :
                       getStudyStreak() < 7 ? "💪 Getting stronger every day!" :
                       getStudyStreak() < 14 ? "⭐ You're on fire! Keep going!" :
                       "👑 Legendary dedication!"}
                    </p>
                  </div>
                </div>

                {/* Motivational streak leaderboard teaser */}
                <div className="pt-2 border-t border-orange-200/60 dark:border-orange-800/40">
                  <PublicStreakProfiles />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ULTRA PREMIUM Rewards Card - Designed to create intense desire */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-emerald-50/95 to-blue-50/95 dark:from-slate-900 dark:via-emerald-950/40 dark:to-blue-950/40 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-xl transform hover:scale-[1.02]">
            {/* Premium animated glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/25 via-blue-400/25 to-purple-400/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-300/15 via-transparent to-purple-300/15 animate-pulse" />
            
            {/* Luxurious multi-layer border */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-xl p-[2px] group-hover:p-[3px] transition-all duration-300">
              <div className="bg-gradient-to-br from-white via-emerald-50/95 to-blue-50/95 dark:from-slate-900 dark:via-emerald-950/40 dark:to-blue-950/40 rounded-[10px] h-full w-full backdrop-blur-xl" />
            </div>
            
            {/* Premium floating orbs */}
            <div className="absolute top-3 right-4 w-2 h-2 bg-gradient-to-r from-emerald-300 to-blue-400 rounded-full animate-bounce opacity-80" />
            <div className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-5 right-8 w-1 h-1 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full animate-ping opacity-50" />
            
            <CardContent className="relative p-4">
              <div className="space-y-3">
                {/* Premium header with urgency */}
                <div className="text-center space-y-2">
                  <div className="relative inline-block">
                    {/* Ultra premium star icon */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 group-hover:scale-110 relative overflow-hidden mx-auto">
                      <div className="absolute inset-1 rounded-xl bg-white/25 backdrop-blur-sm" />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                      <Star className="h-6 w-6 text-white relative z-10 drop-shadow-xl animate-pulse" />
                    </div>
                    {/* Achievement particles */}
                    <div className="absolute inset-0 bg-emerald-400/30 rounded-2xl animate-ping opacity-20" />
                    {/* Premium floating badge */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Sparkles className="h-2 w-2 text-white drop-shadow-sm" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                      Unlock Rewards
                    </h3>
                    <p className="text-xs font-semibold text-muted-foreground">
                      Level {getStudyStreak() >= 14 ? "Elite" : getStudyStreak() >= 7 ? "Pro" : getStudyStreak() >= 3 ? "Active" : "Starter"}
                      {getStudyStreak() < 3 && " • 🎯 Almost there!"}
                    </p>
                  </div>
                </div>
                
                {/* Irresistible reward preview */}
                <div className="space-y-2">
                  {/* Current reward showcase */}
                  <div className="p-3 bg-gradient-to-br from-emerald-100/80 via-emerald-50/70 to-green-100/80 dark:from-emerald-950/50 dark:via-emerald-900/40 dark:to-green-950/50 rounded-xl border-2 border-emerald-200/70 dark:border-emerald-800/50 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 tracking-wider">NOW UNLOCKED</span>
                      {getStudyStreak() >= 3 && (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl filter drop-shadow-lg">
                        {getStudyStreak() >= 14 ? "🧠" : getStudyStreak() >= 7 ? "🎵" : getStudyStreak() >= 3 ? "🎨" : "🔒"}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-foreground">
                          {getStudyStreak() >= 14 ? "AI-Powered Smart Notes" : 
                           getStudyStreak() >= 7 ? "Focus Music & Sounds" :
                           getStudyStreak() >= 3 ? "Premium Themes" :
                           "Locked - Keep Going!"
                          }
                        </div>
                        <div className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                          {getStudyStreak() >= 14 ? "Revolutionary note generator" :
                           getStudyStreak() >= 7 ? "Study playlists & white noise" :
                           getStudyStreak() >= 3 ? "Dark mode & custom colors" :
                           `Just ${3 - getStudyStreak()} more day${3 - getStudyStreak() !== 1 ? 's' : ''}!`
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                   {/* Next reward teaser with urgency */}
                  {getStudyStreak() < 14 && (
                    <div className="p-3 bg-gradient-to-br from-blue-100/80 via-purple-50/70 to-indigo-100/80 dark:from-blue-950/50 dark:via-purple-900/40 dark:to-indigo-950/50 rounded-xl border-2 border-blue-200/70 dark:border-blue-800/50 shadow-lg backdrop-blur-sm relative overflow-hidden">
                      {/* Shimmer effect for desirability */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse opacity-40" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-blue-700 dark:text-blue-300 tracking-wider">COMING NEXT</span>
                          <div className="px-2 py-0.5 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full border border-orange-400/30">
                            <span className="text-xs text-orange-700 dark:text-orange-300 font-bold">
                              {getStudyStreak() >= 7 ? `${14 - getStudyStreak()}d` :
                               getStudyStreak() >= 3 ? `${7 - getStudyStreak()}d` :
                               `${3 - getStudyStreak()}d`
                              }
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl filter drop-shadow-lg">
                            {getStudyStreak() >= 7 ? "🧠" :
                             getStudyStreak() >= 3 ? "🎵" :
                             "🎨"
                            }
                          </span>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-foreground">
                              {getStudyStreak() >= 7 ? "AI Smart Notes" :
                               getStudyStreak() >= 3 ? "Study Sounds" :
                               "Custom Themes"
                              }
                            </div>
                            <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                              {getStudyStreak() >= 7 ? "Revolutionary study companion" :
                               getStudyStreak() >= 3 ? "Focus music & ambient sounds" :
                               "Personalize your experience"
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Max reward achieved message for 14+ day streaks */}
                  {getStudyStreak() >= 14 && (
                    <div className="p-3 bg-gradient-to-br from-amber-100/80 via-yellow-50/70 to-orange-100/80 dark:from-amber-950/50 dark:via-yellow-900/40 dark:to-orange-950/50 rounded-xl border-2 border-amber-200/70 dark:border-amber-800/50 shadow-lg backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-amber-700 dark:text-amber-300 tracking-wider">MAX LEVEL ACHIEVED</span>
                        <div className="flex items-center space-x-1">
                          <Crown className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">ELITE</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl filter drop-shadow-lg">👑</span>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-foreground">
                            All Rewards Unlocked
                          </div>
                          <div className="text-xs text-amber-700 dark:text-amber-300 font-medium">
                            You've mastered the ultimate study experience!
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Compelling progress bar with momentum psychology */}
                {getStudyStreak() < 14 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-muted-foreground tracking-wider">PROGRESS TO NEXT</span>
                      <span className="font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 dark:from-emerald-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                        {getStudyStreak() >= 7 ? `${Math.round(((getStudyStreak() - 7) / 7) * 100)}%` :
                         getStudyStreak() >= 3 ? `${Math.round(((getStudyStreak() - 3) / 4) * 100)}%` :
                         `${Math.round((getStudyStreak() / 3) * 100)}%`
                        }
                      </span>
                    </div>
                    
                    {/* Ultra-premium progress bar */}
                    <div className="relative">
                      <div className="w-full bg-gradient-to-r from-muted/60 to-muted/40 rounded-full h-2 overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 shadow-lg relative overflow-hidden"
                          style={{
                            width: `${getStudyStreak() >= 14 ? 100 :
                                     getStudyStreak() >= 7 ? ((getStudyStreak() - 7) / 7) * 100 :
                                     getStudyStreak() >= 3 ? ((getStudyStreak() - 3) / 4) * 100 :
                                     (getStudyStreak() / 3) * 100}%`
                          }}
                        >
                          {/* Animated shine effect for premium feel */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-pulse" />
                        </div>
                      </div>
                      {/* Progress glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-blue-500/30 to-purple-500/30 rounded-full blur-sm opacity-50" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Predicted GCSE Grades Section */}
        <PredictedGradesGraph userProgress={userProgress} />

        {/* Optimal Learning Time - Premium Feature */}
        <div className="mb-8">
          <OptimalLearningTimeCard />
        </div>

        {/* Predicted 2026 Questions Section */}
        <PredictedQuestionsSection />

        {/* Premium Stress Monitor & Revision Notebook - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DashboardStressMonitor 
            userId={user?.id} 
            userProgress={userProgress}
            onSubjectClick={handlePractice}
          />
          
          {/* Revision Notebook - Premium Feature */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-indigo-950/30 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02]" onClick={() => navigate('/notebook')}>
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-lg p-[2px] group-hover:animate-pulse">
              <div className="bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-indigo-950/30 rounded-[6px] h-full w-full" />
            </div>
            
            <CardContent className="relative p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 flex items-center justify-center shadow-2xl group-hover:shadow-purple-500/25 transition-shadow duration-300">
                    <div className="absolute inset-2 rounded-2xl bg-white/20 backdrop-blur-sm" />
                    <Brain className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-300 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-700 dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                      Revision Notebook
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Crown className="h-4 w-4 text-amber-500 animate-bounce" />
                      <span className="text-sm font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">Premium Feature</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-full border border-emerald-300/30">
                    <Zap className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Auto</span>
                  </div>
                  <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full border border-blue-300/30">
                    <Target className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Grade 9 Focus</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Revolutionary technology creates <span className="font-semibold text-purple-700 dark:text-purple-300">ultra-clear, Grade 9-level revision notes</span> instantly for every question where you lose marks. Each note is meticulously crafted with key definitions, equations, and premium exam strategies.
              </p>
              
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-white/10 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Instant premium note generation</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-white/10 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Organized by topic</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/60 dark:bg-white/10 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">Exam-focused premium content</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Save 10+ hours per week</span>
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-3 text-base font-semibold"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Open Premium Notebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        {/* Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold text-foreground">Your Subjects</h3>
              <Badge variant="outline" className="text-muted-foreground border-border bg-card/50">
                {subjectsTab === 'my-subjects' ? userSubjects.length : allSubjects.length} subjects
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-background/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-1.5 border border-border shadow-sm">
                <Button
                  variant={sortBy === 'progress' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('progress')}
                  className={sortBy === 'progress' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  Progress
                </Button>
                <Button
                  variant={sortBy === 'weakest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('weakest')}
                  className={sortBy === 'weakest' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  Weakest
                </Button>
                <Button
                  variant={sortBy === 'alphabetical' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('alphabetical')}
                  className={sortBy === 'alphabetical' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  A-Z
                </Button>
              </div>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className="flex space-x-1 bg-muted/50 rounded-xl p-1 mb-6 max-w-md">
            <Button
              variant={subjectsTab === 'my-subjects' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSubjectsTab('my-subjects')}
              className={subjectsTab === 'my-subjects' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 flex-1' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1'}
            >
              My Subjects ({userSubjects.filter(id => id && id.trim()).length})
            </Button>
            <Button
              variant={subjectsTab === 'all-subjects' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSubjectsTab('all-subjects')}
              className={subjectsTab === 'all-subjects' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90 flex-1' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1'}
            >
              All Subjects ({allSubjects.length})
            </Button>
          </div>

          {/* Exam Board Tabs */}
          <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard} className="mb-6">
            <TabsList className="grid w-full grid-cols-5 max-w-md">
              <TabsTrigger value="aqa">AQA</TabsTrigger>
              <TabsTrigger value="edexcel">Edexcel</TabsTrigger>
              <TabsTrigger value="ccea">CCEA</TabsTrigger>
              <TabsTrigger value="ocr">OCR</TabsTrigger>
              <TabsTrigger value="wjec">WJEC</TabsTrigger>
            </TabsList>

            <TabsContent value="aqa" className="mt-6">
              {subjectsTab === 'my-subjects' && userSubjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">No subjects selected yet</h4>
                  <p className="text-muted-foreground mb-4">Add subjects to your list to get started with personalized learning</p>
                  <Button 
                    onClick={() => setSubjectsTab('all-subjects')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    Browse All Subjects
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {(subjectsTab === 'my-subjects' ? 
                    (userSubjects.length > 0 ? sortedSubjects.filter(s => userSubjects.includes(s.id)) : []) 
                    : allSubjects)
                    .filter(subject => subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'chemistry-edexcel' && subject.id !== 'physics-edexcel' && subject.id !== 'edexcel-english-language')
                     .map((subject) => (
                     <SubjectCard
                       key={subject.id}
                       subject={{
                         ...subject,
                         color: getSubjectColor(subject.id)
                       }}
                       progress={userProgress}
                       onStartPractice={handlePractice}
                       onTogglePin={togglePinSubject}
                       isPinned={pinnedSubjects.includes(subject.id)}
                       lastActivity={getLastActivity(subject.id)}
                       userId={user?.id}
                       onToggleUserSubject={subject.id === 'physics-aqa' ? handlePhysicsToggle : toggleUserSubject}
                       isUserSubject={userSubjects.includes(subject.id)}
                       showAddButton={subjectsTab === 'all-subjects'}
                     />
                     ))}
                 </div>
               )}
            </TabsContent>

            {['edexcel', 'ccea', 'ocr', 'wjec'].map((examBoard) => (
              <TabsContent key={examBoard} value={examBoard} className="mt-6">
                {subjectsTab === 'my-subjects' && userSubjects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2">No subjects selected yet</h4>
                    <p className="text-muted-foreground mb-4">Add subjects to your list to get started with personalized learning</p>
                    <Button 
                      onClick={() => setSubjectsTab('all-subjects')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      Browse All Subjects
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {(subjectsTab === 'my-subjects' ? 
                      (userSubjects.length > 0 ? sortedSubjects.filter(s => userSubjects.includes(s.id)) : []) 
                      : allSubjects)
                       .filter((subject) => {
                         // Show maths-edexcel, business-edexcel-igcse, chemistry-edexcel, and physics-edexcel only in edexcel tab
                         if (subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') {
                           return examBoard === 'edexcel';
                          }
                          // Hide edexcel subjects from other tabs, show other subjects as coming soon
                          return subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'chemistry-edexcel' && subject.id !== 'physics-edexcel';
                       })
                         .sort((a, b) => {
                            // In edexcel tab, put maths-edexcel first, then business-edexcel-igcse, then chemistry-edexcel, then physics-edexcel
                            if (examBoard === 'edexcel') {
                              if (a.id === 'maths-edexcel') return -1;
                              if (b.id === 'maths-edexcel') return 1;
                              if (a.id === 'business-edexcel-igcse') return -1;
                              if (b.id === 'business-edexcel-igcse') return 1;
                              if (a.id === 'chemistry-edexcel') return -1;
                              if (b.id === 'chemistry-edexcel') return 1;
                              if (a.id === 'physics-edexcel') return -1;
                              if (b.id === 'physics-edexcel') return 1;
                            }
                           return 0;
                         })
                     .map((subject) => {
                       // Modify subject name for Edexcel subjects to remove brackets
                       let modifiedSubject = { ...subject };
                         if (examBoard === 'edexcel') {
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
                           progress={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel' ? userProgress : []}
                           onStartPractice={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel' ? handlePractice : () => {}}
                           onTogglePin={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel' ? togglePinSubject : () => {}}
                           isPinned={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel' ? pinnedSubjects.includes(subject.id) : false}
                           lastActivity={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel' ? getLastActivity(subject.id) : null}
                           comingSoon={!((subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && examBoard === 'edexcel')}
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

        {/* Premium Progress Overview */}
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

        {/* Premium Analytics Section */}
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


        {/* Premium Locked Analytics */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Crown className="h-6 w-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-foreground">Coming Soon</h3>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Pro Feature
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PremiumAnalyticsCard
              title="Learning Retention"
              description="Track how well you retain information over time with spaced repetition analysis"
              icon={Brain}
              gradient="from-purple-500 to-indigo-600"
              comingSoon={true}
            />
            
            <PremiumAnalyticsCard
              title="Learning Velocity"
              description="Measure and optimize your knowledge acquisition speed"
              icon={Zap}
              gradient="from-orange-500 to-red-500"
              comingSoon={true}
            />
            
            <PremiumAnalyticsCard
              title="Concept Mapping"
              description="Visualize connections between topics and identify knowledge gaps"
              icon={Target}
              gradient="from-pink-500 to-rose-600"
              comingSoon={true}
            />
          </div>

          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-400" />
                <h4 className="text-xl font-bold text-foreground">Advanced Analytics Coming Soon</h4>
                <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-400" />
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working hard to bring you powerful data-driven insights to supercharge your GCSE revision. 
                Stay tuned for updates!
              </p>
              <Button 
                variant="outline" 
                className={`
                  px-6 py-2 rounded-xl transition-all duration-300 transform
                  ${isNotifyClicked 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700 scale-105 shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300'
                  }
                `}
                onClick={handleNotifyClick}
              >
                {isNotifyClicked ? <CheckCircle className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                {isNotifyClicked ? 'We\'ll Notify You!' : 'Notify Me When Ready'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Notification */}
      {notification.isVisible && (
        <PersonalizedNotification
          type={notification.type!}
          questionNumber={notification.questionNumber}
          topicName={notification.topicName}
          subjectName={notification.subjectName}
          streakCount={notification.streakCount}
          weakestTopic={notification.weakestTopic}
          subjectId={notification.subjectId}
          onClose={clearNotification}
          onAction={handleNotificationAction}
        />
      )}

      {/* Study Recommendation Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            clearNotificationCache();
            checkForWeakTopicRecommendation();
          }}
          className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-600 text-white border-0 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-105 px-4 py-2 rounded-xl font-semibold backdrop-blur-sm group"
          size="lg"
        >
          {/* Premium animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Floating sparkles animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-yellow-300/80 rounded-full animate-pulse" />
            <div className="absolute bottom-3 right-5 w-1 h-1 bg-cyan-300/70 rounded-full animate-pulse delay-300" />
            <div className="absolute top-1/2 right-3 w-0.5 h-0.5 bg-pink-300/60 rounded-full animate-pulse delay-700" />
            <div className="absolute top-3 right-8 w-1.5 h-1.5 bg-emerald-300/70 rounded-full animate-pulse delay-1000" />
          </div>
          
          {/* Main content */}
          <div className="relative flex items-center gap-3">
            {/* Premium brain icon with rotation animation */}
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="absolute inset-0 bg-cyan-400/40 rounded-full animate-ping" />
            </div>
            
            <span className="text-lg tracking-wide">What Should I Study?</span>
            
            {/* Processing indicator */}
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin opacity-70" />
          </div>
          
          {/* Premium glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/50 via-purple-600/50 to-indigo-700/50 rounded-2xl blur-lg opacity-60 group-hover:opacity-80 transition-opacity duration-500 -z-10" />
          
          {/* Inner highlight */}
          <div className="absolute inset-0.5 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl opacity-50" />
        </Button>
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
          } else {
            await markStreakCelebrationViewed(7);
          }
        }}
        streakDays={getStudyStreak()}
        rewardText={getStudyStreak() >= 14 ? "Create Your Public Profile & Get Recognition" : "Study Playlist & Background Sounds"}
        rewardEmoji={getStudyStreak() >= 14 ? "👤" : "🎵"}
      />
    </div>
  );
};

export default Dashboard;
