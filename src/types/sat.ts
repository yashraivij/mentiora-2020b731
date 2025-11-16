export interface SATQuestion {
  id: string;
  domain: string;
  difficulty: string;
  question_type: string;
  question_text: string;
  passage_text: string | null;
  choices: any;
  correct_answer: string;
  explanation: string;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SATSessionLog {
  id: string;
  user_id: string;
  session_date: string;
  session_type: string;
  questions_answered: number;
  correct: number;
  incorrect: number;
  domains_improved: string[];
  domains_needing_review: string[];
  time_spent_minutes: number;
  score_delta: number;
  answers: SATAnswer[];
}

export interface SATAnswer {
  question_id: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  time_spent_seconds: number;
}

export interface SATDailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  activities: SATActivity[];
  completed: boolean;
  completed_at?: string;
}

export interface SATActivity {
  type: 'warmup' | 'core_focus' | 'review' | 'boost';
  domain: string;
  question_ids: string[];
  estimated_minutes: number;
  completed: boolean;
}

export interface SATProfile {
  exam_type: string;
  sat_exam_date?: string;
  sat_confidence_level?: string;
  sat_target_band?: string;
  sat_baseline_score_low?: number;
  sat_baseline_score_high?: number;
  sat_predicted_score_low?: number;
  sat_predicted_score_high?: number;
  sat_strength_domains?: string[];
  sat_weak_domains?: string[];
  sat_daily_minutes?: number;
  sat_last_session_date?: string;
  sat_next_session_date?: string;
  sat_streak_days?: number;
  sat_diagnostic_completed?: boolean;
}

export interface DiagnosticResults {
  score_low: number;
  score_high: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  strengths: DomainScore[];
  weaknesses: DomainScore[];
  recommended_daily_minutes: number;
}

export interface DomainScore {
  domain: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface DomainProgress {
  domain: string;
  domainId: string;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  lastAttempt: Date | null;
  masteryLevel: 'beginner' | 'developing' | 'strong' | 'expert';
  scoreContribution: number;
  attempts: number;
}

export interface SATWeeklyReview {
  id?: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  sessions_completed: number;
  total_questions_answered: number;
  baseline_score_low: number;
  baseline_score_high: number;
  updated_score_low: number;
  updated_score_high: number;
  improvement_percentage: number;
  areas_mastered: string[];
  trending_domains: Record<string, { correct: number; total: number }>;
  created_at?: string;
  updated_at?: string;
}
