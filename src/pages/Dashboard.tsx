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

  // Sidebar navigation items
  const sidebarItems = [
    { id: "learn", label: "Learn", icon: Home },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "2026-exams", label: "2026 Exams", icon: Target },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    { id: "profile", label: "Profile", icon: User },
  ];

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
    <div className="min-h-screen bg-background flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">Mentiora</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between text-sm">
            <button
              onClick={() => window.open("https://discord.gg/mentiora", "_blank")}
              className="text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
            >
              Join Community
            </button>
            {isPremium && (
              <button
                onClick={() => openManageBilling()}
                className="text-muted-foreground hover:text-foreground px-2 py-1 rounded transition-colors"
              >
                Manage Billing
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "learn" && (
          <div>
            {/* Welcome Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {getFirstName()}!
              </h2>
              <p className="text-muted-foreground">
                Continue your learning journey
              </p>
            </div>

            {/* Subjects Grid */}
            {filteredSubjects.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Your Subjects
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredSubjects.map((subject) => {
                    const Icon = getSubjectIcon(subject.id);
                    const progress = getSubjectProgress(subject.id);
                    
                    return (
                      <motion.div
                        key={subject.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Card 
                          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-border bg-card"
                          onClick={() => handlePractice(subject.id)}
                        >
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl">
                              <Icon className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-center text-base font-semibold text-foreground">
                              {subject.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <div className="text-center">
                                <span className="text-sm font-medium text-muted-foreground">
                                  {progress}% Complete
                                </span>
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
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No subjects selected yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Add subjects to your list to get started with personalized learning
                </p>
                <Button
                  onClick={() => navigate("/")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Subjects
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === "progress" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Your Progress
            </h2>
            <p className="text-muted-foreground">
              Track your learning progress across all subjects
            </p>
          </div>
        )}

        {activeTab === "2026-exams" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              2026 Exams
            </h2>
            <p className="text-muted-foreground mb-6">
              Practice with AI-predicted exam questions for 2026
            </p>
            <Button
              onClick={() => navigate("/predicted-questions")}
              className="bg-primary hover:bg-primary/90"
            >
              View Predicted Questions
            </Button>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Leaderboard
            </h2>
            <p className="text-muted-foreground">
              See how you rank against other learners
            </p>
          </div>
        )}

        {activeTab === "profile" && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">
              Profile
            </h2>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;