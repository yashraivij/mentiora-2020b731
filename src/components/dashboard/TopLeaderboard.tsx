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
import { Trophy, Flame, TrendingUp, Award, Medal, Crown, Zap, Target } from 'lucide-react';
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

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-500/30">
          <Crown className="h-5 w-5 text-white" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 shadow-lg shadow-slate-400/30">
          <Medal className="h-5 w-5 text-white" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/30">
          <Award className="h-5 w-5 text-white" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 border border-[#0EA5E9]/20">
        <span className="text-lg font-bold text-[#0EA5E9]">{rank}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-3xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 border border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96 mb-6" />
        </div>
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
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
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Your Rank</div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-white">#{currentUserData.rank}</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-[#0EA5E9]/0 via-[#0EA5E9]/50 to-[#0EA5E9]/0" />
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Total MP</div>
                  <div className="text-2xl font-bold text-[#0F172A] dark:text-white">{currentUserData.mp_points.toLocaleString()}</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-[#0EA5E9]/0 via-[#0EA5E9]/50 to-[#0EA5E9]/0" />
                <div className="text-right">
                  <div className="text-xs text-[#64748B] dark:text-gray-400 mb-1">Streak</div>
                  <div className="flex items-center gap-1.5 justify-end">
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
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'week'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 shadow-lg shadow-[#0EA5E9]/25"
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
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'alltime'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 shadow-lg shadow-[#0EA5E9]/25"
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
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'friends'
              ? "bg-[#0EA5E9] text-white hover:bg-[#0EA5E9]/90 shadow-lg shadow-[#0EA5E9]/25"
              : "text-[#64748B] dark:text-gray-400 hover:text-[#0EA5E9] hover:bg-[#0EA5E9]/10"
          )}
        >
          Friends
        </Button>
      </motion.div>

      {/* Leaderboard Entries */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filterType}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-3"
        >
          {entries.length === 0 ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-700 p-16 text-center shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 flex items-center justify-center">
                <Trophy className="h-8 w-8 text-[#0EA5E9]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-white mb-2">
                No leaderboard data yet
              </h3>
              <p className="text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
                Complete your first quiz to appear on the leaderboard and earn MP.
              </p>
            </div>
          ) : (
            entries.map((entry, index) => (
              <TooltipProvider key={entry.user_id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ y: -2, scale: 1.005 }}
                      className={cn(
                        "group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg",
                        entry.isCurrentUser
                          ? "border-2 border-[#0EA5E9]/30 shadow-[#0EA5E9]/10"
                          : "border border-[#E2E8F0]/50 dark:border-gray-700 hover:border-[#0EA5E9]/30"
                      )}
                    >
                      {/* Premium shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
                      
                      {/* Blue divider at bottom */}
                      {index < entries.length - 1 && (
                        <div className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-[#0EA5E9]/30 to-transparent" />
                      )}

                      {/* Left accent line for current user */}
                      {entry.isCurrentUser && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#0EA5E9] to-[#38BDF8] rounded-l-2xl" />
                      )}

                      <div className={cn(
                        "flex items-center gap-5 relative z-10",
                        entry.isCurrentUser && "ml-1"
                      )}>
                        {/* Rank Badge */}
                        <div className="flex-shrink-0">
                          {getRankBadge(entry.rank)}
                        </div>

                        {/* Username */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-base text-[#0F172A] dark:text-white truncate">
                              {entry.username}
                            </span>
                            {entry.isCurrentUser && (
                              <Badge className="bg-[#0EA5E9] text-white border-0 text-xs px-2 py-0.5 font-semibold shadow-md shadow-[#0EA5E9]/25">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[#64748B] dark:text-gray-400">
                            <span className="font-medium">{entry.top_subject || 'No activity yet'}</span>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="hidden lg:flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                              <Zap className="h-4 w-4 text-[#16A34A]" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#0F172A] dark:text-white tabular-nums">
                                {entry.mp_points.toLocaleString()}
                              </div>
                              <div className="text-xs text-[#64748B] dark:text-gray-400">MP</div>
                            </div>
                          </div>

                          <div className="h-10 w-px bg-gradient-to-b from-[#0EA5E9]/0 via-[#0EA5E9]/30 to-[#0EA5E9]/0" />

                          {entry.streak > 0 && (
                            <>
                              <div className="flex items-center gap-2">
                                <div className="p-2 rounded-lg bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5">
                                  <Flame className="h-4 w-4 text-[#F59E0B]" />
                                </div>
                                <div>
                                  <div className="font-bold text-sm text-[#0F172A] dark:text-white tabular-nums">
                                    {entry.streak}
                                  </div>
                                  <div className="text-xs text-[#64748B] dark:text-gray-400">days</div>
                                </div>
                              </div>
                              <div className="h-10 w-px bg-gradient-to-b from-[#0EA5E9]/0 via-[#0EA5E9]/30 to-[#0EA5E9]/0" />
                            </>
                          )}

                          {entry.quizzes_completed > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="p-2 rounded-lg bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                                <Target className="h-4 w-4 text-[#0EA5E9]" />
                              </div>
                              <div>
                                <div className="font-bold text-sm text-[#0F172A] dark:text-white tabular-nums">
                                  {entry.quizzes_completed}
                                </div>
                                <div className="text-xs text-[#64748B] dark:text-gray-400">quizzes</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mobile Stats */}
                        <div className="lg:hidden flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                            <Zap className="h-4 w-4 text-[#16A34A]" />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#0F172A] dark:text-white tabular-nums">
                              {entry.mp_points.toLocaleString()}
                            </div>
                            <div className="text-xs text-[#64748B] dark:text-gray-400">MP</div>
                          </div>
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
            ))
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