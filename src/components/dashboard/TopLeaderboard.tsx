import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Gem, Sparkles, Crown } from 'lucide-react';
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
  last_active?: Date;
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-orange-600" />;
    return null;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const topThree = entries.slice(0, 3);
  const restOfLeaderboard = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              Compete with students nationwide
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-border/50">
          <button
            onClick={() => setFilterType('week')}
            className={cn(
              "pb-3 px-1 text-sm font-semibold transition-all relative",
              filterType === 'week'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            This Week
            {filterType === 'week' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            )}
          </button>
          <button
            onClick={() => setFilterType('alltime')}
            className={cn(
              "pb-3 px-1 text-sm font-semibold transition-all relative",
              filterType === 'alltime'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Time
            {filterType === 'alltime' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            )}
          </button>
          <button
            onClick={() => setFilterType('friends')}
            className={cn(
              "pb-3 px-1 text-sm font-semibold transition-all relative",
              filterType === 'friends'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Friends
            {filterType === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            )}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="relative overflow-hidden bg-card/80 backdrop-blur-sm rounded-3xl p-12 text-center border-0 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-lg">
              <Trophy className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No data yet</h3>
            <p className="text-sm text-muted-foreground">
              Start completing quizzes to appear on the leaderboard
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl bg-card/80 backdrop-blur-sm border-0 shadow-lg p-6">
              {/* Premium Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-primary/5" />
              
              <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-4">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="relative mb-3">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-lg sm:text-xl font-bold text-white shadow-xl ring-2 ring-slate-300/50 dark:ring-slate-500/30">
                        {getInitials(topThree[1].username)}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-lg">
                        <Medal className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50 backdrop-blur-sm rounded-t-2xl p-3 sm:p-4 text-center border border-slate-200/50 dark:border-slate-700/50 shadow-xl" style={{ minHeight: '140px' }}>
                      <p className="font-bold text-xs sm:text-sm text-foreground truncate mb-2">{topThree[1].username}</p>
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="text-sm font-bold">{topThree[1].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[1].streak > 0 && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400">
                            <span className="text-sm">🔥</span>
                            <span className="text-xs font-bold">{topThree[1].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0s' }}>
                    <div className="relative mb-3">
                      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shadow-2xl ring-2 ring-amber-200/50 dark:ring-yellow-500/30 animate-pulse">
                        {getInitials(topThree[0].username)}
                      </div>
                      <div className="absolute -top-2 -right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-br from-amber-50/90 to-yellow-100/90 dark:from-amber-900/40 dark:to-yellow-800/40 backdrop-blur-sm rounded-t-2xl p-4 sm:p-5 text-center border border-amber-200/50 dark:border-yellow-600/50 shadow-2xl" style={{ minHeight: '165px' }}>
                      <p className="font-bold text-sm sm:text-base text-foreground truncate mb-3">{topThree[0].username}</p>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-base font-bold">{topThree[0].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[0].streak > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400">
                            <span className="text-base">🔥</span>
                            <span className="text-sm font-bold">{topThree[0].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mb-3">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center text-base sm:text-lg font-bold text-white shadow-xl ring-2 ring-orange-300/50 dark:ring-orange-600/30">
                        {getInitials(topThree[2].username)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-lg">
                        <Award className="h-3.5 w-3.5 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-br from-orange-50/80 to-orange-100/80 dark:from-orange-900/40 dark:to-orange-800/40 backdrop-blur-sm rounded-t-2xl p-3 sm:p-4 text-center border border-orange-200/50 dark:border-orange-700/50 shadow-xl" style={{ minHeight: '120px' }}>
                      <p className="font-bold text-xs sm:text-sm text-foreground truncate mb-2">{topThree[2].username}</p>
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary shadow-sm">
                          <Sparkles className="h-3.5 w-3.5" />
                          <span className="text-sm font-bold">{topThree[2].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[2].streak > 0 && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-600 dark:text-orange-400">
                            <span className="text-xs">🔥</span>
                            <span className="text-xs font-bold">{topThree[2].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rest of Leaderboard */}
          {restOfLeaderboard.length > 0 && (
            <div className="space-y-2">
              {restOfLeaderboard.map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl cursor-pointer bg-card/80 backdrop-blur-sm border-0",
                    entry.isCurrentUser && "ring-2 ring-primary/30 shadow-lg shadow-primary/10"
                  )}
                >
                  {/* Background Gradient */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    entry.isCurrentUser 
                      ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                      : "bg-gradient-to-r from-primary/5 via-transparent to-accent/5"
                  )} />

                  <div className="relative z-10 flex items-center gap-4 px-5 py-4">
                    {/* Rank */}
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300",
                      entry.isCurrentUser
                        ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary shadow-md"
                        : "bg-muted/30 text-muted-foreground group-hover:bg-muted/50"
                    )}>
                      {entry.rank}
                    </div>

                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg transition-all duration-300 group-hover:scale-110",
                      entry.isCurrentUser 
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ring-2 ring-primary/30" 
                        : "bg-gradient-to-br from-accent/20 to-accent/10 text-foreground"
                    )}>
                      {getInitials(entry.username)}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate">
                        {entry.username}
                      </h3>
                      {entry.isCurrentUser && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-bold mt-0.5">
                          <span>You</span>
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-orange-600 dark:text-orange-400 shadow-sm border border-orange-200/50 dark:border-orange-800/30">
                          <span>🔥</span>
                          <span className="text-xs font-bold">{entry.streak}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-sm border border-primary/20">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="text-xs font-bold">
                          {entry.mp_points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/30">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <p className="text-xs text-muted-foreground font-medium">
          Ranks update hourly • Earn MP from quizzes, streaks & quests
        </p>
      </div>
    </div>
  );
}
