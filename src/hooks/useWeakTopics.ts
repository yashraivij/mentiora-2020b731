
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useWeakTopics = () => {
  const { user } = useAuth();
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadWeakTopicsFromDatabase = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('topics')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading weak topics:', error);
        return;
      }

      if (data?.topics && Array.isArray(data.topics)) {
        setWeakTopics(data.topics as string[]);
      }
    } catch (error) {
      console.error('Error loading weak topics:', error);
    }
  };

  const saveWeakTopicsToDatabase = async (topics: string[]) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('weak_topics')
        .upsert(
          {
            user_id: user.id,
            topics: topics,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error('Error saving weak topics:', error);
      }
    } catch (error) {
      console.error('Error saving weak topics:', error);
    }
  };

  const updateWeakTopics = async (topics: string[]) => {
    setWeakTopics(topics);
    await saveWeakTopicsToDatabase(topics);
  };

  useEffect(() => {
    const initializeWeakTopics = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      await loadWeakTopicsFromDatabase();
      setIsLoading(false);
    };

    initializeWeakTopics();
  }, [user?.id]);

  return {
    weakTopics,
    updateWeakTopics,
    isLoading,
    refreshWeakTopics: loadWeakTopicsFromDatabase
  };
};
