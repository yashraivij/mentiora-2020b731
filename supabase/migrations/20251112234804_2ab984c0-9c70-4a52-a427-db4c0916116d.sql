-- Phase 1: Clean up empty records from Supabase
-- Delete empty subject
DELETE FROM public.curriculum_subjects WHERE id = 'biology' AND name = '';

-- Delete empty topics (9 topics with no questions)
DELETE FROM public.curriculum_topics WHERE id IN (
  'c2-bonding-structure',
  'c3-quantitative-chemistry', 
  'c7-organic-chemistry',
  'celebrity-culture',
  'chemical-changes',
  'g10-river-landscapes',
  'g8-uk-physical-landscapes',
  'g9-coastal-landscapes',
  'p8-space-physics'
) AND name = '';