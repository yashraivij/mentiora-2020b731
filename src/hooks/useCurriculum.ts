import { useQuery } from "@tanstack/react-query";
import { fetchCurriculumFromDatabase, clearCurriculumCache, type Subject } from "@/services/curriculumService";

/**
 * React hook to fetch and manage curriculum data from Supabase
 * 
 * Returns:
 * - curriculum: Subject[] - The full curriculum data with nested topics and questions
 * - isLoading: boolean - True while data is being fetched
 * - error: Error | null - Any error that occurred during fetch
 * - refetch: () => void - Function to force a fresh fetch (clears cache)
 * 
 * Usage:
 * const { curriculum, isLoading, error, refetch } = useCurriculum();
 */
export function useCurriculum() {
  const query = useQuery<Subject[], Error>({
    queryKey: ["curriculum"],
    queryFn: fetchCurriculumFromDatabase,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Custom refetch that clears service cache first
  const refetch = () => {
    clearCurriculumCache();
    query.refetch();
  };

  return {
    curriculum: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refetch,
  };
}

/**
 * Hook to get a specific subject by ID
 */
export function useSubject(subjectId: string) {
  const { curriculum, isLoading, error } = useCurriculum();
  
  return {
    subject: curriculum.find((s) => s.id === subjectId) || null,
    isLoading,
    error,
  };
}

/**
 * Hook to get a specific topic by subject ID and topic ID
 */
export function useTopic(subjectId: string, topicId: string) {
  const { subject, isLoading, error } = useSubject(subjectId);
  
  return {
    topic: subject?.topics.find((t) => t.id === topicId) || null,
    isLoading,
    error,
  };
}

/**
 * Hook to get questions for a specific topic
 */
export function useTopicQuestions(subjectId: string, topicId: string) {
  const { topic, isLoading, error } = useTopic(subjectId, topicId);
  
  return {
    questions: topic?.questions || [],
    isLoading,
    error,
  };
}
