
-- Ensure the profiles table has the email field and is properly set up
-- (This table already exists based on your schema, but let's make sure it captures emails)

-- Update the handle_new_user function to ensure emails are captured
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO UPDATE SET
    email = NEW.email,
    full_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create a view to easily see user login information
CREATE OR REPLACE VIEW public.user_login_info AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.created_at as profile_created,
  au.created_at as auth_created,
  au.last_sign_in_at,
  au.email_confirmed_at,
  au.confirmed_at
FROM public.profiles p
JOIN auth.users au ON p.id = au.id
ORDER BY au.created_at DESC;

-- Grant permissions to view this information
GRANT SELECT ON public.user_login_info TO authenticated;
GRANT SELECT ON public.user_login_info TO service_role;
