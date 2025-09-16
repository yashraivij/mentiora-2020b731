-- Update user account to premium status
UPDATE profiles 
SET subscription_status = 'active' 
WHERE email = 'yashraivij2004@gmail.com';

-- Update all predicted exam completions to grade 9 for this user
UPDATE predicted_exam_completions 
SET grade = '9'
WHERE user_id = (SELECT id FROM profiles WHERE email = 'yashraivij2004@gmail.com');

-- If there are no existing predicted exam completions, insert some for common subjects
DO $$
DECLARE
    user_uuid UUID;
    subjects TEXT[] := ARRAY['Mathematics', 'English Language', 'English Literature', 'Science - Biology', 'Science - Chemistry', 'Science - Physics', 'History', 'Geography', 'Computer Science'];
    subject_name TEXT;
BEGIN
    -- Get the user ID
    SELECT id INTO user_uuid FROM profiles WHERE email = 'yashraivij2004@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Check if user has any predicted exam completions
        IF NOT EXISTS (SELECT 1 FROM predicted_exam_completions WHERE user_id = user_uuid) THEN
            -- Insert predicted grades for common subjects
            FOREACH subject_name IN ARRAY subjects
            LOOP
                INSERT INTO predicted_exam_completions (
                    user_id, 
                    subject_id, 
                    grade, 
                    exam_date, 
                    total_marks, 
                    achieved_marks, 
                    percentage, 
                    time_taken_seconds, 
                    results, 
                    questions, 
                    answers
                )
                VALUES (
                    user_uuid, 
                    subject_name, 
                    '9', 
                    CURRENT_DATE, 
                    100, 
                    90, 
                    90.0, 
                    3600, 
                    '{}', 
                    '[]', 
                    '[]'
                )
                ON CONFLICT DO NOTHING;
            END LOOP;
        END IF;
    END IF;
END $$;