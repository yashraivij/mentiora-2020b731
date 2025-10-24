import { useState, useEffect, useRef } from 'react';
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
  Sparkles
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
      <ChevronUp className="h-3.5 w-3.5 inline ml-1 opacity-50" /> : 
      <ChevronDown className="h-3.5 w-3.5 inline ml-1 opacity-50" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="relative"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-500/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20" />
            <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-amber-200" />
            1
          </div>
        </motion.div>
      );
    }
    if (rank === 2) {
      return (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.05 }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center text-slate-700 text-sm font-bold shadow-md shadow-slate-400/40"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/30" />
          2
        </motion.div>
      );
    }
    if (rank === 3) {
      return (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-amber-700/40"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent to-white/20" />
          3
        </motion.div>
      );
    }
    return <span className="text-sm text-muted-foreground font-medium">{rank}</span>;
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
      >
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-10 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
        >
          {/* Premium animated background elements */}
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-[#0EA5E9]/5 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-80 h-80 bg-[#0EA5E9]/3 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />

          <div className="relative z-10">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-[#0EA5E9]/10 backdrop-blur-sm">
                  <Trophy className="h-6 w-6 text-[#0EA5E9]" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Leaderboard
                </h2>
              </div>
              <p className="text-muted-foreground text-base ml-14">
                See how you rank against other students
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('week')}
                  className={cn(
                    "rounded-full px-6 h-10 transition-all font-medium shadow-sm",
                    filterType === 'week' 
                      ? "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-[#0EA5E9]/25" 
                      : "hover:bg-[#0EA5E9]/5 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30"
                  )}
                >
                  This Week
                </Button>
                <Button
                  variant={filterType === 'alltime' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('alltime')}
                  className={cn(
                    "rounded-full px-6 h-10 transition-all font-medium shadow-sm",
                    filterType === 'alltime' 
                      ? "bg-[#0EA5E9] hover:bg-[#0EA5E9]/90 text-white shadow-[#0EA5E9]/25" 
                      : "hover:bg-[#0EA5E9]/5 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30"
                  )}
                >
                  All Time
                </Button>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl h-10 border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background transition-colors"
                />
              </div>
            </div>

            {/* Table */}
            {filteredEntries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24"
              >
                <div className="inline-flex p-4 rounded-2xl bg-muted/50 mb-4">
                  <Trophy className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <p className="text-base text-muted-foreground">
                  {searchQuery ? 'No matches found' : 'Complete your first quiz to appear here'}
                </p>
              </motion.div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20 backdrop-blur-sm bg-white/40 dark:bg-gray-900/40 shadow-inner">
                <div className="overflow-auto max-h-[600px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-gradient-to-b from-white/95 to-white/90 dark:from-gray-900/95 dark:to-gray-900/90 backdrop-blur-md z-10 border-b border-[#0EA5E9]/10">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-24 font-semibold text-foreground/60 text-xs uppercase tracking-wider">Rank</TableHead>
                        <TableHead className="font-semibold text-foreground/60 text-xs uppercase tracking-wider">Student</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold text-foreground/60 text-xs uppercase tracking-wider"
                          onClick={() => handleSort('mp_points')}
                        >
                          MP <SortIcon column="mp_points" />
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold text-foreground/60 text-xs uppercase tracking-wider"
                          onClick={() => handleSort('current_streak')}
                        >
                          Streak <SortIcon column="current_streak" />
                        </TableHead>
                        <TableHead className="font-semibold text-foreground/60 text-xs uppercase tracking-wider">Badges</TableHead>
                        <TableHead 
                          className="cursor-pointer hover:text-[#0EA5E9] transition-colors font-semibold text-foreground/60 text-xs uppercase tracking-wider"
                          onClick={() => handleSort('quizzes_completed')}
                        >
                          Quizzes <SortIcon column="quizzes_completed" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {filteredEntries.map((entry, index) => {
                          const isTopThree = entry.rank <= 3;
                          return (
                            <motion.tr
                              key={entry.user_id}
                              ref={entry.isCurrentUser ? currentUserRowRef : null}
                              layout
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.02 }}
                              onClick={() => handleRowClick(entry)}
                              className={cn(
                                "cursor-pointer transition-all duration-300 border-b border-border/30",
                                "hover:bg-gradient-to-r hover:from-[#0EA5E9]/5 hover:to-transparent hover:shadow-sm",
                                entry.isCurrentUser && "bg-gradient-to-r from-[#0EA5E9]/10 via-[#0EA5E9]/5 to-transparent shadow-sm",
                                isTopThree && "hover:from-[#0EA5E9]/8"
                              )}
                            >
                              <TableCell className="py-5">
                                <div className="flex items-center justify-center">
                                  {getRankBadge(entry.rank)}
                                </div>
                              </TableCell>
                              <TableCell className="font-medium text-foreground py-5">
                                <div className="flex items-center gap-2">
                                  {entry.username}
                                  {entry.isCurrentUser && (
                                    <Badge variant="secondary" className="text-xs bg-[#0EA5E9]/15 text-[#0EA5E9] border-0 shadow-sm">
                                      You
                                    </Badge>
                                  )}
                                  {isTopThree && !entry.isCurrentUser && (
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400 opacity-60" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="py-5">
                                <span className="font-bold text-[#0EA5E9] text-base">{entry.mp_points}</span>
                              </TableCell>
                              <TableCell className="py-5">
                                {entry.current_streak > 0 ? (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                    <span className="font-semibold text-sm">{entry.current_streak}</span>
                                    <span className="text-xs opacity-75">🔥</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/40">—</span>
                                )}
                              </TableCell>
                              <TableCell className="py-5">
                                {entry.badges_earned > 0 ? (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400">
                                    <span className="font-semibold text-sm">{entry.badges_earned}</span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground/40">—</span>
                                )}
                              </TableCell>
                              <TableCell className="py-5">
                                <span className="font-semibold text-foreground">{entry.quizzes_completed}</span>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
              <p className="text-xs text-muted-foreground/60 px-4">
                Updates hourly • {filteredEntries.length} {filteredEntries.length === 1 ? 'student' : 'students'}
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            </div>
          </div>
        </motion.div>
      </TooltipProvider>

      {/* Premium User Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50">
          {selectedUser && (
            <>
              <SheetHeader className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  {getRankBadge(selectedUser.rank)}
                  <div>
                    <SheetTitle className="text-2xl mb-1">{selectedUser.username}</SheetTitle>
                    <SheetDescription className="text-sm">Performance details</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/15 via-[#0EA5E9]/10 to-[#0EA5E9]/5 border border-[#0EA5E9]/20 shadow-lg"
                >
                  <p className="text-sm font-medium text-[#0EA5E9]/70 mb-2">Mentiora Points</p>
                  <p className="text-5xl font-bold text-[#0EA5E9]">{selectedUser.mp_points}</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-800/50 border border-border/50 shadow-sm"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Streak</p>
                    <p className="text-3xl font-bold text-foreground">{selectedUser.current_streak}</p>
                    <p className="text-xs text-muted-foreground mt-1">consecutive days</p>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-800/50 border border-border/50 shadow-sm"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Badges</p>
                    <p className="text-3xl font-bold text-foreground">{selectedUser.badges_earned}</p>
                    <p className="text-xs text-muted-foreground mt-1">achievements</p>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-800/50 border border-border/50 shadow-sm"
                >
                  <p className="text-sm text-muted-foreground mb-2">Quizzes Completed</p>
                  <p className="text-3xl font-bold text-foreground">{selectedUser.quizzes_completed}</p>
                </motion.div>

                {selectedUser.top_subject && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="p-5 rounded-2xl border border-border/50 bg-white dark:bg-gray-800/30"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-1">Top Subject</p>
                    <p className="text-lg font-semibold">{selectedUser.top_subject}</p>
                  </motion.div>
                )}

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-5 rounded-2xl border border-border/50 bg-white dark:bg-gray-800/30"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">Mocks Completed</p>
                  <p className="text-lg font-semibold">{selectedUser.mocks_completed || 0}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="p-5 rounded-2xl border border-border/50 bg-white dark:bg-gray-800/30"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">Last Active</p>
                  <p className="text-lg font-semibold">{formatLastActive(selectedUser.last_active)}</p>
                </motion.div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
