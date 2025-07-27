-- Create table to track streak celebration views
CREATE TABLE public.streak_celebrations_viewed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  streak_days INTEGER NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, streak_days)
);

-- Enable Row Level Security
ALTER TABLE public.streak_celebrations_viewed ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own streak celebration records" 
ON public.streak_celebrations_viewed 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own streak celebration records" 
ON public.streak_celebrations_viewed 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for performance
CREATE INDEX idx_streak_celebrations_user_id ON public.streak_celebrations_viewed(user_id);
CREATE INDEX idx_streak_celebrations_user_streak ON public.streak_celebrations_viewed(user_id, streak_days);