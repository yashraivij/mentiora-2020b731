import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Flame, TrendingUp, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
  last_active?: Date;
  profile_emoji?: string;
}

type FilterType = 'week' | 'alltime' | 'friends';

export function TopLeaderboard({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState<LeaderEntry | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('alltime');

  useEffect(() => {
    loadTopStudents();
    const interval = setInterval(loadTopStudents, 120000);
    return () => clearInterval(interval);
  }, [userId]);

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
        .select('id, full_name, username, email, profile_emoji')
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

      const { data: quizzes } = await supabase
        .from('quizzes')
        .select('user_id')
        .eq('completed', true)
        .in('user_id', userIds);

      const quizzesMap = new Map<string, number>();
      quizzes?.forEach(q => {
        quizzesMap.set(q.user_id, (quizzesMap.get(q.user_id) || 0) + 1);
      });

      const { data: activities } = await supabase
        .from('user_activities')
        .select('user_id, metadata, created_at')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      const topSubjectMap = new Map<string, string>();
      const lastActiveMap = new Map<string, Date>();
      
      activities?.forEach(a => {
        if (!lastActiveMap.has(a.user_id) && a.created_at) {
          lastActiveMap.set(a.user_id, new Date(a.created_at));
        }
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
          last_active: lastActiveMap.get(up.user_id),
          profile_emoji: profile?.profile_emoji || '😊',
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
            last_active: lastActiveMap.get(userId),
            profile_emoji: profile?.profile_emoji || '😊',
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatLastActive = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-32 w-full" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const topThree = entries.slice(0, 3);
  const restOfLeaderboard = entries.slice(3);

  // Calculate analytics
  const totalUsers = entries.length;
  const avgMP = entries.length > 0 ? Math.round(entries.reduce((sum, e) => sum + e.mp_points, 0) / entries.length) : 0;
  const topStreak = entries.length > 0 ? Math.max(...entries.map(e => e.streak)) : 0;
  const fastestRiser = entries.length > 0 ? entries.reduce((max, e) => (e.weekly_gain || 0) > (max.weekly_gain || 0) ? e : max, entries[0]) : null;

  return (
    <TooltipProvider>
      <div className="space-y-5">
        {/* Header with Filters */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-foreground">
              Leaderboard
            </h2>
            <p className="text-xs text-muted-foreground">
              Top performers across Mentiora. Ranked by Mentiora Points (MP) and streak consistency.
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-6">
            {(['alltime', 'week', 'friends'] as FilterType[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                className={cn(
                  "text-xs font-medium transition-all pb-1 border-b-2",
                  filterType === filter
                    ? "text-[#2F80ED] border-[#2F80ED]"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {filter === 'alltime' ? 'All Time' : filter === 'week' ? 'This Week' : 'Friends'}
              </button>
            ))}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-card rounded-lg p-12 text-center border border-border/50">
            <p className="text-sm text-muted-foreground">
              No rankings yet — complete quizzes or maintain a streak to appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium - Ordered: #2, #1, #3 */}
            {topThree.length > 0 && (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3 items-end">
                  {/* 2nd Place - Left */}
                  {topThree[1] ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="group relative bg-card border border-[#E0ECFF] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom-4 delay-100">
                          {/* Silver Ring Avatar */}
                          <div className="flex justify-center mb-3">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 ring-2 ring-slate-300/50">
                                {getInitials(topThree[1].username)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                2
                              </div>
                            </div>
                          </div>

                          {/* Name */}
                          <p className="text-center font-bold text-xs text-foreground truncate mb-2">
                            {topThree[1].username}
                          </p>

                          {/* MP */}
                          <div className="text-center mb-1.5">
                            <p className="text-lg font-bold text-[#2F80ED]">{topThree[1].mp_points.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">MP</p>
                          </div>

                          {/* Streak */}
                          {topThree[1].streak > 0 && (
                            <div className="flex items-center justify-center gap-1 text-[10px] text-[#7A7A7A]">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span>{topThree[1].streak} days</span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          {topThree[1].top_subject && <p>Top Subject: {topThree[1].top_subject}</p>}
                          {topThree[1].quizzes_completed && <p>Quizzes: {topThree[1].quizzes_completed}</p>}
                          {topThree[1].last_active && <p>Active {formatLastActive(topThree[1].last_active)}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : <div />}

                  {/* 1st Place - Center (Elevated) */}
                  {topThree[0] && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="group relative bg-card border border-[#2F80ED]/30 rounded-lg p-5 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer -mt-4 animate-in slide-in-from-bottom-6">
                          {/* Crown Icon */}
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <div className="w-7 h-7 rounded-full bg-[#2F80ED] flex items-center justify-center shadow-md">
                              <Crown className="h-4 w-4 text-white" />
                            </div>
                          </div>

                          {/* Gold Ring Avatar */}
                          <div className="flex justify-center mb-3 mt-2">
                            <div className="relative">
                              <div className="w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 text-amber-800 ring-3 ring-amber-300/60 shadow-lg">
                                {getInitials(topThree[0].username)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#2F80ED] flex items-center justify-center text-[11px] font-bold text-white shadow-md">
                                1
                              </div>
                            </div>
                          </div>

                          {/* Name */}
                          <p className="text-center font-bold text-sm text-foreground truncate mb-2">
                            {topThree[0].username}
                          </p>

                          {/* MP */}
                          <div className="text-center mb-2">
                            <p className="text-2xl font-bold text-[#2F80ED]">{topThree[0].mp_points.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">MP</p>
                          </div>

                          {/* Streak */}
                          {topThree[0].streak > 0 && (
                            <div className="flex items-center justify-center gap-1.5 text-xs text-[#7A7A7A]">
                              <Flame className="h-3.5 w-3.5 text-orange-500" />
                              <span>{topThree[0].streak} days</span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          {topThree[0].top_subject && <p>Top Subject: {topThree[0].top_subject}</p>}
                          {topThree[0].quizzes_completed && <p>Quizzes: {topThree[0].quizzes_completed}</p>}
                          {topThree[0].last_active && <p>Active {formatLastActive(topThree[0].last_active)}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  {/* 3rd Place - Right */}
                  {topThree[2] ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="group relative bg-card border border-[#E0ECFF] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom-4 delay-200">
                          {/* Bronze Ring Avatar */}
                          <div className="flex justify-center mb-3">
                            <div className="relative">
                              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-orange-200 to-orange-300 text-orange-800 ring-2 ring-orange-300/50">
                                {getInitials(topThree[2].username)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-orange-400 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                3
                              </div>
                            </div>
                          </div>

                          {/* Name */}
                          <p className="text-center font-bold text-xs text-foreground truncate mb-2">
                            {topThree[2].username}
                          </p>

                          {/* MP */}
                          <div className="text-center mb-1.5">
                            <p className="text-lg font-bold text-[#2F80ED]">{topThree[2].mp_points.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">MP</p>
                          </div>

                          {/* Streak */}
                          {topThree[2].streak > 0 && (
                            <div className="flex items-center justify-center gap-1 text-[10px] text-[#7A7A7A]">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span>{topThree[2].streak} days</span>
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          {topThree[2].top_subject && <p>Top Subject: {topThree[2].top_subject}</p>}
                          {topThree[2].quizzes_completed && <p>Quizzes: {topThree[2].quizzes_completed}</p>}
                          {topThree[2].last_active && <p>Active {formatLastActive(topThree[2].last_active)}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : <div />}
                </div>

                {/* Micro Data Strip */}
                <div className="flex items-center justify-center gap-4 text-[10px] text-[#7A7A7A] py-2 border-t border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="h-3 w-3" />
                    <span>Total users ranked: {totalUsers}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>Updated hourly</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3" />
                    <span>Avg MP this week: {avgMP}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Leaderboard Table */}
            {restOfLeaderboard.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Table Header */}
                <div className="grid grid-cols-[50px_1fr_90px_70px_70px_110px] gap-3 px-4 py-2.5 bg-card border-b border-[#F2F4F7]">
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide">Rank</div>
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide">Name</div>
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide text-right">MP</div>
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide text-center">Streak</div>
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide text-center">Quizzes</div>
                  <div className="text-[10px] font-bold text-[#7A7A7A] uppercase tracking-wide text-right">Last Active</div>
                </div>

                {/* Table Rows */}
                <div>
                  {restOfLeaderboard.map((entry, idx) => (
                    <Tooltip key={entry.user_id}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "grid grid-cols-[50px_1fr_90px_70px_70px_110px] gap-3 px-4 py-3 transition-all duration-200 hover:bg-[#FAFBFC] dark:hover:bg-muted/20 border-b border-[#F2F4F7] last:border-0 cursor-pointer group relative",
                            entry.isCurrentUser && "bg-[#2F80ED]/[0.02] hover:bg-[#2F80ED]/[0.04] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#2F80ED]"
                          )}
                        >
                          {/* Rank */}
                          <div className="flex items-center justify-start">
                            <span className={cn(
                              "text-sm font-bold transition-colors",
                              entry.isCurrentUser ? "text-[#2F80ED]" : "text-[#7A7A7A]"
                            )}>
                              {entry.rank}
                            </span>
                          </div>

                          {/* Name with Avatar */}
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-transform group-hover:scale-105",
                              entry.isCurrentUser 
                                ? "bg-[#2F80ED]/10 text-[#2F80ED] ring-1 ring-[#2F80ED]/20" 
                                : "bg-[#F2F4F7] text-[#7A7A7A]"
                            )}>
                              {getInitials(entry.username)}
                            </div>
                            <span className={cn(
                              "text-sm truncate transition-colors",
                              entry.isCurrentUser ? "font-bold text-foreground" : "font-medium text-foreground"
                            )}>
                              {entry.username}
                              {entry.isCurrentUser && <span className="ml-1.5 text-[10px] text-[#2F80ED] font-semibold">(You)</span>}
                            </span>
                          </div>

                          {/* MP */}
                          <div className="flex items-center justify-end">
                            <span className={cn(
                              "text-sm font-bold transition-colors",
                              entry.isCurrentUser ? "text-[#2F80ED]" : "text-foreground"
                            )}>
                              {entry.mp_points.toLocaleString()}
                            </span>
                          </div>

                          {/* Streak */}
                          <div className="flex items-center justify-center">
                            {entry.streak > 0 ? (
                              <div className="flex items-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                <span className="text-xs font-semibold text-[#7A7A7A]">{entry.streak}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-[#7A7A7A]">—</span>
                            )}
                          </div>

                          {/* Quizzes */}
                          <div className="flex items-center justify-center">
                            <span className="text-xs font-medium text-[#7A7A7A]">
                              {entry.quizzes_completed || 0}
                            </span>
                          </div>

                          {/* Last Active */}
                          <div className="flex items-center justify-end">
                            <span className="text-[10px] text-[#7A7A7A]">
                              {formatLastActive(entry.last_active)}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          {entry.top_subject && <p>Top Subject: {entry.top_subject}</p>}
                          {entry.quizzes_completed && <p>Quizzes completed: {entry.quizzes_completed}</p>}
                          {entry.badges_earned && entry.badges_earned > 0 && <p>Badges: {entry.badges_earned}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {/* Footer Stats Row */}
            <div className="grid grid-cols-4 gap-3">
              <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#2F80ED]/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-4 w-4 text-[#2F80ED]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#7A7A7A] mb-0.5">Total Users Ranked</p>
                  <p className="text-sm font-bold text-[#2F80ED] truncate">{totalUsers}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-[#2F80ED]/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-[#2F80ED]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#7A7A7A] mb-0.5">Avg MP This Week</p>
                  <p className="text-sm font-bold text-[#2F80ED] truncate">{avgMP}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Flame className="h-4 w-4 text-orange-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#7A7A7A] mb-0.5">Top Streak</p>
                  <p className="text-sm font-bold text-[#2F80ED] truncate">{topStreak} days</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 bg-card border border-border rounded-lg">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-[#7A7A7A] mb-0.5">Fastest Riser</p>
                  <p className="text-sm font-bold text-[#2F80ED] truncate">+{fastestRiser?.weekly_gain || 0} MP</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
