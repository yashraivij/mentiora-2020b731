-- Fix security issues with analytics views by removing SECURITY DEFINER
DROP VIEW IF EXISTS public.user_activity_analytics;
DROP VIEW IF EXISTS public.weekly_user_analytics;

-- Recreate user_activity_analytics view without SECURITY DEFINER
CREATE VIEW public.user_activity_analytics AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  du.activity_date,
  du.total_minutes,
  du.activities_count,
  du.last_activity_time,
  COALESCE(activity_breakdown.daily_logins, 0) as daily_logins,
  COALESCE(activity_breakdown.practice_sessions, 0) as practice_sessions,
  COALESCE(activity_breakdown.study_sessions, 0) as study_sessions,
  COALESCE(activity_breakdown.flashcard_reviews, 0) as flashcard_reviews,
  COALESCE(activity_breakdown.notebook_entries, 0) as notebook_entries,
  COALESCE(activity_breakdown.chat_interactions, 0) as chat_interactions,
  activity_breakdown.study_modes,
  CASE 
    WHEN du.total_minutes >= 60 THEN 'High'
    WHEN du.total_minutes >= 20 THEN 'Medium'
    WHEN du.total_minutes >= 5 THEN 'Low'
    ELSE 'Minimal'
  END as engagement_level,
  COALESCE(study_data.actual_study_minutes, 0) as actual_study_minutes,
  COALESCE(study_data.completed_study_sessions, 0) as completed_study_sessions
FROM (
  SELECT 
    user_id,
    date as activity_date,
    total_minutes,
    activities_count,
    updated_at as last_activity_time
  FROM public.daily_usage
) du
LEFT JOIN public.profiles p ON du.user_id = p.id
LEFT JOIN (
  SELECT 
    user_id,
    DATE(created_at) as activity_date,
    COUNT(*) FILTER (WHERE activity_type = 'daily_login') as daily_logins,
    COUNT(*) FILTER (WHERE activity_type = 'practice_completed') as practice_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'study_session_completed') as study_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'flashcard_review') as flashcard_reviews,
    COUNT(*) FILTER (WHERE activity_type = 'notebook_entry_created') as notebook_entries,
    COUNT(*) FILTER (WHERE activity_type = 'chat_message_sent') as chat_interactions,
    array_agg(DISTINCT 
      CASE 
        WHEN activity_type = 'practice_completed' THEN 'Practice'
        WHEN activity_type = 'study_session_completed' THEN 'Study'
        WHEN activity_type = 'flashcard_review' THEN 'Flashcards'
        WHEN activity_type = 'notebook_entry_created' THEN 'Notebook'
        WHEN activity_type = 'chat_message_sent' THEN 'Chat'
        ELSE NULL
      END
    ) FILTER (WHERE activity_type IN ('practice_completed', 'study_session_completed', 'flashcard_review', 'notebook_entry_created', 'chat_message_sent')) as study_modes
  FROM public.user_activities
  GROUP BY user_id, DATE(created_at)
) activity_breakdown ON du.user_id = activity_breakdown.user_id AND du.activity_date = activity_breakdown.activity_date
LEFT JOIN (
  SELECT 
    user_id,
    DATE(started_at) as study_date,
    SUM(COALESCE(duration_minutes, 0)) as actual_study_minutes,
    COUNT(*) FILTER (WHERE ended_at IS NOT NULL) as completed_study_sessions
  FROM public.study_sessions
  GROUP BY user_id, DATE(started_at)
) study_data ON du.user_id = study_data.user_id AND du.activity_date = study_data.study_date;

-- Recreate weekly_user_analytics view without SECURITY DEFINER
CREATE VIEW public.weekly_user_analytics AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  date_trunc('week', du.date) as week_start,
  SUM(du.total_minutes) as weekly_minutes,
  SUM(du.activities_count) as weekly_activities,
  COUNT(DISTINCT du.date) as active_days,
  ROUND(AVG(du.total_minutes::numeric), 1) as avg_daily_minutes,
  COALESCE(weekly_breakdown.weekly_logins, 0) as weekly_logins,
  COALESCE(weekly_breakdown.weekly_practice, 0) as weekly_practice,
  COALESCE(weekly_breakdown.weekly_study_sessions, 0) as weekly_study_sessions,
  COALESCE(weekly_breakdown.weekly_flashcards, 0) as weekly_flashcards,
  CASE 
    WHEN SUM(du.total_minutes) >= 300 THEN 'High'
    WHEN SUM(du.total_minutes) >= 120 THEN 'Medium'
    WHEN SUM(du.total_minutes) >= 30 THEN 'Low'
    ELSE 'Minimal'
  END as weekly_engagement_level
FROM public.daily_usage du
LEFT JOIN public.profiles p ON du.user_id = p.id
LEFT JOIN (
  SELECT 
    user_id,
    date_trunc('week', DATE(created_at)) as week_start,
    COUNT(*) FILTER (WHERE activity_type = 'daily_login') as weekly_logins,
    COUNT(*) FILTER (WHERE activity_type = 'practice_completed') as weekly_practice,
    COUNT(*) FILTER (WHERE activity_type = 'study_session_completed') as weekly_study_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'flashcard_review') as weekly_flashcards
  FROM public.user_activities
  GROUP BY user_id, date_trunc('week', DATE(created_at))
) weekly_breakdown ON du.user_id = weekly_breakdown.user_id AND date_trunc('week', du.date) = weekly_breakdown.week_start
GROUP BY 
  p.email, 
  p.full_name, 
  p.subscription_status, 
  date_trunc('week', du.date),
  weekly_breakdown.weekly_logins,
  weekly_breakdown.weekly_practice,
  weekly_breakdown.weekly_study_sessions,
  weekly_breakdown.weekly_flashcards;