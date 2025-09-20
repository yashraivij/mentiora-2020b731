import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { user_id } = await req.json()

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Calculating retroactive MP for user: ${user_id}`)

    // Calculate MP based on existing activities
    let totalMP = 0
    const activities = []

    // Get daily logins (10 points each, only unique days)
    const { data: dailyUsage, error: dailyError } = await supabaseClient
      .from('daily_usage')
      .select('date')
      .eq('user_id', user_id)
      .gte('activities_count', 1)

    if (!dailyError && dailyUsage) {
      const uniqueDays = new Set(dailyUsage.map(d => d.date)).size
      totalMP += uniqueDays * 10
      console.log(`Daily logins: ${uniqueDays} days = ${uniqueDays * 10} MP`)
      
      for (const day of Array.from(new Set(dailyUsage.map(d => d.date)))) {
        activities.push({
          user_id,
          activity_type: 'daily_login',
          metadata: { date: day, retroactive: true },
          created_at: new Date(day).toISOString()
        })
      }
    }

    // Get practice completions (40 points each)
    const { data: exams, error: examsError } = await supabaseClient
      .from('exams')
      .select('id, completed_at')
      .eq('user_id', user_id)
      .not('completed_at', 'is', null)

    if (!examsError && exams) {
      totalMP += exams.length * 40
      console.log(`Practice completions: ${exams.length} = ${exams.length * 40} MP`)
      
      for (const exam of exams) {
        activities.push({
          user_id,
          activity_type: 'practice_completed',
          metadata: { exam_id: exam.id, retroactive: true },
          created_at: exam.completed_at
        })
      }
    }

    // Calculate weekly achievements based on historical data
    if (!dailyError && dailyUsage) {
      // Group activities by week and check for 3+ topics practiced
      const weeklyGroups = new Map()
      
      for (const usage of dailyUsage) {
        const date = new Date(usage.date)
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
        const weekKey = weekStart.toISOString().split('T')[0]
        
        if (!weeklyGroups.has(weekKey)) {
          weeklyGroups.set(weekKey, { days: new Set(), practices: 0 })
        }
        weeklyGroups.get(weekKey).days.add(usage.date)
      }

      // Award weekly achievements
      for (const [weekStart, data] of weeklyGroups) {
        if (data.days.size >= 3) {
          totalMP += 100
          activities.push({
            user_id,
            activity_type: 'weekly_3_topics_awarded',
            metadata: { week_start: weekStart, days_count: data.days.size, retroactive: true },
            created_at: new Date(weekStart).toISOString()
          })
        }
      }
    }

    // Calculate 7-day streak awards (500 points each)
    const { data: streakData, error: streakError } = await supabaseClient
      .rpc('get_user_streak', { user_uuid: user_id })

    if (!streakError && streakData >= 7) {
      const streakAwards = Math.floor(streakData / 7)
      totalMP += streakAwards * 500
      console.log(`Streak awards: ${streakAwards} = ${streakAwards * 500} MP`)
      
      activities.push({
        user_id,
        activity_type: 'streak_7_days_awarded',
        metadata: { streak_days: streakData, retroactive: true },
        created_at: new Date().toISOString()
      })
    }

    // Check if user already has points to avoid duplicates
    const { data: existingPoints } = await supabaseClient
      .from('user_points')
      .select('total_points')
      .eq('user_id', user_id)
      .single()

    if (!existingPoints) {
      // Insert calculated points
      const { error: pointsError } = await supabaseClient
        .from('user_points')
        .insert({
          user_id,
          total_points: totalMP
        })

      if (pointsError) {
        console.error('Error inserting points:', pointsError)
      }

      // Insert activities (but only if they don't exist)
      if (activities.length > 0) {
        const { error: activitiesError } = await supabaseClient
          .from('user_activities')
          .insert(activities)

        if (activitiesError) {
          console.error('Error inserting activities:', activitiesError)
        }
      }
    }

    console.log(`Total retroactive MP calculated: ${totalMP}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        total_mp: totalMP,
        activities_count: activities.length,
        existing_points: existingPoints?.total_points || 0
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error calculating retroactive MP:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})