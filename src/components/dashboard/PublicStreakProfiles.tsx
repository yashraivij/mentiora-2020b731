import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Crown, Star, BookOpen, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

// Import animal avatars
import catAvatar from '@/assets/avatars/cat-avatar.png';
import dogAvatar from '@/assets/avatars/dog-avatar.png';
import foxAvatar from '@/assets/avatars/fox-avatar.png';
import rabbitAvatar from '@/assets/avatars/rabbit-avatar.png';
import bearAvatar from '@/assets/avatars/bear-avatar.png';

interface PublicProfile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  mp_points: number;
}

// Fake profiles that change daily
const generateFakeProfiles = (): PublicProfile[] => {
  const names = [
    'Emily Chen', 'studyqueen123', 'Marcus', 'sophia_a', 'Jake W', 
    'aisha.p', 'Oliver Smith', 'maya_r', 'Ethan', 'zara_k',
    'Lucas Davis', 'bella_g', 'noah_w', 'aria.t', 'Tyler', 
    'chloe_lee', 'Ryan', 'mia.j', 'alex_t', 'Grace Miller'
  ];
  
  const avatars = [catAvatar, dogAvatar, foxAvatar, rabbitAvatar, bearAvatar];
  
  // Use current date as seed for consistent daily changes
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  
  // Simple seeded random function
  let seedValue = seed;
  const seededRandom = () => {
    seedValue = (seedValue * 9301 + 49297) % 233280;
    return seedValue / 233280;
  };
  
  const profiles: PublicProfile[] = [];
  const usedNames = new Set<string>();
  
  // Generate 8-12 fake profiles
  const profileCount = Math.floor(seededRandom() * 5) + 8;
  
  for (let i = 0; i < profileCount; i++) {
    let name;
    do {
      name = names[Math.floor(seededRandom() * names.length)];
    } while (usedNames.has(name));
    usedNames.add(name);
    
    const mpPoints = Math.floor(seededRandom() * 2000) + 500; // 500-2499 MP
    const avatar = avatars[Math.floor(seededRandom() * avatars.length)];
    
    profiles.push({
      id: `fake-${i}-${seed}`,
      username: name,
      display_name: name,
      avatar_url: avatar,
      mp_points: mpPoints
    });
  }
  
  return profiles.sort((a, b) => b.mp_points - a.mp_points);
};

export function PublicStreakProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const PROFILES_PER_PAGE = 3; // 1 row of 3

  useEffect(() => {
    fetchPublicProfiles();
    // Refresh every 30 seconds to show updated profiles
    const interval = setInterval(fetchPublicProfiles, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPublicProfiles = async () => {
    try {
      // Get public profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('public_profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching public profiles:', profilesError);
      }

      // For now, use the fake profiles since we can't reliably query user_points
      // In a real implementation, you'd join with user_points table
      const fakeProfiles = generateFakeProfiles();
      
      // Sort by MP points
      const allProfiles = [...fakeProfiles]
        .sort((a, b) => b.mp_points - a.mp_points);

      setProfiles(allProfiles);
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
        <h4 className="text-sm font-semibold text-muted-foreground mb-3">Weekly League</h4>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
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
          No weekly league leaders yet
        </p>
        <p className="text-xs text-muted-foreground/80">
          Be the first to earn 100+ MP this week!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50/80 via-yellow-50/80 to-orange-50/80 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Crown className="h-5 w-5 text-white drop-shadow-sm" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-bounce"></div>
          </div>
          <div>
            <h4 className="text-sm font-bold bg-gradient-to-r from-amber-700 via-yellow-700 to-orange-700 dark:from-amber-300 dark:via-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
              Weekly League
            </h4>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{profiles.length} Active</span>
              </div>
              <div className="w-1 h-1 bg-muted-foreground/30 rounded-full"></div>
              <span className="text-xs text-muted-foreground">Top MP Earners</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 text-amber-500" />
          <Zap className="h-3 w-3 text-yellow-500" />
        </div>
      </div>

      {/* Premium Profile Grid */}
      <div className="grid grid-cols-3 gap-3">
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
              <Card className={`relative overflow-hidden ${
                isTopThree 
                  ? 'bg-gradient-to-br from-amber-50/90 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40 shadow-lg shadow-amber-500/20' 
                  : 'bg-gradient-to-br from-slate-50/80 via-white/80 to-slate-50/80 dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80 shadow-md'
              } hover:shadow-xl transition-all duration-300 group border-0`}>
                {/* Premium Border for Top 3 */}
                {isTopThree && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-lg p-[1.5px]">
                    <div className="bg-gradient-to-br from-amber-50/90 via-yellow-50/90 to-orange-50/90 dark:from-amber-950/40 dark:via-yellow-950/40 dark:to-orange-950/40 rounded-[6px] h-full w-full" />
                  </div>
                )}
                
                {/* Floating particles for top 3 */}
                {isTopThree && (
                  <>
                    <div className="absolute top-1 right-2 w-1 h-1 bg-amber-400 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
                  </>
                )}
                
                <CardContent className="relative p-4">
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative">
                      <Avatar className={`w-10 h-10 ring-2 ${isTopThree ? 'ring-amber-400/50' : 'ring-slate-200/50 dark:ring-slate-700/50'} ring-offset-2 ring-offset-background`}>
                        <AvatarImage src={profile.avatar_url || undefined} />
                        <AvatarFallback className={`text-sm font-bold ${
                          isTopThree 
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' 
                            : 'bg-gradient-to-br from-emerald-500 to-blue-500 text-white'
                        }`}>
                          {profile.username[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Enhanced Active indicator - more prominent green dot with glow */}
                      <div className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center">
                        <div className="w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-lg animate-pulse"></div>
                        <div className="absolute w-4 h-4 bg-emerald-400 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Enhanced Rank Badge */}
                      <div className={`absolute -top-1 -left-1 w-5 h-5 ${
                        overallRank === 1 ? 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30' :
                        overallRank === 2 ? 'bg-gradient-to-br from-slate-400 to-slate-600 shadow-lg shadow-slate-500/30' :
                        overallRank === 3 ? 'bg-gradient-to-br from-amber-600 to-orange-700 shadow-lg shadow-amber-600/30' :
                        'bg-gradient-to-br from-slate-500 to-slate-600 shadow-lg shadow-slate-500/30'
                      } rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900`}>
                        {overallRank === 1 ? <Crown className="h-2.5 w-2.5" /> : overallRank}
                      </div>
                    </div>
                    
                    <div className="text-center space-y-1">
                      <h6 className="font-semibold text-sm text-foreground truncate max-w-full">
                        {profile.display_name || profile.username}
                      </h6>
                      <div className="flex items-center justify-center space-x-1">
                        <div className={`p-1 rounded-md ${isTopThree ? 'bg-amber-100 dark:bg-amber-950/50' : 'bg-slate-100 dark:bg-slate-800'}`}>
                          <Award className="h-2.5 w-2.5 text-amber-600" />
                        </div>
                        <span className={`text-sm font-bold ${
                          isTopThree 
                            ? 'bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent' 
                            : 'text-muted-foreground'
                        }`}>
                          {profile.mp_points}
                        </span>
                        <span className="text-xs text-muted-foreground/70">MP</span>
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
