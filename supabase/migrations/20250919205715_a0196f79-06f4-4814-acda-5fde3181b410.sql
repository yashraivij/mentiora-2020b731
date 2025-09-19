-- Fix user_activities table constraint to allow all existing and new activity types
ALTER TABLE public.user_activities DROP CONSTRAINT IF EXISTS user_activities_activity_type_check;

-- Add updated constraint with all existing and required activity types
ALTER TABLE public.user_activities 
ADD CONSTRAINT user_activities_activity_type_check 
CHECK (activity_type IN (
  'daily_login',
  'practice_completed', 
  'topic_practiced',
  'weekly_3_topics_completed',
  'weekly_5_practice_completed',
  'streak_7_days_completed',
  'total_5_practice_completed',
  'weekly_3_topics_awarded',
  'weekly_5_practice_awarded',  
  'streak_7_days_awarded',
  'chat_message',
  'exam_completed',
  'exam_question_answered'
));