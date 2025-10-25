-- Create subject_daily_tasks table for tracking daily tasks per subject
CREATE TABLE IF NOT EXISTS public.subject_daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id TEXT NOT NULL,
  task_id TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  completed BOOLEAN NOT NULL DEFAULT false,
  mp_awarded INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, subject_id, task_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.subject_daily_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own subject tasks"
ON public.subject_daily_tasks
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subject tasks"
ON public.subject_daily_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subject tasks"
ON public.subject_daily_tasks
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subject tasks"
ON public.subject_daily_tasks
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_subject_daily_tasks_user_date ON public.subject_daily_tasks(user_id, date);
CREATE INDEX idx_subject_daily_tasks_subject ON public.subject_daily_tasks(subject_id, date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_subject_daily_tasks_updated_at
BEFORE UPDATE ON public.subject_daily_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();