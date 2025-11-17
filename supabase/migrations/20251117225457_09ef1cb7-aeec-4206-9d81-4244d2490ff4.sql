-- Delete all remaining SAT questions
-- User confirmed: SAT questions don't match GCSE/A-Level format

DELETE FROM curriculum_questions
WHERE id LIKE 'sat-%';