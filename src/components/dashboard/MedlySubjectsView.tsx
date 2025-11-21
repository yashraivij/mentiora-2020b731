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
    <div className="space-y-8">
      {/* TODAY'S PLAN CARD */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-foreground">📋 Today's Plan</h2>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-destructive">
                <span>🔥</span>
                <span>2-Day Streak</span>
              </div>
            </div>
            
            {/* Subheading */}
            <p className="text-muted-foreground mb-6">
              Day 2 • Focus: <span className="font-semibold text-foreground">Linear Equations</span> (your weakest area)
            </p>
            
            {/* 4 Session Cards */}
            <div className="space-y-3 mb-6">
              {/* Part 1 - Active/Clickable */}
              <div className="bg-[#F9FAFB] dark:bg-muted/30 border-2 border-primary rounded-xl p-4 cursor-pointer hover:bg-primary/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Part 1: Diagnostic</h3>
                    <p className="text-sm text-muted-foreground">5 questions • 3 mins</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <Play className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </div>
              
              {/* Part 2 - Locked */}
              <div className="bg-[#F9FAFB] dark:bg-muted/30 border rounded-xl p-4 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Part 2: Focus Practice</h3>
                    <p className="text-sm text-muted-foreground">12 questions • 8 mins</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
              </div>
              
              {/* Part 3 - Locked */}
              <div className="bg-[#F9FAFB] dark:bg-muted/30 border rounded-xl p-4 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Part 3: Retention</h3>
                    <p className="text-sm text-muted-foreground">8 questions • 6 mins</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
              </div>
              
              {/* Part 4 - Locked */}
              <div className="bg-[#F9FAFB] dark:bg-muted/30 border rounded-xl p-4 opacity-60 cursor-not-allowed">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Part 4: Challenge</h3>
                    <p className="text-sm text-muted-foreground">5 questions • 3 mins</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔒</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Start Button */}
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base">
              Start Diagnostic →
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* ONE-LINE PROGRESS BAR */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Current: 790</span>
              <span>→</span>
              <span className="font-semibold text-foreground">Target: 1300</span>
              <span className="text-muted-foreground/50">|</span>
              <span>58 days to exam</span>
              <span className="text-muted-foreground/50">|</span>
              <span className="flex items-center gap-1">
                🔥 <span className="font-semibold text-foreground">2 streak</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* TWO SAT SECTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            className="rounded-2xl border hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => {
              // Navigate to Math practice
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📐</span>
                    <h3 className="text-xl font-bold text-foreground">Math</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">410</span>
                    <span className="text-muted-foreground">/800</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "51%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              
              {/* Weak Area */}
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="font-normal">
                  Weak: Algebra
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Reading & Writing Section Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            className="rounded-2xl border hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => {
              // Navigate to Reading & Writing practice
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">📖</span>
                    <h3 className="text-xl font-bold text-foreground">Reading & Writing</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">380</span>
                    <span className="text-muted-foreground">/800</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "48%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              
              {/* Weak Area */}
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="font-normal">
                  Weak: Grammar
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
