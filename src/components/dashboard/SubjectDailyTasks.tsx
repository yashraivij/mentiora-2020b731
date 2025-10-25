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

// Subject-specific tasks
const getSubjectTasks = (subjectId: string): Task[] => {
  const taskMappings: Record<string, Task[]> = {
    'geography': [
      { id: 'score_topic', label: 'Get 70%+ on natural hazards', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted paper 1', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 20 questions', mpReward: 20, completed: false },
    ],
    'geography-paper-2': [
      { id: 'score_topic', label: 'Get 70%+ on urban issues', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted paper 2', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 20 questions', mpReward: 20, completed: false },
    ],
    'physics': [
      { id: 'score_topic', label: 'Get 75%+ on forces & motion', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'physics-edexcel': [
      { id: 'score_topic', label: 'Get 75%+ on forces & motion', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'chemistry': [
      { id: 'score_topic', label: 'Get 75%+ on chemical reactions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'chemistry-edexcel': [
      { id: 'score_topic', label: 'Get 75%+ on chemical reactions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'biology': [
      { id: 'score_topic', label: 'Get 70%+ on cell biology', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'biology-edexcel': [
      { id: 'score_topic', label: 'Get 70%+ on cell biology', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'biology-aqa-alevel': [
      { id: 'score_topic', label: 'Get 75%+ on biochemistry', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 12 questions', mpReward: 20, completed: false },
    ],
    'mathematics': [
      { id: 'score_topic', label: 'Get 80%+ on algebra', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 25 questions', mpReward: 20, completed: false },
    ],
    'maths-edexcel': [
      { id: 'score_topic', label: 'Get 80%+ on algebra', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 25 questions', mpReward: 20, completed: false },
    ],
    'maths-aqa-alevel': [
      { id: 'score_topic', label: 'Get 75%+ on calculus', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level maths paper', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 18 questions', mpReward: 20, completed: false },
    ],
    'english-language': [
      { id: 'score_topic', label: 'Get 70%+ on creative writing', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted English exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 10 questions', mpReward: 20, completed: false },
    ],
    'english-literature': [
      { id: 'score_topic', label: 'Get 70%+ on text analysis', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted literature exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 8 questions', mpReward: 20, completed: false },
    ],
    'history': [
      { id: 'score_topic', label: 'Get 70%+ on a history topic', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted history exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 12 questions', mpReward: 20, completed: false },
    ],
    'religious-studies': [
      { id: 'score_topic', label: 'Get 70%+ on ethics', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted RS exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 10 questions', mpReward: 20, completed: false },
    ],
    'business-edexcel-igcse': [
      { id: 'score_topic', label: 'Get 70%+ on business functions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted business exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'computer-science': [
      { id: 'score_topic', label: 'Get 75%+ on algorithms', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted CS exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 20 questions', mpReward: 20, completed: false },
    ],
    'psychology': [
      { id: 'score_topic', label: 'Get 70%+ on research methods', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted psychology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
    ],
    'music-eduqas-gcse': [
      { id: 'score_topic', label: 'Get 70%+ on a music topic', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted music exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Answer 12 questions', mpReward: 20, completed: false },
    ],
  };

  // Return subject-specific tasks or default tasks
  return taskMappings[subjectId] || [
    { id: 'score_topic', label: 'Get 70%+ on any topic', mpReward: 25, completed: false },
    { id: 'predicted_exam', label: 'Complete a predicted exam', mpReward: 30, completed: false },
    { id: 'complete_questions', label: 'Answer 15 questions', mpReward: 20, completed: false },
  ];
};

export function SubjectDailyTasks({ subjectId, userId }: SubjectDailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(getSubjectTasks(subjectId));
  const [loading, setLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    loadTaskCompletions(isInitialLoad);
    setIsInitialLoad(false);

    // Refresh task completions every 5 seconds silently (no loading state)
    const interval = setInterval(() => {
      loadTaskCompletions(false);
    }, 5000);

    return () => clearInterval(interval);
  }, [subjectId, userId]);

  const loadTaskCompletions = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      console.log(`[SubjectDailyTasks] Loading for subject: ${subjectId}`);

      // Check for predicted exam completion today
      const todayStart = new Date(today + 'T00:00:00Z').toISOString();
      const todayEnd = new Date(today + 'T23:59:59Z').toISOString();
      
      const { data: examCompletions } = await supabase
        .from('predicted_exam_completions')
        .select('id, completed_at')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .gte('completed_at', todayStart)
        .lte('completed_at', todayEnd);

      const hasPredictedExamToday = examCompletions && examCompletions.length > 0;
      console.log(`[SubjectDailyTasks] Has exam today: ${hasPredictedExamToday}`, examCompletions);

      // If exam was completed, ensure it's marked in database
      if (hasPredictedExamToday) {
        console.log('[SubjectDailyTasks] Marking predicted_exam task as complete');
        await supabase
          .from('subject_daily_tasks')
          .upsert({
            user_id: userId,
            subject_id: subjectId,
            task_id: 'predicted_exam',
            date: today,
            completed: true,
            mp_awarded: 30
          }, {
            onConflict: 'user_id,subject_id,task_id,date'
          });
      }

      // Load all task completions from database
      const { data: manualTasks, error: manualError } = await supabase
        .from('subject_daily_tasks')
        .select('task_id, completed')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .eq('date', today);

      if (manualError) throw manualError;

      console.log('[SubjectDailyTasks] Task completions from DB:', manualTasks);

      // Update tasks with completion state
      setTasks(prevTasks =>
        prevTasks.map(task => ({
          ...task,
          completed: manualTasks?.some(d => d.task_id === task.id && d.completed) || false
        }))
      );
    } catch (error) {
      console.error('[SubjectDailyTasks] Error loading task completions:', error);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const autoCompleteTask = async (taskId: string, mpReward: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];

      console.log(`Marking task ${taskId} as complete in database for ${subjectId}`);

      // Mark as complete in database
      const { error: upsertError } = await supabase
        .from('subject_daily_tasks')
        .upsert({
          user_id: userId,
          subject_id: subjectId,
          task_id: taskId,
          date: today,
          completed: true,
          mp_awarded: mpReward
        }, {
          onConflict: 'user_id,subject_id,task_id,date'
        });

      if (upsertError) {
        console.error('Error upserting task:', upsertError);
        throw upsertError;
      }

      console.log(`Task ${taskId} marked as complete, now awarding ${mpReward} MP`);

      // Award MP via edge function
      const { data: mpData, error: mpError } = await supabase.functions.invoke('award-mp', {
        body: {
          action: 'subject_task_completed',
          userId,
          mpAmount: mpReward,
          taskId: taskId,
          subjectId: subjectId
        }
      });

      if (mpError) {
        console.error('Error awarding MP:', mpError);
      } else {
        console.log('MP awarded successfully:', mpData);
      }

      // Show toast notification
      toast(
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <span className="font-semibold">+{mpReward} MP</span>
          <span className="text-muted-foreground">• Daily task completed!</span>
        </div>
      );
    } catch (error) {
      console.error('Error auto-completing task:', error);
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
