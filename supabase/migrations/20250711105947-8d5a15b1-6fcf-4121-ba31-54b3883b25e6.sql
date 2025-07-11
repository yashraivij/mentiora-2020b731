-- Drop the existing check constraint
ALTER TABLE public.user_goals DROP CONSTRAINT IF EXISTS user_goals_goal_type_check;

-- Add a new check constraint that includes the new goal types
ALTER TABLE public.user_goals 
ADD CONSTRAINT user_goals_goal_type_check 
CHECK (goal_type = ANY (ARRAY['weekly_hours'::text, 'daily_streak'::text, 'accuracy_rate'::text, 'subjects_per_week'::text, 'exams_per_month'::text, 'daily_study_time'::text, 'daily_topic_mastery'::text]));