-- Insert daily usage records manually for the current user
-- First let's check who is the current user and insert 3 days of streak data

-- Insert daily usage for today (current date)
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT auth.uid(), CURRENT_DATE, 2, 30
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    activities_count = GREATEST(daily_usage.activities_count, 2),
    total_minutes = GREATEST(daily_usage.total_minutes, 30);

-- Insert daily usage for yesterday  
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT auth.uid(), CURRENT_DATE - INTERVAL '1 day', 3, 45
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    activities_count = GREATEST(daily_usage.activities_count, 3),
    total_minutes = GREATEST(daily_usage.total_minutes, 45);

-- Insert daily usage for 2 days ago
INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
SELECT auth.uid(), CURRENT_DATE - INTERVAL '2 days', 1, 25  
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, date) 
DO UPDATE SET 
    activities_count = GREATEST(daily_usage.activities_count, 1),
    total_minutes = GREATEST(daily_usage.total_minutes, 25);