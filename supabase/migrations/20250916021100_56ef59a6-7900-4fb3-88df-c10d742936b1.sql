-- First, clear existing predicted exam completions for this user
DELETE FROM predicted_exam_completions 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'yashraivij2004@gmail.com');

-- Insert exactly 9 subjects with grade 9
DO $$
DECLARE
    user_uuid UUID;
    subjects TEXT[] := ARRAY[
        'Mathematics', 
        'English Language', 
        'English Literature', 
        'Science - Biology', 
        'Science - Chemistry', 
        'Science - Physics', 
        'History', 
        'Geography', 
        'Computer Science'
    ];
    subject_name TEXT;
BEGIN
    -- Get the user ID
    SELECT id INTO user_uuid FROM profiles WHERE email = 'yashraivij2004@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Insert exactly 9 subjects with grade 9
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
            );
        END LOOP;
    END IF;
END $$;