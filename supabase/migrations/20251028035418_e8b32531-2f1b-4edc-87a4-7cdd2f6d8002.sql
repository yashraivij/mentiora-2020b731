-- Check and update first_name from various possible name fields in auth metadata
UPDATE public.profiles p
SET first_name = COALESCE(
  split_part(u.raw_user_meta_data->>'display_name', ' ', 1),
  split_part(u.raw_user_meta_data->>'full_name', ' ', 1),
  split_part(u.raw_user_meta_data->>'name', ' ', 1),
  split_part(p.full_name, ' ', 1)
)
FROM auth.users u
WHERE p.id = u.id 
  AND p.first_name IS NULL
  AND (
    u.raw_user_meta_data->>'display_name' IS NOT NULL OR
    u.raw_user_meta_data->>'full_name' IS NOT NULL OR
    u.raw_user_meta_data->>'name' IS NOT NULL OR
    p.full_name IS NOT NULL
  );