import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, Target, CheckCircle2, Clock, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  activityType: 'practice' | 'flashcards' | 'review';
  duration: number;
  completed: boolean;
  icon: string;
}

interface TodaysPlanProps {
  userId?: string;
  subjects: any[];
  userProgress?: any[];
}

export function TodaysPlan({ userId, subjects, userProgress = [] }: TodaysPlanProps) {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate daily tasks based on weak topics and recent activity
  useEffect(() => {
    const generateTasks = async () => {
      if (!subjects || subjects.length === 0) {
        setLoading(false);
        return;
      }

      // Get weak topics from userProgress
      const weakTopics = userProgress
        .filter(p => p.averageScore < 60)
        .sort((a, b) => a.averageScore - b.averageScore)
        .slice(0, 3);

      // Generate tasks
      const generatedTasks: Task[] = [];
      
      subjects.slice(0, 4).forEach((subject, idx) => {
        const taskTypes: Array<'practice' | 'flashcards' | 'review'> = ['practice', 'flashcards', 'review'];
        const activityType = taskTypes[idx % 3];
        
        generatedTasks.push({
          id: `task-${subject.id}-${idx}`,
          subjectId: subject.id,
          subjectName: subject.name,
          topic: subject.focus || "General Review",
          activityType,
          duration: activityType === 'practice' ? 20 : activityType === 'flashcards' ? 15 : 10,
          completed: false,
          icon: subject.icon || "📚"
        });
      });

      // Load completion status from localStorage
      const savedCompletions = localStorage.getItem(`todayPlan-${userId}-${new Date().toDateString()}`);
      if (savedCompletions) {
        const completedIds = JSON.parse(savedCompletions);
        generatedTasks.forEach(task => {
          if (completedIds.includes(task.id)) {
            task.completed = true;
          }
        });
      }

      setTasks(generatedTasks);
      setLoading(false);
    };

    generateTasks();
  }, [subjects, userProgress, userId]);

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    // Save to localStorage
    const completedIds = updatedTasks.filter(t => t.completed).map(t => t.id);
    localStorage.setItem(`todayPlan-${userId}-${new Date().toDateString()}`, JSON.stringify(completedIds));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'practice': return <Target className="h-4 w-4" />;
      case 'flashcards': return <Brain className="h-4 w-4" />;
      case 'review': return <BookOpen className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'practice': return 'Practice Questions';
      case 'flashcards': return 'Flashcard Review';
      case 'review': return 'Topic Review';
      default: return 'Study';
    }
  };

  if (loading) {
    return (
      <Card className="w-full rounded-3xl border-border bg-card shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-3/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="w-full rounded-3xl border-border bg-card shadow-sm p-6">
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="font-semibold text-lg mb-2">No subjects yet</h3>
          <p className="text-sm text-muted-foreground">Add subjects to get your daily plan</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-3xl border-border bg-card shadow-sm">
      <div className="p-6 space-y-5">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              📋 Today's Plan
            </h2>
            <span className="text-xs font-medium text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          
          {/* Progress indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {completedCount} of {totalCount} tasks done
              </span>
              <span className="font-semibold text-primary">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA] rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  group relative rounded-xl border transition-all duration-200
                  ${task.completed 
                    ? 'bg-muted/50 border-border opacity-60' 
                    : 'bg-background border-border hover:border-primary/30 hover:shadow-sm'
                  }
                `}
              >
                <div className="p-4 flex items-start gap-3">
                  {/* Checkbox */}
                  <Checkbox 
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-semibold text-sm leading-tight ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.icon} {task.subjectName}
                      </h3>
                      {task.completed && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={`text-xs mb-2 ${task.completed ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                      {task.topic}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getActivityIcon(task.activityType)}
                        <span>{getActivityLabel(task.activityType)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{task.duration} min</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick action button */}
                  {!task.completed && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 px-2"
                      onClick={() => navigate(`/subject-topics?subject=${task.subjectId}`)}
                    >
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completion message */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <div className="text-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="font-semibold text-sm text-foreground">All tasks completed! 🎉</p>
              <p className="text-xs text-muted-foreground mt-1">Great job staying on track today</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
