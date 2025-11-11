-- Add selected_tutor_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS selected_tutor_id TEXT DEFAULT 'miss_patel';

COMMENT ON COLUMN public.profiles.selected_tutor_id IS 'ID of the tutor selected by the user during onboarding';