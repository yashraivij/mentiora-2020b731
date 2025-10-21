-- Drop existing restrictive policies on paywall_parent_emails
DROP POLICY IF EXISTS "Users can insert their own paywall parent emails" ON public.paywall_parent_emails;
DROP POLICY IF EXISTS "Users can update their own paywall parent emails" ON public.paywall_parent_emails;
DROP POLICY IF EXISTS "Users can view their own paywall parent emails" ON public.paywall_parent_emails;

-- Create permissive policies (default behavior)
CREATE POLICY "Users can insert their own paywall parent emails"
ON public.paywall_parent_emails
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paywall parent emails"
ON public.paywall_parent_emails
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own paywall parent emails"
ON public.paywall_parent_emails
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);