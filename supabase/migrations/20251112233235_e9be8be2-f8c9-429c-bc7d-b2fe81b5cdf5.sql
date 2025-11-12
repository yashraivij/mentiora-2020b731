-- Grant SELECT permission to anon and authenticated roles on curriculum tables
GRANT SELECT ON public.curriculum_subjects TO anon, authenticated;
GRANT SELECT ON public.curriculum_topics TO anon, authenticated;
GRANT SELECT ON public.curriculum_questions TO anon, authenticated;