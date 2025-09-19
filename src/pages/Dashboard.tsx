import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Trophy,
  Atom,
  Calculator,
  Globe,
  Palette,
  History,
  Building,
  FlaskConical,
  PenTool,
  Church,
  Gamepad2,
  Target,
  BarChart3,
  Home,
  Lock,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openManageBilling } from "@/lib/manageBilling";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const Dashboard = () => {
  const { user, logout, isPremium } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("learn");
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  // Sidebar navigation items with colors
  const sidebarItems = [
    { id: "learn", label: "Learn", icon: Home, color: "blue" },
    { id: "progress", label: "Progress", icon: BarChart3, color: "green" },
    { id: "2026-exams", label: "2026 Exams", icon: Target, color: "orange" },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy, color: "yellow" },
    { id: "profile", label: "Profile", icon: User, color: "purple" },
  ];

  // Color mappings for nav items
  const getNavItemColors = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: {
        bg: isActive ? "bg-blue-500" : "bg-blue-100 hover:bg-blue-200",
        text: isActive ? "text-white" : "text-blue-700 hover:text-blue-800",
        icon: isActive ? "text-white" : "text-blue-600"
      },
      green: {
        bg: isActive ? "bg-green-500" : "bg-green-100 hover:bg-green-200", 
        text: isActive ? "text-white" : "text-green-700 hover:text-green-800",
        icon: isActive ? "text-white" : "text-green-600"
      },
      orange: {
        bg: isActive ? "bg-orange-500" : "bg-orange-100 hover:bg-orange-200",
        text: isActive ? "text-white" : "text-orange-700 hover:text-orange-800", 
        icon: isActive ? "text-white" : "text-orange-600"
      },
      yellow: {
        bg: isActive ? "bg-yellow-500" : "bg-yellow-100 hover:bg-yellow-200",
        text: isActive ? "text-white" : "text-yellow-700 hover:text-yellow-800",
        icon: isActive ? "text-white" : "text-yellow-600"
      },
      purple: {
        bg: isActive ? "bg-violet-500" : "bg-violet-100 hover:bg-violet-200",
        text: isActive ? "text-white" : "text-violet-700 hover:text-violet-800", 
        icon: isActive ? "text-white" : "text-violet-600"
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  // Subject icon mapping
  const getSubjectIcon = (subjectId: string) => {
    const iconMap: { [key: string]: any } = {
      "physics": Atom,
      "physics-edexcel": Atom,
      "chemistry-edexcel": FlaskConical,
      "mathematics": Calculator,
      "maths-edexcel": Calculator,
      "english-language": PenTool,
      "english-literature": BookOpen,
      "geography": Globe,
      "geography-paper-2": Globe,
      "history": History,
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
            
            // Map database records to curriculum IDs
            if (record.subject_name === "Physics" && examBoard === "aqa") {
              return "physics";
            }
            if (record.subject_name === "Physics" && examBoard === "edexcel") {
              return "physics-edexcel";
            }
            if (record.subject_name === "Mathematics") {
              return "maths-edexcel";
            }
            if (record.subject_name === "IGCSE Business") {
              return "business-edexcel-igcse";
            }
            if (record.subject_name === "Chemistry" && examBoard === "edexcel") {
              return "chemistry-edexcel";
            }

            // Find matching subject in curriculum
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

  // Get subject progress percentage
  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(
      (p) => p.subjectId === subjectId
    );
    if (subjectProgress.length === 0) return 0;
    return Math.round(
      subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) /
        subjectProgress.length
    );
  };

  // Get topics completed count
  const getTopicsCompleted = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return { completed: 0, total: 0 };
    
    const totalTopics = subject.topics.length;
    const completedTopics = userProgress.filter(
      (p) => p.subjectId === subjectId && p.attempts > 0
    ).length;
    
    return { completed: completedTopics, total: totalTopics };
  };

  useEffect(() => {
    loadUserSubjects();
    loadUserProgress();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handlePractice = (subjectId: string) => {
    navigate(`/subject/${subjectId}`);
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-green-500">Mentiora</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-3">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const colors = getNavItemColors(item.color, isActive);
              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-left transition-all duration-200 ${colors.bg} shadow-sm`}
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20' : 'bg-white/50'}`}>
                    <Icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <span className={`font-semibold ${colors.text}`}>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => window.open("https://discord.gg/mentiora", "_blank")}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded transition-colors"
            >
              Join Community
            </button>
            {isPremium && (
              <button
                onClick={() => openManageBilling()}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded transition-colors"
              >
                Manage Billing
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 max-w-4xl mx-auto">
        {activeTab === "learn" && (
          <div>
            {/* Welcome Header */}
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Welcome back, {getFirstName()}!
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Continue your learning journey 🎓
              </p>
            </div>

            {/* Subjects Section */}
            {filteredSubjects.length > 0 ? (
              <div className="space-y-8">
                {filteredSubjects.map((subject, index) => {
                  const Icon = getSubjectIcon(subject.id);
                  const progress = getSubjectProgress(subject.id);
                  const { completed, total } = getTopicsCompleted(subject.id);
                  const isLocked = index > 0 && getSubjectProgress(filteredSubjects[index - 1].id) < 70;
                  
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-slate-800 dark:to-slate-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                        <CardContent className="p-8">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-4">
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                  GCSE • SEE DETAILS
                                </span>
                              </div>
                              
                              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                {subject.name}
                              </h3>
                              
                              <div className="flex items-center space-x-4 mb-6">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {completed} / {total}
                                  </span>
                                </div>
                                {progress > 0 && (
                                  <div className="bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                                      {progress}% Complete
                                    </span>
                                  </div>
                                )}
                              </div>

                              {progress > 0 && (
                                <div className="bg-white dark:bg-slate-600 rounded-xl p-3 mb-6 shadow-sm">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">💬</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                                      Keep going! You're doing great!
                                    </span>
                                  </div>
                                </div>
                              )}

                              <Button
                                onClick={() => !isLocked && handlePractice(subject.id)}
                                disabled={isLocked}
                                className={`${
                                  isLocked 
                                    ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                                    : "bg-sky-500 hover:bg-sky-600"
                                } text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                              >
                                {isLocked ? (
                                  <>
                                    <Lock className="h-5 w-5 mr-2" />
                                    LOCKED
                                  </>
                                ) : completed === 0 ? (
                                  "START"
                                ) : (
                                  "CONTINUE"
                                )}
                              </Button>
                            </div>

                            <div className="flex-shrink-0 ml-8">
                              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                <Icon className="h-16 w-16 text-white" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                  No subjects selected yet
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Add subjects to your list to get started with personalized learning
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-2xl text-lg"
                >
                  Browse Subjects
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "progress" && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Your Progress
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track your learning progress across all subjects
            </p>
          </div>
        )}

        {activeTab === "2026-exams" && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              2026 Exams
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Practice with AI-predicted exam questions for 2026
            </p>
            <Button
              onClick={() => navigate("/predicted-questions")}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-2xl text-lg"
            >
              View Predicted Questions
            </Button>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Leaderboard
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              See how you rank against other learners
            </p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
              Profile
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage your account settings and preferences
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;