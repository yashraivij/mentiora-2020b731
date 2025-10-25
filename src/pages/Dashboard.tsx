import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { curriculum } from "@/data/curriculum";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  Pencil,
  ChevronRight,
  Target,
  TrendingDown,
  BarChart3,
  Download,
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Menu,
  MoreVertical,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openManageBilling } from "@/lib/manageBilling";
import { NotebookEntry } from "@/components/notebook/NotebookEntry";
import { FlashcardCreator } from "@/components/flashcards/FlashcardCreator";
import { FlashcardViewer } from "@/components/flashcards/FlashcardViewer";
import { toast } from "sonner";
import { useMPRewards } from "@/hooks/useMPRewards";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { StrengthsWeaknesses } from "@/components/dashboard/StrengthsWeaknesses";
import { StudyInsights } from "@/components/dashboard/StudyInsights";
import { WeeklyPlan } from "@/components/dashboard/WeeklyPlan";
import { PersonalizedSummary } from "@/components/dashboard/PersonalizedSummary";
import { MedlySubjectsView } from "@/components/dashboard/MedlySubjectsView";
import { FlashcardInsights } from "@/components/dashboard/FlashcardInsights";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { PremiumWelcomeNotification } from "@/components/ui/premium-welcome-notification";
import { DailyStreakNotification } from "@/components/ui/daily-streak-notification";
import { HeaderStreakBadge } from "@/components/ui/header-streak-badge";
import { LeaderboardTable } from "@/components/dashboard/LeaderboardTable";
import { DailyQuests } from "@/components/dashboard/DailyQuests";

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
  const { showMPReward } = useMPRewards();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [weeklyStudyMinutes, setWeeklyStudyMinutes] = useState(0);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'weekly' | 'alltime'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [todayEarnedMP, setTodayEarnedMP] = useState(0);
  const [showAddSubjects, setShowAddSubjects] = useState(false);
  const [selectedSubjectGroup, setSelectedSubjectGroup] = useState<string | null>(null);
  const [activeSubjectLevel, setActiveSubjectLevel] = useState<'gcse' | 'alevel'>('gcse');
  const [selectedSubjectForGrade, setSelectedSubjectForGrade] = useState<{id: string, name: string, examBoard: string} | null>(null);
  const [editingTargetGrade, setEditingTargetGrade] = useState(false);
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
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [questNotificationCount, setQuestNotificationCount] = useState(0);
  const [weeklyFlashcardCount, setWeeklyFlashcardCount] = useState(0);
  const [studyTimeMinutes, setStudyTimeMinutes] = useState(0);
  const [hasAwardedStudyTime, setHasAwardedStudyTime] = useState(false);
  const [renamingSetId, setRenamingSetId] = useState<string | null>(null);
  const [newSetName, setNewSetName] = useState("");
  
  // Medly dashboard state
  const [subjectDrawerOpen, setSubjectDrawerOpen] = useState(false);
  const [selectedDrawerSubject, setSelectedDrawerSubject] = useState<any>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'topics' | 'papers' | 'plan' | 'notes' | 'flashcards'>('overview');
  const [insightFilter, setInsightFilter] = useState<string | null>(null);
  const [weekTasksCompleted, setWeekTasksCompleted] = useState<Set<string>>(new Set());
  const [classMedianGrades, setClassMedianGrades] = useState<{[key: string]: number}>({});
  const [completedActivities, setCompletedActivities] = useState<Set<string>>(new Set());
  const [subjectStudyTime, setSubjectStudyTime] = useState<{hours: number, minutes: number}>({hours: 0, minutes: 0});
  const [isDrawerMaximized, setIsDrawerMaximized] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPremiumWelcome, setShowPremiumWelcome] = useState(false);
  const [showDailyStreak, setShowDailyStreak] = useState(false);
  const [showStreakBadge, setShowStreakBadge] = useState(false);
  const [streakBadgeMilestone, setStreakBadgeMilestone] = useState(false);

  const sidebarItems = [
    { id: "learn", label: "LEARN", icon: Home, bgColor: "bg-[#E0F2FE] dark:bg-[#0EA5E9]/10", textColor: "text-[#0EA5E9] dark:text-[#38BDF8]", activeColor: "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] dark:bg-gradient-to-r dark:from-[#0EA5E9] dark:to-[#38BDF8]" },
    { id: "leaderboards", label: "RANK", icon: Trophy, bgColor: "bg-yellow-50 dark:bg-yellow-900/20", textColor: "text-yellow-700 dark:text-yellow-300", activeColor: "bg-yellow-400 dark:bg-yellow-600" },
    { id: "quests", label: "QUESTS", icon: Star, bgColor: "bg-green-50 dark:bg-green-900/20", textColor: "text-green-700 dark:text-green-300", activeColor: "bg-green-400 dark:bg-green-600" },
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
    "biology-aqa-alevel": { bg: "bg-lime-400", light: "bg-lime-50", text: "text-lime-700" },
    "mathematics": { bg: "bg-purple-400", light: "bg-purple-50", text: "text-purple-700" },
    "maths-edexcel": { bg: "bg-purple-400", light: "bg-purple-50", text: "text-purple-700" },
    "maths-aqa-alevel": { bg: "bg-indigo-400", light: "bg-indigo-50", text: "text-indigo-700" },
    "english-language": { bg: "bg-pink-400", light: "bg-pink-50", text: "text-pink-700" },
    "english-literature": { bg: "bg-rose-400", light: "bg-rose-50", text: "text-rose-700" },
    "geography": { bg: "bg-emerald-400", light: "bg-emerald-50", text: "text-emerald-700" },
    "geography-paper-2": { bg: "bg-emerald-400", light: "bg-emerald-50", text: "text-emerald-700" },
    "history": { bg: "bg-amber-400", light: "bg-amber-50", text: "text-amber-700" },
    "religious-studies": { bg: "bg-violet-400", light: "bg-violet-50", text: "text-violet-700" },
    "business-edexcel-igcse": { bg: "bg-teal-400", light: "bg-teal-50", text: "text-teal-700" },
    "computer-science": { bg: "bg-cyan-400", light: "bg-cyan-50", text: "text-cyan-700" },
    "psychology": { bg: "bg-fuchsia-400", light: "bg-fuchsia-50", text: "text-fuchsia-700" },
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
      "biology-aqa-alevel": Dna,
      "mathematics": Calculator,
      "maths-edexcel": Calculator,
      "maths-aqa-alevel": Brain,
      "english-language": PenTool,
      "english-literature": BookOpen,
      "geography": Globe,
      "geography-paper-2": Globe,
      "history": Clock,
      "religious-studies": Church,
      "business-edexcel-igcse": Building,
      "computer-science": TestTube,
      "psychology": Heart,
    };
    return iconMap[subjectId] || BookOpen;
  };

  // Function to get subject display name with exam board
  const getSubjectDisplayName = (subject: any) => {
    let name = subject.name;
    
    // For subjects that already have exam board in their name, return as-is
    if (name.includes('(AQA)') || name.includes('(Edexcel)') || name.includes('(OCR)') || name.includes('(Eduqas)')) {
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
    
    // For Eduqas subjects
    if (subject.id === 'music-eduqas-gcse') {
      return `Music (Eduqas)`;
    }
    
    // For OCR subjects
    if (subject.id === 'computer-science' || subject.id === 'psychology') {
      return `${name} (OCR)`;
    }
    
    // For all other subjects (AQA), add (AQA)
    return `${name} (AQA)`;
  };

  // Map database subject_id to curriculum subject_id for consistent icons
  const mapDatabaseSubjectToCurriculum = (dbSubjectId: string) => {
    const subjectMapping: { [key: string]: string } = {
      // A-level subjects
      "Mathematics (A-Level)": "maths-aqa-alevel",
      "Biology (A-Level)": "biology-aqa-alevel",
      
      // GCSE/standard subjects with exam board in name
      "Physics (Edexcel)": "physics-edexcel",
      "Chemistry (Edexcel)": "chemistry-edexcel",
      "Biology (Edexcel)": "biology-edexcel",
      
      // GCSE/standard subjects
      "Mathematics": "maths-edexcel",
      "maths": "maths-edexcel", 
      "mathematics": "maths-edexcel",
      "Physics": "physics-edexcel",
      "physics": "physics-edexcel",
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

      // Group flashcards by set_id to create distinct sets
      const setsMap = new Map<string, FlashcardSet>();
      
      data?.forEach(flashcard => {
        const setKey = flashcard.set_id || `${flashcard.subject_id}-${flashcard.exam_board}`;
        
        if (!setsMap.has(setKey)) {
          const setTitle = flashcard.title || `${flashcard.subject_id} (${flashcard.exam_board})`;
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

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleDeleteSet = async (setId: string) => {
    const set = flashcardSets.find(s => s.id === setId);
    if (!set) return;

    try {
      const { error } = await supabase
        .from('flashcards')
        .delete()
        .eq('user_id', user?.id)
        .eq('set_id', setId);

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

  const handleRenameSet = async (setId: string) => {
    if (!newSetName.trim()) {
      toast({
        title: "Error",
        description: "Set name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('flashcards')
        .update({ title: newSetName.trim() })
        .eq('set_id', setId);

      if (error) throw error;

      setRenamingSetId(null);
      setNewSetName("");
      loadFlashcardSets();
      
      toast({
        title: "Success",
        description: "Flashcard set renamed successfully",
      });
    } catch (error) {
      console.error('Error renaming flashcard set:', error);
      toast({
        title: "Error",
        description: "Failed to rename flashcard set",
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
        .eq("user_id", user.id)
        .order('created_at', { ascending: true });
      
      // For each subject, get last 6 exam scores for the trend graph
      const subjectsWithTrends = await Promise.all((data || []).map(async (subj) => {
        const { data: exams } = await supabase
          .from("exams")
          .select("score, total_marks, completed_at")
          .eq("user_id", user.id)
          .eq("subject_id", subj.subject_name)
          .not("completed_at", "is", null)
          .order("completed_at", { ascending: false })
          .limit(6);
        
        // Convert scores to percentages (0-100 scale for the graph)
        const last_6_scores = exams && exams.length > 0
          ? exams.reverse().map(exam => 
              exam.total_marks > 0 ? Math.round((exam.score / exam.total_marks) * 100) : 0
            )
          : [0, 0, 0, 0, 0, 0]; // Default to zeros if no exams
        
        // Pad with zeros if less than 6 attempts
        while (last_6_scores.length < 6) {
          last_6_scores.unshift(0);
        }
        
        return {
          ...subj,
          last_6_scores: last_6_scores.slice(-6) // Take only last 6
        };
      }));

      if (error) {
        console.error("Error loading user subjects:", error);
        return;
      }

      if (subjectsWithTrends && subjectsWithTrends.length > 0) {
        // Load subject_performance data to get study_hours and accuracy_rate
        const { data: perfData } = await supabase
          .from("subject_performance")
          .select("subject_id, exam_board, study_hours, accuracy_rate")
          .eq("user_id", user.id);
        
        // Helper to get subject_id from name and exam board
        const getSubjectId = (subjectName: string, examBoard: string): string => {
          const board = examBoard.toLowerCase();
          
          // Handle A-level subjects
          if (subjectName === "Biology (A-Level)" && board === "aqa") return "biology-aqa-alevel";
          if (subjectName === "Mathematics (A-Level)" && board === "aqa") return "maths-aqa-alevel";
          if (subjectName === "Psychology (A-Level)" && board === "aqa") return "psychology-aqa-alevel";
          
          // Handle subjects with exam board in name
          if (subjectName === "Chemistry (Edexcel)") return "chemistry-edexcel";
          if (subjectName === "Physics (Edexcel)") return "physics-edexcel";
          if (subjectName === "English Language (Edexcel)") return "edexcel-english-language";
          
          // Handle standard subjects
          if (subjectName === "Mathematics") return board === "edexcel" ? "maths-edexcel" : "maths";
          if (subjectName === "Physics") return board === "edexcel" ? "physics-edexcel" : "physics";
          if (subjectName === "Chemistry") return board === "edexcel" ? "chemistry-edexcel" : "chemistry";
          if (subjectName === "Biology") return "biology";
          if (subjectName === "IGCSE Business") return "business-edexcel-igcse";
          if (subjectName === "Business") return "business";
          if (subjectName === "English Language") return "english-language";
          if (subjectName === "English Literature") return "english-literature";
          if (subjectName === "Geography") return "geography";
          if (subjectName === "History") return "history";
          if (subjectName === "Religious Studies") return "religious-studies";
          if (subjectName === "Computer Science") return "computer-science";
          if (subjectName === "Spanish") return "spanish-aqa";
          
          // Fallback: try to find by name in curriculum
          const subject = curriculum.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
          return subject?.id || subjectName.toLowerCase().replace(/\s+/g, '-');
        };
        
        // Merge performance data with subject data (including last_6_scores)
        const enrichedData = subjectsWithTrends.map(subject => {
          const expectedSubjectId = getSubjectId(subject.subject_name, subject.exam_board);
          const perf = perfData?.find(p => 
            p.subject_id === expectedSubjectId && 
            p.exam_board.toLowerCase() === subject.exam_board.toLowerCase()
          );
          return {
            ...subject,
            study_hours: perf?.study_hours || 0,
            accuracy_rate: perf?.accuracy_rate || 0,
            last_6_scores: subject.last_6_scores // Keep the last_6_scores from earlier query
          };
        });
        
        // Store full subject data for progress tab
        setUserSubjectsWithGrades(enrichedData);
        
        // Load predicted grades
        loadPredictedGrades();
        
        const subjectIds = subjectsWithTrends
          .map((record) => {
            const examBoard = record.exam_board.toLowerCase();
            const subjectName = record.subject_name;
            
            // Handle A-level subjects
            if (subjectName === "Biology (A-Level)" && examBoard === "aqa") return "biology-aqa-alevel";
            if (subjectName === "Mathematics (A-Level)" && examBoard === "aqa") return "maths-aqa-alevel";
            if (subjectName === "Psychology (A-Level)" && examBoard === "aqa") return "psychology-aqa-alevel";
            
            // Handle subjects with exam board in name
            if (subjectName === "Chemistry (Edexcel)") return "chemistry-edexcel";
            if (subjectName === "Physics (Edexcel)") return "physics-edexcel";
            if (subjectName === "English Language (Edexcel)") return "edexcel-english-language";
            if (subjectName === "History (Edexcel)") return "history"; // Map to general history for now
            
            // Handle GCSE/standard subjects with exam board detection
            if (subjectName === "Mathematics") return examBoard === "edexcel" ? "maths-edexcel" : "maths";
            if (subjectName === "Physics") return examBoard === "edexcel" ? "physics-edexcel" : "physics";
            if (subjectName === "Chemistry") return examBoard === "edexcel" ? "chemistry-edexcel" : "chemistry";
            if (subjectName === "Biology") return examBoard === "edexcel" ? "biology" : "biology";
            if (subjectName === "IGCSE Business") return "business-edexcel-igcse";
            if (subjectName === "Business") return "business";
            if (subjectName === "English Language") return "english-language";
            if (subjectName === "English Literature") return "english-literature";
            if (subjectName === "Geography") return "geography";
            if (subjectName === "Geography Paper 1") return "geography";
            if (subjectName === "Geography Paper 2") return "geography";
            if (subjectName === "History") return "history";
            if (subjectName === "Religious Studies") return "religious-studies";
            if (subjectName === "Computer Science") return "computer-science";
            if (subjectName === "Spanish") return "spanish-aqa";

            // Fallback: try to find by name in curriculum
            const subject = curriculum.find(
              (s) => s.name.toLowerCase() === subjectName.toLowerCase()
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

  // Load weekly time saved from notebook entries (15 min per entry)
  const loadWeeklyStudyMinutes = async () => {
    if (!user?.id) return;

    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from("notebook_entries")
        .select("id")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      if (error) {
        console.error("Error loading weekly notebook entries:", error);
        return;
      }

      // Each notebook entry saves ~15 minutes of manual note-taking time
      const totalMinutes = (data?.length || 0) * 15;
      setWeeklyStudyMinutes(totalMinutes);
    } catch (error) {
      console.error("Error loading weekly time saved:", error);
    }
  };

  // Load predicted grades from database
  const loadPredictedGrades = async () => {
    if (!user?.id) return;

    try {
      console.log('📊 Loading predicted grades for user:', user.id);
      
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading predicted grades:', error);
        return;
      }

      console.log('📊 Raw predicted exam completions:', data);

      // Group by subject_id and get the latest prediction for each subject
      const latestGrades = data?.reduce((acc: any, grade: any) => {
        if (!acc[grade.subject_id] || new Date(grade.created_at) > new Date(acc[grade.subject_id].created_at)) {
          acc[grade.subject_id] = grade;
        }
        return acc;
      }, {});

      console.log('📊 Latest grades by subject:', latestGrades);
      console.log('📊 User subjects from curriculum:', userSubjects);
      
      setPredictedGrades(Object.values(latestGrades || {}));
    } catch (error) {
      console.error('Error loading predicted grades:', error);
    }
  };

  // Load platform average grades (average predicted grade across all users for each subject)
  const loadClassMedianGrades = async () => {
    try {
      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('subject_id, grade, percentage');

      if (error) {
        console.error('Error loading platform average grades:', error);
        return;
      }

      // Calculate average grade for each subject across all users
      const subjectGrades: {[key: string]: number[]} = {};
      
      data?.forEach((completion: any) => {
        if (!subjectGrades[completion.subject_id]) {
          subjectGrades[completion.subject_id] = [];
        }
        
        // Parse grade - it might be a string like "7" or a letter grade
        let gradeValue: number;
        if (typeof completion.grade === 'string') {
          // Try to parse as number first
          const numGrade = parseFloat(completion.grade);
          if (!isNaN(numGrade)) {
            gradeValue = numGrade;
          } else {
            // Convert letter grade to number (A*=9, A=8, B=7, etc)
            const gradeMap: {[key: string]: number} = {
              'A*': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 3, 'G': 2, 'U': 1
            };
            gradeValue = gradeMap[completion.grade.toUpperCase()] || 0;
          }
        } else {
          gradeValue = completion.grade || 0;
        }
        
        subjectGrades[completion.subject_id].push(gradeValue);
      });

      // Calculate average (mean) for each subject
      const averageGrades: {[key: string]: number} = {};
      Object.keys(subjectGrades).forEach(subjectId => {
        const grades = subjectGrades[subjectId];
        const sum = grades.reduce((acc, val) => acc + val, 0);
        averageGrades[subjectId] = grades.length > 0 ? sum / grades.length : 0;
      });

      setClassMedianGrades(averageGrades);
    } catch (error) {
      console.error('Error loading platform average grades:', error);
    }
  };

  // Load user progress from database
  const loadUserProgress = async () => {
    if (!user?.id) return;

    try {
      // Fetch from database
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const progressData = data.map((p: any) => ({
          subjectId: p.subject_id,
          topicId: p.topic_id,
          attempts: p.attempts,
          averageScore: p.average_score,
          lastAttempt: new Date(p.last_attempt)
        }));
        setUserProgress(progressData);
        // Also save to localStorage as backup
        localStorage.setItem(`mentiora_progress_${user.id}`, JSON.stringify(progressData));
      } else {
        // Fallback to localStorage if no database data
        const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          const progressWithDates = parsedProgress.map((p: any) => ({
            ...p,
            lastAttempt: new Date(p.lastAttempt)
          }));
          setUserProgress(progressWithDates);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to localStorage on error
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        const progressWithDates = parsedProgress.map((p: any) => ({
          ...p,
          lastAttempt: new Date(p.lastAttempt)
        }));
        setUserProgress(progressWithDates);
      }
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
      
      // Show streak badge if user has a streak
      if (stats.currentStreak > 0) {
        setShowStreakBadge(true);
        
        // Check if it's a milestone
        const milestones = [7, 14, 30, 60, 100, 180, 365];
        if (milestones.includes(stats.currentStreak)) {
          setStreakBadgeMilestone(true);
        }
      }
      
      // Check if this is a new day login and show streak notification
      const lastLoginDate = localStorage.getItem(`lastStreakNotification_${user.id}`);
      const streakCheckDate = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
      const streakCheckToday = new Date(streakCheckDate);
      const todayDateString = streakCheckToday.toISOString().split('T')[0];
      
      if (lastLoginDate !== todayDateString && stats.currentStreak >= 2) {
        // New day login - show streak notification (only for 2+ days)
        setShowDailyStreak(true);
        localStorage.setItem(`lastStreakNotification_${user.id}`, todayDateString);
      }
      
      // Get this week's flashcard count
      const { weekStart } = getUKWeekBoundaries();
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', weekStart.toISOString());
      
      setWeeklyFlashcardCount(flashcards?.length || 0);
      
      // Check if study time MP has been awarded today
      const ukDate = new Date().toLocaleString("en-US", { timeZone: "Europe/London" });
      const todayInUK = new Date(ukDate);
      const dayStart = new Date(todayInUK);
      dayStart.setHours(0, 0, 0, 0);
      
      const { data: studyTimeActivity } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_type', 'study_time_30min')
        .gte('created_at', dayStart.toISOString())
        .maybeSingle();
      
      setHasAwardedStudyTime(!!studyTimeActivity);
      
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
      loadWeeklyStudyMinutes();
      loadUserProgress();
      loadLeaderboardData();
      loadPredictedGrades(); // Load predicted grades on user load
      loadClassMedianGrades(); // Load class median grades on user load
      loadNotebookEntries(); // Pre-load notebook entries for faster access
      if (activeTab === "progress") {
        loadPredictedGrades(); // Refresh predicted grades when viewing progress tab
      }
      if (activeTab === "flashcards") {
        loadFlashcardSets();
        loadIndividualFlashcards();
      }
    }
  }, [user?.id, activeTab]);

  // Load flashcards when drawer flashcards tab opens
  useEffect(() => {
    if (subjectDrawerOpen && drawerTab === 'flashcards') {
      loadFlashcardSets();
      loadIndividualFlashcards();
    }
  }, [subjectDrawerOpen, drawerTab]);

  // Force refresh when dashboard becomes visible to catch completed practice
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id && document.hasFocus()) {
        loadUserStats();
        loadPredictedGrades();
        loadUserSubjects(); // Reload subject performance data
        loadWeeklyStudyMinutes(); // Reload weekly study minutes
        loadUserProgress(); // Reload progress data
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

  // Handle navigation state from practice page
  useEffect(() => {
    if (location.state?.openSubjectDrawer && location.state?.subjectId) {
      console.log('Opening subject drawer from navigation state:', location.state);
      const subject = curriculum.find(s => s.id === location.state.subjectId);
      console.log('Found subject:', subject);
      if (subject) {
        setSelectedDrawerSubject(subject);
        setSubjectDrawerOpen(true);
        setDrawerTab(location.state.drawerTab || 'overview');
        setActiveTab('learn');
        // Clear the state to prevent reopening on subsequent renders
        setTimeout(() => {
          navigate(location.pathname, { replace: true, state: {} });
        }, 100);
      }
    }
  }, [location.state, navigate, setActiveTab]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        loadUserStats(); // Refresh stats every 30 seconds
        calculateTodayEarnedMP(); // Refresh today's earned MP
        loadLeaderboardData(); // Refresh leaderboard every 30 seconds for live updates
        loadPredictedGrades(); // Refresh predicted grades to catch new completions
        loadUserSubjects(); // Refresh subject performance data
        loadWeeklyStudyMinutes(); // Refresh weekly study minutes
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Track MP changes to show quest notification badge
  useEffect(() => {
    const previousMP = localStorage.getItem(`previousMP_${user?.id}`);
    if (previousMP && userGems > parseInt(previousMP) && activeTab !== 'quests') {
      setQuestNotificationCount(prev => prev + 1);
    }
    if (userGems > 0) {
      localStorage.setItem(`previousMP_${user?.id}`, userGems.toString());
    }
  }, [userGems, user?.id, activeTab]);

  // Listen for MP earned events
  useEffect(() => {
    const handleMPEarned = () => {
      if (activeTab !== 'quests') {
        setQuestNotificationCount(prev => prev + 1);
      }
    };

    window.addEventListener('mpEarned', handleMPEarned);
    return () => window.removeEventListener('mpEarned', handleMPEarned);
  }, [activeTab]);

  // Calculate time saved for selected subject based on notebook entries
  useEffect(() => {
    const calculateSubjectStudyTime = async () => {
      if (!user?.id || !selectedDrawerSubject?.id) {
        setSubjectStudyTime({hours: 0, minutes: 0});
        return;
      }
      
      // Extract base subject name (e.g., "chemistry" from "chemistry-edexcel")
      const subjectId = selectedDrawerSubject.id;
      const baseSubjectName = subjectId.split('-')[0];
      
      console.log('Fetching time saved for subject:', baseSubjectName);
      
      // Count notebook entries for this subject (each entry = 15 min saved)
      // Use pattern matching to handle subjects like "Computer Science"
      const { data: notebookEntries, error } = await supabase
        .from("notebook_entries")
        .select("id")
        .eq("user_id", user.id)
        .ilike("subject", `%${baseSubjectName}%`);
      
      console.log('Notebook entries found:', notebookEntries?.length || 0);
      
      if (error) {
        console.error('Error fetching notebook entries:', error);
        setSubjectStudyTime({hours: 0, minutes: 0});
        return;
      }
      
      // Each notebook entry saves ~15 minutes
      const totalMinutes = (notebookEntries?.length || 0) * 15;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      console.log('Calculated time saved:', hours, 'hours', minutes, 'minutes');
      setSubjectStudyTime({hours, minutes});
    };
    
    calculateSubjectStudyTime();
  }, [user?.id, selectedDrawerSubject?.id]);

  // Clear quest notification when viewing quests tab
  useEffect(() => {
    if (activeTab === 'quests') {
      setQuestNotificationCount(0);
    }
  }, [activeTab]);

  // Study time tracker - increment every minute
  useEffect(() => {
    if (!user?.id || hasAwardedStudyTime) return;
    
    const interval = setInterval(() => {
      setStudyTimeMinutes(prev => {
        const newTime = prev + 1;
        
        // Award MP when reaching 30 minutes
        if (newTime === 30 && !hasAwardedStudyTime) {
          (async () => {
            const { data } = await supabase.functions.invoke('award-mp', {
              body: { 
                action: 'study_time_30min', 
                userId: user.id
              }
            });
            
            if (data?.success) {
              setHasAwardedStudyTime(true);
              showMPReward(35, 'Studied for 30 minutes! 📚');
              setQuestNotificationCount(prev => prev + 1);
              loadUserStats();
            }
          })();
        }
        
        return newTime >= 30 ? 30 : newTime;
      });
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [user?.id, hasAwardedStudyTime, showMPReward]);

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
  
  // Calculate actual metrics from user data
  const profile = useMemo(() => {
    // Calculate overall predicted grade (average of all subject predictions)
    let overallPred = 0;
    let overallTarget = 0;
    let validSubjectsCount = 0;
    
    userSubjectsWithGrades.forEach(subject => {
      const target = typeof subject.target_grade === 'string'
        ? parseFloat(subject.target_grade) || 7
        : subject.target_grade || 7;
      
      // Get subject ID to find progress
      const getSubjectId = (subjectName: string, examBoard: string): string => {
        const board = examBoard.toLowerCase();
        if (subjectName === "Biology (A-Level)" && board === "aqa") return "biology-aqa-alevel";
        if (subjectName === "Mathematics (A-Level)" && board === "aqa") return "maths-aqa-alevel";
        if (subjectName === "Psychology (A-Level)" && board === "aqa") return "psychology-aqa-alevel";
        if (subjectName === "Chemistry (Edexcel)") return "chemistry-edexcel";
        if (subjectName === "Physics (Edexcel)") return "physics-edexcel";
        if (subjectName === "Mathematics") return board === "edexcel" ? "maths-edexcel" : "maths";
        if (subjectName === "Physics") return board === "edexcel" ? "physics-edexcel" : "physics";
        if (subjectName === "Chemistry") return board === "edexcel" ? "chemistry-edexcel" : "chemistry";
        if (subjectName === "Biology") return "biology";
        const currSubject = curriculum.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        return currSubject?.id || subjectName.toLowerCase().replace(/\s+/g, '-');
      };
      
      const subjectId = getSubjectId(subject.subject_name, subject.exam_board);
      const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
      const currSubject = curriculum.find(s => s.id === subjectId);
      const totalTopics = currSubject?.topics.length || 1;
      const totalScore = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0);
      const practicePercentage = Math.round(totalScore / totalTopics);
      
      const recentExamCompletion = predictedGrades
        .filter(pg => pg.subject_id === subjectId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      const hasPracticeData = subjectProgress.length > 0;
      let predicted = 0;
      
      if (recentExamCompletion && hasPracticeData) {
        const examGradeNum = recentExamCompletion.grade === 'U' ? 0 : parseInt(recentExamCompletion.grade) || 0;
        const practiceGradeNum = practicePercentage >= 90 ? 9 : practicePercentage >= 80 ? 8 : practicePercentage >= 70 ? 7 : practicePercentage >= 60 ? 6 : practicePercentage >= 50 ? 5 : practicePercentage >= 40 ? 4 : practicePercentage >= 30 ? 3 : practicePercentage >= 20 ? 2 : practicePercentage >= 10 ? 1 : 0;
        predicted = Math.round((examGradeNum * 0.7) + (practiceGradeNum * 0.3));
      } else if (recentExamCompletion) {
        predicted = recentExamCompletion.grade === 'U' ? 0 : parseInt(recentExamCompletion.grade) || 0;
      } else if (hasPracticeData) {
        const practiceGrade = practicePercentage >= 90 ? 9 : practicePercentage >= 80 ? 8 : practicePercentage >= 70 ? 7 : practicePercentage >= 60 ? 6 : practicePercentage >= 50 ? 5 : practicePercentage >= 40 ? 4 : practicePercentage >= 30 ? 3 : practicePercentage >= 20 ? 2 : practicePercentage >= 10 ? 1 : 0;
        predicted = practiceGrade;
      }
      
      if (predicted > 0) {
        overallPred += predicted;
        overallTarget += target;
        validSubjectsCount++;
      }
    });
    
    // Calculate averages
    const avgPred = validSubjectsCount > 0 ? parseFloat((overallPred / validSubjectsCount).toFixed(1)) : 0;
    const avgTarget = validSubjectsCount > 0 ? parseFloat((overallTarget / validSubjectsCount).toFixed(1)) : 0;
    
    // Calculate retention (average score from last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const recentProgress = userProgress.filter(p => 
      new Date(p.lastAttempt) >= sevenDaysAgo && p.averageScore > 0
    );
    const retention = recentProgress.length > 0
      ? recentProgress.reduce((sum, p) => sum + p.averageScore, 0) / (recentProgress.length * 100)
      : 0;
    
    // Calculate best study time based on performance by hour
    const hourlyPerformance: { [hour: number]: { total: number; count: number } } = {};
    
    userProgress.forEach(p => {
      if (p.averageScore > 0) {
        const hour = new Date(p.lastAttempt).getHours();
        if (!hourlyPerformance[hour]) {
          hourlyPerformance[hour] = { total: 0, count: 0 };
        }
        hourlyPerformance[hour].total += p.averageScore;
        hourlyPerformance[hour].count += 1;
      }
    });
    
    // Find the 2-hour window with best average performance
    let bestWindow = "--";
    let bestAverage = 0;
    
    if (Object.keys(hourlyPerformance).length > 0) {
      // Try all 2-hour windows
      for (let startHour = 0; startHour < 24; startHour++) {
        const endHour = (startHour + 2) % 24;
        let windowTotal = 0;
        let windowCount = 0;
        
        for (let h = startHour; h < startHour + 2; h++) {
          const hour = h % 24;
          if (hourlyPerformance[hour]) {
            windowTotal += hourlyPerformance[hour].total;
            windowCount += hourlyPerformance[hour].count;
          }
        }
        
        if (windowCount > 0) {
          const windowAvg = windowTotal / windowCount;
          if (windowAvg > bestAverage) {
            bestAverage = windowAvg;
            const endHour = (startHour + 2) % 24;
            const startHour12 = startHour === 0 ? 12 : startHour > 12 ? startHour - 12 : startHour;
            const endHour12 = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
            const period = endHour >= 12 ? 'pm' : 'am';
            bestWindow = `${startHour12}–${endHour12}${period}`;
          }
        }
      }
    }
    
    // For new users with no real data, set weekMinutes to 0
    const actualWeekMinutes = validSubjectsCount === 0 && userProgress.length === 0 ? 0 : weeklyStudyMinutes;
    
    return {
      name: getFirstName(),
      overallPred: avgPred,
      overallTarget: avgTarget,
      retention,
      bestWindow,
      weekMinutes: actualWeekMinutes
    };
  }, [userSubjectsWithGrades, userProgress, predictedGrades, weeklyStudyMinutes, user]);
  
  // Get subject icon emoji
  const getSubjectIconEmoji = (subjectId: string): string => {
    const emojiMap: { [key: string]: string } = {
      "physics": "🧲",
      "physics-edexcel": "🧲",
      "chemistry": "🧪",
      "chemistry-edexcel": "🧪",
      "biology": "🧬",
      "biology-edexcel": "🧬",
      "biology-aqa-alevel": "🧬",
      "combined-science-aqa": "💻",
      "mathematics": "📐",
      "maths-edexcel": "📐",
      "maths": "📐",
      "maths-aqa-alevel": "📐",
      "m6-statistics": "📊",
      "me6-statistics": "📊",
      "english-language": "✍️",
      "english-literature": "📖",
      "geography": "🌍",
      "geography-paper-2": "🌍",
      "history": "⏳",
      "religious-studies": "⛪",
      "business-edexcel-igcse": "💼",
      "business": "💼",
      "computer-science": "💻",
      "psychology": "🧠",
      "psychology-aqa-alevel": "🧠",
      "spanish-aqa": "🇪🇸",
    };
    return emojiMap[subjectId] || "📚";
  };

  // Convert userSubjectsWithGrades to mockSubjects format - only show subjects user has added
  const mockSubjects = userSubjectsWithGrades.length > 0 ? userSubjectsWithGrades
    .map((subject, index) => {
      // Derive subject ID from name and exam board (same logic as loadUserSubjects)
      const getSubjectId = (subjectName: string, examBoard: string): string => {
        const board = examBoard.toLowerCase();
        
        // Handle A-level subjects
        if (subjectName === "Biology (A-Level)" && board === "aqa") return "biology-aqa-alevel";
        if (subjectName === "Mathematics (A-Level)" && board === "aqa") return "maths-aqa-alevel";
        if (subjectName === "Psychology (A-Level)" && board === "aqa") return "psychology-aqa-alevel";
        
        // Handle subjects with exam board in name
        if (subjectName === "Chemistry (Edexcel)") return "chemistry-edexcel";
        if (subjectName === "Physics (Edexcel)") return "physics-edexcel";
        if (subjectName === "English Language (Edexcel)") return "edexcel-english-language";
        
        // Handle standard subjects
        if (subjectName === "Mathematics") return board === "edexcel" ? "maths-edexcel" : "maths";
        if (subjectName === "Physics") return board === "edexcel" ? "physics-edexcel" : "physics";
        if (subjectName === "Chemistry") return board === "edexcel" ? "chemistry-edexcel" : "chemistry";
        if (subjectName === "Biology") return "biology";
        if (subjectName === "IGCSE Business") return "business-edexcel-igcse";
        if (subjectName === "Business") return "business";
        if (subjectName === "English Language") return "english-language";
        if (subjectName === "English Literature") return "english-literature";
        if (subjectName === "Geography") return "geography";
        if (subjectName === "History") return "history";
        if (subjectName === "Religious Studies") return "religious-studies";
        if (subjectName === "Computer Science") return "computer-science";
        if (subjectName === "Spanish") return "spanish-aqa";
        
        // Fallback: try to find by name in curriculum
        const currSubject = curriculum.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        return currSubject?.id || subjectName.toLowerCase().replace(/\s+/g, '-');
      };
      
      const subjectId = getSubjectId(subject.subject_name, subject.exam_board);
      
      // Parse target grade
      const target = typeof subject.target_grade === 'string'
        ? parseFloat(subject.target_grade) || 7
        : subject.target_grade || 7;
      
      // Helper function to convert letter grades (A-Level) to numeric
      const convertGradeToNumeric = (grade: any): number => {
        if (typeof grade === 'number') return grade;
        if (grade === 'U' || grade === null || grade === undefined) return 0;
        
        const gradeStr = String(grade).trim().toUpperCase();
        const letterGradeMap: {[key: string]: number} = {
          'A*': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 3, 'G': 2, 'U': 0
        };
        
        if (letterGradeMap[gradeStr] !== undefined) {
          return letterGradeMap[gradeStr];
        }
        
        const numericGrade = parseFloat(gradeStr);
        return isNaN(numericGrade) ? 0 : numericGrade;
      };
      
      // Calculate predicted grade using same logic as PredictedGradesGraph
      let predicted: number | string = target;
      
      // Get practice progress for this subject
      const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
      const currSubject = curriculum.find(s => s.id === subjectId);
      const totalTopics = currSubject?.topics.length || 1;
      const totalScore = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0);
      const practicePercentage = Math.round(totalScore / totalTopics);
      
      // Get most recent predicted exam completion for this subject
      const recentExamCompletion = predictedGrades
        .filter(pg => pg.subject_id === subjectId)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
      
      console.log(`🔍 ${subjectId} - recentExamCompletion:`, recentExamCompletion?.grade, 'type:', typeof recentExamCompletion?.grade);
      
      const hasPracticeData = subjectProgress.length > 0;
      
      // Calculate combined grade with same weighted average as PredictedGradesGraph (70% exam, 30% practice)
      if (recentExamCompletion && hasPracticeData) {
        const examGradeNum = convertGradeToNumeric(recentExamCompletion.grade);
        const practiceGradeNum = practicePercentage >= 90 ? 9 : practicePercentage >= 80 ? 8 : practicePercentage >= 70 ? 7 : practicePercentage >= 60 ? 6 : practicePercentage >= 50 ? 5 : practicePercentage >= 40 ? 4 : practicePercentage >= 30 ? 3 : practicePercentage >= 20 ? 2 : practicePercentage >= 10 ? 1 : 0;
        const combinedGrade = Math.round((examGradeNum * 0.7) + (practiceGradeNum * 0.3));
        predicted = combinedGrade === 0 ? 'U' : combinedGrade;
        console.log(`📊 ${subjectId} predicted (combined):`, predicted, 'from exam:', examGradeNum, 'practice:', practiceGradeNum);
      } else if (recentExamCompletion) {
        // Only exam completion exists
        const examGradeNum = convertGradeToNumeric(recentExamCompletion.grade);
        predicted = examGradeNum === 0 ? 'U' : examGradeNum;
        console.log(`📊 ${subjectId} predicted (exam only):`, predicted, 'from grade:', recentExamCompletion.grade);
      } else if (hasPracticeData) {
        // Only practice data exists
        const practiceGrade = practicePercentage >= 90 ? 9 : practicePercentage >= 80 ? 8 : practicePercentage >= 70 ? 7 : practicePercentage >= 60 ? 6 : practicePercentage >= 50 ? 5 : practicePercentage >= 40 ? 4 : practicePercentage >= 30 ? 3 : practicePercentage >= 20 ? 2 : practicePercentage >= 10 ? 1 : 0;
        predicted = practiceGrade === 0 ? 'U' : practiceGrade;
      } else {
        // No exam or practice data - use predicted_grade from user_subjects
        const userSubjectPredictedGrade = convertGradeToNumeric(subject.predicted_grade);
        predicted = userSubjectPredictedGrade === 0 ? 'U' : userSubjectPredictedGrade;
      }
      
      // Get actual trend from last 6 exam attempts for this subject
      const trend = subject.last_6_scores || [0, 0, 0, 0, 0, 0];
      
      // Determine status
      const diff = typeof predicted === 'number' ? predicted - target : -999;
      let status = "On track";
      if (predicted === 'U') {
        status = "Not started";
      } else if (diff < -1) {
        status = "Off target";
      } else if (diff < 0) {
        status = "Needs push";
      }
      
      return {
        id: subjectId,
        name: (() => {
          // For A-Level subjects, replace "(A-Level)" with the exam board
          if (subject.subject_name.includes('(A-Level)')) {
            const baseName = subject.subject_name.replace('(A-Level)', '').trim();
            return `${baseName} (${subject.exam_board})`;
          }
          // Check if exam board is already in the subject name (for other subjects)
          const hasExamBoard = subject.subject_name.includes('(') && subject.subject_name.includes(')');
          if (hasExamBoard) {
            return subject.subject_name;
          }
          // Override exam board display for specific subjects
          if (subjectId === 'music-eduqas-gcse') {
            return `${subject.subject_name} (Eduqas)`;
          }
          // Use database exam board for others
          return `${subject.subject_name} (${subject.exam_board})`;
        })(),
        icon: getSubjectIconEmoji(subjectId),
        predicted: (() => {
          console.log(`✅ ${subjectId} final predicted:`, predicted, 'type:', typeof predicted);
          return predicted;
        })(),
        target: target,
        trend: trend,
        strong: "Various topics",
        focus: "Core concepts",
        status: status
      };
    })
    .filter(subject => subject.id !== 'geography-paper-2') : [];
  
  const weekPlan = {
    Mon:[{s:"Biology",t:"Genetics",m:25},{s:"Maths",t:"Algebra",m:20}],
    Tue:[{s:"Physics",t:"Forces",m:20}],
    Wed:[{s:"Chemistry",t:"Energetics",m:25}],
    Thu:[{s:"Maths",t:"Algebra (quiz)",m:20}],
    Fri:[{s:"Biology",t:"Cell Biology (recall)",m:15}],
    Sat:[{s:"Chemistry",t:"Quantitative (quiz)",m:20}],
    Sun:[{s:"Physics",t:"Electricity (flashcards)",m:15}]
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case "On track": return "bg-[#16A34A] text-white";
      case "Needs push": return "bg-[#F59E0B] text-white";
      case "Off target": return "bg-[#EF4444] text-white";
      case "Not started": return "bg-[#64748B] text-white";
      default: return "bg-gray-500 text-white";
    }
  };
  
  const calculateStatus = (predicted: number, target: number) => {
    if (predicted >= target) return "On track";
    if (predicted >= target - 0.5) return "Needs push";
    return "Off target";
  };

  const filteredSubjects = userSubjects.length > 0
    ? curriculum.filter((subject) => userSubjects.includes(subject.id))
    : [];

  const availableSubjects = curriculum.filter((subject) => !userSubjects.includes(subject.id));

  // Add subject function
  const addSubject = async (subjectId: string, targetGrade: string, examBoard: string = "AQA") => {
    if (!user?.id) return;
    
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return;

    try {
      // Determine if this is an A-level subject and modify the name accordingly
      const isALevel = subjectId.includes('alevel');
      const subjectName = isALevel ? `${subject.name} (A-Level)` : subject.name;
      
      // Check if subject already exists
      const { data: existing } = await supabase
        .from("user_subjects")
        .select("id")
        .eq("user_id", user.id)
        .eq("subject_name", subjectName)
        .eq("exam_board", examBoard)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already Added",
          description: `${subjectName} is already in your subjects`,
        });
        return;
      }

        const { error } = await supabase
          .from("user_subjects")
          .insert({
            user_id: user.id,
            subject_name: subjectName,
            exam_board: examBoard,
            predicted_grade: "0", // Start at 0 since no practice data yet
            target_grade: targetGrade
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

      // Reload subjects to update both userSubjects and userSubjectsWithGrades
      await loadUserSubjects();
      await loadWeeklyStudyMinutes();
      toast({
        title: "Success",
        description: `${subjectName} added to your subjects`,
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

  const updateTargetGrade = async (subjectName: string, examBoard: string, newTargetGrade: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from("user_subjects")
        .update({ target_grade: newTargetGrade })
        .eq("user_id", user.id)
        .eq("subject_name", subjectName)
        .eq("exam_board", examBoard);

      if (error) {
        console.error("Error updating target grade:", error);
        toast({
          title: "Error",
          description: "Failed to update target grade",
          variant: "destructive"
        });
        return;
      }

      await loadUserSubjects();
      await loadWeeklyStudyMinutes();
      toast({
        title: "Success",
        description: "Target grade updated",
      });
      setEditingTargetGrade(false);
    } catch (error) {
      console.error("Error updating target grade:", error);
      toast({
        title: "Error",
        description: "Failed to update target grade",
        variant: "destructive"
      });
    }
  };

  // Remove subject function
  const removeSubject = async (subjectId: string) => {
    if (!user?.id) return;
    
    // Find the database subject by matching subject ID generation logic
    const dbSubject = userSubjectsWithGrades.find((subject) => {
      const getSubjectId = (subjectName: string, examBoard: string): string => {
        const board = examBoard.toLowerCase();
        
        // Handle A-level subjects
        if (subjectName === "Biology (A-Level)" && board === "aqa") return "biology-aqa-alevel";
        if (subjectName === "Mathematics (A-Level)" && board === "aqa") return "maths-aqa-alevel";
        if (subjectName === "Psychology (A-Level)" && board === "aqa") return "psychology-aqa-alevel";
        
        // Handle subjects with exam board in name
        if (subjectName === "Chemistry (Edexcel)") return "chemistry-edexcel";
        if (subjectName === "Physics (Edexcel)") return "physics-edexcel";
        if (subjectName === "English Language (Edexcel)") return "edexcel-english-language";
        
        // Handle standard subjects
        if (subjectName === "Mathematics") return board === "edexcel" ? "maths-edexcel" : "maths";
        if (subjectName === "Physics") return board === "edexcel" ? "physics-edexcel" : "physics";
        if (subjectName === "Chemistry") return board === "edexcel" ? "chemistry-edexcel" : "chemistry";
        if (subjectName === "Biology") return "biology";
        if (subjectName === "IGCSE Business") return "business-edexcel-igcse";
        if (subjectName === "Business") return "business";
        if (subjectName === "English Language") return "english-language";
        if (subjectName === "English Literature") return "english-literature";
        if (subjectName === "Geography") return "geography";
        if (subjectName === "History") return "history";
        if (subjectName === "Religious Studies") return "religious-studies";
        if (subjectName === "Computer Science") return "computer-science";
        if (subjectName === "Spanish") return "spanish-aqa";
        
        // Fallback: try to find by name in curriculum
        const currSubject = curriculum.find(s => s.name.toLowerCase() === subjectName.toLowerCase());
        return currSubject?.id || subjectName.toLowerCase().replace(/\s+/g, '-');
      };
      
      return getSubjectId(subject.subject_name, subject.exam_board) === subjectId;
    });
    
    if (!dbSubject) {
      console.error("Could not find subject to remove:", subjectId);
      toast({
        title: "Error",
        description: "Could not find subject to remove",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("user_subjects")
        .delete()
        .eq("user_id", user.id)
        .eq("subject_name", dbSubject.subject_name)
        .eq("exam_board", dbSubject.exam_board);

      if (error) {
        console.error("Error removing subject:", error);
        toast({
          title: "Error",
          description: "Failed to remove subject",
          variant: "destructive"
        });
        return;
      }

      // Reload subjects to update both userSubjects and userSubjectsWithGrades
      await loadUserSubjects();
      await loadWeeklyStudyMinutes();
      toast({
        title: "Success",
        description: `${dbSubject.subject_name} removed from your subjects`,
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
        ) : subject.id === 'spanish-aqa' ? (
          // Spanish AQA has 4 papers: Foundation/Higher Reading & Writing
          <div className="flex flex-col items-center mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Paper 3 Foundation Reading */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (subject.topics.length * 0.1) + 0.1 }}
              >
                <motion.button
                  onClick={isPremium ? () => navigate("/predicted-exam/spanish-aqa-paper-3-foundation") : () => navigate("/pricing")}
                  className="relative w-20 h-20 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-6 w-6 text-white absolute inset-0 m-auto">
                    {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
                  </div>
                </motion.button>
                
                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-foreground">
                    Paper 3: Reading
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Foundation
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground">Premium Required</p>
                  )}
                </div>
              </motion.div>

              {/* Paper 3 Higher Reading */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (subject.topics.length * 0.1) + 0.2 }}
              >
                <motion.button
                  onClick={isPremium ? () => navigate("/predicted-exam/spanish-aqa-paper-3-higher") : () => navigate("/pricing")}
                  className="relative w-20 h-20 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-6 w-6 text-white absolute inset-0 m-auto">
                    {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
                  </div>
                </motion.button>
                
                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-foreground">
                    Paper 3: Reading
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Higher
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground">Premium Required</p>
                  )}
                </div>
              </motion.div>

              {/* Paper 4 Foundation Writing */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (subject.topics.length * 0.1) + 0.3 }}
              >
                <motion.button
                  onClick={isPremium ? () => navigate("/predicted-exam/spanish-aqa-paper-4-foundation") : () => navigate("/pricing")}
                  className="relative w-20 h-20 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-6 w-6 text-white absolute inset-0 m-auto">
                    {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
                  </div>
                </motion.button>
                
                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-foreground">
                    Paper 4: Writing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Foundation
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground">Premium Required</p>
                  )}
                </div>
              </motion.div>

              {/* Paper 4 Higher Writing */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (subject.topics.length * 0.1) + 0.4 }}
              >
                <motion.button
                  onClick={isPremium ? () => navigate("/predicted-exam/spanish-aqa-paper-4-higher") : () => navigate("/pricing")}
                  className="relative w-20 h-20 rounded-full border-4 border-orange-400 shadow-xl bg-gradient-to-br from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="h-6 w-6 text-white absolute inset-0 m-auto">
                    {isPremium ? <Trophy className="h-full w-full" /> : <Lock className="h-full w-full" />}
                  </div>
                </motion.button>
                
                <div className="text-center mt-2">
                  <p className="text-xs font-bold text-foreground">
                    Paper 4: Writing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Higher
                  </p>
                  {!isPremium && (
                    <p className="text-xs text-muted-foreground">Premium Required</p>
                  )}
                </div>
              </motion.div>
            </div>
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
    <div className="min-h-screen bg-background flex">
      {/* Left Navigation Sidebar - Desktop Only */}
      <div className="hidden lg:flex flex-col w-24 border-r border-border bg-background/50 backdrop-blur-sm sticky top-0 h-screen py-8">
        <div className="flex flex-col items-center gap-6 flex-1">
          {/* Learn Tab */}
          <button
            onClick={() => setActiveTab("learn")}
            className={`group relative flex flex-col items-center gap-2 transition-all duration-300 ${
              activeTab === "learn" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                activeTab === "learn"
                  ? "bg-gradient-to-br from-blue-400 to-blue-500 shadow-lg shadow-blue-500/50"
                  : "bg-blue-100 dark:bg-blue-900/20 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30"
              }`}
            >
              <Home className={`w-7 h-7 ${activeTab === "learn" ? "text-white" : "text-blue-600 dark:text-blue-400"}`} />
            </div>
            <span
              className={`text-xs font-bold tracking-wide ${
                activeTab === "learn" ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"
              }`}
            >
              LEARN
            </span>
          </button>

          {/* Quests Tab */}
          <button
            onClick={() => setActiveTab("quests")}
            className={`group relative flex flex-col items-center gap-2 transition-all duration-300 ${
              activeTab === "quests" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                activeTab === "quests"
                  ? "bg-gradient-to-br from-green-400 to-green-500 shadow-lg shadow-green-500/50"
                  : "bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-900/30"
              }`}
            >
              <Star className={`w-7 h-7 ${activeTab === "quests" ? "text-white" : "text-green-600 dark:text-green-400"}`} />
            </div>
            <span
              className={`text-xs font-bold tracking-wide ${
                activeTab === "quests" ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
              }`}
            >
              QUESTS
            </span>
          </button>

          {/* Leaderboard Tab */}
          <button
            onClick={() => setActiveTab("leaderboards")}
            className={`group relative flex flex-col items-center gap-2 transition-all duration-300 ${
              activeTab === "leaderboards" ? "scale-110" : "hover:scale-105"
            }`}
          >
            <div
              className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                activeTab === "leaderboards"
                  ? "bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50"
                  : "bg-yellow-100 dark:bg-yellow-900/20 group-hover:bg-yellow-200 dark:group-hover:bg-yellow-900/30"
              }`}
            >
              <Trophy className={`w-7 h-7 ${activeTab === "leaderboards" ? "text-white" : "text-yellow-600 dark:text-yellow-400"}`} />
            </div>
            <span
              className={`text-xs font-bold tracking-wide ${
                activeTab === "leaderboards" ? "text-yellow-600 dark:text-yellow-400" : "text-muted-foreground"
              }`}
            >
              BOARD
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={mentioraLogo} alt="Mentiora Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-foreground">Mentiora</h1>
            {isPremium && <Crown className="w-5 h-5 text-yellow-500" />}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Streak Badge */}
            <HeaderStreakBadge 
              streakCount={currentStreak}
              isVisible={showStreakBadge}
              onClick={() => setShowDailyStreak(true)}
              isStreakLost={currentStreak === 0}
              isMilestone={streakBadgeMilestone}
            />
            
            <ThemeToggle />
            
            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-transparent hover:text-[#0EA5E9] transition-colors duration-200"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background z-50">
                <DropdownMenuItem
                  data-feedback-fish
                  data-feedback-fish-userid={user?.email || ""}
                  className="cursor-pointer"
                >
                  Feedback
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => window.open('https://discord.gg/NUy3u3A65B', '_blank')}
                  className="cursor-pointer"
                >
                  Discord
                </DropdownMenuItem>
                {isPremium && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={openManageBilling}
                      className="cursor-pointer"
                    >
                      Manage Billing
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2 relative">
            {/* Streak Badge for Mobile */}
            <HeaderStreakBadge 
              streakCount={currentStreak}
              isVisible={showStreakBadge}
              onClick={() => setShowDailyStreak(true)}
              isStreakLost={currentStreak === 0}
              isMilestone={streakBadgeMilestone}
            />
            
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="hover:bg-transparent hover:text-[#0EA5E9]"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setMobileMenuOpen(false)}
                />
                
                {/* Dropdown */}
                <div className="absolute right-0 top-12 z-50 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="py-2">
                    <button
                      data-feedback-fish
                      data-feedback-fish-userid={user?.email || ""}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Feedback
                    </button>
                    <button
                      onClick={() => {
                        window.open('https://discord.gg/NUy3u3A65B', '_blank');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      Discord
                    </button>
                    {isPremium && (
                      <button
                        onClick={() => {
                          openManageBilling();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
                      >
                        Manage Billing
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <div className={`max-w-7xl mx-auto ${isMobile ? 'p-4' : 'p-8'}`}>
          {activeTab === "learn" && (
            <div className="max-w-7xl mx-auto">
              {!selectedSubject ? (
                <>
                <MedlySubjectsView
                  profile={profile}
                  mockSubjects={mockSubjects}
                  weekPlan={weekPlan}
                  getStatusColor={getStatusColor}
                  weekTasksCompleted={weekTasksCompleted}
                  setWeekTasksCompleted={setWeekTasksCompleted}
                  setShowAddSubjects={setShowAddSubjects}
                  setSelectedDrawerSubject={setSelectedDrawerSubject}
                  setSubjectDrawerOpen={setSubjectDrawerOpen}
                  setDrawerTab={setDrawerTab}
                  insightFilter={insightFilter}
                  setInsightFilter={setInsightFilter}
                  removeSubject={removeSubject}
                  isPremium={isPremium}
                  onUpgradeToPremium={() => navigate('/pricing')}
                />
                </>
              ) : (
                // Subject Path View (when a subject is selected for practice)
                <div>
                  <div className="flex items-center mb-8">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedSubject(null)}
                      className="text-muted-foreground hover:text-foreground mr-4 rounded-xl"
                    >
                      ← Back
                    </Button>
                    <h2 className="text-3xl font-semibold text-foreground">
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

              {/* Subject Detail Drawer */}
              <Sheet open={subjectDrawerOpen} onOpenChange={setSubjectDrawerOpen}>
                <SheetContent side="right" className={`w-full ${isDrawerMaximized ? 'sm:max-w-full' : 'sm:max-w-3xl'} overflow-y-auto bg-gradient-to-br from-background to-muted/30 transition-all duration-300 p-4 sm:p-6`}>
                  {selectedDrawerSubject && (
                    <>
                      <SheetHeader className="space-y-3 sm:space-y-6 pb-4 sm:pb-8 border-b border-border">
                        <div className="flex items-center gap-3 sm:gap-5">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="p-2 sm:p-4 rounded-xl sm:rounded-2xl bg-primary/10 shadow-md text-2xl sm:text-4xl flex-shrink-0"
                          >
                            {getSubjectIconEmoji(selectedDrawerSubject.id)}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <SheetTitle className="text-xl sm:text-3xl font-bold tracking-tight truncate">
                              {getSubjectDisplayName(selectedDrawerSubject)}
                            </SheetTitle>
                            <SheetDescription className="text-sm sm:text-base mt-0.5 sm:mt-1 font-medium hidden sm:block">
                              Detailed performance insights
                            </SheetDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setIsDrawerMaximized(!isDrawerMaximized)}
                            className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex-shrink-0 hidden sm:flex"
                          >
                            {isDrawerMaximized ? (
                              <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </Button>
                        </div>
                        <div className="flex gap-2 sm:gap-3 flex-wrap">
                          {(() => {
                            // Helper to check if subject is A-Level
                            const isALevel = selectedDrawerSubject.id.toLowerCase().includes('alevel');
                            
                            // Helper to convert numeric grade to display grade
                            const getDisplayGrade = (numericGrade: number | string) => {
                              // Handle string letter grades first
                              if (typeof numericGrade === 'string') {
                                const upperGrade = numericGrade.trim().toUpperCase();
                                // If it's already a letter grade, return it
                                if (['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'].includes(upperGrade)) {
                                  return upperGrade;
                                }
                                // Try to parse as number
                                const parsed = parseFloat(numericGrade);
                                if (isNaN(parsed) || parsed === 0) return 'U';
                                numericGrade = parsed;
                              }
                              
                              const num = typeof numericGrade === 'number' ? numericGrade : 0;
                              console.log(`🎯 getDisplayGrade called with:`, numericGrade, '(type:', typeof numericGrade, ') num:', num, 'isALevel:', isALevel);
                              if (num === 0) return 'U';
                              if (!isALevel) return num.toString();
                              
                              // Convert numeric grade (1-9) to A-Level letter grade
                              if (num >= 8.5) return 'A*';
                              if (num >= 7.5) return 'A';
                              if (num >= 6.5) return 'B';
                              if (num >= 5.5) return 'C';
                              if (num >= 4.5) return 'D';
                              if (num >= 2.5) return 'E';
                              return 'U';
                            };
                            
                            // Helper to convert letter grade to numeric (for saving to DB)
                            const letterToNumeric = (letter: string) => {
                              const map: {[key: string]: number} = {
                                'A*': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'U': 1
                              };
                              return map[letter] || parseInt(letter);
                            };
                            
                            return (
                              <>
                                <Badge className="rounded-lg sm:rounded-xl px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold shadow-sm text-xs sm:text-sm">
                                  Predicted {(() => {
                                    console.log(`🎯 Drawer Badge - selectedDrawerSubject.predicted:`, selectedDrawerSubject.predicted, 'type:', typeof selectedDrawerSubject.predicted);
                                    return getDisplayGrade(selectedDrawerSubject.predicted);
                                  })()}
                                </Badge>
                                <Select
                                  value={getDisplayGrade(selectedDrawerSubject.target)}
                                  onValueChange={(value) => {
                                    const subjectBaseName = getSubjectDisplayName(selectedDrawerSubject).split(' (')[0];
                                    const subjectNameToFind = isALevel ? `${subjectBaseName} (A-Level)` : subjectBaseName;
                                    
                                    const subjectData = userSubjectsWithGrades.find(
                                      s => s.subject_name === subjectNameToFind
                                    );
                                    
                                    if (subjectData) {
                                      const valueToSave = isALevel ? letterToNumeric(value).toString() : value;
                                      updateTargetGrade(subjectData.subject_name, subjectData.exam_board, valueToSave);
                                      
                                      const newTarget = isALevel ? letterToNumeric(value) : parseInt(value);
                                      setSelectedDrawerSubject({
                                        ...selectedDrawerSubject,
                                        target: newTarget
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger className="rounded-lg sm:rounded-xl px-3 sm:px-4 py-1 sm:py-1.5 border-2 border-primary text-primary bg-background font-semibold text-xs sm:text-sm w-auto">
                                    <SelectValue>Target {getDisplayGrade(selectedDrawerSubject.target)}</SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {isALevel ? (
                                      ['A*', 'A', 'B', 'C', 'D', 'E'].map(grade => (
                                        <SelectItem key={grade} value={grade}>Target {grade}</SelectItem>
                                      ))
                                    ) : (
                                      [9, 8, 7, 6, 5, 4, 3, 2, 1].map(grade => (
                                        <SelectItem key={grade} value={grade.toString()}>Target {grade}</SelectItem>
                                      ))
                                    )}
                                  </SelectContent>
                                </Select>
                              </>
                            );
                          })()}
                        </div>
                      </SheetHeader>

                      <Tabs value={drawerTab} onValueChange={(v) => setDrawerTab(v as any)} className="mt-4 sm:mt-8">
                        {/* Mobile Dropdown */}
                        <div className="sm:hidden">
                          <Select value={drawerTab} onValueChange={(v) => setDrawerTab(v as any)}>
                            <SelectTrigger className="w-full rounded-xl bg-background border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-border">
                              <SelectItem value="overview">Overview</SelectItem>
                              <SelectItem value="topics">Topics</SelectItem>
                              <SelectItem value="papers">Papers</SelectItem>
                              <SelectItem value="plan">Plan</SelectItem>
                              <SelectItem value="notes">Notes</SelectItem>
                              <SelectItem value="flashcards">Flashcards</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {/* Desktop Tabs */}
                        <TabsList className="hidden sm:grid w-full grid-cols-6 rounded-2xl p-1.5 bg-muted border border-border">
                          <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Overview
                          </TabsTrigger>
                          <TabsTrigger value="topics" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Topics
                          </TabsTrigger>
                          <TabsTrigger value="papers" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Papers
                          </TabsTrigger>
                          <TabsTrigger value="plan" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Plan
                          </TabsTrigger>
                          <TabsTrigger value="notes" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Notes
                          </TabsTrigger>
                          <TabsTrigger value="flashcards" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold">
                            Flashcards
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4 sm:space-y-6 mt-4 sm:mt-8">
                          {/* Performance Stats */}
                          <div className="grid grid-cols-3 gap-2 sm:gap-4">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              {(() => {
                                const subjectId = selectedDrawerSubject?.id || '';
                                
                                // Get all progress for this subject with scores > 0
                                const subjectProgress = userProgress.filter(p => 
                                  p.subjectId === subjectId && p.averageScore > 0
                                );
                                
                                if (subjectProgress.length === 0) {
                                  return (
                                    <Card className="rounded-3xl border border-[#94A3B8]/20 bg-gradient-to-br from-white to-[#94A3B8]/5 dark:from-gray-900 dark:to-[#94A3B8]/10 shadow-sm hover:shadow-lg transition-all duration-300">
                                      <CardContent className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="p-1.5 rounded-lg bg-[#94A3B8]/10">
                                            <TrendingUp className="h-4 w-4 text-[#94A3B8]" />
                                          </div>
                                          <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Recent Trend</div>
                                        </div>
                                        <div className="text-3xl font-bold text-[#94A3B8]">
                                          --
                                        </div>
                                      </CardContent>
                                    </Card>
                                  );
                                }
                                
                                // Sort by last attempt date
                                const sorted = [...subjectProgress].sort((a, b) => 
                                  new Date(b.lastAttempt).getTime() - new Date(a.lastAttempt).getTime()
                                );
                                
                                // Get last 3 attempts average
                                const recentAttempts = sorted.slice(0, 3);
                                const recentAvg = recentAttempts.reduce((sum, p) => sum + p.averageScore, 0) / recentAttempts.length;
                                
                                // Get overall average
                                const overallAvg = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length;
                                
                                // Calculate difference
                                const change = recentAvg - overallAvg;
                                const isPositive = change >= 0;
                                const sign = isPositive ? '+' : '';
                                
                                return (
                                  <Card className={`rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 ${
                                    isPositive 
                                      ? 'border-[#16A34A]/20 bg-gradient-to-br from-white to-[#16A34A]/5 dark:from-gray-900 dark:to-[#16A34A]/10 hover:shadow-[#16A34A]/10'
                                      : 'border-[#EF4444]/20 bg-gradient-to-br from-white to-[#EF4444]/5 dark:from-gray-900 dark:to-[#EF4444]/10 hover:shadow-[#EF4444]/10'
                                  }`}>
                                    <CardContent className="p-5">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-lg ${isPositive ? 'bg-[#16A34A]/10' : 'bg-[#EF4444]/10'}`}>
                                          {isPositive ? (
                                            <TrendingUp className={`h-4 w-4 ${isPositive ? 'text-[#16A34A]' : 'text-[#EF4444]'}`} />
                                          ) : (
                                            <TrendingDown className="h-4 w-4 text-[#EF4444]" />
                                          )}
                                        </div>
                                        <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Recent Trend</div>
                                      </div>
                                      <div className={`text-3xl font-bold flex items-center gap-2 ${
                                        isPositive ? 'text-[#16A34A]' : 'text-[#EF4444]'
                                      }`}>
                                        {sign}{Math.abs(change).toFixed(1)}%
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              })()}
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }}
                            >
                              <Card className="rounded-3xl border border-[#0EA5E9]/20 bg-gradient-to-br from-white to-[#0EA5E9]/5 dark:from-gray-900 dark:to-[#0EA5E9]/10 shadow-sm hover:shadow-lg hover:shadow-[#0EA5E9]/10 transition-all duration-300">
                                <CardContent className="p-5">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-lg bg-[#0EA5E9]/10">
                                      <Target className="h-4 w-4 text-[#0EA5E9]" />
                                    </div>
                                    <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Accuracy</div>
                                  </div>
                                  <div className="text-3xl font-bold text-[#0F172A] dark:text-white">
                                    {(() => {
                                      // Use the subject ID directly from selectedDrawerSubject
                                      const subjectId = selectedDrawerSubject?.id || '';
                                      // Only include topics with scores > 0
                                      const subjectExams = userProgress.filter(p => p.subjectId === subjectId && p.averageScore > 0);
                                      
                                      if (subjectExams.length === 0) return '0';
                                      
                                      // Calculate overall accuracy from all attempts (excluding 0% scores)
                                      const totalScore = subjectExams.reduce((sum, p) => {
                                        const contribution = p.averageScore * p.attempts;
                                        return sum + contribution;
                                      }, 0);
                                      const totalAttempts = subjectExams.reduce((sum, p) => sum + p.attempts, 0);
                                      const accuracy = totalAttempts > 0 ? (totalScore / totalAttempts) : 0;
                                      
                                      return Math.round(accuracy);
                                    })()}%
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Card className="rounded-3xl border border-[#F59E0B]/20 bg-gradient-to-br from-white to-[#F59E0B]/5 dark:from-gray-900 dark:to-[#F59E0B]/10 shadow-sm hover:shadow-lg hover:shadow-[#F59E0B]/10 transition-all duration-300">
                                <CardContent className="p-5">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="p-1.5 rounded-lg bg-[#F59E0B]/10">
                                      <Clock className="h-4 w-4 text-[#F59E0B]" />
                                    </div>
                                    <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Time Saved</div>
                                  </div>
                                  <div className="text-3xl font-bold text-[#0F172A] dark:text-white">
                                    {subjectStudyTime.hours}h {subjectStudyTime.minutes}m
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </div>

                          {/* Performance Chart */}
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Performance Comparison</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 p-6">
                              {(() => {
                                // Use the subject ID directly instead of mapping from name
                                const subjectIdToMatch = selectedDrawerSubject?.id || '';
                                const curriculumSubject = curriculum.find(c => c.id === subjectIdToMatch);
                                
                                // Helper to check if subject is A-Level
                                const isALevel = subjectIdToMatch.toLowerCase().includes('alevel');
                                
                                // Helper to convert numeric grade to display grade
                                const getDisplayGrade = (numericGrade: number | string) => {
                                  // Handle string letter grades first
                                  if (typeof numericGrade === 'string') {
                                    const upperGrade = numericGrade.trim().toUpperCase();
                                    // If it's already a letter grade, return it
                                    if (['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'].includes(upperGrade)) {
                                      return upperGrade;
                                    }
                                    // Try to parse as number
                                    const parsed = parseFloat(numericGrade);
                                    if (isNaN(parsed) || parsed === 0) return 'U';
                                    numericGrade = parsed;
                                  }
                                  
                                  const num = typeof numericGrade === 'number' ? numericGrade : 0;
                                  if (num === 0) return 'U';
                                  if (!isALevel) return num.toFixed(1);
                                  
                                  // Convert numeric grade (1-9) to A-Level letter grade
                                  if (num >= 8.5) return 'A*';
                                  if (num >= 7.5) return 'A';
                                  if (num >= 6.5) return 'B';
                                  if (num >= 5.5) return 'C';
                                  if (num >= 4.5) return 'D';
                                  if (num >= 2.5) return 'E';
                                  return 'U';
                                };
                                
                                // Get user's predicted grade for this subject using the direct subject ID
                                const userPredictedGrade = predictedGrades.find(pg => pg.subject_id === subjectIdToMatch);
                                let predictedGradeValue = 0; // default to 0 if no grade yet
                                
                                if (userPredictedGrade) {
                                  // Parse the grade
                                  if (typeof userPredictedGrade.grade === 'string') {
                                    const numGrade = parseFloat(userPredictedGrade.grade);
                                    if (!isNaN(numGrade)) {
                                      predictedGradeValue = numGrade;
                                    } else {
                                      // Convert letter grade to number
                                      const gradeMap: {[key: string]: number} = {
                                        'A*': 9, 'A': 8, 'B': 7, 'C': 6, 'D': 5, 'E': 4, 'F': 3, 'G': 2, 'U': 1
                                      };
                                      predictedGradeValue = gradeMap[userPredictedGrade.grade.toUpperCase()] || 0;
                                    }
                                  } else {
                                    predictedGradeValue = userPredictedGrade.grade || 0;
                                  }
                                } else {
                                  // Fallback: calculate from subject performance
                                  const subjectPerf = userSubjectsWithGrades.find(s => {
                                    return curriculumSubject && s.subject_name === curriculumSubject.name;
                                  });
                                  
                                  if (subjectPerf?.accuracy_rate && subjectPerf.accuracy_rate > 0) {
                                    // Rough conversion: accuracy to grade (70% = grade 4, 90% = grade 9)
                                    predictedGradeValue = Math.max(1, Math.min(9, Math.round((subjectPerf.accuracy_rate / 10) - 3)));
                                  }
                                }
                                
                                // Get platform average for this subject (average of all students)
                                const classMedianValue = classMedianGrades[subjectIdToMatch] || 0;
                                
                                // Get target grade
                                const targetGradeValue = selectedDrawerSubject.target || 7;
                                
                                return (
                                  <>
                                    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Predicted Grade</span>
                                        <span className="text-lg font-bold text-[#0F172A] dark:text-white">{getDisplayGrade(predictedGradeValue)}</span>
                                      </div>
                                      <div className="w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-800 dark:to-gray-700 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${((Math.max(1, predictedGradeValue) - 1) / 8) * 100}%` }}
                                          transition={{ duration: 1, delay: 0.3 }}
                                          className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Target Grade</span>
                                        <span className="text-lg font-bold text-[#0F172A] dark:text-white">{getDisplayGrade(typeof targetGradeValue === 'number' ? targetGradeValue : parseFloat(targetGradeValue) || 0)}</span>
                                      </div>
                                      <div className="w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-800 dark:to-gray-700 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${((Math.max(1, targetGradeValue) - 1) / 8) * 100}%` }}
                                          transition={{ duration: 1, delay: 0.4 }}
                                          className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full shadow-sm"
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-3 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Mentiora Average</span>
                                        <span className="text-lg font-bold text-[#0F172A] dark:text-white">{getDisplayGrade(classMedianValue)}</span>
                                      </div>
                                      <div className="w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-800 dark:to-gray-700 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${((Math.max(1, classMedianValue) - 1) / 8) * 100}%` }}
                                          transition={{ duration: 1, delay: 0.5 }}
                                          className="h-full bg-gradient-to-r from-[#64748B] to-[#94A3B8] rounded-full shadow-sm"
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="topics" className="space-y-4 mt-8">
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Topic Mastery</CardTitle>
                              <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium">Track your progress across all topics</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                              {(() => {
                                // Get topics only from the selected drawer subject
                                const topicsList: { name: string; mastery: number; color: string; subjectId: string; topicId: string }[] = [];
                                
                                if (selectedDrawerSubject) {
                                  const subject = curriculum.find(s => s.id === selectedDrawerSubject.id);
                                  if (subject) {
                                    subject.topics.forEach(topic => {
                                      const topicProgress = userProgress.find(
                                        p => p.subjectId === selectedDrawerSubject.id && p.topicId === topic.id
                                      );
                                      const mastery = topicProgress?.averageScore || 0;
                                      
                                      // Determine color based on mastery
                                      let color = 'from-[#EF4444] to-[#DC2626]'; // Red for low
                                      if (mastery >= 85) {
                                        color = 'from-[#16A34A] to-[#22C55E]'; // Green for high
                                      } else if (mastery >= 70) {
                                        color = 'from-[#F59E0B] to-[#F97316]'; // Orange for medium
                                      } else if (mastery >= 50) {
                                        color = 'from-[#F59E0B] to-[#D97706]'; // Yellow-orange
                                      }
                                      
                                      topicsList.push({
                                        name: topic.name,
                                        mastery,
                                        color,
                                        subjectId: selectedDrawerSubject.id,
                                        topicId: topic.id
                                      });
                                    });
                                  }
                                }
                                
                                // Keep topics in original curriculum order
                                
                                if (topicsList.length === 0) {
                                  return (
                                    <div className="text-center py-8 text-muted-foreground">
                                      No topics available. Add subjects to see topic mastery.
                                    </div>
                                  );
                                }
                                
                                return topicsList.map((topic, i) => (
                                  <motion.div 
                                    key={`${topic.subjectId}-${topic.topicId}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="space-y-3 p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-base font-bold text-[#0F172A] dark:text-white">{topic.name}</span>
                                      <div className="flex items-center gap-3">
                                        <span className="text-base font-semibold text-[#64748B] dark:text-gray-400">{topic.mastery}%</span>
                                        <Button 
                                          size="sm" 
                                          onClick={() => navigate(`/practice/${topic.subjectId}/${topic.topicId}`)}
                                          className="rounded-xl h-8 px-3 text-xs bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-semibold shadow-md shadow-[#0EA5E9]/25"
                                        >
                                          Revise
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-800 rounded-full overflow-hidden shadow-inner">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${topic.mastery}%` }}
                                        transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                                        className={`h-full bg-gradient-to-r ${topic.color} rounded-full shadow-sm`}
                                      />
                                    </div>
                                  </motion.div>
                                ));
                              })()}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="papers" className="space-y-4 mt-8">
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader className="pb-4">
                              <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                                Predicted 2026 {selectedDrawerSubject.id === 'geography' ? 'Exams' : 'Exam'}
                              </CardTitle>
                              <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium">
                                Practice with AI-generated predicted exam {selectedDrawerSubject.id === 'geography' ? 'papers' : 'paper'}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                              {(() => {
                                const subjectEmoji = getSubjectIconEmoji(selectedDrawerSubject.id);
                                const subjectName = getSubjectDisplayName(selectedDrawerSubject);
                                
                                // For Geography, show both Paper 1 and Paper 2
                                if (selectedDrawerSubject.id === 'geography') {
                                  return (
                                    <>
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        onClick={() => isPremium ? navigate('/predicted-exam/geography') : navigate('/pricing')}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 text-2xl">
                                            {subjectEmoji}
                                          </div>
                                          <div>
                                            <div className="font-bold text-base text-[#0F172A] dark:text-white mb-1">{subjectName}</div>
                                            <div className="text-sm text-[#64748B] dark:text-gray-400 font-medium">2026 Predicted Paper 1</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <Badge className="rounded-xl px-3 py-1 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white font-semibold text-xs">
                                            Start
                                          </Badge>
                                        </div>
                                      </motion.div>
                                      <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        onClick={() => isPremium ? navigate('/predicted-exam/geography-paper-2') : navigate('/pricing')}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                      >
                                        <div className="flex items-center gap-4">
                                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 text-2xl">
                                            {subjectEmoji}
                                          </div>
                                          <div>
                                            <div className="font-bold text-base text-[#0F172A] dark:text-white mb-1">{subjectName}</div>
                                            <div className="text-sm text-[#64748B] dark:text-gray-400 font-medium">2026 Predicted Paper 2</div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <Badge className="rounded-xl px-3 py-1 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white font-semibold text-xs">
                                            Start
                                          </Badge>
                                        </div>
                                      </motion.div>
                                    </>
                                  );
                                }
                                
                                // For other subjects, show single paper
                                const paperMatch = selectedDrawerSubject.id.match(/paper-(\d+)/i);
                                const paperNumber = paperMatch ? paperMatch[1] : '1';
                                
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => isPremium ? navigate(`/predicted-exam/${selectedDrawerSubject.id}`) : navigate('/pricing')}
                                    className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 text-2xl">
                                        {subjectEmoji}
                                      </div>
                                      <div>
                                        <div className="font-bold text-base text-[#0F172A] dark:text-white mb-1">{subjectName}</div>
                                        <div className="text-sm text-[#64748B] dark:text-gray-400 font-medium">2026 Predicted Paper {paperNumber}</div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <Badge className="rounded-xl px-3 py-1 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white font-semibold text-xs">
                                        Start
                                      </Badge>
                                    </div>
                                  </motion.div>
                                );
                              })()}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="plan" className="space-y-4 mt-8">
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                              <div>
                                <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Adaptive 7-Day Study Plan</CardTitle>
                                <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium mt-1">
                                  Automatically adjusts based on your performance and practice history
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3 p-6">
                              {(() => {
                                // Generate adaptive plan based on user progress
                                const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                                const now = new Date();
                                
                                // Calculate priority score for each topic based on performance and recency
                                const calculateTopicPriority = (progress: UserProgress) => {
                                  const daysSinceLastAttempt = progress.lastAttempt 
                                    ? (now.getTime() - new Date(progress.lastAttempt).getTime()) / (1000 * 60 * 60 * 24)
                                    : 999;
                                  
                                  // Priority factors:
                                  // 1. Lower score = higher priority (weight: 2x)
                                  // 2. More days since last attempt = higher priority
                                  // 3. Few attempts = higher priority (need more practice)
                                  const scorePriority = (100 - progress.averageScore) * 2;
                                  const recencyPriority = Math.min(daysSinceLastAttempt * 10, 100);
                                  const attemptsPriority = Math.max(50 - (progress.attempts * 5), 0);
                                  
                                  return scorePriority + recencyPriority + attemptsPriority;
                                };
                                
                                // Get all topics for this subject from user progress
                                let subjectTopics = userProgress
                                  .filter(p => p.subjectId === selectedDrawerSubject.id)
                                  .map(p => ({
                                    ...p,
                                    priority: calculateTopicPriority(p)
                                  }))
                                  .sort((a, b) => b.priority - a.priority);
                                
                                // If no progress data, initialize from curriculum
                                if (subjectTopics.length === 0) {
                                  const curriculumSubject = curriculum.find(s => s.id === selectedDrawerSubject.id);
                                  if (curriculumSubject?.topics) {
                                    subjectTopics = curriculumSubject.topics.slice(0, 7).map(t => ({
                                      subjectId: selectedDrawerSubject.id,
                                      topicId: t.id,
                                      averageScore: 0,
                                      attempts: 0,
                                      lastAttempt: new Date(0),
                                      priority: 999
                                    }));
                                  }
                                }
                                
                                // Identify weak topics (score < 70) for focused practice
                                const weakTopics = subjectTopics.filter(t => t.averageScore < 70 && t.attempts > 0);
                                const needsAttention = subjectTopics.filter(t => t.attempts === 0 || t.averageScore < 50);
                                
                                // Distribute topics across the week intelligently
                                const getTopicForDay = (dayIndex: number) => {
                                  // For early week (Mon-Wed), focus on weakest topics
                                  if (dayIndex < 3) {
                                    return needsAttention[dayIndex % needsAttention.length] || subjectTopics[dayIndex % subjectTopics.length];
                                  }
                                  // Mid-week (Thu-Fri), mix weak and moderate topics
                                  else if (dayIndex < 5) {
                                    return weakTopics.length > 0 
                                      ? weakTopics[dayIndex % weakTopics.length]
                                      : subjectTopics[dayIndex % subjectTopics.length];
                                  }
                                  // Weekend (Sat-Sun), review and consolidate
                                  else {
                                    return subjectTopics[dayIndex % subjectTopics.length];
                                  }
                                };
                                
                                const dayThemes = [
                                  "Kickstart Week",
                                  "Strengthen Recall", 
                                  "Mid-Week Mastery",
                                  "Apply & Connect",
                                  "Checkpoint",
                                  "Light Review",
                                  "Reset & Plan"
                                ];

                                const getActivitiesForDay = (dayIndex: number, topic: any) => {
                                  // Format topic name: remove prefixes like "c1-", "b2-" etc and capitalize
                                  const formatTopicName = (topicId: string) => {
                                    if (!topicId) return "Review Topics";
                                    // Remove prefix patterns like c1-, b2-, p3- etc
                                    const withoutPrefix = topicId.replace(/^[a-z]\d+-/i, '');
                                    // Replace hyphens with spaces and capitalize each word
                                    return withoutPrefix
                                      .split('-')
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                      .join(' ');
                                  };
                                  
                                  const topicName = formatTopicName(topic?.topicId);
                                  const topicId = topic?.topicId;
                                  const subjectId = topic?.subjectId || selectedDrawerSubject.id;
                                  
                                  const activitiesMap = [
                                    // Monday - Kickstart
                                    [
                                      { text: `Create 10 flashcards on ${topicName}`, mins: 15, action: 'flashcards' },
                                      { text: `Practice questions on ${topicName}`, mins: 15, action: 'practice', topicId }
                                    ],
                                    // Tuesday - Strengthen Recall
                                    [
                                      { text: `Make and review flashcards on ${topicName}`, mins: 10, action: 'flashcards' },
                                      { text: `Practice questions on ${topicName}`, mins: 15, action: 'practice', topicId }
                                    ],
                                    // Wednesday - Mid-week Mastery
                                    [
                                      { text: `Complete practice test on ${topicName}`, mins: 25, action: 'practice', topicId }
                                    ],
                                    // Thursday - Apply & Connect
                                    [
                                      { text: `Practice questions on ${topicName}`, mins: 20, action: 'practice', topicId },
                                      { text: `Review smart revision notes`, mins: 10, action: 'notebook' }
                                    ],
                                    // Friday - Checkpoint
                                    [
                                      { text: `Complete practice test on ${topicName}`, mins: 35, action: 'practice', topicId }
                                    ],
                                    // Saturday - Light Review
                                    [
                                      { text: `Make and review flashcards on ${topicName}`, mins: 15, action: 'flashcards' }
                                    ],
                                    // Sunday - Reset & Plan
                                    [
                                      { text: `Weekly recap practice on ${topicName}`, mins: 35, action: 'practice', topicId }
                                    ]
                                  ];
                                  return { activities: activitiesMap[dayIndex], subjectId };
                                };

                                return weekDays.map((day, i) => {
                                  // Get adaptive topic for this day based on priority
                                  const topic = getTopicForDay(i);
                                  const { activities, subjectId } = getActivitiesForDay(i, topic);
                                  const totalDuration = activities.reduce((sum, act) => sum + act.mins, 0);
                                  
                                  const handleStartActivity = (activity: any) => {
                                    if (activity.action === 'flashcards') {
                                      setActiveTab('flashcards');
                                      setSubjectDrawerOpen(false);
                                    } else if (activity.action === 'practice' && activity.topicId) {
                                      setSubjectDrawerOpen(false);
                                      // Navigate directly to practice page with subject and topic as path params
                                      navigate(`/practice/${subjectId}/${activity.topicId}`);
                                    } else if (activity.action === 'notebook') {
                                      setActiveTab('notebook');
                                      setSubjectDrawerOpen(false);
                                    }
                                  };
                                  
                                  // Determine if this item should be blurred (all except first Monday item)
                                  const shouldBlur = !isPremium && i > 0;
                                  
                                  return (
                                    <motion.div 
                                      key={day}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.05 }}
                                      className={`p-5 rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-700 bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 hover:border-[#0EA5E9]/30 hover:shadow-md transition-all duration-300 ${shouldBlur ? 'blur-sm' : ''}`}
                                    >
                                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]/50 dark:border-gray-700">
                                        <div>
                                          <span className="font-bold text-lg text-[#0F172A] dark:text-white">{day}</span>
                                          <span className="text-xs text-[#64748B] dark:text-gray-400 ml-2">— {dayThemes[i]}</span>
                                        </div>
                                        <Badge className="text-xs px-3 py-1 rounded-lg border-2 border-[#0EA5E9] text-[#0EA5E9] bg-white dark:bg-gray-950 font-semibold">{totalDuration} mins</Badge>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        {activities.map((activity, actIdx) => {
                                          const activityId = `${day}-${actIdx}`;
                                          const isCompleted = completedActivities.has(activityId);
                                          
                                          return (
                                            <div key={actIdx} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white dark:bg-gray-950 border border-[#E2E8F0]/30 dark:border-gray-800">
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                  <p className={`text-sm text-[#0F172A] dark:text-white font-medium truncate ${isCompleted ? 'line-through opacity-50' : ''}`}>
                                                    {activity.text}
                                                  </p>
                                                  {topic && topic.averageScore < 50 && topic.attempts > 0 && !isCompleted && (
                                                    <Badge className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-0">
                                                      Priority
                                                    </Badge>
                                                  )}
                                                  {topic && topic.attempts === 0 && !isCompleted && (
                                                    <Badge className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0">
                                                      New
                                                    </Badge>
                                                  )}
                                                </div>
                                                <p className={`text-xs text-[#64748B] dark:text-gray-400 mt-0.5 ${isCompleted ? 'line-through opacity-50' : ''}`}>
                                                  {activity.mins} mins
                                                  {topic && topic.averageScore > 0 && !isCompleted && (
                                                    <span className="ml-2">• Current: {Math.round(topic.averageScore)}%</span>
                                                  )}
                                                </p>
                                              </div>
                                              <div className="flex gap-2 flex-shrink-0">
                                                <Button 
                                                  size="sm" 
                                                  className="rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-semibold shadow-sm text-xs px-3 h-8"
                                                  onClick={() => handleStartActivity(activity)}
                                                >
                                                  <Play className="h-3 w-3 mr-1" />
                                                  Start
                                                </Button>
                                                <Button 
                                                  size="sm" 
                                                  variant="outline" 
                                                  className={`rounded-lg border-2 font-semibold text-xs px-3 h-8 ${
                                                    isCompleted 
                                                      ? 'border-[#16A34A] bg-[#16A34A] text-white hover:bg-[#16A34A]/90' 
                                                      : 'border-[#16A34A] text-[#16A34A] hover:bg-[#16A34A]/10'
                                                  }`}
                                                  onClick={() => {
                                                    setCompletedActivities(prev => {
                                                      const newSet = new Set(prev);
                                                      if (isCompleted) {
                                                        newSet.delete(activityId);
                                                      } else {
                                                        newSet.add(activityId);
                                                        
                                                        // Update last attempt date for this topic to reflect completion
                                                        if (topic && activity.topicId) {
                                                          const updatedProgress = userProgress.map(p => 
                                                            p.subjectId === topic.subjectId && p.topicId === activity.topicId
                                                              ? { ...p, lastAttempt: new Date() }
                                                              : p
                                                          );
                                                          setUserProgress(updatedProgress);
                                                          if (user?.id) {
                                                            localStorage.setItem(`mentiora_progress_${user.id}`, JSON.stringify(updatedProgress));
                                                          }
                                                        }
                                                      }
                                                      return newSet;
                                                    });
                                                    
                                                    // Show encouraging toast
                                                    if (!isCompleted) {
                                                      toast({
                                                        title: "Great work! 🎉",
                                                        description: "Activity completed. Your study plan is adapting to your progress.",
                                                      });
                                                    }
                                                  }}
                                                >
                                                  {isCompleted ? <Check className="h-3 w-3 mr-1" /> : null}
                                                  Done
                                                </Button>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </motion.div>
                                  );
                                });
                              })()}
                              
                              {/* Premium CTA Overlay for non-premium users */}
                              {!isPremium && (
                                <div className="mt-6 p-6 rounded-2xl border-2 border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-sm">
                                  <div className="text-center space-y-3">
                                    <h4 className="text-base font-bold text-[#0F172A] dark:text-white">Unlock Full Access</h4>
                                    <p className="text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
                                      Upgrade to Premium to unlock all notes, detailed insights, and personalized recommendations
                                    </p>
                                    <Button 
                                      className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all duration-300 font-medium"
                                      onClick={() => navigate('/pricing')}
                                    >
                                      Upgrade Now
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="notes" className="space-y-4 mt-8">
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Your Notes</CardTitle>
                              <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium mt-1">
                                Review notes from your mistakes and learning progress
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {(() => {
                                const subjectNotes = entries.filter(entry => {
                                  const subjectDisplayName = getSubjectDisplayName(selectedDrawerSubject);
                                  // Match either just the subject name or with exam board
                                  return entry.subject === subjectDisplayName.split(' (')[0] || 
                                         entry.subject === subjectDisplayName;
                                });

                                if (subjectNotes.length === 0) {
                                  return (
                                    <div className="text-center py-16">
                                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-6">
                                        <NotebookPen className="h-8 w-8 text-muted-foreground" />
                                      </div>
                                      <h3 className="text-lg font-semibold text-foreground mb-2">
                                        No notes yet for this subject
                                      </h3>
                                      <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                                        Start practicing questions to generate personalized revision notes
                                      </p>
                                      <Button 
                                        onClick={() => {
                                          setSubjectDrawerOpen(false);
                                          setActiveTab("learn");
                                        }}
                                        className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-semibold shadow-sm"
                                      >
                                        Start Practicing
                                      </Button>
                                    </div>
                                  );
                                }

                                return subjectNotes.map((entry) => (
                                  <NotebookEntry key={entry.id} entry={entry} />
                                ));
                              })()}
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="flashcards" className="space-y-4 mt-8">
                          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                            <CardHeader>
                              <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Your Flashcards</CardTitle>
                              <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium mt-1">
                                Study with flashcards for this subject
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <Tabs defaultValue="view" className="w-full">
                                <TabsList className="grid w-full grid-cols-2 mb-6">
                                  <TabsTrigger value="view">Sets</TabsTrigger>
                                  <TabsTrigger value="create">Create New</TabsTrigger>
                                </TabsList>

                                <TabsContent value="view">
                                  {(() => {
                                    const subjectSets = flashcardSets.filter(set => 
                                      set.subject_id === selectedDrawerSubject?.id
                                    );

                                    if (viewMode && selectedSet) {
                                      return (
                                        <FlashcardViewer 
                                          flashcardSet={selectedSet}
                                          mode={viewMode}
                                          onBack={() => {
                                            setSelectedSet(null);
                                            setViewMode(null);
                                          }}
                                        />
                                      );
                                    }

                                    if (subjectSets.length === 0) {
                                      return (
                                        <div className="text-center py-16">
                                          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#38BDF8]/10 dark:from-[#0EA5E9]/30 dark:to-[#38BDF8]/20 border border-[#0EA5E9]/30 flex items-center justify-center mb-6 shadow-lg">
                                            <Brain className="h-10 w-10 text-[#0EA5E9]" />
                                          </div>
                                          <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight">
                                            No flashcards yet
                                          </h3>
                                          <p className="text-[#64748B] dark:text-gray-400 mb-6 max-w-sm mx-auto font-medium leading-relaxed">
                                            Create flashcards to help you study and retain information more effectively
                                          </p>
                                        </div>
                                      );
                                    }

                                    return (
                                      <div className="space-y-4">
                                        {subjectSets.map((set: any) => (
                                          <Card key={set.id} className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
                                             <CardContent className="p-5">
                                              <div className="mb-4">
                                                {renamingSetId === set.id ? (
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <Input
                                                      value={newSetName}
                                                      onChange={(e) => setNewSetName(e.target.value)}
                                                      onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                          handleRenameSet(set.id);
                                                        } else if (e.key === 'Escape') {
                                                          setRenamingSetId(null);
                                                          setNewSetName("");
                                                        }
                                                      }}
                                                      className="flex-1 h-8 text-sm"
                                                      autoFocus
                                                    />
                                                    <Button
                                                      size="sm"
                                                      onClick={() => handleRenameSet(set.id)}
                                                      className="h-8 w-8 p-0 bg-emerald-500 hover:bg-emerald-600"
                                                    >
                                                      <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                      size="sm"
                                                      variant="outline"
                                                      onClick={() => {
                                                        setRenamingSetId(null);
                                                        setNewSetName("");
                                                      }}
                                                      className="h-8 w-8 p-0"
                                                    >
                                                      <X className="h-4 w-4" />
                                                    </Button>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight flex-1">
                                                      {set.title}
                                                    </h3>
                                                    <div className="flex items-center gap-1">
                                                      <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                          setRenamingSetId(set.id);
                                                          setNewSetName(set.title);
                                                        }}
                                                        className="h-7 w-7 p-0 text-[#64748B] hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10 transition-colors"
                                                      >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                      </Button>
                                                      <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleDeleteSet(set.id)}
                                                        className="h-7 w-7 p-0 text-[#64748B] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                                      >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                      </Button>
                                                    </div>
                                                  </div>
                                                )}
                                                <div className="flex items-center gap-3">
                                                  <Badge className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white border-0 font-bold shadow-md px-2.5 py-1 text-xs">
                                                    {set.flashcards?.length || 0} cards
                                                  </Badge>
                                                  <span className="text-xs text-[#64748B] dark:text-gray-400">
                                                    {new Date(set.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="flex gap-3">
                                                <Button
                                                  onClick={() => {
                                                    setSelectedSet(set);
                                                    setViewMode("flashcards");
                                                  }}
                                                  className="flex-1 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                                                >
                                                  <Eye className="h-4 w-4 mr-2" />
                                                  Review
                                                </Button>
                                                <Button
                                                  onClick={() => {
                                                    setSelectedSet(set);
                                                    setViewMode("learn");
                                                  }}
                                                  variant="outline"
                                                  className="flex-1 border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 dark:hover:bg-[#0EA5E9]/20 font-bold rounded-xl"
                                                >
                                                  <Play className="h-4 w-4 mr-2" />
                                                  Study
                                                </Button>
                                              </div>
                                            </CardContent>
                                          </Card>
                                        ))}
                                        <Button 
                                          onClick={() => {
                                            setSubjectDrawerOpen(false);
                                            setActiveTab("flashcards");
                                          }}
                                          variant="outline"
                                          className="w-full mt-4 border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 dark:hover:bg-[#0EA5E9]/20 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl font-bold"
                                        >
                                          View All Flashcards
                                        </Button>
                                      </div>
                                    );
                                  })()}
                                </TabsContent>

                                <TabsContent value="create">
                                  <FlashcardCreator 
                                    onSetCreated={() => {
                                      loadFlashcardSets();
                                      loadIndividualFlashcards();
                                      toast({
                                        title: "Success",
                                        description: "Flashcards created successfully!",
                                      });
                                    }}
                                    userSubjects={userSubjectsWithGrades}
                                    selectedSubjectId={selectedDrawerSubject?.id}
                                  />
                                </TabsContent>
                              </Tabs>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </>
                  )}
                </SheetContent>
              </Sheet>

              {/* Add Subjects Modal */}
              {showAddSubjects && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 rounded-3xl shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20 max-w-4xl w-full max-h-[85vh] overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative p-6 border-b border-[#E2E8F0]/50 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          {selectedSubjectGroup && (
                            <Button
                              onClick={() => setSelectedSubjectGroup(null)}
                              variant="ghost"
                              size="sm"
                              className="mb-2 text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white"
                            >
                              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                              Back to subjects
                            </Button>
                          )}
                          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                            {selectedSubjectGroup ? `Choose Exam Board` : 'Add Subjects'}
                          </h2>
                          <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 font-light">
                            {selectedSubjectGroup ? 'Select your exam board for ' + selectedSubjectGroup : 'Choose subjects to add to your dashboard'}
                          </p>
                        </div>
                        <Button
                          onClick={() => {
                            setShowAddSubjects(false);
                            setSelectedSubjectGroup(null);
                          }}
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-xl text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
                      {!selectedSubjectGroup ? (
                        <Tabs value={activeSubjectLevel} onValueChange={(value) => setActiveSubjectLevel(value as 'gcse' | 'alevel')} className="w-full">
                          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#F1F5F9] dark:bg-gray-800 p-1 h-12 rounded-xl">
                            <TabsTrigger 
                              value="gcse"
                              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#0F172A] dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748B] dark:text-gray-400 font-semibold rounded-lg transition-all duration-200"
                            >
                              GCSE Subjects
                            </TabsTrigger>
                            <TabsTrigger 
                              value="alevel"
                              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-[#0F172A] dark:data-[state=active]:text-white data-[state=active]:shadow-sm text-[#64748B] dark:text-gray-400 font-semibold rounded-lg transition-all duration-200"
                            >
                              A-Level Subjects
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="gcse" className="animate-fade-in">
                            {(() => {
                              const gcseSubjects = availableSubjects.filter(s => !s.id.includes('alevel'));
                              const groupedSubjects = new Map<string, typeof gcseSubjects>();
                              
                              gcseSubjects.forEach(subject => {
                                let baseName = subject.name.split(' - ')[0].split(' (')[0];
                                // Normalize "Maths" to "Mathematics" for consistent grouping
                                if (baseName === 'Maths') baseName = 'Mathematics';
                                // Normalize Geography variations (Geography Paper 2, Geography A, Geography B)
                                if (baseName.startsWith('Geography')) baseName = 'Geography';
                                if (!groupedSubjects.has(baseName)) {
                                  groupedSubjects.set(baseName, []);
                                }
                                groupedSubjects.get(baseName)!.push(subject);
                              });

                              if (groupedSubjects.size === 0) {
                                return (
                                  <div className="text-center py-12 px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5 dark:from-[#16A34A]/30 dark:to-[#16A34A]/10 flex items-center justify-center">
                                      <Check className="h-8 w-8 text-[#16A34A]" />
                                    </div>
                                    <p className="text-lg font-bold text-[#0F172A] dark:text-white">All GCSE subjects added!</p>
                                    <p className="text-sm text-[#64748B] dark:text-gray-400 mt-2">You&apos;ve already added all available GCSE subjects to your dashboard.</p>
                                  </div>
                                );
                              }

                              const subjectEmojis: { [key: string]: string } = {
                                "Physics": "⚛️",
                                "Chemistry": "🧪",
                                "Biology": "🔬",
                                "Combined Science": "💻",
                                "Mathematics": "🔢",
                                "Maths": "🔢",
                                "Statistics": "📊",
                                "English Language": "✍️",
                                "English Literature": "📖",
                                "Geography": "🌍",
                                "History": "🕰️",
                                "Religious Studies": "⛪",
                                "Business": "💼",
                                "Computer Science": "💻",
                                "Psychology": "🧠",
                                "Spanish": "🇪🇸",
                              };

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Array.from(groupedSubjects.entries()).map(([baseName, subjects]) => {
                                    const emoji = subjectEmojis[baseName] || "📚";
                                    const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
                                    
                                    return (
                                      <motion.div
                                        key={baseName}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Card 
                                          className="cursor-pointer rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] transition-all duration-300 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 group"
                                          onClick={() => {
                                            setSelectedSubjectGroup(baseName);
                                          }}
                                        >
                                          <CardContent className="p-5">
                                            <div className="flex items-center space-x-4">
                                              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</div>
                                              <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mobile-text-wrap tracking-tight">
                                                  {baseName}
                                                </h3>
                                                <p className="text-sm text-[#64748B] dark:text-gray-400 mobile-text-wrap flex items-center gap-1.5 mt-0.5">
                                                  <BookOpen className="h-3.5 w-3.5" />
                                                  {subjects.length > 1 ? `${subjects.length} exam boards available` : `1 exam board available`}
                                                </p>
                                              </div>
                                              <div className="flex-shrink-0">
                                                <ChevronRight className="h-5 w-5 text-[#0EA5E9] group-hover:translate-x-1 transition-transform duration-300" />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </TabsContent>

                          <TabsContent value="alevel" className="animate-fade-in">
                            {(() => {
                              const alevelSubjects = availableSubjects.filter(s => s.id.includes('alevel'));
                              const groupedSubjects = new Map<string, typeof alevelSubjects>();
                              
                              alevelSubjects.forEach(subject => {
                                let baseName = subject.name.split(' - ')[0].split(' (')[0];
                                // Normalize "Maths" to "Mathematics" for consistent grouping
                                if (baseName === 'Maths') baseName = 'Mathematics';
                                // Normalize Geography variations (Geography Paper 2, Geography A, Geography B)
                                if (baseName.startsWith('Geography')) baseName = 'Geography';
                                if (!groupedSubjects.has(baseName)) {
                                  groupedSubjects.set(baseName, []);
                                }
                                groupedSubjects.get(baseName)!.push(subject);
                              });

                              if (groupedSubjects.size === 0) {
                                return (
                                  <div className="text-center py-12 px-4">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5 flex items-center justify-center">
                                      <Check className="h-8 w-8 text-[#16A34A]" />
                                    </div>
                                    <p className="text-lg font-bold text-[#0F172A]">All A-Level subjects added!</p>
                                    <p className="text-sm text-[#64748B] mt-2">You&apos;ve already added all available A-Level subjects to your dashboard.</p>
                                  </div>
                                );
                              }

                              const subjectEmojis: { [key: string]: string } = {
                                "Physics": "⚛️",
                                "Chemistry": "🧪",
                                "Biology": "🔬",
                                "Combined Science": "💻",
                                "Mathematics": "🔢",
                                "Maths": "🔢",
                                "Statistics": "📊",
                                "English Language": "✍️",
                                "English Literature": "📖",
                                "Geography": "🌍",
                                "History": "🕰️",
                                "Religious Studies": "⛪",
                                "Business": "💼",
                                "Computer Science": "💻",
                                "Psychology": "🧠",
                                "Spanish": "🇪🇸",
                              };

                              return (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {Array.from(groupedSubjects.entries()).map(([baseName, subjects]) => {
                                    const emoji = subjectEmojis[baseName] || "📚";
                                    const totalTopics = subjects.reduce((sum, s) => sum + s.topics.length, 0);
                                    
                                    return (
                                      <motion.div
                                        key={baseName}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Card 
                                          className="cursor-pointer rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_8px_24px_rgba(14,165,233,0.15)] transition-all duration-300 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 group"
                                          onClick={() => {
                                            setSelectedSubjectGroup(baseName);
                                          }}
                                        >
                                          <CardContent className="p-5">
                                            <div className="flex items-center space-x-4">
                                              <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{emoji}</div>
                                              <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mobile-text-wrap tracking-tight">
                                                  {baseName}
                                                </h3>
                                                <p className="text-sm text-[#64748B] dark:text-gray-400 mobile-text-wrap flex items-center gap-1.5 mt-0.5">
                                                  <BookOpen className="h-3.5 w-3.5" />
                                                  {subjects.length > 1 ? `${subjects.length} exam boards available` : `1 exam board available`}
                                                </p>
                                              </div>
                                              <div className="flex-shrink-0">
                                                <ChevronRight className="h-5 w-5 text-[#0EA5E9] group-hover:translate-x-1 transition-transform duration-300" />
                                              </div>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              );
                            })()}
                          </TabsContent>
                        </Tabs>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {availableSubjects
                            .filter(subject => {
                              // Exclude geography-paper-2 from exam board selection
                              if (subject.id === 'geography-paper-2') return false;
                              
                              // Filter by level first
                              const isCorrectLevel = activeSubjectLevel === 'gcse' 
                                ? !subject.id.includes('alevel') 
                                : subject.id.includes('alevel');
                              
                              if (!isCorrectLevel) return false;
                              
                              // Then filter by base name
                              let baseName = subject.name.split(' - ')[0].split(' (')[0];
                              // Normalize Geography variations for matching
                              if (baseName.startsWith('Geography')) baseName = 'Geography';
                              // Normalize Maths to Mathematics for matching
                              if (baseName === 'Maths') baseName = 'Mathematics';
                              return baseName === selectedSubjectGroup;
                            })
                            .sort((a, b) => {
                              // AQA always comes first
                              const aIsAQA = a.id.includes('aqa') || (!a.id.includes('edexcel') && !a.id.includes('ocr') && !a.id.includes('wjec') && !a.id.includes('eduqas') && !a.id.includes('ccea'));
                              const bIsAQA = b.id.includes('aqa') || (!b.id.includes('edexcel') && !b.id.includes('ocr') && !b.id.includes('wjec') && !b.id.includes('eduqas') && !b.id.includes('ccea'));
                              
                              if (aIsAQA && !bIsAQA) return -1;
                              if (!aIsAQA && bIsAQA) return 1;
                              return 0;
                            })
                            .map((subject) => {
                              // Extract exam board from subject name or ID
                              let examBoard = 'AQA'; // default
                              
                              // First check if exam board is in parentheses in the name
                              const nameMatch = subject.name.match(/\(([^)]+)\)/);
                              if (nameMatch) {
                                examBoard = nameMatch[1];
                              } else if (subject.name.includes('Paper 2')) {
                                examBoard = 'AQA Paper 2';
                              } else if (subject.id.includes('eduqas')) {
                                examBoard = 'Eduqas';
                              } else if (subject.id.includes('wjec')) {
                                examBoard = 'Eduqas';
                              } else if (subject.id.includes('edexcel')) {
                                examBoard = 'Edexcel';
                              } else if (subject.id.includes('ocr')) {
                                examBoard = 'OCR';
                              } else if (subject.id.includes('ccea')) {
                                examBoard = 'CCEA';
                              } else if (subject.id.includes('aqa')) {
                                examBoard = 'AQA';
                              } else if (subject.id === 'geography') {
                                // Explicitly label base Geography as AQA
                                examBoard = 'AQA';
                              }
                              
                              return (
                                <motion.div
                                  key={subject.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3 }}
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Card 
                                    className="cursor-pointer rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[#0EA5E9]/15)] transition-all duration-300 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 group"
                                    onClick={() => {
                                      setSelectedSubjectForGrade({
                                        id: subject.id,
                                        name: subject.name,
                                        examBoard: examBoard
                                      });
                                    }}
                                  >
                                    <CardContent className="p-6">
                                      <div className="text-center">
                                        <div className="inline-block px-6 py-2 mb-4 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] group-hover:scale-105 transition-transform duration-300">
                                          <span className="text-2xl font-bold text-white">{examBoard}</span>
                                        </div>
                                        <p className="text-sm text-[#64748B] dark:text-gray-400 flex items-center justify-center gap-1.5">
                                          <BookOpen className="h-3.5 w-3.5" />
                                          {subject.topics.length} topics available
                                        </p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Target Grade Selection Modal */}
              {selectedSubjectForGrade && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 rounded-3xl shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20 max-w-2xl w-full"
                  >
                    <div className="p-6 border-b border-[#E2E8F0]/50 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">Set Target Grade</h2>
                          <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1 font-light">
                            What grade are you aiming for in {selectedSubjectForGrade.name}?
                          </p>
                        </div>
                        <Button
                          onClick={() => setSelectedSubjectForGrade(null)}
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 rounded-xl text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-gray-700 transition-all duration-200"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-3 gap-3">
                        {(() => {
                          // Check if subject is A-Level
                          const isALevel = selectedSubjectForGrade.id.toLowerCase().includes('alevel');
                          const grades = isALevel 
                            ? ['A*', 'A', 'B', 'C', 'D', 'E']
                            : [9, 8, 7, 6, 5, 4, 3, 2, 1];
                          
                          return grades.map((grade) => (
                            <motion.button
                              key={grade}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                addSubject(selectedSubjectForGrade.id, grade.toString(), selectedSubjectForGrade.examBoard);
                                setSelectedSubjectForGrade(null);
                                setShowAddSubjects(false);
                                setSelectedSubjectGroup(null);
                              }}
                              className="relative rounded-2xl p-6 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-2 border-[#E2E8F0] dark:border-gray-700 hover:border-[#0EA5E9] hover:shadow-lg transition-all duration-300 group"
                            >
                              <div className="text-4xl font-bold text-[#0F172A] dark:text-white group-hover:text-[#0EA5E9] transition-colors">
                                {grade}
                              </div>
                            </motion.button>
                          ));
                        })()}
                      </div>
                    </div>
                  </motion.div>
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
                
                {predictedGrades.length > 0 && (
                  <div className="mt-6">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-lg px-6 py-2 shadow-lg">
                      Your average grade is {Math.round(predictedGrades.reduce((sum, grade) => sum + (parseInt(grade.grade) || 0), 0) / predictedGrades.length)}. Keep it up!
                    </Badge>
                    <p className="text-muted-foreground mt-2">You're making great progress</p>
                  </div>
                )}
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
                          Complete some practice sessions to see your predicted grades and detailed analytics
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
                                <span>Start Free Trial</span>
                              </div>
                            )}
                          </Button>
                        </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto space-y-12">
                  {/* 1. Performance Overview */}
                  <PerformanceOverview 
                    predictedGrades={predictedGrades}
                    userSubjects={userSubjectsWithGrades}
                  />

                  {/* 2. Strengths and Weaknesses */}
                  {userProgress.length > 0 && (
                    <StrengthsWeaknesses
                      userProgress={userProgress}
                      onPractice={(subjectId, topicId) => {
                        setSelectedSubject(subjectId);
                        setActiveTab("learn");
                        navigate(`/practice?subject=${subjectId}&topic=${topicId}`);
                      }}
                    />
                  )}

                  {/* 3. Study Insights */}
                  <StudyInsights
                    currentStreak={currentStreak}
                    weeklyData={[
                      { day: "Mon", hours: 1.5, accuracy: 75 },
                      { day: "Tue", hours: 2.0, accuracy: 82 },
                      { day: "Wed", hours: 0.5, accuracy: 68 },
                      { day: "Thu", hours: 2.5, accuracy: 88 },
                      { day: "Fri", hours: 1.8, accuracy: 80 },
                      { day: "Sat", hours: 3.0, accuracy: 85 },
                      { day: "Sun", hours: 1.2, accuracy: 78 },
                    ]}
                  />

                  {/* 4. Flashcard Insights - Resizable */}
                  <ResizablePanelGroup direction="horizontal" className="min-h-[400px] rounded-lg border">
                    <ResizablePanel defaultSize={100} minSize={30}>
                       <div className="h-full overflow-auto p-6">
                          <FlashcardInsights
                           flashcardSets={flashcardSets}
                           individualFlashcards={individualFlashcards}
                           onViewFlashcards={() => setActiveTab("flashcards")}
                           onFlashcardCreated={() => {
                             loadFlashcardSets();
                             loadIndividualFlashcards();
                             toast({
                               title: "Success",
                               description: "Flashcards created successfully!",
                             });
                           }}
                           userSubjects={userSubjectsWithGrades}
                           selectedSubjectId={selectedDrawerSubject?.id}
                         />
                       </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>

                  {/* 5. Personalized Summary */}
                  <PersonalizedSummary
                    predictedGrades={predictedGrades}
                    userProgress={userProgress}
                  />

                  {/* CTA Section */}
                  <div className="text-center py-8">
                    <Button
                      size="lg"
                      onClick={() => setActiveTab("learn")}
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Continue Practicing
                    </Button>
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
                        loadUserStats(); // Refresh flashcard count
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
                              // Color gradients for different cards - medly blue and emerald theme
                              const gradients = [
                                "bg-gradient-to-br from-[#0EA5E9]/10 via-[#38BDF8]/10 to-emerald-50 dark:from-[#0EA5E9]/20 dark:via-[#38BDF8]/15 dark:to-emerald-900/30 border-[#0EA5E9]/30 dark:border-[#0EA5E9]/40 shadow-[#0EA5E9]/20 dark:shadow-[#0EA5E9]/10",
                                "bg-gradient-to-br from-emerald-50 via-[#0EA5E9]/10 to-[#38BDF8]/10 dark:from-emerald-900/30 dark:via-[#0EA5E9]/15 dark:to-[#38BDF8]/20 border-emerald-300/60 dark:border-emerald-600/30 shadow-emerald-200/50 dark:shadow-emerald-900/20",
                                "bg-gradient-to-br from-[#38BDF8]/10 via-[#0EA5E9]/10 to-emerald-50 dark:from-[#38BDF8]/20 dark:via-[#0EA5E9]/15 dark:to-emerald-900/30 border-[#38BDF8]/30 dark:border-[#38BDF8]/40 shadow-[#38BDF8]/20 dark:shadow-[#38BDF8]/10",
                                "bg-gradient-to-br from-[#0EA5E9]/10 via-emerald-50 to-[#0EA5E9]/10 dark:from-[#0EA5E9]/20 dark:via-emerald-900/20 dark:to-[#0EA5E9]/20 border-[#0EA5E9]/30 dark:border-[#0EA5E9]/40 shadow-[#0EA5E9]/20 dark:shadow-[#0EA5E9]/10",
                                "bg-gradient-to-br from-emerald-50 via-[#38BDF8]/10 to-[#0EA5E9]/10 dark:from-emerald-900/30 dark:via-[#38BDF8]/15 dark:to-[#0EA5E9]/20 border-emerald-300/60 dark:border-emerald-600/30 shadow-emerald-200/50 dark:shadow-emerald-900/20",
                                "bg-gradient-to-br from-[#0EA5E9]/10 via-[#0EA5E9]/15 to-emerald-50 dark:from-[#0EA5E9]/20 dark:via-[#0EA5E9]/25 dark:to-emerald-900/30 border-[#0EA5E9]/30 dark:border-[#0EA5E9]/40 shadow-[#0EA5E9]/20 dark:shadow-[#0EA5E9]/10"
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
                                             <div className="p-2 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg shadow-lg">
                                               <Brain className="h-4 w-4 text-white" />
                                             </div>
                                           <div className="flex-1">
                                             {renamingSetId === set.id ? (
                                               <div className="flex items-center gap-2">
                                                 <Input
                                                   value={newSetName}
                                                   onChange={(e) => setNewSetName(e.target.value)}
                                                   onKeyDown={(e) => {
                                                     if (e.key === 'Enter') {
                                                       handleRenameSet(set.id);
                                                     } else if (e.key === 'Escape') {
                                                       setRenamingSetId(null);
                                                       setNewSetName("");
                                                     }
                                                   }}
                                                   className="h-9 text-sm font-bold"
                                                   autoFocus
                                                 />
                                                 <Button
                                                   size="sm"
                                                   onClick={() => handleRenameSet(set.id)}
                                                   className="h-9 w-9 p-0 bg-emerald-500 hover:bg-emerald-600"
                                                 >
                                                   <Check className="h-4 w-4" />
                                                 </Button>
                                                 <Button
                                                   size="sm"
                                                   variant="outline"
                                                   onClick={() => {
                                                     setRenamingSetId(null);
                                                     setNewSetName("");
                                                   }}
                                                   className="h-9 w-9 p-0"
                                                 >
                                                   <X className="h-4 w-4" />
                                                 </Button>
                                               </div>
                                             ) : (
                                               <div className="flex items-center gap-2">
                                                 <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex-1">
                                                   {set.title}
                                                 </CardTitle>
                                                 <Button
                                                   size="sm"
                                                   variant="ghost"
                                                   onClick={(e) => {
                                                     e.stopPropagation();
                                                     setRenamingSetId(set.id);
                                                     setNewSetName(set.title);
                                                   }}
                                                   className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                 >
                                                   <Pencil className="h-3.5 w-3.5" />
                                                 </Button>
                                               </div>
                                             )}
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
                                           className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-xs"
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
                                                 <Brain className="h-4 w-4 text-cyan-600" />
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
            <div className="space-y-8">
              {/* Hero Summary Bar - Dashboard Style */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
                      Daily Quests
                    </h1>
                    <p className="text-sm text-[#64748B] dark:text-gray-400 mt-1">
                      Complete challenges and earn MP to climb the leaderboard
                    </p>
                  </div>
                </div>

                {/* Summary Stats Grid - Like Dashboard KPI Belt */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Trophy className="h-4 w-4 text-[#0EA5E9]" />
                        </div>
                        <span className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Daily Goal</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-[#0F172A] dark:text-white">
                            {Math.min(todayEarnedMP, 50)}
                          </span>
                          <span className="text-sm font-medium text-[#64748B] dark:text-gray-400">/ 50 MP</span>
                        </div>
                        <Progress value={Math.min((todayEarnedMP / 50) * 100, 100)} className="h-1.5" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Gem className="h-4 w-4 text-[#0EA5E9]" />
                        </div>
                        <span className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Total Balance</span>
                      </div>
                      <div className="text-2xl font-bold text-[#0EA5E9]">
                        {userGems.toLocaleString()} MP
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Flame className="h-4 w-4 text-[#0EA5E9]" />
                        </div>
                        <span className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">Streak</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#0F172A] dark:text-white">
                          {currentStreak}
                        </span>
                        <span className="text-sm font-medium text-[#64748B] dark:text-gray-400">days 🔥</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-[#0EA5E9]/10">
                          <Star className="h-4 w-4 text-[#0EA5E9]" />
                        </div>
                        <span className="text-xs font-medium text-[#64748B] dark:text-gray-400 uppercase tracking-wide">This Week</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#0F172A] dark:text-white">
                          {userStats?.weeklyTopicsCount || 0}
                        </span>
                        <span className="text-sm font-medium text-[#64748B] dark:text-gray-400">topics</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Today's Quests Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Today's Quests</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Quest 1 - Login */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shadow-sm">
                              <Check className="h-5 w-5 text-[#0EA5E9]" />
                            </div>
                            <Badge variant="outline" className="text-xs font-semibold border-[#0EA5E9]/30 text-[#0EA5E9]">
                              🔥 Daily
                            </Badge>
                          </div>
                          {userStats?.loginToday && (
                            <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Log in today</h4>
                        <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                          Log in to earn MP
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#64748B] dark:text-gray-400">Progress</span>
                            <span className="text-xs font-bold text-[#0EA5E9]">+10 MP</span>
                          </div>
                          <Progress 
                            value={(userStats?.loginToday || todayEarnedMP >= 10) ? 100 : 0} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quest 2 - Rotating Daily Quest */}
                  {(() => {
                    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
                    const questIndex = dayOfYear % 4;
                    
                    const dailyQuests = [
                      {
                        title: "Complete 1 practice set",
                        description: "Answer questions to earn MP",
                        icon: BookOpen,
                        emoji: "🎯",
                        reward: 40,
                        isComplete: userStats?.practiceToday,
                        progress: userStats?.practiceToday ? 100 : 0
                      },
                      {
                        title: "Create 5 flashcards",
                        description: "Build your flashcard collection",
                        icon: NotebookPen,
                        emoji: "🧠",
                        reward: 30,
                        isComplete: weeklyFlashcardCount >= 5,
                        progress: Math.min((weeklyFlashcardCount / 5) * 100, 100)
                      },
                      {
                        title: "Study for 30 minutes",
                        description: "Focus on your learning goals",
                        icon: Clock,
                        emoji: "⏰",
                        reward: 35,
                        isComplete: hasAwardedStudyTime,
                        progress: (studyTimeMinutes / 30) * 100
                      },
                      {
                        title: "Score 80%+ on any topic",
                        description: "Demonstrate topic mastery",
                        icon: Trophy,
                        emoji: "🏆",
                        reward: 50,
                        isComplete: false,
                        progress: 0
                      }
                    ];
                    
                    const quest = dailyQuests[questIndex];
                    const QuestIcon = quest.icon;
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="h-full bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shadow-sm">
                                  {quest.isComplete ? (
                                    <Check className="h-5 w-5 text-[#0EA5E9]" />
                                  ) : (
                                    <QuestIcon className="h-5 w-5 text-[#0EA5E9]" />
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs font-semibold border-[#0EA5E9]/30 text-[#0EA5E9]">
                                  {quest.emoji} Daily
                                </Badge>
                              </div>
                              {quest.isComplete && (
                                <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">{quest.title}</h4>
                            <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                              {quest.description}
                            </p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#64748B] dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-[#0EA5E9]">+{quest.reward} MP</span>
                              </div>
                              <Progress 
                                value={quest.progress} 
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })()}

                  {/* Quest 3 - Bonus Weekly */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Card className="h-full bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shadow-sm">
                              <Star className="h-5 w-5 text-[#0EA5E9]" />
                            </div>
                            <Badge variant="outline" className="text-xs font-semibold border-[#0EA5E9]/30 text-[#0EA5E9]">
                              ⭐ Bonus
                            </Badge>
                          </div>
                          {(userStats?.weeklyTopicsCount || 0) >= 3 && (
                            <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center shadow-md">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Complete 3 topics</h4>
                        <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                          Weekly bonus — {Math.min(userStats?.weeklyTopicsCount || 0, 3)}/3 completed
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-[#64748B] dark:text-gray-400">Progress</span>
                            <span className="text-xs font-bold text-[#0EA5E9]">+100 MP</span>
                          </div>
                          <Progress 
                            value={Math.min(((userStats?.weeklyTopicsCount || 0) / 3) * 100, 100)} 
                            className="h-2"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* This Week's Challenges Section */}
              <div className="space-y-6 p-8 rounded-3xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-900/50 dark:to-gray-800/50 border border-[#E2E8F0]/30 dark:border-gray-700/30">
                <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">This Week's Challenges</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Rotating Weekly Challenge 1 */}
                  {(() => {
                    const weekOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 86400000));
                    const challenge1Index = weekOfYear % 4;
                    
                    const weeklyChallenges1 = [
                      {
                        title: "Complete 5 practice sets",
                        description: "{current}/5 completed this week",
                        icon: Trophy,
                        emoji: "🏆",
                        reward: 250,
                        target: 5,
                        current: Math.min(userStats?.weeklyPracticeCount || 0, 5),
                        isComplete: (userStats?.weeklyPracticeCount || 0) >= 5
                      },
                      {
                        title: "Practice 8 different topics",
                        description: "{current}/8 topics this week",
                        icon: Brain,
                        emoji: "🧠",
                        reward: 250,
                        target: 8,
                        current: Math.min(userStats?.weeklyTopicsCount || 0, 8),
                        isComplete: (userStats?.weeklyTopicsCount || 0) >= 8
                      },
                      {
                        title: "Study for 3 hours total",
                        description: "{current}/180 minutes this week",
                        icon: Clock,
                        emoji: "⏰",
                        reward: 250,
                        target: 180,
                        current: 0,
                        isComplete: false
                      },
                      {
                        title: "Create 20 flashcards",
                        description: `${weeklyFlashcardCount}/20 flashcards this week`,
                        icon: NotebookPen,
                        emoji: "📝",
                        reward: 250,
                        target: 20,
                        current: weeklyFlashcardCount,
                        isComplete: weeklyFlashcardCount >= 20
                      }
                    ];
                    
                    const challenge = weeklyChallenges1[challenge1Index];
                    const ChallengeIcon = challenge.icon;
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Card className="h-full bg-white dark:bg-gray-800 border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shadow-sm">
                                  {challenge.isComplete ? (
                                    <Check className="h-5 w-5 text-[#0EA5E9]" />
                                  ) : (
                                    <ChallengeIcon className="h-5 w-5 text-[#0EA5E9]" />
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs font-semibold border-[#0EA5E9]/30 text-[#0EA5E9]">
                                  {challenge.emoji} Weekly
                                </Badge>
                              </div>
                              {challenge.isComplete && (
                                <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">{challenge.title}</h4>
                            <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                              {challenge.description.replace('{current}', challenge.current.toString())}
                            </p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#64748B] dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-[#0EA5E9]">+{challenge.reward} MP</span>
                              </div>
                              <Progress 
                                value={Math.min((challenge.current / challenge.target) * 100, 100)} 
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })()}

                  {/* Rotating Weekly Challenge 2 */}
                  {(() => {
                    const weekOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 86400000));
                    const challenge2Index = (weekOfYear + 2) % 4;
                    
                    const weeklyChallenges2 = [
                      {
                        title: "Maintain 7-day streak",
                        description: "{current}/7 days completed",
                        icon: Flame,
                        emoji: "🔥",
                        reward: 500,
                        target: 7,
                        current: Math.min(userStats?.currentStreak || 0, 7),
                        isComplete: (userStats?.currentStreak || 0) >= 7
                      },
                      {
                        title: "Complete 10 practice sets",
                        description: "{current}/10 completed this week",
                        icon: Zap,
                        emoji: "⚡",
                        reward: 500,
                        target: 10,
                        current: Math.min(userStats?.weeklyPracticeCount || 0, 10),
                        isComplete: (userStats?.weeklyPracticeCount || 0) >= 10
                      },
                      {
                        title: "Review 30 flashcards",
                        description: "{current}/30 reviewed this week",
                        icon: Eye,
                        emoji: "👁️",
                        reward: 500,
                        target: 30,
                        current: 0,
                        isComplete: false
                      },
                      {
                        title: "Practice every day this week",
                        description: "{current}/7 days with practice",
                        icon: Calendar,
                        emoji: "📅",
                        reward: 500,
                        target: 7,
                        current: Math.min(userStats?.currentStreak || 0, 7),
                        isComplete: (userStats?.currentStreak || 0) >= 7
                      }
                    ];
                    
                    const challenge = weeklyChallenges2[challenge2Index];
                    const ChallengeIcon = challenge.icon;
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Card className="h-full bg-white dark:bg-gray-800 border-[#E2E8F0]/50 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 shadow-sm">
                                  {challenge.isComplete ? (
                                    <Check className="h-5 w-5 text-[#0EA5E9]" />
                                  ) : (
                                    <ChallengeIcon className="h-5 w-5 text-[#0EA5E9]" />
                                  )}
                                </div>
                                <Badge variant="outline" className="text-xs font-semibold border-[#0EA5E9]/30 text-[#0EA5E9]">
                                  {challenge.emoji} Epic
                                </Badge>
                              </div>
                              {challenge.isComplete && (
                                <div className="w-7 h-7 bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] rounded-lg flex items-center justify-center shadow-md">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">{challenge.title}</h4>
                            <p className="text-sm text-[#64748B] dark:text-gray-400 mb-4">
                              {challenge.description.replace('{current}', challenge.current.toString())}
                            </p>
                            
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-[#64748B] dark:text-gray-400">Progress</span>
                                <span className="text-xs font-bold text-[#0EA5E9]">+{challenge.reward} MP</span>
                              </div>
                              <Progress 
                                value={Math.min((challenge.current / challenge.target) * 100, 100)} 
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })()}
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
      </div>

      {/* Premium Welcome Notification */}
      <PremiumWelcomeNotification 
        isVisible={showPremiumWelcome}
        onClose={() => setShowPremiumWelcome(false)}
      />

      {/* Daily Streak Notification */}
      <DailyStreakNotification 
        isVisible={showDailyStreak}
        onClose={() => {
          setShowDailyStreak(false);
          // Show streak badge in header after closing modal
          if (currentStreak > 0) {
            setShowStreakBadge(true);
            
            // Check if this is a milestone
            const milestones = [7, 14, 30, 60, 100, 180, 365];
            if (milestones.includes(currentStreak)) {
              setStreakBadgeMilestone(true);
              toast({
                title: `🏅 Milestone Unlocked: ${currentStreak}-Day Streak!`,
                description: "Keep up the amazing work!",
              });
              
              // Remove milestone effect after 24 hours
              setTimeout(() => {
                setStreakBadgeMilestone(false);
              }, 24 * 60 * 60 * 1000);
            }
          }
        }}
        streakCount={currentStreak}
      />
      </div>
    </div>
  );
};

export default Dashboard;
