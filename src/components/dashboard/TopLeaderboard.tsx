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
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const getProfileDisplay = (entry: LeaderEntry) => {
    if (entry.profile_emoji) {
      return <span className="text-3xl">{entry.profile_emoji}</span>;
    }
    const initials = entry.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return <span className="text-sm font-semibold text-muted-foreground">{initials}</span>;
  };

  const topThree = entries.slice(0, 3);
  const restOfLeaderboard = entries.slice(3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Leaderboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Top students nationwide
        </p>
      </div>

      {entries.length === 0 ? (
        <div className="bg-card rounded-2xl p-12 text-center">
          <p className="text-muted-foreground">No students on the leaderboard yet</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div className="bg-card rounded-2xl p-8">
              <div className="flex items-end justify-center gap-6">
                {/* 2nd Place */}
                {topThree[1] && (
                  <div className="flex flex-col items-center flex-1">
                    <div className="mb-4 flex items-center justify-center w-16 h-16">
                      {getProfileDisplay(topThree[1])}
                    </div>
                    <div className="w-full bg-muted/30 rounded-t-xl p-4 text-center" style={{ minHeight: '120px' }}>
                      <div className="text-lg font-bold text-muted-foreground mb-1">#2</div>
                      <p className="font-semibold text-sm text-foreground truncate mb-3">{topThree[1].username}</p>
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-foreground">{topThree[1].mp_points.toLocaleString()}</div>
                        {topThree[1].streak > 0 && (
                          <div className="text-xs text-muted-foreground">🔥 {topThree[1].streak} day streak</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {topThree[0] && (
                  <div className="flex flex-col items-center flex-1">
                    <div className="mb-4 flex items-center justify-center w-20 h-20">
                      {getProfileDisplay(topThree[0])}
                    </div>
                    <div className="w-full bg-primary/10 rounded-t-xl p-5 text-center" style={{ minHeight: '140px' }}>
                      <div className="text-xl font-bold text-primary mb-1">#1</div>
                      <p className="font-bold text-base text-foreground truncate mb-3">{topThree[0].username}</p>
                      <div className="space-y-2">
                        <div className="text-xl font-bold text-foreground">{topThree[0].mp_points.toLocaleString()}</div>
                        {topThree[0].streak > 0 && (
                          <div className="text-sm text-muted-foreground">🔥 {topThree[0].streak} day streak</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {topThree[2] && (
                  <div className="flex flex-col items-center flex-1">
                    <div className="mb-4 flex items-center justify-center w-14 h-14">
                      {getProfileDisplay(topThree[2])}
                    </div>
                    <div className="w-full bg-muted/20 rounded-t-xl p-4 text-center" style={{ minHeight: '100px' }}>
                      <div className="text-base font-bold text-muted-foreground mb-1">#3</div>
                      <p className="font-semibold text-xs text-foreground truncate mb-3">{topThree[2].username}</p>
                      <div className="space-y-2">
                        <div className="text-base font-bold text-foreground">{topThree[2].mp_points.toLocaleString()}</div>
                        {topThree[2].streak > 0 && (
                          <div className="text-xs text-muted-foreground">🔥 {topThree[2].streak}</div>
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
              {restOfLeaderboard.map((entry) => (
                <div
                  key={entry.user_id}
                  className={cn(
                    "bg-card rounded-xl transition-all hover:bg-accent/5",
                    entry.isCurrentUser && "ring-1 ring-primary/20"
                  )}
                >
                  <div className="flex items-center gap-4 px-4 py-3">
                    {/* Rank */}
                    <div className="w-8 text-center">
                      <span className="text-sm font-semibold text-muted-foreground">
                        {entry.rank}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center justify-center w-10 h-10">
                      {getProfileDisplay(entry)}
                    </div>

                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {entry.username}
                      </p>
                      {entry.isCurrentUser && (
                        <span className="text-xs text-primary">You</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3">
                      {entry.streak > 0 && (
                        <span className="text-xs text-muted-foreground">
                          🔥 {entry.streak}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-foreground">
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
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Updates every 2 minutes
        </p>
      </div>
    </div>
  );
}
