-- Add SAT target score column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS sat_target_score integer DEFAULT 1300;

-- Add comment for documentation
COMMENT ON COLUMN profiles.sat_target_score IS 'User SAT target score (400-1600 scale)';

-- Create index for performance queries on sat_session_logs
CREATE INDEX IF NOT EXISTS idx_sat_session_logs_user_date 
ON sat_session_logs(user_id, session_date DESC);

CREATE INDEX IF NOT EXISTS idx_sat_session_logs_domain 
ON sat_session_logs(user_id, session_type);