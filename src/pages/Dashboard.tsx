import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { curriculum } from "@/data/curriculum";
import { useNavigate, useSearchParams } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  User,
  Home,
  Flame,
  Crown,
  Lock,
  Check,
  Zap,
  Heart,
  Gem,
  Atom,
  Calculator,
  FlaskConical,
  PenTool,
  Globe,
  Clock,
  Church,
  Building,
  Microscope,
  TestTube,
  Leaf,
  Dna,
  NotebookPen,
  Brain,
  Star,
  Filter,
  Calendar,
  Unlock,
  CreditCard,
  Trash2,
  Settings,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openManageBilling } from "@/lib/manageBilling";
import { NotebookEntry } from "@/components/notebook/NotebookEntry";
import { toast } from "sonner";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface NotebookEntryData {
  id: string;
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  question_label: string;
  confidence_level: string;
  what_tripped_up: string;
  fix_sentence: string;
  bulletproof_notes: string[];
  mini_example?: string;
  keywords: string[];
  spec_link: string;
  next_step_suggestion: string;
  skill_type: string;
  bloom_level: string;
  mark_loss: number;
  created_at: string;
}

const Dashboard = () => {
  const { user, logout, isPremium } = useAuth();
  const { openPaymentLink } = useSubscription();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("learn");
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [userMP, setUserMP] = useState(0);
  const [userHearts, setUserHearts] = useState(5);
  const [userGems, setUserGems] = useState(0);
  const [userSubjectsWithGrades, setUserSubjectsWithGrades] = useState<any[]>([]);
  const [predictedGrades, setPredictedGrades] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'weekly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [todayEarnedMP, setTodayEarnedMP] = useState(0);

  // Notebook state
  const [entries, setEntries] = useState<NotebookEntryData[]>([]);
  const [notebookLoading, setNotebookLoading] = useState(false);
  const [selectedNotebookSubject, setSelectedNotebookSubject] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  const sidebarItems = [
    { id: "learn", label: "LEARN", icon: Home, bgColor: "bg-sky-50", textColor: "text-sky-700", activeColor: "bg-sky-400" },
    { id: "leaderboards", label: "LEADERBOARDS", icon: Trophy, bgColor: "bg-yellow-50", textColor: "text-yellow-700", activeColor: "bg-yellow-400" },
    { id: "progress", label: "PROGRESS", icon: TrendingUp, bgColor: "bg-green-50", textColor: "text-green-700", activeColor: "bg-green-400" },
    { id: "quests", label: "QUESTS", icon: Star, bgColor: "bg-orange-50", textColor: "text-orange-700", activeColor: "bg-orange-400" },
    { id: "notes", label: "NOTES", icon: NotebookPen, bgColor: "bg-blue-50", textColor: "text-blue-700", activeColor: "bg-blue-400" },
    { id: "profile", label: "PROFILE", icon: User, bgColor: "bg-gray-50", textColor: "text-gray-700", activeColor: "bg-gray-400" },
  ];

  // Subject colors mapping (softer Duolingo-style)
  const subjectColors = {
    "physics": { bg: "bg-blue-400", light: "bg-blue-50", text: "text-blue-700" },
    "physics-edexcel": { bg: "bg-blue-400", light: "bg-blue-50", text: "text-blue-700" },
    "chemistry": { bg: "bg-green-400", light: "bg-green-50", text: "text-green-700" },
    "chemistry-edexcel": { bg: "bg-green-400", light: "bg-green-50", text: "text-green-700" },
    "biology": { bg: "bg-orange-400", light: "bg-orange-50", text: "text-orange-700" },
    "biology-edexcel": { bg: "bg-orange-400", light: "bg-orange-50", text: "text-orange-700" },
    "mathematics": { bg: "bg-purple-400", light: "bg-purple-50", text: "text-purple-700" },
    "maths-edexcel": { bg: "bg-purple-400", light: "bg-purple-50", text: "text-purple-700" },
    "english-language": { bg: "bg-pink-400", light: "bg-pink-50", text: "text-pink-700" },
    "english-literature": { bg: "bg-rose-400", light: "bg-rose-50", text: "text-rose-700" },
    "geography": { bg: "bg-emerald-400", light: "bg-emerald-50", text: "text-emerald-700" },
    "history": { bg: "bg-amber-400", light: "bg-amber-50", text: "text-amber-700" },
    "religious-studies": { bg: "bg-violet-400", light: "bg-violet-50", text: "text-violet-700" },
    "business-edexcel-igcse": { bg: "bg-teal-400", light: "bg-teal-50", text: "text-teal-700" },
  };

  // Subject icon mapping
  const getSubjectIcon = (subjectId: string) => {
    const iconMap: { [key: string]: any } = {
      "physics": Atom,
      "physics-edexcel": Atom,
      "chemistry": FlaskConical,
      "chemistry-edexcel": FlaskConical,
      "biology": Microscope,  
      "biology-edexcel": Microscope,
      "mathematics": Calculator,
      "maths-edexcel": Calculator,
      "english-language": PenTool,
      "english-literature": BookOpen,
      "geography": Globe,
      "geography-paper-2": Globe,
      "history": Clock,
      "religious-studies": Church,
      "business-edexcel-igcse": Building,
    };
    return iconMap[subjectId] || BookOpen;
  };

  // Map database subject_id to curriculum subject_id for consistent icons
  const mapDatabaseSubjectToCurriculum = (dbSubjectId: string) => {
    const subjectMapping: { [key: string]: string } = {
      "Mathematics": "maths-edexcel",
      "maths": "maths-edexcel", 
      "mathematics": "maths-edexcel",
      "Physics": "physics",
      "physics": "physics",
      "Chemistry": "chemistry-edexcel",
      "chemistry": "chemistry-edexcel",
      "Biology": "biology-edexcel", 
      "biology": "biology-edexcel",
      "English Language": "english-language",
      "english-language": "english-language",
      "English Literature": "english-literature", 
      "english-literature": "english-literature",
      "Geography": "geography",
      "geography": "geography",
      "History": "history",
      "history": "history",
      "Religious Studies": "religious-studies",
      "religious-studies": "religious-studies",
      "Business Studies": "business-edexcel-igcse",
      "business": "business-edexcel-igcse",
    };
    
    return subjectMapping[dbSubjectId] || dbSubjectId;
  };

  // Load user's selected subjects
  const loadUserSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("user_subjects")
        .select("subject_name, exam_board, predicted_grade, target_grade")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading user subjects:", error);
        return;
      }

      if (data) {
        // Store full subject data for progress tab
        setUserSubjectsWithGrades(data);
        
        // Load predicted grades
        loadPredictedGrades();
        
        const subjectIds = data
          .map((record) => {
            const examBoard = record.exam_board.toLowerCase();
            
            if (record.subject_name === "Physics" && examBoard === "aqa") return "physics";
            if (record.subject_name === "Physics" && examBoard === "edexcel") return "physics-edexcel";
            if (record.subject_name === "Mathematics") return "maths-edexcel";
            if (record.subject_name === "IGCSE Business") return "business-edexcel-igcse";
            if (record.subject_name === "Chemistry" && examBoard === "edexcel") return "chemistry-edexcel";

            const subject = curriculum.find(
              (s) => s.name.toLowerCase() === record.subject_name.toLowerCase()
            );
            return subject?.id;
          })
          .filter(Boolean) as string[];

        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error("Error loading user subjects:", error);
    }
  };

  // Load predicted grades from database
  const loadPredictedGrades = async () => {
    if (!user?.id) return;

    try {
      console.log('Loading predicted grades for user:', user.id);
      
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading predicted grades:', error);
        return;
      }

      console.log('Raw predicted exam completions data:', data);

      // Group by subject_id and get the latest prediction for each subject
      const latestGrades = data?.reduce((acc: any, grade: any) => {
        if (!acc[grade.subject_id] || new Date(grade.created_at) > new Date(acc[grade.subject_id].created_at)) {
          acc[grade.subject_id] = grade;
        }
        return acc;
      }, {});

      console.log('Predicted grades from DB:', Object.values(latestGrades || {}));
      console.log('User subjects from curriculum:', userSubjects);
      
      setPredictedGrades(Object.values(latestGrades || {}));
    } catch (error) {
      console.error('Error loading predicted grades:', error);
    }
  };

  // Load user progress
  const loadUserProgress = () => {
    if (!user?.id) return;

    const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  // Load notebook entries
  const loadNotebookEntries = async () => {
    if (!user?.id) return;

    try {
      setNotebookLoading(true);
      const { data, error } = await supabase
        .from('notebook_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notebook entries:', error);
        toast({
          title: "Error",
          description: "Failed to load notebook entries",
          variant: "destructive"
        });
        return;
      }

      setEntries(data || []);
    } catch (error) {
      console.error('Error loading notebook entries:', error);
      toast({
        title: "Error", 
        description: "Failed to load notebook entries",
        variant: "destructive"
      });
    } finally {
      setNotebookLoading(false);
    }
  };

  // Get topic completion status
  const getTopicStatus = (subjectId: string, topicIndex: number) => {
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return "available";
    
    const topic = subject.topics[topicIndex];
    if (!topic) return "available";

    const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topic.id);
    
    if (progress && progress.attempts > 0) {
      return progress.averageScore >= 85 ? "completed" : "active";
    }
    
    // All topics are always available (unlocked)
    return "available";
  };

  // Get subject progress
  const getSubjectProgress = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return { completed: 0, total: 0 };
    
    const completedTopics = subject.topics.filter(topic => {
      const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topic.id);
      return progress && progress.attempts > 0;
    }).length;
    
    return { completed: completedTopics, total: subject.topics.length };
  };

  const loadUserStats = async () => {
    if (!user?.id) return;
    
    try {
      console.log('Loading user stats for user:', user.id);
      
      const { MPPointsSystemClient } = await import('@/lib/mpPointsSystemClient');
      const stats = await MPPointsSystemClient.getUserStats(user.id);
      
      console.log('Loaded user stats:', stats);
      
      setUserStats(stats);
      setUserGems(stats.totalPoints);
      setCurrentStreak(stats.currentStreak);
      
      // Calculate today's earned MP
      await calculateTodayEarnedMP();
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateTodayEarnedMP = async () => {
    if (!user?.id) return;
    
    try {
      // Use user's timezone (default America/Los_Angeles as per requirements)
      const userTimezone = 'America/Los_Angeles';
      
      // Get current date in user's timezone
      const nowInTimezone = new Date().toLocaleString("en-US", { timeZone: userTimezone });
      const todayInTimezone = new Date(nowInTimezone);
      
      // Set to start of day in user's timezone
      const startOfDay = new Date(todayInTimezone);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Set to end of day in user's timezone  
      const endOfDay = new Date(todayInTimezone);
      endOfDay.setHours(23, 59, 59, 999);
      
      console.log('Calculating MP for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());
      
      // Get today's activities (using a broader time range to ensure we catch all activities)
      const { data: todayActivities, error } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString());
      
      console.log('Today\'s activities found:', todayActivities);
      
      if (error) {
        console.error('Error fetching activities:', error);
        throw error;
      }
      
      let earnedToday = 0;
      
      if (todayActivities && todayActivities.length > 0) {
        // Count different activity types and calculate MP according to rules
        const dailyLoginCount = todayActivities.filter(a => a.activity_type === 'daily_login').length;
        const practiceCompletions = todayActivities.filter(a => a.activity_type === 'practice_completed').length;
        const weeklyTopicsAwards = todayActivities.filter(a => a.activity_type === 'weekly_3_topics_awarded').length;
        const weeklyPracticeAwards = todayActivities.filter(a => a.activity_type === 'weekly_5_practice_awarded').length;
        const streakAwards = todayActivities.filter(a => a.activity_type === 'streak_7_days_awarded').length;
        
        console.log('Activity counts:', { dailyLoginCount, practiceCompletions, weeklyTopicsAwards, weeklyPracticeAwards, streakAwards });
        
        // Calculate MP earned today
        earnedToday = 
          (Math.min(dailyLoginCount, 1) * 10) +  // Max 1 daily login award per day
          (practiceCompletions * 40) +           // 40 MP per practice completion
          (weeklyTopicsAwards * 100) +           // 100 MP for weekly 3 topics bonus
          (weeklyPracticeAwards * 250) +         // 250 MP for weekly 5 practice challenge
          (streakAwards * 500);                  // 500 MP for 7-day streak
      }
      
      console.log('Total MP earned today:', earnedToday);
      setTodayEarnedMP(earnedToday);
    } catch (error) {
      console.error('Error calculating today\'s earned MP:', error);
      // Fallback to userStats calculation if database query fails
      if (userStats) {
        const fallbackMP = (userStats.loginToday ? 10 : 0) + (userStats.practiceToday ? 40 : 0);
        console.log('Using fallback MP calculation:', fallbackMP);
        setTodayEarnedMP(fallbackMP);
      } else {
        setTodayEarnedMP(0);
      }
    }
  };

  const loadLeaderboardData = async () => {
    try {
      // Get real users with their MP points and calculate retroactive MP for users without it
      const { data: allUsers, error: usersError } = await supabase
        .from('public_profiles')
        .select(`
          user_id,
          username,
          display_name,
          streak_days
        `);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        setLeaderboardData([]);
        return;
      }

      let transformedRealUsers = [];
      
      if (allUsers && allUsers.length > 0) {
        // Get user points for all users
        const userIds = allUsers.map(u => u.user_id);
        const { data: userPoints, error: pointsError } = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .in('user_id', userIds);

        const pointsMap = new Map((userPoints || []).map(p => [p.user_id, p.total_points]));

        // For users without MP points, calculate retroactive MP
        for (const user of allUsers) {
          let mp = pointsMap.get(user.user_id) || 0;
          
          // If user has no MP but has been active, calculate retroactive MP
          if (mp === 0) {
            try {
              const { data: retroMP } = await supabase.functions.invoke('calculate-retroactive-mp', {
                body: { user_id: user.user_id }
              });
              
              if (retroMP && !retroMP.error) {
                mp = retroMP.total_mp || 0;
                // Refresh points map for this user
                pointsMap.set(user.user_id, mp);
              }
            } catch (error) {
              console.log('Could not calculate retroactive MP for user:', user.user_id);
            }
          }

          // Only include users with MP > 0
          if (mp > 0) {
            transformedRealUsers.push({
              name: user.display_name || user.username || 'Anonymous',
              mp: mp,
              streak: user.streak_days || 0,
              isCurrentUser: user.user_id === (await supabase.auth.getUser()).data.user?.id,
              isRealUser: true,
              leaderboardType: 'both'
            });
          }
        }
      }

      // Sort by MP points
      transformedRealUsers.sort((a, b) => b.mp - a.mp);
      
      console.log('Real users loaded:', transformedRealUsers.length, transformedRealUsers);

      setLeaderboardData(transformedRealUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
      loadUserSubjects();
      loadUserProgress();
      loadLeaderboardData();
      loadPredictedGrades(); // Load predicted grades on user load
      if (activeTab === "notes") {
        loadNotebookEntries();
      }
      if (activeTab === "progress") {
        loadPredictedGrades(); // Refresh predicted grades when viewing progress tab
      }
    }
  }, [user?.id, activeTab]);

  // Force refresh when dashboard becomes visible to catch completed practice
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id && document.hasFocus()) {
        loadUserStats();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user?.id]);

  // Handle URL parameters for tab navigation
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
      window.scrollTo(0, 0); // Scroll to top when navigating via URL
    }
  }, [searchParams]);

  // Handle URL parameters for subject selection
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setSelectedSubject(subjectParam);
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        loadUserStats(); // Refresh stats every 30 seconds
        calculateTodayEarnedMP(); // Refresh today's earned MP
        loadLeaderboardData(); // Refresh leaderboard every 30 seconds for live updates
        loadPredictedGrades(); // Refresh predicted grades to catch new completions
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleTopicClick = (subjectId: string, topicId: string) => {
    navigate(`/practice/${subjectId}/${topicId}`);
  };

  const getFirstName = () => {
    if (!user) return "there";
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      return fullName.split(" ")[0];
    }
    return user.email?.split("@")[0] || "there";
  };

  const filteredSubjects = userSubjects.length > 0
    ? curriculum.filter((subject) => userSubjects.includes(subject.id))
    : [];

  // Notebook helper functions
  const filteredEntries = entries.filter(entry => {
    if (selectedNotebookSubject !== 'all' && entry.subject !== selectedNotebookSubject) return false;
    if (selectedConfidence !== 'all' && entry.confidence_level.toLowerCase() !== selectedConfidence) return false;
    return true;
  });

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      case 'subject':
        return a.subject.localeCompare(b.subject);
      case 'confidence':
        const confidenceOrder = { 'low': 0, 'medium': 1, 'high': 2 };
        return confidenceOrder[a.confidence_level.toLowerCase() as keyof typeof confidenceOrder] - 
               confidenceOrder[b.confidence_level.toLowerCase() as keyof typeof confidenceOrder];
      case 'marks':
        return b.mark_loss - a.mark_loss;
      default:
        const defaultDateA = new Date(a.created_at).getTime();
        const defaultDateB = new Date(b.created_at).getTime();
        return defaultDateB - defaultDateA;
    }
  });

  const getNotebookSubjects = () => {
    const subjects = Array.from(new Set(entries.map(entry => entry.subject)));
    return subjects;
  };

  const getNotebookStats = () => {
    const totalEntries = entries.length;
    const totalMarksLost = entries.reduce((sum, entry) => sum + entry.mark_loss, 0);
    const lowConfidence = entries.filter(entry => entry.confidence_level.toLowerCase() === 'low').length;
    const timeSavedMinutes = totalEntries * 15;
    const timeSavedHours = Math.round(timeSavedMinutes / 60 * 10) / 10;
    const subjects = getNotebookSubjects();

    return { totalEntries, totalMarksLost, lowConfidence, timeSavedHours, subjectsWithNotes: subjects.length };
  };

  const notebookStats = getNotebookStats();
  
  const BlurSpan = ({ children }: { children: React.ReactNode }) => (
    <span className={!isPremium ? "blur-sm" : ""}>{children}</span>
  );

  // Render topic nodes in Duolingo path style
  const renderTopicPath = (subject: any) => {
    const colors = subjectColors[subject.id] || subjectColors["physics"];
    
    return (
      <div className="flex flex-col items-center space-y-6 py-8">
        {subject.topics.map((topic: any, index: number) => {
          const status = getTopicStatus(subject.id, index);
          const isLocked = false; // All topics are now unlocked
          const isCompleted = status === "completed";
          const isActive = status === "active";
          const isAvailable = status === "available";

          return (
            <motion.div
              key={topic.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.button
                onClick={() => !isLocked && handleTopicClick(subject.id, topic.id)}
                disabled={isLocked}
                className={`relative w-20 h-20 rounded-full border-4 shadow-lg transition-all duration-200 ${
                  isCompleted 
                    ? `${colors.bg} border-yellow-400 shadow-yellow-200` 
                    : isActive
                    ? `${colors.bg} border-white shadow-lg`
                    : isAvailable
                    ? `bg-white ${colors.text} border-gray-300 hover:border-gray-400`
                    : "bg-gray-200 border-gray-300 cursor-not-allowed"
                } ${!isLocked ? 'hover:scale-105' : ''}`}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
              >
                {isLocked && (
                  <Lock className="h-8 w-8 text-gray-400 absolute inset-0 m-auto" />
                )}
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Crown className="h-4 w-4 text-yellow-700" />
                  </div>
                )}
                {(isActive || isAvailable) && !isCompleted && (
                  <div className={`h-8 w-8 ${isActive ? 'text-white' : colors.text} absolute inset-0 m-auto`}>
                    {(() => {
                      const IconComponent = getSubjectIcon(subject.id);
                      return <IconComponent className="h-full w-full" />;
                    })()}
                  </div>
                )}
              </motion.button>
              
              <div className="text-center mt-3">
                <p className={`text-sm font-bold ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                  {topic.name}
                </p>
              </div>

              {/* Connecting line to next topic */}
              {index < subject.topics.length - 1 && (
                <div className="h-8 w-1 bg-gray-300 my-2"></div>
              )}
            </motion.div>
          );
        })}
        
        {/* 2026 Exam Final Node(s) */}
        {subject.id === 'geography' ? (
          // Geography has two papers
          <div className="flex flex-col items-center mt-6 space-y-6">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: subject.topics.length * 0.1 }}
            >
              <motion.button
                onClick={() => navigate("/predicted-exam/geography")}
                className="relative w-24 h-24 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-8 w-8 text-white absolute inset-0 m-auto">
                  <Trophy className="h-full w-full" />
                </div>
              </motion.button>
              
              <div className="text-center mt-3">
                <p className="text-sm font-bold text-foreground">
                  Predicted 2026 Exam Paper 1
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (subject.topics.length * 0.1) + 0.1 }}
            >
              <motion.button
                onClick={() => navigate("/predicted-exam/geography-paper-2")}
                className="relative w-24 h-24 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-8 w-8 text-white absolute inset-0 m-auto">
                  <Trophy className="h-full w-full" />
                </div>
              </motion.button>
              
              <div className="text-center mt-3">
                <p className="text-sm font-bold text-foreground">
                  Predicted 2026 Exam Paper 2
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          // All other subjects have one exam
          <motion.div
            className="flex flex-col items-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: subject.topics.length * 0.1 }}
          >
            <motion.button
              onClick={() => navigate(`/predicted-exam/${subject.id}`)}
              className="relative w-24 h-24 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 text-white absolute inset-0 m-auto">
                <Trophy className="h-full w-full" />
              </div>
            </motion.button>
            
            <div className="text-center mt-3">
              <p className="text-sm font-bold text-foreground">
                Predicted 2026 Exam
              </p>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Duolingo Style */}
      <div className="w-64 bg-white border-r-2 border-gray-100 flex flex-col py-6">
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center space-x-3">
          <img src={mentioraLogo} alt="Mentiora Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-black">Mentiora</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-left transition-all duration-200 ${
                    isActive 
                      ? `${item.activeColor} text-white shadow-lg` 
                      : `${item.bgColor} ${item.textColor} hover:scale-105`
                  }`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.textColor}`} />
                  </div>
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pt-4 border-t border-gray-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Main Learning Area */}
        <div className="flex-1 p-8 max-w-4xl mx-auto">
          {activeTab === "learn" && (
            <div>
              {/* Header with stats */}
              <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Flame className="h-6 w-6 text-orange-400" />
                  <span className="text-xl font-bold text-orange-500">{currentStreak}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-blue-400" />
                  <span className="text-xl font-bold text-blue-500">{userGems}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gem className="h-6 w-6 text-cyan-400" />
                  <span className="text-xl font-bold text-cyan-500">{userGems}</span>
                </div>
              </div>
              </div>

              {/* Subject Selection or Subject Path */}
              {!selectedSubject ? (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Let's Smash GCSEs, {getFirstName()}!
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredSubjects.map((subject) => {
                      const colors = subjectColors[subject.id] || subjectColors["physics"];
                      const progress = getSubjectProgress(subject.id);
                      
                      return (
                        <motion.div
                          key={subject.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                            onClick={() => setSelectedSubject(subject.id)}
                          >
                            <CardContent className="p-8">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <span className={`text-xs font-bold ${colors.text} bg-gray-100 px-3 py-1 rounded-full`}>
                                      {progress.completed} OF {progress.total} UNITS
                                    </span>
                                  </div>
                                  
                                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {subject.name}
                                  </h3>
                                  
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                    <div
                                      className={`${colors.bg} h-3 rounded-full transition-all duration-500`}
                                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                                    />
                                  </div>

                                  <Button
                                    className={`${colors.bg} hover:opacity-90 text-white font-bold py-3 px-8 rounded-2xl text-lg shadow-lg`}
                                  >
                                    {progress.completed === 0 ? "START" : "CONTINUE"}
                                  </Button>
                                </div>

                                <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center ml-6`}>
                                  {(() => {
                                    const IconComponent = getSubjectIcon(subject.id);
                                    return <IconComponent className="h-10 w-10 text-white" />;
                                  })()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Subject Path View
                <div>
                  <div className="flex items-center mb-8">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedSubject(null)}
                      className="text-gray-600 hover:text-gray-800 mr-4"
                    >
                      ← Back
                    </Button>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {curriculum.find(s => s.id === selectedSubject)?.name}
                    </h2>
                  </div>

                  <div className="flex justify-center">
                    <div className="max-w-md">
                      {renderTopicPath(curriculum.find(s => s.id === selectedSubject))}
                    </div>
                  </div>
                </div>
              )}

              {/* No subjects message */}
              {filteredSubjects.length === 0 && !selectedSubject && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No subjects selected yet
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Add subjects to your list to get started with GCSE revision
                  </p>
                  <Button
                    onClick={() => navigate("/")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg"
                  >
                    Browse Subjects
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Notes tab with full notebook functionality */}
          {activeTab === "notes" && (
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 min-h-screen -m-8 p-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-lg">
                  <NotebookPen className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Smart Revision Notebook
                </h1>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  Instant notes for every lost mark
                </p>
              </div>

              {/* Filters */}
              <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-violet-100 p-6 mb-8">
                <div className="flex items-center justify-center space-x-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Subject</label>
                    <Select value={selectedNotebookSubject} onValueChange={setSelectedNotebookSubject}>
                      <SelectTrigger className="w-44 bg-white border-gray-200 hover:border-violet-300 focus:border-violet-400 transition-all duration-200">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getNotebookSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Confidence</label>
                    <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                      <SelectTrigger className="w-44 bg-white border-gray-200 hover:border-violet-300 focus:border-violet-400 transition-all duration-200">
                        <SelectValue placeholder="All Confidence" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="all">All Confidence</SelectItem>
                        <SelectItem value="low">Low Confidence</SelectItem>
                        <SelectItem value="medium">Medium Confidence</SelectItem>
                        <SelectItem value="high">High Confidence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Notebook Entries */}
              {notebookLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent mx-auto mb-6"></div>
                  <p className="text-gray-700 font-medium text-lg">Loading your notes...</p>
                </div>
              ) : sortedEntries.length === 0 ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="text-center py-16 px-8 border border-violet-100 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardContent className="space-y-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center shadow-lg">
                        <NotebookPen className="h-12 w-12 text-violet-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-900">
                          No revision notes yet
                        </h3>
                        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                          Start practicing questions to generate your personalized Smart revision notes!
                        </p>
                      </div>

                      <div className="pt-4">
                        <Button 
                          onClick={() => setActiveTab("learn")} 
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          Start Practicing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedEntries.map((entry, index) => (
                    <div key={entry.id} className="transform hover:scale-[1.02] transition-all duration-200">
                      <NotebookEntry entry={entry} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Progress tab */}
          {activeTab === "progress" && (
            <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen -m-8 p-8">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  Your Predicted Grades
                </h1>
                <p className="text-gray-600 text-lg max-w-md mx-auto">
                  See where you stand — and how to improve.
                </p>
              </div>

              {predictedGrades.length === 0 ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="text-center py-16 px-8 border border-blue-100 shadow-xl bg-white/90 backdrop-blur-sm">
                    <CardContent className="space-y-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
                        <Trophy className="h-12 w-12 text-blue-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-gray-900">
                          No predictions yet
                        </h3>
                        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed">
                          Complete some practice sessions to see your predicted grades
                        </p>
                      </div>

                        <div className="pt-4">
                          <Button
                            onClick={isPremium ? () => setActiveTab("learn") : openPaymentLink}
                            className={isPremium 
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                              : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                            }
                          >
                            {isPremium ? "Start Practice" : (
                              <div className="flex items-center space-x-2">
                                <Crown className="h-4 w-4" />
                                <span>Upgrade to Premium</span>
                              </div>
                            )}
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Overall Summary Card */}
                  <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            Your average grade is {isPremium ? (predictedGrades.length > 0 ? Math.round(predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) : 0) : (
                              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent blur-lg select-none">8</span>
                            )}. Keep it up!
                          </h3>
                          <p className="text-gray-600">You're making great progress</p>
                        </div>
                      </div>
                      <Button
                        onClick={isPremium ? () => setActiveTab("learn") : openPaymentLink}
                        className={isPremium 
                          ? "bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                        }
                      >
                        {isPremium ? "Start Practice" : (
                          <div className="flex items-center space-x-2">
                            <Crown className="h-4 w-4" />
                            <span>Upgrade to Premium</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Subject Cards */}
                  <div className="space-y-4">
                    {predictedGrades.map((prediction, index) => {
                      // Try to map the database subject to a curriculum subject for better icons/names
                      const mappedSubjectId = mapDatabaseSubjectToCurriculum(prediction.subject_id);
                      const curriculumSubject = curriculum.find(s => s.id === mappedSubjectId);
                      const subjectKey = mappedSubjectId;
                      const colors = subjectColors[subjectKey] || subjectColors["physics"];
                      const subjectName = curriculumSubject?.name || prediction.subject_id;
                      
                      const getGradeColor = (grade: string) => {
                        const gradeNum = parseInt(grade || '0');
                        if (gradeNum >= 7) return "text-green-600";
                        if (gradeNum >= 5) return "text-blue-600";
                        if (gradeNum >= 4) return "text-orange-600";
                        return "text-red-600";
                      };

                      const getProgressColor = (grade: string) => {
                        const gradeNum = parseInt(grade || '0');
                        if (gradeNum >= 7) return "bg-green-400";
                        if (gradeNum >= 5) return "bg-blue-400";
                        if (gradeNum >= 4) return "bg-orange-400";
                        return "bg-red-400";
                      };

                      const getStatusChip = (grade: string, percentage: number) => {
                        const gradeNum = parseInt(grade || '0');
                        if (gradeNum >= 7 && percentage >= 80) return { text: "On track", color: "bg-green-100 text-green-700" };
                        if (gradeNum >= 5 && percentage >= 70) return { text: "Improving", color: "bg-blue-100 text-blue-700" };
                        if (gradeNum >= 4) return { text: "Needs work", color: "bg-orange-100 text-orange-700" };
                        return { text: "Keep trying", color: "bg-red-100 text-red-700" };
                      };

                      const statusChip = getStatusChip(prediction.grade, prediction.percentage || 0);

                      return (
                        <motion.div
                          key={prediction.subject_id + '-' + index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-gray-100">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                {/* Subject Icon - Using mapped subject ID for consistency */}
                                <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center shadow-md`}>
                                  {(() => {
                                    const IconComponent = getSubjectIcon(subjectKey);
                                    return <IconComponent className="h-7 w-7 text-white" />;
                                  })()}
                                </div>

                                {/* Subject Info */}
                                <div className="flex-1">
                                   <div className="flex items-center space-x-3 mb-2">
                                     <h3 className="text-xl font-bold text-gray-800">
                                       {subjectName}
                                     </h3>
                                     {isPremium && (
                                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusChip.color}`}>
                                         {statusChip.text}
                                       </span>
                                     )}
                                   </div>
                                  
                                   {/* Progress Bar */}
                                   <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                     <div
                                       className={`h-3 rounded-full ${getProgressColor(prediction.grade)} transition-all duration-700`}
                                       style={{ width: isPremium ? `${Math.min(prediction.percentage || 0, 100)}%` : '0%' }}
                                     />
                                   </div>
                                  
                                  <p className="text-sm text-gray-600">
                                    {isPremium ? `${Math.round(prediction.percentage || 0)}% accuracy in practice` : (
                                      <span className="flex items-center">
                                        <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent blur-lg select-none">85</span>
                                        <span>% accuracy in practice</span>
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Large Grade Display */}
                              <div className="text-center ml-6">
                                <div className={`text-5xl font-bold ${getGradeColor(prediction.grade)} mb-1`}>
                                  {isPremium ? (prediction.grade || '0') : (
                                    <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent blur-lg select-none">8</span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                                  Predicted
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "leaderboards" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Leaderboards</h2>
                <p className="text-lg text-gray-600">See how you rank against other students</p>
              </div>

               {/* Leaderboard Tabs */}
               <div className="flex justify-center mb-8">
                 <div className="bg-white rounded-2xl p-2 shadow-lg border-2 border-gray-100">
                   <div className="flex items-center space-x-2">
                     <div className="flex space-x-2">
                       <Button 
                         className={activeLeaderboardTab === 'weekly' ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-2 px-4 rounded-xl" : "text-gray-600 font-bold py-2 px-4 rounded-xl"}
                         variant={activeLeaderboardTab === 'weekly' ? "default" : "ghost"}
                         onClick={() => setActiveLeaderboardTab('weekly')}
                       >
                         This Week
                       </Button>
                       <Button 
                         className={activeLeaderboardTab === 'alltime' ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-2 px-4 rounded-xl" : "text-gray-600 font-bold py-2 px-4 rounded-xl"}
                         variant={activeLeaderboardTab === 'alltime' ? "default" : "ghost"}
                         onClick={() => setActiveLeaderboardTab('alltime')}
                       >
                         All Time
                       </Button>
                     </div>
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 px-3 py-2 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-sm">
                        <div className="relative flex items-center">
                          {/* Main pulsing dot */}
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/30"></div>
                          {/* Expanding ring */}
                          <div className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                          {/* Secondary smaller dot */}
                          <div className="absolute w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce left-0.5 top-0.5"></div>
                        </div>
                        <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent animate-pulse">
                          LIVE
                        </span>
                        {/* Sparkle animation */}
                        <div className="flex space-x-0.5">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1 h-1 bg-green-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-1 bg-emerald-400 rounded-full animate-ping opacity-60" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                   </div>
                 </div>
               </div>

                {/* Stats Overview Cards */}
                <div className="flex justify-center mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
                 <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
                   <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                     <Trophy className="w-6 h-6 text-yellow-800" />
                   </div>
                   <div className="text-2xl font-bold text-gray-800">
                       #{(() => {
                          // Calculate user's rank from dynamic leaderboard
                          let players = leaderboardData.filter(p => {
                            // Real users appear in both leaderboards
                            if (p.isRealUser) return true;
                            
                            // Filter fake users based on leaderboard type
                            if (activeLeaderboardTab === 'weekly') {
                              return p.leaderboardType === 'weekly';
                            } else {
                              return p.leaderboardType === 'alltime';
                            }
                          });
                          
                          // Add current user if not present
                          const userExists = players.some(p => p.isCurrentUser);
                         if (!userExists && user) {
                            const currentUserData = {
                              name: getFirstName(),
                              mp: userGems,
                              streak: currentStreak,
                              isCurrentUser: true,
                              isRealUser: true
                            };
                           players.push(currentUserData);
                         }
                         
                         // Sort and find user rank
                         players.sort((a, b) => b.mp - a.mp);
                         const userRank = players.findIndex(p => p.isCurrentUser) + 1;
                         return userRank || players.length;
                      })()}
                   </div>
                   <div className="text-sm text-gray-600">Your Rank</div>
                 </div>
                 <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
                   <div className="w-12 h-12 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                     <Gem className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-2xl font-bold text-gray-800">{userGems}</div>
                   <div className="text-sm text-gray-600">Total MP</div>
                 </div>
                  </div>
                </div>

              {/* Main Leaderboard */}
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-4">
                  <h3 className="text-xl font-bold text-white">
                    {activeLeaderboardTab === 'weekly' ? 'Weekly League' : 'All Time League'}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Column Headers */}
                  <div className="grid grid-cols-4 gap-4 text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 px-4">
                    <div className="text-left">Rank</div>
                    <div className="text-left">Student</div>
                    <div className="text-left">MP</div>
                    <div className="text-left">Streak</div>
                  </div>

                    {/* Leaderboard Entries */}
                    <div className="space-y-2">
                      {(() => {
                        console.log('=== LEADERBOARD DEBUG START ===');
                        console.log('Full leaderboard data:', leaderboardData);
                        console.log('Active tab:', activeLeaderboardTab);
                        
                        // Filter users based on the active leaderboard tab
                        let players = leaderboardData.filter(p => {
                          console.log('Checking player:', p.name, 'isRealUser:', p.isRealUser, 'leaderboardType:', p.leaderboardType);
                          
                          // Real users appear in both leaderboards
                          if (p.isRealUser) {
                            console.log('Including real user:', p.name);
                            return true;
                          }
                          
                          // Filter fake users based on leaderboard type
                          if (activeLeaderboardTab === 'weekly') {
                            const include = p.leaderboardType === 'weekly';
                            console.log('Weekly tab - including', p.name, '?', include);
                            return include;
                          } else {
                            const include = p.leaderboardType === 'alltime';
                            console.log('All-time tab - including', p.name, '?', include);
                            return include;
                          }
                        });
                        
                        console.log('Filtered players:', players);
                        
                        // Add current user to the leaderboard if not already present
                        const userExists = players.some(p => p.isCurrentUser);
                        console.log('User exists in leaderboard:', userExists);
                        if (!userExists && user) {
                           const currentUserData = {
                             name: getFirstName(),
                             mp: userGems,
                             streak: currentStreak,
                             isCurrentUser: true,
                             isRealUser: true,
                             leaderboardType: 'both'
                           };
                          console.log('Adding current user:', currentUserData);
                          players.push(currentUserData);
                        }
                        
                        // Sort players by MP (highest first) - this allows real users to overtake fake users
                        players.sort((a, b) => b.mp - a.mp);
                        
                        // Add rank to each player
                        const rankedPlayers = players.map((player, index) => ({
                          ...player,
                          rank: index + 1
                        }));
                        
                        // Show top 15 players
                        const displayPlayers = rankedPlayers.slice(0, 15);
                        
                        console.log('Final display players:', displayPlayers);
                        console.log('=== LEADERBOARD DEBUG END ===');

                        return displayPlayers;
                     })().map((player, index) => {
                      const getRankIcon = (rank: number) => {
                        if (rank === 1) return "🥇";
                        if (rank === 2) return "🥈";
                        if (rank === 3) return "🥉";
                        return null;
                      };


                      return (
                        <motion.div
                          key={player.rank}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`grid grid-cols-4 gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-colors ${
                            player.isCurrentUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-25'
                          }`}
                        >
                          {/* Rank */}
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getRankIcon(player.rank)}</span>
                            <span className={`text-lg font-bold ${player.isCurrentUser ? 'text-blue-600' : 'text-gray-700'}`}>
                              #{player.rank}
                            </span>
                          </div>

                          {/* Student Name */}
                          <div className={`font-bold text-left ${player.isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                            {player.name}
                            {player.isCurrentUser && (
                              <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs">You</Badge>
                            )}
                          </div>

                          {/* MP */}
                          <div className="flex items-center space-x-1">
                            <Gem className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-gray-800">{player.mp.toLocaleString()}</span>
                          </div>

                          {/* Streak */}
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="font-bold text-gray-800">{player.streak}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab !== "learn" && activeTab !== "notes" && activeTab !== "progress" && activeTab !== "profile" && activeTab !== "quests" && activeTab !== "leaderboards" && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
                {activeTab}
              </h2>
              <p className="text-lg text-gray-600">
                Coming soon! This feature is being developed.
              </p>
            </div>
          )}

          {activeTab === "quests" && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Quests</h2>
                <div className="flex items-center space-x-6">
                  {/* MP Balance */}
                  <div className="flex items-center space-x-2 bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-gray-100">
                    <Gem className="h-6 w-6 text-cyan-400" />
                    <span className="text-xl font-bold text-gray-800" data-mp-counter>{userGems} MP</span>
                  </div>
                  {/* Streak Chip */}
                  <div className="flex items-center space-x-2 bg-white rounded-2xl px-6 py-3 shadow-lg border-2 border-gray-100">
                    <Flame className="h-6 w-6 text-orange-400" />
                    <span className="text-lg font-bold text-gray-800">{currentStreak} days in a row</span>
                  </div>
                </div>
              </div>

              {/* Daily Goal Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Daily Goal</h3>
                       <p className="text-gray-600">
                         50 MP goal — {Math.min(todayEarnedMP, 50)}/50 completed
                       </p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-400 h-4 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min(todayEarnedMP / 50 * 100, 100)}%`}}
                  ></div>
                </div>
              </div>

              {/* Daily Quests */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Today's Quests</h3>
                
                 {/* Quest 1 - Login */}
                 <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                         <Check className="w-6 h-6 text-green-600" />
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-gray-800">Log in today</h4>
                         <p className="text-gray-600">Log in to earn MP</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className="text-lg font-bold text-green-600">+10 MP</span>
                       {userStats?.loginToday && (
                         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                           <Check className="w-4 h-4 text-white" />
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="mt-4">
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className={`${(todayEarnedMP >= 10) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                         style={{width: (todayEarnedMP >= 10) ? '100%' : '20%'}}
                       ></div>
                     </div>
                   </div>
                 </div>

                 {/* Quest 2 - Practice */}
                 <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <div className={`w-12 h-12 ${userStats?.practiceToday ? 'bg-green-100' : 'bg-blue-400'} rounded-2xl flex items-center justify-center`}>
                         {userStats?.practiceToday ? (
                           <Check className="w-6 h-6 text-green-600" />
                         ) : (
                           <BookOpen className="w-6 h-6 text-white" />
                         )}
                       </div>
                       <div>
                         <h4 className="text-lg font-bold text-gray-800">Complete 1 practice set</h4>
                          <p className="text-gray-600">Answer questions to earn MP</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-2">
                       <span className={`text-lg font-bold ${userStats?.practiceToday ? 'text-green-600' : 'text-blue-500'}`}>
                         +40 MP
                       </span>
                       {userStats?.practiceToday && (
                         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                           <Check className="w-4 h-4 text-white" />
                         </div>
                       )}
                     </div>
                   </div>
                   <div className="mt-4">
                     <div className="w-full bg-gray-200 rounded-full h-2">
                       <div 
                         className={`${(todayEarnedMP >= 40) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                         style={{width: (todayEarnedMP >= 40) ? '100%' : '20%'}}
                       ></div>
                     </div>
                   </div>
                 </div>

                {/* Quest 3 - Bonus Weekly */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Bonus: Do 3 topics</h4>
                        <p className="text-gray-600">
                          Weekly challenge — {Math.min(userStats?.weeklyTopicsCount || 0, 3)}/3 completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-purple-500">+100 MP</span>
                      {(userStats?.weeklyTopicsCount || 0) >= 3 && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-400 h-2 rounded-full" 
                        style={{width: `${Math.min(((userStats?.weeklyTopicsCount || 0) / 3) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Quests */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">This Week's Challenges</h3>
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Complete 5 practice sets</h4>
                        <p className="text-gray-600">
                          {Math.min(userStats?.weeklyPracticeCount || 0, 5)}/5 completed this week
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-orange-500">+250 MP</span>
                      {(userStats?.weeklyPracticeCount || 0) >= 5 && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-orange-400 h-3 rounded-full" 
                        style={{width: `${Math.min(((userStats?.weeklyPracticeCount || 0) / 5) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Maintain 7-day streak</h4>
                        <p className="text-gray-600">
                          {Math.min(userStats?.currentStreak || 0, 7)}/7 days completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-500">+500 MP</span>
                      {(userStats?.currentStreak || 0) >= 7 && (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-400 h-3 rounded-full" 
                        style={{width: `${Math.min(((userStats?.currentStreak || 0) / 7) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Weekly Leaderboard</h3>
                      <p className="text-gray-600">You're ranked #5 this week</p>
                    </div>
                  </div>
                  <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-3 px-6 rounded-2xl">
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Profile Settings
              </h2>

              {/* Account Information Card */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Account Information
                    </h3>
                    <p className="text-gray-600">Your account details and status</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
                    <p className="text-lg font-bold text-gray-800">{user?.email}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Account Type</p>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-blue-500" />
                      <p className="text-lg font-bold text-gray-800">
                        {isPremium ? "Premium Account" : "Free Account"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Management Card - Only for Premium Users */}
              {isPremium && (
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Billing Management
                      </h3>
                      <p className="text-gray-600">Manage your subscription and billing</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg bg-green-50 border border-green-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <Crown className="w-5 h-5 text-green-500" />
                          Premium Subscription
                        </h4>
                        <p className="text-gray-600 max-w-lg">
                          Access your Stripe billing portal to manage your subscription, update payment methods, 
                          view invoices, and modify your plan.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={openManageBilling}
                        className="ml-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-2xl"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Manage Billing
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Danger Zone</h3>
                    <p className="text-gray-600">Permanent actions that cannot be undone</p>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-gray-800">Delete Account</h4>
                      <p className="text-gray-600 max-w-lg">
                        Permanently delete your account and all associated data. This action cannot be undone. 
                        All your progress, notes, and achievements will be lost forever.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="destructive" 
                      className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-2xl"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Premium & Stats */}
        <div className="w-80 bg-gray-50 p-6 space-y-6">
          {/* Premium Card */}
          <Card className="border-0 bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-white/20 rounded-lg p-2">
                  <Crown className="h-6 w-6" />
                </div>
                <span className="font-bold text-lg">Go Premium</span>
              </div>
              <p className="text-white/90 mb-4">
                Unlock exclusive study features and advanced analytics!
              </p>
              <Button 
                className="w-full bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 rounded-2xl"
                onClick={() => navigate("/pricing")}
              >
                UPGRADE TO PREMIUM
              </Button>
            </CardContent>
          </Card>

          {/* League Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Leaderboards</h3>
                <button 
                  className="text-blue-500 font-bold text-sm hover:text-blue-600 cursor-pointer"
                  onClick={() => setActiveTab("leaderboards")}
                >
                  VIEW LEAGUE
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Complete a lesson to join this week's leaderboard and compete against other learners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Quests */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Daily Quests</h3>
                <button 
                  className="text-blue-500 font-bold text-sm hover:text-blue-600 cursor-pointer"
                  onClick={() => setActiveTab("quests")}
                >
                  VIEW ALL
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${userStats?.practiceToday ? 'bg-green-100' : 'bg-blue-400'} rounded-lg flex items-center justify-center`}>
                    {userStats?.practiceToday ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">Complete 1 practice set</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${(userStats?.practiceToday || userStats?.weeklyPracticeCount > 0) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                        style={{width: (userStats?.practiceToday || userStats?.weeklyPracticeCount > 0) ? '100%' : '20%'}}
                      ></div>
                    </div>
                  </div>
                  <div className={`${userStats?.practiceToday ? 'bg-green-50' : 'bg-blue-50'} rounded-lg p-2`}>
                    <span className={`text-xs font-bold ${userStats?.practiceToday ? 'text-green-600' : 'text-blue-600'}`}>
                      {userStats?.practiceToday ? '+40 MP' : '40 MP'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
