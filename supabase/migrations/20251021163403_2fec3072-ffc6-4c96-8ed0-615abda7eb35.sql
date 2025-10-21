-- Fix RLS policy for paywall_parent_emails to be permissive
DROP POLICY IF EXISTS "Users can insert their own paywall parent emails" ON public.paywall_parent_emails;

CREATE POLICY "Users can insert their own paywall parent emails"
ON public.paywall_parent_emails
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);