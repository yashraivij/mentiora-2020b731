-- Remove the U grade in English Literature for the specific user
DELETE FROM predicted_exam_completions 
WHERE user_id = (SELECT id FROM profiles WHERE email = 'yashraivij2004@gmail.com') 
AND subject_id = 'english-literature' 
AND grade = 'U';