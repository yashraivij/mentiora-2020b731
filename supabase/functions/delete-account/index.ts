import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Get the user from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header found');
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify the JWT token to get user info
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      console.log('Invalid user or token:', userError);
      return new Response(
        JSON.stringify({ error: 'Invalid user or token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Starting account deletion for user: ${user.id}`);

    // List all tables that contain user data that need to be deleted
    const tablesToClean = [
      'profiles',
      'user_subjects', 
      'user_goals',
      'user_activities',
      'user_achievements',
      'daily_usage',
      'study_sessions',
      'subject_performance',
      'performance_summaries',
      'session_analytics',
      'exams',
      'exam_questions', // Will be cleaned by cascade
      'exam_answers', // Will be cleaned by cascade
      'quizzes',
      'flashcards',
      'materials',
      'documents',
      'document_chunks', // Will be cleaned by cascade
      'notebook_entries',
      'chat_conversations',
      'chat_messages', // Will be cleaned by cascade
      'weak_topics',
      'daily_topic_mastery',
      'predicted_exam_completions',
      'streak_celebrations_viewed',
      'public_profiles',
      'subscribers'
    ];

    console.log(`Cleaning ${tablesToClean.length} tables for user ${user.id}`);

    // Delete user data from each table
    for (const table of tablesToClean) {
      try {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows found" which is fine
          console.error(`Error cleaning table ${table}:`, error);
          // Continue with other tables even if one fails
        } else {
          console.log(`Successfully cleaned table: ${table}`);
        }
      } catch (err) {
        console.error(`Exception cleaning table ${table}:`, err);
        // Continue with other tables even if one fails
      }
    }

    // Delete the user account from Auth (this will also trigger any cascade deletions)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete user account' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Successfully deleted user account: ${user.id}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Account successfully deleted' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Delete account error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});