-- Fix get_user_streak to use UK timezone consistently
CREATE OR REPLACE FUNCTION public.get_user_streak(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE;
  has_activity BOOLEAN;
  uk_current_date DATE;
BEGIN
  -- Get current date in UK timezone
  uk_current_date := (NOW() AT TIME ZONE 'Europe/London')::date;
  
  -- Check if user has activity today (UK time)
  SELECT EXISTS(
    SELECT 1 FROM public.daily_usage 
    WHERE user_id = user_uuid 
    AND date = uk_current_date
    AND activities_count > 0
  ) INTO has_activity;
  
  -- If no activity today, check if they had activity yesterday
  IF NOT has_activity THEN
    SELECT EXISTS(
      SELECT 1 FROM public.daily_usage 
      WHERE user_id = user_uuid 
      AND date = uk_current_date - INTERVAL '1 day'
      AND activities_count > 0
    ) INTO has_activity;
    
    -- If no activity yesterday either, streak is 0
    IF NOT has_activity THEN
      RETURN 0;
    END IF;
    
    -- Start checking from yesterday if they didn't use it today
    check_date := uk_current_date - INTERVAL '1 day';
  ELSE
    check_date := uk_current_date;
  END IF;
  
  -- Count consecutive days with activity working backwards from check_date
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.daily_usage 
      WHERE user_id = user_uuid 
      AND date = check_date 
      AND activities_count > 0
    ) INTO has_activity;
    
    IF has_activity THEN
      streak_count := streak_count + 1;
      check_date := check_date - INTERVAL '1 day';
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  RETURN streak_count;
END;
$function$;

-- Also update the trigger to use UK timezone for consistency
CREATE OR REPLACE FUNCTION public.update_daily_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  uk_current_date DATE;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get current date in UK timezone
    uk_current_date := (NOW() AT TIME ZONE 'Europe/London')::date;
    
    INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
    VALUES (NEW.user_id, uk_current_date, 1, 5)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
      activities_count = daily_usage.activities_count + 1,
      total_minutes = daily_usage.total_minutes + 5,
      updated_at = now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;