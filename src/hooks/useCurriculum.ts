import { useState, useEffect } from 'react';
import { CurriculumService } from '@/services/curriculumService';
import { Subject, Topic, Question } from '@/data/curriculum/types';

export const useCurriculum = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setIsLoading(true);
        const data = await CurriculumService.getSubjects();
        setSubjects(data);
        setError(null);
      } catch (err) {
        console.error('Error loading curriculum:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const getSubject = (id: string) => {
    return subjects.find(s => s.id === id) || null;
  };

  const getTopic = (subjectId: string, topicId: string) => {
    const subject = getSubject(subjectId);
    return subject?.topics.find(t => t.id === topicId) || null;
  };

  return {
    subjects,
    isLoading,
    error,
    getSubject,
    getTopic,
  };
};
