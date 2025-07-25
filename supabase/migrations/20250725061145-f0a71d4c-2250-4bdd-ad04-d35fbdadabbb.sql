-- Fix security vulnerability: Update all database functions to include search_path protection
-- This prevents search path injection attacks

-- Update update_daily_usage function
CREATE OR REPLACE FUNCTION public.update_daily_usage()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.daily_usage (user_id, date, activities_count)
    VALUES (NEW.user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, date)
    DO UPDATE SET 
      activities_count = daily_usage.activities_count + 1,
      updated_at = now();
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$function$;

-- Update get_user_streak function
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

-- Update calculate_next_review function
CREATE OR REPLACE FUNCTION public.calculate_next_review(current_difficulty integer, performance integer)
 RETURNS timestamp with time zone
 LANGUAGE plpgsql
 SET search_path = ''
AS $function$
DECLARE
  interval_days INTEGER;
BEGIN
  -- Simple spaced repetition algorithm
  CASE performance
    WHEN 1 THEN interval_days := 1; -- Again - review tomorrow
    WHEN 2 THEN interval_days := GREATEST(1, current_difficulty); -- Hard
    WHEN 3 THEN interval_days := GREATEST(current_difficulty * 2, 3); -- Good
    WHEN 4 THEN interval_days := GREATEST(current_difficulty * 3, 7); -- Easy
    WHEN 5 THEN interval_days := GREATEST(current_difficulty * 4, 14); -- Perfect
    ELSE interval_days := 1;
  END CASE;
  
  RETURN NOW() + (interval_days || ' days')::INTERVAL;
END;
$function$;

