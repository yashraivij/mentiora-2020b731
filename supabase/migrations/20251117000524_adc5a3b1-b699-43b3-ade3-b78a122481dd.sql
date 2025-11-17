-- Add passage_text column to curriculum_questions table to support SAT Reading passages
ALTER TABLE curriculum_questions 
ADD COLUMN passage_text TEXT;