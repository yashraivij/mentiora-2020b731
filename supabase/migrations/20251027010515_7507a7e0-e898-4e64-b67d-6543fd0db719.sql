-- Update activity type constraint to include all existing types plus subject_task_completed
ALTER TABLE public.user_activities DROP CONSTRAINT IF EXISTS user_activities_activity_type_check;

ALTER TABLE public.user_activities ADD CONSTRAINT user_activities_activity_type_check 
CHECK (activity_type IN (
  'daily_login',
  'practice_completed',
  'topic_practiced',
  'flashcard_review',
  'study_session_started',
  'study_session_completed',
  'weekly_3_topics_awarded',
  'weekly_5_practice_awarded',
  'streak_7_days_awarded',
  'chat_message',
  'study_time_30min',
  'full_marks_question',
  'exam_completed',
  'exam_question_answered',
  'subject_task_completed'
));