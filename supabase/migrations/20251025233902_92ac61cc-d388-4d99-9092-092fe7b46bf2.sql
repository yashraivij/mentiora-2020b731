-- Drop existing policies for subject_daily_tasks
DROP POLICY IF EXISTS "Users can create their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can view their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can update their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can delete their own subject tasks" ON public.subject_daily_tasks;

-- Recreate policies specifically for authenticated users
CREATE POLICY "Users can create their own subject tasks"
ON public.subject_daily_tasks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own subject tasks"
ON public.subject_daily_tasks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subject tasks"
ON public.subject_daily_tasks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own subject tasks"
ON public.subject_daily_tasks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);