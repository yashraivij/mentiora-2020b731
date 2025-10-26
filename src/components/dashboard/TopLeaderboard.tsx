import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Medal, Award, Gem, Flame } from 'lucide-react';
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
        <Skeleton className="h-40 w-full rounded-3xl" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-3xl" />
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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1.5">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Compete with other students across the UK
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-6 border-b border-border">
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
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
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center border border-border shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Trophy className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No data yet</h3>
          <p className="text-sm text-muted-foreground">
            Start completing quizzes to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="relative">
              <div className="flex items-end justify-center gap-3 mb-6">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="relative mb-4">
                      <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center text-lg font-bold text-foreground shadow-lg border-2 border-border">
                        {getInitials(topThree[1].username)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shadow-md">
                        <Medal className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                    <div className="w-full bg-card rounded-t-2xl p-5 text-center border border-border shadow-lg hover:shadow-xl transition-shadow" style={{ height: '150px' }}>
                      <div className="mb-3">
                        <p className="font-semibold text-sm text-foreground truncate mb-1">{topThree[1].username}</p>
                        <span className="text-xs text-muted-foreground">2nd Place</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 text-primary mx-auto w-fit">
                          <Gem className="h-4 w-4" />
                          <span className="text-sm font-bold">{topThree[1].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[1].streak > 0 && (
                          <div className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 mx-auto w-fit">
                            <span>🔥</span>
                            <span className="text-xs font-semibold">{topThree[1].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0s' }}>
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center text-xl font-bold text-foreground shadow-2xl border-2 border-yellow-400 dark:border-yellow-500 ring-4 ring-yellow-400/20">
                        {getInitials(topThree[0].username)}
                      </div>
                      <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-card border-2 border-yellow-400 dark:border-yellow-500 flex items-center justify-center shadow-lg">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      </div>
                    </div>
                    <div className="w-full bg-card rounded-t-2xl p-6 text-center border-2 border-yellow-400/50 dark:border-yellow-500/50 shadow-2xl hover:shadow-3xl transition-shadow" style={{ height: '170px' }}>
                      <div className="mb-4">
                        <p className="font-bold text-base text-foreground truncate mb-1">{topThree[0].username}</p>
                        <span className="text-xs font-medium text-yellow-600 dark:text-yellow-500">1st Place</span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground mx-auto w-fit shadow-md">
                          <Gem className="h-5 w-5" />
                          <span className="text-base font-bold">{topThree[0].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[0].streak > 0 && (
                          <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 mx-auto w-fit">
                            <span>🔥</span>
                            <span className="text-sm font-semibold">{topThree[0].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center flex-1 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mb-4">
                      <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center text-base font-bold text-foreground shadow-lg border-2 border-border">
                        {getInitials(topThree[2].username)}
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center shadow-md">
                        <Award className="h-3.5 w-3.5 text-orange-600" />
                      </div>
                    </div>
                    <div className="w-full bg-card rounded-t-2xl p-4 text-center border border-border shadow-lg hover:shadow-xl transition-shadow" style={{ height: '130px' }}>
                      <div className="mb-3">
                        <p className="font-semibold text-sm text-foreground truncate mb-1">{topThree[2].username}</p>
                        <span className="text-xs text-muted-foreground">3rd Place</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary mx-auto w-fit">
                          <Gem className="h-3.5 w-3.5" />
                          <span className="text-sm font-bold">{topThree[2].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[2].streak > 0 && (
                          <div className="flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 mx-auto w-fit">
                            <span className="text-xs">🔥</span>
                            <span className="text-xs font-semibold">{topThree[2].streak}</span>
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
            <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-lg">
              {restOfLeaderboard.map((entry, index) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "flex items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-muted/30 cursor-pointer group",
                    entry.isCurrentUser && "bg-primary/5 border-l-2 border-l-primary",
                    index !== restOfLeaderboard.length - 1 && "border-b border-border/50"
                  )}
                >
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted group-hover:bg-muted/80 transition-colors">
                    <span className="text-sm font-bold text-foreground">
                      {entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm transition-all group-hover:shadow-md",
                    entry.isCurrentUser 
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/20" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {getInitials(entry.username)}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {entry.username}
                    </h3>
                    {entry.isCurrentUser && (
                      <span className="text-xs text-primary font-medium">You</span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex-shrink-0 flex items-center gap-2">
                    {entry.streak > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm">
                        <span>🔥</span>
                        <span className="text-sm font-semibold">{entry.streak}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary/10 text-primary shadow-sm">
                      <Gem className="h-4 w-4" />
                      <span className="text-sm font-bold">
                        {entry.mp_points.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Footer */}
      <p className="text-xs text-muted-foreground text-center">
        ⚡ Ranks update hourly • Earn MP from quizzes, streaks, and daily quests
      </p>
    </div>
  );
}
