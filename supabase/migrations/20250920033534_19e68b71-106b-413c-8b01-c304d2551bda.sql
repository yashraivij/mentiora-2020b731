-- Allow authenticated users to read profile names for leaderboard functionality
CREATE POLICY "Authenticated users can view profile names for leaderboards" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (true);