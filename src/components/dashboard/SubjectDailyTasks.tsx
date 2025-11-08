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

// Get current UK date and use it to vary tasks daily
const getUKDate = (): Date => {
  const now = new Date();
  const ukTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/London' }));
  return ukTime;
};

// Get day variation index (0-4) to cycle through different task variations
const getDayVariation = (): number => {
  const ukDate = getUKDate();
  const dayOfYear = Math.floor((ukDate.getTime() - new Date(ukDate.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % 5; // Cycle through 5 variations
};

// Subject-specific tasks with daily variations
const getSubjectTasks = (subjectId: string): Task[] => {
  const variation = getDayVariation();
  
  // Percentage variations: 60%, 65%, 70%, 75%, 80%
  const percentages = [60, 65, 70, 75, 80];
  const percentage = percentages[variation];
  
  // Question count variations for different subjects
  const getQuestionCount = (base: number): number => {
    const variations = [-5, -3, 0, 2, 5];
    return Math.max(5, base + variations[variation]); // Minimum 5 questions
  };
  
  const taskMappings: Record<string, Task[]> = {
    'geography': [
      { id: 'score_topic', label: `Get ${percentage}%+ on natural hazards`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted paper 1', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(20)} questions`, mpReward: 20, completed: false },
    ],
    'geography-paper-2': [
      { id: 'score_topic', label: `Get ${percentage}%+ on urban issues`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted paper 2', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(20)} questions`, mpReward: 20, completed: false },
    ],
    'physics': [
      { id: 'score_topic', label: `Get ${percentage}%+ on forces & motion`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'physics-aqa': [
      { id: 'score_topic', label: `Get ${percentage}%+ on forces & motion`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'physics-edexcel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on forces & motion`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted physics exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'chemistry': [
      { id: 'score_topic', label: `Get ${percentage}%+ on chemical reactions`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'chemistry-edexcel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on chemical reactions`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted chemistry exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'biology': [
      { id: 'score_topic', label: `Get ${percentage}%+ on cell biology`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'biology-edexcel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on cell biology`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'biology-aqa-alevel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on Biological Molecules`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level biology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(12)} questions`, mpReward: 20, completed: false },
    ],
    'mathematics': [
      { id: 'score_topic', label: `Get ${percentage}%+ on algebra`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(25)} questions`, mpReward: 20, completed: false },
    ],
    'maths-edexcel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on algebra`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted maths exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(25)} questions`, mpReward: 20, completed: false },
    ],
    'maths-aqa-alevel': [
      { id: 'score_topic', label: `Get ${percentage}%+ on calculus`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete A-Level maths paper', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(18)} questions`, mpReward: 20, completed: false },
    ],
    'english-language': [
      { id: 'score_topic', label: `Get ${percentage}%+ on creative writing`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted English exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(10)} questions`, mpReward: 20, completed: false },
    ],
    'english-literature': [
      { id: 'score_topic', label: `Get ${percentage}%+ on any topic`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted literature exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(8)} questions`, mpReward: 20, completed: false },
    ],
    'history': [
      { id: 'score_topic', label: `Get ${percentage}%+ on any topic`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted history exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(12)} questions`, mpReward: 20, completed: false },
    ],
    'religious-studies': [
      { id: 'score_topic', label: `Get ${percentage}%+ on any topic`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted RS exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(10)} questions`, mpReward: 20, completed: false },
    ],
    'business-edexcel-igcse': [
      { id: 'score_topic', label: `Get ${percentage}%+ on business functions`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted business exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'computer-science': [
      { id: 'score_topic', label: `Get ${percentage}%+ on algorithms`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted CS exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(20)} questions`, mpReward: 20, completed: false },
    ],
    'psychology': [
      { id: 'score_topic', label: `Get ${percentage}%+ on research methods`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted psychology exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
    ],
    'music-eduqas-gcse': [
      { id: 'score_topic', label: `Get ${percentage}%+ on a music topic`, mpReward: 25, completed: false },
      { id: 'predicted_exam', label: 'Complete predicted music exam', mpReward: 30, completed: false },
      { id: 'complete_questions', label: `Answer ${getQuestionCount(12)} questions`, mpReward: 20, completed: false },
    ],
  };

  // Return subject-specific tasks or default tasks
  return taskMappings[subjectId] || [
    { id: 'score_topic', label: `Get ${percentage}%+ on any topic`, mpReward: 25, completed: false },
    { id: 'predicted_exam', label: 'Complete a predicted exam', mpReward: 30, completed: false },
    { id: 'complete_questions', label: `Answer ${getQuestionCount(15)} questions`, mpReward: 20, completed: false },
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
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🔍 LOADING TASK COMPLETIONS');
      console.log(`📂 Subject ID: "${subjectId}"`);
      console.log(`👤 User ID: "${userId}"`);
      console.log(`📅 Date: "${today}"`);
      console.log('🔎 Query: SELECT * FROM subject_daily_tasks WHERE user_id =', userId, 'AND subject_id =', `"${subjectId}"`, 'AND date =', today);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Load task completions - EXACT subject ID match only
      const { data: completedTasks, error } = await supabase
        .from('subject_daily_tasks')
        .select('task_id, completed, mp_awarded')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .eq('date', today);

      if (error) {
        console.error('✗ ERROR loading tasks:', error);
        throw error;
      }

      console.log('✓ Loaded tasks from database:', completedTasks);
      if (completedTasks && completedTasks.length > 0) {
        console.log(`📊 Found ${completedTasks.length} completed task(s):`, completedTasks.map(t => t.task_id).join(', '));
      } else {
        console.log('⚠️ No completed tasks found in database');
      }

      // Check if "complete_questions" task needs auto-completion
      const questionsTask = tasks.find(t => t.id === 'complete_questions');
      const questionsTaskCompleted = completedTasks?.some(ct => ct.task_id === 'complete_questions' && ct.completed);
      
      if (questionsTask && !questionsTaskCompleted) {
        // Count questions answered today for this subject
        const { data: todayActivities } = await supabase
          .from('user_activities')
          .select('id')
          .eq('user_id', userId)
          .eq('activity_type', 'exam_question_answered')
          .gte('created_at', `${today}T00:00:00`)
          .lte('created_at', `${today}T23:59:59`);
        
        const questionsAnswered = todayActivities?.length || 0;
        
        // Extract required questions from task label (e.g., "Answer 10 questions" -> 10)
        const requiredQuestions = parseInt(questionsTask.label.match(/\d+/)?.[0] || '10');
        
        console.log(`📝 Questions answered today: ${questionsAnswered}/${requiredQuestions}`);
        
        if (questionsAnswered >= requiredQuestions) {
          console.log('✓ Auto-completing "complete_questions" task');
          await autoCompleteTask('complete_questions', questionsTask.mpReward);
          // Refresh completions after auto-complete
          const { data: refreshedTasks } = await supabase
            .from('subject_daily_tasks')
            .select('task_id, completed, mp_awarded')
            .eq('user_id', userId)
            .eq('subject_id', subjectId)
            .eq('date', today);
          
          if (refreshedTasks) {
            setTasks(prevTasks =>
              prevTasks.map(task => {
                const isCompleted = refreshedTasks?.some(ct => ct.task_id === task.id && ct.completed) || false;
                return {
                  ...task,
                  completed: isCompleted
                };
              })
            );
          }
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          if (showLoading) setLoading(false);
          return;
        }
      }

      // Update tasks with completion state
      setTasks(prevTasks =>
        prevTasks.map(task => {
          const isCompleted = completedTasks?.some(ct => ct.task_id === task.id && ct.completed) || false;
          console.log(`Task ${task.id}: ${isCompleted ? '✓ COMPLETE' : '○ incomplete'}`);
          return {
            ...task,
            completed: isCompleted
          };
        })
      );
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('✗ ERROR in loadTaskCompletions:', error);
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
        // Trigger MP counter update in header
        window.dispatchEvent(new CustomEvent('mpEarned'));
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

    // Prevent manual checking of score_topic - it can only be auto-completed
    if (taskId === 'score_topic' && checked) {
      toast.error("This task is auto-completed when you achieve the required score during practice");
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('MANUAL TASK TOGGLE');
      console.log('Task ID:', taskId);
      console.log('Checked:', checked);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (checked) {
        // Check if task exists first
        const { data: existingTask } = await supabase
          .from('subject_daily_tasks')
          .select('id')
          .eq('user_id', userId)
          .eq('subject_id', subjectId)
          .eq('task_id', taskId)
          .eq('date', today)
          .maybeSingle();

        if (existingTask) {
          // Update existing
          const { error } = await supabase
            .from('subject_daily_tasks')
            .update({
              completed: true,
              mp_awarded: task.mpReward,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingTask.id);

          if (error) throw error;
        } else {
          // Insert new
          const { error } = await supabase
            .from('subject_daily_tasks')
            .insert({
              user_id: userId,
              subject_id: subjectId,
              task_id: taskId,
              date: today,
              completed: true,
              mp_awarded: task.mpReward
            });

          if (error) throw error;
        }

        console.log('✓ Task marked complete');

        // Award MP via edge function
        const { data: mpData, error: mpError } = await supabase.functions.invoke('award-mp', {
          body: {
            action: 'subject_task_completed',
            userId,
            mpAmount: task.mpReward,
            taskId: taskId,
            subjectId: subjectId
          }
        });

        if (mpError) {
          console.error('✗ ERROR awarding MP:', mpError);
        } else {
          console.log('✓ MP awarded successfully:', mpData);
          // Trigger MP counter update in header
          window.dispatchEvent(new CustomEvent('mpEarned'));
        }

        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(t => (t.id === taskId ? { ...t, completed: true } : t))
        );

        // Show toast
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

        console.log('✓ Task unchecked');

        setTasks(prevTasks =>
          prevTasks.map(t => (t.id === taskId ? { ...t, completed: false } : t))
        );
      }
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } catch (error) {
      console.error('✗ ERROR in handleTaskToggle:', error);
      toast.error("Failed to update task");
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
                disabled={task.id === 'score_topic' && !task.completed}
                className={`rounded-md border-2 ${task.id === 'score_topic' && !task.completed ? 'cursor-not-allowed opacity-50' : ''}`}
              />
              <label
                htmlFor={`task-${subjectId}-${task.id}`}
                className={`flex-1 text-sm ${task.id === 'score_topic' && !task.completed ? 'cursor-not-allowed' : 'cursor-pointer'} select-none transition-all ${
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
              All tasks completed!
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
