-- Create a detailed weekly login frequency view
CREATE OR REPLACE VIEW public.weekly_login_analytics AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  date_trunc('week', DATE(ua.created_at)) as week_start,
  COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') as total_logins,
  COUNT(DISTINCT DATE(ua.created_at)) FILTER (WHERE ua.activity_type = 'daily_login') as unique_login_days,
  ROUND(COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login')::numeric / 7 * 100, 1) as login_frequency_percentage,
  CASE 
    WHEN COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') >= 7 THEN 'Daily User'
    WHEN COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') >= 5 THEN 'Frequent User'
    WHEN COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') >= 3 THEN 'Regular User'
    WHEN COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') >= 1 THEN 'Casual User'
    ELSE 'Inactive'
  END as login_pattern,
  -- Show which days of the week they typically log in
  ARRAY_AGG(DISTINCT 
    CASE EXTRACT(DOW FROM ua.created_at)
      WHEN 0 THEN 'Sunday'
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
    END
  ) FILTER (WHERE ua.activity_type = 'daily_login') as login_days,
  -- Average time between logins
  CASE 
    WHEN COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') > 1 THEN
      ROUND(7.0 / COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login'), 1)
    ELSE NULL
  END as avg_days_between_logins,
  MIN(ua.created_at) FILTER (WHERE ua.activity_type = 'daily_login') as first_login_of_week,
  MAX(ua.created_at) FILTER (WHERE ua.activity_type = 'daily_login') as last_login_of_week
FROM public.user_activities ua
LEFT JOIN public.profiles p ON ua.user_id = p.id
WHERE ua.activity_type = 'daily_login'
GROUP BY 
  p.email, 
  p.full_name, 
  p.subscription_status, 
  date_trunc('week', DATE(ua.created_at))
ORDER BY week_start DESC, total_logins DESC;

-- Create a summary view for overall login patterns
CREATE OR REPLACE VIEW public.user_login_summary AS
SELECT 
  p.email,
  p.full_name,
  p.subscription_status,
  COUNT(*) FILTER (WHERE ua.activity_type = 'daily_login') as total_lifetime_logins,
  COUNT(DISTINCT DATE(ua.created_at)) FILTER (WHERE ua.activity_type = 'daily_login') as unique_login_days,
  COUNT(DISTINCT date_trunc('week', DATE(ua.created_at))) FILTER (WHERE ua.activity_type = 'daily_login') as active_weeks,
  ROUND(AVG(weekly_stats.weekly_logins), 1) as avg_weekly_logins,
  MAX(weekly_stats.weekly_logins) as max_weekly_logins,
  MIN(weekly_stats.weekly_logins) as min_weekly_logins,
  CASE 
    WHEN AVG(weekly_stats.weekly_logins) >= 7 THEN 'Daily User'
    WHEN AVG(weekly_stats.weekly_logins) >= 5 THEN 'Frequent User'
    WHEN AVG(weekly_stats.weekly_logins) >= 3 THEN 'Regular User'
    WHEN AVG(weekly_stats.weekly_logins) >= 1 THEN 'Casual User'
    ELSE 'Inactive'
  END as user_type,
  MIN(ua.created_at) FILTER (WHERE ua.activity_type = 'daily_login') as first_login_ever,
  MAX(ua.created_at) FILTER (WHERE ua.activity_type = 'daily_login') as last_login_ever
FROM public.user_activities ua
LEFT JOIN public.profiles p ON ua.user_id = p.id
LEFT JOIN (
  SELECT 
    user_id,
    date_trunc('week', DATE(created_at)) as week,
    COUNT(*) FILTER (WHERE activity_type = 'daily_login') as weekly_logins
  FROM public.user_activities
  WHERE activity_type = 'daily_login'
  GROUP BY user_id, date_trunc('week', DATE(created_at))
) weekly_stats ON ua.user_id = weekly_stats.user_id
WHERE ua.activity_type = 'daily_login'
GROUP BY p.email, p.full_name, p.subscription_status
ORDER BY avg_weekly_logins DESC;