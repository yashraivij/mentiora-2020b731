-- Update profiles table with first_name from auth.users display_name
UPDATE public.profiles p
SET first_name = split_part(u.raw_user_meta_data->>'display_name', ' ', 1)
FROM auth.users u
WHERE p.id = u.id 
  AND u.raw_user_meta_data->>'display_name' IS NOT NULL 
  AND u.raw_user_meta_data->>'display_name' != '';