import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
} from "lucide-react";
import { SubjectDailyTasks } from "./SubjectDailyTasks";

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
    icon?: string;
    target: number;
    target_grade?: string; // Original letter grade for A-Level subjects
    pred?: number;
    predicted?: string | number;
    ums?: number;
    umsTarget?: number;
    progress?: number;
    trend: number[];
    strong?: string;
    focus?: string;
    status: string;
  }>;
  weekPlan: any;
  getStatusColor: (subject: any) => string;
  weekTasksCompleted: Set<string>;
  setWeekTasksCompleted: (completed: Set<string>) => void;
  setShowAddSubjects: (show: boolean) => void;
  setSelectedDrawerSubject: (subject: any) => void;
  setSubjectDrawerOpen: (open: boolean) => void;
  setDrawerTab: (tab: 'overview' | 'topics' | 'papers' | 'plan') => void;
  insightFilter: string | null;
  setInsightFilter: (filter: string | null) => void;
  removeSubject: (subjectId: string) => void;
  isPremium?: boolean;
  onUpgradeToPremium?: () => void;
  userId: string;
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
  userId,
  setDrawerTab,
  insightFilter,
  setInsightFilter,
  removeSubject,
  isPremium = false,
  onUpgradeToPremium,
}: MedlySubjectsViewProps) {
  
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

  return (
    <div className="space-y-10">
      {/* Hero Ribbon */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#3B82F6]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#3B82F6]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-[#3B82F6]/10 dark:border-[#3B82F6]/20"
      >
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#3B82F6]/5 pointer-events-none" />
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl"
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
          className="absolute bottom-0 left-0 w-64 h-64 bg-[#60A5FA]/5 rounded-full blur-3xl"
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
                className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight"
              >
                Today's Plan
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#64748B] dark:text-gray-400 font-light"
              >
                Complete your daily tasks to reach your target grades.
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
                className="rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#1d4ed8] hover:to-[#3B82F6] text-white shadow-lg shadow-[#3B82F6]/25 hover:shadow-xl hover:shadow-[#3B82F6]/30 transition-all duration-300 font-medium"
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

          {/* Today's Plan Sections */}
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#3B82F6]/20 dark:border-[#3B82F6]/30 shadow-sm hover:shadow-md hover:shadow-[#3B82F6]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#3B82F6]/20 to-[#3B82F6]/5">
                        <Brain className="h-5 w-5 text-[#3B82F6]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Part 1: Diagnostic</span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="text-2xl font-bold text-foreground"
                      >
                        5 questions
                      </motion.span>
                    </div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-2 font-medium">3 mins • +25 XP</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Quick assessment</p>
                  <p className="text-xs text-muted-foreground">Set today's difficulty based on your current level</p>
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
                        <Target className="h-5 w-5 text-[#16A34A]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Part 2: Focus Practice</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, type: "spring" }}
                      className="text-2xl font-bold text-foreground"
                    >
                      12 questions
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-2 font-medium">8 mins • +60 XP</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Deep practice session</p>
                  <p className="text-xs text-muted-foreground">Focus on your weakest areas with targeted practice</p>
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
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Part 3: Retention Check</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-2xl font-bold text-foreground"
                    >
                      8 questions
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-2 font-medium">6 mins • +40 XP</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Review past topics</p>
                  <p className="text-xs text-muted-foreground">Reinforce what you learned in previous sessions</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 shadow-sm hover:shadow-md hover:shadow-[#8B5CF6]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5">
                        <TrendingUp className="h-5 w-5 text-[#8B5CF6]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Part 4: Challenge Round</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45, type: "spring" }}
                      className="text-2xl font-bold text-foreground"
                    >
                      5 questions
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-2 font-medium">5 mins • +50 XP</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Test yourself with harder questions</p>
                  <p className="text-xs text-muted-foreground">Push your limits with challenging practice</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </motion.div>

      {/* Subject Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Your Subjects</h2>
          {insightFilter && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setInsightFilter(null)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl"
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
                className="group relative rounded-3xl border border-border hover:border-[#3B82F6]/30 dark:hover:border-[#3B82F6]/40 hover:shadow-[0_16px_48px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden bg-gradient-to-br from-background to-muted/20"
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
                  <h3 className="text-xl font-bold text-foreground mb-4 line-clamp-2 tracking-tight">
                    {subject.name.replace(/\s*\(A-Level\)/g, '')}
                  </h3>
                  
                  {/* Unified Progress Bar with Target Indicator */}
                  <div className="space-y-2 mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Progress to Target</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold text-[#3B82F6] ${!isPremium ? 'blur-sm select-none' : ''}`}>
                          {(() => {
                            if (subject.predicted === 'U' || subject.predicted === 'u') return 'U';
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            let numericPred = typeof subject.predicted === 'number' ? subject.predicted : parseFloat(subject.predicted as string) || 0;
                            if (typeof subject.predicted === 'string' && subject.predicted.includes('%')) {
                              const percentage = parseFloat(subject.predicted);
                              if (!isNaN(percentage)) {
                                numericPred = percentage >= 80 ? 9 : percentage >= 70 ? 8 : percentage >= 60 ? 7 : percentage >= 50 ? 6 : percentage >= 40 ? 5 : percentage >= 30 ? 4 : 0;
                              }
                            }
                            if (!isALevel) {
                              const rounded = Math.round(numericPred);
                              return rounded === 0 ? 'U' : rounded;
                            }
                            if (numericPred >= 8.5) return 'A*';
                            if (numericPred >= 7.5) return 'A';
                            if (numericPred >= 6.5) return 'B';
                            if (numericPred >= 5.5) return 'C';
                            if (numericPred >= 4.5) return 'D';
                            if (numericPred >= 3.5) return 'E';
                            return 'U';
                          })()}
                        </span>
                        <ChevronRight className="h-3 w-3 text-[#64748B]" />
                        <span className="text-sm font-bold text-[#16A34A]">
                          {(() => {
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            if (isALevel) {
                              const targetGrade = subject.target_grade?.toString().trim().toUpperCase();
                              if (targetGrade && ['A*', 'A', 'B', 'C', 'D', 'E', 'U'].includes(targetGrade)) {
                                return targetGrade;
                              }
                              const numericTarget = typeof subject.target === 'number' ? subject.target : parseFloat(subject.target as string) || 0;
                              const rounded = Math.round(numericTarget);
                              const numToLetterMap: {[key: number]: string} = {
                                9: 'A*', 8: 'A', 7: 'B', 6: 'C', 5: 'D', 4: 'E', 3: 'E', 2: 'E', 1: 'U', 0: 'U'
                              };
                              return numToLetterMap[rounded] || 'U';
                            }
                            const numericTarget = typeof subject.target === 'number' ? subject.target : parseFloat(subject.target as string) || 0;
                            const rounded = Math.round(numericTarget);
                            return rounded === 0 ? 'U' : rounded;
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar Container */}
                    <div className={`relative w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-600 rounded-full overflow-visible shadow-inner ${!isPremium ? 'blur-sm' : ''}`}>
                      {/* Current Progress Fill */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: (() => {
                          if (subject.predicted === 'U' || subject.predicted === 'u') return '0%';
                          let numericPred = typeof subject.predicted === 'number' ? subject.predicted : parseFloat(subject.predicted as string) || 0;
                          if (typeof subject.predicted === 'string' && subject.predicted.includes('%')) {
                            const percentage = parseFloat(subject.predicted);
                            if (!isNaN(percentage)) {
                              numericPred = percentage >= 80 ? 9 : percentage >= 70 ? 8 : percentage >= 60 ? 7 : percentage >= 50 ? 6 : percentage >= 40 ? 5 : percentage >= 30 ? 4 : 0;
                            }
                          }
                          return `${((Math.max(1, numericPred) - 1) / 8) * 100}%`;
                        })() }}
                        transition={{ duration: 1.2, delay: 0.2 * index, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] rounded-full shadow-sm"
                      />
                      
                      {/* Target Indicator */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1,
                          left: `${((Math.max(1, subject.target) - 1) / 8) * 100}%`
                        }}
                        transition={{ duration: 0.8, delay: 0.4 * index, type: "spring" }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#16A34A] border-2 border-white dark:border-gray-800 rounded-full shadow-lg z-10"
                        style={{ left: `${((Math.max(1, subject.target) - 1) / 8) * 100}%` }}
                      >
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                          <div className="px-1.5 py-0.5 bg-[#16A34A] text-white text-[10px] font-bold rounded shadow-sm">
                            Target
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Daily Tasks */}
                  <div className="mb-5">
                    <SubjectDailyTasks subjectId={subject.id} userId={userId} />
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-2">
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="w-full rounded-xl text-[#3B82F6] hover:bg-[#3B82F6]/10 dark:hover:bg-[#3B82F6]/20 justify-center font-semibold border border-[#3B82F6]/20 hover:border-[#3B82F6]/30 transition-all duration-200"
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
                      className="w-full rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] hover:from-[#1d4ed8] hover:to-[#3B82F6] text-white font-semibold shadow-md shadow-[#3B82F6]/25 hover:shadow-lg hover:shadow-[#3B82F6]/30 transition-all duration-300"
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
              className="group rounded-3xl border-2 border-dashed border-[#3B82F6]/30 hover:border-[#3B82F6]/60 hover:bg-gradient-to-br hover:from-[#3B82F6]/5 hover:to-[#60A5FA]/5 transition-all duration-500 cursor-pointer h-full"
              onClick={() => setShowAddSubjects(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[400px]">
                <motion.div 
                  className="p-6 rounded-full bg-gradient-to-br from-[#3B82F6]/10 to-[#60A5FA]/10 mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Plus className="h-10 w-10 text-[#3B82F6]" />
                </motion.div>
                <h3 className="text-xl font-bold text-foreground mb-2">Add subject</h3>
                <p className="text-sm text-muted-foreground text-center font-medium">
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
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-[#3B82F6]/5 via-white to-[#60A5FA]/5 dark:from-[#3B82F6]/10 dark:via-gray-800 dark:to-[#60A5FA]/10 border border-[#3B82F6]/10 dark:border-[#3B82F6]/20">
          <p className="text-lg text-[#475569] dark:text-gray-300 font-medium leading-relaxed">
            Small, consistent study sessions beat cramming. <span className="text-[#3B82F6] font-bold">You've got this.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
