-- Add metadata column to user_goals table
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Create index for better performance on metadata queries
CREATE INDEX IF NOT EXISTS idx_user_goals_metadata ON public.user_goals USING GIN(metadata);