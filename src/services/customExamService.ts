import { supabase } from "@/integrations/supabase/client";
import type { Subject, Topic, Question } from "./curriculumService";

// Temporary type workaround until Supabase types regenerate
interface CustomExamConfigRow {
  id: string;
  user_id: string;
  title: string;
  subject_id: string;
  exam_board: string | null;
  selected_topics: string[];
  timer_minutes: number;
  difficulty_filter: string;
  target_marks: number;
  question_count: number;
  last_taken_at: string | null;
  created_at: string;
}

export interface CustomExamConfig {
  id?: string;
  userId?: string;
  title: string;
  subjectId: string;
  examBoard: string | null;
  selectedTopics: string[];
  timerMinutes: number;
  difficultyFilter: 'easy' | 'medium' | 'hard' | 'predicted-2026' | 'mixed';
  targetMarks: number;
  questionCount: number;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  text: string;
  marks: number;
  topicId: string;
  difficulty: string;
  markingCriteria: any;
  modelAnswer: string;
  specReference: string;
}

/**
 * Fisher-Yates shuffle algorithm for randomizing arrays
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate a custom exam based on the provided configuration
 */
export async function generateCustomExam(
  config: CustomExamConfig,
  curriculum: Subject[]
): Promise<ExamQuestion[]> {
  // Find the subject
  const subject = curriculum.find(s => s.id === config.subjectId);
  if (!subject) {
    throw new Error('Subject not found');
  }

  // Filter topics based on selection
  const selectedTopics = subject.topics.filter(t => 
    config.selectedTopics.includes(t.id)
  );

  if (selectedTopics.length === 0) {
    throw new Error('No topics selected');
  }

  // Collect all questions from selected topics
  let allQuestions: Array<Question & { topicId: string }> = [];
  selectedTopics.forEach(topic => {
    topic.questions.forEach(q => {
      allQuestions.push({ ...q, topicId: topic.id });
    });
  });

  // Organize questions by topic and apply filters
  const questionsByTopic = new Map<string, Question[]>();
  
  for (const topicId of config.selectedTopics) {
    const topic = selectedTopics.find(t => t.id === topicId);
    if (!topic) continue;

    let topicQuestions = [...topic.questions];

    // Apply difficulty filter (except for predicted-2026 which is handled separately)
    if (config.difficultyFilter && config.difficultyFilter !== 'mixed' && config.difficultyFilter !== 'predicted-2026') {
      topicQuestions = topicQuestions.filter(q => q.difficulty === config.difficultyFilter);
    }

    if (topicQuestions.length > 0) {
      questionsByTopic.set(topicId, shuffleArray(topicQuestions));
    }
  }

  if (questionsByTopic.size === 0) {
    throw new Error('No questions match your criteria');
  }

  // For predicted-2026, handle separately with mixed difficulties
  if (config.difficultyFilter === 'predicted-2026') {
    const easyQuestions = allQuestions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = allQuestions.filter(q => q.difficulty === 'medium');
    const hardQuestions = allQuestions.filter(q => q.difficulty === 'hard');
    
    const targetEasy = Math.ceil(config.questionCount * 0.3);
    const targetMedium = Math.ceil(config.questionCount * 0.5);
    const targetHard = Math.floor(config.questionCount * 0.2);
    
    const selectedQuestions: ExamQuestion[] = [];
    let questionNumber = 1;
    
    const selected = [
      ...shuffleArray(easyQuestions).slice(0, targetEasy),
      ...shuffleArray(mediumQuestions).slice(0, targetMedium),
      ...shuffleArray(hardQuestions).slice(0, targetHard)
    ];
    
    shuffleArray(selected).forEach(question => {
      selectedQuestions.push({
        id: question.id,
        questionNumber: questionNumber++,
        text: question.question,
        marks: question.marks,
        topicId: question.topicId,
        difficulty: question.difficulty,
        markingCriteria: question.markingCriteria,
        modelAnswer: question.modelAnswer,
        specReference: question.specReference
      });
    });

    return selectedQuestions.slice(0, config.questionCount);
  }

  // Calculate questions per topic for even distribution
  const questionsPerTopic = Math.floor(config.questionCount / questionsByTopic.size);
  const remainder = config.questionCount % questionsByTopic.size;

  // Select questions using round-robin for even distribution
  const selectedQuestions: ExamQuestion[] = [];
  const topicIds = Array.from(questionsByTopic.keys());
  const topicPointers = new Map<string, number>();
  topicIds.forEach(id => topicPointers.set(id, 0));

  // First pass: distribute evenly
  for (let i = 0; i < questionsPerTopic; i++) {
    for (const topicId of topicIds) {
      const questions = questionsByTopic.get(topicId)!;
      const pointer = topicPointers.get(topicId)!;
      
      if (pointer < questions.length) {
        const question = questions[pointer];
        selectedQuestions.push({
          id: question.id,
          questionNumber: selectedQuestions.length + 1,
          text: question.question,
          marks: question.marks,
          topicId: topicId,
          difficulty: question.difficulty,
          markingCriteria: question.markingCriteria,
          modelAnswer: question.modelAnswer,
          specReference: question.specReference
        });
        topicPointers.set(topicId, pointer + 1);
      }
    }
  }

  // Second pass: add remainder questions
  for (let i = 0; i < remainder && selectedQuestions.length < config.questionCount; i++) {
    const topicId = topicIds[i % topicIds.length];
    const questions = questionsByTopic.get(topicId)!;
    const pointer = topicPointers.get(topicId)!;
    
    if (pointer < questions.length) {
      const question = questions[pointer];
      selectedQuestions.push({
        id: question.id,
        questionNumber: selectedQuestions.length + 1,
        text: question.question,
        marks: question.marks,
        topicId: topicId,
        difficulty: question.difficulty,
        markingCriteria: question.markingCriteria,
        modelAnswer: question.modelAnswer,
        specReference: question.specReference
      });
      topicPointers.set(topicId, pointer + 1);
    }
  }

  // Shuffle final selection to mix up the order
  const finalQuestions = shuffleArray(selectedQuestions);

  if (finalQuestions.length < 5) {
    throw new Error(`Not enough questions generated. Only ${finalQuestions.length} questions available.`);
  }

  return finalQuestions;
}

