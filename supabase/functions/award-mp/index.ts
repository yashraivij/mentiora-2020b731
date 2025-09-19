import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// MP reward values (authoritative)
const MP_REWARDS = {
  LOGIN_DAILY: 10,
  PRACTICE_COMPLETION: 40,
  WEEKLY_3_TOPICS: 100,
  WEEKLY_5_PRACTICE: 250,
  STREAK_7_DAYS: 500,
};

// Activity types for tracking
const ACTIVITY_TYPES = {
  DAILY_LOGIN: 'daily_login',
  PRACTICE_COMPLETED: 'practice_completed',
  TOPIC_PRACTICED: 'topic_practiced',
  WEEKLY_3_TOPICS_AWARDED: 'weekly_3_topics_awarded',
  WEEKLY_5_PRACTICE_AWARDED: 'weekly_5_practice_awarded',
  STREAK_7_DAYS_AWARDED: 'streak_7_days_awarded',
};

// Get UK timezone date boundaries
function getUKDateBoundaries(date = new Date()) {
  const ukDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/London" }));
  const dayStart = new Date(ukDate);
  dayStart.setHours(0, 0, 0, 0);
  
  const dayEnd = new Date(ukDate);
  dayEnd.setHours(23, 59, 59, 999);
  
  return { dayStart, dayEnd, ukDate };
}

function getUKWeekBoundaries(date = new Date()) {
  const { ukDate } = getUKDateBoundaries(date);
  const weekStart = new Date(ukDate);
  const dayOfWeek = weekStart.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Monday = 0
  weekStart.setDate(weekStart.getDate() - daysToMonday);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
}

async function getUserPoints(userId: string): Promise<number> {
  const { data } = await supabase
    .from('user_points')
    .select('total_points')
    .eq('user_id', userId)
    .maybeSingle();
  
  return data?.total_points || 0;
}

