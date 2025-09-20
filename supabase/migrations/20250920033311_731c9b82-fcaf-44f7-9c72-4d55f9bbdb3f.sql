-- Allow authenticated users to view all user points for leaderboard functionality
CREATE POLICY "Authenticated users can view all user points for leaderboards" 
ON public.user_points 
FOR SELECT 
TO authenticated 
USING (true);