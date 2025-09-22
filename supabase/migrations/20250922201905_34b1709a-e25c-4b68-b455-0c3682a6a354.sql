-- Final cleanup: Remove any remaining Geography references for user yashraivij2004@gmail.com
-- (user_id: 051a2daf-160c-4775-b47e-cb3451c13d09)

-- Remove from all possible tables
DELETE FROM public.user_subjects 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND (subject_name ILIKE '%geography%' OR subject_name ILIKE '%Geography%');

DELETE FROM public.predicted_exam_completions 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND (subject_id ILIKE '%geography%' OR subject_id ILIKE '%Geography%');

DELETE FROM public.subject_performance 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND (subject_id ILIKE '%geography%' OR subject_id ILIKE '%Geography%');

DELETE FROM public.exams 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND (subject_id ILIKE '%geography%' OR subject_id ILIKE '%Geography%');

-- Remove Geography from performance summaries subjects_studied array
UPDATE public.performance_summaries 
SET subjects_studied = array_remove(subjects_studied, 'Geography A (Edexcel)')
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND 'Geography A (Edexcel)' = ANY(subjects_studied);