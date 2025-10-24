import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Flame, 
  Award, 
  Target, 
  Search, 
  ChevronUp, 
  ChevronDown,
  Crown,
  Zap,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  current_streak: number;
  badges_earned: number;
  quizzes_completed: number;
  isCurrentUser?: boolean;
  top_subject?: string;
  mocks_completed?: number;
  last_active?: string;
}

type SortColumn = 'mp_points' | 'current_streak' | 'quizzes_completed';
type FilterType = 'week' | 'alltime';

export function LeaderboardTable({ userId }: { userId: string }) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<LeaderboardEntry[]>([]);
  const [myStats, setMyStats] = useState<LeaderboardEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('mp_points');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterType, setFilterType] = useState<FilterType>('week');
  const [selectedUser, setSelectedUser] = useState<LeaderboardEntry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentUserRowRef = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    loadLeaderboardData();
    const interval = setInterval(loadLeaderboardData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [filterType, userId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [entries, searchQuery, sortColumn, sortDirection]);

  useEffect(() => {
    // Auto-scroll to current user's row when data loads
    if (currentUserRowRef.current && !isLoading) {
      const rowRect = currentUserRowRef.current.getBoundingClientRect();
      const tableContainer = currentUserRowRef.current.closest('.overflow-auto');
      
      if (tableContainer) {
        const containerRect = tableContainer.getBoundingClientRect();
        const isVisible = rowRect.top >= containerRect.top && rowRect.bottom <= containerRect.bottom;
        
        if (!isVisible) {
          currentUserRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [isLoading, filteredEntries]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      
      // Determine date filter
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      // Get user points
      const { data: userPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false });

      if (pointsError || !userPoints) {
        console.error('Error fetching points:', pointsError);
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const userIds = userPoints.map(u => u.user_id);

      // Get profile data
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

      // Get badges (achievements)
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select('user_id')
        .in('user_id', userIds);

      const badgesMap = new Map<string, number>();
      achievements?.forEach(a => {
        badgesMap.set(a.user_id, (badgesMap.get(a.user_id) || 0) + 1);
      });

      // Get quizzes completed (filter by week if needed)
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

      // Get activity data for additional details
      const { data: activities } = await supabase
        .from('user_activities')
        .select('user_id, created_at, metadata')
        .in('user_id', userIds)
        .order('created_at', { ascending: false });

      const lastActiveMap = new Map<string, string>();
      const topSubjectMap = new Map<string, string>();
      
      activities?.forEach(a => {
        if (!lastActiveMap.has(a.user_id)) {
          lastActiveMap.set(a.user_id, a.created_at);
        }
        
        if (!topSubjectMap.has(a.user_id) && a.metadata && typeof a.metadata === 'object') {
          const metadata = a.metadata as any;
          if (metadata.subject_id) {
            topSubjectMap.set(a.user_id, metadata.subject_id);
          }
        }
      });

      // Get mocks completed
      const { data: exams } = await supabase
        .from('exams')
        .select('user_id')
        .eq('status', 'completed')
        .in('user_id', userIds);

      const mocksMap = new Map<string, number>();
      exams?.forEach(e => {
        mocksMap.set(e.user_id, (mocksMap.get(e.user_id) || 0) + 1);
      });

      // Build leaderboard entries
      const leaderboardEntries: LeaderboardEntry[] = userPoints.map((up, index) => {
        const profile = profiles?.find(p => p.id === up.user_id);
        const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Anonymous User';
        
        return {
          rank: index + 1,
          user_id: up.user_id,
          username: displayName,
          mp_points: up.total_points,
          current_streak: streaksMap.get(up.user_id) || 0,
          badges_earned: badgesMap.get(up.user_id) || 0,
          quizzes_completed: quizzesMap.get(up.user_id) || 0,
          isCurrentUser: up.user_id === userId,
          top_subject: topSubjectMap.get(up.user_id),
          mocks_completed: mocksMap.get(up.user_id) || 0,
          last_active: lastActiveMap.get(up.user_id),
        };
      });

      setEntries(leaderboardEntries);
      
      // Set current user stats
      const currentUserStats = leaderboardEntries.find(e => e.isCurrentUser);
      setMyStats(currentUserStats || null);
      
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...entries];

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(e => 
        e.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (aVal - bVal) * multiplier;
    });

    // Recalculate ranks after filtering
    filtered = filtered.map((entry, index) => ({ ...entry, rank: index + 1 }));

    setFilteredEntries(filtered);
  };

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const handleRowClick = (entry: LeaderboardEntry) => {
    setSelectedUser(entry);
    setIsDrawerOpen(true);
  };

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 inline ml-1" /> : 
      <ChevronDown className="h-4 w-4 inline ml-1" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-muted-foreground font-semibold">{rank}</span>;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full mb-4" />
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const nextMilestone = myStats ? Math.ceil((myStats.quizzes_completed + 1) / 5) * 5 : 5;
  const quizzesUntilMilestone = myStats ? nextMilestone - myStats.quizzes_completed : 5;

  return (
    <>
      <TooltipProvider>
        <Card className="w-full theme-transition">
          <CardHeader className="space-y-4">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-2">
                <Trophy className="h-8 w-8 text-primary" />
                This Week's Top Students
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Track your progress, compare with others, and keep your streak going strong.
              </CardDescription>
            </div>

            {/* My Stats Card */}
            {myStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    My Stats
                  </h3>
                  <Badge variant="secondary" className="text-sm">
                    Rank #{myStats.rank}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 cursor-help">
                        <Trophy className="h-5 w-5 text-amber-500 mb-1" />
                        <span className="text-2xl font-bold text-foreground">{myStats.rank}</span>
                        <span className="text-xs text-muted-foreground">Rank</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Your current position on the leaderboard</TooltipContent>
                  </Tooltip>

                  <div className="flex flex-col items-center p-3 rounded-lg bg-background/50">
                    <span className="text-xs text-muted-foreground mb-1">Username</span>
                    <span className="text-sm font-semibold text-foreground truncate w-full text-center">
                      {myStats.username}
                    </span>
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 cursor-help">
                        <Zap className="h-5 w-5 text-primary mb-1" />
                        <span className="text-2xl font-bold text-foreground">{myStats.mp_points}</span>
                        <span className="text-xs text-muted-foreground">MP</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Earn MP by completing quizzes, maintaining streaks, and finishing mocks.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 cursor-help">
                        <Flame className="h-5 w-5 text-orange-500 mb-1" />
                        <span className="text-2xl font-bold text-foreground">{myStats.current_streak}</span>
                        <span className="text-xs text-muted-foreground">Streak</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Consecutive days studied. Hit day 7 for a special reward.
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 cursor-help">
                        <Award className="h-5 w-5 text-green-500 mb-1" />
                        <span className="text-2xl font-bold text-foreground">{myStats.badges_earned}</span>
                        <span className="text-xs text-muted-foreground">Badges</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Total badges earned for achievements</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center p-3 rounded-lg bg-background/50 cursor-help">
                        <BookOpen className="h-5 w-5 text-blue-500 mb-1" />
                        <span className="text-2xl font-bold text-foreground">{myStats.quizzes_completed}</span>
                        <span className="text-xs text-muted-foreground">Quizzes</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Total quizzes finished this week</TooltipContent>
                  </Tooltip>
                </div>

                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-sm text-muted-foreground">
                    {quizzesUntilMilestone > 0 ? (
                      <>You're close to your next milestone — complete <span className="font-semibold text-primary">{quizzesUntilMilestone}</span> more quiz{quizzesUntilMilestone !== 1 ? 'es' : ''} today.</>
                    ) : (
                      <>Great work! You've hit your milestone. Keep going!</>
                    )}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('week')}
                  className="rounded-full"
                >
                  This Week
                </Button>
                <Button
                  variant={filterType === 'alltime' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('alltime')}
                  className="rounded-full"
                >
                  All Time
                </Button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  {searchQuery ? 'No matches found. Try a different name or clear filters.' : 'Your leaderboard will appear once you complete your first quiz.'}
                </p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[600px] rounded-lg border">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('mp_points')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              MP <SortIcon column="mp_points" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Earn MP by completing quizzes, maintaining streaks, and finishing mocks.
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('current_streak')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              Current Streak <SortIcon column="current_streak" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Consecutive days studied. Hit day 7 for a special reward.
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>Badges Earned</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Show recent badge names or achievements
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-foreground transition-colors"
                        onClick={() => handleSort('quizzes_completed')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              Quizzes Completed <SortIcon column="quizzes_completed" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            Total quizzes finished this week
                          </TooltipContent>
                        </Tooltip>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="popLayout">
                      {filteredEntries.map((entry) => (
                        <motion.tr
                          key={entry.user_id}
                          ref={entry.isCurrentUser ? currentUserRowRef : null}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => handleRowClick(entry)}
                          className={cn(
                            "cursor-pointer transition-all duration-200 hover:bg-muted/50 group",
                            entry.isCurrentUser && "bg-primary/10 hover:bg-primary/15 border-l-4 border-l-primary"
                          )}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-center">
                              {getRankBadge(entry.rank)}
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {entry.username}
                            {entry.isCurrentUser && (
                              <Badge variant="secondary" className="ml-2 text-xs">You</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-primary" />
                              <span className="font-bold text-primary">{entry.mp_points}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {entry.current_streak > 0 ? (
                              <div className="flex items-center gap-2">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="font-semibold">{entry.current_streak} day{entry.current_streak !== 1 ? 's' : ''}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.badges_earned > 0 ? (
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4 text-green-500" />
                                <span className="font-semibold">{entry.badges_earned}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              <span className="font-semibold">{entry.quizzes_completed}</span>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              Ranks update every hour based on MP.
            </p>
          </CardContent>
        </Card>
      </TooltipProvider>

      {/* User Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent>
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {getRankBadge(selectedUser.rank)}
                  <span>{selectedUser.username}</span>
                </SheetTitle>
                <SheetDescription>
                  Detailed performance overview
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">MP Points</p>
                    <p className="text-2xl font-bold text-primary">{selectedUser.mp_points}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                    <p className="text-2xl font-bold">{selectedUser.current_streak} days</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
                    <p className="text-2xl font-bold">{selectedUser.badges_earned}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Quizzes Completed</p>
                    <p className="text-2xl font-bold">{selectedUser.quizzes_completed}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Top Subject</p>
                    <p className="text-lg font-semibold mt-1">
                      {selectedUser.top_subject || 'No data yet'}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Mocks Completed</p>
                    <p className="text-lg font-semibold mt-1">{selectedUser.mocks_completed || 0}</p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                    <p className="text-lg font-semibold mt-1">
                      {formatLastActive(selectedUser.last_active)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
