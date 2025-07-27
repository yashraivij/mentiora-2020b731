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
  const [currentPage, setCurrentPage] = useState(0);
  const PROFILES_PER_PAGE = 6; // 2 rows of 3

  useEffect(() => {
    fetchPublicProfiles();
    // Refresh every 30 seconds to show updated profiles
    const interval = setInterval(fetchPublicProfiles, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPublicProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('public_profiles')
        .select('*')
        .gte('streak_days', 14) // Only fetch profiles with 14+ day streaks
        .order('streak_days', { ascending: false });

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

  const totalPages = Math.ceil(profiles.length / PROFILES_PER_PAGE);
  const currentProfiles = profiles.slice(
    currentPage * PROFILES_PER_PAGE,
    (currentPage + 1) * PROFILES_PER_PAGE
  );

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Streak Leaders</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-full h-16 bg-muted animate-pulse rounded-lg" />
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
          No 14+ day streak achievers yet
        </p>
        <p className="text-xs text-muted-foreground/80">
          Be the first to reach the elite milestone!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Streak Hall of Fame ({profiles.length} Elite Members)
        </h4>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 text-amber-500" />
          <span className="text-xs font-medium text-muted-foreground">14+ Days</span>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="grid grid-cols-3 gap-2">
        {currentProfiles.map((profile, index) => {
          const overallRank = currentPage * PROFILES_PER_PAGE + index + 1;
          const isTopThree = overallRank <= 3;
          
          return (
            <motion.div
              key={profile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 ${
                isTopThree 
                  ? 'bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30' 
                  : 'bg-gradient-to-r from-background/80 to-muted/20'
              } shadow-sm hover:shadow-md transition-all duration-200`}>
                {/* Premium Border for Top 3 */}
                {isTopThree && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-lg p-[1px]">
                    <div className="bg-gradient-to-br from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 rounded-[7px] h-full w-full" />
                  </div>
                )}
                
                <CardContent className="relative p-3">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="relative">
                      <Avatar className={`w-8 h-8 ${isTopThree ? 'border-2 border-amber-400' : ''}`}>
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className={`text-xs ${
                          isTopThree 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
                            : 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white'
                        } font-bold`}>
                          {profile.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Rank Badge */}
                      <div className={`absolute -top-1 -right-1 w-4 h-4 ${
                        overallRank === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                        overallRank === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-500' :
                        overallRank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-600' :
                        'bg-gradient-to-br from-slate-400 to-slate-500'
                      } rounded-full flex items-center justify-center text-white text-xs font-bold`}>
                        {overallRank === 1 ? <Crown className="h-2 w-2" /> : overallRank}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h6 className="font-medium text-xs text-foreground truncate max-w-full">
                        {profile.display_name || profile.username}
                      </h6>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Flame className="h-2 w-2 text-orange-500" />
                        <span className={`text-xs font-bold ${
                          isTopThree 
                            ? 'bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent' 
                            : 'text-muted-foreground'
                        }`}>
                          {profile.streak_days}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            <span className="text-xs text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentPage ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages - 1}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
