-- Add unique constraint on username to prevent duplicates
ALTER TABLE public.public_profiles ADD CONSTRAINT unique_username UNIQUE (username);

-- Insert seed users (avoiding duplicates by checking if they exist)
DO $$
BEGIN
  -- Insert seed users one by one with existence checks
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'alex_chen') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'alex_chen', 'Alex Chen', 14);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'emma_wilson') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'emma_wilson', 'Emma Wilson', 12);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'liam_parker') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'liam_parker', 'Liam Parker', 9);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'sophia_lee') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'sophia_lee', 'Sophia Lee', 8);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'james_smith') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'james_smith', 'James Smith', 5);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'maya_patel') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'maya_patel', 'Maya Patel', 4);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'oliver_brown') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'oliver_brown', 'Oliver Brown', 3);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'marcus_thompson') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'marcus_thompson', 'Marcus Thompson', 127);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'sarah_chen') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'sarah_chen', 'Sarah Chen', 98);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM public.public_profiles WHERE username = 'david_rodriguez') THEN
    INSERT INTO public.public_profiles (user_id, username, display_name, streak_days) 
    VALUES (gen_random_uuid(), 'david_rodriguez', 'David Rodriguez', 85);
  END IF;
END $$;

-- Add corresponding points for these users
INSERT INTO public.user_points (user_id, total_points) 
SELECT pp.user_id, 
  CASE 
    WHEN pp.username = 'alex_chen' THEN 247
    WHEN pp.username = 'emma_wilson' THEN 215
    WHEN pp.username = 'liam_parker' THEN 188
    WHEN pp.username = 'sophia_lee' THEN 164
    WHEN pp.username = 'james_smith' THEN 142
    WHEN pp.username = 'maya_patel' THEN 127
    WHEN pp.username = 'oliver_brown' THEN 108
    WHEN pp.username = 'marcus_thompson' THEN 4247
    WHEN pp.username = 'sarah_chen' THEN 3815
    WHEN pp.username = 'david_rodriguez' THEN 3456
    ELSE 100
  END
FROM public.public_profiles pp
WHERE pp.username IN ('alex_chen', 'emma_wilson', 'liam_parker', 'sophia_lee', 'james_smith', 'maya_patel', 'oliver_brown', 'marcus_thompson', 'sarah_chen', 'david_rodriguez')
  AND NOT EXISTS (SELECT 1 FROM public.user_points up WHERE up.user_id = pp.user_id);