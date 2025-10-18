-- Fix all predicted exam completion grades for user yashraivij2004@gmail.com
-- Convert all decimal and invalid grades to proper integer grades 7 or above

UPDATE predicted_exam_completions 
SET 
  grade = '7',
  percentage = CASE 
    WHEN percentage < 70 THEN 70.0
    ELSE percentage
  END
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND (
  grade::text LIKE '%.%' -- decimal grades like 0.1, 0.3, 0.5
  OR grade::text IN ('0', '1', '2', '3', '4', '5', '6', 'U')
  OR grade = ''
  OR grade IS NULL
);

-- Update any remaining low percentages to match grade 7
UPDATE predicted_exam_completions
SET percentage = 70.0
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09'
AND percentage < 70
AND grade >= '7';