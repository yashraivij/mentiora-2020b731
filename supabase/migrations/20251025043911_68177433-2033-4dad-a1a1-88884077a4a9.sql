-- Update activity types constraint to include all existing types plus full_marks_question
ALTER TABLE public.user_activities 
DROP CONSTRAINT IF EXISTS user_activities_activity_type_check;

ALTER TABLE public.user_activities
ADD CONSTRAINT user_activities_activity_type_check 
CHECK (activity_type IN (
  'daily_login',
  'practice_completed',
  'topic_practiced',
  'weekly_3_topics_awarded',
  'weekly_5_practice_awarded',
  'streak_7_days_awarded',
  'study_time_30min',
  'full_marks_question',
  'chat_message',
  'exam_completed',
  'exam_question_answered',
  'study_session_completed',
  'flashcard_review',
  'material_uploaded',
  'notebook_entry_created'
));