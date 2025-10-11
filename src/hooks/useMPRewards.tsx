import { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { MPRewardToast } from "@/components/notifications/MPRewardToast";

interface MPReward {
  id: string;
  amount: number;
  message: string;
}

interface MPRewardsContextType {
  showMPReward: (amount: number, message: string) => void;
}

const MPRewardsContext = createContext<MPRewardsContextType | undefined>(undefined);

export const useMPRewards = () => {
  const context = useContext(MPRewardsContext);
  if (!context) {
    throw new Error('useMPRewards must be used within an MPRewardsProvider');
  }
  return context;
};

interface MPRewardsProviderProps {
  children: React.ReactNode;
}

export const MPRewardsProvider = ({ children }: MPRewardsProviderProps) => {
  const [toastQueue, setToastQueue] = useState<MPReward[]>([]);
  const [currentToast, setCurrentToast] = useState<MPReward | null>(null);
  const lastSoundTime = useRef<number>(0);

  const playMPRewardChime = useCallback(async (amount: number) => {
    const now = Date.now();
    // Throttle sounds to max 1 per second
    if (now - lastSoundTime.current < 1000) {
      return;
    }
    lastSoundTime.current = now;

    try {
      const { playMPRewardChime } = await import('@/lib/celebratory-sound');
      playMPRewardChime(amount);
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
    }
  }, []);

  const triggerMPCounterBounce = useCallback(() => {
    // Find MP counter elements and trigger bounce animation
    const mpCounters = document.querySelectorAll('[data-mp-counter]');
    mpCounters.forEach((counter) => {
      counter.classList.remove('animate-bounce');
      // Force reflow
      (counter as HTMLElement).offsetHeight;
      counter.classList.add('animate-bounce');
      
      // Remove bounce class after animation
      setTimeout(() => {
        counter.classList.remove('animate-bounce');
      }, 500);
    });
  }, []);

  const processQueue = useCallback(() => {
    if (currentToast || toastQueue.length === 0) return;

    const nextToast = toastQueue[0];
    setToastQueue(prev => prev.slice(1));
    setCurrentToast(nextToast);
    
    // Play sound and trigger bounce
    playMPRewardChime(nextToast.amount);
    triggerMPCounterBounce();
  }, [currentToast, toastQueue, playMPRewardChime, triggerMPCounterBounce]);

  const showMPReward = useCallback((amount: number, message: string) => {
    const reward: MPReward = {
      id: Date.now().toString(),
      amount,
      message
    };

    setToastQueue(prev => [...prev, reward]);
    
    // Trigger quest notification badge
    window.dispatchEvent(new CustomEvent('mpEarned'));
  }, []);

  const handleToastClose = useCallback(() => {
    setCurrentToast(null);
    // Process next toast after a brief delay
    setTimeout(processQueue, 100);
  }, [processQueue]);

  // Process queue when it changes
  useEffect(() => {
    const timer = setTimeout(processQueue, 0);
    return () => clearTimeout(timer);
  }, [toastQueue.length, processQueue]);

  return (
    <MPRewardsContext.Provider value={{ showMPReward }}>
      {children}
      <AnimatePresence>
        {currentToast && (
          <MPRewardToast
            key={currentToast.id}
            amount={currentToast.amount}
            message={currentToast.message}
            onClose={handleToastClose}
          />
        )}
      </AnimatePresence>
    </MPRewardsContext.Provider>
  );
};