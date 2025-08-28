-- Reset all accounts to free tier
UPDATE public.profiled 
SET premium = false, is_premium = false
WHERE premium = true OR is_premium = true;

UPDATE public.subscribers 
SET subscribed = false, is_premium = false, subscription_end = NULL
WHERE subscribed = true OR is_premium = true;