-- Create a comprehensive user activity analytics view
CREATE OR REPLACE VIEW public.user_activity_analytics AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  du.date as activity_date,
  du.total_minutes,
  du.activities_count,
  
  -- Activity type breakdown
  COALESCE(activity_breakdown.daily_logins, 0) as daily_logins,
  COALESCE(activity_breakdown.practice_sessions, 0) as practice_sessions,
  COALESCE(activity_breakdown.study_sessions, 0) as study_sessions,
  COALESCE(activity_breakdown.flashcard_reviews, 0) as flashcard_reviews,
  COALESCE(activity_breakdown.notebook_entries, 0) as notebook_entries,
  COALESCE(activity_breakdown.chat_interactions, 0) as chat_interactions,
  
  -- Study session details
  COALESCE(study_details.total_study_minutes, 0) as actual_study_minutes,
  COALESCE(study_details.study_sessions_count, 0) as completed_study_sessions,
  study_details.study_modes,
  
  -- User engagement metrics
  CASE 
    WHEN du.total_minutes > 60 THEN 'High'
    WHEN du.total_minutes > 30 THEN 'Medium'
    WHEN du.total_minutes > 0 THEN 'Low'
    ELSE 'None'
  END as engagement_level,
  
  -- Last activity timestamp
  du.updated_at as last_activity_time

FROM public.daily_usage du
LEFT JOIN public.profiles p ON du.user_id = p.id
LEFT JOIN (
  -- Activity type breakdown subquery
  SELECT 
    user_id,
    DATE(created_at) as activity_date,
    COUNT(*) FILTER (WHERE activity_type = 'daily_login') as daily_logins,
    COUNT(*) FILTER (WHERE activity_type = 'practice_completed') as practice_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'study_session') as study_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'flashcard_review') as flashcard_reviews,
    COUNT(*) FILTER (WHERE activity_type = 'notebook_entry') as notebook_entries,
    COUNT(*) FILTER (WHERE activity_type = 'chat_interaction') as chat_interactions
  FROM public.user_activities
  GROUP BY user_id, DATE(created_at)
) activity_breakdown ON du.user_id = activity_breakdown.user_id AND du.date = activity_breakdown.activity_date
LEFT JOIN (
  -- Study session details subquery
  SELECT 
    user_id,
    DATE(started_at) as study_date,
    SUM(duration_minutes) as total_study_minutes,
    COUNT(*) as study_sessions_count,
    array_agg(DISTINCT mode) as study_modes
  FROM public.study_sessions
  WHERE ended_at IS NOT NULL
  GROUP BY user_id, DATE(started_at)
) study_details ON du.user_id = study_details.user_id AND du.date = study_details.study_date

ORDER BY du.date DESC, du.total_minutes DESC;

-- Create a weekly summary view for broader analytics
CREATE OR REPLACE VIEW public.weekly_user_analytics AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  DATE_TRUNC('week', du.date) as week_start,
  
  -- Weekly aggregations
  SUM(du.total_minutes) as weekly_minutes,
  SUM(du.activities_count) as weekly_activities,
  COUNT(DISTINCT du.date) as active_days,
  AVG(du.total_minutes) as avg_daily_minutes,
  
  -- Weekly activity breakdown
  SUM(COALESCE(activity_breakdown.daily_logins, 0)) as weekly_logins,
  SUM(COALESCE(activity_breakdown.practice_sessions, 0)) as weekly_practice,
  SUM(COALESCE(activity_breakdown.study_sessions, 0)) as weekly_study_sessions,
  SUM(COALESCE(activity_breakdown.flashcard_reviews, 0)) as weekly_flashcards,
  
  -- Engagement classification
  CASE 
    WHEN SUM(du.total_minutes) > 300 THEN 'Highly Engaged'
    WHEN SUM(du.total_minutes) > 120 THEN 'Moderately Engaged'
    WHEN SUM(du.total_minutes) > 30 THEN 'Lightly Engaged'
    ELSE 'Minimal Engagement'
  END as weekly_engagement_level

FROM public.daily_usage du
LEFT JOIN public.profiles p ON du.user_id = p.id
LEFT JOIN (
  SELECT 
    user_id,
    DATE(created_at) as activity_date,
    COUNT(*) FILTER (WHERE activity_type = 'daily_login') as daily_logins,
    COUNT(*) FILTER (WHERE activity_type = 'practice_completed') as practice_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'study_session') as study_sessions,
    COUNT(*) FILTER (WHERE activity_type = 'flashcard_review') as flashcard_reviews
  FROM public.user_activities
  GROUP BY user_id, DATE(created_at)
) activity_breakdown ON du.user_id = activity_breakdown.user_id AND du.date = activity_breakdown.activity_date

WHERE du.date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.email, p.full_name, p.subscription_status, DATE_TRUNC('week', du.date)
ORDER BY week_start DESC, weekly_minutes DESC;

-- Create a function to get top users by activity for a specific date range
CREATE OR REPLACE FUNCTION public.get_top_active_users(
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '7 days',
  end_date DATE DEFAULT CURRENT_DATE,
  limit_count INTEGER DEFAULT 20
)
RETURNS TABLE(
  email TEXT,
  full_name TEXT,
  subscription_status TEXT,
  total_minutes BIGINT,
  total_activities BIGINT,
  active_days BIGINT,
  avg_daily_minutes NUMERIC,
  primary_activities TEXT[]
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.email,
    p.full_name,
    p.subscription_status,
    SUM(du.total_minutes) as total_minutes,
    SUM(du.activities_count) as total_activities,
    COUNT(DISTINCT du.date) as active_days,
    ROUND(AVG(du.total_minutes::numeric), 1) as avg_daily_minutes,
    
    -- Get top activity types for each user
    ARRAY(
      SELECT activity_type 
      FROM public.user_activities ua 
      WHERE ua.user_id = du.user_id 
        AND DATE(ua.created_at) BETWEEN start_date AND end_date
      GROUP BY activity_type 
      ORDER BY COUNT(*) DESC 
      LIMIT 3
    ) as primary_activities
    
  FROM public.daily_usage du
  LEFT JOIN public.profiles p ON du.user_id = p.id
  WHERE du.date BETWEEN start_date AND end_date
  GROUP BY du.user_id, p.email, p.full_name, p.subscription_status
  HAVING SUM(du.total_minutes) > 0
  ORDER BY total_minutes DESC
  LIMIT limit_count;
END;
$$;