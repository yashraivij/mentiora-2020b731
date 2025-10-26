import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, Crown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  streak: number;
  isCurrentUser: boolean;
}

export function TopLeaderboard({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopStudents();
    const interval = setInterval(loadTopStudents, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [userId]);

  const loadTopStudents = async () => {
    try {
      setIsLoading(true);

      // Get top 25 users by MP points (including 0 points for demo purposes)
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gte('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(25);

      if (pointsError || !userPoints) {
        console.error('Error fetching points:', pointsError);
        setEntries([]);
        setIsLoading(false);
        return;
      }

      let userIds = userPoints.map(u => u.user_id);
      
      // Check if current user is in top 25
      const currentUserInTop = userId && userIds.includes(userId);
      
      // If current user is not in top 25, fetch their data separately
      if (userId && !currentUserInTop) {
        const { data: currentUserPoint } = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .eq('user_id', userId)
          .single();
        
        if (currentUserPoint) {
          userIds.push(currentUserPoint.user_id);
        }
      }

      // Get user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);

      // Get streaks
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

      // Build leaderboard entries from userPoints
      let leaderboardEntries: LeaderEntry[] = userPoints.map((up, index) => {
        const profile = profiles?.find(p => p.id === up.user_id);
        const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Anonymous';

        return {
          rank: index + 1,
          user_id: up.user_id,
          username: displayName,
          mp_points: up.total_points,
          streak: streaksMap.get(up.user_id) || 0,
          isCurrentUser: up.user_id === userId,
        };
      });

      // If current user wasn't in top 25, add them at the end
      if (userId && !currentUserInTop) {
        const { data: allPoints } = await supabase
          .from('user_points')
          .select('total_points')
          .order('total_points', { ascending: false });
        
        const currentUserData = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .eq('user_id', userId)
          .single();

        if (currentUserData.data) {
          const profile = profiles?.find(p => p.id === userId);
          const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'You';
          
          // Calculate actual rank
          const actualRank = (allPoints?.filter(p => p.total_points > currentUserData.data.total_points).length || 0) + 1;

          leaderboardEntries.push({
            rank: actualRank,
            user_id: userId,
            username: displayName,
            mp_points: currentUserData.data.total_points,
            streak: streaksMap.get(userId) || 0,
            isCurrentUser: true,
          });
        }
      }

      setEntries(leaderboardEntries);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#F97316] shadow-md">
          <Crown className="h-6 w-6 text-white" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#94A3B8] to-[#64748B] shadow-md">
          <Trophy className="h-5 w-5 text-white" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-[#EA580C] to-[#DC2626] shadow-md">
          <Trophy className="h-5 w-5 text-white" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <span className="text-lg font-semibold text-[#64748B]">{rank}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
      >
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-5 w-72 mb-8" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
    >
      {/* Animated background element */}
      <motion.div 
        className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl pointer-events-none"
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
      <div className="relative z-10 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
            <Trophy className="h-6 w-6 text-[#0EA5E9]" />
          </div>
          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Top Students
          </h2>
        </div>
        <p className="text-[#64748B] dark:text-gray-400 ml-[52px]">
          The top 25 students by Medly Points. Earn MP to climb the ranks!
        </p>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {entries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="p-4 rounded-2xl bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-[#0EA5E9]" />
            </div>
            <p className="text-lg text-[#0F172A] dark:text-white font-semibold mb-2">
              Be the first to appear on the leaderboard!
            </p>
            <p className="text-sm text-[#64748B] dark:text-gray-400">
              Complete daily tasks and practice to earn MP
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {entries.slice(0, 25).map((entry, index) => (
                <motion.div
                  key={entry.user_id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ 
                    delay: index * 0.03,
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                  }}
                  whileHover={{ y: -2 }}
                  className={`
                    group relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300
                    ${entry.isCurrentUser 
                      ? 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-[#0EA5E9]/40 shadow-[0_4px_16px_rgba(14,165,233,0.15)]' 
                      : 'bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30 dark:hover:border-[#0EA5E9]/40 hover:shadow-[0_4px_16px_rgba(14,165,233,0.1)]'
                    }
                  `}
                >
                  {/* Rank Display */}
                  <div className="flex-shrink-0">
                    {getRankDisplay(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-[#0F172A] dark:text-white truncate">
                        {entry.username}
                      </p>
                      {entry.isCurrentUser && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-[#0EA5E9] text-white rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">💎</span>
                        <span className="font-semibold text-[#0EA5E9]">{entry.mp_points}</span>
                        <span className="text-xs text-[#64748B] dark:text-gray-400">MP</span>
                      </div>
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Flame className="h-4 w-4 text-[#F59E0B]" />
                          <span className="font-semibold text-[#0F172A] dark:text-white">{entry.streak}</span>
                          <span className="text-xs text-[#64748B] dark:text-gray-400">
                            {entry.streak === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trend Icon */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="h-5 w-5 text-[#0EA5E9]" />
                  </div>
                </motion.div>
              ))}
              
              {/* Current user if not in top 25 */}
              {entries.length > 25 && (
                <>
                  <div className="flex items-center gap-3 py-3">
                    <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-gray-700" />
                    <span className="text-[#64748B] dark:text-gray-400 text-sm">⋯</span>
                    <div className="flex-1 h-px bg-[#E2E8F0] dark:bg-gray-700" />
                  </div>
                  
                  {entries.slice(25).map((entry) => (
                    <motion.div
                      key={entry.user_id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-[#0EA5E9]/40 shadow-[0_4px_16px_rgba(14,165,233,0.15)]"
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-10 h-10">
                          <span className="text-lg font-semibold text-[#64748B]">{entry.rank}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-[#0F172A] dark:text-white truncate">
                            {entry.username}
                          </p>
                          <span className="px-2 py-0.5 text-xs font-medium bg-[#0EA5E9] text-white rounded-full">
                            You
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">💎</span>
                            <span className="font-semibold text-[#0EA5E9]">{entry.mp_points}</span>
                            <span className="text-xs text-[#64748B] dark:text-gray-400">MP</span>
                          </div>
                          {entry.streak > 0 && (
                            <div className="flex items-center gap-1.5">
                              <Flame className="h-4 w-4 text-[#F59E0B]" />
                              <span className="font-semibold text-[#0F172A] dark:text-white">{entry.streak}</span>
                              <span className="text-xs text-[#64748B] dark:text-gray-400">
                                {entry.streak === 1 ? 'day' : 'days'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-6 pt-6 border-t border-[#E2E8F0]/50 dark:border-gray-700">
        <p className="text-center text-xs text-[#64748B] dark:text-gray-400 font-medium">
          Updates every 2 minutes • {entries.length > 25 ? '25+' : entries.length} {entries.length === 1 ? 'student' : 'students'}
        </p>
      </div>
    </motion.div>
  );
}
