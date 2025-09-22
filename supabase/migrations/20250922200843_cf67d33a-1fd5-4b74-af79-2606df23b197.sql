-- Remove predicted grades for Geography A (Edexcel), Religious Studies, and English Language
-- for user yashraivij2004@gmail.com (user_id: 051a2daf-160c-4775-b47e-cb3451c13d09)

-- Delete from user_subjects table
DELETE FROM public.user_subjects 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND id = '37fe92e6-85bc-4255-a133-26db1347886d';

-- Delete from predicted_exam_completions table
DELETE FROM public.predicted_exam_completions 
WHERE user_id = '051a2daf-160c-4775-b47e-cb3451c13d09' 
AND id IN (
  '93177b55-5117-488a-8f3a-6d94eb21105e',  -- Geography
  '91f53563-e0e8-43ee-86b5-e8e6bca9b5e3',  -- Religious Studies  
  'e9e6dcf5-e804-4388-94af-dbf175d31c14',  -- English Language (grade 9)
  '65b34853-83d6-4d9b-96e2-ab2c15e04389'   -- English Language (grade U)
);