import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Flame, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  streak_days: number;
}

export function PublicStreakProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublicProfiles();
  }, []);

  const fetchPublicProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .order('streak_days', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching public profiles:', error);
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error in fetchPublicProfiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Streak Leaders</h4>
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-12 h-12 bg-muted animate-pulse rounded-full" />
          ))}
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mb-3">
          <Crown className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          No streak leaders yet
        </p>
        <p className="text-xs text-muted-foreground/80">
          Be the first to reach a 14-day streak!
        </p>
      </div>
    );
  }

  const topProfile = profiles[0];
  const otherProfiles = profiles.slice(1, 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Streak Hall of Fame
        </h4>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 text-amber-500" />
          <span className="text-xs font-medium text-muted-foreground">Elite</span>
        </div>
      </div>

      {/* Top Streak Leader */}
      {topProfile && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 shadow-lg">
            {/* Crown Background */}
            <div className="absolute top-1 right-2 opacity-10">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            
            {/* Premium Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-xl p-[1px]">
              <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 rounded-[11px] h-full w-full" />
            </div>
            
            <CardContent className="relative p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-amber-400 shadow-lg shadow-amber-500/25">
                    <AvatarImage src={topProfile.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-500 text-white font-bold">
                      {topProfile.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-sm bg-gradient-to-r from-amber-700 to-orange-700 dark:from-amber-300 dark:to-orange-300 bg-clip-text text-transparent">
                      {topProfile.display_name || topProfile.username}
                    </h5>
                    <div className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                      <span className="text-xs font-bold text-white">#1</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">@{topProfile.username}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Flame className="h-3 w-3 text-orange-500" />
                    <span className="text-xs font-bold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
                      {topProfile.streak_days} days
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Other Streak Leaders */}
      {otherProfiles.length > 0 && (
        <div className="space-y-2">
          {otherProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gradient-to-r from-background/80 to-muted/20 rounded-xl border border-border/50 hover:shadow-md transition-all duration-200"
            >
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="text-xs bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                    {profile.username[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {index + 2}
                </div>
              </div>
              
              <div className="flex-1">
                <h6 className="font-medium text-sm text-foreground">
                  {profile.display_name || profile.username}
                </h6>
                <div className="flex items-center space-x-2">
                  <Flame className="h-2.5 w-2.5 text-orange-500" />
                  <span className="text-xs font-medium text-muted-foreground">
                    {profile.streak_days} days
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Trophy className="h-3 w-3 text-amber-500" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
