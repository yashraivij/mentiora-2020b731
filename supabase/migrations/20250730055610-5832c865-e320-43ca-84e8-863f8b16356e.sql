-- Direct insert approach for streak data
-- Get the current user ID and insert records

WITH user_data AS (
  SELECT auth.uid() as user_id
)
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes, created_at, updated_at)
SELECT 
  u.user_id,
  CURRENT_DATE,
  5,
  60,
  NOW(),
  NOW()
FROM user_data u
WHERE u.user_id IS NOT NULL
ON CONFLICT (user_id, date) DO UPDATE SET
  activities_count = EXCLUDED.activities_count,
  total_minutes = EXCLUDED.total_minutes,
  updated_at = NOW();

WITH user_data AS (
  SELECT auth.uid() as user_id  
)
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes, created_at, updated_at)
SELECT 
  u.user_id,
  CURRENT_DATE - INTERVAL '1 day',
  3,
  45,
  NOW(),
  NOW()
FROM user_data u
WHERE u.user_id IS NOT NULL
ON CONFLICT (user_id, date) DO UPDATE SET
  activities_count = EXCLUDED.activities_count,
  total_minutes = EXCLUDED.total_minutes,
  updated_at = NOW();

WITH user_data AS (
  SELECT auth.uid() as user_id
)
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes, created_at, updated_at)
SELECT 
  u.user_id,
  CURRENT_DATE - INTERVAL '2 days',
  2,
  30,
  NOW(),
  NOW()
FROM user_data u  
WHERE u.user_id IS NOT NULL
ON CONFLICT (user_id, date) DO UPDATE SET
  activities_count = EXCLUDED.activities_count,
  total_minutes = EXCLUDED.total_minutes,
  updated_at = NOW();