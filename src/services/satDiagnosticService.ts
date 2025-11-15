import { supabase } from '@/integrations/supabase/client';
import { SATQuestion, SATAnswer, DiagnosticResults, DomainScore } from '@/types/sat';

const DOMAINS = [
  'Information & Ideas',
  'Craft & Structure',
  'Standard English Conventions',
  'Algebra',
  'Problem Solving & Data Analysis',
];

export async function generateDiagnosticTest(): Promise<SATQuestion[]> {
  // Fetch questions from all domains with balanced difficulty
  const { data: allQuestions, error } = await supabase
    .from('sat_questions')
    .select('*');

  if (error) throw error;
  if (!allQuestions || allQuestions.length === 0) {
    throw new Error('No SAT questions available. Please seed the database first.');
  }

  // Group questions by domain
  const questionsByDomain: Record<string, any[]> = {};
  DOMAINS.forEach(domain => {
    questionsByDomain[domain] = allQuestions.filter(q => q.domain === domain);
  });

  // Select 4 questions per domain (2 easy, 1 medium, 1 hard) = 20 total
  const selectedQuestions: any[] = [];
  
  DOMAINS.forEach(domain => {
    const domainQuestions = questionsByDomain[domain] || [];
    const easy = domainQuestions.filter(q => q.difficulty === 'easy').slice(0, 2);
    const medium = domainQuestions.filter(q => q.difficulty === 'medium').slice(0, 1);
    const hard = domainQuestions.filter(q => q.difficulty === 'hard').slice(0, 1);
    
    selectedQuestions.push(...easy, ...medium, ...hard);
  });

  // Shuffle questions
  return selectedQuestions.sort(() => Math.random() - 0.5) as SATQuestion[];
}

export async function scoreDigagnostic(
  questions: SATQuestion[],
  answers: SATAnswer[]
): Promise<DiagnosticResults> {
  const correctCount = answers.filter(a => a.is_correct).length;
  const totalQuestions = questions.length;
  const percentage = (correctCount / totalQuestions) * 100;

  // Calculate domain scores
  const domainScores: Record<string, DomainScore> = {};
  
  questions.forEach((question, index) => {
    const domain = question.domain;
    if (!domainScores[domain]) {
      domainScores[domain] = {
        domain,
        correct: 0,
        total: 0,
        percentage: 0,
      };
    }
    
    domainScores[domain].total++;
    if (answers[index]?.is_correct) {
      domainScores[domain].correct++;
    }
  });

  // Calculate percentages
  Object.values(domainScores).forEach(score => {
    score.percentage = (score.correct / score.total) * 100;
  });

  // Determine strengths (>= 75%) and weaknesses (< 60%)
  const allScores = Object.values(domainScores);
  const strengths = allScores
    .filter(s => s.percentage >= 75)
    .sort((a, b) => b.percentage - a.percentage);
  
  const weaknesses = allScores
    .filter(s => s.percentage < 60)
    .sort((a, b) => a.percentage - b.percentage);

  // Calculate estimated SAT score range (400-1600 scale)
  // Rough conversion: 0% = 400 per section, 100% = 800 per section
  const readingWritingScore = Math.round(400 + (percentage / 100) * 400);
  const mathScore = Math.round(400 + (percentage / 100) * 400);
  
  // Add variance for range
  const variance = 60;
  const scoreLow = Math.max(800, readingWritingScore + mathScore - variance);
  const scoreHigh = Math.min(1600, readingWritingScore + mathScore + variance);

  // Recommend daily study time based on performance
  let recommendedMinutes = 30;
  if (percentage < 50) recommendedMinutes = 45;
  if (percentage < 40) recommendedMinutes = 60;

  return {
    score_low: scoreLow,
    score_high: scoreHigh,
    total_questions: totalQuestions,
    correct_answers: correctCount,
    percentage,
    strengths,
    weaknesses,
    recommended_daily_minutes: recommendedMinutes,
  };
}
