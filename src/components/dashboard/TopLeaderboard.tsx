import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Flame, TrendingUp } from 'lucide-react';
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
      <div className="space-y-6">
        {/* Header with Filters */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">
              Leaderboard
            </h2>
            <p className="text-sm text-muted-foreground">
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
                  "text-sm font-medium transition-all pb-1",
                  filterType === filter
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter === 'alltime' ? 'All Time' : filter === 'week' ? 'This Week' : 'Friends'}
              </button>
            ))}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="bg-[#F6F8FA] dark:bg-muted/30 rounded-lg p-12 text-center border border-border/50">
            <p className="text-sm text-muted-foreground">
              No rankings yet — complete a quiz to appear on the leaderboard.
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Hero Strip */}
            {topThree.length > 0 && (
              <div className="grid grid-cols-3 gap-4">
                {topThree.map((entry, idx) => (
                  <Tooltip key={entry.user_id}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "group relative bg-card border rounded-lg p-4 transition-all duration-300 hover:shadow-lg cursor-pointer",
                          idx === 0 && "bg-[#2F80ED]/[0.02] border-[#2F80ED]/20",
                          idx === 1 && "bg-muted/30 border-border",
                          idx === 2 && "bg-muted/20 border-border"
                        )}
                      >
                        {/* Rank Badge */}
                        <div className={cn(
                          "absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm",
                          idx === 0 && "bg-[#2F80ED] text-white",
                          idx === 1 && "bg-muted text-muted-foreground",
                          idx === 2 && "bg-muted text-muted-foreground"
                        )}>
                          {idx + 1}
                        </div>

                        {/* Crown for #1 */}
                        {idx === 0 && (
                          <Crown className="absolute top-3 left-3 h-4 w-4 text-[#2F80ED]" />
                        )}

                        {/* Avatar */}
                        <div className="flex justify-center mb-3">
                          <div className={cn(
                            "w-16 h-16 rounded-full flex items-center justify-center text-sm font-bold transition-transform group-hover:scale-105",
                            idx === 0 && "bg-[#2F80ED]/10 text-[#2F80ED] ring-2 ring-[#2F80ED]/20",
                            idx === 1 && "bg-muted text-muted-foreground",
                            idx === 2 && "bg-muted text-muted-foreground"
                          )}>
                            {getInitials(entry.username)}
                          </div>
                        </div>

                        {/* Name */}
                        <p className={cn(
                          "text-center font-semibold text-sm mb-2 truncate",
                          idx === 0 && "text-foreground"
                        )}>
                          {entry.username}
                        </p>

                        {/* Stats */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-xs text-muted-foreground">MP</span>
                            <span className={cn(
                              "font-bold text-sm",
                              idx === 0 && "text-[#2F80ED]"
                            )}>
                              {entry.mp_points.toLocaleString()}
                            </span>
                          </div>
                          
                          {entry.streak > 0 && (
                            <div className="flex items-center justify-center gap-1.5">
                              <Flame className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-muted-foreground">{entry.streak} days</span>
                            </div>
                          )}

                          {entry.quizzes_completed && entry.quizzes_completed > 0 && (
                            <div className="text-xs text-muted-foreground text-center">
                              {entry.quizzes_completed} quizzes
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="text-xs space-y-1">
                        {entry.top_subject && <p>Top Subject: {entry.top_subject}</p>}
                        {entry.last_active && <p>Active {formatLastActive(entry.last_active)}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}

            {/* Leaderboard Table */}
            {restOfLeaderboard.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden bg-card">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-4 px-4 py-3 bg-[#F6F8FA] dark:bg-muted/30 border-b border-border">
                  <div className="text-xs font-medium text-muted-foreground">Rank</div>
                  <div className="text-xs font-medium text-muted-foreground">Name</div>
                  <div className="text-xs font-medium text-muted-foreground text-right">MP</div>
                  <div className="text-xs font-medium text-muted-foreground text-center">Streak</div>
                  <div className="text-xs font-medium text-muted-foreground text-center">Quizzes</div>
                  <div className="text-xs font-medium text-muted-foreground text-right">Last Active</div>
                </div>

                {/* Table Rows */}
                <div>
                  {restOfLeaderboard.map((entry, idx) => (
                    <Tooltip key={entry.user_id}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "grid grid-cols-[60px_1fr_100px_80px_80px_120px] gap-4 px-4 py-3 transition-all duration-200 hover:bg-[#F6F8FA] dark:hover:bg-muted/30 border-b border-border/50 last:border-0 cursor-pointer group",
                            entry.isCurrentUser && "bg-[#2F80ED]/[0.03] hover:bg-[#2F80ED]/[0.05] border-l-2 border-l-[#2F80ED]"
                          )}
                        >
                          {/* Rank */}
                          <div className={cn(
                            "flex items-center justify-center text-sm font-bold",
                            entry.isCurrentUser ? "text-[#2F80ED]" : "text-muted-foreground"
                          )}>
                            {entry.rank}
                          </div>

                          {/* Name with Avatar */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                              entry.isCurrentUser 
                                ? "bg-[#2F80ED]/10 text-[#2F80ED]" 
                                : "bg-muted text-muted-foreground"
                            )}>
                              {getInitials(entry.username)}
                            </div>
                            <span className={cn(
                              "text-sm truncate",
                              entry.isCurrentUser ? "font-semibold text-foreground" : "text-foreground"
                            )}>
                              {entry.username}
                              {entry.isCurrentUser && <span className="ml-2 text-xs text-[#2F80ED]">(You)</span>}
                            </span>
                          </div>

                          {/* MP */}
                          <div className="flex items-center justify-end">
                            <span className={cn(
                              "text-sm font-bold",
                              entry.isCurrentUser && "text-[#2F80ED]"
                            )}>
                              {entry.mp_points.toLocaleString()}
                            </span>
                          </div>

                          {/* Streak */}
                          <div className="flex items-center justify-center">
                            {entry.streak > 0 ? (
                              <div className="flex items-center gap-1">
                                <Flame className="h-3.5 w-3.5 text-orange-500" />
                                <span className="text-sm font-medium">{entry.streak}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-muted-foreground">—</span>
                            )}
                          </div>

                          {/* Quizzes */}
                          <div className="flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              {entry.quizzes_completed || 0}
                            </span>
                          </div>

                          {/* Last Active */}
                          <div className="flex items-center justify-end">
                            <span className="text-xs text-muted-foreground">
                              {formatLastActive(entry.last_active)}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          {entry.top_subject && <p>Top Subject: {entry.top_subject}</p>}
                          {entry.badges_earned && entry.badges_earned > 0 && <p>Badges: {entry.badges_earned}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            )}
            {/* Analytics Bar */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-[#F6F8FA] dark:bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2F80ED]/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-[#2F80ED]" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                  <p className="text-sm font-bold">{totalUsers}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#2F80ED]/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#2F80ED]">MP</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg MP This Week</p>
                  <p className="text-sm font-bold">{avgMP}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Top Streak</p>
                  <p className="text-sm font-bold">{topStreak} days</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Fastest Riser</p>
                  <p className="text-sm font-bold">+{fastestRiser?.weekly_gain || 0} MP</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </TooltipProvider>
  );
}
