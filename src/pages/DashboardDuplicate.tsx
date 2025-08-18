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

  // Listen for premium paywall events
  useEffect(() => {
    const handleOpenPremiumPaywall = () => {
      setShowPremiumPaywall(true);
    };

    window.addEventListener('openPremiumPaywall', handleOpenPremiumPaywall);

    return () => {
      window.removeEventListener('openPremiumPaywall', handleOpenPremiumPaywall);
    };
  }, []);

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

  // Additional functions that are part of the original Dashboard.tsx file
  // These are assumed to be present in the original file and are included here fully

  const fetchCurrentStreak = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current streak:', error);
        return;
      }

      if (data) {
        // If streak is 7 or 14 days, show celebration
        if (data.current_streak === 7 || data.current_streak === 14) {
          const seen = await hasSeenStreakCelebration(data.current_streak);
          if (!seen) {
            setShowStreakCelebration(true);
            await markStreakCelebrationViewed(data.current_streak);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching current streak:', error);
    }
  };

  const checkAndUpdatePublicProfile = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking streak for public profile:', error);
        return;
      }

      if (data && data.current_streak >= 14) {
        // Check if user already has a public profile
        const { data: profileData, error: profileError } = await supabase
          .from('public_streak_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error checking public profile:', profileError);
          return;
        }

        if (!profileData) {
          // Create public profile
          await supabase
            .from('public_streak_profiles')
            .insert({
              user_id: user.id,
              streak_days: data.current_streak,
              created_at: new Date().toISOString()
            });
        }
      }
    } catch (error) {
      console.error('Error updating public profile:', error);
    }
  };

  // Render JSX for the dashboard duplicate
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard Duplicate</h1>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ColorThemeToggle />
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {showStreakCelebration && (
        <StreakCelebration onClose={() => setShowStreakCelebration(false)} />
      )}

      {showGradeCelebration && (
        <GradeCelebration
          grade={celebrationGrade}
          subject={celebrationSubject}
          onClose={() => setShowGradeCelebration(false)}
        />
      )}

      {showTimeSavedNotification && (
        <TimeSavedNotification hoursSaved={timeSavedHours} />
      )}

      {showDiscordInvitation && (
        <DiscordInvitation onClose={() => setShowDiscordInvitation(false)} />
      )}

      {showPremiumPaywall && (
        <PremiumPaywall onClose={() => setShowPremiumPaywall(false)} />
      )}

      <main className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressCard
              title="Overall Progress"
              value={`${Math.round(userProgress.reduce((acc, p) => acc + p.averageScore, 0) / (userProgress.length || 1))}%`}
              subtitle="Average score across all topics"
              progress={userProgress.length ? userProgress.reduce((acc, p) => acc + p.averageScore, 0) / userProgress.length : 0}
              icon={TrendingUp}
              color="bg-emerald-500"
              trend={5}
            />
            <ProgressCard
              title="Study Time"
              value={`${timeSavedHours} hrs saved`}
              subtitle="Estimated time saved by notes"
              icon={Clock}
              color="bg-blue-500"
            />
            <ProgressCard
              title="Streak"
              value="14 days"
              subtitle="Current study streak"
              icon={Flame}
              color="bg-red-500"
              trend={10}
            />
          </div>
        </section>

        <section>
          <Tabs value={subjectsTab} onValueChange={setSubjectsTab}>
            <TabsList>
              <TabsTrigger value="my-subjects">My Subjects</TabsTrigger>
              <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
            </TabsList>
            <TabsContent value="my-subjects">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {userSubjects.map(subjectId => (
                  <SubjectCard key={subjectId} subjectId={subjectId} pinned={pinnedSubjects.includes(subjectId)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="all-subjects">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {curriculum.map(subject => (
                  <SubjectCard key={subject.id} subjectId={subject.id} pinned={pinnedSubjects.includes(subject.id)} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section>
          <WeakTopicsSection weakTopics={weakTopics} />
        </section>

        <section>
          <AOBreakdown userProgress={userProgress} />
        </section>

        <section>
          <GoalsSection />
        </section>

        <section>
          <TopicMasteryDisplay userProgress={userProgress} />
        </section>

        <section>
          <PredictivePerformanceCard />
          <OptimalStudyTimeCard />
        </section>

        <section>
          <PredictedQuestionsSection />
          <PredictedGradesGraph />
        </section>

        <section>
          <PublicStreakProfiles />
        </section>

        <section>
          <StudyPlaylist />
        </section>
      </main>
    </div>
  );
};

export default DashboardDuplicate;
