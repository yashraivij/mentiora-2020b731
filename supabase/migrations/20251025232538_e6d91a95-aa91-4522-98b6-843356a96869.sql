-- Fix the INSERT policy for subject_daily_tasks to allow users to insert their own tasks
DROP POLICY IF EXISTS "Users can create their own subject tasks" ON subject_daily_tasks;

CREATE POLICY "Users can create their own subject tasks"
ON subject_daily_tasks
FOR INSERT
WITH CHECK (auth.uid() = user_id);