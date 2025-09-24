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
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav, MobileNavItem } from "@/components/ui/mobile-nav";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Edit3,
  Settings,
  Plus,
  X,
  Eye,
  Play,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openManageBilling } from "@/lib/manageBilling";
import { NotebookEntry } from "@/components/notebook/NotebookEntry";
import { FlashcardCreator } from "@/components/flashcards/FlashcardCreator";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { toast } from "sonner";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  subject_id: string;
  exam_board: string;
  flashcards: Flashcard[];
  created_at: string;
  card_count: number;
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
  const [showAddSubjects, setShowAddSubjects] = useState(false);
  const isMobile = useIsMobile();

  const [entries, setEntries] = useState<NotebookEntryData[]>([]);
  const [notebookLoading, setNotebookLoading] = useState(false);
  const [selectedNotebookSubject, setSelectedNotebookSubject] = useState<string>('all');
  const [selectedConfidence, setSelectedConfidence] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  // Flashcards state
  const [flashcardView, setFlashcardView] = useState<"create" | "library" | "cards">("create");
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [flashcardsLoading, setFlashcardsLoading] = useState(false);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [viewMode, setViewMode] = useState<"flashcards" | "learn" | null>(null);
  const [individualFlashcards, setIndividualFlashcards] = useState<any[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingCardData, setEditingCardData] = useState<{ front: string; back: string }>({ front: '', back: '' });

  const sidebarItems = [
    { id: "learn", label: "LEARN", icon: Home, bgColor: "bg-sky-50 dark:bg-sky-900/20", textColor: "text-sky-700 dark:text-sky-300", activeColor: "bg-sky-400 dark:bg-sky-600" },
    { id: "leaderboards", label: "LEADERBOARDS", icon: Trophy, bgColor: "bg-yellow-50 dark:bg-yellow-900/20", textColor: "text-yellow-700 dark:text-yellow-300", activeColor: "bg-yellow-400 dark:bg-yellow-600" },
    { id: "progress", label: "PROGRESS", icon: TrendingUp, bgColor: "bg-green-50 dark:bg-green-900/20", textColor: "text-green-700 dark:text-green-300", activeColor: "bg-green-400 dark:bg-green-600" },
    { id: "quests", label: "QUESTS", icon: Star, bgColor: "bg-orange-50 dark:bg-orange-900/20", textColor: "text-orange-700 dark:text-orange-300", activeColor: "bg-orange-400 dark:bg-orange-600" },
    { id: "notes", label: "NOTES", icon: NotebookPen, bgColor: "bg-blue-50 dark:bg-blue-900/20", textColor: "text-blue-700 dark:text-blue-300", activeColor: "bg-blue-400 dark:bg-blue-600" },
    { id: "flashcards", label: "FLASHCARDS", icon: Brain, bgColor: "bg-purple-50 dark:bg-purple-900/20", textColor: "text-purple-700 dark:text-purple-300", activeColor: "bg-purple-400 dark:bg-purple-600" },
    { id: "profile", label: "PROFILE", icon: User, bgColor: "bg-muted dark:bg-muted/30", textColor: "text-muted-foreground dark:text-muted-foreground/90", activeColor: "bg-primary dark:bg-primary/70" },
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

  // Function to get subject display name with exam board
  const getSubjectDisplayName = (subject: any) => {
    let name = subject.name;
    
    // For subjects that already have exam board in their name, return as-is
    if (name.includes('(AQA)') || name.includes('(Edexcel)')) {
      return name;
    }
    
    // For specific Edexcel subjects
    if (subject.id === 'maths-edexcel') {
      return `Mathematics (Edexcel)`;
    } else if (subject.id === 'business-edexcel-igcse') {
      return `IGCSE Business (Edexcel)`;
    } else if (subject.id === 'chemistry-edexcel') {
      return `Chemistry (Edexcel)`;
    } else if (subject.id === 'physics-edexcel') {
      return `Physics (Edexcel)`;
    } else if (subject.id === 'edexcel-english-language') {
      return `English Language (Edexcel)`;
    }
    
    // For all other subjects (AQA), add (AQA)
    return `${name} (AQA)`;
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

  // Load flashcard sets
  const loadFlashcardSets = async () => {
    if (!user?.id) return;

    try {
      setFlashcardsLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading flashcard sets:', error);
        return;
      }

      // Group flashcards by subject and exam board to create sets
      const setsMap = new Map<string, FlashcardSet>();
      
      data?.forEach(flashcard => {
        const setKey = `${flashcard.subject_id}-${flashcard.exam_board}`;
        const setTitle = `${flashcard.subject_id} (${flashcard.exam_board})`;
        
        if (!setsMap.has(setKey)) {
          setsMap.set(setKey, {
            id: setKey,
            title: setTitle,
            subject_id: flashcard.subject_id,
            exam_board: flashcard.exam_board,
            flashcards: [],
            created_at: flashcard.created_at || new Date().toISOString(),
            card_count: 0
          });
        }
        
        const set = setsMap.get(setKey)!;
        set.flashcards.push({
          id: flashcard.id,
          front: flashcard.front,
          back: flashcard.back
        });
        set.card_count = set.flashcards.length;
        
        // Update created_at to the earliest flashcard date
        if (flashcard.created_at && flashcard.created_at < set.created_at) {
          set.created_at = flashcard.created_at;
        }
      });

      setFlashcardSets(Array.from(setsMap.values()));
    } catch (error) {
      console.error('Error loading flashcard sets:', error);
    } finally {
      setFlashcardsLoading(false);
    }
  };

  // Load individual flashcards
  const loadIndividualFlashcards = async () => {
    if (!user?.id) return;

    try {
      setCardsLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading flashcards:', error);
        return;
      }

      setIndividualFlashcards(data || []);
    } catch (error) {
      console.error('Error loading flashcards:', error);
    } finally {
      setCardsLoading(false);
    }
  };

  const handleDeleteSet = async (setId: string) => {
    const set = flashcardSets.find(s => s.id === setId);
    if (!set) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('user_id', user?.id)
        .eq('subject_id', set.subject_id)
        .eq('exam_board', set.exam_board);

      if (error) throw error;

      setFlashcardSets(sets => sets.filter(s => s.id !== setId));
      toast({
        title: "Success",
        description: "Flashcard set deleted",
      });
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
      toast({
        title: "Error",
        description: "Failed to delete flashcard set",
        variant: "destructive"
      });
    }
  };

  // Edit flashcard functions
  const handleEditCard = (card: any) => {
    setEditingCardId(card.id);
    setEditingCardData({ front: card.front, back: card.back });
  };

  const handleSaveEdit = async () => {
    if (!editingCardId || !user?.id) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .update({
          front: editingCardData.front,
          back: editingCardData.back,
        })
        .eq('id', editingCardId)
        .eq('user_id', user.id);

      if (error) throw error;

      setIndividualFlashcards(prev => 
        prev.map(card => 
          card.id === editingCardId 
            ? { ...card, front: editingCardData.front, back: editingCardData.back }
            : card
        )
      );

      setEditingCardId(null);
      setEditingCardData({ front: '', back: '' });

      toast({
        title: "Success",
        description: "Flashcard updated successfully"
      });
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast({
        title: "Error",
        description: "Failed to update flashcard",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingCardId(null);
    setEditingCardData({ front: '', back: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
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
      console.log('Login today flag:', stats.loginToday);
      console.log('Practice today flag:', stats.practiceToday);
      console.log('Total points:', stats.totalPoints);
      
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
      // Use UK timezone to match the MP points system
      const ukDate = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
      const todayInUK = new Date(ukDate);
      
      // Set to start of day in UK timezone
      const startOfDay = new Date(todayInUK);
      startOfDay.setHours(0, 0, 0, 0);
      
      // Set to end of day in UK timezone  
      const endOfDay = new Date(todayInUK);
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
      console.log('Activities query error:', error);
      
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
        
        console.log('MP calculation breakdown:', {
          dailyLogin: Math.min(dailyLoginCount, 1) * 10,
          practice: practiceCompletions * 40,
          weeklyTopics: weeklyTopicsAwards * 100,
          weeklyPractice: weeklyPracticeAwards * 250,
          streak: streakAwards * 500,
          total: earnedToday
        });
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

  // Get UK week boundaries (Monday 00:00 → Sunday 23:59)
  const getUKWeekBoundaries = () => {
    const now = new Date();
    
    // Convert to UK time
    const ukNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/London" }));
    
    // Get current day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = ukNow.getDay();
    
    // Calculate days since Monday (Monday = 0, Sunday = 6)
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    // Get Monday 00:00 UK time
    const weekStart = new Date(ukNow);
    weekStart.setDate(ukNow.getDate() - daysSinceMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    // Get Sunday 23:59 UK time
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    
    return { weekStart, weekEnd };
  };

  const loadWeeklyLeaderboardData = async () => {
    try {
      console.log('Loading weekly leaderboard (showing all users with MP)');
      
      // Get all users with total MP points
      const { data: allUsers, error: usersError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0);
      
      if (usersError || !allUsers) {
        console.error('Error fetching users:', usersError);
        return [];
      }
      
      // Get profile data for these users  
      const userIds = allUsers.map(u => u.user_id);
      
      // First, get public profiles
      const { data: publicProfiles, error: publicProfilesError } = await supabase
        .from('public_profiles')
        .select('user_id, username, display_name, streak_days')
        .in('user_id', userIds);
      
      const profilesMap = new Map();
      
      if (!publicProfilesError && publicProfiles) {
        publicProfiles.forEach(p => profilesMap.set(p.user_id, p));
      }
      
      // Get missing users from profiles table as fallback
      const existingUserIds = Array.from(profilesMap.keys());
      const missingUserIds = userIds.filter(id => !existingUserIds.includes(id));
      
      if (missingUserIds.length > 0) {
        const { data: fallbackProfiles, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, full_name, username, email')
          .in('id', missingUserIds);
        
        if (!fallbackError && fallbackProfiles) {
          for (const profile of fallbackProfiles) {
            profilesMap.set(profile.id, {
              user_id: profile.id,
              username: profile.username || profile.full_name || profile.email?.split('@')[0] || 'Anonymous',
              display_name: profile.full_name || profile.username || profile.email?.split('@')[0] || 'Anonymous',
              streak_days: 0
            });
          }
        }
      }
      
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      
      // Transform to leaderboard format (using total MP as placeholder for weekly MP)
      const weeklyLeaderboard = [];
      
      for (const user of allUsers) {
        const profile = profilesMap.get(user.user_id);
        
        // Get real-time streak for each user
        let userStreak = 0;
        try {
          const { data: streakData, error: streakError } = await supabase
            .rpc('get_user_streak', { user_uuid: user.user_id });
          
          if (!streakError && streakData !== null) {
            userStreak = streakData;
          }
        } catch (error) {
          console.log('Could not get streak for user:', user.user_id);
        }
        
        // Generate unique name based on user ID for consistency
        const generateUniqueNameFromUserId = (userId: string) => {
          const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Blake', 'Drew', 'Ember', 'Finley', 'Haven', 'Indigo', 'Kai', 'Luna', 'Nova', 'Orion', 'Phoenix', 'Rowan', 'Sky', 'Tatum', 'Vale', 'Winter', 'Zara', 'Ash', 'Brook', 'Cedar'];
          const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott'];
          
          // Create a simple hash from user ID for deterministic selection
          let hash = 0;
          for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }
          
          // Use different parts of the hash for first and last name
          const firstIndex = Math.abs(hash) % firstNames.length;
          const lastIndex = Math.abs(hash >> 8) % lastNames.length;
          
          return `${firstNames[firstIndex]} ${lastNames[lastIndex]}`;
        };
        
        weeklyLeaderboard.push({
          user_id: user.user_id,
          name: profile?.display_name || profile?.username || generateUniqueNameFromUserId(user.user_id),
          mp: user.total_points, // Using total MP as placeholder
          streak: userStreak,
          isCurrentUser: user.user_id === currentUserId,
          isRealUser: true,
          leaderboardType: 'weekly'
        });
      }
      
      // Sort by MP
      weeklyLeaderboard.sort((a, b) => b.mp - a.mp);
      
      console.log('Weekly leaderboard loaded:', weeklyLeaderboard.length, 'users');
      
      return weeklyLeaderboard;
    } catch (error) {
      console.error('Error loading weekly leaderboard:', error);
      return [];
    }
  };

  const loadAllTimeLeaderboardData = async () => {
    try {
      // Get all users with total MP points
      const { data: allUsers, error: usersError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0);
      
      if (usersError || !allUsers) {
        console.error('Error fetching users:', usersError);
        return [];
      }
      
      // Get profile data for these users
      const userIds = allUsers.map(u => u.user_id);
      
      // First, get public profiles
      const { data: publicProfiles, error: publicProfilesError } = await supabase
        .from('public_profiles')
        .select('user_id, username, display_name, streak_days')
        .in('user_id', userIds);
      
      const profilesMap = new Map();
      
      if (!publicProfilesError && publicProfiles) {
        publicProfiles.forEach(p => profilesMap.set(p.user_id, p));
      }
      
      // Get missing users from profiles table as fallback
      const existingUserIds = Array.from(profilesMap.keys());
      const missingUserIds = userIds.filter(id => !existingUserIds.includes(id));
      
      if (missingUserIds.length > 0) {
        const { data: fallbackProfiles, error: fallbackError } = await supabase
          .from('profiles')
          .select('id, full_name, username, email')
          .in('id', missingUserIds);
        
        if (!fallbackError && fallbackProfiles) {
          for (const profile of fallbackProfiles) {
            profilesMap.set(profile.id, {
              user_id: profile.id,
              username: profile.username || profile.full_name || profile.email?.split('@')[0] || 'Anonymous',
              display_name: profile.full_name || profile.username || profile.email?.split('@')[0] || 'Anonymous',
              streak_days: 0
            });
          }
        }
      }
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      
      // Transform to leaderboard format
      const allTimeLeaderboard = [];
      
      for (const user of allUsers) {
        const profile = profilesMap.get(user.user_id);
        
        // Get real-time streak for each user
        let userStreak = 0;
        try {
          const { data: streakData, error: streakError } = await supabase
            .rpc('get_user_streak', { user_uuid: user.user_id });
          
          if (!streakError && streakData !== null) {
            userStreak = streakData;
          }
        } catch (error) {
          console.log('Could not get streak for user:', user.user_id);
        }
        
        // Generate unique name based on user ID for consistency
        const generateUniqueNameFromUserId = (userId: string) => {
          const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery', 'Quinn', 'Sage', 'River', 'Blake', 'Drew', 'Ember', 'Finley', 'Haven', 'Indigo', 'Kai', 'Luna', 'Nova', 'Orion', 'Phoenix', 'Rowan', 'Sky', 'Tatum', 'Vale', 'Winter', 'Zara', 'Ash', 'Brook', 'Cedar'];
          const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Miller', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott'];
          
          // Create a simple hash from user ID for deterministic selection
          let hash = 0;
          for (let i = 0; i < userId.length; i++) {
            const char = userId.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
          }
          
          // Use different parts of the hash for first and last name
          const firstIndex = Math.abs(hash) % firstNames.length;
          const lastIndex = Math.abs(hash >> 8) % lastNames.length;
          
          return `${firstNames[firstIndex]} ${lastNames[lastIndex]}`;
        };
        
        allTimeLeaderboard.push({
          user_id: user.user_id,
          name: profile?.display_name || profile?.username || generateUniqueNameFromUserId(user.user_id),
          mp: user.total_points,
          streak: userStreak,
          isCurrentUser: user.user_id === currentUserId,
          isRealUser: true,
          leaderboardType: 'alltime'
        });
      }
      
      // Sort by total MP
      allTimeLeaderboard.sort((a, b) => b.mp - a.mp);
      
      console.log('All-time leaderboard loaded:', allTimeLeaderboard);
      
      return allTimeLeaderboard;
    } catch (error) {
      console.error('Error loading all-time leaderboard:', error);
      return [];
    }
  };

  const loadLeaderboardData = async () => {
    try {
      if (activeLeaderboardTab === 'weekly') {
        const weeklyData = await loadWeeklyLeaderboardData();
        setLeaderboardData(weeklyData);
      } else {
        const allTimeData = await loadAllTimeLeaderboardData();
        setLeaderboardData(allTimeData);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLeaderboardData([]);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadLeaderboardData(); // Reload when tab changes
    }
  }, [user?.id, activeLeaderboardTab]);

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
      if (activeTab === "flashcards") {
        loadFlashcardSets();
        loadIndividualFlashcards();
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

  const availableSubjects = curriculum.filter((subject) => !userSubjects.includes(subject.id));

  // Add subject function
  const addSubject = async (subjectId: string) => {
    if (!user?.id) return;
    
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;

    try {
      const { error } = await supabase
        .from("user_subjects")
        .insert({
          user_id: user.id,
          subject_name: subject.name,
          exam_board: "AQA", // Default exam board
          predicted_grade: "5",
          target_grade: "7"
        });

      if (error) {
        console.error("Error adding subject:", error);
        toast({
          title: "Error",
          description: "Failed to add subject",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setUserSubjects(prev => [...prev, subjectId]);
      toast({
        title: "Success",
        description: `${subject.name} added to your subjects`,
      });
      
    } catch (error) {
      console.error("Error adding subject:", error);
      toast({
        title: "Error", 
        description: "Failed to add subject",
        variant: "destructive"
      });
    }
  };

  // Remove subject function
  const removeSubject = async (subjectId: string) => {
    if (!user?.id) return;
    
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;

    try {
      const { error } = await supabase
        .from("user_subjects")
        .delete()
        .eq("user_id", user.id)
        .eq("subject_name", subject.name);

      if (error) {
        console.error("Error removing subject:", error);
        toast({
          title: "Error",
          description: "Failed to remove subject",
          variant: "destructive"
        });
        return;
      }

      // Update local state
      setUserSubjects(prev => prev.filter(id => id !== subjectId));
      toast({
        title: "Success",
        description: `${subject.name} removed from your subjects`,
      });
      
    } catch (error) {
      console.error("Error removing subject:", error);
      toast({
        title: "Error",
        description: "Failed to remove subject", 
        variant: "destructive"
      });
    }
  };

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
      <span className={!isPremium ? "blur-sm select-none" : ""}>{children}</span>
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
                     ? `bg-background ${colors.text} border-border hover:border-accent`
                     : "bg-muted border-border cursor-not-allowed"
                } ${!isLocked ? 'hover:scale-105' : ''}`}
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
              >
                {isLocked && (
                  <Lock className="h-8 w-8 text-muted-foreground absolute inset-0 m-auto" />
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
                <p className={`text-sm font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {topic.name}
                </p>
              </div>

              {/* Connecting line to next topic */}
              {index < subject.topics.length - 1 && (
                <div className="h-8 w-1 bg-border my-2"></div>
              )}
            </motion.div>
          );
        })}
        
        {/* 2026 Exam Final Node(s) */}
        {subject.id === 'geography' ? (
          // Geography has Paper 2 only
          <div className="flex flex-col items-center mt-6">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (subject.topics.length * 0.1) + 0.1 }}
            >
              <motion.button
                onClick={isPremium ? () => navigate("/predicted-exam/geography-paper-2") : () => navigate("/pricing")}
                className="relative w-24 h-24 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="h-8 w-8 text-white absolute inset-0 m-auto">
                  {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
                </div>
              </motion.button>
              
              <div className="text-center mt-3">
                <p className="text-sm font-bold text-foreground">
                  Predicted 2026 Exam Paper 2
                </p>
                {!isPremium && (
                  <p className="text-xs text-muted-foreground mt-1">Premium Required</p>
                )}
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
              onClick={isPremium ? () => navigate(`/predicted-exam/${subject.id}`) : () => navigate("/pricing")}
              className="relative w-24 h-24 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="h-8 w-8 text-white absolute inset-0 m-auto">
                {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
              </div>
            </motion.button>
            
            <div className="text-center mt-3">
              <p className="text-sm font-bold text-foreground">
                Predicted 2026 Exam
              </p>
              {!isPremium && (
                <p className="text-xs text-muted-foreground mt-1">Premium Required</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-background ${isPremium ? '' : 'pt-12'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border p-4">
          <div className="flex items-center justify-between">
            <MobileNav>
              {sidebarItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <MobileNavItem
                    key={item.id}
                    onClick={() => {
                      if (item.id === "flashcards") {
                        setActiveTab("flashcards");
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={isActive 
                      ? `${item.activeColor} text-white shadow-lg` 
                      : `${item.bgColor} ${item.textColor} hover:bg-opacity-80`
                    }
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : item.textColor}`} />
                    <span className="font-bold text-sm tracking-wide">{item.label}</span>
                  </MobileNavItem>
                );
              })}
              
              {/* Additional Navigation Items */}
              <div className="border-t border-border mt-2 pt-2">
                <MobileNavItem
                  onClick={() => {
                    const feedbackButton = document.querySelector('[data-feedback-fish]') as HTMLElement;
                    if (feedbackButton) feedbackButton.click();
                  }}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <span className="text-lg mr-3">💬</span>
                  <span className="font-medium">Feedback</span>
                </MobileNavItem>
                
                <MobileNavItem
                  onClick={() => window.open('https://discord.gg/NUy3u3A65B', '_blank')}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <span className="text-lg mr-3">🎮</span>
                  <span className="font-medium">Join Discord</span>
                </MobileNavItem>
                
                <MobileNavItem
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <User className="h-4 w-4 mr-3" />
                  <span className="font-medium">Sign Out</span>
                </MobileNavItem>
              </div>
            </MobileNav>
            
            <div className="flex items-center gap-2">
              <img
                src={mentioraLogo}
                alt="Mentiora"
                className="h-8 w-8"
              />
              <span className="font-bold text-lg text-foreground">Mentiora</span>
              {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className={`flex ${isMobile ? 'min-h-screen flex-col pt-0' : 'h-screen'}`}>
        
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className={`w-64 bg-background border-r-2 border-border flex flex-col py-6 ${isMobile ? 'hidden' : 'block'}`}>
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={mentioraLogo} alt="Mentiora Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-foreground">Mentiora</h1>
            {isPremium && (
              <Crown className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          <ThemeToggle />
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
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-primary/20' : 'bg-background'}`}>
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.textColor}`} />
                  </div>
                  <span className="font-bold text-sm tracking-wide">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pt-4 border-t border-border space-y-2">
          <button
            data-feedback-fish
            data-feedback-fish-userid={user?.email || ""}
            className="w-full flex items-center justify-start px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200"
          >
            <span className="text-lg mr-3">💬</span>
            <span className="font-medium">Feedback</span>
          </button>
          <button
            onClick={() => window.open('https://discord.gg/NUy3u3A65B', '_blank')}
            className="w-full flex items-center justify-start px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl transition-all duration-200"
          >
            <span className="text-lg mr-3">🎮</span>
            <span className="font-medium">Join Discord</span>
          </button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
          >
            <User className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Main Learning Area */}
          <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8'} ${isMobile ? 'max-w-full w-full' : 'max-w-4xl'} mx-auto`}>
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
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                     <h2 className="text-2xl sm:text-3xl font-bold text-foreground break-words">
                       Let's Smash GCSEs, {getFirstName()}!
                     </h2>
                    {filteredSubjects.length > 0 && (
                      <Button
                        onClick={() => setShowAddSubjects(true)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Subject</span>
                      </Button>
                    )}
                  </div>
                  
                  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'} gap-6`}>
                    {filteredSubjects.map((subject) => {
                      const colors = subjectColors[subject.id] || subjectColors["physics"];
                      const progress = getSubjectProgress(subject.id);
                      
                      return (
                        <motion.div
                          key={subject.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative"
                        >
                           <Card 
                            className="cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 mobile-no-overflow"
                            onClick={() => setSelectedSubject(subject.id)}
                          >
                            <CardContent className={`${isMobile ? 'p-4' : 'p-8'}`}>
                              <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-3">
                                    <span className={`text-xs font-bold ${colors.text} bg-muted px-3 py-1 rounded-full mobile-text-wrap`}>
                                      {progress.completed} OF {progress.total} UNITS
                                    </span>
                                  </div>
                                  
                                  <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-foreground mb-4 mobile-text-wrap`}>
                                    {getSubjectDisplayName(subject)}
                                  </h3>
                                  
                                  <div className="w-full bg-muted rounded-full h-3 mb-4">
                                    <div
                                      className={`${colors.bg} h-3 rounded-full transition-all duration-500`}
                                      style={{ width: `${(progress.completed / progress.total) * 100}%` }}
                                    />
                                  </div>

                                  <Button
                                    className={`${colors.bg} hover:opacity-90 text-white font-bold py-3 px-6 sm:px-8 rounded-2xl ${isMobile ? 'text-base w-full' : 'text-lg'} shadow-lg mobile-touch-target`}
                                  >
                                    {progress.completed === 0 ? "START" : "CONTINUE"}
                                  </Button>
                                </div>

                                <div className={`${isMobile ? 'w-16 h-16 self-center' : 'w-20 h-20 ml-6'} ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                  {(() => {
                                    const IconComponent = getSubjectIcon(subject.id);
                                    return <IconComponent className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} text-white`} />;
                                  })()}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {/* Remove Subject Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSubject(subject.id);
                            }}
                            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
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
                      className="text-muted-foreground hover:text-foreground mr-4"
                    >
                      ← Back
                    </Button>
                     <h2 className="text-3xl font-bold text-foreground">
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
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    No subjects selected yet
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8">
                    Add subjects to your list to get started with GCSE revision
                  </p>
                  <Button
                    onClick={() => setShowAddSubjects(true)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl text-lg flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Subjects</span>
                  </Button>
                </div>
              )}

              {/* Add Subjects Modal */}
              {showAddSubjects && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                   <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                     <div className="p-6 border-b border-border">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">Add Subjects</h2>
                        <Button
                          onClick={() => setShowAddSubjects(false)}
                          className="w-8 h-8 p-0 bg-muted hover:bg-accent text-muted-foreground rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-6 overflow-y-auto max-h-[60vh]">
                      {availableSubjects.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-lg text-muted-foreground">You've already added all available subjects!</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {availableSubjects.map((subject) => {
                            const colors = subjectColors[subject.id] || subjectColors["physics"];
                            const IconComponent = getSubjectIcon(subject.id);
                            
                            return (
                              <motion.div
                                key={subject.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card 
                                  className="cursor-pointer border-2 border-border hover:border-accent hover:shadow-md transition-all duration-200"
                                  onClick={() => {
                                    addSubject(subject.id);
                                    setShowAddSubjects(false);
                                  }}
                                >
                                   <CardContent className="p-4">
                                     <div className="flex items-center space-x-4">
                                       <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                                         <IconComponent className="h-6 w-6 text-white" />
                                       </div>
                                       <div className="flex-1 min-w-0">
                                         <h3 className="text-lg font-bold text-gray-800 mobile-text-wrap">
                                           {getSubjectDisplayName(subject)}
                                         </h3>
                                         <p className="text-sm text-gray-600 mobile-text-wrap">
                                           {subject.topics.length} topics available
                                         </p>
                                       </div>
                                       <Plus className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                     </div>
                                   </CardContent>
                                </Card>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes tab with full notebook functionality */}
          {activeTab === "notes" && (
            <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen -m-8 p-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-lg">
                  <NotebookPen className="h-8 w-8 text-white" />
                </div>
                 <h1 className="text-4xl font-bold text-foreground mb-4">
                  Smart Revision Notebook
                </h1>
                 <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  Instant notes for every lost mark
                </p>
              </div>

              {/* Filters */}
              <div className="max-w-2xl mx-auto bg-card/90 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-6 mb-8">
                <div className="flex items-center justify-center space-x-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground block">Subject</label>
                    <Select value={selectedNotebookSubject} onValueChange={setSelectedNotebookSubject}>
                      <SelectTrigger className="w-44 bg-background border-border hover:border-primary focus:border-primary transition-all duration-200">
                        <SelectValue placeholder="All Subjects" />
                      </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getNotebookSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                  </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground block">Confidence</label>
                    <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                      <SelectTrigger className="w-44 bg-background border-border hover:border-primary focus:border-primary transition-all duration-200">
                        <SelectValue placeholder="All Confidence" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
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
                  <p className="text-foreground font-medium text-lg">Loading your notes...</p>
                </div>
              ) : sortedEntries.length === 0 ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="text-center py-16 px-8 border border-border shadow-xl bg-card/90 backdrop-blur-sm">
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
            <div className="bg-gradient-to-br from-background via-background to-muted/20 min-h-screen -m-8 p-8">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  Your Predicted Grades
                </h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto">
                  See where you stand — and how to improve.
                </p>
              </div>

              {predictedGrades.length === 0 ? (
                <div className="max-w-2xl mx-auto">
                  <Card className="text-center py-16 px-8 border border-border shadow-xl bg-card/90 backdrop-blur-sm">
                    <CardContent className="space-y-8">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
                        <Trophy className="h-12 w-12 text-blue-600" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-semibold text-foreground">
                          No predictions yet
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                          Complete some practice sessions to see your predicted grades
                        </p>
                      </div>

                        <div className="pt-4">
                          <Button
                            onClick={isPremium ? () => setActiveTab("learn") : () => navigate("/pricing")}
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
                  <div className="bg-card rounded-3xl p-8 shadow-lg border-4 border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                          <Trophy className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">
                            Your average grade is {isPremium ? (predictedGrades.length > 0 ? Math.round(predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length) : 0) : (
                              <Lock size={24} className="inline text-muted-foreground" />
                            )}. Keep it up!
                          </h3>
                          <p className="text-muted-foreground">You're making great progress</p>
                        </div>
                      </div>
                      <Button
                        onClick={isPremium ? () => setActiveTab("learn") : () => navigate("/pricing")}
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
                        if (gradeNum >= 7 && percentage >= 80) return { text: "On track", color: "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300" };
                        if (gradeNum >= 5 && percentage >= 70) return { text: "Improving", color: "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300" };
                        if (gradeNum >= 4) return { text: "Needs work", color: "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300" };
                        return { text: "Keep trying", color: "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300" };
                      };

                      const statusChip = getStatusChip(prediction.grade, prediction.percentage || 0);

                      return (
                        <motion.div
                          key={prediction.subject_id + '-' + index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-border">
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
                                      <h3 className="text-xl font-bold text-foreground">
                                        {subjectName}
                                      </h3>
                                     {isPremium && (
                                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusChip.color}`}>
                                         {statusChip.text}
                                       </span>
                                     )}
                                   </div>
                                  
                                   {/* Progress Bar */}
                                   <div className="w-full bg-muted rounded-full h-3 mb-2">
                                     <div
                                       className={`h-3 rounded-full ${getProgressColor(prediction.grade)} transition-all duration-700`}
                                       style={{ width: isPremium ? `${Math.min(prediction.percentage || 0, 100)}%` : '0%' }}
                                     />
                                   </div>
                                  
                                     <p className="text-sm text-muted-foreground">
                                       {isPremium ? `${Math.round(prediction.percentage || 0)}% accuracy in practice` : (
                                         <span className="flex items-center">
                                           <Lock size={16} className="inline text-muted-foreground mr-1" />% accuracy in practice
                                         </span>
                                       )}
                                     </p>
                                </div>
                              </div>

                              {/* Large Grade Display */}
                              <div className="text-center ml-6">
                                <div className={`text-5xl font-bold ${getGradeColor(prediction.grade)} mb-1`}>
                                  {isPremium ? (prediction.grade || '0') : (
                                    <Lock size={48} className="text-muted-foreground" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
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
                <h2 className="text-3xl font-bold text-foreground mb-2">Leaderboards</h2>
                <p className="text-lg text-muted-foreground">See how you rank against other students</p>
              </div>

               {/* Leaderboard Tabs */}
               <div className="flex justify-center mb-8">
                 <div className="bg-card rounded-2xl p-2 shadow-lg border-2 border-border">
                   <div className="flex items-center space-x-2">
                     <div className="flex space-x-2">
                       <Button 
                         className={activeLeaderboardTab === 'weekly' ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-2 px-4 rounded-xl" : "text-muted-foreground font-bold py-2 px-4 rounded-xl hover:text-foreground"}
                         variant={activeLeaderboardTab === 'weekly' ? "default" : "ghost"}
                         onClick={() => setActiveLeaderboardTab('weekly')}
                       >
                         This Week
                       </Button>
                       <Button 
                         className={activeLeaderboardTab === 'alltime' ? "bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-2 px-4 rounded-xl" : "text-muted-foreground font-bold py-2 px-4 rounded-xl hover:text-foreground"}
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
                <div className="flex justify-center mb-8 mobile-no-overflow">
                  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4 sm:gap-6 max-w-2xl w-full px-2 sm:px-0`}>
                 <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border text-center">
                   <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                     <Trophy className="w-6 h-6 text-yellow-800" />
                   </div>
                   <div className="text-2xl font-bold text-card-foreground">
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
                   <div className="text-sm text-muted-foreground">Your Rank</div>
                 </div>
                 <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border text-center">
                   <div className="w-12 h-12 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                     <Gem className="w-6 h-6 text-white" />
                   </div>
                   <div className="text-2xl font-bold text-card-foreground">{userGems}</div>
                   <div className="text-sm text-muted-foreground">Total MP</div>
                 </div>
                  </div>
                </div>

               {/* Main Leaderboard */}
              <div className="bg-card rounded-2xl shadow-lg border-2 border-border overflow-hidden mobile-no-overflow">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-4 sm:px-6 py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white mobile-text-wrap">
                    {activeLeaderboardTab === 'weekly' ? 'Weekly League' : 'All Time League'}
                  </h3>
                </div>
                
                <div className="p-6">
                  {/* Column Headers */}
                  <div className="grid grid-cols-4 gap-4 text-sm font-bold text-muted-foreground uppercase tracking-wide mb-4 px-4">
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
                        
                        let players = [...leaderboardData]; // Copy the data
                        
                        // Add current user if not already present and has activity
                        const userExists = players.some(p => p.isCurrentUser);
                        if (!userExists && user && (userGems > 0 || (activeLeaderboardTab === 'weekly' && userStats))) {
                           const currentUserData = {
                             user_id: user.id,
                             name: getFirstName(),
                             mp: activeLeaderboardTab === 'weekly' ? 0 : userGems, // Weekly MP calculated separately
                             streak: currentStreak,
                             isCurrentUser: true,
                             isRealUser: true,
                             leaderboardType: activeLeaderboardTab,
                             earliestActivity: Date.now()
                           };
                           console.log('Adding current user:', currentUserData);
                           players.push(currentUserData);
                           
                           // Re-sort after adding current user
                           if (activeLeaderboardTab === 'weekly') {
                             players.sort((a, b) => {
                               if (a.mp !== b.mp) return b.mp - a.mp;
                               if (a.earliestActivity !== b.earliestActivity) return a.earliestActivity - b.earliestActivity;
                               return (a.user_id || '').localeCompare(b.user_id || '');
                             });
                           } else {
                             players.sort((a, b) => b.mp - a.mp);
                           }
                        }
                        
                        // Add rank to each player based on sorted order
                        const rankedPlayers = players.map((player, index) => ({
                          ...player,
                          rank: index + 1
                        }));
                        
                        // For weekly: show top 10 + current user if not in top 10
                        let displayPlayers;
                        if (activeLeaderboardTab === 'weekly') {
                          const top10 = rankedPlayers.slice(0, 10);
                          const currentUserInTop10 = top10.find(p => p.isCurrentUser);
                          
                          if (currentUserInTop10) {
                            // Current user is in top 10, just show top 10
                            displayPlayers = top10;
                          } else {
                            // Current user is not in top 10, show top 10 + current user
                            const currentUser = rankedPlayers.find(p => p.isCurrentUser);
                            displayPlayers = currentUser ? [...top10, currentUser] : top10;
                          }
                        } else {
                          // For all-time: show top 15 as before
                          displayPlayers = rankedPlayers.slice(0, 15);
                        }
                        
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
                          className={`grid grid-cols-4 gap-4 items-center p-4 rounded-xl hover:bg-accent/50 transition-colors theme-transition ${
                            player.isCurrentUser ? 'bg-primary/10 border-2 border-primary/20' : 'bg-card/50'
                          }`}
                        >
                          {/* Rank */}
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getRankIcon(player.rank)}</span>
                            <span className={`text-lg font-bold ${player.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                              #{player.rank}
                            </span>
                          </div>

                          {/* Student Name */}
                          <div className={`font-bold text-left ${player.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                            {player.name}
                            {player.isCurrentUser && (
                              <Badge className="ml-2 bg-blue-500 hover:bg-blue-600 text-white text-xs">You</Badge>
                            )}
                          </div>

                          {/* MP */}
                          <div className="flex items-center space-x-1">
                            <Gem className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold text-foreground">{player.mp.toLocaleString()}</span>
                          </div>

                          {/* Streak */}
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="font-bold text-foreground">{player.streak}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab !== "learn" && activeTab !== "notes" && activeTab !== "progress" && activeTab !== "profile" && activeTab !== "quests" && activeTab !== "leaderboards" && activeTab !== "flashcards" && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-foreground mb-6 capitalize">
                {activeTab}
              </h2>
              <p className="text-lg text-muted-foreground">
                Coming soon! This feature is being developed.
              </p>
            </div>
          )}

          {activeTab === "flashcards" && selectedSet && viewMode && (
            <FlashcardViewer
              flashcardSet={selectedSet}
              mode={viewMode}
              onBack={() => {
                setSelectedSet(null);
                setViewMode(null);
              }}
            />
          )}

          {activeTab === "flashcards" && !selectedSet && (
            <div className="min-h-screen bg-background">
              {/* Premium Header */}
              <div className="container mx-auto px-4 sm:px-6 py-2 max-w-7xl">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                  <div className="bg-card/60 backdrop-blur-sm rounded-xl p-2 border border-border shadow-lg">
                    <div className="flex space-x-2">
                       <Button
                         variant={flashcardView === "create" ? "default" : "ghost"}
                         size="sm"
                         onClick={() => setFlashcardView("create")}
                         className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                           flashcardView === "create" 
                             ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg" 
                             : "hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300"
                         }`}
                       >
                         <Plus className="h-4 w-4 mr-2" />
                         Create
                       </Button>
                       <Button
                         variant={flashcardView === "library" ? "default" : "ghost"}
                         size="sm"
                         onClick={() => setFlashcardView("library")}
                         className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                           flashcardView === "library" 
                             ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg" 
                             : "hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300"
                         }`}
                       >
                         <BookOpen className="h-4 w-4 mr-2" />
                         Sets
                       </Button>
                       <Button
                         variant={flashcardView === "cards" ? "default" : "ghost"}
                         size="sm"
                         onClick={() => setFlashcardView("cards")}
                         className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                           flashcardView === "cards" 
                             ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg" 
                             : "hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300"
                         }`}
                       >
                         <Eye className="h-4 w-4 mr-2" />
                         All Cards
                       </Button>
                    </div>
                  </div>
                </div>
                {flashcardView === "create" && (
                  <div className="space-y-8">
                    {/* Welcome Section */}
                    <div className="p-4 text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-sky-400 to-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <BookOpen className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-4">
                        Smart Flashcards
                      </h2>
                       <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                         Transform your study notes into powerful flashcards with analysis and exam-board optimization
                       </p>
                    </div>

                    {/* Creator Component */}
                    <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border p-8">
                      <FlashcardCreator onSetCreated={() => {
                        toast({
                          title: "Success",
                          description: "Flashcards created and saved!",
                        });
                        setFlashcardView("library");
                        loadFlashcardSets();
                      }} />
                    </div>
                  </div>
                )}

                {flashcardView === "library" && (
                  <div className="space-y-8">
                    {flashcardsLoading ? (
                      <div className="text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
                        <div className="bg-card/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-2xl shadow-primary/10">
                          <p className="text-foreground font-medium text-lg">Loading your collection...</p>
                          <p className="text-muted-foreground text-sm mt-2">Preparing your flashcard sets</p>
                        </div>
                      </div>
                    ) : flashcardSets.length === 0 ? (
                      <Card className="text-center py-16 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
                        <CardContent>
                          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-3xl flex items-center justify-center">
                            <Brain className="h-10 w-10 text-muted-foreground" />
                          </div>
                          <h3 className="text-2xl font-bold text-foreground mb-3">No Flashcard Sets Yet</h3>
                          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                            Start creating flashcards from your study notes to build your collection!
                          </p>
                          <Button 
                            onClick={() => setFlashcardView("create")} 
                            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            Create First Set
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {/* Welcome Section for Library */}
                        <div className="text-center mb-8">
                          <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent mb-4">
                            Your Flashcard Collection
                          </h2>
                           <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                             Review and study your flashcard sets for effective revision
                           </p>
                        </div>

                         {/* Flashcard Sets Grid */}
                         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                           {flashcardSets.map((set, index) => {
                             // Color gradients for different cards
                             const gradients = [
                               "bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-50 dark:from-blue-900/30 dark:via-blue-800/20 dark:to-cyan-900/30 border-blue-300/60 dark:border-blue-600/30 shadow-blue-200/50 dark:shadow-blue-900/20",
                               "bg-gradient-to-br from-purple-50 via-purple-100 to-pink-50 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-pink-900/30 border-purple-300/60 dark:border-purple-600/30 shadow-purple-200/50 dark:shadow-purple-900/20",
                               "bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:via-emerald-800/20 dark:to-teal-900/30 border-emerald-300/60 dark:border-emerald-600/30 shadow-emerald-200/50 dark:shadow-emerald-900/20",
                               "bg-gradient-to-br from-orange-50 via-orange-100 to-red-50 dark:from-orange-900/30 dark:via-orange-800/20 dark:to-red-900/30 border-orange-300/60 dark:border-orange-600/30 shadow-orange-200/50 dark:shadow-orange-900/20",
                               "bg-gradient-to-br from-indigo-50 via-indigo-100 to-violet-50 dark:from-indigo-900/30 dark:via-indigo-800/20 dark:to-violet-900/30 border-indigo-300/60 dark:border-indigo-600/30 shadow-indigo-200/50 dark:shadow-indigo-900/20",
                               "bg-gradient-to-br from-green-50 via-green-100 to-lime-50 dark:from-green-900/30 dark:via-green-800/20 dark:to-lime-900/30 border-green-300/60 dark:border-green-600/30 shadow-green-200/50 dark:shadow-green-900/20"
                             ];
                             const cardGradient = gradients[index % gradients.length];
                             
                             return (
                               <motion.div
                                 key={set.id}
                                 initial={{ opacity: 0, y: 20 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 transition={{ delay: 0.05 * index }}
                                 className="group"
                               >
                                 <Card className={`${cardGradient} backdrop-blur-xl border-2 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden relative`}>
                                   {/* Decorative elements */}
                                   <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent dark:from-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                                   <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent dark:from-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
                                   <CardHeader className="relative pb-3">
                                     <div className="flex justify-between items-start mb-3">
                                       <div className="flex-1">
                                         <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg shadow-lg">
                                              <Brain className="h-4 w-4 text-white" />
                                            </div>
                                           <div>
                                             <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                                               {set.title}
                                             </CardTitle>
                                             <CardDescription className="text-muted-foreground text-sm">
                                               {set.card_count} cards • {formatDate(set.created_at)}
                                             </CardDescription>
                                           </div>
                                         </div>
                                       </div>
                                       <Button
                                         variant="ghost"
                                         size="sm"
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           handleDeleteSet(set.id);
                                         }}
                                         className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full p-2"
                                       >
                                         <Trash2 className="h-3 w-3" />
                                       </Button>
                                     </div>
                                   </CardHeader>
                                   
                                   <CardContent className="relative pt-0">
                                     <div className="grid grid-cols-2 gap-2">
                                       <Button
                                         variant="outline"
                                         size="sm"
                                         onClick={() => {
                                           setSelectedSet(set);
                                           setViewMode("flashcards");
                                         }}
                                         className="w-full border-border text-foreground hover:bg-muted transition-all duration-200 text-xs"
                                       >
                                         <Eye className="h-3 w-3 mr-1" />
                                         Review
                                       </Button>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            setSelectedSet(set);
                                            setViewMode("learn");
                                          }}
                                          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
                                        >
                                          <Play className="h-3 w-3 mr-1" />
                                          Study
                                        </Button>
                                     </div>
                                   </CardContent>
                                 </Card>
                               </motion.div>
                             );
                           })}
                         </div>
                       </>
                      )}
                    </div>
                  )}

                  {flashcardView === "cards" && (
                    <div className="space-y-8">
                      {cardsLoading ? (
                        <div className="text-center py-16">
                          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
                          <div className="bg-card/80 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-2xl shadow-primary/10">
                            <p className="text-foreground font-medium text-lg">Loading your flashcards...</p>
                            <p className="text-muted-foreground text-sm mt-2">Preparing your individual cards</p>
                          </div>
                        </div>
                      ) : individualFlashcards.length === 0 ? (
                        <Card className="text-center py-16 bg-card/80 backdrop-blur-xl border border-border shadow-2xl">
                          <CardContent>
                            <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-3xl flex items-center justify-center">
                              <Brain className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">No Flashcards Yet</h3>
                            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                              Create your first flashcards to start building your collection!
                            </p>
                            <Button 
                              onClick={() => setFlashcardView("create")} 
                              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                              Create Flashcards
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (
                        <>
                          {/* Welcome Section for Individual Cards */}
                          <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent mb-4">
                              All Your Flashcards
                            </h2>
                            <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
                              Browse through all {individualFlashcards.length} individual flashcards you've created
                            </p>
                          </div>

                          {(() => {
                            // Define subjects for this scope
                            const subjects = [
                              { id: "physics", name: "Physics" },
                              { id: "chemistry", name: "Chemistry" },
                              { id: "biology", name: "Biology" },
                              { id: "mathematics", name: "Mathematics" },
                              { id: "english-language", name: "English Language" },
                              { id: "english-literature", name: "English Literature" },
                              { id: "geography", name: "Geography" },
                              { id: "history", name: "History" },
                              { id: "religious-studies", name: "Religious Studies" },
                              { id: "business", name: "Business Studies" },
                            ];

                            // Group flashcards by subject and exam board
                            const groupedCards = individualFlashcards.reduce((acc, card) => {
                              const key = `${card.subject_id}-${card.exam_board}`;
                              const subjectName = subjects.find(s => s.id === card.subject_id)?.name || card.subject_id;
                              
                              if (!acc[key]) {
                                acc[key] = {
                                  subject: subjectName,
                                  examBoard: card.exam_board,
                                  cards: []
                                };
                              }
                              acc[key].cards.push(card);
                              return acc;
                            }, {} as Record<string, { subject: string; examBoard: string; cards: any[] }>);

                            return Object.entries(groupedCards).map(([key, group]) => {
                              const typedGroup = group as { subject: string; examBoard: string; cards: any[] };
                              return (
                              <div key={key} className="mb-8 last:mb-0">
                                <div className="flex items-center gap-3 mb-6">
                                  <Badge className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-sm font-bold px-4 py-2">
                                    {typedGroup.subject}
                                  </Badge>
                                  <Badge variant="outline" className="text-sm font-medium">
                                    {typedGroup.examBoard}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {typedGroup.cards.length} cards
                                  </span>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                  {typedGroup.cards.map((card) => (
                                    <Card
                                      key={card.id}
                                      className="group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-card to-card/80 border-border/50"
                                    >
                                      <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                          <div className="flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-blue-600" />
                                            <span className="text-xs font-medium text-muted-foreground">Question</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0 transition-opacity"
                                              onClick={() => handleEditCard(card)}
                                            >
                                              <Edit3 className="h-3 w-3 text-blue-600" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0 transition-opacity"
                                              onClick={async () => {
                                                try {
                                                  const { error } = await supabase
                                                    .from('flashcards')
                                                    .delete()
                                                    .eq('id', card.id)
                                                    .eq('user_id', user?.id);

                                                  if (error) throw error;

                                                  setIndividualFlashcards(prev => prev.filter(c => c.id !== card.id));
                                                  toast({
                                                    title: "Success",
                                                    description: "Flashcard deleted successfully"
                                                  });
                                                } catch (error) {
                                                  console.error('Error deleting flashcard:', error);
                                                  toast({
                                                    title: "Error",
                                                    description: "Failed to delete flashcard",
                                                    variant: "destructive"
                                                  });
                                                }
                                              }}
                                            >
                                              <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                          </div>
                                        </div>
                                      </CardHeader>
                                      <CardContent>
                                        {editingCardId === card.id ? (
                                          <div className="space-y-4">
                                            <div>
                                              <label className="text-xs font-medium text-muted-foreground mb-2 block">Question</label>
                                              <Textarea
                                                value={editingCardData.front}
                                                onChange={(e) => setEditingCardData(prev => ({ ...prev, front: e.target.value }))}
                                                placeholder="Enter the question..."
                                                className="resize-none"
                                                rows={3}
                                              />
                                            </div>
                                            
                                            <div>
                                              <label className="text-xs font-medium text-muted-foreground mb-2 block">Answer</label>
                                              <Textarea
                                                value={editingCardData.back}
                                                onChange={(e) => setEditingCardData(prev => ({ ...prev, back: e.target.value }))}
                                                placeholder="Enter the answer..."
                                                className="resize-none"
                                                rows={3}
                                              />
                                            </div>
                                            
                                            <div className="flex items-center justify-end gap-2 pt-2">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleCancelEdit}
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                size="sm"
                                                onClick={handleSaveEdit}
                                                disabled={!editingCardData.front.trim() || !editingCardData.back.trim()}
                                              >
                                                Save
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="space-y-4">
                                            <div>
                                              <p className="text-sm font-medium leading-relaxed mb-3">
                                                {card.front}
                                              </p>
                                            </div>
                                            
                                            <div className="border-t border-border/50 pt-3">
                                               <div className="flex items-center gap-2 mb-2">
                                                 <Brain className="h-4 w-4 text-orange-500" />
                                                 <span className="text-xs font-medium text-muted-foreground">Answer</span>
                                               </div>
                                              <p className="text-sm text-muted-foreground leading-relaxed">
                                                {card.back}
                                              </p>
                                            </div>
                                            
                                            <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                                              <span>Created: {new Date(card.created_at).toLocaleDateString()}</span>
                                              {card.review_count > 0 && (
                                                <span>{card.review_count} reviews</span>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                              </div>
                              );
                            });
                          })()}
                        </>
                      )}
                    </div>
                  )}
               </div>
             </div>
           )}

          {activeTab === "quests" && (
            <div className="space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-foreground">Quests</h2>
                <div className="flex items-center space-x-6">
                  {/* MP Balance */}
                  <div className="flex items-center space-x-2 bg-card rounded-2xl px-6 py-3 shadow-lg border-2 border-border">
                    <Gem className="h-6 w-6 text-cyan-400" />
                    <span className="text-xl font-bold text-foreground" data-mp-counter>{userGems} MP</span>
                  </div>
                  {/* Streak Chip */}
                  <div className="flex items-center space-x-2 bg-card rounded-2xl px-6 py-3 shadow-lg border-2 border-border">
                    <Flame className="h-6 w-6 text-orange-400" />
                    <span className="text-lg font-bold text-card-foreground">{currentStreak} days in a row</span>
                  </div>
                </div>
              </div>

              {/* Daily Goal Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-400 rounded-2xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground">Daily Goal</h3>
                       <p className="text-muted-foreground">
                         50 MP goal — {Math.min(todayEarnedMP, 50)}/50 completed
                       </p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-4">
                  <div 
                    className="bg-blue-400 h-4 rounded-full transition-all duration-500" 
                    style={{width: `${Math.min(todayEarnedMP / 50 * 100, 100)}%`}}
                  ></div>
                </div>
              </div>

              {/* Daily Quests */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-card-foreground">Today's Quests</h3>
                
                 {/* Quest 1 - Login */}
                 <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-4">
                       <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                         <Check className="w-6 h-6 text-green-600" />
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-card-foreground">Log in today</h4>
                          <p className="text-muted-foreground">Log in to earn MP</p>
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
                       <div className="w-full bg-muted rounded-full h-2">
                         <div 
                           className={`${(userStats?.loginToday || todayEarnedMP >= 10) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                           style={{width: (userStats?.loginToday || todayEarnedMP >= 10) ? '100%' : '0%'}}
                         ></div>
                      </div>
                   </div>
                 </div>

                 {/* Quest 2 - Practice */}
                 <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
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
                          <h4 className="text-lg font-bold text-card-foreground">Complete 1 practice set</h4>
                           <p className="text-muted-foreground">Answer questions to earn MP</p>
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
                       <div className="w-full bg-muted rounded-full h-2">
                         <div 
                           className={`${(userStats?.practiceToday || todayEarnedMP >= 40) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                           style={{width: (userStats?.practiceToday || todayEarnedMP >= 40) ? '100%' : '0%'}}
                         ></div>
                      </div>
                   </div>
                 </div>

                {/* Quest 3 - Bonus Weekly */}
                <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-400 rounded-2xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-card-foreground">Bonus: Do 3 topics</h4>
                         <p className="text-muted-foreground">
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
                    <div className="w-full bg-muted rounded-full h-2">
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
                <h3 className="text-xl font-bold text-card-foreground">This Week's Challenges</h3>
                
                <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-400 rounded-2xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-card-foreground">Complete 5 practice sets</h4>
                        <p className="text-muted-foreground">
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
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-orange-400 h-3 rounded-full" 
                        style={{width: `${Math.min(((userStats?.weeklyPracticeCount || 0) / 5) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-400 rounded-2xl flex items-center justify-center">
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-card-foreground">Maintain 7-day streak</h4>
                        <p className="text-muted-foreground">
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
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-green-400 h-3 rounded-full" 
                        style={{width: `${Math.min(((userStats?.currentStreak || 0) / 7) * 100, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Preview */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-yellow-800" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground">Weekly Leaderboard</h3>
                      <p className="text-muted-foreground">
                        You're ranked #{(() => {
                          // Calculate user's rank from weekly leaderboard data
                          let players = leaderboardData.filter(p => {
                            // Real users appear in both leaderboards
                            if (p.isRealUser) return true;
                            
                            // Filter fake users for weekly leaderboard
                            return p.leaderboardType === 'weekly';
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
                        })()} this week
                      </p>
                    </div>
                  </div>
                  <Button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-yellow-800 font-bold py-3 px-6 rounded-2xl"
                    onClick={() => setActiveTab("leaderboards")}
                  >
                    View Leaderboard
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
                Profile Settings
              </h2>

              {/* Account Information Card */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border-2 border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">
                      Account Information
                    </h3>
                    <p className="text-muted-foreground">Your account details and status</p>
                  </div>
                </div>
                <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4`}>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Email Address</p>
                    <p className="text-lg font-bold text-foreground">{user?.email}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Account Type</p>
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-blue-500" />
                      <p className="text-lg font-bold text-foreground">
                        {isPremium ? "Premium Account" : "Free Account"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Management Card - Only for Premium Users */}
              {isPremium && (
                <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-card-foreground">
                        Billing Management
                      </h3>
                      <p className="text-card-foreground/80">Manage your subscription and billing</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg bg-emerald-50 dark:bg-card border border-emerald-200 dark:border-border shadow-sm">
                    <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-start justify-between'}`}>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-lg font-bold text-card-foreground flex items-center gap-2 mobile-text-wrap">
                          <Crown className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          Premium Subscription
                        </h4>
                        <p className="text-card-foreground/90 mobile-text-wrap">
                          Access your Stripe billing portal to manage your subscription, update payment methods, 
                          view invoices, and modify your plan.
                        </p>
                      </div>
                      
                      <Button 
                        onClick={openManageBilling}
                        className={`${isMobile ? 'w-full' : 'ml-4'} bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 sm:px-8 rounded-2xl mobile-touch-target`}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="truncate">Manage Billing</span>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground">Danger Zone</h3>
                    <p className="text-card-foreground/80">Permanent actions that cannot be undone</p>
                  </div>
                </div>
                <div className="p-6 rounded-lg bg-red-50 dark:bg-card border border-red-200 dark:border-border shadow-sm">
                  <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-start justify-between'}`}>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-lg font-bold text-card-foreground mobile-text-wrap">Delete Account</h4>
                      <p className="text-card-foreground/90 mobile-text-wrap">
                        Permanently delete your account and all associated data. This action cannot be undone. 
                        All your progress, notes, and achievements will be lost forever.
                      </p>
                    </div>
                    
                    <Button 
                      onClick={() => navigate('/settings')}
                      variant="outline" 
                      className={`${isMobile ? 'w-full' : 'ml-4'} border-red-300 hover:bg-red-50 dark:border-destructive/40 dark:hover:bg-destructive/10 text-red-600 dark:text-destructive font-bold py-3 px-6 sm:px-8 rounded-2xl mobile-touch-target`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span className="truncate">Delete Account</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Premium & Stats - Hidden on mobile and tablet */}
        <div className={`hidden lg:block w-80 bg-muted/30 p-6 space-y-6`}>
          {/* Premium Card */}
          {isPremium ? (
            <Card className="border-0 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary/20 rounded-lg p-2">
                    <Crown className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-lg">Premium Active</span>
                </div>
                <p className="text-white/90 mb-4">
                  You're enjoying all premium benefits!
                </p>
                <div className="space-y-2 text-sm text-white/80">
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Unlimited practice sessions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Advanced grade predictions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Predicted 2026 exam access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4" />
                    <span>Personalized revision notes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 bg-gradient-to-br from-blue-400 to-purple-500 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-primary/20 rounded-lg p-2">
                    <Crown className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-lg">Go Premium</span>
                </div>
                <p className="text-white/90 mb-4 mobile-text-wrap">
                  Unlock exclusive study features and advanced analytics!
                </p>
                <Button 
                  className="w-full bg-background text-primary hover:bg-accent font-bold py-3 rounded-2xl theme-transition mobile-text-wrap text-sm sm:text-base"
                  onClick={() => navigate("/pricing")}
                >
                  <span className="truncate">UPGRADE TO PREMIUM</span>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* League Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-foreground">Leaderboards</h3>
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
                  <p className="text-sm text-muted-foreground">
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
                <h3 className="text-lg font-bold text-foreground">Daily Quests</h3>
                <button 
                  className="text-blue-500 font-bold text-sm hover:text-blue-600 cursor-pointer"
                  onClick={() => setActiveTab("quests")}
                >
                  VIEW ALL
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${(userStats?.practiceToday || todayEarnedMP >= 40) ? 'bg-green-100' : 'bg-blue-400'} rounded-lg flex items-center justify-center`}>
                    {(userStats?.practiceToday || todayEarnedMP >= 40) ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <BookOpen className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-card-foreground mobile-text-wrap">Complete 1 practice set</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-1">
                      <div 
                        className={`${(userStats?.practiceToday || todayEarnedMP >= 40) ? 'bg-green-400' : 'bg-blue-400'} h-2 rounded-full transition-all duration-300`} 
                        style={{width: (userStats?.practiceToday || todayEarnedMP >= 40) ? '100%' : '20%'}}
                      ></div>
                    </div>
                  </div>
                  <div className={`${(userStats?.practiceToday || todayEarnedMP >= 40) ? 'bg-green-50' : 'bg-blue-50'} rounded-lg p-2 flex-shrink-0`}>
                    <span className={`text-xs font-bold ${(userStats?.practiceToday || todayEarnedMP >= 40) ? 'text-green-600' : 'text-blue-600'}`}>
                      {(userStats?.practiceToday || todayEarnedMP >= 40) ? '+40 MP' : '40 MP'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
      
      {/* Floating Feedback Button - Repositioned for mobile */}
      <button
        data-feedback-fish
        data-feedback-fish-userid={user?.email || ""}
        className={`fixed ${isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'} bg-blue-600 hover:bg-blue-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 flex items-center justify-center mobile-touch-target`}
        title="Send Feedback"
      >
        <span className="text-lg sm:text-xl">💬</span>
      </button>
    </div>
  );
};

export default Dashboard;
