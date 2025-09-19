import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { MPRewardToast, MPRewardData } from '@/components/notifications/MPRewardToast';
import { playMPRewardChime } from '@/lib/celebratory-sound';

interface MPRewardsContextType {
  showMPReward: (amount: number, reason: string, description: string) => void;
}

const MPRewardsContext = createContext<MPRewardsContextType | undefined>(undefined);

export const useMPRewards = () => {
  const context = useContext(MPRewardsContext);
  if (!context) {
    throw new Error('useMPRewards must be used within an MPRewardsProvider');
  }
  return context;
};

export const MPRewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<MPRewardData[]>([]);
  const [currentReward, setCurrentReward] = useState<MPRewardData | null>(null);
  const lastSoundTime = useRef(0);
  const mpCounterRef = useRef<HTMLElement | null>(null);

  const triggerMPCounterBounce = () => {
    // Find MP counter in header and trigger bounce animation
    const mpElements = document.querySelectorAll('[data-mp-counter]');
    mpElements.forEach((element) => {
      element.classList.add('animate-bounce');
      setTimeout(() => {
        element.classList.remove('animate-bounce');
      }, 600);
    });
  };

  const playThrottledSound = (amount: number) => {
    const now = Date.now();
    if (now - lastSoundTime.current > 1000) { // Throttle to 1 sound per second
      playMPRewardChime(amount);
      lastSoundTime.current = now;
    }
  };

  const processQueue = useCallback(() => {
    if (queue.length > 0 && !currentReward) {
      const nextReward = queue[0];
      setQueue(prev => prev.slice(1));
      setCurrentReward(nextReward);
      
      // Play sound and trigger animations
      playThrottledSound(nextReward.amount);
      triggerMPCounterBounce();
    }
  }, [queue, currentReward]);

  const showMPReward = useCallback((amount: number, reason: string, description: string) => {
    const reward: MPRewardData = {
      id: Date.now().toString(),
      amount,
      reason,
      description
    };

    setQueue(prev => [...prev, reward]);
  }, []);

  const handleToastClose = () => {
    setCurrentReward(null);
    // Process next reward in queue after a brief delay
    setTimeout(processQueue, 100);
  };

  // Process queue when it changes
  React.useEffect(() => {
    processQueue();
  }, [processQueue]);

  return (
    <MPRewardsContext.Provider value={{ showMPReward }}>
      {children}
      <MPRewardToast reward={currentReward} onClose={handleToastClose} />
    </MPRewardsContext.Provider>
  );
};