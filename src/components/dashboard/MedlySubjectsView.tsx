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
        className="relative overflow-hidden rounded-2xl bg-white p-8 md:p-10 shadow-[0_6px_24px_rgba(31,107,255,0.08)]"
      >
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold text-[#0F172A] mb-3">Your Subjects</h1>
              <p className="text-lg text-[#5D6470]">Predicted grades, weak topics & weekly plan at a glance.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                onClick={() => setShowAddSubjects(true)}
                className="rounded-xl bg-[#1F6BFF] hover:bg-[#1456DA] text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
              <Button variant="ghost" className="rounded-xl text-[#1F6BFF] hover:bg-[#1F6BFF]/5">
                <Target className="h-4 w-4 mr-2" />
                Update Targets
              </Button>
              <Button variant="ghost" className="rounded-xl text-[#1F6BFF] hover:bg-[#1F6BFF]/5">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>

          {/* KPI Belt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#1F6BFF]/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#1F6BFF]/10">
                  <Target className="h-5 w-5 text-[#1F6BFF]" />
                </div>
                <span className="text-xs font-medium text-[#5D6470]">Overall Progress</span>
              </div>
              <div className="flex items-baseline gap-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-semibold text-[#0F172A]"
                >
                  {profile.overallPred}
                </motion.span>
                <span className="text-sm text-[#5D6470]">→</span>
                <span className="text-lg font-medium text-[#1F6BFF]">{profile.overallTarget}</span>
              </div>
              <div className="mt-2 flex gap-2">
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(profile.overallPred / 10) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-[#1F6BFF] rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#1F6BFF]/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#16A34A]/10">
                  <Brain className="h-5 w-5 text-[#16A34A]" />
                </div>
                <span className="text-xs font-medium text-[#5D6470]">Retention</span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-2xl font-semibold text-[#0F172A]"
              >
                {Math.round(profile.retention * 100)}%
              </motion.div>
              <div className="text-xs text-[#5D6470] mt-1">Last 7 days</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#1F6BFF]/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#F59E0B]/10">
                  <Clock className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <span className="text-xs font-medium text-[#5D6470]">Best Study Time</span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-semibold text-[#0F172A]"
              >
                {profile.bestWindow}
              </motion.div>
              <div className="text-xs text-[#5D6470] mt-1">Most productive</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-[#1F6BFF]/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[#1F6BFF]/10">
                  <Calendar className="h-5 w-5 text-[#1F6BFF]" />
                </div>
                <span className="text-xs font-medium text-[#5D6470]">This Week</span>
              </div>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-2xl font-semibold text-[#0F172A]"
              >
                {Math.floor(profile.weekMinutes / 60)}h {profile.weekMinutes % 60}m
              </motion.div>
              <div className="text-xs text-[#5D6470] mt-1">Study time</div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Subject Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#0F172A]">Your Subjects</h2>
          {insightFilter && (
            <Button 
              variant="ghost"
              size="sm"
              onClick={() => setInsightFilter(null)}
              className="text-[#5D6470] hover:text-[#0F172A]"
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
                className="group relative rounded-2xl border-border/40 hover:shadow-[0_12px_32px_rgba(31,107,255,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden bg-white"
                onClick={() => {
                  setSelectedDrawerSubject(subject);
                  setSubjectDrawerOpen(true);
                }}
              >
                <CardContent className="p-6 relative">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{subject.icon}</div>
                      <Badge className={`text-xs px-2 py-0.5 rounded-md ${getStatusColor(subject.status)}`}>
                        {subject.status}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Subject Name */}
                  <h3 className="text-lg font-semibold text-[#0F172A] mb-3 line-clamp-2">
                    {subject.name}
                  </h3>
                  
                  {/* Dual Progress Bars */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#5D6470]">Predicted</span>
                        <span className="text-sm font-semibold text-[#0F172A]">{subject.predicted}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(subject.predicted / 10) * 100}%` }}
                          transition={{ duration: 1, delay: 0.2 * index }}
                          className="h-full bg-[#1F6BFF] rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-[#5D6470]">Target</span>
                        <span className="text-sm font-semibold text-[#0F172A]">{subject.target}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#16A34A] rounded-full"
                          style={{ width: `${(subject.target / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Sparkline */}
                  <div className="mb-4">
                    <div className="text-xs text-[#5D6470] mb-1">Last 6 attempts</div>
                    <Sparkline data={subject.trend} className="text-[#1F6BFF]" />
                  </div>
                  
                  {/* Strong / Focus */}
                  <p className="text-xs text-[#5D6470] mb-4">
                    <span className="font-medium text-[#16A34A]">Strong:</span> {subject.strong} • 
                    <span className="font-medium text-[#EF4444]"> Focus:</span> {subject.focus}
                  </p>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      variant="ghost"
                      className="flex-1 rounded-lg text-[#1F6BFF] hover:bg-[#1F6BFF]/5 justify-between"
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
                      className="rounded-lg bg-[#1F6BFF] hover:bg-[#1456DA] text-white px-3"
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
              className="rounded-2xl border-2 border-dashed border-[#1F6BFF]/30 hover:border-[#1F6BFF]/60 hover:bg-white transition-all duration-300 cursor-pointer h-full"
              onClick={() => setShowAddSubjects(true)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[400px]">
                <div className="p-4 rounded-full bg-[#1F6BFF]/5 mb-4">
                  <Plus className="h-8 w-8 text-[#1F6BFF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#0F172A] mb-1">Add subject</h3>
                <p className="text-sm text-[#5D6470] text-center">
                  Start tracking a new subject
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Insights Stripe */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#0F172A]">Insights for You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="rounded-xl border-border/40 bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setInsightFilter("strong")}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#16A34A]/20">
                  <TrendingUp className="h-5 w-5 text-[#16A34A]" />
                </div>
                <span className="text-sm font-medium text-[#5D6470]">Strongest</span>
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mb-1">Chemistry</div>
              <p className="text-sm text-[#5D6470]">0.8 from target</p>
            </CardContent>
          </Card>
          
          <Card 
            className="rounded-xl border-border/40 bg-white cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setInsightFilter("weak")}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#EF4444]/20">
                  <TrendingDown className="h-5 w-5 text-[#EF4444]" />
                </div>
                <span className="text-sm font-medium text-[#5D6470]">Focus Area</span>
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mb-1">Physics</div>
              <p className="text-sm text-[#5D6470]">Try 20 mins today</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-border/40 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#1F6BFF]/20">
                  <TrendingUp className="h-5 w-5 text-[#1F6BFF]" />
                </div>
                <span className="text-sm font-medium text-[#5D6470]">Weekly Gain</span>
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mb-1">+0.4</div>
              <p className="text-sm text-[#5D6470]">Biology improving</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-xl border-border/40 bg-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#F59E0B]/20">
                  <Target className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <span className="text-sm font-medium text-[#5D6470]">At Risk</span>
              </div>
              <div className="text-2xl font-semibold text-[#0F172A] mb-1">2 topics</div>
              <p className="text-sm text-[#5D6470]">Need attention</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Plan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#0F172A]">This week to hit your targets</h2>
            <p className="text-sm text-[#5D6470] mt-1">{completedTasks} of {totalTasks} tasks completed</p>
          </div>
          <Button variant="outline" className="rounded-xl border-[#1F6BFF] text-[#1F6BFF] hover:bg-[#1F6BFF]/5">
            Generate plan
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-[#16A34A] rounded-full"
          />
        </div>
        
        {/* Day Cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {Object.entries(weekPlan).map(([day, tasks], dayIndex) => (
            <Card key={day} className="min-w-[280px] rounded-2xl border-border/40 hover:shadow-md transition-shadow flex-shrink-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0F172A]">{day}</h3>
                  <span className="text-xs text-[#5D6470]">Jan {22 + dayIndex}</span>
                </div>
                
                <div className="space-y-3">
                  {tasks.map((task, taskIndex) => {
                    const taskKey = `${day}-${taskIndex}`;
                    const isCompleted = weekTasksCompleted.has(taskKey);
                    
                    return (
                      <div 
                        key={taskIndex}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => toggleTask(day, taskIndex)}
                      >
                        <input 
                          type="checkbox" 
                          checked={isCompleted}
                          onChange={() => {}}
                          className="mt-1 rounded border-gray-300 text-[#1F6BFF] focus:ring-[#1F6BFF]" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${isCompleted ? 'text-[#5D6470] line-through' : 'text-[#0F172A]'} mb-1`}>
                            {task.s} • {task.t}
                          </div>
                          <div className="text-xs text-[#5D6470]">{task.m} mins</div>
                        </div>
                      </div>
                    );
                  })}
                  
                  <button className="w-full py-2 text-sm text-[#1F6BFF] hover:bg-[#1F6BFF]/5 rounded-xl transition-colors">
                    + Add task
                  </button>
                </div>
                
                {/* Day Progress */}
                <div className="mt-4 pt-4 border-t border-border/40">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1F6BFF] rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(tasks.filter((_, i) => weekTasksCompleted.has(`${day}-${i}`)).length / tasks.length) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Nudge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center py-8"
      >
        <p className="text-base text-[#5D6470] max-w-2xl mx-auto">
          Small, consistent study sessions beat cramming. You've got this.
        </p>
      </motion.div>
    </div>
  );
}
