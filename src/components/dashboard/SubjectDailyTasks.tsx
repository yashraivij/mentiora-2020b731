import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { MPPointsSystemClient } from '@/lib/mpPointsSystemClient';

interface SubjectDailyTasksProps {
  subjectId: string;
  userId: string;
}

interface Task {
  id: string;
  label: string;
  mpReward: number;
  completed: boolean;
}

export function SubjectDailyTasks({ subjectId, userId }: SubjectDailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 'practice', label: 'Complete 1 practice', mpReward: 20, completed: false },
    { id: 'flashcards', label: 'Review flashcards', mpReward: 15, completed: false },
    { id: 'notes', label: 'Add notes', mpReward: 10, completed: false },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaskCompletions();
  }, [subjectId, userId]);

  const loadTaskCompletions = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('subject_daily_tasks')
        .select('task_id, completed')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .eq('date', today);

      if (error) throw error;

      if (data && data.length > 0) {
        setTasks(prevTasks =>
          prevTasks.map(task => ({
            ...task,
            completed: data.some(d => d.task_id === task.id && d.completed)
          }))
        );
      }
    } catch (error) {
      console.error('Error loading task completions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId: string, checked: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const today = new Date().toISOString().split('T')[0];

      if (checked) {
        // Mark as complete and award MP
        const { error } = await supabase
          .from('subject_daily_tasks')
          .upsert({
            user_id: userId,
            subject_id: subjectId,
            task_id: taskId,
            date: today,
            completed: true,
            mp_awarded: task.mpReward
          }, {
            onConflict: 'user_id,subject_id,task_id,date'
          });

        if (error) throw error;

        // Award MP
        await supabase.functions.invoke('award-mp', {
          body: {
            action: 'subject_task_completed',
            userId,
            mpAmount: task.mpReward,
            taskId: taskId,
            subjectId: subjectId
          }
        });

        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(t => (t.id === taskId ? { ...t, completed: true } : t))
        );

        // Show toast with MP reward
        toast(
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="font-semibold">+{task.mpReward} MP</span>
            <span className="text-muted-foreground">• Task completed!</span>
          </div>
        );
      } else {
        // Uncheck - remove completion
        const { error } = await supabase
          .from('subject_daily_tasks')
          .delete()
          .eq('user_id', userId)
          .eq('subject_id', subjectId)
          .eq('task_id', taskId)
          .eq('date', today);

        if (error) throw error;

        setTasks(prevTasks =>
          prevTasks.map(t => (t.id === taskId ? { ...t, completed: false } : t))
        );
      }
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const allCompleted = completedCount === totalTasks;

  if (loading) {
    return (
      <div className="p-4 rounded-2xl bg-card border border-border">
        <div className="h-20 flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-card border border-border relative overflow-hidden">
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.05, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
            Daily Tasks
          </div>
          <div className="text-xs font-semibold text-foreground">
            {completedCount}/{totalTasks}
          </div>
        </div>

        <div className="space-y-2.5">
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2.5"
            >
              <Checkbox
                id={`task-${subjectId}-${task.id}`}
                checked={task.completed}
                onCheckedChange={(checked) =>
                  handleTaskToggle(task.id, checked as boolean)
                }
                className="rounded-md border-2"
              />
              <label
                htmlFor={`task-${subjectId}-${task.id}`}
                className={`flex-1 text-sm cursor-pointer select-none transition-all ${
                  task.completed
                    ? 'text-muted-foreground line-through'
                    : 'text-foreground font-medium'
                }`}
              >
                {task.label}
              </label>
              <span className="text-xs font-semibold text-primary whitespace-nowrap">
                +{task.mpReward} MP
              </span>
            </motion.div>
          ))}
        </div>

        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 pt-3 border-t border-border/50 text-center"
          >
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              All tasks completed!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
