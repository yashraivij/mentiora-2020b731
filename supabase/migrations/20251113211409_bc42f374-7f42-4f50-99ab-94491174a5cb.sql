-- Create custom_exam_configs table
CREATE TABLE IF NOT EXISTS public.custom_exam_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  subject_id TEXT NOT NULL,
  exam_board TEXT,
  selected_topics TEXT[] NOT NULL DEFAULT '{}',
  timer_minutes INTEGER NOT NULL DEFAULT 60,
  difficulty_filter TEXT NOT NULL DEFAULT 'mixed',
  target_marks INTEGER NOT NULL DEFAULT 50,
  question_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_taken_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_difficulty CHECK (difficulty_filter IN ('easy', 'medium', 'hard', 'predicted-2026', 'mixed'))
);

-- Enable RLS
ALTER TABLE public.custom_exam_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own exam configs"
ON public.custom_exam_configs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own exam configs"
ON public.custom_exam_configs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own exam configs"
ON public.custom_exam_configs
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exam configs"
ON public.custom_exam_configs
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_custom_exam_configs_user_id ON public.custom_exam_configs(user_id);
CREATE INDEX idx_custom_exam_configs_subject_id ON public.custom_exam_configs(subject_id);