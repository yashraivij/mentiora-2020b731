import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, Target, TrendingUp, Award, Medal } from 'lucide-react';
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
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="text-lg font-bold text-[#0F172A] dark:text-white">#{rank}</span>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center gap-2">
          <Medal className="h-5 w-5 text-slate-400" />
          <span className="text-lg font-bold text-[#0F172A] dark:text-white">#{rank}</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-orange-400" />
          <span className="text-lg font-bold text-[#0F172A] dark:text-white">#{rank}</span>
        </div>
      );
    }
    return (
      <span className="text-lg font-bold text-[#64748B] dark:text-gray-400">#{rank}</span>
    );
  };

  const getAvatarColor = (username: string) => {
    const colors = [
      'from-blue-500 to-cyan-500',
      'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
    ];
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="rounded-3xl bg-white/90 dark:bg-gray-800/90 p-8 border border-[#E2E8F0]/50 dark:border-gray-700">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-96 mb-6" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
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
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-[#38BDF8]/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
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
                className="text-lg text-[#64748B] dark:text-gray-400 font-light"
              >
                Track your Mentiora Points, streaks, and progress against other students.
              </motion.p>
            </div>
            {currentUserData && currentUserData.streak > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B]/20 to-[#F59E0B]/5 border border-[#F59E0B]/20"
              >
                <Flame className="h-5 w-5 text-[#F59E0B]" />
                <span className="text-lg font-bold text-[#0F172A] dark:text-white">
                  🔥 {currentUserData.streak}-Day Streak
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* User Summary Analytics Row */}
      {currentUserData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <TooltipProvider>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30 shadow-sm hover:shadow-md hover:shadow-[#0EA5E9]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
                        <Trophy className="h-5 w-5 text-[#0EA5E9]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Your Rank</span>
                    </div>
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      #{currentUserData.rank}
                    </motion.span>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Your current position</p>
                  <p className="text-xs text-muted-foreground">Your rank among all active students based on total MP earned</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#16A34A]/20 dark:border-[#16A34A]/30 shadow-sm hover:shadow-md hover:shadow-[#16A34A]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
                        <Target className="h-5 w-5 text-[#16A34A]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Total MP</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      {currentUserData.mp_points.toLocaleString()}
                    </motion.div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Total Mentiora Points</p>
                  <p className="text-xs text-muted-foreground">Earn MP by completing quizzes and quests</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 shadow-sm hover:shadow-md hover:shadow-[#8B5CF6]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5">
                        <TrendingUp className="h-5 w-5 text-[#8B5CF6]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">This Week's Gain</span>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="text-3xl font-bold text-[#0F172A] dark:text-white"
                    >
                      +{currentUserData.weekly_gain || 240}
                    </motion.div>
                    <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1 font-medium">MP earned</div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Weekly progress</p>
                  <p className="text-xs text-muted-foreground">MP gained in the last 7 days</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#F59E0B]/20 dark:border-[#F59E0B]/30 shadow-sm hover:shadow-md hover:shadow-[#F59E0B]/10 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5">
                        <Flame className="h-5 w-5 text-[#F59E0B]" />
                      </div>
                      <span className="text-xs font-semibold text-[#64748B] dark:text-gray-400 uppercase tracking-wider">Streak</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45, type: "spring" }}
                        className="text-3xl font-bold text-[#0F172A] dark:text-white"
                      >
                        {currentUserData.streak}
                      </motion.div>
                      <span className="text-sm text-[#64748B] dark:text-gray-400 font-medium">days 🔥</span>
                    </div>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-medium mb-1">Current streak</p>
                  <p className="text-xs text-muted-foreground">Keep your streak alive for extra MP rewards</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          {/* Progress Bar to Next Rank */}
          {currentUserData && currentUserData.rank > 1 && entries.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-5 border border-[#E2E8F0]/50 dark:border-gray-700"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-[#64748B] dark:text-gray-400">
                    Progress to Rank #{currentUserData.rank - 1}
                  </span>
                  <span className="font-bold text-[#0F172A] dark:text-white">
                    {(() => {
                      const nextRankEntry = entries.find(e => e.rank === currentUserData.rank - 1);
                      const mpToGo = nextRankEntry ? nextRankEntry.mp_points - currentUserData.mp_points : 0;
                      return `${mpToGo > 0 ? mpToGo : 0} MP to go`;
                    })()}
                  </span>
                </div>
                <div className="h-2 bg-[#F1F5F9] dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(() => {
                        const nextRankEntry = entries.find(e => e.rank === currentUserData.rank - 1);
                        if (!nextRankEntry) return 0;
                        const mpToGo = nextRankEntry.mp_points - currentUserData.mp_points;
                        if (mpToGo <= 0) return 100;
                        const progress = (currentUserData.mp_points / nextRankEntry.mp_points) * 100;
                        return Math.min(progress, 100);
                      })()}%`
                    }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 mb-6"
      >
        <Button
          variant={filterType === 'week' ? 'default' : 'outline'}
          onClick={() => setFilterType('week')}
          className={cn(
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'week'
              ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
              : "border-[#E2E8F0] dark:border-gray-700 text-[#64748B] dark:text-gray-400 hover:border-[#0EA5E9]/50 hover:text-[#0EA5E9]"
          )}
        >
          This Week
        </Button>
        <Button
          variant={filterType === 'alltime' ? 'default' : 'outline'}
          onClick={() => setFilterType('alltime')}
          className={cn(
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'alltime'
              ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
              : "border-[#E2E8F0] dark:border-gray-700 text-[#64748B] dark:text-gray-400 hover:border-[#0EA5E9]/50 hover:text-[#0EA5E9]"
          )}
        >
          All Time
        </Button>
        <Button
          variant={filterType === 'friends' ? 'default' : 'outline'}
          onClick={() => setFilterType('friends')}
          className={cn(
            "rounded-xl font-medium transition-all duration-200",
            filterType === 'friends'
              ? "bg-[#0EA5E9] text-white border-[#0EA5E9]"
              : "border-[#E2E8F0] dark:border-gray-700 text-[#64748B] dark:text-gray-400 hover:border-[#0EA5E9]/50 hover:text-[#0EA5E9]"
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
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 px-6 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-[#E2E8F0]/50 dark:border-gray-700"
            >
              <Trophy className="h-16 w-16 mx-auto mb-4 text-[#0EA5E9]/30" />
              <h3 className="text-xl font-semibold text-[#0F172A] dark:text-white mb-2">
                No leaderboard data yet
              </h3>
              <p className="text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
                Complete your first quiz to appear on the leaderboard and earn MP.
              </p>
            </motion.div>
          ) : (
            entries.map((entry, index) => {
              const getBorderClass = () => {
                if (entry.rank === 1) return "border-b-2 border-b-amber-400/50";
                if (entry.rank === 2) return "border-b-2 border-b-slate-300/50";
                if (entry.rank === 3) return "border-b-2 border-b-orange-400/50";
                return "";
              };

              return (
                <TooltipProvider key={entry.user_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={cn(
                          "relative group p-5 rounded-2xl border transition-all duration-200 cursor-pointer",
                          entry.isCurrentUser
                            ? "bg-white dark:bg-gray-800 border-[#0EA5E9] shadow-sm"
                            : "bg-white dark:bg-gray-800 border-[#E2E8F0] dark:border-gray-700 hover:shadow-md hover:-translate-y-0.5",
                          getBorderClass()
                        )}
                      >
                        {/* Left accent line for current user */}
                        {entry.isCurrentUser && (
                          <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#0EA5E9] rounded-r" />
                        )}

                        <div className={cn(
                          "flex items-center gap-4",
                          entry.isCurrentUser && "ml-2"
                        )}>
                          {/* Rank */}
                          <div className="flex-shrink-0 w-12 flex justify-center">
                            {getRankBadge(entry.rank)}
                          </div>

                          {/* Avatar */}
                          <Avatar className="h-12 w-12 border border-[#E2E8F0] dark:border-gray-700">
                            <AvatarFallback className={cn("text-white font-semibold bg-gradient-to-br", getAvatarColor(entry.username))}>
                              {entry.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-[#0F172A] dark:text-white truncate">
                                {entry.username}
                              </h3>
                              {entry.isCurrentUser && (
                                <Badge variant="secondary" className="bg-[#0EA5E9]/10 text-[#0EA5E9] border-0 text-xs px-2 py-0">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[#0F172A] dark:text-white">
                                  {entry.mp_points.toLocaleString()}
                                </span>
                                <span className="font-medium">MP</span>
                              </div>
                              {entry.streak > 0 && (
                                <>
                                  <span>•</span>
                                  <div className="flex items-center gap-1">
                                    <Flame className="h-3 w-3 text-orange-500" />
                                    <span className="font-semibold">{entry.streak} days</span>
                                  </div>
                                </>
                              )}
                              {entry.badges_earned > 0 && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <div className="hidden sm:flex items-center gap-1">
                                    <Trophy className="h-3 w-3 text-amber-500" />
                                    <span className="font-semibold">{entry.badges_earned}</span>
                                  </div>
                                </>
                              )}
                              {entry.quizzes_completed > 0 && (
                                <>
                                  <span className="hidden md:inline">•</span>
                                  <div className="hidden md:flex items-center gap-1">
                                    <Target className="h-3 w-3 text-[#0EA5E9]" />
                                    <span className="font-semibold">{entry.quizzes_completed} quizzes</span>
                                  </div>
                                </>
                              )}
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
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium">
          Ranks update every hour based on total MP earned.
        </p>
      </motion.div>
    </div>
  );
}