-- Add subject_id column to user_subjects table to differentiate between GCSE, A-Level, and IGCSE subjects
ALTER TABLE public.user_subjects 
ADD COLUMN subject_id text;