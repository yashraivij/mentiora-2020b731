-- Allow authenticated users to view basic profile info for leaderboard
CREATE POLICY "Authenticated users can view public profile info for leaderboard"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);