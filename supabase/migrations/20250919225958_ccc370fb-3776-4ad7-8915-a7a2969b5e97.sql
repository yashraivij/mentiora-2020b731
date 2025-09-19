-- Create atomic function to safely increment user points
CREATE OR REPLACE FUNCTION public.increment_user_points(p_user_id UUID, p_points INTEGER)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  new_total INTEGER;
BEGIN
  -- Insert or update user points atomically
  INSERT INTO public.user_points (user_id, total_points, created_at, updated_at)
  VALUES (p_user_id, p_points, NOW(), NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_points = public.user_points.total_points + p_points,
    updated_at = NOW()
  RETURNING total_points INTO new_total;
  
  RETURN new_total;
END;
$$;

-- Create function to reset user points (for fixing corrupted data)
CREATE OR REPLACE FUNCTION public.reset_user_points_based_on_activities(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  calculated_points INTEGER := 0;
  daily_logins INTEGER;
  practice_completions INTEGER;
  weekly_topics_awards INTEGER;
  weekly_practice_awards INTEGER;
  streak_awards INTEGER;
BEGIN
  -- Count different types of activities and calculate correct points
  
  -- Daily logins: 10 points each (but only count unique days)
  SELECT COUNT(DISTINCT DATE(created_at)) INTO daily_logins
  FROM public.user_activities 
  WHERE user_id = p_user_id AND activity_type = 'daily_login';
  
  -- Practice completions: 40 points each
  SELECT COUNT(*) INTO practice_completions
  FROM public.user_activities 
  WHERE user_id = p_user_id AND activity_type = 'practice_completed';
  
  -- Weekly 3 topics awards: 100 points each
  SELECT COUNT(*) INTO weekly_topics_awards
  FROM public.user_activities 
  WHERE user_id = p_user_id AND activity_type = 'weekly_3_topics_awarded';
  
  -- Weekly 5 practice awards: 250 points each
  SELECT COUNT(*) INTO weekly_practice_awards
  FROM public.user_activities 
  WHERE user_id = p_user_id AND activity_type = 'weekly_5_practice_awarded';
  
  -- Streak awards: 500 points each
  SELECT COUNT(*) INTO streak_awards
  FROM public.user_activities 
  WHERE user_id = p_user_id AND activity_type = 'streak_7_days_awarded';
  
  -- Calculate total points
  calculated_points := 
    (daily_logins * 10) + 
    (practice_completions * 40) + 
    (weekly_topics_awards * 100) + 
    (weekly_practice_awards * 250) + 
    (streak_awards * 500);
  
  -- Update or insert the correct points
  INSERT INTO public.user_points (user_id, total_points, created_at, updated_at)
  VALUES (p_user_id, calculated_points, NOW(), NOW())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    total_points = calculated_points,
    updated_at = NOW();
  
  RETURN calculated_points;
END;
$$;