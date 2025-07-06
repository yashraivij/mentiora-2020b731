
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load progress from database
  const loadProgressFromDatabase = async () => {
    if (!user?.id) return;

    try {
      const { data: subjectPerformance, error } = await supabase
        .from('subject_performance')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading progress from database:', error);
        return;
      }

      if (subjectPerformance && subjectPerformance.length > 0) {
        const progress: UserProgress[] = subjectPerformance.map(sp => ({
          subjectId: sp.subject_id,
          topicId: sp.subject_id, // Using subject_id as topicId for now
          attempts: sp.total_questions_answered || 0,
          averageScore: sp.accuracy_rate || 0,
          lastAttempt: new Date(sp.last_activity_date || sp.updated_at || Date.now())
        }));
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  // Migrate localStorage data to database
  const migrateLocalStorageData = async () => {
    if (!user?.id) return;

    const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
    if (savedProgress) {
      try {
        const progress: UserProgress[] = JSON.parse(savedProgress);
        
        // Convert to subject_performance format and insert into database
        for (const p of progress) {
          await supabase
            .from('subject_performance')
            .upsert({
              user_id: user.id,
              subject_id: p.subjectId,
              exam_board: 'General',
              total_questions_answered: p.attempts,
              accuracy_rate: p.averageScore,
              last_activity_date: new Date(p.lastAttempt).toISOString().split('T')[0]
            }, {
              onConflict: 'user_id,subject_id,exam_board'
            });
        }

        // Remove from localStorage after successful migration
        localStorage.removeItem(`mentiora_progress_${user.id}`);
        console.log('Successfully migrated progress data to database');
      } catch (error) {
        console.error('Error migrating localStorage data:', error);
      }
    }
  };

  const saveProgress = async (progress: UserProgress) => {
    if (!user?.id) return;

    try {
      await supabase
        .from('subject_performance')
        .upsert({
          user_id: user.id,
          subject_id: progress.subjectId,
          exam_board: 'General',
          total_questions_answered: progress.attempts,
          correct_answers: Math.round(progress.attempts * (progress.averageScore / 100)),
          accuracy_rate: progress.averageScore,
          last_activity_date: new Date().toISOString().split('T')[0]
        }, {
          onConflict: 'user_id,subject_id,exam_board'
        });

      // Update local state
      setUserProgress(prev => {
        const existingIndex = prev.findIndex(p => 
          p.subjectId === progress.subjectId && p.topicId === progress.topicId
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = progress;
          return updated;
        } else {
          return [...prev, progress];
        }
      });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  useEffect(() => {
    const initializeProgress = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      // First migrate any localStorage data
      await migrateLocalStorageData();
      
      // Then load from database
      await loadProgressFromDatabase();
      
      setIsLoading(false);
    };

    initializeProgress();
  }, [user?.id]);

  return {
    userProgress,
    saveProgress,
    isLoading,
    refreshProgress: loadProgressFromDatabase
  };
};
