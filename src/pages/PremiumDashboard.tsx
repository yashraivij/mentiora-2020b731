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

  // Check if user has seen streak celebration
  const hasSeenStreakCelebration = () => {
    if (!user?.id) return false;
    const seen = localStorage.getItem(`mentiora_streak_seen_${user.id}`);
    return seen === 'true';
  };

  // Mark streak celebration as viewed
  const markStreakCelebrationViewed = () => {
    if (!user?.id) return;
    localStorage.setItem(`mentiora_streak_seen_${user.id}`, 'true');
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

  // Load user progress from localStorage or API
  const loadUserProgress = async () => {
    if (!user?.id) return;

    try {
      // For demo, load from localStorage
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
      } else {
        // If no saved progress, initialize empty
        setUserProgress([]);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  // Load weak topics based on progress
  const loadWeakTopics = () => {
    // For demo, find topics with averageScore < 50
    const weak = userProgress.filter(p => p.averageScore < 50).map(p => p.topicId);
    setWeakTopics(weak);
  };

  // Load pinned subjects from localStorage
  const loadPinnedSubjects = () => {
    if (!user?.id) return;
    const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
    if (savedPinnedSubjects) {
      setPinnedSubjects(JSON.parse(savedPinnedSubjects));
    }
  };

  // Load user subjects (for filtering)
  const loadUserSubjects = () => {
    if (!user?.id) return;
    // For demo, load all subjects
    setUserSubjects(curriculum.map(s => s.id));
  };

  // Load all data on mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Apply natural stress decay when dashboard loads
      StressTracker.applyTimeDecay(user.id);

      // Load progress from localStorage
      await loadUserProgress();

      // Load pinned subjects from localStorage
      loadPinnedSubjects();

      // Load user subjects
      loadUserSubjects();

      // Load weak topics based on progress
      loadWeakTopics();

      // Load and track time saved from notebook entries
      await loadTimeSavedStats();

      // Record login activity and fetch current streak
      await fetchCurrentStreak();
    };

    loadUserData();
  }, [user?.id]);

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
      
    } catch (error) {
      console.error('Error calculating streak:', error);
      setCurrentStreak(0);
    }
  };

  // Helper functions for progress and topics
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

  // Premium dashboard should navigate directly to predicted exams bypassing paywall
  const handlePredictedExam = (subjectId: string) => {
    navigate(`/predicted-exam/${subjectId}`, { 
      state: { fromPremiumDashboard: true }
    });
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
              <p className="text-muted-foreground text-lg">Welcome to your premium dashboard - no limits, full access!</p>
            </div>
          </div>
        </div>

        {/* Premium Combined Streak & Rewards Card */}
        <div className="mb-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-violet-50/60 to-cyan-50/60 dark:from-slate-900 dark:via-violet-950/30 dark:to-cyan-950/30 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm transform hover:scale-[1.01]">
            {/* Streak and rewards card content */}
            <CardContent className="relative p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT SIDE: Study Streak Section */}
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <div className="relative inline-block">
                      {/* Compact fire icon */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all duration-300 group-hover:scale-105 relative overflow-hidden mx-auto">
                        <div className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm" />
                        <Flame className="h-6 w-6 text-white relative z-10 drop-shadow-lg" />
                      </div>
                    </div>
                    
                    {/* Compact streak display */}
                     <div className="space-y-2">
                       <motion.h3 
                         key={getStudyStreak()}
                         initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
                         animate={{ scale: 1, rotate: 0, opacity: 1 }}
                         transition={{ 
                           type: "spring", 
                           damping: 15, 
                           stiffness: 300,
                           duration: 0.8 
                         }}
                         className="text-4xl font-bold bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 dark:from-orange-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight"
                       >
                         {getStudyStreak()}
                       </motion.h3>
                       <div className="flex items-center justify-center space-x-2">
                         <motion.span 
                           initial={{ y: 10, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           transition={{ delay: 0.3 }}
                           className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent"
                         >
                           Day{getStudyStreak() !== 1 ? 's' : ''} Strong!
                         </motion.span>
                       </div>
                     </div>
                  </div>

                  {/* Compact call to action */}
                  <Button 
                    onClick={() => {
                      const subjectsSection = document.getElementById('subjects-section');
                      if (subjectsSection) {
                        subjectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }} 
                    className="w-full h-10 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-semibold shadow-lg shadow-orange-500/20 transform hover:scale-105 transition-all duration-300 border-0"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Continue Streak
                  </Button>
                </div>

                {/* RIGHT SIDE: Compact Rewards Section */}
                <div className="space-y-4">
                  <div className="text-center space-y-3">
                    <div className="relative inline-block">
                      {/* Compact trophy */}
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-violet-500 flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all duration-300 group-hover:scale-105 relative overflow-hidden mx-auto">
                        <div className="absolute inset-1 rounded-xl bg-white/20 backdrop-blur-sm" />
                        <Trophy className="h-6 w-6 text-white relative z-10 drop-shadow-lg" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-emerald-600 via-cyan-600 to-violet-600 dark:from-emerald-400 dark:via-cyan-400 dark:to-violet-400 bg-clip-text text-transparent">
                        Streak Rewards
                      </h3>
                    </div>
                  </div>

                  {/* Compact reward tier system */}
                  <div className="space-y-2">
                    {/* Color Themes Reward - 3 days */}
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${getStudyStreak() >= 3 ? 'bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-400/30 shadow-sm' : 'bg-gray-100/30 dark:bg-gray-800/30 border-gray-300/50 dark:border-gray-600/50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStudyStreak() >= 3 ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm' : 'bg-gray-400'}`}>
                            <Star className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${getStudyStreak() >= 3 ? 'text-violet-700 dark:text-violet-300' : 'text-gray-500'}`}>
                              Custom Color Themes
                            </p>
                            <p className="text-xs text-muted-foreground">3 days</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 3 ? (
                          <CheckCircle className="h-4 w-4 text-violet-600" />
                        ) : (
                          <div className="text-xs font-medium text-muted-foreground">{3 - getStudyStreak()}d</div>
                        )}
                      </div>
                    </div>

                    {/* Study Playlist Reward - 7 days */}
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${getStudyStreak() >= 7 ? 'bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-400/30 shadow-sm' : 'bg-gray-100/30 dark:bg-gray-800/30 border-gray-300/50 dark:border-gray-600/50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStudyStreak() >= 7 ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-sm' : 'bg-gray-400'}`}>
                            <Gamepad2 className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${getStudyStreak() >= 7 ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}`}>
                              Study Playlists & Sounds
                            </p>
                            <p className="text-xs text-muted-foreground">7 days</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 7 ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <div className="text-xs font-medium text-muted-foreground">{7 - getStudyStreak()}d</div>
                        )}
                      </div>
                    </div>

                    {/* Free Tutoring Session - 14 days */}
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${getStudyStreak() >= 14 ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30 shadow-sm' : 'bg-gray-100/30 dark:bg-gray-800/30 border-gray-300/50 dark:border-gray-600/50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStudyStreak() >= 14 ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-sm' : 'bg-gray-400'}`}>
                            <User className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${getStudyStreak() >= 14 ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500'}`}>
                              Free Tutoring Session
                            </p>
                            <p className="text-xs text-muted-foreground">14 days</p>
                          </div>
                        </div>
                        {getStudyStreak() >= 14 ? (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        ) : (
                          <div className="text-xs font-medium text-muted-foreground">{14 - getStudyStreak()}d</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predicted GCSE Grades Section - No blur for premium */}
        <PredictedGradesGraph userProgress={userProgress} />

        {/* Predicted 2026 Questions Section - Direct access for premium */}
        <div className="mb-8">
          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Predicted 2026 Questions</h3>
                  <p className="text-muted-foreground">Access all premium exam predictions instantly</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {curriculum.slice(0, 8).map((subject) => (
                  <Button
                    key={subject.id}
                    onClick={() => handlePredictedExam(subject.id)}
                    className="h-16 bg-white/80 dark:bg-white/10 border border-blue-200/50 dark:border-blue-700/30 hover:bg-blue-50 dark:hover:bg-blue-950/20 text-foreground"
                  >
                    <div className="text-center">
                      <div className="font-semibold text-sm">{subject.name}</div>
                      <div className="text-xs text-muted-foreground">Start Exam</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revision Notebook - Premium Feature - No blur */}
        <div className="mb-8">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-indigo-950/30 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02]" onClick={() => navigate('/notebook')}>
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
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">Premium Active</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
                Access your complete revision notebook with ultra-clear, Grade 9-level notes instantly generated for every question. Full access to all premium features.
              </p>
              
              {/* Stats without blur */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(Math.random() * 50) + 10}
                  </div>
                  <div className="text-xs text-muted-foreground">Total Notes</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(Math.random() * 30) + 15}
                  </div>
                  <div className="text-xs text-muted-foreground">Smart Summaries</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {timeSavedHours}h
                  </div>
                  <div className="text-xs text-muted-foreground">Time Saved</div>
                </div>
                <div className="text-center p-3 bg-white/60 dark:bg-white/10 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(Math.random() * 8) + 3}
                  </div>
                  <div className="text-xs text-muted-foreground">Subjects Covered</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400 font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Unlimited access</span>
                </div>
                <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 px-8 py-3 text-base font-semibold">
                  <Brain className="h-4 w-4 mr-2" />
                  Open Notebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Section */}
        <div id="subjects-section" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Your Subjects</h2>
            <div className="flex items-center space-x-2">
              <Button variant={sortBy === 'progress' ? 'default' : 'outline'} onClick={() => setSortBy('progress')}>Sort by Progress</Button>
              <Button variant={sortBy === 'alphabetical' ? 'default' : 'outline'} onClick={() => setSortBy('alphabetical')}>Sort A-Z</Button>
              <Button variant={sortBy === 'weakest' ? 'default' : 'outline'} onClick={() => setSortBy('weakest')}>Sort Weakest</Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedSubjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={{
                  ...subject,
                  color: getSubjectColor(subject.id)
                }}
                progress={userProgress}
                lastActivity={getLastActivity(subject.id)}
                isPinned={pinnedSubjects.includes(subject.id)}
                onTogglePin={togglePinSubject}
                onStartPractice={handlePractice}
                userId={user?.id}
                isUserSubject={userSubjects.includes(subject.id)}
                showAddButton={false}
              />
            ))}
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
      </div>

      {/* Celebrations and Notifications */}
      <StreakCelebration 
        isVisible={showStreakCelebration}
        streakDays={getStudyStreak()}
        rewardText="Custom Color Themes"
        rewardEmoji="🎨"
        onClose={() => setShowStreakCelebration(false)} 
      />

      <TimeSavedNotification 
        show={showTimeSavedNotification}
        timeSavedHours={timeSavedHours} 
        onClose={() => setShowTimeSavedNotification(false)}
      />

      <GradeCelebration 
        isVisible={showGradeCelebration}
        grade={celebrationGrade}
        subject={celebrationSubject}
        onClose={() => setShowGradeCelebration(false)} 
      />

      <DiscordInvitation 
        isVisible={showDiscordInvitation}
        onClose={() => setShowDiscordInvitation(false)} 
      />
    </div>
  );
};

export default PremiumDashboard;
