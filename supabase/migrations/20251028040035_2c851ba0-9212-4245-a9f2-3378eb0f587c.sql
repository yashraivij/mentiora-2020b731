-- Update first_name to show only the first word of display_name
UPDATE public.profiles p
SET first_name = split_part(
  COALESCE(
    u.raw_user_meta_data->>'display_name',
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'name',
    p.full_name
  ),
  ' ',
  1
)
FROM auth.users u
WHERE p.id = u.id 
  AND (
    u.raw_user_meta_data->>'display_name' IS NOT NULL OR
    u.raw_user_meta_data->>'full_name' IS NOT NULL OR
    u.raw_user_meta_data->>'name' IS NOT NULL OR
    p.full_name IS NOT NULL
  );

-- Update the handle_new_user function to extract first word only
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile with first_name set to first word of display_name
  INSERT INTO public.profiles (id, email, subscription_status, first_name)
  VALUES (
    new.id, 
    new.email, 
    'free',
    split_part(new.raw_user_meta_data->>'display_name', ' ', 1)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;