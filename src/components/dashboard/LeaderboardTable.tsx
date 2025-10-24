import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  Search, 
  ChevronUp, 
  ChevronDown,
  Crown
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
    const interval = setInterval(loadLeaderboardData, 60000);
    return () => clearInterval(interval);
  }, [filterType, userId]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [entries, searchQuery, sortColumn, sortDirection]);

  useEffect(() => {
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
      
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
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

      const { data: exams } = await supabase
        .from('exams')
        .select('user_id')
        .eq('status', 'completed')
        .in('user_id', userIds);

      const mocksMap = new Map<string, number>();
      exams?.forEach(e => {
        mocksMap.set(e.user_id, (mocksMap.get(e.user_id) || 0) + 1);
      });

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

    if (searchQuery.trim()) {
      filtered = filtered.filter(e => 
        e.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      return (aVal - bVal) * multiplier;
    });

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

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-3.5 w-3.5 inline ml-1" /> : 
      <ChevronDown className="h-3.5 w-3.5 inline ml-1" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <div className="w-5 h-5 rounded-full bg-slate-300 dark:bg-slate-600 flex items-center justify-center text-xs font-bold">2</div>;
    if (rank === 3) return <div className="w-5 h-5 rounded-full bg-amber-700/60 flex items-center justify-center text-xs font-bold text-white">3</div>;
    return <span className="text-sm text-muted-foreground font-medium">{rank}</span>;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
      >
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-32 w-full mb-6" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </motion.div>
    );
  }

  const nextMilestone = myStats ? Math.ceil((myStats.quizzes_completed + 1) / 5) * 5 : 5;
  const quizzesUntilMilestone = myStats ? nextMilestone - myStats.quizzes_completed : 5;

  return (
    <>
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
        >
          {/* Animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-8 w-8 text-[#0EA5E9]" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-[#0EA5E9] to-[#0EA5E9]/70 bg-clip-text text-transparent">
                  Leaderboard
                </h2>
              </div>
              <p className="text-muted-foreground">
                Track your progress and compete with top students
              </p>
            </div>

            {/* My Stats Card */}
            {myStats && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-[#0EA5E9]/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Your Stats</h3>
                  <Badge className="bg-[#0EA5E9] text-white">
                    #{myStats.rank}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-3 rounded-xl bg-white/80 dark:bg-gray-900/50 cursor-help">
                        <div className="text-2xl font-bold text-[#0EA5E9]">{myStats.mp_points}</div>
                        <div className="text-xs text-muted-foreground mt-1">MP</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Mentiora Points earned</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-3 rounded-xl bg-white/80 dark:bg-gray-900/50 cursor-help">
                        <div className="text-2xl font-bold text-orange-500">{myStats.current_streak}</div>
                        <div className="text-xs text-muted-foreground mt-1">Day Streak</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Consecutive days studied</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-3 rounded-xl bg-white/80 dark:bg-gray-900/50 cursor-help">
                        <div className="text-2xl font-bold text-green-600">{myStats.badges_earned}</div>
                        <div className="text-xs text-muted-foreground mt-1">Badges</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Achievements earned</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-center p-3 rounded-xl bg-white/80 dark:bg-gray-900/50 cursor-help">
                        <div className="text-2xl font-bold text-blue-600">{myStats.quizzes_completed}</div>
                        <div className="text-xs text-muted-foreground mt-1">Quizzes</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Quizzes completed this week</TooltipContent>
                  </Tooltip>
                </div>

                {quizzesUntilMilestone > 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Complete <span className="font-semibold text-[#0EA5E9]">{quizzesUntilMilestone}</span> more quiz{quizzesUntilMilestone !== 1 ? 'es' : ''} to reach your next milestone
                  </p>
                )}
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('week')}
                  className={cn(
                    "rounded-full transition-all",
                    filterType === 'week' && "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
                  )}
                >
                  This Week
                </Button>
                <Button
                  variant={filterType === 'alltime' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('alltime')}
                  className={cn(
                    "rounded-full transition-all",
                    filterType === 'alltime' && "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90"
                  )}
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
                  className="pl-10 rounded-xl"
                />
              </div>
            </div>

            {/* Table */}
            {filteredEntries.length === 0 ? (
              <div className="text-center py-16">
                <Trophy className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
                <p className="text-lg text-muted-foreground">
                  {searchQuery ? 'No matches found' : 'Complete your first quiz to appear on the leaderboard'}
                </p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[500px] rounded-2xl border border-[#0EA5E9]/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
                <Table>
                  <TableHeader className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-10">
                    <TableRow className="hover:bg-transparent border-b border-[#0EA5E9]/10">
                      <TableHead className="w-16 font-semibold">Rank</TableHead>
                      <TableHead className="font-semibold">Username</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold"
                        onClick={() => handleSort('mp_points')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              MP <SortIcon column="mp_points" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Sort by Mentiora Points</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold"
                        onClick={() => handleSort('current_streak')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              Streak <SortIcon column="current_streak" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Sort by streak days</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="font-semibold">Badges</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold"
                        onClick={() => handleSort('quizzes_completed')}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="flex items-center">
                              Quizzes <SortIcon column="quizzes_completed" />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>Sort by quizzes completed</TooltipContent>
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
                            "cursor-pointer transition-all duration-200 hover:bg-[#0EA5E9]/5 border-b border-[#0EA5E9]/5",
                            entry.isCurrentUser && "bg-[#0EA5E9]/10 hover:bg-[#0EA5E9]/15 border-l-4 border-l-[#0EA5E9]"
                          )}
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center justify-center">
                              {getRankBadge(entry.rank)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {entry.username}
                            {entry.isCurrentUser && (
                              <Badge variant="secondary" className="ml-2 text-xs bg-[#0EA5E9]/20 text-[#0EA5E9]">You</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-[#0EA5E9]">{entry.mp_points}</span>
                          </TableCell>
                          <TableCell>
                            {entry.current_streak > 0 ? (
                              <span className="font-medium">{entry.current_streak}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.badges_earned > 0 ? (
                              <span className="font-medium">{entry.badges_earned}</span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium">{entry.quizzes_completed}</span>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              Ranks update every hour • {filteredEntries.length} student{filteredEntries.length !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.div>
      </TooltipProvider>

      {/* User Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="bg-white dark:bg-gray-900">
          {selectedUser && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0EA5E9]/10">
                    {getRankBadge(selectedUser.rank)}
                  </div>
                  <span>{selectedUser.username}</span>
                </SheetTitle>
                <SheetDescription>
                  Detailed performance overview
                </SheetDescription>
              </SheetHeader>

              <div className="mt-8 space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#0EA5E9]/5 border border-[#0EA5E9]/20">
                  <p className="text-sm text-muted-foreground mb-1">MP Points</p>
                  <p className="text-3xl font-bold text-[#0EA5E9]">{selectedUser.mp_points}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Streak</p>
                    <p className="text-2xl font-bold">{selectedUser.current_streak} days</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Badges</p>
                    <p className="text-2xl font-bold">{selectedUser.badges_earned}</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Quizzes Completed</p>
                  <p className="text-2xl font-bold">{selectedUser.quizzes_completed}</p>
                </div>

                {selectedUser.top_subject && (
                  <div className="p-4 rounded-xl border">
                    <p className="text-sm font-medium text-muted-foreground">Top Subject</p>
                    <p className="text-lg font-semibold mt-1">{selectedUser.top_subject}</p>
                  </div>
                )}

                <div className="p-4 rounded-xl border">
                  <p className="text-sm font-medium text-muted-foreground">Mocks Completed</p>
                  <p className="text-lg font-semibold mt-1">{selectedUser.mocks_completed || 0}</p>
                </div>

                <div className="p-4 rounded-xl border">
                  <p className="text-sm font-medium text-muted-foreground">Last Active</p>
                  <p className="text-lg font-semibold mt-1">{formatLastActive(selectedUser.last_active)}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
