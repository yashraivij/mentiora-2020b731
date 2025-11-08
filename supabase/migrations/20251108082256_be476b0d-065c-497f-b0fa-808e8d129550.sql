-- Fix RLS policies for user_progress table
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

CREATE POLICY "Users can view own progress"
  ON public.user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Fix RLS policies for user_activities table
DROP POLICY IF EXISTS "Users can view own activities" ON public.user_activities;
DROP POLICY IF EXISTS "Users can insert own activities" ON public.user_activities;

CREATE POLICY "Users can view own activities"
  ON public.user_activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON public.user_activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure exams table has proper policies
DROP POLICY IF EXISTS "Users can view own exams" ON public.exams;
DROP POLICY IF EXISTS "Users can insert own exams" ON public.exams;
DROP POLICY IF EXISTS "Users can update own exams" ON public.exams;

CREATE POLICY "Users can view own exams"
  ON public.exams
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exams"
  ON public.exams
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exams"
  ON public.exams
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Ensure exam_answers has proper policies (linked through exam_questions -> exams)
DROP POLICY IF EXISTS "Users can view own exam answers" ON public.exam_answers;
DROP POLICY IF EXISTS "Users can insert own exam answers" ON public.exam_answers;
DROP POLICY IF EXISTS "Users can update own exam answers" ON public.exam_answers;

CREATE POLICY "Users can view own exam answers"
  ON public.exam_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.exam_questions eq
      JOIN public.exams e ON e.id = eq.exam_id
      WHERE eq.id = exam_answers.question_id
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own exam answers"
  ON public.exam_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exam_questions eq
      JOIN public.exams e ON e.id = eq.exam_id
      WHERE eq.id = question_id
      AND e.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own exam answers"
  ON public.exam_answers
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.exam_questions eq
      JOIN public.exams e ON e.id = eq.exam_id
      WHERE eq.id = exam_answers.question_id
      AND e.user_id = auth.uid()
    )
  );

-- Ensure predicted_exam_completions has proper policies
DROP POLICY IF EXISTS "Users can view own predictions" ON public.predicted_exam_completions;
DROP POLICY IF EXISTS "Users can insert own predictions" ON public.predicted_exam_completions;
DROP POLICY IF EXISTS "Users can update own predictions" ON public.predicted_exam_completions;

CREATE POLICY "Users can view own predictions"
  ON public.predicted_exam_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON public.predicted_exam_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions"
  ON public.predicted_exam_completions
  FOR UPDATE
  USING (auth.uid() = user_id);