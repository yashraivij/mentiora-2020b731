-- Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS subscription_status text,
  ADD COLUMN IF NOT EXISTS plan text,
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add email column if missing (handy for webhook matching)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email text;

-- Ensure the existing user has a profile row
INSERT INTO public.profiles (id, email)
VALUES ('3515df04-3f16-4425-b735-bcddd6122e5c', 'yashraivij2004@gmail.com')
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- Backfill the existing paying customer with their Stripe data
UPDATE public.profiles
SET
  stripe_customer_id = 'cus_SxtnAkvNCejyna',
  subscription_status = 'trialing',
  plan = 'price_1S1Y6RCtgl2dlnVOOk1nDlv5',
  current_period_end = to_timestamp(1757200524),
  updated_at = now()
WHERE email = 'yashraivij2004@gmail.com';