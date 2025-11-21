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
import { ProgressSummary } from "./ProgressSummary";
import { SATSections } from "./SATSections";

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

  const handleStartPart = (partNumber: number) => {
    console.log("Starting part:", partNumber);
    // Navigate to /session/diagnostic or appropriate route
  };

  const handleViewTopics = (section: "math" | "readingWriting") => {
    console.log("View topics for:", section);
    // Navigate to topics page for that section
  };

  // Mock data for today's plan
  const todaysPlan = {
    dayNumber: 2,
    focusTopic: "Linear Equations",
    focusReason: "Your weakest area",
    parts: [
      {
        number: 1,
        name: "Diagnostic",
        description: "Quick assessment to set today's difficulty",
        questions: 5,
        minutes: 3,
        xp: 25,
        status: "not_started" as const,
        locked: false,
      },
      {
        number: 2,
        name: "Focus Practice",
        description: "Deep practice on Linear Equations",
        questions: 12,
        minutes: 8,
        xp: 60,
        status: "locked" as const,
        locked: true,
        unlock_message: "Complete Part 1 first",
      },
      {
        number: 3,
        name: "Retention Check",
        description: "Review topics from past days",
        questions: 8,
        minutes: 6,
        xp: 40,
        status: "locked" as const,
        locked: true,
        unlock_message: "Complete Part 2 first",
      },
      {
        number: 4,
        name: "Challenge Round",
        description: "Test yourself with hard questions",
        questions: 5,
        minutes: 3,
        xp: 25,
        status: "locked" as const,
        locked: true,
        unlock_message: "Complete Part 3 first",
      },
    ],
    allCompleted: false,
  };

  // Mock data for SAT sections
  const satSections = {
    math: {
      current: 410,
      target: 650,
      max: 800,
      weak_areas: ["Algebra", "Problem Solving"],
      status: "IN PROGRESS",
    },
    readingWriting: {
      current: 380,
      target: 650,
      max: 800,
      weak_areas: ["Grammar", "Vocabulary"],
      status: "IN PROGRESS",
    },
  };

  return (
    <div className="space-y-0">
      {/* Today's Plan Card */}
      <TodaysPlanCard
        dayNumber={todaysPlan.dayNumber}
        focusTopic={todaysPlan.focusTopic}
        focusReason={todaysPlan.focusReason}
        parts={todaysPlan.parts}
        allCompleted={todaysPlan.allCompleted}
        onStartPart={handleStartPart}
      />

      {/* Progress Summary One-Line Strip */}
      <ProgressSummary
        currentScore={790}
        targetScore={1300}
        daysToExam={58}
        streakDays={2}
      />

      {/* SAT Sections */}
      <SATSections
        math={satSections.math}
        readingWriting={satSections.readingWriting}
        onViewTopics={handleViewTopics}
      />
    </div>
  );
}
