-- Fix search path for the handle_new_user function
create or replace function public.handle_new_user()
returns trigger
language plpgsql 
security definer 
set search_path = public
as $$
begin
  insert into public.profiles (id, email, subscription_status)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end; $$;