import { supabase } from "@/integrations/supabase/client";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

export interface WeeklyReview {
  id: string;
  user_id: string;
  week_start_date: string;
  week_end_date: string;
  baseline_score_low: number;
  baseline_score_high: number;
  updated_score_low: number;
  updated_score_high: number;
  improvement_percentage: number;
  areas_mastered: string[];
  trending_domains: {
    domain: string;
    trend: "up" | "down" | "stable";
    percentage: number;
  }[];
  sessions_completed: number;
  total_questions_answered: number;
  created_at: string;
}

export async function generateWeeklyReview(userId: string): Promise<WeeklyReview | null> {
  try {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });

    // Check if review already exists for this week
    const { data: existing } = await supabase
      .from('sat_weekly_reviews')
      .select('*')
      .eq('user_id', userId)
      .eq('week_start_date', weekStart.toISOString().split('T')[0])
      .single();

    if (existing) {
      return {
        ...existing,
        trending_domains: existing.trending_domains as any
      } as WeeklyReview;
    }

    // Get user's current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('sat_baseline_score_low, sat_baseline_score_high, sat_predicted_score_low, sat_predicted_score_high')
      .eq('id', userId)
      .single();

    if (!profile) return null;

    // Get this week's session logs
    const { data: thisWeekSessions } = await supabase
      .from('sat_session_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', weekStart.toISOString().split('T')[0])
      .lte('session_date', weekEnd.toISOString().split('T')[0]);

    // Get last week's session logs for comparison
    const { data: lastWeekSessions } = await supabase
      .from('sat_session_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', lastWeekStart.toISOString().split('T')[0])
      .lt('session_date', weekStart.toISOString().split('T')[0]);

    if (!thisWeekSessions || thisWeekSessions.length === 0) {
      return null;
    }

    // Calculate metrics
    const sessionsCompleted = thisWeekSessions.length;
    const totalQuestions = thisWeekSessions.reduce((sum, s) => sum + s.questions_answered, 0);

    // Calculate domain trends
    const domainStats = calculateDomainTrends(thisWeekSessions, lastWeekSessions || []);

    // Find areas mastered (>80% accuracy this week)
    const areasMastered = domainStats
      .filter(d => d.percentage >= 80)
      .map(d => d.domain);

    // Calculate improvement
    const baselineAvg = ((profile.sat_baseline_score_low || 0) + (profile.sat_baseline_score_high || 0)) / 2;
    const currentAvg = ((profile.sat_predicted_score_low || 0) + (profile.sat_predicted_score_high || 0)) / 2;
    const improvementPercentage = baselineAvg > 0 ? ((currentAvg - baselineAvg) / baselineAvg) * 100 : 0;

    // Insert weekly review
    const { data: review, error } = await supabase
      .from('sat_weekly_reviews')
      .insert({
        user_id: userId,
        week_start_date: weekStart.toISOString().split('T')[0],
        week_end_date: weekEnd.toISOString().split('T')[0],
        baseline_score_low: profile.sat_baseline_score_low || 0,
        baseline_score_high: profile.sat_baseline_score_high || 0,
        updated_score_low: profile.sat_predicted_score_low || profile.sat_baseline_score_low || 0,
        updated_score_high: profile.sat_predicted_score_high || profile.sat_baseline_score_high || 0,
        improvement_percentage: Math.round(improvementPercentage * 10) / 10,
        areas_mastered: areasMastered,
        trending_domains: domainStats,
        sessions_completed: sessionsCompleted,
        total_questions_answered: totalQuestions
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating weekly review:', error);
      return null;
    }

    return {
      ...review,
      trending_domains: review.trending_domains as any
    } as WeeklyReview;
  } catch (error) {
    console.error('Error generating weekly review:', error);
    return null;
  }
}

function calculateDomainTrends(
  thisWeek: any[],
  lastWeek: any[]
): { domain: string; trend: "up" | "down" | "stable"; percentage: number }[] {
  const domains = new Set<string>();
  
  // Collect all domains
  thisWeek.forEach(session => {
    if (session.domains_improved) session.domains_improved.forEach((d: string) => domains.add(d));
    if (session.domains_needing_review) session.domains_needing_review.forEach((d: string) => domains.add(d));
  });

  return Array.from(domains).map(domain => {
    // Calculate this week's performance
    const thisWeekAnswers = thisWeek.flatMap(s => s.answers || [])
      .filter((a: any) => getDomainForAnswer(a) === domain);
    const thisWeekCorrect = thisWeekAnswers.filter((a: any) => a.is_correct).length;
    const thisWeekPercentage = thisWeekAnswers.length > 0 
      ? (thisWeekCorrect / thisWeekAnswers.length) * 100 
      : 0;

    // Calculate last week's performance
    const lastWeekAnswers = lastWeek.flatMap(s => s.answers || [])
      .filter((a: any) => getDomainForAnswer(a) === domain);
    const lastWeekCorrect = lastWeekAnswers.filter((a: any) => a.is_correct).length;
    const lastWeekPercentage = lastWeekAnswers.length > 0 
      ? (lastWeekCorrect / lastWeekAnswers.length) * 100 
      : 0;

    // Determine trend
    let trend: "up" | "down" | "stable" = "stable";
    const diff = thisWeekPercentage - lastWeekPercentage;
    if (diff > 5) trend = "up";
    else if (diff < -5) trend = "down";

    return {
      domain,
      trend,
      percentage: Math.round(thisWeekPercentage)
    };
  });
}

function getDomainForAnswer(answer: any): string {
  // This would ideally look up the question's domain
  // For now, return a placeholder
  return answer.domain || "General";
}

export async function getLatestWeeklyReview(userId: string): Promise<WeeklyReview | null> {
  try {
    const { data, error } = await supabase
      .from('sat_weekly_reviews')
      .select('*')
      .eq('user_id', userId)
      .order('week_start_date', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      trending_domains: data.trending_domains as any
    } as WeeklyReview;
  } catch (error) {
    console.error('Error fetching weekly review:', error);
    return null;
  }
}
