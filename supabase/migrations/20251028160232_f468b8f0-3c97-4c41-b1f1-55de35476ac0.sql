-- Fix handle_new_user function to check for full_name and name fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile with first_name set to first word of any name field
  INSERT INTO public.profiles (id, email, subscription_status, first_name)
  VALUES (
    new.id, 
    new.email, 
    'free',
    split_part(
      COALESCE(
        new.raw_user_meta_data->>'display_name',
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name'
      ), ' ', 1)
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;