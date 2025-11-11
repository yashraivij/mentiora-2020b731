import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, Circle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface Quest {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward: number;
}

interface DailyQuestsProps {
  userId: string;
}

export function DailyQuests({ userId }: DailyQuestsProps) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuests();
    const interval = setInterval(loadQuests, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [userId]);

  const loadQuests = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get today's activities
      const { data: activities } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', today.toISOString());

      // Get today's quizzes
      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('created_at', today.toISOString());

      // Get today's study time
      const { data: studySessions } = await supabase
        .from('study_sessions')
        .select('duration_minutes')
        .eq('user_id', userId)
        .gte('started_at', today.toISOString());

      // Get today's practice completions
      const practiceCount = activities?.filter(a => a.activity_type === 'practice_completed').length || 0;

      // Calculate study minutes
      const studyMinutes = studySessions?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0;

      // Check if logged in today
      const loginToday = activities?.some(a => a.activity_type === 'daily_login') || false;

      // Get current streak
      const { data: streakData } = await supabase.rpc('get_user_streak', { user_uuid: userId });
      const currentStreak = streakData || 0;

      const dailyQuests: Quest[] = [
        {
          id: 'daily_login',
          title: 'Daily Check-in',
          description: 'Log in to Mentiora',
          progress: loginToday ? 1 : 0,
          total: 1,
          completed: loginToday,
          reward: 10,
        },
        {
          id: 'complete_quizzes',
          title: 'Complete 3 Quizzes',
          description: 'Finish practice quizzes',
          progress: Math.min(quizzes?.length || 0, 3),
          total: 3,
          completed: (quizzes?.length || 0) >= 3,
          reward: 40,
        },
        {
          id: 'practice_topics',
          title: 'Practice 5 Topics',
          description: 'Work on different topics',
          progress: Math.min(practiceCount, 5),
          total: 5,
          completed: practiceCount >= 5,
          reward: 100,
        },
        {
          id: 'study_time',
          title: 'Study for 30 Minutes',
          description: 'Focused study session',
          progress: Math.min(studyMinutes, 30),
          total: 30,
          completed: studyMinutes >= 30,
          reward: 50,
        },
        {
          id: 'maintain_streak',
          title: 'Maintain Your Streak',
          description: 'Keep your study streak alive',
          progress: currentStreak > 0 ? 1 : 0,
          total: 1,
          completed: currentStreak > 0,
          reward: 20,
        },
      ];

      setQuests(dailyQuests);
    } catch (error) {
      console.error('Error loading quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completedCount = quests.filter(q => q.completed).length;
  const totalRewards = quests.filter(q => q.completed).reduce((sum, q) => sum + q.reward, 0);

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-white via-white to-[#3B82F6]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#3B82F6]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-[#3B82F6]/10 dark:border-[#3B82F6]/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="h-4 w-48 bg-muted rounded" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#3B82F6]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#3B82F6]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(59,130,246,0.12)] border border-[#3B82F6]/10 dark:border-[#3B82F6]/20"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
              Daily Quests
            </h2>
            <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border-0 text-sm font-semibold">
              {completedCount}/{quests.length} Complete
            </Badge>
          </div>
          <p className="text-[#64748B] dark:text-gray-400 text-sm font-medium">
            Complete quests to earn {totalRewards > 0 && `${totalRewards} `}MP and boost your progress
          </p>
        </div>

        {/* Quests List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {quests.map((quest, index) => {
              const progressPercent = (quest.progress / quest.total) * 100;
              
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative p-5 rounded-2xl border transition-all duration-300",
                    quest.completed
                      ? "bg-gradient-to-r from-[#16A34A]/10 via-[#16A34A]/5 to-transparent border-[#16A34A]/20 dark:border-[#16A34A]/30"
                      : "bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-[#3B82F6]/20 dark:border-[#3B82F6]/30 hover:shadow-md hover:shadow-[#3B82F6]/10"
                  )}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      quest.completed
                        ? "bg-[#16A34A] text-white shadow-md shadow-[#16A34A]/30"
                        : "bg-[#3B82F6]/10 text-[#3B82F6]"
                    )}>
                      {quest.completed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>

                    {/* Quest Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <h3 className={cn(
                            "font-semibold text-base",
                            quest.completed
                              ? "text-[#16A34A] dark:text-[#22C55E]"
                              : "text-[#0F172A] dark:text-white"
                          )}>
                            {quest.title}
                          </h3>
                          <p className="text-xs text-[#64748B] dark:text-gray-400 mt-0.5 font-medium">
                            {quest.description}
                          </p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="flex-shrink-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-0 text-xs font-bold"
                        >
                          +{quest.reward} MP
                        </Badge>
                      </div>

                      {/* Progress Bar */}
                      {!quest.completed && (
                        <div className="space-y-1.5">
                          <Progress 
                            value={progressPercent} 
                            className="h-2 bg-[#F1F5F9] dark:bg-gray-700"
                          />
                          <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium">
                            {quest.progress} / {quest.total} {quest.id === 'study_time' ? 'minutes' : ''}
                          </p>
                        </div>
                      )}

                      {quest.completed && (
                        <p className="text-xs text-[#16A34A] dark:text-[#22C55E] font-semibold">
                          ✓ Quest completed! +{quest.reward} MP earned
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary Footer */}
        {completedCount === quests.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-500/20"
          >
            <p className="text-center text-sm font-bold text-amber-600 dark:text-amber-400">
              🎉 All daily quests completed! Come back tomorrow for new quests.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
