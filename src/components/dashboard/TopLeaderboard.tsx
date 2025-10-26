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
  const [currentUserData, setCurrentUserData] = useState<LeaderEntry | null>(null);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const getProfileDisplay = (entry: LeaderEntry, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'text-xl',
      md: 'text-3xl',
      lg: 'text-4xl'
    };
    
    if (entry.profile_emoji) {
      return <span className={sizeClasses[size]}>{entry.profile_emoji}</span>;
    }
    const initials = entry.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return <span className="text-sm font-semibold text-muted-foreground">{initials}</span>;
  };

  const topThree = entries.slice(0, 3);
  const restOfLeaderboard = entries.slice(3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Leaderboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Top students nationwide
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-accent/5 rounded-3xl p-16 text-center border border-border/50 shadow-xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">No students on the leaderboard yet</p>
          </div>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5 rounded-3xl p-8 border border-border/50 shadow-xl">
              {/* Premium glass effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/5" />
              
              <div className="relative flex items-end justify-center gap-4 sm:gap-8">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center flex-1 max-w-[140px]">
                    <div className="relative mb-6">
                      <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-2xl ring-1 ring-border/50 backdrop-blur-sm">
                        {getProfileDisplay(topThree[1], 'md')}
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg text-xs font-bold text-accent-foreground">
                        2
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-b from-muted/40 to-muted/20 backdrop-blur-sm rounded-t-3xl p-5 text-center border-t border-x border-border/50 shadow-xl" style={{ minHeight: '140px' }}>
                      <p className="font-bold text-sm text-foreground truncate mb-4">{topThree[1].username}</p>
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-sm shadow-lg">
                          <Gem className="h-3.5 w-3.5 text-primary" />
                          <span className="text-base font-bold text-foreground">{topThree[1].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[1].streak > 0 && (
                          <div className="text-xs font-medium text-muted-foreground">
                            🔥 {topThree[1].streak} day streak
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center flex-1 max-w-[160px]">
                    <div className="relative mb-6">
                      <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-2xl ring-2 ring-primary/30 backdrop-blur-sm">
                        {getProfileDisplay(topThree[0], 'lg')}
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-b from-primary/20 to-primary/5 backdrop-blur-sm rounded-t-3xl p-6 text-center border-t border-x border-primary/30 shadow-2xl" style={{ minHeight: '160px' }}>
                      <p className="font-bold text-base text-foreground truncate mb-4">{topThree[0].username}</p>
                      <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-2xl">
                          <Sparkles className="h-4 w-4" />
                          <span className="text-lg font-bold">{topThree[0].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[0].streak > 0 && (
                          <div className="text-sm font-medium text-muted-foreground">
                            🔥 {topThree[0].streak} day streak
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center flex-1 max-w-[130px]">
                    <div className="relative mb-6">
                      <div className="relative w-18 h-18 rounded-2xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shadow-2xl ring-1 ring-border/50 backdrop-blur-sm">
                        {getProfileDisplay(topThree[2], 'sm')}
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-lg text-xs font-bold text-accent-foreground">
                        3
                      </div>
                    </div>
                    <div className="w-full bg-gradient-to-b from-muted/30 to-muted/10 backdrop-blur-sm rounded-t-3xl p-4 text-center border-t border-x border-border/50 shadow-xl" style={{ minHeight: '120px' }}>
                      <p className="font-semibold text-xs text-foreground truncate mb-3">{topThree[2].username}</p>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-sm shadow-lg">
                          <Gem className="h-3 w-3 text-primary" />
                          <span className="text-sm font-bold text-foreground">{topThree[2].mp_points.toLocaleString()}</span>
                        </div>
                        {topThree[2].streak > 0 && (
                          <div className="text-xs font-medium text-muted-foreground">
                            🔥 {topThree[2].streak}
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
            <div className="space-y-3">
              {restOfLeaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "group relative overflow-hidden bg-gradient-to-r from-card to-card/50 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border border-border/50",
                    entry.isCurrentUser && "ring-2 ring-primary/40 shadow-lg shadow-primary/10 bg-gradient-to-r from-primary/5 to-card/50"
                  )}
                >
                  {/* Subtle hover gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative flex items-center gap-5 px-5 py-4">
                    {/* Rank */}
                    <div className={cn(
                      "flex items-center justify-center min-w-[2.5rem] h-10 rounded-xl font-bold text-sm backdrop-blur-sm transition-all",
                      entry.isCurrentUser
                        ? "bg-gradient-to-br from-primary/20 to-primary/10 text-primary ring-1 ring-primary/30"
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      {entry.rank}
                    </div>

                    {/* Avatar */}
                    <div className={cn(
                      "flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300",
                      entry.isCurrentUser 
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20" 
                        : "bg-muted/30"
                    )}>
                      {getProfileDisplay(entry, 'sm')}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {entry.username}
                      </p>
                      {entry.isCurrentUser && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-0.5">
                          You
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm">
                          <span className="text-sm">🔥</span>
                          <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{entry.streak}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm shadow-sm">
                        <Gem className="h-3.5 w-3.5 text-primary" />
                        <span className="text-sm font-bold text-foreground">
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 px-6 py-4 text-center border border-border/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="relative flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <p className="text-xs font-medium text-muted-foreground">
            Updates every 2 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
