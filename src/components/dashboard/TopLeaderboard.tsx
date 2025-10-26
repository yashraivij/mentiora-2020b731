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
import { Trophy, Flame, TrendingUp, Award, Medal, Crown, Zap, Target, Clock, ChevronUp, ChevronDown, ArrowRight } from 'lucide-react';
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

  const getRankColor = (rank: number) => {
    if (rank === 1) return { bg: "bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/30", border: "border-amber-200 dark:border-amber-800/30", text: "text-amber-600 dark:text-amber-400" };
    if (rank === 2) return { bg: "bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-950/30 dark:to-gray-900/30", border: "border-slate-200 dark:border-slate-800/30", text: "text-slate-600 dark:text-slate-400" };
    if (rank === 3) return { bg: "bg-gradient-to-r from-orange-50 to-red-100 dark:from-orange-950/30 dark:to-red-900/30", border: "border-orange-200 dark:border-orange-800/30", text: "text-orange-600 dark:text-orange-400" };
    return { bg: "bg-muted/20", border: "border-border", text: "text-muted-foreground" };
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-500" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />;
    return null;
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
      {/* Header Card - Premium Style */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-card/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 p-8"
      >
        {/* Premium Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-50" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Leaderboard</h2>
              <p className="text-base text-muted-foreground">
                Compare your MP, streaks, and quiz progress with other students.
              </p>
            </div>
            {currentUserData && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-900/30 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-800/30 shadow-sm">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{currentUserData.streak}-Day Streak</span>
              </div>
            )}
          </div>

          {/* Analytics Grid - Premium Style */}
          {currentUserData && (
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Your Rank</div>
                    <div className="text-2xl font-bold text-foreground">#{currentUserData.rank}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Total MP</div>
                    <div className="text-2xl font-bold text-foreground">{currentUserData.mp_points.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">This Week</div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">+{currentUserData.weekly_gain || 240}</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-900/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-800/30 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
                    <Flame className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Streak</div>
                    <div className="text-2xl font-bold text-foreground">{currentUserData.streak} 🔥</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {progressInfo && (
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Progress to Rank #{progressInfo.nextRank}</span>
                <span className="text-sm font-bold text-primary">{progressInfo.mpNeeded} MP to go</span>
              </div>
              <Progress 
                value={Math.min(100, (currentUserData!.mp_points / (currentUserData!.mp_points + progressInfo.mpNeeded)) * 100)} 
                className="h-3 rounded-full shadow-inner" 
              />
            </div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setFilterType('week')}
              className={cn(
                "rounded-2xl font-semibold transition-all duration-300 px-6 py-3",
                filterType === 'week'
                  ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              This Week
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setFilterType('alltime')}
              className={cn(
                "rounded-2xl font-semibold transition-all duration-300 px-6 py-3",
                filterType === 'alltime'
                  ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              All Time
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => setFilterType('friends')}
              className={cn(
                "rounded-2xl font-semibold transition-all duration-300 px-6 py-3",
                filterType === 'friends'
                  ? "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              Friends
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard Entries - Premium Card Style */}
      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/80 backdrop-blur-sm rounded-3xl border-0 shadow-lg p-16 text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">No leaderboard data yet</h3>
          <p className="text-base text-muted-foreground max-w-md mx-auto">
            Complete your first quiz to appear on the leaderboard and start earning MP.
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => {
              const rankColors = getRankColor(entry.rank);
              const rankIcon = getRankIcon(entry.rank);
              
              return (
                <TooltipProvider key={entry.user_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        whileHover={{ y: -4, scale: 1.01 }}
                        className={cn(
                          "group relative overflow-hidden rounded-3xl bg-card/80 dark:bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer p-6",
                          entry.isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                        )}
                      >
                        {/* Premium Background Gradient */}
                        <div className={cn(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                          entry.rank <= 3 
                            ? "bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
                            : "bg-gradient-to-br from-muted/50 via-transparent to-muted/30"
                        )} />

                        {/* Top 3 Accent Line */}
                        {entry.rank <= 3 && (
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl",
                            entry.rank === 1 && "bg-gradient-to-b from-amber-400 to-amber-600",
                            entry.rank === 2 && "bg-gradient-to-b from-slate-300 to-slate-500",
                            entry.rank === 3 && "bg-gradient-to-b from-orange-400 to-orange-600"
                          )} />
                        )}

                        <div className="relative z-10 flex items-center gap-6">
                          {/* Rank Badge - Premium Style */}
                          <div className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-2xl border shadow-lg flex flex-col items-center justify-center",
                            rankColors.bg, rankColors.border
                          )}>
                            {rankIcon}
                            <span className={cn("text-lg font-bold", rankColors.text)}>#{entry.rank}</span>
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-foreground truncate">{entry.username}</h3>
                              {entry.isCurrentUser && (
                                <Badge className="bg-primary text-primary-foreground border-0 text-xs px-3 py-1 font-semibold shadow-md">
                                  You
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {entry.top_subject && (
                                <div className="flex items-center gap-1.5">
                                  <Target className="h-3.5 w-3.5" />
                                  <span className="font-medium">Top: {entry.top_subject}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="font-medium">{formatLastActive(entry.last_active)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Stats Grid */}
                          <div className="flex items-center gap-6">
                            {/* MP */}
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Zap className="h-4 w-4 text-purple-500" />
                                <span className="text-2xl font-bold text-foreground">{entry.mp_points.toLocaleString()}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Mentiora Points</div>
                            </div>

                            {/* Divider */}
                            <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                            {/* Streak */}
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="text-2xl font-bold text-foreground">{entry.streak}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Day Streak</div>
                            </div>

                            {/* Divider */}
                            <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                            {/* Quizzes */}
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="h-4 w-4 text-blue-500" />
                                <span className="text-2xl font-bold text-foreground">{entry.quizzes_completed || 0}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Quizzes Done</div>
                            </div>

                            {/* Divider */}
                            <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                            {/* Badges */}
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Award className="h-4 w-4 text-amber-500" />
                                <span className="text-2xl font-bold text-foreground">{entry.badges_earned || 0}</span>
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">Badges</div>
                            </div>
                          </div>

                          {/* Arrow Icon */}
                          <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <ArrowRight className="h-6 w-6 text-primary" />
                          </div>
                        </div>

                        {/* Premium Border Glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs p-4">
                      <div className="space-y-2">
                        <div className="font-bold text-base text-foreground">{entry.username}</div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>Total quizzes completed: <span className="font-semibold text-foreground">{entry.quizzes_completed || 0}</span></div>
                          <div>Badges earned: <span className="font-semibold text-foreground">{entry.badges_earned || 0}</span></div>
                          {entry.top_subject && (
                            <div>Most active in: <span className="font-semibold text-foreground">{entry.top_subject}</span></div>
                          )}
                          <div>Last active: <span className="font-semibold text-foreground">{formatLastActive(entry.last_active)}</span></div>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
