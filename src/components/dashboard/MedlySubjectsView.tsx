import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  Target,
  Download,
  Clock,
  Calendar,
  Brain,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Play,
  X,
  Crown,
  Star,
  Check,
  Gem,
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Sparkline component
const Sparkline = ({ data, className = "" }: { data: number[]; className?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");
  
  return (
    <svg className={`w-full h-8 ${className}`} viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
};

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward: number;
}

interface MedlySubjectsViewProps {
  profile: {
    name: string;
    overallPred: number;
    overallTarget: number;
    retention: number;
    bestWindow: string;
    weekMinutes: number;
  };
  mockSubjects: Array<{
    id: string;
    name: string;
    icon: string;
    predicted: number | string;
    target: number;
    trend: number[];
    strong: string;
    focus: string;
    status: string;
  }>;
  weekPlan: Record<string, Array<{ s: string; t: string; m: number }>>;
  getStatusColor: (status: string) => string;
  weekTasksCompleted: Set<string>;
  setWeekTasksCompleted: (tasks: Set<string>) => void;
  setShowAddSubjects: (show: boolean) => void;
  setSelectedDrawerSubject: (subject: any) => void;
  setSubjectDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: 'overview' | 'topics' | 'papers' | 'plan') => void;
  insightFilter: string | null;
  setInsightFilter: (filter: string | null) => void;
  removeSubject: (subjectId: string) => void;
  isPremium?: boolean;
  onUpgradeToPremium?: () => void;
  userId?: string;
}

