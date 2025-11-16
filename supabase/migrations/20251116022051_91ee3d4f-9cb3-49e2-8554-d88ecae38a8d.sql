-- Phase 1: Fix permission denied error on sat_questions table
-- This allows anon and authenticated users to read SAT questions
GRANT SELECT ON public.sat_questions TO anon, authenticated;

-- Phase 2: Create weekly review system table
CREATE TABLE IF NOT EXISTS public.sat_weekly_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date date NOT NULL,
  week_end_date date NOT NULL,
  baseline_score_low integer,
  baseline_score_high integer,
  updated_score_low integer,
  updated_score_high integer,
  improvement_percentage numeric,
  areas_mastered text[],
  trending_domains jsonb,
  sessions_completed integer DEFAULT 0,
  total_questions_answered integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on weekly reviews
ALTER TABLE public.sat_weekly_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for weekly reviews
CREATE POLICY "Users can view their own weekly reviews"
  ON public.sat_weekly_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weekly reviews"
  ON public.sat_weekly_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reviews"
  ON public.sat_weekly_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_sat_weekly_reviews_user_date 
  ON public.sat_weekly_reviews(user_id, week_start_date DESC);