-- Create a new table to track daily topic mastery
CREATE TABLE IF NOT EXISTS public.daily_topic_mastery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subject_id TEXT NOT NULL,
  topic_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  score NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id, topic_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_topic_mastery ENABLE ROW LEVEL SECURITY;

-- Create policies for daily topic mastery
CREATE POLICY "Users can create their own topic mastery records" 
ON public.daily_topic_mastery 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own topic mastery records" 
ON public.daily_topic_mastery 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic mastery records" 
ON public.daily_topic_mastery 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_daily_topic_mastery_user_date ON public.daily_topic_mastery(user_id, date);
CREATE INDEX idx_daily_topic_mastery_subject ON public.daily_topic_mastery(user_id, subject_id, date);