-- Restrict access to analytics views to service role only
-- These views expose sensitive user data across all users and should only be accessible by administrators

-- Revoke all existing permissions
REVOKE ALL ON public.user_activity_analytics FROM PUBLIC;
REVOKE ALL ON public.user_activity_analytics FROM authenticated;
REVOKE ALL ON public.user_activity_analytics FROM anon;

REVOKE ALL ON public.user_login_summary FROM PUBLIC;
REVOKE ALL ON public.user_login_summary FROM authenticated;
REVOKE ALL ON public.user_login_summary FROM anon;

-- Grant SELECT only to service_role
GRANT SELECT ON public.user_activity_analytics TO service_role;
GRANT SELECT ON public.user_login_summary TO service_role;

-- Add comments explaining the security restriction
COMMENT ON VIEW public.user_activity_analytics IS 'Administrative analytics view. Access restricted to service_role only for admin dashboards.';
COMMENT ON VIEW public.user_login_summary IS 'Administrative analytics view. Access restricted to service_role only for admin dashboards.';