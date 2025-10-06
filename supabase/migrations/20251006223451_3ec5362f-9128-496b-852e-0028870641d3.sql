-- Simplify handle_new_user function to just create profile (remove failing webhook)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email, subscription_status)
  VALUES (new.id, new.email, 'free')
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$function$;