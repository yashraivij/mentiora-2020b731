-- Create a secure function to handle custom exam config creation
-- This bypasses RLS issues by running with SECURITY DEFINER privileges
CREATE OR REPLACE FUNCTION public.create_custom_exam_config(
  p_title TEXT,
  p_subject_id TEXT,
  p_exam_board TEXT,
  p_selected_topics TEXT[],
  p_timer_minutes INTEGER,
  p_difficulty_filter TEXT,
  p_target_marks INTEGER,
  p_question_count INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_config_id UUID;
BEGIN
  -- Get the authenticated user ID
  v_user_id := auth.uid();
  
  -- Security check: ensure user is authenticated
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Validate required fields
  IF p_title IS NULL OR p_title = '' THEN
    RAISE EXCEPTION 'Title is required';
  END IF;
  
  IF p_subject_id IS NULL OR p_subject_id = '' THEN
    RAISE EXCEPTION 'Subject is required';
  END IF;
  
  -- Insert the config
  INSERT INTO public.custom_exam_configs (
    user_id,
    title,
    subject_id,
    exam_board,
    selected_topics,
    timer_minutes,
    difficulty_filter,
    target_marks,
    question_count
  )
  VALUES (
    v_user_id,
    p_title,
    p_subject_id,
    p_exam_board,
    p_selected_topics,
    p_timer_minutes,
    p_difficulty_filter,
    p_target_marks,
    p_question_count
  )
  RETURNING id INTO v_config_id;
  
  RETURN v_config_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.create_custom_exam_config TO authenticated;