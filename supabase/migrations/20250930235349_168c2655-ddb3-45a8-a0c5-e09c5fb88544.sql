-- Drop the insecure public SELECT policy that exposes sensitive personal data
DROP POLICY IF EXISTS "Authenticated users can view profile names for leaderboards" ON public.profiles;

-- The existing "Users can view their own profile" policy is sufficient
-- Users can only access their own profile data via: auth.uid() = id