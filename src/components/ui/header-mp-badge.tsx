import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderMPBadgeProps {
  isVisible: boolean;
}

export function HeaderMPBadge({ isVisible }: HeaderMPBadgeProps) {
  const [mpPoints, setMpPoints] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
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
    if (!user?.id) {
      setMpPoints(0);
      return () => {}; // Always return cleanup
    }
    
    // Fetch MP points
    const fetchMP = async () => {
      try {
        const { data, error } = await supabase
          .from('user_points')
          .select('total_points')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching MP:', error);
          return;
        }
        
        setMpPoints(data?.total_points || 0);
      } catch (err) {
        console.error('Exception in fetchMP:', err);
      }
    };
    
    fetchMP();
    
    // Listen for MP updates via custom event
    const handleMPEarned = () => {
      fetchMP();
    };
    window.addEventListener('mpEarned', handleMPEarned);
    
    // Set up realtime subscription to user_points table
    const channel = supabase
      .channel(`mp_updates_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_points',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('MP realtime update:', payload);
          if (payload.new && 'total_points' in payload.new) {
            setMpPoints((payload.new as any).total_points);
          }
        }
      )
      .subscribe();
    
    return () => {
      window.removeEventListener('mpEarned', handleMPEarned);
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  return (
    <AnimatePresence>
      {isVisible && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                transition={{ 
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                data-mp-counter
                className="
                  relative flex items-center gap-2 px-3 py-1.5 rounded-full
                  bg-[hsl(195,69%,54%)]/10 backdrop-blur-md border border-[hsl(195,69%,54%)]/30
                  shadow-sm hover:shadow-md transition-all duration-300
                  cursor-default group
                "
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 20px hsl(195 69% 54% / 0.3), inset 0 0 10px hsl(195 69% 54% / 0.2)'
                  }}
                />

                {/* Diamond emoji with pulse */}
                <motion.span
                  className="relative z-10 text-lg"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  💎
                </motion.span>

                {/* MP Count */}
                <span className="relative z-10 text-sm font-semibold text-[hsl(195,69%,54%)] whitespace-nowrap">
                  {isMobile ? `${mpPoints}` : `${mpPoints} MP`}
                </span>

                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, hsl(195 69% 54% / 0.2) 0%, transparent 70%)'
                  }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded-lg shadow-lg"
            >
              Mighty Points earned from daily tasks and streaks
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </AnimatePresence>
  );
}