export function MedlySubjectsView({
  profile,
  mockSubjects,
  weekPlan,
  getStatusColor,
  weekTasksCompleted,
  setWeekTasksCompleted,
  setShowAddSubjects,
  setSelectedDrawerSubject,
  setSubjectDrawerOpen,
  setDrawerTab,
  insightFilter,
  setInsightFilter,
  removeSubject,
  isPremium = false,
  onUpgradeToPremium,
  userId,
}: MedlySubjectsViewProps) {
  
  const [quests, setQuests] = useState<Quest[]>([]);
  const [questsLoading, setQuestsLoading] = useState(true);
  const [questsDialogOpen, setQuestsDialogOpen] = useState(false);
  
  // Safe defaults for first-time users with no data
  const safeProfile = {
    overallPred: profile.overallPred || 0,
    overallTarget: profile.overallTarget || 0,
    retention: profile.retention || 0,
    bestWindow: profile.bestWindow || "No data yet",
    weekMinutes: profile.weekMinutes || 0,
  };
  
  const filteredMockSubjects = insightFilter
    ? mockSubjects.filter(s => {
        if (insightFilter === "weak") return s.status === "Off target";
        if (insightFilter === "strong") return s.status === "On track";
        return true;
      })
    : mockSubjects;
  
  const toggleTask = (day: string, index: number) => {
    const taskKey = `${day}-${index}`;
    const newSet = new Set(weekTasksCompleted);
    if (newSet.has(taskKey)) {
      newSet.delete(taskKey);
    } else {
      newSet.add(taskKey);
    }
    setWeekTasksCompleted(newSet);
  };
  
  const totalTasks = Object.values(weekPlan).flat().length;
  const completedTasks = weekTasksCompleted.size;
  const progressPercent = (completedTasks / totalTasks) * 100;

  // Load quests data
  useEffect(() => {
    const loadQuests = async () => {
      if (!userId) return;
      
      setQuestsLoading(true);
      try {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();

        // Get user's MP points data
        const { data: mpData } = await supabase
          .from('user_mp_points' as any)
          .select('*')
          .eq('user_id', userId)
          .maybeSingle() as any;

        // Get today's practice sessions
        const { data: practiceData } = await supabase
          .from('practice_sessions' as any)
          .select('*')
          .eq('user_id', userId)
          .gte('completed_at', todayStart) as any;

        // Get study sessions
        const { data: sessionData } = await supabase
          .from('study_sessions' as any)
          .select('*')
          .eq('user_id', userId)
          .gte('started_at', todayStart) as any;

        // Get current streak
        const { data: streakData } = await supabase
          .from('user_streaks' as any)
          .select('*')
          .eq('user_id', userId)
          .maybeSingle() as any;

        // Calculate quest progress
        const loginToday = mpData?.last_login_date === today.toISOString().split('T')[0];
        const practiceCount = practiceData?.length || 0;
        const studyMinutes = sessionData?.reduce((sum: number, s: any) => sum + (s.duration_minutes || 0), 0) || 0;
        const currentStreak = streakData?.streak_count || 0;

        const questsData: Quest[] = [
          {
            id: 'login',
            title: 'Daily Login',
            description: 'Log in today',
            progress: loginToday ? 1 : 0,
            total: 1,
            completed: loginToday,
            reward: 10,
          },
          {
            id: 'practice',
            title: 'Complete Practice',
            description: 'Complete a practice session',
            progress: Math.min(practiceCount, 1),
            total: 1,
            completed: practiceCount >= 1,
            reward: 40,
          },
          {
            id: 'study',
            title: 'Study 15 minutes',
            description: 'Study for at least 15 minutes',
            progress: Math.min(studyMinutes, 15),
            total: 15,
            completed: studyMinutes >= 15,
            reward: 25,
          },
          {
            id: 'streak',
            title: '7-Day Streak',
            description: 'Maintain a 7-day streak',
            progress: Math.min(currentStreak, 7),
            total: 7,
            completed: currentStreak >= 7,
            reward: 500,
          },
        ];

        setQuests(questsData);
      } catch (error) {
        console.error('Error loading quests:', error);
      } finally {
        setQuestsLoading(false);
      }
    };

    loadQuests();
    const interval = setInterval(loadQuests, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const completedQuestsCount = quests.filter(q => q.completed).length;
  const totalMP = quests.reduce((sum, q) => sum + (q.completed ? q.reward : 0), 0);

  return (
    <div className="space-y-10">
      {/* Hero Ribbon */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
      >
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#0EA5E9]/5 pointer-events-none" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight"
              >
                Your Subjects
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#64748B] dark:text-gray-400 font-light"
              >
                Predicted grades, weak topics & weekly plan at a glance.
              </motion.p>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <Button 
                onClick={() => setShowAddSubjects(true)}
                className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all duration-300 font-medium"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              {!isPremium && onUpgradeToPremium && (
                <Button 
                  onClick={onUpgradeToPremium}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 font-medium"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
              )}
            </motion.div>
          </div>

          {/* KPI Belt */}
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                        <Target className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Overall Progress</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="text-3xl font-bold text-[#0F172A] dark:text-white"
                      >
                        {safeProfile.overallPred}
                      </motion.span>
                      <span className="text-sm text-[#64748B] dark:text-gray-400 font-medium">→</span>
                      <span className="text-xl font-bold text-[#0EA5E9]">{safeProfile.overallTarget}</span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 h-2 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${safeProfile.overallPred > 0 ? (safeProfile.overallPred / 10) * 100 : 0}%` }}
                          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Average predicted grade across all subjects</p>
                  <p className="text-xs text-muted-foreground">Calculated from your exam completions and practice performance compared to your target grades</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#16A34A]/20 dark:border-[#16A34A]/30 shadow-sm hover:shadow-md hover:shadow-[#16A34A]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                        <Brain className="h-5 w-5 text-[#16A34A]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Retention</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      {Math.round(safeProfile.retention * 100)}%
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Last 7 days</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Your knowledge retention rate</p>
                  <p className="text-xs text-muted-foreground">Average accuracy from all practice attempts in the last 7 days</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#F59E0B]/20 dark:border-[#F59E0B]/30 shadow-sm hover:shadow-md hover:shadow-[#F59E0B]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5">
                        <Clock className="h-5 w-5 text-[#F59E0B]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">You perform best at</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      {safeProfile.bestWindow}
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Your peak focus hours</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">We think you perform best at this time</p>
                  <p className="text-xs text-muted-foreground">Based on your practice history, this 2-hour window is when you achieve your highest scores. Try scheduling important study sessions during these peak hours!</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                        <Calendar className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">This Week</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      {Math.floor(safeProfile.weekMinutes / 60)}h {safeProfile.weekMinutes % 60}m
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">Time saved</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Total time saved this week</p>
                  <p className="text-xs text-muted-foreground">Time saved through auto-generated notes that help you learn faster and revise efficiently</p>
                </TooltipContent>
              </Tooltip>

              {/* Daily Quests Compact Card */}
              {userId && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#FBBF24]/20 dark:border-[#FBBF24]/30 shadow-sm hover:shadow-md hover:shadow-[#FBBF24]/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FBBF24]/20 to-[#FBBF24]/5">
                      <Star className="h-5 w-5 text-[#FBBF24]" />
                    </div>
                    <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Daily Quests</span>
                  </div>
                  
                  {questsLoading ? (
                    <div className="space-y-3">
                      <div className="h-10 bg-[#F1F5F9] dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-10 bg-[#F1F5F9] dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-10 bg-[#F1F5F9] dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Preview first 3 quests */}
                      {quests.slice(0, 3).map((quest) => (
                        <div key={quest.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {quest.completed ? (
                                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-[#16A34A] to-[#22C55E] flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-[#E2E8F0] dark:border-gray-600" />
                              )}
                              <span className={`text-xs font-medium truncate ${quest.completed ? 'text-[#16A34A] dark:text-green-400' : 'text-[#64748B] dark:text-gray-400'}`}>
                                {quest.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Gem className="h-3 w-3 text-[#FBBF24]" />
                              <span className="text-xs font-bold text-[#FBBF24]">{quest.reward}</span>
                            </div>
                          </div>
                          <Progress 
                            value={(quest.progress / quest.total) * 100} 
                            className="h-1.5"
                          />
                        </div>
                      ))}
                      
                      {/* Summary and View All Button */}
                      <div className="pt-3 border-t border-[#E2E8F0] dark:border-gray-700 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#64748B] dark:text-gray-400 font-medium">
                            {completedQuestsCount}/{quests.length} Complete
                          </span>
                          {totalMP > 0 && (
                            <div className="flex items-center gap-1">
                              <Gem className="h-3.5 w-3.5 text-[#FBBF24]" />
                              <span className="font-bold text-[#FBBF24]">+{totalMP} MP</span>
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setQuestsDialogOpen(true)}
                          className="w-full h-8 text-xs rounded-lg text-[#FBBF24] hover:bg-[#FBBF24]/10 dark:hover:bg-[#FBBF24]/20 font-semibold transition-all duration-200"
                        >
                          View All Quests
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Subject Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">Your Subjects</h2>
          {insightFilter && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setInsightFilter(null)}
              className="text-[#64748B] dark:text-gray-400 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-gray-700 rounded-xl"
            >
              Clear filter <X className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMockSubjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card 
                className="group relative rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_16px_48px_rgba(14,165,233,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900"
                onClick={() => {
                  setSelectedDrawerSubject(subject);
                  setSubjectDrawerOpen(true);
                }}
              >
                {/* Premium shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Remove button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg text-[#64748B] dark:text-gray-400 hover:text-[#EF4444] hover:bg-[#FEF2F2] dark:hover:bg-red-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSubject(subject.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>

                <CardContent className="p-7 relative">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <motion.div 
                      className="flex items-center gap-3"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{subject.icon}</div>
                      <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusColor(subject.status)} shadow-sm`}>
                        {subject.status}
                      </Badge>
                    </motion.div>
                  </div>
                  
                  {/* Subject Name */}
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-4 line-clamp-2 tracking-tight">
                    {subject.name}
                  </h3>
                  
                  {/* Dual Progress Bars */}
                  <div className="space-y-4 mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Predicted</span>
                        <span className="text-base font-bold text-[#0F172A] dark:text-white">
                          {(() => {
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            const numericPred = typeof subject.predicted === 'number' ? subject.predicted : parseFloat(subject.predicted as string) || 0;
                            if (!isALevel) {
                              const rounded = Math.round(numericPred);
                              return rounded === 0 ? 'U' : rounded;
                            }
                            // Convert numeric grade (1-9) to A-Level letter grade
                            if (numericPred >= 8.5) return 'A*';
                            if (numericPred >= 7.5) return 'A';
                            if (numericPred >= 6.5) return 'B';
                            if (numericPred >= 5.5) return 'C';
                            if (numericPred >= 4.5) return 'D';
                            if (numericPred >= 2.5) return 'E';
                            return 'U';
                          })()}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: typeof subject.predicted === 'number' ? `${((Math.max(1, subject.predicted) - 1) / 8) * 100}%` : '0%' }}
                          transition={{ duration: 1.2, delay: 0.2 * index, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Target</span>
                        <span className="text-base font-bold text-[#0F172A] dark:text-white">
                          {(() => {
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            const numericTarget = typeof subject.target === 'number' ? subject.target : parseFloat(subject.target as string) || 0;
                            if (!isALevel) {
                              const rounded = Math.round(numericTarget);
                              return rounded === 0 ? 'U' : rounded;
                            }
                            // Convert numeric grade (1-9) to A-Level letter grade
                            if (subject.target >= 8.5) return 'A*';
                            if (subject.target >= 7.5) return 'A';
                            if (subject.target >= 6.5) return 'B';
                            if (subject.target >= 5.5) return 'C';
                            if (subject.target >= 4.5) return 'D';
                            if (subject.target >= 2.5) return 'E';
                            return 'U';
                          })()}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${((Math.max(1, subject.target) - 1) / 8) * 100}%` }}
                          transition={{ duration: 1.2, delay: 0.3 * index, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/5 to-transparent dark:from-[#0EA5E9]/10 dark:to-transparent border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20">
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mb-2 font-semibold uppercase tracking-wider">Last 6 attempts</div>
                    <Sparkline data={subject.trend} className="text-[#0EA5E9] opacity-80" />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="w-full rounded-xl text-[#0EA5E9] hover:bg-[#0EA5E9]/10 dark:hover:bg-[#0EA5E9]/20 justify-center font-semibold border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/30 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerSubject(subject);
                        setSubjectDrawerOpen(true);
                      }}
                    >
                      View insights
                    </Button>
                    <Button 
                      size="sm"
                      className="w-full rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-semibold shadow-md shadow-[#0EA5E9]/25 hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerSubject(subject);
                        setDrawerTab('topics');
                        setSubjectDrawerOpen(true);
                      }}
                    >
                      Topics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          
          {/* Add Subject Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * filteredMockSubjects.length }}
          >
            <Card 
              className="group rounded-3xl border-2 border-dashed border-[#0EA5E9]/30 hover:border-[#0EA5E9]/60 hover:bg-gradient-to-br hover:from-[#0EA5E9]/5 hover:to-[#38BDF8]/5 transition-all duration-500 cursor-pointer h-full"
              onClick={() => setShowAddSubjects(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[400px]">
                <motion.div 
                  className="p-6 rounded-full bg-gradient-to-br from-[#0EA5E9]/10 to-[#38BDF8]/10 mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Plus className="h-10 w-10 text-[#0EA5E9]" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-2">Add subject</h3>
                <p className="text-sm text-[#64748B] text-center font-medium">
                  Start tracking a new subject
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>


      {/* Footer Nudge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-12 px-6"
      >
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-[#0EA5E9]/5 via-white to-[#38BDF8]/5 dark:from-[#0EA5E9]/10 dark:via-gray-800 dark:to-[#38BDF8]/10 border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20">
          <p className="text-lg text-[#475569] dark:text-gray-300 font-medium leading-relaxed">
            Small, consistent study sessions beat cramming. <span className="text-[#0EA5E9] font-bold">You've got this.</span>
          </p>
        </div>
      </motion.div>

      {/* Daily Quests Dialog */}
      <Dialog open={questsDialogOpen} onOpenChange={setQuestsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#FBBF24]/20 to-[#FBBF24]/5">
                <Star className="h-6 w-6 text-[#FBBF24]" />
              </div>
              Daily Quests
            </DialogTitle>
          </DialogHeader>

          {questsLoading ? (
            <div className="space-y-4 py-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Progress Summary */}
              <div className="bg-gradient-to-br from-[#FBBF24]/10 to-[#FBBF24]/5 dark:from-[#FBBF24]/20 dark:to-[#FBBF24]/10 rounded-xl p-6 border border-[#FBBF24]/20">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-3xl font-bold text-foreground">{completedQuestsCount}/{quests.length}</div>
                    <div className="text-sm text-muted-foreground font-medium">Quests Completed</div>
                  </div>
                  {totalMP > 0 && (
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Gem className="h-5 w-5 text-[#FBBF24]" />
                        <span className="text-3xl font-bold text-[#FBBF24]">+{totalMP}</span>
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">MP Earned</div>
                    </div>
                  )}
                </div>
                <Progress value={(completedQuestsCount / quests.length) * 100} className="h-2.5 mt-4" />
              </div>

              {/* Quest List */}
              <div className="space-y-4">
                {quests.map((quest) => (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      quest.completed
                        ? 'bg-[#16A34A]/5 border-[#16A34A]/30 dark:bg-[#16A34A]/10'
                        : 'bg-card border-border hover:border-[#FBBF24]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                          quest.completed
                            ? 'bg-[#16A34A] border-[#16A34A]'
                            : 'border-border'
                        }`}>
                          {quest.completed && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-bold text-base mb-1 ${
                            quest.completed 
                              ? 'text-[#16A34A] line-through' 
                              : 'text-foreground'
                          }`}>
                            {quest.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{quest.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Gem className="h-4 w-4 text-[#FBBF24]" />
                        <span className="text-sm font-bold text-[#FBBF24]">+{quest.reward}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Progress</span>
                        <span className="font-bold text-foreground">{quest.progress}/{quest.total}</span>
                      </div>
                      <Progress 
                        value={(quest.progress / quest.total) * 100} 
                        className={`h-2.5 ${quest.completed ? 'bg-[#16A34A]/20' : ''}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Completion Message */}
              {completedQuestsCount === quests.length && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-6 bg-gradient-to-br from-[#16A34A]/10 to-[#16A34A]/5 rounded-xl border border-[#16A34A]/30"
                >
                  <div className="text-4xl mb-2">🎉</div>
                  <h3 className="text-lg font-bold text-foreground mb-1">All Quests Complete!</h3>
                  <p className="text-sm text-muted-foreground">Come back tomorrow for new quests</p>
                </motion.div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
