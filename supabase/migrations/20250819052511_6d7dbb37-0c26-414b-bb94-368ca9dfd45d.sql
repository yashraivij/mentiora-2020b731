-- Add premium field to profiles table
ALTER TABLE public.profiles ADD COLUMN premium BOOLEAN NOT NULL DEFAULT false;