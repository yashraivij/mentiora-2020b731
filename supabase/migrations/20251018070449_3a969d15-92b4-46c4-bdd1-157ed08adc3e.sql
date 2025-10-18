-- Update predicted grades for user yashraivij2004@gmail.com to be 7 or above

-- Update user_subjects table
UPDATE user_subjects 
SET predicted_grade = '7' 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND predicted_grade IN ('U', '1', '2', '3', '4', '5', '6');

-- Update predicted_exam_completions table
UPDATE predicted_exam_completions 
SET grade = '7' 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND grade IN ('U', '1', '2', '3', '4', '5', '6');