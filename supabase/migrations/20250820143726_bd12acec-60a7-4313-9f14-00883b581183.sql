-- Fix RLS policies for subscribers table to allow webhooks while maintaining security

-- Drop existing policies
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;

-- Allow service role (webhooks) to insert and update any subscription record
CREATE POLICY "service_role_full_access" ON public.subscribers
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Allow users to insert their own subscription records (for edge functions)
CREATE POLICY "users_can_insert_own_subscription" ON public.subscribers
  FOR INSERT
  WITH CHECK (user_id = auth.uid() OR email = auth.email());

-- Allow users to update only their own subscription records
CREATE POLICY "users_can_update_own_subscription" ON public.subscribers
  FOR UPDATE
  USING (user_id = auth.uid() OR email = auth.email())
  WITH CHECK (user_id = auth.uid() OR email = auth.email());