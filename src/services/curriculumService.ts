import { supabase } from "@/integrations/supabase/client";
import { Subject, Topic, Question } from "@/data/curriculum/types";

// In-memory cache to reduce database calls
const cache = {
  subjects: null as Subject[] | null,
  subjectsById: new Map<string, Subject>(),
  topicsById: new Map<string, Topic>(),
  lastFetch: 0,
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

export class CurriculumService {
  /**
   * Fetch all subjects from database with caching
   */
  static async getSubjects(): Promise<Subject[]> {
    // Check cache first
    if (
      cache.subjects &&
      Date.now() - cache.lastFetch < cache.CACHE_TTL
    ) {
      console.log("✅ Returning cached curriculum data", {
        subjectCount: cache.subjects.length,
        cacheAge: Date.now() - cache.lastFetch,
      });
      return cache.subjects;
    }

    console.log("🔄 Fetching curriculum from database...");

    try {
      // Fetch subjects
      const { data: subjects, error: subjectsError } = await supabase
        .from("curriculum_subjects")
        .select("*")
        .order("name");

      if (subjectsError) {
        console.error("❌ Error fetching subjects:", subjectsError);
        throw subjectsError;
      }

      console.log(`✅ Fetched ${subjects?.length || 0} subjects`);

      // Fetch all topics
      const { data: topics, error: topicsError } = await supabase
        .from("curriculum_topics")
        .select("*")
        .order("order_index");

      if (topicsError) {
        console.error("❌ Error fetching topics:", topicsError);
        throw topicsError;
      }

      console.log(`✅ Fetched ${topics?.length || 0} topics`);

      // Fetch all questions
      const { data: questions, error: questionsError } = await supabase
        .from("curriculum_questions")
        .select("*")
        .order("order_index");

      if (questionsError) {
        console.error("❌ Error fetching questions:", questionsError);
        throw questionsError;
      }

      console.log(`✅ Fetched ${questions?.length || 0} questions`);

      // Group questions by topic
      const questionsByTopic = new Map<string, Question[]>();
      questions?.forEach((q) => {
        const topicQuestions = questionsByTopic.get(q.topic_id) || [];
        topicQuestions.push({
          id: q.id,
          question: q.question,
          marks: q.marks,
          difficulty: q.difficulty as "easy" | "medium" | "hard",
          modelAnswer: q.model_answer,
          markingCriteria: q.marking_criteria as { breakdown: string[] },
          specReference: q.spec_reference,
          calculatorGuidance: q.calculator_guidance as
            | "calc-recommended"
            | "non-calc-friendly"
            | undefined,
        });
        questionsByTopic.set(q.topic_id, topicQuestions);
      });

      // Group topics by subject
      const topicsBySubject = new Map<string, Topic[]>();
      topics?.forEach((t) => {
        const subjectTopics = topicsBySubject.get(t.subject_id) || [];
        const topic: Topic = {
          id: t.id,
          name: t.name,
          questions: questionsByTopic.get(t.id) || [],
        };
        subjectTopics.push(topic);
        topicsBySubject.set(t.subject_id, subjectTopics);
        cache.topicsById.set(t.id, topic);
      });

      // Build complete subject objects
      const result: Subject[] =
        subjects?.map((s) => {
          const subject: Subject = {
            id: s.id,
            name: s.name,
            topics: topicsBySubject.get(s.id) || [],
          };
          cache.subjectsById.set(s.id, subject);
          return subject;
        }) || [];

      // Update cache
      cache.subjects = result;
      cache.lastFetch = Date.now();

      console.log("✅ Successfully loaded curriculum:", {
        subjects: result.length,
        topics: topics?.length || 0,
        questions: questions?.length || 0,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      console.error("❌ FATAL: Failed to fetch curriculum from database:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw error; // Fail loudly so we can see the real error
    }
  }

  /**
   * Get a specific subject by ID
   */
  static async getSubject(id: string): Promise<Subject | null> {
    // Check cache first
    if (cache.subjectsById.has(id)) {
      return cache.subjectsById.get(id) || null;
    }

    // If not in cache, fetch all subjects (which will populate cache)
    const subjects = await this.getSubjects();
    return subjects.find((s) => s.id === id) || null;
  }

  /**
   * Get a specific topic by subject and topic ID
   */
  static async getTopic(
    subjectId: string,
    topicId: string
  ): Promise<Topic | null> {
    // Check cache first
    if (cache.topicsById.has(topicId)) {
      return cache.topicsById.get(topicId) || null;
    }

    // If not in cache, fetch the subject (which will populate cache)
    const subject = await this.getSubject(subjectId);
    return subject?.topics.find((t) => t.id === topicId) || null;
  }

  /**
   * Get questions for a specific topic
   */
  static async getQuestions(topicId: string): Promise<Question[]> {
    // Check if topic is in cache
    const cachedTopic = cache.topicsById.get(topicId);
    if (cachedTopic) {
      return cachedTopic.questions;
    }

    try {
      // Fetch questions directly from database
      const { data: questions, error } = await supabase
        .from("curriculum_questions")
        .select("*")
        .eq("topic_id", topicId)
        .order("order_index");

      if (error) throw error;

      return (
        questions?.map((q) => ({
          id: q.id,
          question: q.question,
          marks: q.marks,
          difficulty: q.difficulty as "easy" | "medium" | "hard",
          modelAnswer: q.model_answer,
          markingCriteria: q.marking_criteria as { breakdown: string[] },
          specReference: q.spec_reference,
          calculatorGuidance: q.calculator_guidance as
            | "calc-recommended"
            | "non-calc-friendly"
            | undefined,
        })) || []
      );
    } catch (error) {
      console.error(`Failed to fetch questions for topic ${topicId}:`, error);
      return [];
    }
  }

  /**
   * Clear the cache (useful for testing or forced refresh)
   */
  static clearCache(): void {
    cache.subjects = null;
    cache.subjectsById.clear();
    cache.topicsById.clear();
    cache.lastFetch = 0;
  }

  /**
   * Prefetch a subject (useful for optimization)
   */
  static async prefetchSubject(id: string): Promise<void> {
    await this.getSubject(id);
  }
}
