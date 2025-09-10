-- Fix security vulnerability in public_profiles table
-- The current policy allows anyone (including unauthenticated users) to view all public profiles
-- This creates a security risk for user enumeration and data harvesting

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.public_profiles;

-- Create a new policy that requires authentication to view public profiles
-- This prevents anonymous data harvesting while still allowing authenticated users to see public profiles
CREATE POLICY "Authenticated users can view public profiles"
ON public.public_profiles
FOR SELECT
TO authenticated
USING (true);

-- Optional: Add a policy for service role access (for admin functions)
CREATE POLICY "Service role can manage public profiles"
ON public.public_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);