import { useState, useEffect } from 'react';
import { CurriculumService } from '@/services/curriculumService';
import { Subject, Topic, Question } from '@/data/curriculum/types';

export const useCurriculum = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSubjects = async () => {
      console.log('📚 useCurriculum: Starting to load curriculum...');
      try {
        setIsLoading(true);
        const data = await CurriculumService.getSubjects();
        console.log('📚 useCurriculum: Successfully loaded curriculum', {
          subjectCount: data.length,
          subjects: data.map(s => ({ id: s.id, name: s.name, topicCount: s.topics.length }))
        });
        setSubjects(data);
        setError(null);
      } catch (err) {
        console.error('❌ useCurriculum: Error loading curriculum:', err);
        console.error('❌ Error details:', JSON.stringify(err, null, 2));
        setError(err as Error);
      } finally {
        setIsLoading(false);
        console.log('📚 useCurriculum: Loading complete');
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
