import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeaderEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  streak: number;
  isCurrentUser: boolean;
}

export function TopLeaderboard({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopStudents();
    const interval = setInterval(loadTopStudents, 120000); // Refresh every 2 minutes
    return () => clearInterval(interval);
  }, [userId]);

  const loadTopStudents = async () => {
    try {
      setIsLoading(true);

      // Get top 25 users by MP points
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(25);

      if (pointsError || !userPoints) {
        console.error('Error fetching points:', pointsError);
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const userIds = userPoints.map(u => u.user_id);

      // Get user profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, email')
        .in('id', userIds);

      // Get streaks
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

      const leaderboardEntries: LeaderEntry[] = userPoints.map((up, index) => {
        const profile = profiles?.find(p => p.id === up.user_id);
        const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Anonymous';

        return {
          rank: index + 1,
          user_id: up.user_id,
          username: displayName,
          mp_points: up.total_points,
          streak: streaksMap.get(up.user_id) || 0,
          isCurrentUser: up.user_id === userId,
        };
      });

      setEntries(leaderboardEntries);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-500 shadow-lg">
          <Crown className="h-6 w-6 text-amber-900" />
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 shadow-md">
          <Trophy className="h-5 w-5 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 shadow-md">
          <Trophy className="h-5 w-5 text-amber-200" />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-12 h-12">
        <span className="text-2xl font-bold text-muted-foreground">{rank}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="h-6 w-6 text-primary" />
          Top Students
        </CardTitle>
        <CardDescription>
          The top 25 students by Medly Points this week
        </CardDescription>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Be the first to earn points and appear on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.user_id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl transition-all duration-200
                    ${entry.isCurrentUser 
                      ? 'bg-primary/10 border-2 border-primary shadow-md' 
                      : 'bg-muted/30 hover:bg-muted/50'
                    }
                  `}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankDisplay(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-foreground truncate">
                        {entry.username}
                      </p>
                      {entry.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">You</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1.5 text-primary font-semibold">
                        <span className="text-lg">💎</span>
                        <span>{entry.mp_points} MP</span>
                      </div>
                      {entry.streak > 0 && (
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <Flame className="h-4 w-4" />
                          <span className="font-medium">{entry.streak} day{entry.streak !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
