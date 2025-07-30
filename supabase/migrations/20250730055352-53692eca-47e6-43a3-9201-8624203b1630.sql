-- Insert 3 days of streak data for current user
-- This will give the user a 3-day streak

DO $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Get the current authenticated user's ID
    SELECT auth.uid() INTO current_user_id;
    
    -- Only proceed if we have a valid user ID
    IF current_user_id IS NOT NULL THEN
        -- Insert daily usage for today
        INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
        VALUES (current_user_id, CURRENT_DATE, 1, 30)
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
            activities_count = GREATEST(daily_usage.activities_count, 1),
            total_minutes = GREATEST(daily_usage.total_minutes, 30);
        
        -- Insert daily usage for yesterday
        INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
        VALUES (current_user_id, CURRENT_DATE - INTERVAL '1 day', 1, 45)
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
            activities_count = GREATEST(daily_usage.activities_count, 1),
            total_minutes = GREATEST(daily_usage.total_minutes, 45);
        
        -- Insert daily usage for 2 days ago
        INSERT INTO public.daily_usage (user_id, date, activities_count, total_minutes)
        VALUES (current_user_id, CURRENT_DATE - INTERVAL '2 days', 1, 25)
        ON CONFLICT (user_id, date) 
        DO UPDATE SET 
            activities_count = GREATEST(daily_usage.activities_count, 1),
            total_minutes = GREATEST(daily_usage.total_minutes, 25);
    END IF;
END $$;