import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Medal, Flame, TrendingUp, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LeaderboardEntry {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  mp_points: number;
  streak_days: number;
  rank: number;
}

interface DashboardLeaderboardProps {
  currentUserId?: string;
}

export function DashboardLeaderboard({ currentUserId }: DashboardLeaderboardProps) {
  const [topUsers, setTopUsers] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboardData();
  }, [currentUserId]);

  const fetchLeaderboardData = async () => {
    try {
      setIsLoading(true);

      // Get user points
      const { data: userPoints, error: pointsError } = await supabase
        .from("user_points")
        .select("user_id, total_points")
        .gt("total_points", 0)
        .order("total_points", { ascending: false });

      if (pointsError || !userPoints || userPoints.length === 0) {
        setTopUsers([]);
        setIsLoading(false);
        return;
      }

      const userIds = userPoints.map((p) => p.user_id);

      // Get profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, email, full_name, username, avatar_url")
        .in("id", userIds)
        .not("email", "is", null);

      if (profilesError || !profilesData) {
        setTopUsers([]);
        setIsLoading(false);
        return;
      }

      // Build leaderboard entries
      const entries: LeaderboardEntry[] = [];
      let currentUserEntry: LeaderboardEntry | null = null;

      for (const profile of profilesData) {
        if (!profile.email) continue;

        const mp = userPoints.find((p) => p.user_id === profile.id)?.total_points || 0;

        if (mp > 0) {
          const { data: streakData } = await supabase.rpc("get_user_streak", {
            user_uuid: profile.id,
          });

          const displayName = profile.full_name || profile.username || profile.email?.split("@")[0] || "User";

          const entry: LeaderboardEntry = {
            id: profile.id,
            username: displayName,
            display_name: displayName,
            avatar_url: profile.avatar_url,
            mp_points: mp,
            streak_days: streakData || 0,
            rank: 0, // Will be set after sorting
          };

          entries.push(entry);

          if (currentUserId && profile.id === currentUserId) {
            currentUserEntry = entry;
          }
        }
      }

      // Sort and assign ranks
      const sortedEntries = entries.sort((a, b) => b.mp_points - a.mp_points);
      sortedEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setTopUsers(sortedEntries.slice(0, 5));
      
      if (currentUserEntry) {
        const userRank = sortedEntries.find((e) => e.id === currentUserId);
        if (userRank) {
          setCurrentUserRank(userRank);
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setTopUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-amber-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-slate-400" />;
      case 3:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-[#64748B] dark:text-gray-400">{rank}</span>;
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-amber-50/90 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40 border-amber-200/50 dark:border-amber-800/30";
      case 2:
        return "from-slate-50/90 via-gray-50/90 to-slate-50/90 dark:from-slate-950/40 dark:via-gray-950/40 dark:to-slate-950/40 border-slate-200/50 dark:border-slate-800/30";
      case 3:
        return "from-orange-50/90 via-amber-50/90 to-orange-50/90 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-orange-950/40 border-orange-200/50 dark:border-orange-800/30";
      default:
        return "from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border-[#E2E8F0]/50 dark:border-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-muted animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (topUsers.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
            <Trophy className="h-6 w-6 text-[#0EA5E9]" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Top Performers
            </h2>
            <p className="text-sm text-[#64748B] dark:text-gray-400 font-light">
              See who's leading this week
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard?tab=leaderboards")}
          className="text-[#0EA5E9] hover:text-[#0284C7] hover:bg-[#0EA5E9]/10 rounded-xl"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Leaderboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {topUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card
              className={`relative overflow-hidden bg-gradient-to-br ${getRankGradient(
                user.rank
              )} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border`}
              onClick={() => navigate("/dashboard?tab=leaderboards")}
            >
              {/* Premium border for top 3 */}
              {user.rank <= 3 && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-lg p-[1px]">
                  <div className={`bg-gradient-to-br ${getRankGradient(user.rank)} rounded-lg h-full w-full`} />
                </div>
              )}

              <CardContent className="relative p-5">
                <div className="flex flex-col items-center space-y-4">
                  {/* Avatar with rank badge */}
                  <div className="relative">
                    <Avatar className="w-16 h-16 ring-2 ring-white/50 dark:ring-gray-800/50 ring-offset-2 ring-offset-background">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white text-lg font-bold">
                        {user.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Rank badge */}
                    <div
                      className={`absolute -top-1 -left-1 w-7 h-7 ${
                        user.rank === 1
                          ? "bg-gradient-to-br from-amber-500 to-orange-500"
                          : user.rank === 2
                          ? "bg-gradient-to-br from-slate-400 to-slate-600"
                          : user.rank === 3
                          ? "bg-gradient-to-br from-amber-600 to-orange-700"
                          : "bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8]"
                      } rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900`}
                    >
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Active indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <div className="w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full animate-pulse" />
                    </div>
                  </div>

                  {/* User info */}
                  <div className="text-center space-y-2 w-full">
                    <h3 className="font-bold text-sm text-[#0F172A] dark:text-white truncate">
                      {user.display_name || user.username}
                    </h3>

                    {/* MP Points */}
                    <Badge className="bg-[#0EA5E9] hover:bg-[#0EA5E9] text-white border-0 font-bold">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {user.mp_points} MP
                    </Badge>

                    {/* Streak */}
                    {user.streak_days > 0 && (
                      <div className="flex items-center justify-center gap-1 text-xs text-[#64748B] dark:text-gray-400">
                        <Flame className="h-3 w-3 text-orange-500" />
                        <span>{user.streak_days} day streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Current user rank banner (if not in top 5) */}
      {currentUserRank && currentUserRank.rank > 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-r from-[#0EA5E9]/5 to-transparent dark:from-[#0EA5E9]/10 dark:to-transparent border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-10 h-10 ring-2 ring-[#0EA5E9]/30">
                    <AvatarImage src={currentUserRank.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] text-white font-bold">
                      {currentUserRank.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white">Your Rank</p>
                    <p className="text-xs text-[#64748B] dark:text-gray-400">
                      {currentUserRank.display_name || currentUserRank.username}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#0EA5E9]">#{currentUserRank.rank}</p>
                  <Badge className="bg-[#0EA5E9]/10 text-[#0EA5E9] border-0 text-xs">
                    {currentUserRank.mp_points} MP
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
