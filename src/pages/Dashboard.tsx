import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2, HelpCircle, StickyNote } from "lucide-react";
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

import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";

import { supabase } from "@/integrations/supabase/client";
import { StressTracker } from "@/lib/stressTracker";

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
      await recordActivity('dashboard_visit');
      await fetchCurrentStreak();

      // Check and update public profile for 14+ day streaks
      await checkAndUpdatePublicProfile();

      // Check for recommendations on dashboard load
      console.log('Dashboard loading, checking for weak topic recommendations...');
      await checkForWeakTopicRecommendation();
    };

    loadUserData();
    
    // Also fetch streak on component mount
    if (user?.id) {
      fetchCurrentStreak();
    }
    
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
  const recordActivity = async (activityType: string) => {
    if (!user?.id) return;
    
    try {
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.id,
          activity_type: activityType
        });
      
      // Refresh the streak after recording activity
      setTimeout(() => {
        fetchCurrentStreak();
      }, 500);
      
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  };

  // Fetch current streak from database
  const fetchCurrentStreak = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase.rpc('get_user_streak', {
        user_uuid: user.id
      });
      
      if (error) {
        console.error('Error fetching streak:', error);
        setCurrentStreak(0);
        return;
      }
      
      setCurrentStreak(data || 0);
    } catch (error) {
      console.error('Error fetching streak:', error);
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
    await recordActivity('practice_start');
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

        {/* Premium Hero Streak & Rewards Card */}
        <div className="mb-8">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 shadow-2xl hover:shadow-3xl transition-all duration-500 group backdrop-blur-sm transform hover:scale-[1.01]">
            {/* Animated glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Premium border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-[2px]">
              <div className="w-full h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 rounded-2xl" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-6 right-8 animate-bounce delay-100">
              <Sparkles className="h-5 w-5 text-purple-400 opacity-70" />
            </div>
            <div className="absolute bottom-8 left-12 animate-bounce delay-300">
              <Star className="h-4 w-4 text-pink-400 opacity-60" />
            </div>
            
            <CardContent className="relative z-10 p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                
                {/* LEFT: Streak Display */}
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 flex items-center justify-center shadow-2xl shadow-orange-500/30 transition-all duration-300 group-hover:scale-105 relative overflow-hidden mx-auto">
                      <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />
                      <Flame className="h-8 w-8 text-white relative z-10 drop-shadow-lg" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Crown className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-5xl font-black bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 bg-clip-text text-transparent">
                      {getStudyStreak()}
                    </div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      Day{getStudyStreak() !== 1 ? 's' : ''} Strong! 🔥
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {getStudyStreak() === 0 ? "Start your journey today!" : "Keep the momentum going!"}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Rewards */}
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Unlock Premium Features
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Build your streak to unlock exclusive rewards</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Color Themes - 3 days */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${getStudyStreak() >= 3 ? 'bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-300 shadow-lg' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStudyStreak() >= 3 ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gray-400'}`}>
                            <Sparkles className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${getStudyStreak() >= 3 ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500'}`}>Color Themes</p>
                            <p className="text-xs text-gray-500">Personalize your experience</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 3 ? (
                          <Badge className="bg-violet-500 text-white text-xs">UNLOCKED ✨</Badge>
                        ) : (
                          <span className="text-xs text-gray-500">{3 - getStudyStreak()}d to go</span>
                        )}
                      </div>
                    </div>

                    {/* Study Playlist - 7 days */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${getStudyStreak() >= 7 ? 'bg-gradient-to-r from-emerald-100 to-cyan-100 dark:from-emerald-950/30 dark:to-cyan-950/30 border-emerald-300 shadow-lg' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStudyStreak() >= 7 ? 'bg-gradient-to-br from-emerald-500 to-cyan-600' : 'bg-gray-400'}`}>
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${getStudyStreak() >= 7 ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}`}>Study Playlist</p>
                            <p className="text-xs text-gray-500">Focus-enhancing music</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 7 ? (
                          <Badge className="bg-emerald-500 text-white text-xs">UNLOCKED 🎵</Badge>
                        ) : (
                          <span className="text-xs text-gray-500">{7 - getStudyStreak()}d to go</span>
                        )}
                      </div>
                    </div>

                    {/* Hall of Fame - 14 days */}
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 ${getStudyStreak() >= 14 ? 'bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-950/30 border-amber-300 shadow-lg' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getStudyStreak() >= 14 ? 'bg-gradient-to-br from-amber-500 to-yellow-600' : 'bg-gray-400'}`}>
                            <Trophy className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${getStudyStreak() >= 14 ? 'text-amber-700 dark:text-amber-300' : 'text-gray-500'}`}>Hall of Fame</p>
                            <p className="text-xs text-gray-500">Public recognition</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 14 ? (
                          <Badge className="bg-amber-500 text-white text-xs">LEGENDARY 👑</Badge>
                        ) : (
                          <span className="text-xs text-gray-500">{14 - getStudyStreak()}d to go</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <Button 
                      onClick={() => navigate('/practice')}
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Start Practicing
                    </Button>
                  </div>
                 </div>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subjects Section */}
            <div id="subjects-section">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Subjects</h2>
                <div className="flex items-center space-x-4">
                  <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as 'my-subjects' | 'all-subjects')} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="my-subjects">My Subjects</TabsTrigger>
                      <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <Tabs value={subjectsTab} className="w-full">
                <TabsContent value="my-subjects" className="mt-0">
                  {userSubjects.length === 0 ? (
                    <Card className="p-8 text-center border-dashed border-2 border-gray-300 dark:border-gray-600">
                      <div className="space-y-4">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            No subjects added yet
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Add subjects from the "All Subjects" tab to start your learning journey
                          </p>
                          <Button 
                            onClick={() => setSubjectsTab('all-subjects')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          >
                            Browse All Subjects
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {curriculum
                        .filter(subject => userSubjects.includes(subject.id))
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

                <TabsContent value="all-subjects" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {curriculum.map((subject) => {
                        const modifiedSubject = subject.id === 'maths-edexcel' 
                          ? { ...subject, name: 'Maths (Edexcel)' }
                          : subject.id === 'business-edexcel-igcse'
                          ? { ...subject, name: 'Business (Edexcel IGCSE)' }
                          : subject.id === 'chemistry-edexcel'
                          ? { ...subject, name: 'Chemistry (Edexcel)' }
                          : subject.id === 'physics-edexcel'
                          ? { ...subject, name: 'Physics (Edexcel)' }
                          : subject.id === 'edexcel-english-language'
                          ? { ...subject, name: 'English Language (Edexcel)' }
                          : subject;
                        
                        return (
                        <SubjectCard
                          key={subject.id}
                          subject={{
                            ...modifiedSubject,
                            color: getSubjectColor(subject.id)
                          }}
                          progress={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel' ? userProgress : []}
                          onStartPractice={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel' ? handlePractice : () => {}}
                          onTogglePin={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel' ? togglePinSubject : () => {}}
                          isPinned={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel' ? pinnedSubjects.includes(subject.id) : false}
                          lastActivity={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel' ? getLastActivity(subject.id) : null}
                          comingSoon={!((subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'chemistry-edexcel' || subject.id === 'physics-edexcel') && selectedExamBoard === 'edexcel')}
                          userId={user?.id}
                          onToggleUserSubject={toggleUserSubject}
                          isUserSubject={userSubjects.includes(subject.id)}
                          showAddButton={subjectsTab === 'all-subjects'}
                        />
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right column - Progress overview */}
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Premium Analytics</h2>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <PredictivePerformanceCard userProgress={userProgress} />
             <OptimalStudyTimeCard />
             <PremiumAnalyticsCard 
               title="Premium Analytics"
               description="Advanced insights"
               icon={LineChart}
               gradient="from-purple-500 to-pink-500"
             />
           </div>
        </div>

        {/* Predicted GCSE Grades Section */}
        <PredictedGradesGraph userProgress={userProgress} />

        {/* Predicted 2026 Questions Section */}
        <PredictedQuestionsSection />

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Questions Answered"
            value="127"
            subtitle="This week"
            icon={HelpCircle}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          
          <ProgressCard
            title="Average Score"
            value="78%"
            subtitle="Across all subjects"
            icon={TrendingUp}
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

        {/* Hall of Fame Section */}
        <PublicStreakProfiles />
      </div>

      {/* Streak Celebration Modal */}
      <StreakCelebration
        isVisible={showStreakCelebration}
        onClose={() => setShowStreakCelebration(false)}
        streakDays={getStudyStreak()}
        rewardText={getStudyStreak() >= 14 ? "Create Your Public Profile & Get Recognition" : "Study Playlist & Background Sounds"}
        rewardEmoji={getStudyStreak() >= 14 ? "👤" : "🎵"}
      />
    </div>
  );
};

export default Dashboard;
