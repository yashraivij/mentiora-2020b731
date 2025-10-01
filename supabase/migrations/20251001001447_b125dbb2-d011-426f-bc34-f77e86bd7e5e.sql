-- Restrict access to remaining analytics views to service role only
-- These views expose sensitive user data across all users and should only be accessible by administrators

-- Revoke all existing permissions from weekly_user_analytics
REVOKE ALL ON public.weekly_user_analytics FROM PUBLIC;
REVOKE ALL ON public.weekly_user_analytics FROM authenticated;
REVOKE ALL ON public.weekly_user_analytics FROM anon;

-- Revoke all existing permissions from weekly_login_analytics
REVOKE ALL ON public.weekly_login_analytics FROM PUBLIC;
REVOKE ALL ON public.weekly_login_analytics FROM authenticated;
REVOKE ALL ON public.weekly_login_analytics FROM anon;

-- Grant SELECT only to service_role
GRANT SELECT ON public.weekly_user_analytics TO service_role;
GRANT SELECT ON public.weekly_login_analytics TO service_role;

-- Add comments explaining the security restriction
COMMENT ON VIEW public.weekly_user_analytics IS 'Administrative analytics view. Access restricted to service_role only for admin dashboards.';
COMMENT ON VIEW public.weekly_login_analytics IS 'Administrative analytics view. Access restricted to service_role only for admin dashboards.';