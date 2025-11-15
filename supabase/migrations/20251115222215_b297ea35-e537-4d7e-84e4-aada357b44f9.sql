-- Extend profiles table with SAT-specific fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS exam_type text DEFAULT 'GCSE',
ADD COLUMN IF NOT EXISTS sat_exam_date date,
ADD COLUMN IF NOT EXISTS sat_confidence_level text,
ADD COLUMN IF NOT EXISTS sat_target_band text,
ADD COLUMN IF NOT EXISTS sat_baseline_score_low integer,
ADD COLUMN IF NOT EXISTS sat_baseline_score_high integer,
ADD COLUMN IF NOT EXISTS sat_predicted_score_low integer,
ADD COLUMN IF NOT EXISTS sat_predicted_score_high integer,
ADD COLUMN IF NOT EXISTS sat_strength_domains text[],
ADD COLUMN IF NOT EXISTS sat_weak_domains text[],
ADD COLUMN IF NOT EXISTS sat_daily_minutes integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS sat_last_session_date date,
ADD COLUMN IF NOT EXISTS sat_next_session_date date,
ADD COLUMN IF NOT EXISTS sat_streak_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS sat_diagnostic_completed boolean DEFAULT false;

-- Create sat_questions table
CREATE TABLE IF NOT EXISTS public.sat_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  question_type text NOT NULL CHECK (question_type IN ('mcq', 'grid_in')),
  question_text text NOT NULL,
  passage_text text,
  choices jsonb,
  correct_answer text NOT NULL,
  explanation text NOT NULL,
  tags text[] DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on sat_questions
ALTER TABLE public.sat_questions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to SAT questions
CREATE POLICY "Public read access for SAT questions"
ON public.sat_questions
FOR SELECT
USING (true);

-- Create policy for service role to manage questions
CREATE POLICY "Service role can manage SAT questions"
ON public.sat_questions
FOR ALL
USING (auth.role() = 'service_role');

-- Create sat_session_logs table
CREATE TABLE IF NOT EXISTS public.sat_session_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date date NOT NULL DEFAULT CURRENT_DATE,
  session_type text NOT NULL,
  questions_answered integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  incorrect integer NOT NULL DEFAULT 0,
  domains_improved text[] DEFAULT '{}',
  domains_needing_review text[] DEFAULT '{}',
  time_spent_minutes integer NOT NULL DEFAULT 0,
  score_delta integer DEFAULT 0,
  answers jsonb DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on sat_session_logs
ALTER TABLE public.sat_session_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for sat_session_logs
CREATE POLICY "Users can view their own SAT session logs"
ON public.sat_session_logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SAT session logs"
ON public.sat_session_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SAT session logs"
ON public.sat_session_logs
FOR UPDATE
USING (auth.uid() = user_id);

-- Create sat_daily_plans table
CREATE TABLE IF NOT EXISTS public.sat_daily_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_date date NOT NULL DEFAULT CURRENT_DATE,
  activities jsonb NOT NULL DEFAULT '[]',
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, plan_date)
);

-- Enable RLS on sat_daily_plans
ALTER TABLE public.sat_daily_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for sat_daily_plans
CREATE POLICY "Users can view their own SAT daily plans"
ON public.sat_daily_plans
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SAT daily plans"
ON public.sat_daily_plans
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SAT daily plans"
ON public.sat_daily_plans
FOR UPDATE
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sat_questions_domain ON public.sat_questions(domain);
CREATE INDEX IF NOT EXISTS idx_sat_questions_difficulty ON public.sat_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_sat_session_logs_user_date ON public.sat_session_logs(user_id, session_date DESC);
CREATE INDEX IF NOT EXISTS idx_sat_daily_plans_user_date ON public.sat_daily_plans(user_id, plan_date DESC);