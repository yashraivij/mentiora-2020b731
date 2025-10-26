-- Add emoji profile picture field to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_emoji TEXT DEFAULT '😊';

-- Add comment to describe the column
COMMENT ON COLUMN public.profiles.profile_emoji IS 'User selected emoji as their profile picture';