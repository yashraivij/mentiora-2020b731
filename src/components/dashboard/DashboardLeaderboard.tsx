import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  mp_points: number;
  current_streak: number;
  isCurrentUser?: boolean;
}

interface DashboardLeaderboardProps {
  userId: string;
}

export function DashboardLeaderboard({ userId }: DashboardLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'alltime'>('week');

  useEffect(() => {
    loadLeaderboard();
  }, [viewMode, userId]);

  const loadLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      const { data: userPoints, error } = await supabase
        .from('user_points')
        .select('user_id, total_points')
        .gt('total_points', 0)
        .order('total_points', { ascending: false })
        .limit(10);

      if (error || !userPoints) {
        console.error('Error fetching leaderboard:', error);
        setEntries([]);
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

      const leaderboardEntries: LeaderboardEntry[] = userPoints.map((up, index) => {
        const profile = profiles?.find(p => p.id === up.user_id);
        const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'Anonymous';
        
        return {
          rank: index + 1,
          user_id: up.user_id,
          username: displayName,
          mp_points: up.total_points,
          current_streak: streaksMap.get(up.user_id) || 0,
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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-[#0EA5E9]/5 dark:from-gray-900 dark:via-gray-900 dark:to-[#0EA5E9]/10 p-8 shadow-[0_8px_32px_rgba(14,165,233,0.12)] border border-[#0EA5E9]/10 dark:border-[#0EA5E9]/20"
    >
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-[#0EA5E9]/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20">
              <Trophy className="h-5 w-5 text-[#0EA5E9]" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Leaderboard</h3>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              onClick={() => setViewMode('week')}
              className="rounded-xl text-xs h-8 px-3"
            >
              This Week
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'alltime' ? 'default' : 'ghost'}
              onClick={() => setViewMode('alltime')}
              className="rounded-xl text-xs h-8 px-3"
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Leaderboard List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No rankings yet. Start earning MP to appear here!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative rounded-2xl p-4 transition-all duration-200 ${
                  entry.isCurrentUser
                    ? 'bg-[#0EA5E9]/10 dark:bg-[#0EA5E9]/20 border-2 border-[#0EA5E9]/30'
                    : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 border border-border/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50">
                    {getRankIcon(entry.rank) || (
                      <span className="text-sm font-bold text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Username */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground truncate">
                        {entry.username}
                      </span>
                      {entry.isCurrentUser && (
                        <Badge variant="secondary" className="text-xs">
                          You
                        </Badge>
                      )}
                    </div>
                    {entry.current_streak > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <span>🔥</span>
                        <span>{entry.current_streak} day streak</span>
                      </div>
                    )}
                  </div>

                  {/* MP Points */}
                  <div className="text-right">
                    <div className="font-bold text-[#0EA5E9] text-lg">
                      {entry.mp_points.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">MP</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
