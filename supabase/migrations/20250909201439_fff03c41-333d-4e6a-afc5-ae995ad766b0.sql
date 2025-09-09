-- Fix delete_user_account function to handle text user_id in weak_topics table
CREATE OR REPLACE FUNCTION public.delete_user_account(user_id_to_delete uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete from all tables that reference the user
  DELETE FROM public.user_activities WHERE user_id = user_id_to_delete;
  DELETE FROM public.streak_celebrations_viewed WHERE user_id = user_id_to_delete;
  DELETE FROM public.subject_performance WHERE user_id = user_id_to_delete;
  DELETE FROM public.daily_topic_mastery WHERE user_id = user_id_to_delete;
  DELETE FROM public.session_analytics WHERE user_id = user_id_to_delete;
  DELETE FROM public.performance_summaries WHERE user_id = user_id_to_delete;
  DELETE FROM public.predicted_exam_completions WHERE user_id = user_id_to_delete;
  DELETE FROM public.exams WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_subjects WHERE user_id = user_id_to_delete;
  DELETE FROM public.study_sessions WHERE user_id = user_id_to_delete;
  DELETE FROM public.quizzes WHERE user_id = user_id_to_delete;
  DELETE FROM public.documents WHERE user_id = user_id_to_delete;
  DELETE FROM public.flashcards WHERE user_id = user_id_to_delete;
  DELETE FROM public.materials WHERE user_id = user_id_to_delete;
  DELETE FROM public.chat_conversations WHERE user_id = user_id_to_delete;
  -- Handle weak_topics table which has user_id as text
  DELETE FROM public.weak_topics WHERE user_id = user_id_to_delete::text;
  DELETE FROM public.notebook_entries WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_achievements WHERE user_id = user_id_to_delete;
  DELETE FROM public.daily_usage WHERE user_id = user_id_to_delete;
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  DELETE FROM public.public_profiles WHERE user_id = user_id_to_delete;
  DELETE FROM public.subscribers WHERE user_id = user_id_to_delete;
  DELETE FROM public.user_goals WHERE user_id = user_id_to_delete;
  
  -- Finally delete the auth user (this will cascade to other auth-related tables)
  DELETE FROM auth.users WHERE id = user_id_to_delete;
END;
$function$