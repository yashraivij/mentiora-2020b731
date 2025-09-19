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
  PRACTICE_DAILY: 40,
  WEEKLY_3_TOPICS: 100,
  WEEKLY_5_PRACTICE: 250,
  STREAK_7_DAYS: 500,
};

export class MPPointsSystem {
  
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Get user points
      const { data: pointsData } = await supabase
        .from('user_points' as any)
        .select('total_points')
        .eq('user_id', userId)
        .maybeSingle();

      // Get today's activities
      const today = new Date().toISOString().split('T')[0];
      const { data: todayActivities } = await supabase
        .from('user_activities')
        .select('activity_type')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`);

      // Get this week's activities
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const { data: weeklyActivities } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString());

      // Get user's current streak
      const { data: streakData, error: streakError } = await supabase
        .rpc('get_user_streak', { user_uuid: userId });

      // Calculate stats
      const loginToday = todayActivities?.some(a => a.activity_type === 'daily_login') || false;
      const practiceToday = todayActivities?.some(a => a.activity_type === 'practice_completed') || false;
      
      // Count unique days this week where practice was completed
      const weeklyPracticeDays = new Set(
        weeklyActivities
          ?.filter(a => a.activity_type === 'practice_completed')
          ?.map(a => new Date(a.created_at).toISOString().split('T')[0])
      ).size;

      // Count total unique topics practiced this week
      const weeklyTopicsCount = weeklyActivities
        ?.filter(a => a.activity_type === 'topic_practiced')
        ?.length || 0;

      // Count total practice sessions completed (all time)
      const { data: totalPracticeData } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', 'practice_completed');

      return {
        totalPoints: (pointsData as any)?.total_points || 0,
        loginToday,
        practiceToday,
        weeklyTopicsCount,
        weeklyPracticeCount: weeklyPracticeDays,
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

  static async awardPoints(userId: string, points: number, reason: string): Promise<boolean> {
    try {
      // Get or create user points record
      const { data: existingPoints } = await supabase
        .from('user_points' as any)
        .select('total_points')
        .eq('user_id', userId)
        .maybeSingle();

      const currentPoints = (existingPoints as any)?.total_points || 0;
      const newTotal = currentPoints + points;

      if (existingPoints) {
        // Update existing record
        const { error } = await supabase
          .from('user_points' as any)
          .update({ 
            total_points: newTotal,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('user_points' as any)
          .insert({
            user_id: userId,
            total_points: newTotal
          });

        if (error) throw error;
      }

      console.log(`Awarded ${points} MP to user ${userId} for ${reason}. New total: ${newTotal}`);
      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  }

  static async recordActivity(userId: string, activityType: string, metadata?: any): Promise<void> {
    try {
      await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          metadata: metadata || {}
        });
    } catch (error) {
      console.error('Error recording activity:', error);
    }
  }

  static async handleDailyLogin(userId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already logged in today
      const { data: todayLogin } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', 'daily_login')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .maybeSingle();

      if (!todayLogin) {
        // Record login activity
        await this.recordActivity(userId, 'daily_login');
        
        // Award points
        const awarded = await this.awardPoints(userId, MP_REWARDS.LOGIN_DAILY, 'Daily login');
        return awarded;
      }
      
      return false; // Already logged in today
    } catch (error) {
      console.error('Error handling daily login:', error);
      return false;
    }
  }

  static async handlePracticeCompletion(userId: string, subjectId: string, topicId: string): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if already completed practice today
      const { data: todayPractice } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', 'practice_completed')
        .gte('created_at', `${today}T00:00:00`)
        .lt('created_at', `${today}T23:59:59`)
        .maybeSingle();

      // Always record topic practice
      await this.recordActivity(userId, 'topic_practiced', { 
        subject_id: subjectId, 
        topic_id: topicId 
      });

      // Award daily practice bonus only once per day
      if (!todayPractice) {
        await this.recordActivity(userId, 'practice_completed');
        await this.awardPoints(userId, MP_REWARDS.PRACTICE_DAILY, 'Daily practice completion');
      }

      // Check weekly goals
      await this.checkWeeklyGoals(userId);
      
      // Check streak goal
      await this.checkStreakGoal(userId);
      
      // Check total practice goal
      await this.checkTotalPracticeGoal(userId);
      
    } catch (error) {
      console.error('Error handling practice completion:', error);
    }
  }

  static async checkWeeklyGoals(userId: string): Promise<void> {
    try {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      // Check if already awarded weekly goals this week
      const { data: weeklyAwards } = await supabase
        .from('user_activities')
        .select('activity_type')
        .eq('user_id', userId)
        .in('activity_type', ['weekly_3_topics_completed', 'weekly_5_practice_completed'])
        .gte('created_at', weekStart.toISOString());

      const awarded3Topics = weeklyAwards?.some(a => a.activity_type === 'weekly_3_topics_completed');
      const awarded5Practice = weeklyAwards?.some(a => a.activity_type === 'weekly_5_practice_completed');

      // Get this week's activities
      const { data: weeklyActivities } = await supabase
        .from('user_activities')
        .select('activity_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString());

      // Check 3 topics goal
      if (!awarded3Topics) {
        const topicsThisWeek = weeklyActivities?.filter(a => a.activity_type === 'topic_practiced')?.length || 0;
        if (topicsThisWeek >= 3) {
          await this.recordActivity(userId, 'weekly_3_topics_completed');
          await this.awardPoints(userId, MP_REWARDS.WEEKLY_3_TOPICS, 'Weekly 3 topics goal');
        }
      }

      // Check 5 practice sessions goal
      if (!awarded5Practice) {
        const practiceDays = new Set(
          weeklyActivities
            ?.filter(a => a.activity_type === 'practice_completed')
            ?.map(a => new Date(a.created_at).toISOString().split('T')[0])
        ).size;
        
        if (practiceDays >= 5) {
          await this.recordActivity(userId, 'weekly_5_practice_completed');
          await this.awardPoints(userId, MP_REWARDS.WEEKLY_5_PRACTICE, 'Weekly 5 practice sessions goal');
        }
      }

    } catch (error) {
      console.error('Error checking weekly goals:', error);
    }
  }

  static async checkStreakGoal(userId: string): Promise<void> {
    try {
      // Get current streak
      const { data: streakData } = await supabase
        .rpc('get_user_streak', { user_uuid: userId });
      
      if (streakData >= 7) {
        // Check if already awarded streak goal recently
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const { data: recentStreakAward } = await supabase
          .from('user_activities')
          .select('id')
          .eq('user_id', userId)
          .eq('activity_type', 'streak_7_days_completed')
          .gte('created_at', weekAgo.toISOString())
          .maybeSingle();

        if (!recentStreakAward) {
          await this.recordActivity(userId, 'streak_7_days_completed');
          await this.awardPoints(userId, MP_REWARDS.STREAK_7_DAYS, '7-day streak achievement');
        }
      }
    } catch (error) {
      console.error('Error checking streak goal:', error);
    }
  }

  static async checkTotalPracticeGoal(userId: string): Promise<void> {
    try {
      // Get total practice count
      const { data: totalPracticeData } = await supabase
        .from('user_activities')
        .select('id')
        .eq('user_id', userId)
        .eq('activity_type', 'practice_completed');

      const totalPractice = totalPracticeData?.length || 0;

      // Check if reached 5 practice sessions total
      if (totalPractice >= 5) {
        // Check if already awarded this milestone
        const { data: milestoneAward } = await supabase
          .from('user_activities')
          .select('id')
          .eq('user_id', userId)
          .eq('activity_type', 'total_5_practice_completed')
          .maybeSingle();

        if (!milestoneAward) {
          await this.recordActivity(userId, 'total_5_practice_completed');
          await this.awardPoints(userId, MP_REWARDS.WEEKLY_5_PRACTICE, '5 practice sessions milestone');
        }
      }
    } catch (error) {
      console.error('Error checking total practice goal:', error);
    }
  }
}