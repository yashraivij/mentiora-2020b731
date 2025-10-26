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
};

// Activity types for tracking
const ACTIVITY_TYPES = {
  DAILY_LOGIN: 'daily_login',
  SUBJECT_TASK_COMPLETED: 'subject_task_completed',
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
    
    // Use atomic update to prevent race conditions
    const { data, error } = await supabase.rpc('increment_user_points', {
      p_user_id: userId,
      p_points: points
    });
    
    if (error) {
      // Fallback to upsert if the RPC doesn't exist yet
      const currentPoints = await getUserPoints(userId);
      const newTotal = currentPoints + points;
      
      const { error: upsertError } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          total_points: newTotal,
          updated_at: new Date().toISOString()
        });
      
      if (upsertError) throw upsertError;
      console.log(`Successfully awarded ${points} MP via upsert. New total: ${newTotal}`);
    } else {
      console.log(`Successfully awarded ${points} MP via RPC. New total: ${data}`);
    }
    
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


async function getUserStreak(userId: string): Promise<number> {
  const { data } = await supabase.rpc('get_user_streak', { user_uuid: userId });
  return data || 0;
}

function calculateStreakMPReward(streak: number): number {
  // Milestone rewards based on notification
  if (streak === 3) return 100;
  if (streak === 14) return 200;
  if (streak === 30) return 400;
  
  // Other milestones: 100 MP per 7 days
  const milestones = [7, 60, 100, 180, 365];
  if (milestones.includes(streak)) {
    return Math.floor(streak / 7) * 100;
  }
  
  // Regular day
  return 10;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, subjectId, topicId, practiceScore, totalMarks, mpAmount, taskId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result = { success: false, awarded: 0, message: '' };

    switch (action) {
      case 'daily_login':
        // Award daily login MP based on streak (once per day)
        if (await hasActivityToday(userId, ACTIVITY_TYPES.DAILY_LOGIN)) {
          result = { success: true, awarded: 0, message: 'Already logged in today' };
        } else {
          const currentStreak = await getUserStreak(userId);
          const mpReward = calculateStreakMPReward(currentStreak);
          
          await recordActivity(userId, ACTIVITY_TYPES.DAILY_LOGIN);
          const awarded = await awardPoints(userId, mpReward, `Daily login (streak: ${currentStreak})`);
          result = { 
            success: awarded, 
            awarded: awarded ? mpReward : 0, 
            message: awarded ? `Daily login bonus: +${mpReward} MP` : 'Failed to award points' 
          };
        }
        break;

      case 'subject_task_completed':
        // Award MP for completing a subject daily task
        if (!mpAmount || !taskId || !subjectId) {
          return new Response(JSON.stringify({ error: 'MP amount, task ID, and subject ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        await recordActivity(userId, 'subject_task_completed', { 
          task_id: taskId, 
          subject_id: subjectId,
          mp_awarded: mpAmount 
        });
        const taskAwarded = await awardPoints(userId, mpAmount, `Daily task: ${taskId}`);
        result = { 
          success: taskAwarded, 
          awarded: taskAwarded ? mpAmount : 0, 
          message: taskAwarded ? `Task completed! +${mpAmount} MP awarded` : 'Failed to award points' 
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