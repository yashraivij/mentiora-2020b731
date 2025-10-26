-- Grant proper permissions to authenticated users for subject_daily_tasks
GRANT ALL ON public.subject_daily_tasks TO authenticated;
GRANT ALL ON public.subject_daily_tasks TO service_role;

-- Ensure RLS is enabled
ALTER TABLE public.subject_daily_tasks ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies with proper grants
DROP POLICY IF EXISTS "Users can create their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can view their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can update their own subject tasks" ON public.subject_daily_tasks;
DROP POLICY IF EXISTS "Users can delete their own subject tasks" ON public.subject_daily_tasks;

-- Create policies for authenticated users
CREATE POLICY "Users can create their own subject tasks"
ON public.subject_daily_tasks
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view their own subject tasks"
ON public.subject_daily_tasks
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subject tasks"
ON public.subject_daily_tasks
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own subject tasks"
ON public.subject_daily_tasks
FOR DELETE
TO authenticated
USING (user_id = auth.uid());