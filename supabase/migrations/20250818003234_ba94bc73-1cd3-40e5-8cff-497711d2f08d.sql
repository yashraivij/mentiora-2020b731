-- Enable pg_cron and pg_net extensions for scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create cron job to refresh predicted 2026 questions every Monday at 12:01am UK time
-- Note: Using UTC time (00:01 Monday = 12:01am UK time during GMT, 23:01 Sunday during BST)
-- This is set for GMT time (UK winter time)
SELECT cron.schedule(
  'refresh-weekly-questions-monday',
  '1 0 * * 1', -- Every Monday at 00:01 UTC (12:01am UK time during GMT)
  $$
  SELECT
    net.http_post(
        url:='https://vutosrczvznqczwbpcla.supabase.co/functions/v1/refresh-weekly-questions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dG9zcmN6dnpucWN6d2JwY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTk0OTIsImV4cCI6MjA0ODg5NTQ5Mn0.j4DKflXJJ5LM_D7S2qMrZWsUmZ-cQ4VE9UEqKG5bCdM"}'::jsonb,
        body:='{"source": "cron", "timezone": "UK"}'::jsonb
    ) as request_id;
  $$
);

-- Also create a cron job for BST (British Summer Time) when UK is UTC+1
-- This runs at 23:01 Sunday UTC (which is 12:01am Monday UK time during BST)
SELECT cron.schedule(
  'refresh-weekly-questions-monday-bst',
  '1 23 * * 0', -- Every Sunday at 23:01 UTC (12:01am Monday UK time during BST)
  $$
  SELECT
    net.http_post(
        url:='https://vutosrczvznqczwbpcla.supabase.co/functions/v1/refresh-weekly-questions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1dG9zcmN6dnpucWN6d2JwY2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzMTk0OTIsImV4cCI6MjA0ODg5NTQ5Mn0.j4DKflXJJ5LM_D7S2qMrZWsUmZ-cQ4VE9UEqKG5bCdM"}'::jsonb,
        body:='{"source": "cron", "timezone": "UK_BST"}'::jsonb
    ) as request_id;
  $$
);

-- Create a table to track question refresh history
CREATE TABLE IF NOT EXISTS public.question_refresh_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  refresh_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  questions_updated INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  execution_time_ms INTEGER,
  status TEXT DEFAULT 'pending',
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the log table
ALTER TABLE public.question_refresh_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role to insert/update logs
CREATE POLICY "Allow service role full access to refresh logs"
ON public.question_refresh_log
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);