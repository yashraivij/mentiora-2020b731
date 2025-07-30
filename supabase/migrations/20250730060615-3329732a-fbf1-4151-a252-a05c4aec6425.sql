-- Create or replace the update_daily_usage trigger function to ensure it works properly
CREATE OR REPLACE FUNCTION public.update_daily_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
    VALUES (NEW.user_id, CURRENT_DATE, 1, 5)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
      activities_count = daily_usage.activities_count + 1,
      total_minutes = daily_usage.total_minutes + 5,
      updated_at = now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create the trigger on user_activities table
DROP TRIGGER IF EXISTS trigger_update_daily_usage ON public.user_activities;
CREATE TRIGGER trigger_update_daily_usage
  AFTER INSERT ON public.user_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_daily_usage();

-- Also ensure the get_user_streak function works correctly with proper streak logic
CREATE OR REPLACE FUNCTION public.get_user_streak(user_uuid uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  streak_count INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  has_activity BOOLEAN;
BEGIN
  -- Check if user has activity today first, if not, streak is 0
  SELECT EXISTS(
    SELECT 1 FROM public.daily_usage 
    WHERE user_id = user_uuid 
    AND date = CURRENT_DATE 
    AND activities_count > 0
  ) INTO has_activity;
  
  -- If no activity today, check if they had activity yesterday
  IF NOT has_activity THEN
    SELECT EXISTS(
      SELECT 1 FROM public.daily_usage 
      WHERE user_id = user_uuid 
      AND date = CURRENT_DATE - INTERVAL '1 day'
      AND activities_count > 0
    ) INTO has_activity;
    
    -- If no activity yesterday either, streak is 0
    IF NOT has_activity THEN
      RETURN 0;
    END IF;
    
    -- Start checking from yesterday if they didn't use it today
    check_date := CURRENT_DATE - INTERVAL '1 day';
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