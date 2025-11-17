-- Phase 1: Delete completely broken SAT questions (questions referencing missing content)
-- These are questions that ask about content that doesn't exist in the question text
DELETE FROM curriculum_questions
WHERE id LIKE 'sat-%'
AND (
  -- Questions asking about paragraphs/passages that don't exist
  (question ILIKE '%the paragraph%' AND question NOT LIKE '%:%' AND passage_text IS NULL AND length(question) < 200)
  OR (question ILIKE '%which sentence%' AND passage_text IS NULL AND length(question) < 150)
  OR (question ILIKE '%the passage%' AND passage_text IS NULL AND length(question) < 150)
  -- Questions that are just navigation/metadata
  OR (question ILIKE '%previous question%' OR question ILIKE '%next question%')
  OR (question ILIKE '%refer to%' AND passage_text IS NULL AND length(question) < 100)
);

-- Phase 2: Remove MCQ choices from all remaining SAT questions
-- Convert all MCQ questions to open-ended format by keeping only answer and explanation
UPDATE curriculum_questions
SET marking_criteria = jsonb_build_object(
  'answer', marking_criteria->'answer',
  'explanation', marking_criteria->'explanation'
)
WHERE id LIKE 'sat-%'
AND marking_criteria ? 'choices';