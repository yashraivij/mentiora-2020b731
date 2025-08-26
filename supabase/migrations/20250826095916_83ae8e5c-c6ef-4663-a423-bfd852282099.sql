-- Fix critical security issue: Remove the overly permissive service_role_full_access policy
DROP POLICY IF EXISTS "service_role_full_access" ON public.subscribers;

-- Allow edge functions to manage subscription data (using service role key)
CREATE POLICY "service_role_can_manage_subscriptions" ON public.subscribers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');