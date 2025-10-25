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
      { id: 'natural_hazards', label: 'Get above 70% on natural hazards', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Do the predicted paper 1 exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Complete 20 questions', mpReward: 20, completed: false },
    ],
    'geography-paper-2': [
      { id: 'urban_issues', label: 'Get above 70% on urban issues', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Do the predicted paper 2 exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: 'Complete 20 questions', mpReward: 20, completed: false },
    ],
    'physics': [
      { id: 'forces_motion', label: 'Master forces and motion', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'practice_calculations', label: 'Solve 15 calculation questions', mpReward: 20, completed: false },
    ],
    'physics-edexcel': [
      { id: 'forces_motion', label: 'Master forces and motion', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'practice_calculations', label: 'Solve 15 calculation questions', mpReward: 20, completed: false },
    ],
    'chemistry': [
      { id: 'chemical_reactions', label: 'Get 75%+ on chemical reactions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'practice_equations', label: 'Balance 12 chemical equations', mpReward: 20, completed: false },
    ],
    'chemistry-edexcel': [
      { id: 'chemical_reactions', label: 'Get 75%+ on chemical reactions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'practice_equations', label: 'Balance 12 chemical equations', mpReward: 20, completed: false },
    ],
    'biology': [
      { id: 'cell_biology', label: 'Score 70%+ on cell biology', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'practice_diagrams', label: 'Label 10 biological diagrams', mpReward: 20, completed: false },
    ],
    'biology-edexcel': [
      { id: 'cell_biology', label: 'Score 70%+ on cell biology', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'practice_diagrams', label: 'Label 10 biological diagrams', mpReward: 20, completed: false },
    ],
    'biology-aqa-alevel': [
      { id: 'biochemistry', label: 'Master biochemistry topics', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level biology exam', mpReward: 30, completed: false },
      { id: 'essay_practice', label: 'Write 2 essay-style answers', mpReward: 20, completed: false },
    ],
    'mathematics': [
      { id: 'algebra_mastery', label: 'Get 80%+ on algebra questions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'problem_solving', label: 'Solve 25 practice problems', mpReward: 20, completed: false },
    ],
    'maths-edexcel': [
      { id: 'algebra_mastery', label: 'Get 80%+ on algebra questions', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'problem_solving', label: 'Solve 25 practice problems', mpReward: 20, completed: false },
    ],
    'maths-aqa-alevel': [
      { id: 'calculus_practice', label: 'Master calculus techniques', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level maths paper', mpReward: 30, completed: false },
      { id: 'proof_questions', label: 'Complete 5 proof questions', mpReward: 20, completed: false },
    ],
    'english-language': [
      { id: 'creative_writing', label: 'Write a creative piece', mpReward: 25, completed: false },
      { id: 'comprehension', label: 'Complete comprehension task', mpReward: 30, completed: false },
      { id: 'language_analysis', label: 'Analyse 3 text extracts', mpReward: 20, completed: false },
    ],
    'english-literature': [
      { id: 'text_analysis', label: 'Analyse a key chapter/scene', mpReward: 25, completed: false },
      { id: 'essay_practice', label: 'Write a practice essay', mpReward: 30, completed: false },
      { id: 'quote_learning', label: 'Learn 10 key quotations', mpReward: 20, completed: false },
    ],
    'history': [
      { id: 'source_analysis', label: 'Analyse 3 historical sources', mpReward: 25, completed: false },
      { id: 'essay_planning', label: 'Plan an essay response', mpReward: 30, completed: false },
      { id: 'timeline_review', label: 'Review key dates and events', mpReward: 20, completed: false },
    ],
    'religious-studies': [
      { id: 'ethical_debate', label: 'Explore an ethical debate', mpReward: 25, completed: false },
      { id: 'essay_practice', label: 'Write a practice essay', mpReward: 30, completed: false },
      { id: 'beliefs_review', label: 'Review key beliefs and practices', mpReward: 20, completed: false },
    ],
    'business-edexcel-igcse': [
      { id: 'case_study', label: 'Analyse a business case study', mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted business exam', mpReward: 30, completed: false },
      { id: 'key_terms', label: 'Review 15 business terms', mpReward: 20, completed: false },
    ],
    'computer-science': [
      { id: 'algorithms', label: 'Master sorting algorithms', mpReward: 25, completed: false },
      { id: 'coding_practice', label: 'Write 3 programs', mpReward: 30, completed: false },
      { id: 'theory_questions', label: 'Complete 20 theory questions', mpReward: 20, completed: false },
    ],
    'psychology': [
      { id: 'research_methods', label: 'Master research methods', mpReward: 25, completed: false },
      { id: 'essay_practice', label: 'Write a psychology essay', mpReward: 30, completed: false },
      { id: 'studies_review', label: 'Review 5 key studies', mpReward: 20, completed: false },
    ],
  };

  // Return subject-specific tasks or default tasks
  return taskMappings[subjectId] || [
    { id: 'practice', label: 'Complete 1 practice', mpReward: 20, completed: false },
    { id: 'predicted_exam', label: 'Do a predicted exam', mpReward: 30, completed: false },
    { id: 'questions', label: 'Complete 15 questions', mpReward: 15, completed: false },
  ];
};

export function SubjectDailyTasks({ subjectId, userId }: SubjectDailyTasksProps) {
  const [tasks, setTasks] = useState<Task[]>(getSubjectTasks(subjectId));
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
