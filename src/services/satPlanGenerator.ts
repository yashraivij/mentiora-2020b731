import { supabase } from "@/integrations/supabase/client";
import { SATProfile } from "@/types/sat";

interface DailyActivity {
  type: 'warmup' | 'core_focus' | 'boost';
  domain: string;
  question_ids: string[];
  estimated_minutes: number;
  completed: boolean;
}

interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  activities: DailyActivity[];
  completed: boolean;
}

export async function generateDailyPlan(
  userId: string,
  profile: Partial<SATProfile>
): Promise<DailyPlan | null> {
  try {
    // Check if plan already exists for today
    const today = new Date().toISOString().split('T')[0];
    const { data: existingPlan } = await supabase
      .from('sat_daily_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_date', today)
      .single();

    if (existingPlan) {
      return {
        ...existingPlan,
        activities: existingPlan.activities as unknown as DailyActivity[]
      } as DailyPlan;
    }

    // Get user's weak and strong domains
    const weakDomains = profile.sat_weak_domains || [];
    const strongDomains = profile.sat_strength_domains || [];
    const dailyMinutes = profile.sat_daily_minutes || 30;

    // If no weak domains identified yet, use all domains
    const allDomains = ['Algebra', 'Advanced Math', 'Problem Solving', 'Geometry'];
    const focusDomains = weakDomains.length > 0 ? weakDomains : allDomains;
    const warmupDomain = strongDomains.length > 0 ? strongDomains[0] : allDomains[0];

    const activities: DailyActivity[] = [];

    // Activity 1: Warm-up (2-3 easy questions from strength domain)
    const { data: warmupQuestions } = await supabase
      .from('sat_questions')
      .select('id')
      .eq('domain', warmupDomain)
      .eq('difficulty', 'easy')
      .limit(3);

    if (warmupQuestions && warmupQuestions.length > 0) {
      activities.push({
        type: 'warmup',
        domain: warmupDomain,
        question_ids: warmupQuestions.map(q => q.id),
        estimated_minutes: Math.round(dailyMinutes * 0.2),
        completed: false
      });
    }

    // Activity 2: Core Focus (5-7 questions from weakest domain)
    const primaryWeakDomain = focusDomains[0];
    const { data: focusQuestions } = await supabase
      .from('sat_questions')
      .select('id')
      .eq('domain', primaryWeakDomain)
      .in('difficulty', ['medium', 'hard'])
      .limit(6);

    if (focusQuestions && focusQuestions.length > 0) {
      activities.push({
        type: 'core_focus',
        domain: primaryWeakDomain,
        question_ids: focusQuestions.map(q => q.id),
        estimated_minutes: Math.round(dailyMinutes * 0.6),
        completed: false
      });
    }

    // Activity 3: Challenge Boost (2-3 hard questions from weak domain)
    const secondaryWeakDomain = focusDomains[1] || focusDomains[0];
    const { data: boostQuestions } = await supabase
      .from('sat_questions')
      .select('id')
      .eq('domain', secondaryWeakDomain)
      .eq('difficulty', 'hard')
      .limit(3);

    if (boostQuestions && boostQuestions.length > 0) {
      activities.push({
        type: 'boost',
        domain: secondaryWeakDomain,
        question_ids: boostQuestions.map(q => q.id),
        estimated_minutes: Math.round(dailyMinutes * 0.2),
        completed: false
      });
    }

    // Save plan to database
    const { data: newPlan, error } = await supabase
      .from('sat_daily_plans')
      .insert({
        user_id: userId,
        plan_date: today,
        activities: activities as any,
        completed: false
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...newPlan,
      activities: newPlan.activities as unknown as DailyActivity[]
    } as DailyPlan;
  } catch (error) {
    console.error('Error generating daily plan:', error);
    return null;
  }
}

export async function getTodaysPlan(userId: string): Promise<DailyPlan | null> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('sat_daily_plans')
      .select('*')
      .eq('user_id', userId)
      .eq('plan_date', today)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;
    return {
      ...data,
      activities: data.activities as unknown as DailyActivity[]
    } as DailyPlan;
  } catch (error) {
    console.error('Error fetching today\'s plan:', error);
    return null;
  }
}

export async function markActivityComplete(
  planId: string,
  activityIndex: number
): Promise<boolean> {
  try {
    const { data: plan } = await supabase
      .from('sat_daily_plans')
      .select('activities, completed')
      .eq('id', planId)
      .single();

    if (!plan) return false;

    const activities = plan.activities as unknown as DailyActivity[];
    activities[activityIndex].completed = true;

    const allCompleted = activities.every(a => a.completed);

    const { error } = await supabase
      .from('sat_daily_plans')
      .update({
        activities: activities as any,
        completed: allCompleted,
        completed_at: allCompleted ? new Date().toISOString() : null
      })
      .eq('id', planId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking activity complete:', error);
    return false;
  }
}
