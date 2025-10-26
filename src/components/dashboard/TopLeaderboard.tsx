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
  profile_emoji?: string;
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

  const getProfileDisplay = (entry: LeaderEntry) => {
    if (entry.profile_emoji) {
      return <span className="text-2xl">{entry.profile_emoji}</span>;
    }
    const initials = entry.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return initials;
  };

  const topThree = entries.slice(0, 3);
  const restOfLeaderboard = entries.slice(3);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-primary/10 p-6 border border-amber-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/20 to-transparent rounded-full blur-3xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl blur-xl opacity-50 animate-pulse" />
              <div className="relative p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl">
                <Trophy className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                Leaderboard
              </h2>
              <p className="text-sm text-muted-foreground font-medium mt-0.5">
                Rise to the top • Earn glory
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-background/60 backdrop-blur-sm border border-border/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-muted-foreground">LIVE</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="relative mt-6 flex items-center gap-2 p-1 rounded-2xl bg-background/60 backdrop-blur-sm border border-border/50">
          {[
            { type: 'week' as FilterType, label: 'This Week', icon: '📅' },
            { type: 'alltime' as FilterType, label: 'All Time', icon: '⭐' },
            { type: 'friends' as FilterType, label: 'Friends', icon: '👥' }
          ].map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "relative flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
                filterType === type
                  ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/20 rounded-3xl p-12 text-center border border-border/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center shadow-2xl">
              <Trophy className="h-12 w-12 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">The throne awaits</h3>
            <p className="text-sm text-muted-foreground">
              Complete quizzes and build your streak to claim your spot
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card/80 via-card/90 to-amber-500/5 backdrop-blur-xl border border-amber-500/20 shadow-2xl p-8">
              {/* Animated background effects */}
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              
              <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-6">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center flex-1 max-w-[160px] animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="relative mb-4 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300">
                        {getProfileDisplay(topThree[1])}
                      </div>
                      <div className="absolute -top-2 -right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center shadow-xl border-2 border-white dark:border-background">
                        <Medal className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-br from-slate-100/90 via-slate-50/90 to-slate-200/80 dark:from-slate-800/70 dark:via-slate-700/60 dark:to-slate-900/70 backdrop-blur-sm rounded-t-3xl p-4 text-center border-2 border-slate-300/50 dark:border-slate-600/50 shadow-2xl hover:shadow-slate-500/50 transition-all duration-300" style={{ minHeight: '150px' }}>
                      <div className="mb-3">
                        <p className="font-black text-sm sm:text-base text-foreground truncate mb-1">{topThree[1].username}</p>
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300">SILVER</span>
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 shadow-lg">
                          <Gem className="h-4 w-4 text-primary" />
                          <span className="text-base font-black text-primary">{topThree[1].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[1].streak > 0 && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300/50 dark:border-orange-700/50">
                            <span className="text-base">🔥</span>
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{topThree[1].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center flex-1 max-w-[180px] animate-fade-in z-10" style={{ animationDelay: '0s' }}>
                    <div className="relative mb-4 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity animate-pulse" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-5xl sm:text-6xl transform group-hover:scale-110 transition-transform duration-300">
                        {getProfileDisplay(topThree[0])}
                      </div>
                      <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 flex items-center justify-center shadow-2xl border-4 border-white dark:border-background animate-pulse">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      {/* Floating particles */}
                      <div className="absolute -top-2 -left-2 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                      <div className="absolute -bottom-2 -right-2 w-2 h-2 rounded-full bg-yellow-500 animate-ping" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <div className="w-full bg-gradient-to-br from-amber-100/95 via-yellow-50/95 to-orange-100/90 dark:from-amber-900/50 dark:via-yellow-800/50 dark:to-orange-900/50 backdrop-blur-sm rounded-t-3xl p-5 text-center border-4 border-amber-400/50 dark:border-amber-500/50 shadow-2xl hover:shadow-amber-500/50 transition-all duration-300" style={{ minHeight: '180px' }}>
                      <div className="mb-4">
                        <p className="font-black text-base sm:text-lg text-foreground truncate mb-1.5">{topThree[0].username}</p>
                        <span className="inline-block px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-xs font-black text-white shadow-lg">👑 CHAMPION</span>
                      </div>
                      <div className="space-y-2.5">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white shadow-2xl border-2 border-amber-300">
                          <Gem className="h-5 w-5" />
                          <span className="text-lg font-black">{topThree[0].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[0].streak > 0 && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/40 dark:to-red-900/40 border-2 border-orange-400/50 dark:border-orange-600/50 shadow-lg">
                            <span className="text-lg">🔥</span>
                            <span className="text-base font-black text-orange-600 dark:text-orange-400">{topThree[0].streak}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center flex-1 max-w-[150px] animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="relative mb-4 group">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-700 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                      <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl transform group-hover:scale-110 transition-transform duration-300">
                        {getProfileDisplay(topThree[2])}
                      </div>
                      <div className="absolute -top-1.5 -right-1.5 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-700 flex items-center justify-center shadow-xl border-2 border-white dark:border-background">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-br from-orange-100/90 via-orange-50/90 to-orange-200/80 dark:from-orange-900/60 dark:via-orange-800/50 dark:to-orange-900/60 backdrop-blur-sm rounded-t-3xl p-3.5 text-center border-2 border-orange-300/50 dark:border-orange-600/50 shadow-2xl hover:shadow-orange-500/50 transition-all duration-300" style={{ minHeight: '135px' }}>
                      <div className="mb-2.5">
                        <p className="font-black text-xs sm:text-sm text-foreground truncate mb-1">{topThree[2].username}</p>
                        <span className="inline-block px-2 py-1 rounded-lg bg-orange-200 dark:bg-orange-800 text-[10px] font-bold text-orange-700 dark:text-orange-300">BRONZE</span>
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 shadow-lg">
                          <Gem className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-black text-primary">{topThree[2].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[2].streak > 0 && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-300/50 dark:border-orange-700/50">
                            <span className="text-sm">🔥</span>
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{topThree[2].streak}</span>
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
                    "group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer",
                    entry.isCurrentUser 
                      ? "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-2 border-primary/40 shadow-xl shadow-primary/20"
                      : "bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Hover gradient effect */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    entry.isCurrentUser 
                      ? "bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"
                      : "bg-gradient-to-r from-primary/5 via-accent/5 to-transparent"
                  )} />
                  
                  {/* Rank glow for current user */}
                  {entry.isCurrentUser && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/80 to-primary animate-pulse" />
                  )}

                  <div className="relative z-10 flex items-center gap-4 px-5 py-4">
                    {/* Rank Badge */}
                    <div className={cn(
                      "relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl font-black text-base transition-all duration-300",
                      entry.isCurrentUser
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30"
                        : entry.rank <= 10
                        ? "bg-gradient-to-br from-muted to-muted/50 text-foreground font-bold group-hover:from-primary/20 group-hover:to-primary/10"
                        : "bg-muted/30 text-muted-foreground group-hover:bg-muted/50"
                    )}>
                      {entry.rank <= 10 && !entry.isCurrentUser && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                      <span className="relative">{entry.rank}</span>
                    </div>

                    {/* Avatar */}
                    <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center text-3xl transition-all duration-300 group-hover:scale-110">
                      {getProfileDisplay(entry)}
                    </div>

                    {/* Name & Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-foreground truncate mb-0.5">
                        {entry.username}
                      </h3>
                      {entry.isCurrentUser && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-xs font-bold text-primary">That's you!</span>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-br from-orange-100 via-red-50 to-orange-100 dark:from-orange-900/30 dark:via-red-900/20 dark:to-orange-900/30 border border-orange-300/50 dark:border-orange-700/30 shadow-md group-hover:shadow-lg transition-all">
                          <span className="text-base">🔥</span>
                          <span className="text-sm font-black text-orange-600 dark:text-orange-400">{entry.streak}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 shadow-md group-hover:shadow-lg transition-all">
                        <Gem className="h-4 w-4 text-primary" />
                        <span className="text-sm font-black text-primary">
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

      {/* Footer Info */}
      <div className="relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-muted/40 via-muted/30 to-muted/40 backdrop-blur-sm border border-border/30">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-50" />
        <div className="relative flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs text-muted-foreground font-bold">
            Updates every hour • Climb the ranks • Earn MP from quizzes & streaks
          </p>
        </div>
      </div>
    </div>
  );
}
