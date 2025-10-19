-- Create a comprehensive view for daily user activity tracking
CREATE OR REPLACE VIEW public.daily_user_activity_report AS
SELECT 
  du.date as activity_date,
  p.email,
  p.full_name,
  p.subscription_status,
  du.total_minutes as minutes_spent,
  du.activities_count as total_activities,
  
  -- Break down activities by type
  COUNT(CASE WHEN ua.activity_type = 'daily_login' THEN 1 END) as logins,
  COUNT(CASE WHEN ua.activity_type = 'practice_completed' THEN 1 END) as practices_completed,
  COUNT(CASE WHEN ua.activity_type = 'flashcard_review' THEN 1 END) as flashcard_reviews,
  COUNT(CASE WHEN ua.activity_type = 'study_session_completed' THEN 1 END) as study_sessions,
  
  -- Get first and last activity times
  MIN(ua.created_at) as first_activity_at,
  MAX(ua.created_at) as last_activity_at,
  
  -- Calculate active time span in hours
  EXTRACT(EPOCH FROM (MAX(ua.created_at) - MIN(ua.created_at))) / 3600 as active_hours_span

FROM public.daily_usage du
JOIN public.profiles p ON du.user_id = p.id
LEFT JOIN public.user_activities ua ON ua.user_id = du.user_id 
  AND DATE(ua.created_at) = du.date
GROUP BY du.date, p.email, p.full_name, p.subscription_status, du.total_minutes, du.activities_count
ORDER BY du.date DESC, du.total_minutes DESC;

-- Grant access to authenticated users and service role
GRANT SELECT ON public.daily_user_activity_report TO authenticated;
GRANT SELECT ON public.daily_user_activity_report TO service_role;

-- Create a simpler view for today's activity only
CREATE OR REPLACE VIEW public.todays_user_activity AS
SELECT * FROM public.daily_user_activity_report
WHERE activity_date = CURRENT_DATE
ORDER BY minutes_spent DESC;

GRANT SELECT ON public.todays_user_activity TO authenticated;
GRANT SELECT ON public.todays_user_activity TO service_role;