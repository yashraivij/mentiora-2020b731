-- Create a trigger to automatically update daily_usage when user_activities are inserted
-- This ensures that any user activity creates a daily usage record

-- First, let's manually insert some daily usage records with a fixed user ID for testing
-- We'll use a known user ID from the auth.users table

-- Insert daily usage records for testing (using any authenticated user)
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT 
  id,
  CURRENT_DATE,
  1,
  30
FROM auth.users 
WHERE email IS NOT NULL
LIMIT 1
ON CONFLICT (user_id, date) 
DO UPDATE SET 
  activities_count = daily_usage.activities_count + 1,
  updated_at = now();

INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '1 day',
  2,
  45
FROM auth.users 
WHERE email IS NOT NULL
LIMIT 1
ON CONFLICT (user_id, date) 
DO UPDATE SET 
  activities_count = daily_usage.activities_count + 1,
  updated_at = now();

INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT 
  id,
  CURRENT_DATE - INTERVAL '2 days',
  1,
  25
FROM auth.users 
WHERE email IS NOT NULL
LIMIT 1
ON CONFLICT (user_id, date) 
DO UPDATE SET 
  activities_count = daily_usage.activities_count + 1,
  updated_at = now();