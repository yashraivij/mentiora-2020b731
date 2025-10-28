-- Update the handle_new_user function to also set first_name from display_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile with first_name extracted from display_name
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

-- Backfill existing profiles with first_name from auth display_name
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, raw_user_meta_data->>'display_name' as display_name
    FROM auth.users
    WHERE raw_user_meta_data->>'display_name' IS NOT NULL
  LOOP
    UPDATE public.profiles
    SET first_name = split_part(user_record.display_name, ' ', 1)
    WHERE id = user_record.id AND first_name IS NULL;
  END LOOP;
END $$;