-- Comprehensive fix to ensure analytics views are completely locked down
-- Remove all possible default grants and ensure only service_role has access

-- First, ensure schema grants don't allow access
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon;

-- Specifically revoke from the views again to be certain
REVOKE ALL ON public.user_activity_analytics FROM PUBLIC, authenticated, anon;
REVOKE ALL ON public.user_login_summary FROM PUBLIC, authenticated, anon;
REVOKE ALL ON public.weekly_user_analytics FROM PUBLIC, authenticated, anon;
REVOKE ALL ON public.weekly_login_analytics FROM PUBLIC, authenticated, anon;

-- Remove any default privileges that might have been set
ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM PUBLIC, authenticated, anon;

-- Now grant back the necessary permissions to tables (not views) for authenticated users
-- This allows normal operations while keeping analytics views restricted
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;

-- Explicitly keep analytics views restricted to service_role only
REVOKE ALL ON public.user_activity_analytics FROM authenticated;
REVOKE ALL ON public.user_login_summary FROM authenticated;
REVOKE ALL ON public.weekly_user_analytics FROM authenticated;
REVOKE ALL ON public.weekly_login_analytics FROM authenticated;

-- Grant to service_role only
GRANT SELECT ON public.user_activity_analytics TO service_role;
GRANT SELECT ON public.user_login_summary TO service_role;
GRANT SELECT ON public.weekly_user_analytics TO service_role;
GRANT SELECT ON public.weekly_login_analytics TO service_role;