async function awardPoints(userId: string, points: number, reason: string): Promise<boolean> {
  try {
    console.log(`Awarding ${points} MP to user ${userId} for ${reason}`);
    
    const currentPoints = await getUserPoints(userId);
    const newTotal = currentPoints + points;
    
    const { error } = await supabase
      .from('user_points')
      .upsert({
        user_id: userId,
        total_points: newTotal,
        updated_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    console.log(`Successfully awarded ${points} MP. New total: ${newTotal}`);
    return true;
  } catch (error) {
    console.error('Error awarding points:', error);
    return false;
  }
}

async function recordActivity(userId: string, activityType: string, metadata = {}): Promise<void> {
  try {
    const { error } = await supabase
      .from('user_activities')
      .insert({
        user_id: userId,
        activity_type: activityType,
        metadata,
        created_at: new Date().toISOString()
      });
    
    if (error) throw error;
    console.log(`Recorded activity: ${activityType} for user ${userId}`);
  } catch (error) {
    console.error('Error recording activity:', error);
    throw error;
  }
}

async function hasActivityToday(userId: string, activityType: string): Promise<boolean> {
  const { dayStart, dayEnd } = getUKDateBoundaries();
  
  const { data } = await supabase
    .from('user_activities')
    .select('id')
    .eq('user_id', userId)
    .eq('activity_type', activityType)
    .gte('created_at', dayStart.toISOString())
    .lte('created_at', dayEnd.toISOString())
    .maybeSingle();
  
  return !!data;
}

async function hasActivityThisWeek(userId: string, activityType: string): Promise<boolean> {
  const { weekStart, weekEnd } = getUKWeekBoundaries();
  
  const { data } = await supabase
    .from('user_activities')
    .select('id')
    .eq('user_id', userId)
    .eq('activity_type', activityType)
    .gte('created_at', weekStart.toISOString())
    .lte('created_at', weekEnd.toISOString())
    .maybeSingle();
  
  return !!data;
}

async function getWeeklyTopicCount(userId: string): Promise<number> {
  const { weekStart, weekEnd } = getUKWeekBoundaries();
  
  const { data } = await supabase
    .from('user_activities')
    .select('metadata')
    .eq('user_id', userId)
    .eq('activity_type', ACTIVITY_TYPES.TOPIC_PRACTICED)
    .gte('created_at', weekStart.toISOString())
    .lte('created_at', weekEnd.toISOString());
  
  if (!data) return 0;
  
  // Count unique topics
  const uniqueTopics = new Set();
  data.forEach((activity: any) => {
    const metadata = activity.metadata || {};
    if (metadata.subject_id && metadata.topic_id) {
      uniqueTopics.add(`${metadata.subject_id}-${metadata.topic_id}`);
    }
  });
  
  return uniqueTopics.size;
}

async function getWeeklyPracticeCount(userId: string): Promise<number> {
  const { weekStart, weekEnd } = getUKWeekBoundaries();
  
  const { data } = await supabase
    .from('user_activities')
    .select('created_at')
    .eq('user_id', userId)
    .eq('activity_type', ACTIVITY_TYPES.PRACTICE_COMPLETED)
    .gte('created_at', weekStart.toISOString())
    .lte('created_at', weekEnd.toISOString());
  
  return data?.length || 0;
}

async function getUserStreak(userId: string): Promise<number> {
  const { data } = await supabase.rpc('get_user_streak', { user_uuid: userId });
  return data || 0;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, subjectId, topicId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result = { success: false, awarded: 0, message: '' };

    switch (action) {
      case 'daily_login':
        // Award daily login MP (once per day)
        if (await hasActivityToday(userId, ACTIVITY_TYPES.DAILY_LOGIN)) {
          result = { success: true, awarded: 0, message: 'Already logged in today' };
        } else {
          await recordActivity(userId, ACTIVITY_TYPES.DAILY_LOGIN);
          const awarded = await awardPoints(userId, MP_REWARDS.LOGIN_DAILY, 'Daily login');
          result = { 
            success: awarded, 
            awarded: awarded ? MP_REWARDS.LOGIN_DAILY : 0, 
            message: awarded ? 'Daily login bonus awarded' : 'Failed to award points' 
          };
        }
        break;

      case 'practice_completion':
        if (!subjectId || !topicId) {
          return new Response(JSON.stringify({ error: 'Subject ID and Topic ID required for practice completion' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Always record topic practice and award MP for each completion
        await recordActivity(userId, ACTIVITY_TYPES.TOPIC_PRACTICED, { subject_id: subjectId, topic_id: topicId });
        await recordActivity(userId, ACTIVITY_TYPES.PRACTICE_COMPLETED);
        
        const practiceAwarded = await awardPoints(userId, MP_REWARDS.PRACTICE_COMPLETION, 'Practice completion');
        let totalAwarded = practiceAwarded ? MP_REWARDS.PRACTICE_COMPLETION : 0;
        
        // Check weekly goals
        const weeklyTopics = await getWeeklyTopicCount(userId);
        const weeklyPractice = await getWeeklyPracticeCount(userId);
        const currentStreak = await getUserStreak(userId);
        
        // Award weekly 3 topics bonus (once per week)
        if (weeklyTopics >= 3 && !(await hasActivityThisWeek(userId, ACTIVITY_TYPES.WEEKLY_3_TOPICS_AWARDED))) {
          await recordActivity(userId, ACTIVITY_TYPES.WEEKLY_3_TOPICS_AWARDED);
          const weeklyTopicsAwarded = await awardPoints(userId, MP_REWARDS.WEEKLY_3_TOPICS, 'Weekly 3 topics bonus');
          if (weeklyTopicsAwarded) totalAwarded += MP_REWARDS.WEEKLY_3_TOPICS;
        }
        
        // Award weekly 5 practice sessions bonus (once per week)
        if (weeklyPractice >= 5 && !(await hasActivityThisWeek(userId, ACTIVITY_TYPES.WEEKLY_5_PRACTICE_AWARDED))) {
          await recordActivity(userId, ACTIVITY_TYPES.WEEKLY_5_PRACTICE_AWARDED);
          const weeklyPracticeAwarded = await awardPoints(userId, MP_REWARDS.WEEKLY_5_PRACTICE, 'Weekly 5 practice sessions bonus');
          if (weeklyPracticeAwarded) totalAwarded += MP_REWARDS.WEEKLY_5_PRACTICE;
        }
        
        // Award 7-day streak bonus (once per week when achieved)
        if (currentStreak >= 7 && !(await hasActivityThisWeek(userId, ACTIVITY_TYPES.STREAK_7_DAYS_AWARDED))) {
          await recordActivity(userId, ACTIVITY_TYPES.STREAK_7_DAYS_AWARDED);
          const streakAwarded = await awardPoints(userId, MP_REWARDS.STREAK_7_DAYS, '7-day streak bonus');
          if (streakAwarded) totalAwarded += MP_REWARDS.STREAK_7_DAYS;
        }
        
        result = { 
          success: true, 
          awarded: totalAwarded, 
          message: `Practice completed! Awarded ${totalAwarded} MP total`,
          breakdown: {
            practice: practiceAwarded ? MP_REWARDS.PRACTICE_COMPLETION : 0,
            weeklyTopics: weeklyTopics >= 3 && totalAwarded > MP_REWARDS.PRACTICE_COMPLETION ? MP_REWARDS.WEEKLY_3_TOPICS : 0,
            weeklyPractice: weeklyPractice >= 5 && totalAwarded > (MP_REWARDS.PRACTICE_COMPLETION + (weeklyTopics >= 3 ? MP_REWARDS.WEEKLY_3_TOPICS : 0)) ? MP_REWARDS.WEEKLY_5_PRACTICE : 0,
            streak: currentStreak >= 7 && totalAwarded > (MP_REWARDS.PRACTICE_COMPLETION + (weeklyTopics >= 3 ? MP_REWARDS.WEEKLY_3_TOPICS : 0) + (weeklyPractice >= 5 ? MP_REWARDS.WEEKLY_5_PRACTICE : 0)) ? MP_REWARDS.STREAK_7_DAYS : 0
          }
        };
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in award-mp function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});