-- Add parent_email field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN parent_email text;