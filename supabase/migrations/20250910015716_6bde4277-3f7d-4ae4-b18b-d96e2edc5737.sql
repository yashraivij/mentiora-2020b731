-- CRITICAL SECURITY FIX: Remove email-based access to subscribers table
-- The current policies allow access via email match which creates a security vulnerability
-- This could allow hackers to access payment and subscription data inappropriately

-- Drop all existing vulnerable policies
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "users_can_insert_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "users_can_update_own_subscription" ON public.subscribers;

-- Create secure policies that ONLY use user_id for access control
-- This ensures users can only access their own subscription data

CREATE POLICY "Users can view their own subscription data"
ON public.subscribers
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription data"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription data"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Keep service role access for Stripe webhooks and admin functions
-- The service_role_can_manage_subscriptions policy is already secure