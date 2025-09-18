import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  User,
  Settings,
  LogOut,
  Flame,
  CheckCircle,
  Trophy,
  Star,
  Crown,
  Zap,
  Brain,
  Target,
  Clock,
  LineChart,
  Sparkles,
  Bell,
  Gamepad2,
} from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { PremiumUpgradeModal } from "@/components/ui/premium-upgrade-modal";
import { useState, useEffect } from "react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { openManageBilling } from "@/lib/manageBilling";
import { useSubscription } from "@/hooks/useSubscription";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const Dashboard = () => {
  const { user, logout, isPremium, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const { openPaymentLink } = useSubscription();
  const navigate = useNavigate();
  
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const allSubjects = curriculum.filter(subject => 
    !["maths-edexcel", "business-edexcel-igcse", "chemistry-edexcel", "physics-edexcel"].includes(subject.id)
  );

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const parsedProgress = JSON.parse(savedProgress);
        setUserProgress(parsedProgress);

        // Calculate weak topics
        const weak = parsedProgress
          .filter((p: UserProgress) => p.averageScore < 70)
          .map((p: UserProgress) => p.topicId);
        setWeakTopics(weak);
      }

      // Load pinned subjects
      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }

      // Load user subjects from localStorage
      const savedUserSubjects = localStorage.getItem(`mentiora_user_subjects_${user.id}`);
      if (savedUserSubjects) {
        setUserSubjects(JSON.parse(savedUserSubjects));
      }

      // Calculate streak
      const lastLogin = localStorage.getItem(`last_login_${user.id}`);
      const today = new Date().toDateString();
      
      if (lastLogin) {
        const lastDate = new Date(lastLogin);
        const todayDate = new Date();
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          const streak = parseInt(localStorage.getItem(`study_streak_${user.id}`) || '0') + 1;
          localStorage.setItem(`study_streak_${user.id}`, streak.toString());
          setCurrentStreak(streak);
        } else if (diffDays > 1) {
          localStorage.setItem(`study_streak_${user.id}`, '1');
          setCurrentStreak(1);
        } else {
          setCurrentStreak(parseInt(localStorage.getItem(`study_streak_${user.id}`) || '0'));
        }
      } else {
        localStorage.setItem(`study_streak_${user.id}`, '1');
        setCurrentStreak(1);
      }
      
      localStorage.setItem(`last_login_${user.id}`, today);
      await refreshSubscription();
    };

    loadUserData();
  }, [user?.id, refreshSubscription]);

  const getFirstName = () => {
    if (!user) return "there";
    
    if (user.user_metadata?.full_name) {
      const firstName = user.user_metadata.full_name.split(" ")[0];
      return firstName;
    }
    
    if (user.email) {
      return user.email.split("@")[0];
    }
    
    return "there";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    return Math.round(
      subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / 
      subjectProgress.length
    );
  };

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
    ];
    const index = subjectId.length % colors.length;
    return colors[index];
  };

  const handlePractice = (subjectId: string, topicId?: string) => {
    if (topicId) {
      navigate(`/practice?subject=${subjectId}&topic=${topicId}`);
    } else {
      navigate(`/subject-topics/${subjectId}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const displaySubjects = userSubjects.length > 0 
    ? allSubjects.filter(s => userSubjects.includes(s.id))
    : allSubjects.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
                src="/lovable-uploads/99dd490e-1b20-4181-b127-6915d3c47932.png"
                alt="Mentiora Logo"
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">Mentiora</h1>
                {isPremium && (
                  <div className="flex items-center space-x-1">
                    <Crown className="h-3 w-3 text-primary" />
                    <span className="text-xs text-muted-foreground">Premium</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isPremium && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openManageBilling}
                >
                  Billing
                </Button>
              )}
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {getGreeting()}, {getFirstName()}
          </h2>
          <p className="text-muted-foreground">
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Streak Card */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {currentStreak} Day Streak
                </h3>
                <p className="text-muted-foreground">
                  Keep the momentum going
                </p>
              </div>
            </div>
            <Button onClick={() => handlePractice(displaySubjects[0]?.id || 'maths')}>
              Continue Learning
            </Button>
          </div>
        </Card>

        {/* Predicted Questions */}
        <div className="mb-8">
          <PredictedQuestionsSection 
            isPremium={isPremium}
            onUpgrade={() => setShowPromoModal(true)}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title="Average Score"
            value={userProgress.length > 0 
              ? `${Math.round(userProgress.reduce((sum, p) => sum + p.averageScore, 0) / userProgress.length)}%`
              : '0%'
            }
            subtitle="Across all subjects"
            icon={Target}
            color="bg-blue-500"
          />
          <ProgressCard
            title="Topics Practiced"
            value={userProgress.length.toString()}
            subtitle="Keep going"
            icon={BookOpen}
            color="bg-green-500"
          />
          <ProgressCard
            title="Strong Topics"
            value={userProgress.filter(p => p.averageScore >= 85).length.toString()}
            subtitle="Grade 8+ performance"
            icon={Trophy}
            color="bg-purple-500"
          />
        </div>

        {/* Weak Topics */}
        {weakTopics.length > 0 && (
          <div className="mb-8">
            <WeakTopicsSection
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={handlePractice}
            />
          </div>
        )}

        {/* Subjects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Your Subjects</h3>
            <Badge variant="secondary">
              {displaySubjects.length} subjects
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={{
                  ...subject,
                  color: getSubjectColor(subject.id),
                }}
                progress={userProgress}
                onStartPractice={handlePractice}
                onTogglePin={() => {}}
                isPinned={pinnedSubjects.includes(subject.id)}
                lastActivity={null}
                userId={user?.id}
                onToggleUserSubject={() => {}}
                isUserSubject={userSubjects.includes(subject.id)}
                showAddButton={false}
              />
            ))}
          </div>
        </div>

        {/* Notebook Section */}
        <Card className="mb-8 p-6 bg-gradient-to-r from-accent/5 to-secondary/5 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Brain className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Revision Notebook</h3>
                <p className="text-muted-foreground">
                  {isPremium ? "Access your personalized notes" : "Get instant Grade 9 notes"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => isPremium ? navigate("/notebook") : setShowPromoModal(true)}
            >
              {isPremium ? "Open Notebook" : "Upgrade"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPromoModal}
        onClose={() => setShowPromoModal(false)}
        onUpgrade={openPaymentLink}
      />
    </div>
  );
};

export default Dashboard;