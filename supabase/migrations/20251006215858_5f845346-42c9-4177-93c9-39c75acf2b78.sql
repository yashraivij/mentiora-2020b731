
-- Fix handle_new_user to only create profile (email notification optional)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile (this is the critical part)
  INSERT INTO public.profiles (id, email, subscription_status)
  VALUES (new.id, new.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  
  -- Return immediately - email notification will be handled separately if needed
  RETURN new;
END;
$$;
