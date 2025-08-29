create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  stripe_customer_id text,
  subscription_status text default 'free',
  plan text,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.profiles (id, email, subscription_status)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;

create policy "read own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);