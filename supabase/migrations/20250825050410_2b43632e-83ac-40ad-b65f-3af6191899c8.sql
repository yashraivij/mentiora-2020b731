-- Add subscription_id column to subscribers table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'subscribers' AND column_name = 'subscription_id') THEN
        ALTER TABLE public.subscribers ADD COLUMN subscription_id TEXT;
    END IF;
END $$;