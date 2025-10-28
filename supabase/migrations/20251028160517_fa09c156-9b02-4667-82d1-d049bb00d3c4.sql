-- Backfill first_name for all existing users where it's NULL
UPDATE public.profiles
SET first_name = split_part(full_name, ' ', 1)
WHERE first_name IS NULL 
  AND full_name IS NOT NULL 
  AND full_name != '';

-- For users without full_name, try to get it from auth.users metadata
UPDATE public.profiles p
SET first_name = split_part(
  COALESCE(
    (SELECT au.raw_user_meta_data->>'display_name' FROM auth.users au WHERE au.id = p.id),
    (SELECT au.raw_user_meta_data->>'full_name' FROM auth.users au WHERE au.id = p.id),
    (SELECT au.raw_user_meta_data->>'name' FROM auth.users au WHERE au.id = p.id)
  ), ' ', 1)
WHERE first_name IS NULL;