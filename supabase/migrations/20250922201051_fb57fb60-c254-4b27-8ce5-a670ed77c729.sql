-- Remove remaining Geography records for user yashraivij2004@gmail.com 
-- (user_id: 051a2daf-160c-4775-b47e-cb3451c13d09)

-- Delete remaining Geography subject from user_subjects
DELETE FROM public.user_subjects 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND id = '93784fb4-a69e-4244-9360-297d9feee4ae';

-- Delete remaining Geography exam completion from predicted_exam_completions
DELETE FROM public.predicted_exam_completions 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND id = '29a86435-ad32-4787-afb3-7b97794d444d';