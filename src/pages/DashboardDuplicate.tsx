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
import { PremiumPaywall } from "@/components/ui/premium-paywall";
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

const DashboardDuplicate = () => {
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
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

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
      const { data: entries, error } = await supabase
        .from('notebook_entries')
        .select('id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading notebook entries for time saved:', error);
        return;
      }

      const totalEntries = entries?.length || 0;
      const timeSavedMinutes = totalEntries * 10;
      const newTimeSavedHours = Math.round(timeSavedMinutes / 6) / 10;

      setTimeSavedHours(newTimeSavedHours);
      setPreviousTimeSaved(newTimeSavedHours);
    } catch (error) {
      console.error('Error calculating time saved:', error);
    }
  };

  // Fetch current streak using the database function
  const fetchCurrentStreak = async () => {
    if (!user?.id) return;
    
    try {
      // Record today's activity first
      await supabase
        .from('daily_usage')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          activities_count: 1,
          total_minutes: 5
        }, {
          onConflict: 'user_id,date',
          ignoreDuplicates: false
        });
      
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
      
    } catch (error) {
      console.error('Error calculating streak:', error);
      setCurrentStreak(0);
    }
  };

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
        const subjectIds = data.map(record => {
          const examBoard = record.exam_board.toLowerCase();
          
          if (record.subject_name === 'Physics' && examBoard === 'aqa') {
            return 'physics';
          }
          if (record.subject_name === 'Physics' && examBoard === 'edexcel') {
            return 'physics-edexcel';
          }
          
          const subject = curriculum.find(s => 
            (record.subject_name === 'Mathematics' && s.name === 'Maths (Edexcel)') ||
            (record.subject_name === 'IGCSE Business' && s.name === 'Business (Edexcel IGCSE)') ||
            (record.subject_name === 'Chemistry' && examBoard === 'edexcel' && s.id === 'chemistry-edexcel') ||
            s.name.toLowerCase() === record.subject_name.toLowerCase()
          );
          
          return subject ? subject.id : null;
        }).filter(Boolean) as string[];
        
        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  };

  const toggleUserSubject = async (subjectId: string) => {
    if (!user?.id) return;

    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;
    
    const subjectName = getSubjectName(subject);
    const examBoard = getExamBoard(subjectId);
    const isCurrentlySelected = userSubjects.includes(subjectId);

    try {
      if (isCurrentlySelected) {
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', subjectName)
          .eq('exam_board', examBoard);

        if (error) {
          console.error('Error removing subject:', error);
          toast({
            title: "Error",
            description: `Failed to remove ${subject.name}`,
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
        const { error } = await supabase
          .from('user_subjects')
          .insert({
            user_id: user.id,
            subject_name: subjectName,
            exam_board: examBoard,
            predicted_grade: 'U',
            target_grade: null,
            priority_level: 3
          });

        if (error) {
          console.error('Error adding subject:', error);
          toast({
            title: "Error",
            description: `Failed to add ${subject.name}`,
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
    }
  };

  const getSubjectName = (subject: any) => {
    if (subject.name === 'Maths (Edexcel)') return 'Mathematics';
    if (subject.name === 'Business (Edexcel IGCSE)') return 'IGCSE Business';
    if (subject.name === 'Chemistry (Edexcel)') return 'Chemistry';
    if (subject.name === 'Physics (Edexcel)') return 'Physics';
    if (subject.id === 'physics-edexcel') return 'Physics';
    if (subject.id === 'physics-aqa') return 'Physics';
    return subject.name;
  };

  const getExamBoard = (subjectId: string) => {
    if (subjectId.includes('edexcel')) return 'Edexcel';
    return 'AQA';
  };

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      StressTracker.applyTimeDecay(user.id);

      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        
        const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
        await saveWeakTopicsToDatabase(weak);
        setWeakTopics(weak);
      }

      await loadWeakTopicsFromDatabase();

      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }

      await loadUserSubjects();
      await fetchCurrentStreak();
      await loadTimeSavedStats();
      await checkForWeakTopicRecommendation();
    };

    loadUserData();
  }, [user?.id]);

  useEffect(() => {
    const handleOpenPremiumPaywall = () => {
      setShowPremiumPaywall(true);
    };

    window.addEventListener('openPremiumPaywall', handleOpenPremiumPaywall);

    return () => {
      window.removeEventListener('openPremiumPaywall', handleOpenPremiumPaywall);
    };
  }, []);

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
    return currentStreak;
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
    if (topicId) {
      navigate(`/practice/${subjectId}/${topicId}`);
    } else {
      navigate(`/subject/${subjectId}`);
    }
  };

  const getFirstName = () => {
    if (!user) return 'there';
    
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      const firstName = fullName.split(' ')[0];
      return firstName;
    }
    
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  };

  const handleNotificationAction = () => {
    if (notification?.subjectId) {
      navigate(`/subject/${notification.subjectId}`);
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
      {/* Celebration Components */}
      {showStreakCelebration && (
        <StreakCelebration
          isVisible={showStreakCelebration}
          streakDays={currentStreak}
          rewardText="Amazing streak!"
          rewardEmoji="🔥"
          onClose={() => setShowStreakCelebration(false)}
        />
      )}

      {showGradeCelebration && (
        <GradeCelebration
          isVisible={showGradeCelebration}
          grade={celebrationGrade}
          subject={celebrationSubject}
          onClose={() => setShowGradeCelebration(false)}
        />
      )}

      {showTimeSavedNotification && (
        <TimeSavedNotification
          timeSavedHours={timeSavedHours}
          show={showTimeSavedNotification}
          onClose={() => setShowTimeSavedNotification(false)}
        />
      )}

      {showDiscordInvitation && (
        <DiscordInvitation
          isVisible={showDiscordInvitation}
          onClose={() => setShowDiscordInvitation(false)}
        />
      )}

      {showPremiumPaywall && (
        <PremiumPaywall
          isOpen={showPremiumPaywall}
          onClose={() => setShowPremiumPaywall(false)}
          onUpgrade={() => {}}
        />
      )}

      {/* Header */}
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
        {/* Welcome Section */}
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

        {/* Premium Combined Streak & Rewards Card */}
        <div className="mb-6">
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-violet-50/60 to-cyan-50/60 dark:from-slate-900 dark:via-violet-950/30 dark:to-cyan-950/30 shadow-xl hover:shadow-2xl transition-all duration-500 group backdrop-blur-sm transform hover:scale-[1.01]">
            {/* Subtle glow effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400/15 via-cyan-400/15 to-emerald-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Premium border */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-cyan-500 to-emerald-500 rounded-xl p-[2px] group-hover:p-[3px] transition-all duration-300">
              <div className="bg-gradient-to-br from-white via-violet-50/60 to-cyan-50/60 dark:from-slate-900 dark:via-violet-950/30 dark:to-cyan-950/30 rounded-[10px] h-full w-full backdrop-blur-sm" />
            </div>
            
            {/* Subtle floating particles */}
            <div className="absolute top-3 right-4 w-1.5 h-1.5 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full animate-bounce opacity-70" />
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full animate-pulse opacity-60" />
            
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
                      {/* Subtle achievement ring */}
                      <div className="absolute inset-0 bg-orange-400/20 rounded-2xl animate-ping opacity-20" />
                      {/* Compact badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        <Crown className="h-2.5 w-2.5 text-white" />
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
                         <motion.div 
                           animate={{ scale: [1, 1.2, 1] }}
                           transition={{ duration: 2, repeat: Infinity }}
                           className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full animate-pulse" 
                         />
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
                      {/* Subtle achievement ring */}
                      <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-ping opacity-20" />
                      {/* Compact badge */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        <Sparkles className="h-2.5 w-2.5 text-white" />
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


        {/* Predicted GCSE Grades Section */}
        <PredictedGradesGraph userProgress={userProgress} />


        {/* Predicted 2026 Questions Section */}
        <PredictedQuestionsSection />

        {/* Revision Notebook - Premium Feature */}
        <div className="mb-8">
          
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
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                        AI Premium Feature
                      </span>
                    </div>
                    <p className="text-purple-600/80 dark:text-purple-300/80 mt-2 text-lg leading-relaxed">
                      Generate instant revision notes from past papers and your weak topics. Save hours of manual note-taking.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 px-4 py-2 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                    <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                      {timeSavedHours}h saved
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  className="h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 border-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/notebook');
                  }}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Notebook
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 font-semibold transform hover:scale-105 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Could add a quick generate action here
                    navigate('/notebook');
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Notes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Section */}
        <div id="subjects-section" className="mb-8">
          <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-primary" />
                  My Subjects
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent border border-border rounded-lg px-3 py-1 text-sm"
                    >
                      <option value="progress">By Progress</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="weakest">Weakest First</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="my-subjects">My Subjects ({userSubjects.length})</TabsTrigger>
                  <TabsTrigger value="all-subjects">All Subjects ({allSubjects.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="my-subjects" className="space-y-4">
                  {filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sortedSubjects.slice(0, 6).map((subject) => (
                        <SubjectCard
                          key={subject.id}
                          subject={{
                            ...subject,
                            color: getSubjectColor(subject.id)
                          }}
                          progress={userProgress.filter(p => p.subjectId === subject.id)}
                          onStartPractice={() => handlePractice(subject.id)}
                          onTogglePin={() => togglePinSubject(subject.id)}
                          onToggleUserSubject={() => toggleUserSubject(subject.id)}
                          isPinned={pinnedSubjects.includes(subject.id)}
                          isUserSubject={userSubjects.includes(subject.id)}
                          lastActivity={getLastActivity(subject.id)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No subjects selected</h3>
                      <p className="text-muted-foreground mb-4">Add subjects from the "All Subjects" tab to get started</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all-subjects" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allSubjects.map((subject) => (
                      <SubjectCard
                        key={subject.id}
                        subject={{
                          ...subject,
                          color: getSubjectColor(subject.id)
                        }}
                        progress={userProgress.filter(p => p.subjectId === subject.id)}
                        onStartPractice={() => handlePractice(subject.id)}
                        onTogglePin={() => togglePinSubject(subject.id)}
                        onToggleUserSubject={() => toggleUserSubject(subject.id)}
                        isPinned={pinnedSubjects.includes(subject.id)}
                        isUserSubject={userSubjects.includes(subject.id)}
                        lastActivity={getLastActivity(subject.id)}
                      />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics Section */}
        <WeakTopicsSection 
          weakTopics={weakTopics}
          userProgress={userProgress}
          onPractice={handlePractice}
        />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PredictivePerformanceCard userProgress={userProgress} />
          <OptimalStudyTimeCard />
          <AOBreakdown userProgress={userProgress} />
        </div>

        {/* Premium Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <PremiumAnalyticsCard
            title="Study Time Optimizer"
            description="AI-powered analysis of your optimal study times based on performance patterns"
            icon={Clock}
            gradient="from-blue-500 to-cyan-600"
          />
          <PremiumAnalyticsCard
            title="Weakness Predictor"
            description="Predict which topics you'll struggle with before you even start studying"
            icon={Brain}
            gradient="from-purple-500 to-pink-600"
          />
          <PremiumAnalyticsCard
            title="Grade Trajectory"
            description="See your predicted grade progression over time with personalized insights"
            icon={TrendingUp}
            gradient="from-green-500 to-emerald-600"
            comingSoon={true}
          />
        </div>

        {/* Goals and Topic Mastery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GoalsSection />
          <TopicMasteryDisplay />
        </div>
      </div>
    </div>
  );
};

export default DashboardDuplicate;