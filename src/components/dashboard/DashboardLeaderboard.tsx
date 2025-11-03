import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingUp, Flame } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  current_streak: number;
  isCurrentUser?: boolean;
}

interface DashboardLeaderboardProps {
  currentUserId?: string;
}

export function DashboardLeaderboard({ currentUserId }: DashboardLeaderboardProps) {
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLeaderboardData();
  }, [currentUserId]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);

      // Get top 5 users by points
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(5);

      if (pointsError || !userPoints) {
        console.error('Error fetching points:', pointsError);
        setIsLoading(false);
        return;
      }

      const userIds = userPoints.map(u => u.user_id);

      // Get profiles for these users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);

      // Get streaks for these users
      const streaksPromises = userIds.map(async (id) => {
        try {
          const { data } = await supabase.rpc('get_user_streak', { user_uuid: id });
          return { user_id: id, streak: data || 0 };
        } catch {
          return { user_id: id, streak: 0 };
        }
      });
      const streaksData = await Promise.all(streaksPromises);
      const streaksMap = new Map(streaksData.map(s => [s.user_id, s.streak]));

      // Build top 5 leaderboard
      const leaderboard: LeaderboardEntry[] = userPoints.map((up, index) => {
        const profile = profiles?.find(p => p.id === up.user_id);
        const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Anonymous User';
        
        return {
          rank: index + 1,
          user_id: up.user_id,
          username: displayName,
          mp_points: up.total_points,
          current_streak: streaksMap.get(up.user_id) || 0,
          isCurrentUser: up.user_id === currentUserId,
        };
      });

      setTopUsers(leaderboard);

      // If current user is not in top 5, get their rank
      if (currentUserId && !leaderboard.find(u => u.user_id === currentUserId)) {
        const { data: allUsers } = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .gt('total_points', 0)
          .order('total_points', { ascending: false });

        if (allUsers) {
          const currentUserIndex = allUsers.findIndex(u => u.user_id === currentUserId);
          if (currentUserIndex !== -1) {
            const currentUserData = allUsers[currentUserIndex];
            const { data: currentProfile } = await supabase
              .from('profiles')
              .select('id, full_name, username, email')
              .eq('id', currentUserId)
              .single();

            const { data: currentStreak } = await supabase.rpc('get_user_streak', { user_uuid: currentUserId });

            setCurrentUserEntry({
              rank: currentUserIndex + 1,
              user_id: currentUserId,
              username: currentProfile?.full_name || currentProfile?.username || currentProfile?.email?.split('@')[0] || 'You',
              mp_points: currentUserData.total_points,
              current_streak: currentStreak || 0,
              isCurrentUser: true,
            });
          }
        }
      }
      
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 via-slate-400 to-slate-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
          3
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm font-semibold">
        {rank}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white dark:bg-gray-900 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (topUsers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Header */}
      <div className="relative z-10 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center shadow-lg shadow-[#0EA5E9]/25">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Leaderboard</h2>
          <p className="text-sm text-[#64748B] dark:text-gray-400">Top performers this week</p>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="relative z-10 space-y-2">
        {topUsers.map((entry, index) => (
          <motion.div
            key={entry.user_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`
              flex items-center gap-4 p-4 rounded-xl transition-all duration-200
              ${entry.isCurrentUser 
                ? 'bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 border-2 border-[#0EA5E9]/30 dark:border-[#0EA5E9]/40' 
                : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-border'
              }
            `}
          >
            {/* Rank Badge */}
            <div className="flex-shrink-0">
              {getRankBadge(entry.rank)}
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {entry.username}
                </p>
                {entry.isCurrentUser && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/30">
                    You
                  </Badge>
                )}
              </div>
            </div>

            {/* MP Points */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20">
              <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
              <span className="text-sm font-bold text-[#0EA5E9]">
                {entry.mp_points}
              </span>
              <span className="text-xs text-[#0EA5E9]/70">MP</span>
            </div>

            {/* Streak */}
            {entry.current_streak > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                  {entry.current_streak}
                </span>
              </div>
            )}
          </motion.div>
        ))}

        {/* Current User Entry (if not in top 5) */}
        {currentUserEntry && (
          <>
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs text-muted-foreground">
                  Your Rank
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 border-2 border-[#0EA5E9]/30 dark:border-[#0EA5E9]/40"
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                {getRankBadge(currentUserEntry.rank)}
              </div>

              {/* Username */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {currentUserEntry.username}
                  </p>
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-[#0EA5E9]/20 text-[#0EA5E9] border-[#0EA5E9]/30">
                    You
                  </Badge>
                </div>
              </div>

              {/* MP Points */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20">
                <TrendingUp className="w-4 h-4 text-[#0EA5E9]" />
                <span className="text-sm font-bold text-[#0EA5E9]">
                  {currentUserEntry.mp_points}
                </span>
                <span className="text-xs text-[#0EA5E9]/70">MP</span>
              </div>

              {/* Streak */}
              {currentUserEntry.current_streak > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 dark:bg-orange-500/10">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                    {currentUserEntry.current_streak}
                  </span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
