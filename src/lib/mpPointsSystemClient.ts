import { supabase } from "@/integrations/supabase/client";

export interface UserStats {
  totalPoints: number;
  loginToday: boolean;
  practiceToday: boolean;
  weeklyTopicsCount: number;
  weeklyPracticeCount: number;
  currentStreak: number;
  totalPracticeCount: number;
}

export const MP_REWARDS = {
  LOGIN_DAILY: 10,
  PRACTICE_COMPLETION: 40,
  WEEKLY_3_TOPICS: 100,
  WEEKLY_5_PRACTICE: 250,
  STREAK_7_DAYS: 500,
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

export class MPPointsSystemClient {
  
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get user points
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', userId)
        .maybeSingle();

      // Get today's activities using UK timezone
      const { dayStart, dayEnd } = getUKDateBoundaries();
      const { data: todayActivities } = await supabase
        .from('user_activities')
        .select('activity_type')
        .eq('user_id', userId)
        .gte('created_at', dayStart.toISOString())
        .lte('created_at', dayEnd.toISOString());

      // Get this week's activities using UK timezone
      const { weekStart, weekEnd } = getUKWeekBoundaries();
      const { data: weeklyActivities } = await supabase
        .from('user_activities')
        .select('activity_type, created_at, metadata')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString())
        .lte('created_at', weekEnd.toISOString());

      // Get user's current streak
      const { data: streakData } = await supabase
        .rpc('get_user_streak', { user_uuid: userId });

      // Calculate stats
      const loginToday = todayActivities?.some(a => a.activity_type === 'daily_login') || false;
      const practiceToday = todayActivities?.some(a => a.activity_type === 'practice_completed') || false;
      
      // Count practice sessions this week
      const weeklyPracticeCount = weeklyActivities
        ?.filter(a => a.activity_type === 'practice_completed')
        ?.length || 0;

      // Count unique topics practiced this week
      const uniqueTopics = new Set();
      weeklyActivities
        ?.filter(a => a.activity_type === 'topic_practiced')
        ?.forEach((activity: any) => {
          const metadata = activity.metadata || {};
          if (metadata.subject_id && metadata.topic_id) {
            uniqueTopics.add(`${metadata.subject_id}-${metadata.topic_id}`);
          }
        });

      // Count total practice sessions completed (all time)
      const { data: totalPracticeData } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', 'practice_completed');

      return {
        totalPoints: pointsData?.total_points || 0,
        loginToday,
        practiceToday,
        weeklyTopicsCount: uniqueTopics.size,
        weeklyPracticeCount,
        currentStreak: streakData || 0,
        totalPracticeCount: totalPracticeData?.length || 0,
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return {
        totalPoints: 0,
        loginToday: false,
        practiceToday: false,
        weeklyTopicsCount: 0,
        weeklyPracticeCount: 0,
        currentStreak: 0,
        totalPracticeCount: 0,
      };
    }
  }

  static async awardDailyLogin(userId: string): Promise<{ success: boolean; awarded: number; message: string }> {
    try {
      const { data } = await supabase.functions.invoke('award-mp', {
        body: { action: 'daily_login', userId }
      });
      
      return data || { success: false, awarded: 0, message: 'Server error' };
    } catch (error) {
      console.error('Error awarding daily login:', error);
      return { success: false, awarded: 0, message: 'Network error' };
    }
  }

  static async awardPracticeCompletion(userId: string, subjectId: string, topicId: string, practiceScore?: number, totalMarks?: number): Promise<{ success: boolean; awarded: number; message: string; breakdown?: any }> {
    try {
      const { data } = await supabase.functions.invoke('award-mp', {
        body: { 
          action: 'practice_completion', 
          userId, 
          subjectId, 
          topicId,
          practiceScore,
          totalMarks
        }
      });
      
      return data || { success: false, awarded: 0, message: 'Server error' };
    } catch (error) {
      console.error('Error awarding practice completion:', error);
      return { success: false, awarded: 0, message: 'Network error' };
    }
  }
}