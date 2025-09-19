import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
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
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("learn");
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentStreak, setCurrentStreak] = useState(7);
  const [userXP, setUserXP] = useState(1122);
  const [userHearts, setUserHearts] = useState(5);
  const [userGems, setUserGems] = useState(850);
  const [userSubjectsWithGrades, setUserSubjectsWithGrades] = useState<any[]>([]);
  const [predictedGrades, setPredictedGrades] = useState<any[]>([]);

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

  useEffect(() => {
    loadUserSubjects();
    loadUserProgress();
    if (activeTab === "notes") {
      loadNotebookEntries();
    }
  }, [user?.id, activeTab]);

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
        
        {/* 2026 Exam Final Node */}
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
                  <span className="text-xl font-bold text-blue-500">{userXP}</span>
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
                    Choose your GCSE subject
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
                                      GCSE • {progress.completed} OF {progress.total} UNITS
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
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                  Instant notes for every lost mark
                </h2>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-center space-x-4 mb-8">
                <Select value={selectedNotebookSubject} onValueChange={setSelectedNotebookSubject}>
                  <SelectTrigger className="w-44 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 z-50">
                    <SelectItem value="all">All Subjects</SelectItem>
                    {getNotebookSubjects().map(subject => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
                  <SelectTrigger className="w-44 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200">
                    <SelectValue placeholder="All Confidence" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 z-50">
                    <SelectItem value="all">All Confidence</SelectItem>
                    <SelectItem value="low">Low Confidence</SelectItem>
                    <SelectItem value="medium">Medium Confidence</SelectItem>
                    <SelectItem value="high">High Confidence</SelectItem>
                  </SelectContent>
                </Select>
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

          {activeTab !== "learn" && activeTab !== "notes" && activeTab !== "progress" && activeTab !== "profile" && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
                {activeTab}
              </h2>
              <p className="text-lg text-gray-600">
                Coming soon! This feature is being developed.
              </p>
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
                <span className="font-bold text-lg">Try Premium for free</span>
              </div>
              <p className="text-white/90 mb-4">
                No ads, unlimited hearts, and exclusive features!
              </p>
              <Button 
                className="w-full bg-white text-blue-500 hover:bg-gray-100 font-bold py-3 rounded-2xl"
                onClick={() => navigate("/pricing")}
              >
                TRY 2 WEEKS FREE
              </Button>
            </CardContent>
          </Card>

          {/* League Card */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Silver League</h3>
                <span className="text-blue-500 font-bold text-sm">VIEW LEAGUE</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🏆</span>
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
                <span className="text-blue-500 font-bold text-sm">VIEW ALL</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-300 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-yellow-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">Earn 10 XP</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div className="bg-yellow-300 h-2 rounded-full" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <span className="text-xs font-bold text-amber-600">6/10</span>
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
