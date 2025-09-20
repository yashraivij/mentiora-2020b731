-- Update Religious Studies predicted grade to reflect actual poor performance
UPDATE predicted_exam_completions 
SET 
  grade = '1',
  percentage = 10.00,
  achieved_marks = 1,
  results = '[{"questionId": "religious-studies-prediction-q1", "marks": 1, "totalMarks": 10, "feedback": "Based on actual practice performance: 10%"}]'::jsonb,
  updated_at = NOW()
WHERE user_id = '01012a2d-0244-45f1-98e1-d1f5096b473f' 
  AND subject_id = 'religious-studies' 
  AND id = '6c8198d4-5677-49ba-a95d-2de821dd69ad';