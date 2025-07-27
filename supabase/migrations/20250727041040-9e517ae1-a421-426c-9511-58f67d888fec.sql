-- Add username field to profiles table for 14-day streak reward
ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;

-- Create public_profiles table to show usernames publicly for streak recognition
CREATE TABLE public.public_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  avatar_url TEXT,
  display_name TEXT,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on public_profiles
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for public_profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.public_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own public profile" 
ON public.public_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own public profile" 
ON public.public_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own public profile" 
ON public.public_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_public_profiles_updated_at
BEFORE UPDATE ON public.public_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();