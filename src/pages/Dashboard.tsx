import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate, useSearchParams } from "react-router-dom";
import mentioraLogo from "@/assets/mentiora-logo.png";
import {
  BookOpen,
  Trophy,
  TrendingUp,
  ShoppingBag,
  User,
  MoreHorizontal,
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

  // Notebook state
  const [entries, setEntries] = useState<NotebookEntryData[]>([]);
  const [notebookLoading, setNotebookLoading] = useState(false);
  const [selectedNotebookSubject, setSelectedNotebookSubject] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  // Duolingo-style sidebar items with softer colors
  const sidebarItems = [
    { id: "learn", label: "LEARN", icon: Home, bgColor: "bg-sky-50", textColor: "text-sky-700", activeColor: "bg-sky-400" },
    { id: "leaderboards", label: "LEADERBOARDS", icon: Trophy, bgColor: "bg-yellow-50", textColor: "text-yellow-700", activeColor: "bg-yellow-400" },
    { id: "progress", label: "PROGRESS", icon: TrendingUp, bgColor: "bg-green-50", textColor: "text-green-700", activeColor: "bg-green-400" },
    { id: "quests", label: "QUESTS", icon: Star, bgColor: "bg-orange-50", textColor: "text-orange-700", activeColor: "bg-orange-400" },
    { id: "notes", label: "NOTES", icon: NotebookPen, bgColor: "bg-blue-50", textColor: "text-blue-700", activeColor: "bg-blue-400" },
    { id: "shop", label: "SHOP", icon: ShoppingBag, bgColor: "bg-red-50", textColor: "text-red-700", activeColor: "bg-red-400" },
    { id: "profile", label: "PROFILE", icon: User, bgColor: "bg-gray-50", textColor: "text-gray-700", activeColor: "bg-gray-400" },
    { id: "more", label: "MORE", icon: MoreHorizontal, bgColor: "bg-purple-50", textColor: "text-purple-700", activeColor: "bg-purple-400" },
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
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading predicted grades:', error);
        return;
      }

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
      const { MPPointsSystemClient } = await import('@/lib/mpPointsSystemClient');
      const stats = await MPPointsSystemClient.getUserStats(user.id);
      setUserStats(stats);
      setUserGems(stats.totalPoints);
      setCurrentStreak(stats.currentStreak);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const loadLeaderboardData = async () => {
    try {
      // Always include fake users regardless of real user data
      const weeklyFakeUsers = [
        { name: "Alex Chen", mp: 247, grade: 8.6, streak: 14, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Emma Wilson", mp: 215, grade: 8.2, streak: 12, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Liam Parker", mp: 188, grade: 7.9, streak: 9, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Sophia Lee", mp: 164, grade: 7.5, streak: 8, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "James Smith", mp: 142, grade: 6.8, streak: 5, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Maya Patel", mp: 127, grade: 6.5, streak: 4, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Oliver Brown", mp: 108, grade: 6.2, streak: 3, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Zoe Davis", mp: 95, grade: 6.0, streak: 2, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Ryan Kim", mp: 82, grade: 5.8, streak: 1, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Lucy Martinez", mp: 67, grade: 5.5, streak: 0, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
      ];

      // All-time fake users (higher MP values for all-time leaderboard)
      const allTimeFakeUsers = [
        { name: "Marcus Thompson", mp: 4247, grade: 9.0, streak: 127, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Sarah Chen", mp: 3815, grade: 8.9, streak: 98, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "David Rodriguez", mp: 3456, grade: 8.7, streak: 85, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Emily Zhang", mp: 3124, grade: 8.5, streak: 72, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Christopher Lee", mp: 2867, grade: 8.3, streak: 65, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Ashley Williams", mp: 2543, grade: 8.1, streak: 58, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Michael Chang", mp: 2298, grade: 7.9, streak: 51, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Jessica Taylor", mp: 2067, grade: 7.7, streak: 44, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Brandon Martinez", mp: 1854, grade: 7.5, streak: 37, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Isabella Garcia", mp: 1654, grade: 7.3, streak: 30, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
      ];

      // Try to fetch real users, but don't fail if it doesn't work
      let transformedRealUsers = [];
      try {
        const { data: realUsers, error } = await supabase
          .from('public_profiles')
          .select(`
            user_id,
            username,
            display_name,
            streak_days,
            user_points (total_points)
          `)
          .limit(50);

        if (!error && realUsers) {
          transformedRealUsers = realUsers
            .filter(user => user.user_points && Array.isArray(user.user_points) && user.user_points.length > 0)
            .map(user => ({
              name: user.display_name || user.username || 'Anonymous',
              mp: Array.isArray(user.user_points) ? (user.user_points[0] as any)?.total_points || 0 : 0,
              grade: Math.random() * 3 + 6,
              streak: user.streak_days || 0,
              isCurrentUser: false,
              isRealUser: true,
              leaderboardType: 'both'
            }));
        }
      } catch (realUserError) {
        console.log('Could not load real users, using fake users only');
      }

      // Combine all users - fake users are always included
      const allUsers = [...transformedRealUsers, ...weeklyFakeUsers, ...allTimeFakeUsers];
      
      console.log('All users loaded:', allUsers.length, allUsers);

      setLeaderboardData(allUsers);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Still set fake users even if there's an error
      const weeklyFakeUsers = [
        { name: "Alex Chen", mp: 247, grade: 8.6, streak: 14, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Emma Wilson", mp: 215, grade: 8.2, streak: 12, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
        { name: "Liam Parker", mp: 188, grade: 7.9, streak: 9, isCurrentUser: false, isRealUser: false, leaderboardType: 'weekly' },
      ];
      const allTimeFakeUsers = [
        { name: "Marcus Thompson", mp: 4247, grade: 9.0, streak: 127, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
        { name: "Sarah Chen", mp: 3815, grade: 8.9, streak: 98, isCurrentUser: false, isRealUser: false, leaderboardType: 'alltime' },
      ];
      setLeaderboardData([...weeklyFakeUsers, ...allTimeFakeUsers]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
      loadUserSubjects();
      loadUserProgress();
      loadLeaderboardData();
      if (activeTab === "notes") {
        loadNotebookEntries();
      }
    }
  }, [user?.id, activeTab]);

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
        loadLeaderboardData(); // Refresh leaderboard every 30 seconds for live updates
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
            <div>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Smart Revision Notebook
                  </span>
                </h2>
                <p className="text-xl text-gray-600 font-medium">
                  Instant notes for every lost mark
                </p>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-center space-x-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 block">Subject</label>
                    <Select value={selectedNotebookSubject} onValueChange={setSelectedNotebookSubject}>
                      <SelectTrigger className="w-44 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200">
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
                      <SelectTrigger className="w-44 bg-white border-gray-200 hover:border-blue-300 focus:border-blue-400 transition-all duration-200">
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
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
                  <p className="text-foreground font-medium text-lg">Loading your notes...</p>
                </div>
              ) : sortedEntries.length === 0 ? (
                <Card className="text-center py-16 bg-gradient-to-br from-white/80 to-slate-50/80 backdrop-blur-xl border border-slate-200/50 shadow-2xl">
                  <CardContent>
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center">
                      <NotebookPen className="h-10 w-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">No Revision Notes Yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                      Start practicing questions to generate your personalized Smart revision notes!
                    </p>
                    <Button 
                      onClick={() => setActiveTab("learn")} 
                      className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Start Practicing
                    </Button>
                  </CardContent>
                </Card>
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
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen -m-8 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Your Predicted Grades
                </h2>
                <p className="text-gray-600 text-lg">
                  See where you stand — and how to improve.
                </p>
              </div>

              {predictedGrades.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <TrendingUp className="h-16 w-16 text-purple-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    No predictions yet
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    Complete some practice to see your predicted grades
                  </p>
                  <Button
                    onClick={() => setActiveTab("learn")}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Practice
                  </Button>
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
                            Your average grade is {predictedGrades.length > 0 ? Math.round(predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) : 0}. Keep it up!
                          </h3>
                          <p className="text-gray-600">You're making great progress</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setActiveTab("learn")}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Start Practice
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
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusChip.color}`}>
                                      {statusChip.text}
                                    </span>
                                  </div>
                                  
                                  {/* Progress Bar */}
                                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                    <div
                                      className={`h-3 rounded-full ${getProgressColor(prediction.grade)} transition-all duration-700`}
                                      style={{ width: `${Math.min(prediction.percentage || 0, 100)}%` }}
                                    />
                                  </div>
                                  
                                  <p className="text-sm text-gray-600">
                                    {Math.round(prediction.percentage || 0)}% accuracy in practice
                                  </p>
                                </div>
                              </div>

                              {/* Large Grade Display */}
                              <div className="text-center ml-6">
                                <div className={`text-5xl font-bold ${getGradeColor(prediction.grade)} mb-1`}>
                                  {prediction.grade || '0'}
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
                     <div className="flex items-center space-x-1 text-green-500 text-sm font-medium">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       LIVE
                     </div>
                   </div>
                 </div>
               </div>

               {/* Stats Overview Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                             grade: predictedGrades.length > 0 ? Math.round((predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) * 10) / 10 : 0.0,
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
                 <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 text-center">
                   <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                     <TrendingUp className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-2xl font-bold text-gray-800">
                     {predictedGrades.length > 0 
                       ? Math.round((predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) * 10) / 10
                       : '0.0'
                     }
                   </div>
                   <div className="text-sm text-gray-600">Avg Grade</div>
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
                  <div className="grid grid-cols-5 gap-4 text-sm font-bold text-gray-600 uppercase tracking-wide mb-4 px-4">
                    <div className="text-left">Rank</div>
                    <div className="text-left">Student</div>
                    <div className="text-left">MP</div>
                    <div className="text-left">Avg Grade</div>
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
                            grade: predictedGrades.length > 0 ? Math.round((predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) * 10) / 10 : 0.0,
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

                       const getGradeColor = (grade: number) => {
                         if (grade === 0) return "text-gray-600 bg-gray-50";
                         if (grade >= 8) return "text-green-600 bg-green-50";
                         if (grade >= 7) return "text-blue-600 bg-blue-50";
                         if (grade >= 6) return "text-orange-600 bg-orange-50";
                         return "text-red-600 bg-red-50";
                       };

                      return (
                        <motion.div
                          key={player.rank}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`grid grid-cols-5 gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-colors ${
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

                            {/* Average Grade */}
                            <div>
                              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(player.grade)}`}>
                                {player.grade === 0 ? '0.0' : player.grade}
                              </span>
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

              {/* League Information */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Bronze League</h3>
                    <p className="text-gray-600">Top 3 advance to Silver League</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-3 mb-2">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full" style={{width: '60%'}}></div>
                </div>
                <p className="text-sm text-gray-600">
                  Earn more MP to climb the rankings! Complete topics and maintain your streak to move up.
                </p>
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
                    <span className="text-xl font-bold text-gray-800">{userGems} MP</span>
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
                        50 MP goal — {Math.min(userGems || 0, 50)}/50 completed
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-500">
                    {Math.round(((userGems || 0) / 50) * 100)}%
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-400 h-4 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min(((userGems || 0) / 50) * 100, 100)}%`}}
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
                      <div className={`w-12 h-12 ${userStats?.loginToday ? 'bg-green-100' : 'bg-gray-100'} rounded-2xl flex items-center justify-center`}>
                        <Check className={`w-6 h-6 ${userStats?.loginToday ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Log in today</h4>
                        <p className="text-gray-600">{userStats?.loginToday ? 'Complete ✓' : 'Log in to earn MP'}</p>
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
                        <p className="text-gray-600">
                          {userStats?.practiceToday ? 'Complete ✓' : 'Answer questions to earn MP'}
                        </p>
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
                <h3 className="text-lg font-bold text-gray-800">Weekly League</h3>
                <span className="text-blue-500 font-bold text-sm">VIEW LEAGUE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
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
                        className={`${userStats?.practiceToday ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full`} 
                        style={{width: userStats?.practiceToday ? '100%' : '0%'}}
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
