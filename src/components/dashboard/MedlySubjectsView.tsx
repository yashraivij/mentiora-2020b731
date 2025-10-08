import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

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
    icon: string;
    predicted: number;
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
  insightFilter: string | null;
  setInsightFilter: (filter: string | null) => void;
  removeSubject: (subjectId: string) => void;
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
  insightFilter,
  setInsightFilter,
  removeSubject,
}: MedlySubjectsViewProps) {
  
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
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 p-8 md:p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10"
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
                className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-3 tracking-tight"
              >
                Your Subjects
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-[#64748B] font-light"
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
              <Button variant="ghost" className="rounded-xl text-[#0EA5E9] hover:bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/30 transition-all duration-200 font-medium">
                <Target className="h-4 w-4 mr-2" />
                Update Targets
              </Button>
              <Button variant="ghost" className="rounded-xl text-[#0EA5E9] hover:bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/30 transition-all duration-200 font-medium">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </motion.div>
          </div>

          {/* KPI Belt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                  <Target className="h-5 w-5 text-[#0EA5E9]" />
                </div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Overall Progress</span>
              </div>
              <div className="flex items-baseline gap-3">
                <motion.span 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="text-3xl font-bold text-[#0F172A]"
                >
                  {profile.overallPred}
                </motion.span>
                <span className="text-sm text-[#64748B] font-medium">→</span>
                <span className="text-xl font-bold text-[#0EA5E9]">{profile.overallTarget}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="flex-1 h-2 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile.overallPred / 10) * 100}%` }}
                    transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-[#16A34A]/20 shadow-sm hover:shadow-md hover:shadow-[#16A34A]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                  <Brain className="h-5 w-5 text-[#16A34A]" />
                </div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Retention</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35, type: "spring" }}
                className="text-3xl font-bold text-[#0F172A]"
              >
                {Math.round(profile.retention * 100)}%
              </motion.div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">Last 7 days</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-[#F59E0B]/20 shadow-sm hover:shadow-md hover:shadow-[#F59E0B]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5">
                  <Clock className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Best Study Time</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
                className="text-3xl font-bold text-[#0F172A]"
              >
                {profile.bestWindow}
              </motion.div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">Most productive</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                  <Calendar className="h-5 w-5 text-[#0EA5E9]" />
                </div>
                <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">This Week</span>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45, type: "spring" }}
                className="text-3xl font-bold text-[#0F172A]"
              >
                {Math.floor(profile.weekMinutes / 60)}h {profile.weekMinutes % 60}m
              </motion.div>
              <div className="text-xs text-[#64748B] mt-1 font-medium">Study time</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subject Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Your Subjects</h2>
          {insightFilter && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setInsightFilter(null)}
              className="text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-xl"
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
                className="group relative rounded-3xl border border-[#E2E8F0]/50 hover:border-[#0EA5E9]/30 hover:shadow-[0_16px_48px_rgba(14,165,233,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden bg-gradient-to-br from-white to-[#F8FAFC]"
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
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-lg text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all duration-200 opacity-0 group-hover:opacity-100"
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
                  <h3 className="text-xl font-bold text-[#0F172A] mb-4 line-clamp-2 tracking-tight">
                    {subject.name}
                  </h3>
                  
                  {/* Dual Progress Bars */}
                  <div className="space-y-4 mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white border border-[#E2E8F0]/50">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">Predicted</span>
                        <span className="text-base font-bold text-[#0F172A]">{subject.predicted}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(subject.predicted / 10) * 100}%` }}
                          transition={{ duration: 1.2, delay: 0.2 * index, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">Target</span>
                        <span className="text-base font-bold text-[#0F172A]">{subject.target}</span>
                      </div>
                      <div className="w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(subject.target / 10) * 100}%` }}
                          transition={{ duration: 1.2, delay: 0.3 * index, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#16A34A] to-[#22C55E] rounded-full shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/5 to-transparent border border-[#0EA5E9]/10">
                    <div className="text-xs text-[#64748B] mb-2 font-semibold uppercase tracking-wider">Last 6 attempts</div>
                    <Sparkline data={subject.trend} className="text-[#0EA5E9] opacity-80" />
                  </div>
                  
                  {/* Strong / Focus */}
                  <div className="mb-5 space-y-2">
                    <p className="text-xs text-[#64748B]">
                      <span className="font-bold text-[#16A34A]">✓ Strong:</span> <span className="text-[#475569]">{subject.strong}</span>
                    </p>
                    <p className="text-xs text-[#64748B]">
                      <span className="font-bold text-[#EF4444]">⚠ Focus:</span> <span className="text-[#475569]">{subject.focus}</span>
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="flex-1 rounded-xl text-[#0EA5E9] hover:bg-[#0EA5E9]/10 justify-between font-semibold border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/30 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDrawerSubject(subject);
                        setSubjectDrawerOpen(true);
                      }}
                    >
                      View insights
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white px-5 font-semibold shadow-md shadow-[#0EA5E9]/25 hover:shadow-lg hover:shadow-[#0EA5E9]/30 transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Quiz
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

      {/* Insights Stripe */}
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Insights for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card 
              className="rounded-2xl border border-[#16A34A]/20 bg-gradient-to-br from-white to-[#16A34A]/5 cursor-pointer hover:shadow-xl hover:shadow-[#16A34A]/10 transition-all duration-300"
              onClick={() => setInsightFilter("strong")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/10">
                    <TrendingUp className="h-6 w-6 text-[#16A34A]" />
                  </div>
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Strongest</span>
                </div>
                <div className="text-3xl font-bold text-[#0F172A] mb-2">Chemistry</div>
                <p className="text-sm text-[#64748B] font-medium">0.8 from target</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card 
              className="rounded-2xl border border-[#F59E0B]/20 bg-gradient-to-br from-white to-[#F59E0B]/5 cursor-pointer hover:shadow-xl hover:shadow-[#F59E0B]/10 transition-all duration-300"
              onClick={() => setInsightFilter("weak")}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/10">
                    <TrendingDown className="h-6 w-6 text-[#F59E0B]" />
                  </div>
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Focus Area</span>
                </div>
                <div className="text-3xl font-bold text-[#0F172A] mb-2">Physics</div>
                <p className="text-sm text-[#64748B] font-medium">Try 20 mins today</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="rounded-2xl border border-[#0EA5E9]/20 bg-gradient-to-br from-white to-[#0EA5E9]/5 hover:shadow-xl hover:shadow-[#0EA5E9]/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/10">
                    <TrendingUp className="h-6 w-6 text-[#0EA5E9]" />
                  </div>
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Weekly Gain</span>
                </div>
                <div className="text-3xl font-bold text-[#0F172A] mb-2">+0.4</div>
                <p className="text-sm text-[#64748B] font-medium">Biology improving</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="rounded-2xl border border-[#EF4444]/20 bg-gradient-to-br from-white to-[#EF4444]/5 hover:shadow-xl hover:shadow-[#EF4444]/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/10">
                    <Target className="h-6 w-6 text-[#EF4444]" />
                  </div>
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">At Risk</span>
                </div>
                <div className="text-3xl font-bold text-[#0F172A] mb-2">2 topics</div>
                <p className="text-sm text-[#64748B] font-medium">Need attention</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">This week to hit your targets</h2>
            <p className="text-sm text-[#64748B] mt-2 font-medium">{completedTasks} of {totalTasks} tasks completed · {Math.round((completedTasks / totalTasks) * 100)}%</p>
          </div>
          <Button variant="outline" className="rounded-xl border-2 border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#0EA5E9]/10 font-semibold shadow-sm hover:shadow-md transition-all duration-200">
            Generate plan
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#16A34A] rounded-full shadow-sm"
          />
        </div>
        
        {/* Day Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Object.entries(weekPlan).map(([day, tasks], dayIndex) => (
            <motion.div
              key={day}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: dayIndex * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card className="min-w-[300px] rounded-3xl border border-[#E2E8F0]/50 hover:border-[#0EA5E9]/30 hover:shadow-xl hover:shadow-[#0EA5E9]/10 transition-all duration-300 flex-shrink-0 bg-gradient-to-br from-white to-[#F8FAFC]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-[#0F172A] text-lg">{day}</h3>
                    <span className="text-xs text-[#64748B] font-semibold">Jan {22 + dayIndex}</span>
                  </div>
                
                  <div className="space-y-3">
                    {tasks.map((task, taskIndex) => {
                      const taskKey = `${day}-${taskIndex}`;
                      const isCompleted = weekTasksCompleted.has(taskKey);
                      
                      return (
                        <motion.div 
                          key={taskIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: taskIndex * 0.05 }}
                          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-white border border-[#E2E8F0]/50 hover:border-[#0EA5E9]/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
                          onClick={() => toggleTask(day, taskIndex)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <input 
                            type="checkbox" 
                            checked={isCompleted}
                            onChange={() => {}}
                            className="mt-1 rounded-md border-[#CBD5E1] text-[#0EA5E9] focus:ring-[#0EA5E9] focus:ring-offset-0 w-5 h-5" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm font-semibold ${isCompleted ? 'text-[#94A3B8] line-through' : 'text-[#0F172A]'} mb-1`}>
                              {task.s} • {task.t}
                            </div>
                            <div className="text-xs text-[#64748B] font-medium">{task.m} mins</div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    <button className="w-full py-3 text-sm text-[#0EA5E9] hover:bg-[#0EA5E9]/10 rounded-2xl transition-all duration-200 font-semibold border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40">
                      + Add task
                    </button>
                  </div>
                
                  {/* Day Progress */}
                  <div className="mt-5 pt-5 border-t border-[#E2E8F0]">
                    <div className="w-full h-2.5 bg-gradient-to-r from-[#F1F5F9] to-[#E2E8F0] rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(tasks.filter((_, i) => weekTasksCompleted.has(`${day}-${i}`)).length / tasks.length) * 100}%` }}
                        transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#0EA5E9] via-[#38BDF8] to-[#0EA5E9] rounded-full shadow-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Nudge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center py-12 px-6"
      >
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-gradient-to-br from-[#0EA5E9]/5 via-white to-[#38BDF8]/5 border border-[#0EA5E9]/10">
          <p className="text-lg text-[#475569] font-medium leading-relaxed">
            Small, consistent study sessions beat cramming. <span className="text-[#0EA5E9] font-bold">You've got this.</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
