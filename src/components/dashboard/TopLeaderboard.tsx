import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, TrendingUp, Award, Target, Clock, ArrowRight, Sparkles } from 'lucide-react';
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

  const formatLastActive = (date?: Date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  const getProgressToNextRank = () => {
    if (!currentUserData || currentUserData.rank === 1) return null;
    const nextRankEntry = entries.find(e => e.rank === currentUserData.rank - 1);
    if (!nextRankEntry) return null;
    
    const mpNeeded = nextRankEntry.mp_points - currentUserData.mp_points;
    return { mpNeeded, nextRank: nextRankEntry.rank };
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

  const progressInfo = getProgressToNextRank();

  return (
    <div className="space-y-6">
      {/* Page Header - Clean & Minimal */}
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Compare your MP, streaks, and quiz progress with other students.
          </p>
        </div>

        {/* Filter Tabs - Minimal with Underline */}
        <div className="flex items-center space-x-6 border-b border-border">
          <button
            onClick={() => setFilterType('week')}
            className={cn(
              "pb-3 px-1 text-sm font-medium transition-colors relative",
              filterType === 'week'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            This Week
            {filterType === 'week' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setFilterType('alltime')}
            className={cn(
              "pb-3 px-1 text-sm font-medium transition-colors relative",
              filterType === 'alltime'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            All Time
            {filterType === 'alltime' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setFilterType('friends')}
            className={cn(
              "pb-3 px-1 text-sm font-medium transition-colors relative",
              filterType === 'friends'
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Friends
            {filterType === 'friends' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Leaderboard Table - League Standings Style */}
      {entries.length === 0 ? (
        <div className="bg-card border border-border rounded-lg shadow-sm p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
            <Trophy className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No data yet</h3>
          <p className="text-sm text-muted-foreground">
            Start completing quizzes to appear on the leaderboard.
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-muted/30 border-b border-border px-6 py-3">
            <div className="grid grid-cols-[60px,1fr,120px,100px,100px,100px] gap-4 items-center">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rank</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Student</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">MP</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Streak</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Quizzes</div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Badges</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {entries.map((entry, index) => {
                const getRankBadgeColor = () => {
                  if (entry.rank === 1) return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
                  if (entry.rank === 2) return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20';
                  if (entry.rank === 3) return 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20';
                  return 'bg-muted text-muted-foreground border-border';
                };

                return (
                  <TooltipProvider key={entry.user_id}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15, delay: index * 0.01 }}
                          className={cn(
                            "group relative px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer",
                            entry.isCurrentUser && "bg-primary/5 hover:bg-primary/10"
                          )}
                        >
                          <div className="grid grid-cols-[60px,1fr,120px,100px,100px,100px] gap-4 items-center">
                            {/* Rank */}
                            <div className="flex items-center">
                              <div className={cn(
                                "w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-sm transition-all",
                                getRankBadgeColor()
                              )}>
                                {entry.rank}
                              </div>
                            </div>

                            {/* Student Name */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-foreground truncate">
                                  {entry.username}
                                </h3>
                                {entry.isCurrentUser && (
                                  <Badge variant="outline" className="text-xs px-2 py-0 h-5 border-primary text-primary">
                                    You
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">
                                {entry.top_subject && `${entry.top_subject} • `}
                                Active {formatLastActive(entry.last_active)}
                              </div>
                            </div>

                            {/* MP */}
                            <div className="text-right">
                              <div className="text-base font-bold text-foreground">
                                {entry.mp_points.toLocaleString()}
                              </div>
                            </div>

                            {/* Streak */}
                            <div className="text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="text-base font-semibold text-foreground">{entry.streak}</span>
                              </div>
                            </div>

                            {/* Quizzes */}
                            <div className="text-center">
                              <span className="text-base font-semibold text-foreground">
                                {entry.quizzes_completed || 0}
                              </span>
                            </div>

                            {/* Badges */}
                            <div className="text-center">
                              <span className="text-base font-semibold text-foreground">
                                {entry.badges_earned || 0}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="space-y-1 text-sm">
                          <div className="font-semibold">{entry.username}</div>
                          <div className="text-muted-foreground">Total quizzes: {entry.quizzes_completed || 0}</div>
                          <div className="text-muted-foreground">Badges earned: {entry.badges_earned || 0}</div>
                          {entry.top_subject && (
                            <div className="text-muted-foreground">Most active in: {entry.top_subject}</div>
                          )}
                          <div className="text-muted-foreground">Last active: {formatLastActive(entry.last_active)}</div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <p className="text-xs text-muted-foreground text-center pt-4">
        Ranks update hourly based on MP from quizzes, streaks, and daily quests.
      </p>
    </div>
  );
}
