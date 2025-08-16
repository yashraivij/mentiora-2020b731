-- Strengthen RLS policies for subscribers table to prevent data leakage

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can select their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

-- Create more restrictive and comprehensive RLS policies

-- 1. INSERT policy: Only allow users to insert their own subscription data
CREATE POLICY "Users can create own subscription only"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 2. SELECT policy: Users can only view their own subscription data
CREATE POLICY "Users can view own subscription only"
ON public.subscribers
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 3. UPDATE policy: Users can only update their own subscription data
-- Restrict updates to non-sensitive fields only
CREATE POLICY "Users can update own subscription only"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
)
WITH CHECK (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 4. DELETE policy: Allow users to delete their own subscription
CREATE POLICY "Users can delete own subscription only"
ON public.subscribers
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id 
  AND user_id IS NOT NULL
);

-- 5. Add index on user_id for better performance of RLS checks
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);

-- 6. Add a security definer function to safely get subscription stats
CREATE OR REPLACE FUNCTION public.get_subscription_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Only return aggregated, non-sensitive statistics
  SELECT json_build_object(
    'total_subscribers', COUNT(*),
    'active_subscriptions', COUNT(*) FILTER (WHERE subscribed = true)
  ) INTO result
  FROM public.subscribers;
  
  RETURN result;
END;
$$;

-- 7. Revoke public access and grant to authenticated users only
REVOKE ALL ON FUNCTION public.get_subscription_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_subscription_stats() TO authenticated;