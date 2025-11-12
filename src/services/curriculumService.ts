import { supabase } from "@/integrations/supabase/client";

// Types matching the existing curriculum structure
export interface Question {
  id: string;
  question: string;
  marks: number;
  difficulty: "easy" | "medium" | "hard";
  modelAnswer: string;
  markingCriteria: Record<string, any>;
  specReference?: string;
  calculatorGuidance?: string;
  orderIndex: number;
}

export interface Topic {
  id: string;
  name: string;
  questions: Question[];
  orderIndex: number;
}

export interface Subject {
  id: string;
  name: string;
  examBoard?: string;
  topics: Topic[];
}

// Cache management
let cachedCurriculum: Subject[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches curriculum data from Supabase and transforms it into nested structure
 * Returns: Subject[] with nested topics and questions
 */
export async function fetchCurriculumFromDatabase(): Promise<Subject[]> {
  // Return cached data if still valid
  if (cachedCurriculum && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log("📦 Returning cached curriculum data");
    return cachedCurriculum;
  }

  console.log("🔄 Fetching curriculum from Supabase...");
  const startTime = Date.now();

  try {
    // Fetch all subjects
    const { data: subjects, error: subjectsError } = await supabase
      .from("curriculum_subjects")
      .select("*")
      .order("name")
      .limit(10000);

    if (subjectsError) throw subjectsError;
    if (!subjects || subjects.length === 0) {
      console.warn("⚠️ No subjects found in database");
      return [];
    }

    console.log(`✅ Fetched ${subjects.length} subjects`);

    // Fetch all topics
    const { data: topics, error: topicsError } = await supabase
      .from("curriculum_topics")
      .select("*")
      .order("subject_id, order_index")
      .limit(10000);

    if (topicsError) throw topicsError;
    console.log(`✅ Fetched ${topics?.length || 0} topics`);

    // Fetch all questions
    const { data: questions, error: questionsError } = await supabase
      .from("curriculum_questions")
      .select("*")
      .order("topic_id, order_index")
      .limit(10000);

    if (questionsError) throw questionsError;
    console.log(`✅ Fetched ${questions?.length || 0} questions`);

    // Transform into nested structure
    const curriculum: Subject[] = subjects.map((subject) => {
      const subjectTopics = (topics || [])
        .filter((topic) => topic.subject_id === subject.id)
        .map((topic) => {
          const topicQuestions = (questions || [])
            .filter((q) => q.topic_id === topic.id)
            .map((q) => ({
              id: q.id,
              question: q.question,
              marks: q.marks,
              difficulty: q.difficulty as "easy" | "medium" | "hard",
              modelAnswer: q.model_answer,
              markingCriteria: q.marking_criteria as Record<string, any>,
              specReference: q.spec_reference,
              calculatorGuidance: q.calculator_guidance,
              orderIndex: q.order_index,
            }));

          return {
            id: topic.id,
            name: topic.name,
            questions: topicQuestions,
            orderIndex: topic.order_index,
          };
        });

      return {
        id: subject.id,
        name: subject.name,
        examBoard: subject.exam_board,
        topics: subjectTopics,
      };
    });

    // Update cache
    cachedCurriculum = curriculum;
    cacheTimestamp = Date.now();

    const duration = Date.now() - startTime;
    console.log(`✅ Curriculum loaded in ${duration}ms`);
    console.log(`📊 Structure: ${curriculum.length} subjects, ${topics?.length || 0} topics, ${questions?.length || 0} questions`);

    return curriculum;
  } catch (error) {
    console.error("❌ Error fetching curriculum:", error);
    throw new Error(`Failed to load curriculum: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Clears the curriculum cache, forcing a fresh fetch on next call
 */
export function clearCurriculumCache(): void {
  cachedCurriculum = null;
  cacheTimestamp = null;
  console.log("🗑️ Curriculum cache cleared");
}

/**
 * Gets a specific subject by ID
 */
export async function getSubjectById(subjectId: string): Promise<Subject | null> {
  const curriculum = await fetchCurriculumFromDatabase();
  return curriculum.find((s) => s.id === subjectId) || null;
}

/**
 * Gets a specific topic by subject ID and topic ID
 */
export async function getTopicById(subjectId: string, topicId: string): Promise<Topic | null> {
  const subject = await getSubjectById(subjectId);
  return subject?.topics.find((t) => t.id === topicId) || null;
}

/**
 * Gets questions for a specific topic
 */
export async function getQuestionsForTopic(subjectId: string, topicId: string): Promise<Question[]> {
  const topic = await getTopicById(subjectId, topicId);
  return topic?.questions || [];
}
