-- Fix critical security issue: Secure the subscribers table
-- Remove the overly permissive service_role_full_access policy and replace with secure policies

DROP POLICY IF EXISTS "service_role_full_access" ON public.subscribers;

-- Create secure policies that only allow users to access their own subscription data
CREATE POLICY "users_can_read_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
FOR UPDATE
USING (user_id = auth.uid() OR email = auth.email())
WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Allow edge functions to manage subscription data (using service role key)
CREATE POLICY "service_role_can_manage_subscriptions" ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');