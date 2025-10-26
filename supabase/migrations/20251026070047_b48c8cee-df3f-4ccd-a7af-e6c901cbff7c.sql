-- Reset all user MP to 0
UPDATE user_points SET total_points = 0, updated_at = NOW();