/**
 * Save a custom exam configuration to the database
 */
export async function saveCustomExamConfig(
  config: CustomExamConfig
): Promise<string> {
  // Verify authentication
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError) {
    console.error('❌ Session error:', sessionError);
    throw new Error(`Authentication error: ${sessionError.message}`);
  }
  
  if (!session?.user?.id) {
    console.error('❌ No valid session or user ID found');
    throw new Error('You must be logged in to create custom exams');
  }

  console.log('✅ User authenticated:', session.user.id);
  console.log('📤 Creating config:', config.title);

  // Call the secure database function (type cast until types are regenerated)
  const { data, error } = await (supabase.rpc as any)('create_custom_exam_config', {
    p_title: config.title,
    p_subject_id: config.subjectId,
    p_exam_board: config.examBoard || null,
    p_selected_topics: config.selectedTopics,
    p_timer_minutes: config.timerMinutes,
    p_difficulty_filter: config.difficultyFilter,
    p_target_marks: config.targetMarks,
    p_question_count: config.questionCount || 0
  });

  if (error) {
    console.error('❌ Database error:', error);
    throw new Error(`Failed to save exam configuration: ${error.message}`);
  }

  if (!data) {
    console.error('❌ No ID returned from function');
    throw new Error('Failed to save exam configuration: No ID returned');
  }

  console.log('✅ Config saved with ID:', data);
  return data as string;
}

/**
 * Load a custom exam configuration from the database
 */
export async function loadCustomExamConfig(
  configId: string
): Promise<CustomExamConfig> {
  const { data, error } = await supabase
    .from('custom_exam_configs' as any)
    .select('*')
    .eq('id', configId)
    .single() as { data: CustomExamConfigRow | null; error: any };

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Configuration not found');
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    subjectId: data.subject_id,
    examBoard: data.exam_board,
    selectedTopics: data.selected_topics,
    timerMinutes: data.timer_minutes,
    difficultyFilter: data.difficulty_filter as any,
    targetMarks: data.target_marks,
    questionCount: data.question_count
  };
}

/**
 * Get all saved configurations for the current user
 */
export async function getUserExamConfigs(): Promise<CustomExamConfig[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('custom_exam_configs' as any)
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: CustomExamConfigRow[] | null; error: any };

  if (error) {
    throw error;
  }

  if (!data) {
    return [];
  }

  return data.map(d => ({
    id: d.id,
    userId: d.user_id,
    title: d.title,
    subjectId: d.subject_id,
    examBoard: d.exam_board,
    selectedTopics: d.selected_topics,
    timerMinutes: d.timer_minutes,
    difficultyFilter: d.difficulty_filter as any,
    targetMarks: d.target_marks,
    questionCount: d.question_count
  }));
}

/**
 * Update last taken timestamp
 */
export async function updateLastTaken(configId: string): Promise<void> {
  const { error } = await supabase
    .from('custom_exam_configs' as any)
    .update({ last_taken_at: new Date().toISOString() })
    .eq('id', configId) as any;

  if (error) {
    throw error;
  }
}

/**
 * Delete a configuration
 */
export async function deleteCustomExamConfig(configId: string): Promise<void> {
  const { error } = await supabase
    .from('custom_exam_configs' as any)
    .delete()
    .eq('id', configId) as any;

  if (error) {
    throw error;
  }
}