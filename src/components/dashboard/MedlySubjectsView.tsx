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
import { TodaysPlanCard } from "./TodaysPlanCard";

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

  const handleStartSession = () => {
    // Navigate to practice or show session modal
    console.log("Starting today's session");
  };

  return (
    <div className="space-y-10">
      {/* Today's Plan Card */}
      <TodaysPlanCard
        currentScore={790}
        targetScore={1300}
        streakDays={2}
        dayNumber={2}
        onStartSession={handleStartSession}
      />

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
                  
                  {/* Dual Progress Bars */}
                  <div className="space-y-4 mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Predicted</span>
                        <span className={`text-base font-bold text-foreground ${!isPremium ? 'blur-sm select-none' : ''}`}>
                          {(() => {
                            console.log(`🎯 [${subject.id}] MedlySubjectsView received predicted:`, subject.predicted, 'type:', typeof subject.predicted);
                            
                            // Handle string 'U' directly - don't try to parse it
                            if (subject.predicted === 'U' || subject.predicted === 'u') {
                              return 'U';
                            }
                            
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            let numericPred = typeof subject.predicted === 'number' ? subject.predicted : parseFloat(subject.predicted as string) || 0;
                            
                            // Convert percentage grades (e.g., "37%") to numeric
                            if (typeof subject.predicted === 'string' && subject.predicted.includes('%')) {
                              const percentage = parseFloat(subject.predicted);
                              if (!isNaN(percentage)) {
                                numericPred = percentage >= 80 ? 9 : percentage >= 70 ? 8 : percentage >= 60 ? 7 : percentage >= 50 ? 6 : percentage >= 40 ? 5 : percentage >= 30 ? 4 : 0;
                              }
                            }
                            
                            console.log(`🎯 [${subject.id}] isALevel: ${isALevel}, numericPred: ${numericPred}`);
                            
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
                            if (numericPred >= 3.5) return 'E';
                            console.log(`🎯 [${subject.id}] Returning U because numericPred < 3.5`);
                            return 'U';
                          })()}
                        </span>
                      </div>
                      <div className={`w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner ${!isPremium ? 'blur-sm' : ''}`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: (() => {
                            // Handle string 'U' - show 0% progress
                            if (subject.predicted === 'U' || subject.predicted === 'u') {
                              return '0%';
                            }
                            
                            let numericPred = typeof subject.predicted === 'number' ? subject.predicted : parseFloat(subject.predicted as string) || 0;
                            
                            // Convert percentage grades to numeric
                            if (typeof subject.predicted === 'string' && subject.predicted.includes('%')) {
                              const percentage = parseFloat(subject.predicted);
                              if (!isNaN(percentage)) {
                                numericPred = percentage >= 80 ? 9 : percentage >= 70 ? 8 : percentage >= 60 ? 7 : percentage >= 50 ? 6 : percentage >= 40 ? 5 : percentage >= 30 ? 4 : 0;
                              }
                            }
                            
                            return `${((Math.max(1, numericPred) - 1) / 8) * 100}%`;
                          })() }}
                          transition={{ duration: 1.2, delay: 0.2 * index, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Target</span>
                        <span className="text-base font-bold text-foreground">
                          {(() => {
                            const isALevel = subject.id.toLowerCase().includes('alevel');
                            
                            // For A-Level subjects, always convert to letter grades
                            if (isALevel) {
                              // Check if target_grade is already a valid letter grade
                              const targetGrade = subject.target_grade?.toString().trim().toUpperCase();
                              if (targetGrade && ['A*', 'A', 'B', 'C', 'D', 'E', 'U'].includes(targetGrade)) {
                                return targetGrade;
                              }
                              
                              // Convert numeric target to letter grade for A-Level
                              const numericTarget = typeof subject.target === 'number' ? subject.target : parseFloat(subject.target as string) || 0;
                              const rounded = Math.round(numericTarget);
                              const numToLetterMap: {[key: number]: string} = {
                                9: 'A*', 8: 'A', 7: 'B', 6: 'C', 5: 'D', 4: 'E', 3: 'E', 2: 'E', 1: 'U', 0: 'U'
                              };
                              return numToLetterMap[rounded] || 'U';
                            }
                            
                            // For GCSE, use numeric grades
                            const numericTarget = typeof subject.target === 'number' ? subject.target : parseFloat(subject.target as string) || 0;
                            const rounded = Math.round(numericTarget);
                            return rounded === 0 ? 'U' : rounded;
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
