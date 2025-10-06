
-- Update the handle_new_user function to call our edge function in the background
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Create profile (this must succeed)
  INSERT INTO public.profiles (id, email, subscription_status)
  VALUES (new.id, new.email, 'free')
  ON CONFLICT (id) DO NOTHING;
  
  -- Send signup notification asynchronously (non-blocking)
  -- Using pg_net to make HTTP request in background
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-signup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'user_id', new.id,
      'email', new.email,
      'created_at', new.created_at
    )
  );
  
  RETURN new;
END;
$$;
