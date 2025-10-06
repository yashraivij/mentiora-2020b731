
-- Drop the problematic webhook trigger that's blocking signups
DROP TRIGGER IF EXISTS tr_notify_new_user ON auth.users;

-- Drop the function if it's no longer needed
DROP FUNCTION IF EXISTS public.notify_new_user();
