-- Restore original handle_new_user function with webhook
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

  -- Send notification via webhook (original behavior)
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/notify-signup',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'user_id', new.id,
      'email', new.email,
      'name', new.raw_user_meta_data->>'full_name'
    )
  );

  RETURN new;
END;
$function$;