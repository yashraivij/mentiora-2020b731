-- Allow authenticated users to view all user points for leaderboard functionality
CREATE POLICY "Leaderboard access for authenticated users" 
ON public.user_points 
FOR SELECT 
TO authenticated 
USING (true);