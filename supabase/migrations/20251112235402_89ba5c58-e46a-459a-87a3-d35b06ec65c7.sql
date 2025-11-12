-- Phase 1 (Corrected): Clean up empty records from Supabase
-- Delete empty biology subject (has 0 topics)
DELETE FROM public.curriculum_subjects 
WHERE id = 'biology';

-- Delete 9 empty topics (have 0 questions)
DELETE FROM public.curriculum_topics 
WHERE id IN (
  'c2-bonding-structure',
  'c3-quantitative-chemistry', 
  'c7-organic-chemistry',
  'celebrity-culture',
  'chemical-changes',
  'g10-river-landscapes',
  'g8-uk-physical-landscapes',
  'g9-coastal-landscapes',
  'p8-space-physics'
);