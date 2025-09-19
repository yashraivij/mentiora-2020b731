-- Add some seed users to public_profiles for leaderboard population
INSERT INTO public.public_profiles (user_id, username, display_name, avatar_url, streak_days) VALUES
(gen_random_uuid(), 'alex_chen', 'Alex Chen', null, 14),
(gen_random_uuid(), 'emma_wilson', 'Emma Wilson', null, 12),
(gen_random_uuid(), 'liam_parker', 'Liam Parker', null, 9),
(gen_random_uuid(), 'sophia_lee', 'Sophia Lee', null, 8),
(gen_random_uuid(), 'james_smith', 'James Smith', null, 5),
(gen_random_uuid(), 'maya_patel', 'Maya Patel', null, 4),
(gen_random_uuid(), 'oliver_brown', 'Oliver Brown', null, 3),
(gen_random_uuid(), 'marcus_thompson', 'Marcus Thompson', null, 127),
(gen_random_uuid(), 'sarah_chen', 'Sarah Chen', null, 98),
(gen_random_uuid(), 'david_rodriguez', 'David Rodriguez', null, 85),
(gen_random_uuid(), 'emily_zhang', 'Emily Zhang', null, 72),
(gen_random_uuid(), 'isabella_garcia', 'Isabella Garcia', null, 22),
(gen_random_uuid(), 'noah_johnson', 'Noah Johnson', null, 19),
(gen_random_uuid(), 'ava_williams', 'Ava Williams', null, 16)
ON CONFLICT (user_id) DO NOTHING;

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
    WHEN pp.username = 'emily_zhang' THEN 3124
    WHEN pp.username = 'isabella_garcia' THEN 1654
    WHEN pp.username = 'noah_johnson' THEN 1532
    WHEN pp.username = 'ava_williams' THEN 1423
    ELSE 100
  END
FROM public.public_profiles pp
WHERE pp.username IN ('alex_chen', 'emma_wilson', 'liam_parker', 'sophia_lee', 'james_smith', 'maya_patel', 'oliver_brown', 'marcus_thompson', 'sarah_chen', 'david_rodriguez', 'emily_zhang', 'isabella_garcia', 'noah_johnson', 'ava_williams')
ON CONFLICT (user_id) DO NOTHING;