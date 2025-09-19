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

  // Load user's selected subjects
  const loadUserSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from("user_subjects")
        .select("subject_name, exam_board")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error loading user subjects:", error);
        return;
      }

      if (data) {
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
    if (!subject) return "locked";
    
    const topic = subject.topics[topicIndex];
    if (!topic) return "locked";

    const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topic.id);
    
    if (progress && progress.attempts > 0) {
      return progress.averageScore >= 85 ? "completed" : "active";
    }
    
    // First topic is always available, others need previous to be completed
    if (topicIndex === 0) return "available";
    
    const prevTopic = subject.topics[topicIndex - 1];
    const prevProgress = userProgress.find(p => p.subjectId === subjectId && p.topicId === prevTopic.id);
    
    return (prevProgress && prevProgress.averageScore >= 70) ? "available" : "locked";
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
          const isLocked = status === "locked";
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
                <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4 tracking-tight">
                  Instant Grade 9 notes for every lost mark
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

          {activeTab !== "learn" && activeTab !== "notes" && (
            <div className="text-center py-16">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 capitalize">
                {activeTab}
              </h2>
              <p className="text-lg text-gray-600">
                Coming soon! This feature is being developed.
              </p>
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
