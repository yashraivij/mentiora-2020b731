import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Flame, Crown, Star, Zap, Medal } from 'lucide-react';
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

      // Get top 25 users by MP points (including 0 points for demo purposes)
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
      
      // Check if current user is in top 25
      const currentUserInTop = userId && userIds.includes(userId);
      
      // If current user is not in top 25, fetch their data separately
      if (userId && !currentUserInTop) {
        const { data: currentUserPoint } = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .eq('user_id', userId)
          .single();
        
        if (currentUserPoint) {
          userIds.push(currentUserPoint.user_id);
        }
      }

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

      // Build leaderboard entries from userPoints
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
        };
      });

      // If current user wasn't in top 25, add them at the end
      if (userId && !currentUserInTop) {
        const { data: allPoints } = await supabase
          .from('user_points')
          .select('total_points')
          .order('total_points', { ascending: false });
        
        const currentUserData = await supabase
          .from('user_points')
          .select('user_id, total_points')
          .eq('user_id', userId)
          .single();

        if (currentUserData.data) {
          const profile = profiles?.find(p => p.id === userId);
          const displayName = profile?.full_name || profile?.username || profile?.email?.split('@')[0] || 'You';
          
          // Calculate actual rank
          const actualRank = (allPoints?.filter(p => p.total_points > currentUserData.data.total_points).length || 0) + 1;

          leaderboardEntries.push({
            rank: actualRank,
            user_id: userId,
            username: displayName,
            mp_points: currentUserData.data.total_points,
            streak: streaksMap.get(userId) || 0,
            isCurrentUser: true,
          });
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

  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <motion.div 
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-xl"
          animate={{ 
            boxShadow: [
              '0 10px 30px rgba(251, 191, 36, 0.3)',
              '0 10px 40px rgba(251, 191, 36, 0.5)',
              '0 10px 30px rgba(251, 191, 36, 0.3)',
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Crown className="h-7 w-7 text-amber-900" />
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-300 rounded-full flex items-center justify-center"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Star className="h-3 w-3 text-amber-800 fill-amber-800" />
          </motion.div>
        </motion.div>
      );
    }
    if (rank === 2) {
      return (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 shadow-lg border-2 border-slate-100">
          <Medal className="h-6 w-6 text-slate-700" />
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-lg border-2 border-orange-300">
          <Medal className="h-6 w-6 text-orange-100" />
        </div>
      );
    }
    if (rank <= 10) {
      return (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 border border-primary/40">
          <span className="text-xl font-bold text-primary">{rank}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-12 h-12">
        <span className="text-xl font-semibold text-muted-foreground/60">{rank}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl bg-gradient-to-br from-background via-muted/30 to-background border border-border/50 overflow-hidden"
      >
        <div className="p-8">
          <Skeleton className="h-10 w-56 mb-3" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="px-8 pb-8 space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full rounded-3xl bg-gradient-to-br from-background via-muted/30 to-background border border-border/50 overflow-hidden shadow-lg"
    >
      {/* Header with gradient */}
      <div className="relative px-8 pt-8 pb-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Trophy className="h-8 w-8 text-primary" />
          </motion.div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Top Students
          </h2>
        </div>
        <p className="text-muted-foreground ml-11">
          Compete with the best students and climb the ranks
        </p>
      </div>

      <div className="p-8">
        {entries.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="relative inline-block mb-6">
              <Trophy className="h-20 w-20 text-muted-foreground/30" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="h-20 w-20 text-primary/20" />
              </motion.div>
            </div>
            <p className="text-lg text-muted-foreground font-medium">
              Be the first to earn points and appear on the leaderboard!
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Complete daily tasks and practice to earn MP
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {entries.slice(0, 25).map((entry, index) => {
                const isTop3 = entry.rank <= 3;
                const isTop10 = entry.rank <= 10;
                
                return (
                  <motion.div
                    key={entry.user_id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      delay: index * 0.02,
                      type: "spring",
                      stiffness: 300,
                      damping: 30
                    }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className={`
                      relative flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 cursor-pointer group
                      ${entry.isCurrentUser 
                        ? 'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-2 border-primary/50 shadow-lg shadow-primary/20' 
                        : isTop3
                        ? 'bg-gradient-to-r from-accent/20 to-transparent border border-accent/30 hover:border-accent/50'
                        : isTop10
                        ? 'bg-gradient-to-r from-muted/60 to-transparent border border-border hover:border-primary/30'
                        : 'bg-muted/40 border border-transparent hover:border-primary/20 hover:bg-muted/60'
                      }
                    `}
                  >
                    {/* Rank Badge */}
                    <div className="flex-shrink-0 relative">
                      {getRankDisplay(entry.rank)}
                      {isTop3 && (
                        <motion.div
                          className="absolute -inset-2 rounded-full bg-gradient-to-r from-amber-400/20 to-transparent blur-xl -z-10"
                          animate={{ opacity: [0.3, 0.6, 0.3] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className={`font-bold text-base truncate ${isTop3 ? 'text-foreground' : 'text-foreground/90'}`}>
                          {entry.username}
                        </p>
                        {entry.isCurrentUser && (
                          <Badge className="text-xs px-2 py-0.5 bg-primary/90 text-primary-foreground border-0">
                            You
                          </Badge>
                        )}
                        {isTop3 && !entry.isCurrentUser && (
                          <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                          <span className="text-base">💎</span>
                          <span className="font-bold text-primary">{entry.mp_points}</span>
                          <span className="text-xs text-muted-foreground font-medium">MP</span>
                        </div>
                        {entry.streak > 0 && (
                          <motion.div 
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20"
                            whileHover={{ scale: 1.05 }}
                          >
                            <Flame className="h-4 w-4 text-orange-500" />
                            <span className="font-bold text-orange-600 dark:text-orange-400">{entry.streak}</span>
                            <span className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                              {entry.streak === 1 ? 'day' : 'days'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Icon */}
                    {!entry.isCurrentUser && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="flex-shrink-0 text-primary/40 group-hover:text-primary transition-colors"
                      >
                        <Zap className="h-5 w-5" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
              
              {/* Show separator and current user if they're not in top 25 */}
              {entries.length > 25 && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-4 py-4"
                  >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-muted/50 border border-border">
                      <span className="text-muted-foreground text-sm font-medium">⋯</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border via-border to-transparent" />
                  </motion.div>
                  
                  {entries.slice(25).map((entry) => (
                    <motion.div
                      key={entry.user_id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-2 border-primary/50 shadow-lg shadow-primary/20"
                    >
                      {/* Rank Badge */}
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 border border-primary/30">
                          <span className="text-xl font-bold text-primary">{entry.rank}</span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p className="font-bold text-base text-foreground truncate">
                            {entry.username}
                          </p>
                          <Badge className="text-xs px-2 py-0.5 bg-primary/90 text-primary-foreground border-0">
                            You
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                            <span className="text-base">💎</span>
                            <span className="font-bold text-primary">{entry.mp_points}</span>
                            <span className="text-xs text-muted-foreground font-medium">MP</span>
                          </div>
                          {entry.streak > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="font-bold text-orange-600 dark:text-orange-400">{entry.streak}</span>
                              <span className="text-xs text-orange-600/70 dark:text-orange-400/70 font-medium">
                                {entry.streak === 1 ? 'day' : 'days'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-8 pb-6">
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
          <p className="text-xs text-muted-foreground font-medium">
            Updates every 2 minutes • {entries.length > 25 ? '25+' : entries.length} {entries.length === 1 ? 'student' : 'students'}
          </p>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
        </div>
      </div>
    </motion.div>
  );
}
