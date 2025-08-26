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

  // Force premium dashboard always - prevent any redirects to regular dashboard
  useEffect(() => {
    localStorage.setItem('mentiora_dashboard_mode', 'premium');
    localStorage.setItem('mentiora_preferred_dashboard', '/premium-dashboard');
    localStorage.setItem('mentiora_return_to', 'premium-dashboard');
    localStorage.setItem('mentiora_premium_context', 'true');
    
    // FORCE PREMIUM STATUS - ensure premium dashboard never shows free account
    const forcePremiumStatus = () => {
      // Find ALL elements that might show "Free Account" and aggressively override them
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el.textContent?.includes('Free Account')) {
          console.log('FORCING Premium Active override on element:', el);
          // Replace the text content while preserving other elements
          if (el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
            el.textContent = el.textContent.replace('Free Account', 'Premium Active');
          } else {
            // Handle elements with mixed content
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Free Account')) {
                node.textContent = node.textContent.replace('Free Account', 'Premium Active');
              }
            });
          }
        }
      });
      
      // Also specifically target common selectors that might show premium status
      const statusSelectors = [
        '.text-xs.font-medium',
        '[data-premium-status]',
        'span[class*="text-xs"]',
        'div[class*="flex"][class*="items-center"] span'
      ];
      
      statusSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el.textContent?.includes('Free Account')) {
            console.log('Forcing Premium Active via selector:', selector, el);
            el.textContent = el.textContent.replace('Free Account', 'Premium Active');
          }
        });
      });
    };

    // Set up MutationObserver to watch for ANY DOM changes and immediately fix them
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Check if any new nodes contain "Free Account"
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes('Free Account')) {
              console.log('MutationObserver: Replacing Free Account in text node');
              node.textContent = node.textContent.replace('Free Account', 'Premium Active');
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              // Check all descendants of the added element
              const element = node as Element;
              if (element.textContent?.includes('Free Account')) {
                console.log('MutationObserver: Replacing Free Account in added element');
                forcePremiumStatus();
              }
            }
          });
          
          // Check if the target node itself now contains "Free Account"
          if (mutation.target.textContent?.includes('Free Account')) {
            console.log('MutationObserver: Target node contains Free Account, fixing...');
            forcePremiumStatus();
          }
        }
      });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true
    });

    // Continuously check and redirect if needed
    const checkAndRedirect = () => {
      if (window.location.pathname === '/dashboard') {
        console.log('Detected redirect to regular dashboard, forcing back to premium');
        navigate('/premium-dashboard', { replace: true });
      }
      forcePremiumStatus(); // Also force premium status on every check
    };

    // Set up multiple listeners to catch any navigation attempts
    const handleFocus = () => checkAndRedirect();
    const handleVisibilityChange = () => {
      if (!document.hidden) checkAndRedirect();
    };
    const handlePopState = () => {
      setTimeout(checkAndRedirect, 50);
    };

    // Override browser navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(state, title, url) {
      if (url === '/dashboard' || url?.toString().endsWith('/dashboard')) {
        console.log('Intercepted navigation to dashboard, redirecting to premium');
        return originalPushState.call(this, state, title, '/premium-dashboard');
      }
      return originalPushState.call(this, state, title, url);
    };
    
    history.replaceState = function(state, title, url) {
      if (url === '/dashboard' || url?.toString().endsWith('/dashboard')) {
        console.log('Intercepted replaceState to dashboard, redirecting to premium');
        return originalReplaceState.call(this, state, title, '/premium-dashboard');
      }
      return originalReplaceState.call(this, state, title, url);
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handlePopState);
    
    // Check immediately and periodically
    checkAndRedirect();
    const interval = setInterval(checkAndRedirect, 1000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handlePopState);
      clearInterval(interval);
      observer.disconnect(); // Clean up MutationObserver
      
      // Restore original functions
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [navigate]);

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
    // Set flag to indicate user is on premium dashboard
    localStorage.setItem('mentiora_dashboard_mode', 'premium');
    localStorage.setItem('mentiora_preferred_dashboard', '/premium-dashboard');
    
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

    // Cleanup function to maintain premium dashboard preference
    return () => {
      // Keep the premium dashboard preference even when component unmounts
      localStorage.setItem('mentiora_dashboard_mode', 'premium');
      localStorage.setItem('mentiora_preferred_dashboard', '/premium-dashboard');
    };
    
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

  const recordActivity = async () => {
    // Simplified for premium dashboard
    return;
  };

  const getStudyStreak = (): number => {
    if (!user?.id) return 0;
    
    // Get streak from localStorage for immediate access
    const savedStreak = localStorage.getItem(`mentiora_streak_${user.id}`);
    if (savedStreak) {
      const streak = parseInt(savedStreak);
      return isNaN(streak) ? 0 : streak;
    }
    
    return 0;
  };

  const getOverallProgress = (): number => {
    if (userProgress.length === 0) return 0;
    const total = userProgress.reduce((sum, progress) => sum + progress.averageScore, 0);
    return Math.round(total / userProgress.length);
  };

  const getMasteredTopics = (): string => {
    const mastered = userProgress.filter(p => p.averageScore >= 85).length;
    return mastered.toString();
  };

  const getSubjectProgress = (subjectId: string): number => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    const total = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(total / subjectProgress.length);
  };

  const getLastActivity = (subjectId: string): Date | null => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return null;
    
    const lastActivity = subjectProgress.reduce((latest, current) => {
      return new Date(current.lastAttempt) > new Date(latest.lastAttempt) ? current : latest;
    });
    
    return lastActivity.lastAttempt;
  };

  const getSubjectColor = (subjectId: string): string => {
    const colors = {
      'physics': 'from-blue-400 to-blue-600',
      'chemistry': 'from-green-400 to-green-600',
      'biology': 'from-emerald-400 to-emerald-600',
      'maths': 'from-purple-400 to-purple-600',
      'english': 'from-red-400 to-red-600',
      'history': 'from-amber-400 to-amber-600',
      'geography': 'from-teal-400 to-teal-600',
      'computer-science': 'from-indigo-400 to-indigo-600',
      'business': 'from-orange-400 to-orange-600',
      'economics': 'from-cyan-400 to-cyan-600',
      'psychology': 'from-pink-400 to-pink-600',
      'sociology': 'from-rose-400 to-rose-600',
      'art': 'from-violet-400 to-violet-600',
      'music': 'from-fuchsia-400 to-fuchsia-600',
      'pe': 'from-lime-400 to-lime-600',
      'spanish': 'from-yellow-400 to-yellow-600',
      'french': 'from-sky-400 to-sky-600',
      'german': 'from-slate-400 to-slate-600',
      'maths-edexcel': 'from-purple-400 to-purple-600',
      'business-edexcel-igcse': 'from-orange-400 to-orange-600',
      'chemistry-edexcel': 'from-green-400 to-green-600',
      'physics-edexcel': 'from-blue-400 to-blue-600',
    };
    return colors[subjectId as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const allSubjects = curriculum;
  const filteredSubjects = allSubjects;

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
    // Clear premium dashboard preference on logout
    localStorage.removeItem('mentiora_dashboard_mode');
    localStorage.removeItem('mentiora_preferred_dashboard');
    localStorage.removeItem('mentiora_return_to');
    logout();
    navigate('/');
  };

  const handlePractice = async (subjectId: string, topicId?: string) => {
    await recordActivity();
    // Ensure premium dashboard context is preserved
    localStorage.setItem('mentiora_dashboard_mode', 'premium');
    localStorage.setItem('mentiora_preferred_dashboard', '/premium-dashboard');
    localStorage.setItem('mentiora_return_to', 'premium-dashboard');
    if (topicId) {
      navigate(`/practice/${subjectId}/${topicId}`, { 
        state: { 
          from: 'premium-dashboard', 
          returnTo: 'premium-dashboard',
          dashboardMode: 'premium' 
        } 
      });
    } else {
      navigate(`/subject/${subjectId}`, { 
        state: { 
          from: 'premium-dashboard', 
          returnTo: 'premium-dashboard',
          dashboardMode: 'premium' 
        } 
      });
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
    // Preserve premium dashboard context
    localStorage.setItem('mentiora_return_to', 'premium-dashboard');
    if (notification.type === "weak-topic-recommendation" && notification.subjectId) {
      navigate(`/subject/${notification.subjectId}`, { state: { from: 'premium-dashboard', returnTo: 'premium-dashboard' } });
    } else if (notification.type === "exam-recommendation" && notification.subjectId) {
      navigate('/predicted-questions', { state: { from: 'premium-dashboard', returnTo: 'premium-dashboard' } });
    } else if (notification.type === "study-recommendation") {
      navigate('/predicted-questions', { state: { from: 'premium-dashboard', returnTo: 'premium-dashboard' } });
    }
  };

  const toggleUserSubject = async (subjectId: string) => {
    if (!user?.id) return;

    try {
      if (userSubjects.includes(subjectId)) {
        // Remove subject
        const subject = curriculum.find(s => s.id === subjectId);
        if (!subject) return;

        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', subject.name.replace(' (Edexcel)', '').replace(' (Edexcel IGCSE)', ''));

        setUserSubjects(prev => prev.filter(id => id !== subjectId));
      } else {
        // Add subject
        const subject = curriculum.find(s => s.id === subjectId);
        if (!subject) return;

        let subjectName = subject.name;
        const examBoard = selectedExamBoard.toUpperCase();

        // Clean up subject names for database
        if (subjectId === 'maths-edexcel') {
          subjectName = 'Mathematics';
        } else if (subjectId === 'business-edexcel-igcse') {
          subjectName = 'IGCSE Business';
        } else if (subjectId === 'chemistry-edexcel') {
          subjectName = 'Chemistry';
        } else if (subjectId === 'physics-edexcel') {
          subjectName = 'Physics';
        } else {
          subjectName = subject.name.replace(' (Edexcel)', '').replace(' (Edexcel IGCSE)', '');
        }

        console.log('Would add subject:', subjectName, examBoard);

        setUserSubjects(prev => [...prev, subjectId]);
      }
    } catch (error) {
      console.error('Error toggling user subject:', error);
    }
  };

  const handlePhysicsToggle = async () => {
    const subjectId = selectedExamBoard === 'edexcel' ? 'physics-edexcel' : 'physics';
    
    if (!user?.id) return;

    try {
      if (userSubjects.includes(subjectId)) {
        // Remove subject
        const { error } = await supabase
          .from('user_subjects')
          .delete()
          .eq('user_id', user.id)
          .eq('subject_name', 'Physics')
          .eq('exam_board', selectedExamBoard.toUpperCase());

        setUserSubjects(prev => prev.filter(id => id !== subjectId));
      } else {
        // Add Physics AQA as default
        console.log('Would add Physics AQA');

        setUserSubjects(prev => [...prev, subjectId]);
      }
    } catch (error) {
      console.error('Error toggling Physics:', error);
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
                    <span className="text-xs font-medium text-muted-foreground">
                      {/* FORCED PREMIUM STATUS - NEVER SHOWS FREE ACCOUNT ON PREMIUM DASHBOARD */}
                      Premium Active
                    </span>
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
              
              <Button variant="ghost" onClick={() => {
                localStorage.setItem('mentiora_return_to', 'premium-dashboard');
                navigate('/settings', { state: { from: 'premium-dashboard', returnTo: 'premium-dashboard' } });
              }} className="text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors">
                <Settings className="h-4 w-4" />
              </Button>
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
                              Color Themes
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

                    {/* Study Playlist - 7 days */}
                    <div className={`p-3 rounded-xl border transition-all duration-300 ${getStudyStreak() >= 7 ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-400/30 shadow-sm' : 'bg-gray-100/30 dark:bg-gray-800/30 border-gray-300/50 dark:border-gray-600/50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${getStudyStreak() >= 7 ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-sm' : 'bg-gray-400'}`}>
                            <Sparkles className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${getStudyStreak() >= 7 ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-500'}`}>
                              Study Playlist
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
        <div style={{
          position: 'relative'
        }} onClickCapture={(e) => {
          // Intercept any navigation from predicted questions section
          const target = e.target as HTMLElement;
          if (target.closest('button') && target.textContent?.includes('Start Premium Exam Practice')) {
            localStorage.setItem('mentiora_dashboard_mode', 'premium');
            localStorage.setItem('mentiora_preferred_dashboard', '/premium-dashboard');
            localStorage.setItem('mentiora_return_to', 'premium-dashboard');
            localStorage.setItem('mentiora_premium_context', 'true');
          }
        }}>
          <PredictedQuestionsSection />
        </div>

        {/* Revision Notebook - Premium Feature */}
        <div className="mb-8">
          
          {/* Revision Notebook - Premium Feature */}
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-950/20 dark:to-indigo-950/30 shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02]" onClick={() => {
            localStorage.setItem('mentiora_return_to', 'premium-dashboard');
            navigate('/notebook', { state: { from: 'premium-dashboard', returnTo: 'premium-dashboard' } });
          }}>
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
        <div className="mb-8" id="subjects-section">
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
              All Subjects (14)
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