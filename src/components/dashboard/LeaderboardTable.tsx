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
  Search, 
  ChevronUp, 
  ChevronDown
} from 'lucide-react';
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
      <ChevronUp className="h-3.5 w-3.5 inline ml-1" /> : 
      <ChevronDown className="h-3.5 w-3.5 inline ml-1" />;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
          1
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 flex items-center justify-center text-slate-700 text-sm font-bold shadow-sm">
          2
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 flex items-center justify-center text-white text-sm font-bold shadow-sm">
          3
        </div>
      );
    }
    return <span className="text-sm text-muted-foreground font-medium">{rank}</span>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64 mb-2" />
        <Skeleton className="h-6 w-96 mb-8" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <TooltipProvider>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Leaderboard
            </h2>
            <p className="text-muted-foreground">
              See how you rank against other students this week
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={filterType === 'week' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('week')}
              >
                This Week
              </Button>
              <Button
                variant={filterType === 'alltime' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('alltime')}
              >
                All Time
              </Button>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          {filteredEntries.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg border">
              <p className="text-muted-foreground">
                {searchQuery ? 'No matches found. Try a different search.' : 'Complete your first quiz to appear on the leaderboard'}
              </p>
            </div>
          ) : (
            <div className="bg-card rounded-lg border overflow-hidden">
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort('mp_points')}
                      >
                        MP <SortIcon column="mp_points" />
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort('current_streak')}
                      >
                        Streak <SortIcon column="current_streak" />
                      </TableHead>
                      <TableHead>Badges</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleSort('quizzes_completed')}
                      >
                        Quizzes <SortIcon column="quizzes_completed" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.map((entry) => (
                      <TableRow
                        key={entry.user_id}
                        ref={entry.isCurrentUser ? currentUserRowRef : null}
                        onClick={() => handleRowClick(entry)}
                        className={cn(
                          "cursor-pointer",
                          entry.isCurrentUser && "bg-primary/5"
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            {getRankBadge(entry.rank)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm",
                              entry.isCurrentUser 
                                ? "bg-primary/10 text-primary border-2 border-primary"
                                : "bg-muted text-muted-foreground"
                            )}>
                              {entry.username.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className={cn(
                                "font-medium",
                                entry.isCurrentUser && "text-primary"
                              )}>
                                {entry.username}
                                {entry.isCurrentUser && (
                                  <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    You
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span className="font-semibold text-primary">
                              {entry.mp_points.toLocaleString()}
                            </span>
                            <span className="text-xs text-muted-foreground">MP</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={entry.current_streak >= 7 ? "default" : "secondary"}
                            className="font-medium"
                          >
                            🔥 {entry.current_streak}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge variant="outline" className="font-medium">
                                🏆 {entry.badges_earned}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{entry.badges_earned} badges earned</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">
                            {entry.quizzes_completed}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </TooltipProvider>

      {/* User Detail Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full sm:w-[420px] overflow-y-auto">
          <SheetHeader className="space-y-4 pb-6 border-b">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg",
                selectedUser?.isCurrentUser
                  ? "bg-primary/10 text-primary border-2 border-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {selectedUser?.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <SheetTitle className="text-xl font-bold">
                  {selectedUser?.username}
                </SheetTitle>
                <SheetDescription className="mt-1">
                  Rank #{selectedUser?.rank}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="py-6 space-y-6">
            {/* MP Points Card */}
            <div className="bg-card rounded-lg p-5 border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">MP Points</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedUser?.mp_points.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Streak */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground mb-2">Streak</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔥</span>
                  <span className="text-xl font-bold">
                    {selectedUser?.current_streak}
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground mb-2">Badges</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-xl font-bold">
                    {selectedUser?.badges_earned}
                  </span>
                </div>
              </div>

              {/* Quizzes */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground mb-2">Quizzes</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-xl font-bold">
                    {selectedUser?.quizzes_completed}
                  </span>
                </div>
              </div>

              {/* Top Subject */}
              <div className="bg-card rounded-lg p-4 border">
                <div className="text-sm text-muted-foreground mb-2">Top Subject</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <span className="text-sm font-medium truncate">
                    {selectedUser?.top_subject || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Mocks Completed</span>
                <span className="text-sm font-semibold">
                  {selectedUser?.mocks_completed || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 px-4 bg-muted/50 rounded-lg">
                <span className="text-sm text-muted-foreground">Last Active</span>
                <span className="text-sm font-semibold">
                  {formatLastActive(selectedUser?.last_active)}
                </span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