-- Update get_weekly_study_hours function
CREATE OR REPLACE FUNCTION public.get_weekly_study_hours(user_uuid uuid)
 RETURNS TABLE(day text, hours numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  WITH week_dates AS (
    SELECT 
      generate_series(
        CURRENT_DATE - INTERVAL '6 days',
        CURRENT_DATE,
        INTERVAL '1 day'
      )::DATE as date
  ),
  daily_hours AS (
    SELECT 
      wd.date,
      COALESCE(SUM(ss.duration_minutes), 0) / 60.0 as hours
    FROM week_dates wd
    LEFT JOIN public.study_sessions ss ON 
      ss.user_id = user_uuid 
      AND DATE(ss.started_at) = wd.date
      AND ss.ended_at IS NOT NULL
    GROUP BY wd.date
  )
  SELECT 
    CASE EXTRACT(DOW FROM dh.date)
      WHEN 0 THEN 'Sun'
      WHEN 1 THEN 'Mon'
      WHEN 2 THEN 'Tue'
      WHEN 3 THEN 'Wed'
      WHEN 4 THEN 'Thu'
      WHEN 5 THEN 'Fri'
      WHEN 6 THEN 'Sat'
    END as day,
    ROUND(dh.hours, 1) as hours
  FROM daily_hours dh
  ORDER BY dh.date;
END;
$function$;

-- Update update_flashcard_review function
CREATE OR REPLACE FUNCTION public.update_flashcard_review(flashcard_id uuid, performance integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  current_difficulty INTEGER;
  new_difficulty INTEGER;
  next_review_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current difficulty
  SELECT difficulty INTO current_difficulty 
  FROM public.flashcards 
  WHERE id = flashcard_id AND user_id = auth.uid();
  
  IF current_difficulty IS NULL THEN
    RAISE EXCEPTION 'Flashcard not found or access denied';
  END IF;
  
  -- Calculate new difficulty based on performance
  CASE performance
    WHEN 1 THEN new_difficulty := GREATEST(current_difficulty - 2, 1);
    WHEN 2 THEN new_difficulty := GREATEST(current_difficulty - 1, 1);
    WHEN 3 THEN new_difficulty := current_difficulty;
    WHEN 4 THEN new_difficulty := LEAST(current_difficulty + 1, 10);
    WHEN 5 THEN new_difficulty := LEAST(current_difficulty + 2, 10);
    ELSE new_difficulty := current_difficulty;
  END CASE;
  
  -- Calculate next review date
  next_review_date := public.calculate_next_review(new_difficulty, performance);
  
  -- Update the flashcard
  UPDATE public.flashcards 
  SET 
    difficulty = new_difficulty,
    last_reviewed = NOW(),
    next_review = next_review_date,
    review_count = review_count + 1
  WHERE id = flashcard_id AND user_id = auth.uid();
END;
$function$;

-- Update calculate_exam_duration function
CREATE OR REPLACE FUNCTION public.calculate_exam_duration(exam_uuid uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  start_time TIMESTAMP WITH TIME ZONE;
  end_time TIMESTAMP WITH TIME ZONE;
  duration_minutes INTEGER;
BEGIN
  SELECT started_at, COALESCE(completed_at, now()) 
  INTO start_time, end_time
  FROM public.exams 
  WHERE id = exam_uuid AND user_id = auth.uid();
  
  IF start_time IS NULL THEN
    RETURN 0;
  END IF;
  
  duration_minutes := EXTRACT(EPOCH FROM (end_time - start_time)) / 60;
  RETURN GREATEST(duration_minutes, 0);
END;
$function$;

-- Update calculate_subject_accuracy function
CREATE OR REPLACE FUNCTION public.calculate_subject_accuracy(user_uuid uuid, subject text, exam_board text DEFAULT NULL::text)
 RETURNS numeric
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
DECLARE
  total_questions INTEGER := 0;
  correct_answers INTEGER := 0;
BEGIN
  -- Get accuracy from exam answers
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE ea.is_correct = true)
  INTO total_questions, correct_answers
  FROM public.exam_answers ea
  JOIN public.exam_questions eq ON ea.question_id = eq.id
  JOIN public.exams e ON eq.exam_id = e.id
  WHERE e.user_id = user_uuid 
    AND e.subject_id = subject
    AND (exam_board IS NULL OR e.exam_board = exam_board);
    
  IF total_questions > 0 THEN
    RETURN ROUND((correct_answers::NUMERIC / total_questions) * 100, 1);
  END IF;
  
  RETURN 0;
END;
$function$;

-- Update get_user_performance_summary function
CREATE OR REPLACE FUNCTION public.get_user_performance_summary(user_uuid uuid, days_back integer DEFAULT 30)
 RETURNS TABLE(subject_id text, exam_board text, total_study_minutes numeric, questions_answered integer, accuracy_rate numeric, improvement_trend numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  WITH recent_activity AS (
    SELECT 
      e.subject_id,
      e.exam_board,
      COALESCE(SUM(ss.duration_minutes), 0) as study_minutes,
      COUNT(ea.id) as questions_count,
      public.calculate_subject_accuracy(user_uuid, e.subject_id, e.exam_board) as accuracy
    FROM public.exams e
    LEFT JOIN public.study_sessions ss ON ss.user_id = user_uuid 
      AND DATE(ss.started_at) >= CURRENT_DATE - days_back
    LEFT JOIN public.exam_questions eq ON eq.exam_id = e.id
    LEFT JOIN public.exam_answers ea ON ea.question_id = eq.id
    WHERE e.user_id = user_uuid
      AND e.created_at >= CURRENT_DATE - days_back
    GROUP BY e.subject_id, e.exam_board
  )
  SELECT 
    ra.subject_id,
    ra.exam_board,
    ra.study_minutes,
    ra.questions_count,
    ra.accuracy,
    0::NUMERIC as improvement_trend -- Placeholder for trend calculation
  FROM recent_activity ra
  WHERE ra.study_minutes > 0 OR ra.questions_count > 0;
END;
$function$;

-- Update update_conversation_timestamp function
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  UPDATE public.chat_conversations 
  SET updated_at = now() 
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$function$;

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$function$;