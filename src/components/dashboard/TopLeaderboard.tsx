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
import { Trophy, Flame, TrendingUp, Award, Medal, Crown, Zap, Target, Clock, ChevronUp, ChevronDown } from 'lucide-react';
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
type SortColumn = 'rank' | 'mp' | 'streak' | 'quizzes';

export function TopLeaderboard({ userId }: { userId?: string }) {
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('week');
  const [currentUserData, setCurrentUserData] = useState<LeaderEntry | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'rank' ? 'asc' : 'desc');
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    let compareValue = 0;
    switch (sortColumn) {
      case 'rank':
        compareValue = a.rank - b.rank;
        break;
      case 'mp':
        compareValue = b.mp_points - a.mp_points;
        break;
      case 'streak':
        compareValue = b.streak - a.streak;
        break;
      case 'quizzes':
        compareValue = (b.quizzes_completed || 0) - (a.quizzes_completed || 0);
        break;
    }
    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-1.5">
          <Crown className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-sm font-bold text-foreground">#{rank}</span>
        </div>
      );
    }
    return <span className="text-sm font-bold text-foreground">#{rank}</span>;
  };

  const getRankAccent = (rank: number) => {
    if (rank === 1) return 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-amber-400 before:to-amber-500 before:rounded-l-lg';
    if (rank === 2) return 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-slate-300 before:to-slate-400 before:rounded-l-lg';
    if (rank === 3) return 'before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-orange-400 before:to-orange-500 before:rounded-l-lg';
    return '';
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
      <div className="space-y-4">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-lg" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const progressInfo = getProgressToNextRank();

  return (
    <div className="space-y-4">
      {/* Header and Analytics Bar */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-xl font-bold text-foreground">Leaderboard</h2>
            {currentUserData && (
              <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1 rounded-full">
                <Flame className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-bold text-primary">{currentUserData.streak}-Day Streak</span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Compare your MP, streaks, and quiz progress with other students.
          </p>
        </div>

        {/* Compact Analytics Bar */}
        {currentUserData && (
          <div className="bg-muted/30 border-b border-border">
            <div className="grid grid-cols-4 divide-x divide-border">
              <div className="px-4 py-3">
                <div className="text-xs text-muted-foreground font-medium mb-0.5">Rank</div>
                <div className="text-lg font-bold text-foreground">#{currentUserData.rank}</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-xs text-muted-foreground font-medium mb-0.5">Total MP</div>
                <div className="text-lg font-bold text-foreground">{currentUserData.mp_points.toLocaleString()}</div>
              </div>
              <div className="px-4 py-3">
                <div className="text-xs text-muted-foreground font-medium mb-0.5">This Week's Gain</div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-lg font-bold text-emerald-500">+{currentUserData.weekly_gain || 240} MP</span>
                </div>
              </div>
              <div className="px-4 py-3">
                <div className="text-xs text-muted-foreground font-medium mb-0.5">Streak</div>
                <div className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-orange-500" />
                  <span className="text-lg font-bold text-foreground">{currentUserData.streak} days 🔥</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            {progressInfo && (
              <div className="px-4 py-2 bg-background/50">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress to Rank #{progressInfo.nextRank}</span>
                  <span className="font-semibold">{progressInfo.mpNeeded} MP to go</span>
                </div>
                <Progress 
                  value={Math.min(100, (currentUserData.mp_points / (currentUserData.mp_points + progressInfo.mpNeeded)) * 100)} 
                  className="h-1.5" 
                />
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-2 bg-muted/20 border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType('week')}
            className={cn(
              "h-8 text-xs font-medium transition-colors rounded-md",
              filterType === 'week'
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            This Week
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType('alltime')}
            className={cn(
              "h-8 text-xs font-medium transition-colors rounded-md",
              filterType === 'alltime'
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            All Time
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterType('friends')}
            className={cn(
              "h-8 text-xs font-medium transition-colors rounded-md",
              filterType === 'friends'
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Friends
          </Button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground">
          <button 
            onClick={() => handleSort('rank')}
            className="col-span-1 flex items-center gap-1 hover:text-foreground transition-colors"
          >
            Rank
            {sortColumn === 'rank' && (
              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <div className="col-span-3 text-left">Name</div>
          <button 
            onClick={() => handleSort('mp')}
            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors justify-end"
          >
            MP
            {sortColumn === 'mp' && (
              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <button 
            onClick={() => handleSort('streak')}
            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors justify-end"
          >
            Streak
            {sortColumn === 'streak' && (
              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <div className="col-span-1 text-center">Badges</div>
          <button 
            onClick={() => handleSort('quizzes')}
            className="col-span-2 flex items-center gap-1 hover:text-foreground transition-colors justify-end"
          >
            Quizzes
            {sortColumn === 'quizzes' && (
              sortDirection === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <div className="col-span-1 text-right">Active</div>
        </div>

        {/* Table Body */}
        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <h3 className="text-base font-semibold text-foreground mb-1">No leaderboard data yet</h3>
            <p className="text-sm text-muted-foreground">Complete your first quiz to appear on the leaderboard.</p>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {sortedEntries.map((entry, index) => (
                <TooltipProvider key={entry.user_id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                          "relative grid grid-cols-12 gap-3 px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group",
                          entry.isCurrentUser && "bg-primary/5 hover:bg-primary/10 border-l-2 border-l-primary",
                          getRankAccent(entry.rank)
                        )}
                      >
                        {/* Rank */}
                        <div className="col-span-1 flex items-center">
                          {getRankDisplay(entry.rank)}
                        </div>

                        {/* Name */}
                        <div className="col-span-3 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground truncate">
                              {entry.username}
                            </span>
                            {entry.isCurrentUser && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">You</Badge>
                            )}
                          </div>
                          {entry.top_subject && (
                            <span className="text-xs text-muted-foreground truncate">
                              Top: {entry.top_subject}
                            </span>
                          )}
                        </div>

                        {/* MP with Progress Bar */}
                        <div className="col-span-2 flex flex-col justify-center items-end">
                          <span className="text-sm font-bold text-foreground">
                            {entry.mp_points.toLocaleString()}
                          </span>
                          <div className="w-full mt-0.5">
                            <Progress 
                              value={Math.min(100, (entry.mp_points / Math.max(...entries.map(e => e.mp_points))) * 100)} 
                              className="h-1"
                            />
                          </div>
                        </div>

                        {/* Streak */}
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                          <span className="text-sm font-semibold text-foreground">{entry.streak}</span>
                        </div>

                        {/* Badges */}
                        <div className="col-span-1 flex items-center justify-center">
                          <div className="flex items-center gap-1">
                            <Award className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-sm font-semibold text-foreground">{entry.badges_earned || 0}</span>
                          </div>
                        </div>

                        {/* Quizzes */}
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <Target className="h-3.5 w-3.5 text-primary" />
                          <span className="text-sm font-semibold text-foreground">{entry.quizzes_completed || 0}</span>
                        </div>

                        {/* Last Active */}
                        <div className="col-span-1 flex items-center justify-end">
                          <span className="text-xs text-muted-foreground">{formatLastActive(entry.last_active)}</span>
                        </div>

                        {/* Hover accent line */}
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-1.5 text-xs">
                        <div className="font-semibold text-foreground">{entry.username}</div>
                        <div className="text-muted-foreground">
                          Total quizzes: {entry.quizzes_completed || 0} | Badges: {entry.badges_earned || 0}
                        </div>
                        {entry.top_subject && (
                          <div className="text-muted-foreground">Most active in: {entry.top_subject}</div>
                        )}
                        <div className="text-muted-foreground">Last active: {formatLastActive(entry.last_active)}</div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
