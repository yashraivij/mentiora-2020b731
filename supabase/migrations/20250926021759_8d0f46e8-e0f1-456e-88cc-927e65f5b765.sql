-- Fix the update_daily_usage function to calculate actual time and activities
CREATE OR REPLACE FUNCTION public.update_daily_usage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  actual_minutes INTEGER := 0;
  daily_activities INTEGER;
  daily_minutes INTEGER;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Calculate actual time spent based on activity type
    CASE 
      WHEN NEW.activity_type = 'study_session_completed' THEN
        -- Get actual study session duration from metadata or study_sessions table
        SELECT COALESCE(
          (NEW.metadata->>'duration_minutes')::INTEGER,
          5
        ) INTO actual_minutes;
      WHEN NEW.activity_type = 'practice_completed' THEN
        actual_minutes := 15; -- Average practice time
      WHEN NEW.activity_type = 'flashcard_review' THEN
        actual_minutes := 2; -- Average flashcard review time
      WHEN NEW.activity_type = 'daily_login' THEN
        actual_minutes := 1; -- Minimal time for login
      ELSE
        actual_minutes := 3; -- Default time for other activities
    END CASE;
    
    -- Count total activities and minutes for the day
    SELECT 
      COUNT(*) + 1,
      COALESCE(SUM(
        CASE 
          WHEN activity_type = 'study_session_completed' THEN 
            COALESCE((metadata->>'duration_minutes')::INTEGER, 5)
          WHEN activity_type = 'practice_completed' THEN 15
          WHEN activity_type = 'flashcard_review' THEN 2
          WHEN activity_type = 'daily_login' THEN 1
          ELSE 3
        END
      ), 0) + actual_minutes
    INTO daily_activities, daily_minutes
    FROM public.user_activities 
    WHERE user_id = NEW.user_id 
    AND DATE(created_at) = CURRENT_DATE;
    
    -- Insert or update daily usage with accurate values
    INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
    VALUES (NEW.user_id, CURRENT_DATE, 1, actual_minutes)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
      activities_count = daily_activities,
      total_minutes = daily_minutes,
      updated_at = now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Create function to recalculate daily usage from existing data
CREATE OR REPLACE FUNCTION public.recalculate_daily_usage()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  processed_count INTEGER := 0;
  user_record RECORD;
BEGIN
  -- Clear existing daily usage data
  DELETE FROM public.daily_usage;
  
  -- Recalculate from user_activities
  FOR user_record IN 
    SELECT 
      user_id,
      DATE(created_at) as activity_date,
      COUNT(*) as activities_count,
      SUM(
        CASE 
          WHEN activity_type = 'study_session_completed' THEN 
            COALESCE((metadata->>'duration_minutes')::INTEGER, 5)
          WHEN activity_type = 'practice_completed' THEN 15
          WHEN activity_type = 'flashcard_review' THEN 2
          WHEN activity_type = 'daily_login' THEN 1
          ELSE 3
        END
      ) as total_minutes
    FROM public.user_activities
    GROUP BY user_id, DATE(created_at)
  LOOP
    INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes, created_at, updated_at)
    VALUES (
      user_record.user_id, 
      user_record.activity_date, 
      user_record.activities_count,
      user_record.total_minutes,
      user_record.activity_date + INTERVAL '12 hours',
      now()
    );
    processed_count := processed_count + 1;
  END LOOP;
  
  -- Also add data from actual study sessions
  INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes, created_at, updated_at)
  SELECT 
    ss.user_id,
    DATE(ss.started_at) as study_date,
    COUNT(*) as session_count,
    COALESCE(SUM(ss.duration_minutes), 0) as study_minutes,
    DATE(ss.started_at) + INTERVAL '12 hours',
    now()
  FROM public.study_sessions ss
  WHERE ss.ended_at IS NOT NULL
  GROUP BY ss.user_id, DATE(ss.started_at)
  ON CONFLICT (user_id, date)
  DO UPDATE SET
    activities_count = daily_usage.activities_count + EXCLUDED.activities_count,
    total_minutes = daily_usage.total_minutes + EXCLUDED.total_minutes,
    updated_at = now();
    
  RETURN processed_count;
END;
$function$;

-- Run the recalculation to fix existing data
SELECT public.recalculate_daily_usage();