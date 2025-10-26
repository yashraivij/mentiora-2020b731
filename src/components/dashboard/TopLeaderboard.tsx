import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, TrendingUp, Award, Medal, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeaderEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  streak: number;
  isCurrentUser: boolean;
  badges_earned?: number;
  quizzes_completed?: number;
  top_subject?: string;
  weekly_gain?: number;
}

type FilterType = 'week' | 'alltime' | 'friends';

export function TopLeaderboard({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('week');
  const [currentUserData, setCurrentUserData] = useState<LeaderEntry | null>(null);

  useEffect(() => {
    loadTopStudents();
    const interval = setInterval(loadTopStudents, 120000);
    return () => clearInterval(interval);
  }, [userId, filterType]);

  const loadTopStudents = async () => {
    try {
      setIsLoading(true);

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

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
      
      const currentUserInTop = userId && userIds.includes(userId);
      
      if (userId && !currentUserInTop) {
        userIds.push(userId);
      }

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);

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

      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('user_id')
        .in('user_id', userIds);

      const badgesMap = new Map<string, number>();
      achievements?.forEach(a => {
        badgesMap.set(a.user_id, (badgesMap.get(a.user_id) || 0) + 1);
      });

      let quizzesQuery = supabase
        .from('quizzes')
        .select('user_id')
        .eq('completed', true)
        .in('user_id', userIds);

      if (filterType === 'week') {
        quizzesQuery = quizzesQuery.gte('created_at', weekAgo.toISOString());
      }

      const { data: quizzes } = await quizzesQuery;

      const quizzesMap = new Map<string, number>();
      quizzes?.forEach(q => {
        quizzesMap.set(q.user_id, (quizzesMap.get(q.user_id) || 0) + 1);
      });

      const { data: activities } = await supabase
        .from('user_activities')
        .select('user_id, metadata')
        .in('user_id', userIds);

      const topSubjectMap = new Map<string, string>();
      activities?.forEach(a => {
        if (!topSubjectMap.has(a.user_id) && a.metadata && typeof a.metadata === 'object') {
          const metadata = a.metadata as any;
          if (metadata.subject_id) {
            topSubjectMap.set(a.user_id, metadata.subject_id);
          }
        }
      });

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
          badges_earned: badgesMap.get(up.user_id) || 0,
          quizzes_completed: quizzesMap.get(up.user_id) || 0,
          top_subject: topSubjectMap.get(up.user_id),
          weekly_gain: 0,
        };
      });

      if (userId && !currentUserInTop) {
        const { data: allPoints } = await supabase
          .from('user_points')
          .select('total_points')
          .order('total_points', { ascending: false });
        
        const currentUserPointData = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .eq('user_id', userId)
          .single();

        if (currentUserPointData.data) {
          const profile = profiles?.find(p => p.id === userId);
          const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'You';
          
          const actualRank = (allPoints?.filter(p => p.total_points > currentUserPointData.data.total_points).length || 0) + 1;

          const userData: LeaderEntry = {
            rank: actualRank,
            user_id: userId,
            username: displayName,
            mp_points: currentUserPointData.data.total_points,
            streak: streaksMap.get(userId) || 0,
            isCurrentUser: true,
            badges_earned: badgesMap.get(userId) || 0,
            quizzes_completed: quizzesMap.get(userId) || 0,
            top_subject: topSubjectMap.get(userId),
            weekly_gain: 0,
          };

          setCurrentUserData(userData);
        }
      } else if (userId) {
        const userData = leaderboardEntries.find(e => e.user_id === userId);
        if (userData) {
          setCurrentUserData(userData);
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-amber-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-orange-400" />;
    return null;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 border border-[#E2E8F0]/50 dark:border-gray-700">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96 mb-6" />
        </div>
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 md:p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
      >
        {/* Animated background */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
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

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-white mb-3 tracking-tight"
              >
                Leaderboard
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base text-[#64748B] dark:text-gray-400"
              >
                Track your Mentiora Points, streaks, and progress against other students.
              </motion.p>
            </div>

            {/* Inline Stats */}
            {currentUserData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 text-sm"
              >
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-0.5">Your Rank</div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-white">#{currentUserData.rank}</div>
                </div>
                <div className="h-10 w-px bg-[#E2E8F0] dark:bg-gray-700" />
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-0.5">Total MP</div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-white">{currentUserData.mp_points.toLocaleString()}</div>
                </div>
                <div className="h-10 w-px bg-[#E2E8F0] dark:bg-gray-700" />
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-0.5">Streak</div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-[#F59E0B]" />
                    <span className="text-2xl font-bold text-[#0F172A] dark:text-white">{currentUserData.streak}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2"
      >
        <Button
          variant={filterType === 'week' ? 'default' : 'ghost'}
          onClick={() => setFilterType('week')}
          size="sm"
          className={cn(
            "rounded-lg font-medium transition-all duration-200",
            filterType === 'week'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              : "text-[#64748B] dark:text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
          )}
        >
          This Week
        </Button>
        <Button
          variant={filterType === 'alltime' ? 'default' : 'ghost'}
          onClick={() => setFilterType('alltime')}
          size="sm"
          className={cn(
            "rounded-lg font-medium transition-all duration-200",
            filterType === 'alltime'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              : "text-[#64748B] dark:text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
          )}
        >
          All Time
        </Button>
        <Button
          variant={filterType === 'friends' ? 'default' : 'ghost'}
          onClick={() => setFilterType('friends')}
          size="sm"
          className={cn(
            "rounded-lg font-medium transition-all duration-200",
            filterType === 'friends'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90"
              : "text-[#64748B] dark:text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
          )}
        >
          Friends
        </Button>
      </motion.div>

      {/* Leaderboard Table */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-700 overflow-hidden"
        >
          {entries.length === 0 ? (
            <div className="text-center py-20 px-6">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-[#0EA5E9]/30" />
              <h3 className="text-lg font-semibold text-[#0F172A] dark:text-white mb-2">
                No leaderboard data yet
              </h3>
              <p className="text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
                Complete your first quiz to appear on the leaderboard and earn MP.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]/50 dark:divide-gray-700">
              {entries.map((entry, index) => (
                <TooltipProvider key={entry.user_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className={cn(
                          "group relative px-6 py-4 transition-all duration-200 cursor-pointer",
                          entry.isCurrentUser
                            ? "bg-[#0EA5E9]/5"
                            : "hover:bg-white/80 dark:hover:bg-gray-800/80"
                        )}
                      >
                        {/* Left accent line for current user */}
                        {entry.isCurrentUser && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0EA5E9]" />
                        )}

                        <div className="flex items-center gap-6">
                          {/* Rank */}
                          <div className="flex items-center gap-2 w-16">
                            <span className={cn(
                              "text-base font-bold tabular-nums",
                              entry.rank <= 3 ? "text-[#0F172A] dark:text-white" : "text-[#64748B] dark:text-gray-400"
                            )}>
                              {entry.rank}
                            </span>
                            {getRankIcon(entry.rank)}
                          </div>

                          {/* Username */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#0F172A] dark:text-white truncate">
                                {entry.username}
                              </span>
                              {entry.isCurrentUser && (
                                <Badge className="bg-[#0EA5E9]/10 text-[#0EA5E9] border-0 text-xs px-2 py-0 font-medium">
                                  You
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="hidden md:flex items-center gap-8 text-sm">
                            <div className="text-right">
                              <div className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                                {entry.mp_points.toLocaleString()}
                              </div>
                              <div className="text-xs text-[#64748B] dark:text-gray-400">MP</div>
                            </div>

                            {entry.streak > 0 && (
                              <div className="text-right">
                                <div className="flex items-center gap-1 justify-end">
                                  <Flame className="h-3.5 w-3.5 text-[#F59E0B]" />
                                  <span className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                                    {entry.streak}
                                  </span>
                                </div>
                                <div className="text-xs text-[#64748B] dark:text-gray-400">days</div>
                              </div>
                            )}

                            {entry.quizzes_completed > 0 && (
                              <div className="text-right">
                                <div className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                                  {entry.quizzes_completed}
                                </div>
                                <div className="text-xs text-[#64748B] dark:text-gray-400">quizzes</div>
                              </div>
                            )}
                          </div>

                          {/* Mobile Stats */}
                          <div className="md:hidden text-right">
                            <div className="font-bold text-[#0F172A] dark:text-white tabular-nums">
                              {entry.mp_points.toLocaleString()}
                            </div>
                            <div className="text-xs text-[#64748B] dark:text-gray-400">MP</div>
                          </div>
                        </div>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs" side="top">
                      <div className="space-y-1">
                        <p className="font-semibold">{entry.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {entry.top_subject && `Top Subject: ${entry.top_subject} • `}
                          {entry.quizzes_completed} Quizzes Completed
                          {entry.streak > 0 && ` • ${entry.streak}-Day Streak Active`}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-[#64748B] dark:text-gray-400">
          Rankings update hourly based on total MP earned
        </p>
      </motion.div>
    </div>
  );
}