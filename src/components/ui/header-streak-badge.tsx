import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderStreakBadgeProps {
  streakCount: number;
  isVisible: boolean;
  onClick: () => void;
  isStreakLost?: boolean;
  isMilestone?: boolean;
}

export function HeaderStreakBadge({ 
  streakCount, 
  isVisible, 
  onClick,
  isStreakLost = false,
  isMilestone = false
}: HeaderStreakBadgeProps) {
  const [isFlickering, setIsFlickering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mpPoints, setMpPoints] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Fetch MP points
    const fetchMP = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('user_points')
        .select('total_points')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setMpPoints(data?.total_points || 0);
    };
    
    fetchMP();
    
    // Listen for MP updates
    const handleMPEarned = () => fetchMP();
    window.addEventListener('mpEarned', handleMPEarned);
    
    return () => window.removeEventListener('mpEarned', handleMPEarned);
  }, [user?.id]);

  useEffect(() => {
    // Flicker animation every 4-6 seconds
    const flickerInterval = setInterval(() => {
      setIsFlickering(true);
      setTimeout(() => setIsFlickering(false), 800);
    }, 5000 + Math.random() * 2000);

    return () => clearInterval(flickerInterval);
  }, []);

  const getTooltipText = () => {
    if (isStreakLost) return "Start a new streak today!";
    if (isMilestone) return `🏅 Milestone reached — ${streakCount} days!`;
    return `Keep it going — you're on a ${streakCount}-day streak!`;
  };

  const getBadgeBackground = () => {
    if (isMilestone) {
      return 'bg-gradient-to-r from-amber-50/80 to-yellow-50/80 backdrop-blur-md border border-amber-200/50';
    }
    if (isStreakLost) {
      return 'bg-white/60 backdrop-blur-md border border-gray-200/50';
    }
    return 'bg-white/70 backdrop-blur-md border border-blue-100/50';
  };

  const getFlameColor = () => {
    if (isMilestone) return 'text-amber-500';
    if (isStreakLost) return 'text-gray-400';
    return 'text-orange-500';
  };

  const getGlowColor = () => {
    if (isMilestone) return 'rgba(251, 191, 36, 0.3)';
    if (isStreakLost) return 'rgba(156, 163, 175, 0.2)';
    return 'rgba(251, 146, 60, 0.3)';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                onClick={onClick}
                className={`
                  relative flex items-center gap-2 px-3 py-1.5 rounded-full
                  ${getBadgeBackground()}
                  shadow-sm hover:shadow-md transition-all duration-300
                  cursor-pointer group
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: `0 0 20px ${getGlowColor()}, inset 0 0 10px ${getGlowColor()}`
                  }}
                />

                {/* Inner glow behind flame */}
                <div 
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full blur-lg opacity-40"
                  style={{ backgroundColor: getGlowColor() }}
                />

                {/* Flame icon with flicker animation */}
                <motion.div
                  className="relative z-10"
                  animate={{
                    scale: isFlickering ? [1, 1.15, 0.95, 1.1, 1] : 1,
                    opacity: isFlickering ? [1, 0.8, 1, 0.85, 1] : 1
                  }}
                  transition={{
                    duration: 0.8,
                    times: [0, 0.2, 0.4, 0.7, 1]
                  }}
                >
                  <Flame 
                    className={`w-4 h-4 ${getFlameColor()} ${isMilestone ? 'drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]' : isStreakLost ? '' : 'drop-shadow-[0_0_4px_rgba(251,146,60,0.5)]'}`}
                    fill={isStreakLost ? 'none' : 'currentColor'}
                  />
                </motion.div>

                {/* Streak text */}
                <span className={`
                  relative z-10 text-sm font-semibold whitespace-nowrap
                  ${isMilestone ? 'text-amber-700' : isStreakLost ? 'text-gray-600' : 'text-gray-700'}
                `}>
                  {isMobile ? (
                    `${isStreakLost ? '×0' : `×${streakCount}`}`
                  ) : (
                    isStreakLost ? 'Streak lost' : `${streakCount}-Day Streak`
                  )}
                </span>

                {/* MP Counter */}
                <div 
                  data-mp-counter
                  className={`
                    relative z-10 px-2 py-0.5 rounded-full text-xs font-bold
                    ${isMilestone ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}
                  `}
                >
                  {mpPoints} MP
                </div>

                {/* Milestone sparkle effect */}
                {isMilestone && !isMobile && (
                  <motion.span
                    className="text-amber-500 text-xs"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    🏅
                  </motion.span>
                )}

                {/* Pulsing glow for active streak */}
                {!isStreakLost && !isMilestone && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${getGlowColor()} 0%, transparent 70%)`
                    }}
                    animate={{
                      opacity: [0.3, 0.5, 0.3],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded-lg shadow-lg"
            >
              {getTooltipText()}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
}
