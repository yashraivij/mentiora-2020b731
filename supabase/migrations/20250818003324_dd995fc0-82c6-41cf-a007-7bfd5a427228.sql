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
        url:='https://mkmrasgbrhwtycwpdtke.supabase.co/functions/v1/refresh-weekly-questions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbXJhc2dicmh3dHljd3BkdGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTMxODQsImV4cCI6MjA2NDU2OTE4NH0.LSWp2Ibx_7S2m-yZM-yVetVUtu9qThDc8YmEeDOYodg"}'::jsonb,
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
        url:='https://mkmrasgbrhwtycwpdtke.supabase.co/functions/v1/refresh-weekly-questions',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbXJhc2dicmh3dHljd3BkdGtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5OTMxODQsImV4cCI6MjA2NDU2OTE4NH0.LSWp2Ibx_7S2m-yZM-yVetVUtu9qThDc8YmEeDOYodg"}'::jsonb,
        body:='{"source": "cron", "timezone": "UK_BST"}'::jsonb
    ) as request_id;
  $$
);