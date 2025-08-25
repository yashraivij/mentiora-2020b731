import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2, Settings, Shield } from "lucide-react";
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
import { PremiumAnalytics } from "@/components/premium/PremiumAnalytics";
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
            console.log(`✅ Matched ${record.subject_name} to ${subject.id}`);
            return subject.id;
          }
          
          console.log(`❌ No match found for ${record.subject_name} | ${examBoard}`);
          return null;
        }).filter(Boolean) as string[];

        console.log('=== Final subject IDs ===', subjectIds);
        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  };

  const fetchCurrentStreak = async () => {
    // Simplified for premium dashboard - just return stored streak
    return;
  };

  const checkAndUpdatePublicProfile = async () => {
    // Simplified for premium dashboard
    return;
  };

  const handlePractice = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    if (subject && subject.topics.length > 0) {
      navigate(`/practice/${subjectId}/${subject.topics[0].id}`);
    }
  };

  const togglePinSubject = (subjectId: string) => {
    const updatedPinnedSubjects = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(updatedPinnedSubjects);
    localStorage.setItem(`mentiora_pinned_subjects_${user?.id}`, JSON.stringify(updatedPinnedSubjects));
  };

  const toggleUserSubject = async (subjectId: string) => {
    if (!user?.id) return;

    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;

    const isCurrentlyUserSubject = userSubjects.includes(subjectId);

    try {
      if (isCurrentlyUserSubject) {
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', subject.name.replace(/ \([^)]*\)/g, ''));

        if (error) {
          console.error('Error removing user subject:', error);
          return;
        }

        setUserSubjects(prev => prev.filter(id => id !== subjectId));
      } else {
        let subjectName = subject.name.replace(/ \([^)]*\)/g, '');
        let examBoard = 'AQA';

        if (subject.name.includes('(Edexcel')) {
          examBoard = 'Edexcel';
        } else if (subject.name.includes('(OCR')) {
          examBoard = 'OCR';
        } else if (subject.name.includes('(WJEC')) {
          examBoard = 'WJEC';
        } else if (subject.name.includes('(CCEA')) {
          examBoard = 'CCEA';
        }

        // Simplified for premium dashboard - just update local state
        console.log('Would add subject:', subjectName, examBoard);

        if (error) {
          console.error('Error adding user subject:', error);
          return;
        }

        setUserSubjects(prev => [...prev, subjectId]);
      }
    } catch (error) {
      console.error('Error toggling user subject:', error);
    }
  };

  const handlePhysicsToggle = async (subjectId: string) => {
    if (subjectId !== 'physics' || !user?.id) return;

    const isCurrentlyUserSubject = userSubjects.includes(subjectId);

    try {
      if (isCurrentlyUserSubject) {
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', 'Physics')
          .eq('exam_board', 'AQA');

        if (error) {
          console.error('Error removing Physics AQA:', error);
          return;
        }

        setUserSubjects(prev => prev.filter(id => id !== subjectId));
      } else {
        // Simplified for premium dashboard - just update local state
        console.log('Would add Physics AQA');

        if (error) {
          console.error('Error adding Physics AQA:', error);
          return;
        }

        setUserSubjects(prev => [...prev, subjectId]);
      }
    } catch (error) {
      console.error('Error toggling Physics subject:', error);
    }
  };

  const getLastActivity = (subjectId: string): Date | null => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return null;
    
    return new Date(Math.max(...subjectProgress.map(p => new Date(p.lastAttempt).getTime())));
  };

  const getOverallProgress = (): number => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const getMasteredTopics = (): string => {
    const masteredCount = userProgress.filter(p => p.averageScore >= 85).length;
    const totalTopics = userProgress.length;
    return `${masteredCount}/${totalTopics}`;
  };

  const getStudyStreak = (): number => {
    const savedStreak = localStorage.getItem(`mentiora_streak_${user?.id}`);
    return savedStreak ? parseInt(savedStreak, 10) : 1;
  };

  const getSubjectColor = (subjectId: string): string => {
    const colors = {
      'maths': 'bg-blue-500',
      'english-language': 'bg-green-500',
      'english-literature': 'bg-emerald-500',
      'physics': 'bg-purple-500',
      'chemistry': 'bg-orange-500',
      'biology': 'bg-teal-500',
      'computer-science': 'bg-indigo-500',
      'history': 'bg-amber-500',
      'geography': 'bg-cyan-500',
      'business': 'bg-pink-500',
      'economics': 'bg-red-500',
      'psychology': 'bg-violet-500'
    };
    return colors[subjectId as keyof typeof colors] || 'bg-gray-500';
  };

  const getSubjectsInAlphabeticalOrder = () => {
    return [...curriculum].sort((a, b) => a.name.localeCompare(b.name));
  };

  const getSubjectsByWeakestFirst = () => {
    return [...curriculum].sort((a, b) => {
      const aProgress = userProgress.filter(p => p.subjectId === a.id);
      const bProgress = userProgress.filter(p => p.subjectId === b.id);
      
      const aAverage = aProgress.length > 0 ? aProgress.reduce((sum, p) => sum + p.averageScore, 0) / aProgress.length : 0;
      const bAverage = bProgress.length > 0 ? bProgress.reduce((sum, p) => sum + p.averageScore, 0) / bProgress.length : 0;
      
      return aAverage - bAverage;
    });
  };

  const getSubjectsByProgress = () => {
    const pinnedFirst = curriculum.filter(subject => pinnedSubjects.includes(subject.id));
    const unpinned = curriculum.filter(subject => !pinnedSubjects.includes(subject.id));
    
    const sortUnpinned = (subjects: typeof curriculum) => {
      return subjects.sort((a, b) => {
        const aProgress = userProgress.filter(p => p.subjectId === a.id);
        const bProgress = userProgress.filter(p => p.subjectId === b.id);
        
        if (aProgress.length === 0 && bProgress.length === 0) return 0;
        if (aProgress.length === 0) return 1;
        if (bProgress.length === 0) return -1;
        
        const aAverage = aProgress.reduce((sum, p) => sum + p.averageScore, 0) / aProgress.length;
        const bAverage = bProgress.reduce((sum, p) => sum + p.averageScore, 0) / bProgress.length;
        
        return bAverage - aAverage;
      });
    };
    
    return [...pinnedFirst, ...sortUnpinned(unpinned)];
  };

  const sortedSubjects = (() => {
    switch (sortBy) {
      case 'alphabetical':
        return getSubjectsInAlphabeticalOrder();
      case 'weakest':
        return getSubjectsByWeakestFirst();
      case 'progress':
      default:
        return getSubjectsByProgress();
    }
  })();

  const allSubjects = getSubjectsInAlphabeticalOrder();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Please sign in to access your premium dashboard</h2>
          <Button onClick={() => navigate('/login')}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Mentiora Premium
              </div>
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown className="h-3 w-3 mr-1" />
                Premium Active
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <StudyPlaylist isUnlocked={true} />
              <ColorThemeToggle />
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <div className="text-sm text-muted-foreground">
                  {user.email}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Premium Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your GCSE revision progress with advanced analytics</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/analytics')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>View Analytics</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/notebook')}
                className="flex items-center space-x-2"
              >
                <BookOpen className="h-4 w-4" />
                <span>AI Notebook</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => navigate('/settings')}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Predicted Questions Section - NO BLUR */}
        <div className="mb-8">
          <PredictedQuestionsSection />
        </div>

        {/* Premium Analytics Section - NO BLUR */}
        <div className="mb-8">
          <PremiumAnalytics />
        </div>

        {/* Advanced Dashboard Features - NO BLUR */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <PredictivePerformanceCard userProgress={userProgress} />
          </div>
          <div className="lg:col-span-1">
            <OptimalStudyTimeCard />
          </div>
          <div className="lg:col-span-1">
            <PredictedGradesGraph userProgress={userProgress} />
          </div>
        </div>

        {/* Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Subjects</h2>
            
            <div className="flex items-center space-x-4">
              <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as 'my-subjects' | 'all-subjects')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="my-subjects" className="text-sm">My Subjects</TabsTrigger>
                  <TabsTrigger value="all-subjects" className="text-sm">All Subjects</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'weakest' | 'progress')}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="progress">Progress</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="weakest">Weakest First</option>
                </select>
              </div>
            </div>
          </div>

          <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="aqa">AQA</TabsTrigger>
              <TabsTrigger value="edexcel">Edexcel</TabsTrigger>
              <TabsTrigger value="ocr">OCR</TabsTrigger>
              <TabsTrigger value="wjec">WJEC</TabsTrigger>
              <TabsTrigger value="ccea">CCEA</TabsTrigger>
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

        {/* Premium Progress Overview - NO BLUR */}
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

        {/* Premium Analytics Section - NO BLUR */}
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

        {/* Premium Analytics Coming Soon Cards - NO BLUR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <PremiumAnalyticsCard
            title="Learning Retention"
            description="Track how well you retain information over time with spaced repetition analysis"
            icon={Brain}
            gradient="from-purple-500 to-pink-600"
            comingSoon={true}
          />
          
          <PremiumAnalyticsCard
            title="Learning Velocity"
            description="Measure and optimize your knowledge acquisition speed"
            icon={Zap}
            gradient="from-blue-500 to-cyan-500"
            comingSoon={true}
          />
          
          <PremiumAnalyticsCard
            title="Stress Monitor"
            description="AI-powered stress detection and recommendations for optimal learning"
            icon={Target}
            gradient="from-emerald-500 to-teal-600"
            comingSoon={true}
          />
          
          <PremiumAnalyticsCard
            title="Concept Mapping"
            description="Visualize connections between topics and identify knowledge gaps"
            icon={LineChart}
            gradient="from-orange-500 to-red-600"
            comingSoon={true}
          />
        </div>

        {/* Advanced Analytics Coming Soon Section */}
        <div className="text-center py-12 mb-8">
          <div className="flex flex-col items-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="h-10 w-10 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 flex items-center justify-center gap-3">
                <Sparkles className="h-6 w-6 text-purple-500" />
                Advanced Analytics Coming Soon
                <Sparkles className="h-6 w-6 text-purple-500" />
              </h3>
              <p className="text-muted-foreground max-w-lg mx-auto text-lg">
                We're working hard to bring you powerful data-driven insights to supercharge your GCSE revision. Stay tuned for updates!
              </p>
            </div>
            <Button 
              variant="outline" 
              className={`mt-6 px-8 py-3 text-lg font-semibold transition-all duration-300 ${
                isNotifyClicked 
                  ? 'border-green-500 text-green-600 bg-green-50 dark:bg-green-950 hover:bg-green-100 dark:hover:bg-green-900' 
                  : 'border-purple-500 text-purple-600 bg-purple-50 dark:bg-purple-950 hover:bg-purple-100 dark:hover:bg-purple-900'
              }`}
              onClick={() => {
                setIsNotifyClicked(true);
                toast({
                  title: "Thanks for your interest!",
                  description: "We'll notify you as soon as advanced analytics are ready.",
                });
                // Reset color after 3 seconds
                setTimeout(() => {
                  setIsNotifyClicked(false);
                }, 3000);
              }}
            >
              <Bell className="h-5 w-5 mr-2" />
              {isNotifyClicked ? "We'll Notify You!" : "Notify Me When Ready"}
            </Button>
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

export default PremiumDashboard;
