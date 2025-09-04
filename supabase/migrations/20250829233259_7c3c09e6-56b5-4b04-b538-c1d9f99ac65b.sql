-- Add subscription columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'free',
ADD COLUMN IF NOT EXISTS plan text,
ADD COLUMN IF NOT EXISTS current_period_end timestamptz;