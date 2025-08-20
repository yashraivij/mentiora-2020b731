-- Add premium columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS premium boolean DEFAULT false;