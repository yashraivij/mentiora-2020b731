-- Remove all SAT subjects, topics, questions, and related data

-- Step 1: Clean up dependent user data
DELETE FROM daily_topic_mastery WHERE subject_id LIKE 'sat-%';
DELETE FROM predicted_exam_completions WHERE subject_id LIKE 'sat-%';
DELETE FROM user_subjects WHERE subject_id LIKE 'sat-%';

-- Step 2: Clean up SAT-specific profile fields
UPDATE profiles SET 
  sat_confidence_level = NULL,
  sat_exam_date = NULL,
  sat_baseline_score_low = NULL,
  sat_baseline_score_high = NULL,
  sat_predicted_score_low = NULL,
  sat_predicted_score_high = NULL,
  sat_daily_minutes = NULL,
  sat_last_session_date = NULL,
  sat_next_session_date = NULL,
  sat_streak_days = NULL,
  sat_diagnostic_completed = NULL,
  sat_target_score = NULL,
  sat_weak_domains = NULL,
  sat_strength_domains = NULL,
  sat_target_band = NULL
WHERE sat_confidence_level IS NOT NULL 
   OR sat_exam_date IS NOT NULL
   OR sat_baseline_score_low IS NOT NULL
   OR sat_baseline_score_high IS NOT NULL
   OR sat_predicted_score_low IS NOT NULL
   OR sat_predicted_score_high IS NOT NULL
   OR sat_daily_minutes IS NOT NULL
   OR sat_last_session_date IS NOT NULL
   OR sat_next_session_date IS NOT NULL
   OR sat_streak_days IS NOT NULL
   OR sat_diagnostic_completed IS NOT NULL
   OR sat_target_score IS NOT NULL
   OR sat_weak_domains IS NOT NULL
   OR sat_strength_domains IS NOT NULL
   OR sat_target_band IS NOT NULL;

-- Step 3: Remove SAT curriculum data (in correct order due to foreign keys)
DELETE FROM curriculum_questions WHERE topic_id IN (
  SELECT id FROM curriculum_topics WHERE subject_id LIKE 'sat-%'
);

DELETE FROM curriculum_topics WHERE subject_id LIKE 'sat-%';

DELETE FROM curriculum_subjects WHERE id LIKE 'sat-%';

-- Step 4: Drop SAT-specific tables
DROP TABLE IF EXISTS sat_weekly_reviews;
DROP TABLE IF EXISTS sat_session_logs;
DROP TABLE IF EXISTS sat_daily_plans;
DROP TABLE IF EXISTS sat_questions;

-- Step 5: Remove SAT-related profile columns
ALTER TABLE profiles 
  DROP COLUMN IF EXISTS sat_confidence_level,
  DROP COLUMN IF EXISTS sat_exam_date,
  DROP COLUMN IF EXISTS sat_baseline_score_low,
  DROP COLUMN IF EXISTS sat_baseline_score_high,
  DROP COLUMN IF EXISTS sat_predicted_score_low,
  DROP COLUMN IF EXISTS sat_predicted_score_high,
  DROP COLUMN IF EXISTS sat_daily_minutes,
  DROP COLUMN IF EXISTS sat_last_session_date,
  DROP COLUMN IF EXISTS sat_next_session_date,
  DROP COLUMN IF EXISTS sat_streak_days,
  DROP COLUMN IF EXISTS sat_diagnostic_completed,
  DROP COLUMN IF EXISTS sat_target_score,
  DROP COLUMN IF EXISTS sat_weak_domains,
  DROP COLUMN IF EXISTS sat_strength_domains,
  DROP COLUMN IF EXISTS sat_target_band;