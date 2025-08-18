import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const RefreshCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    
    // Get the next Monday at 12:01 AM UK time
    const nextMonday = new Date();
    
    // Calculate days until next Monday (0 = Sunday, 1 = Monday, etc.)
    const daysUntilMonday = (8 - now.getDay()) % 7;
    const targetDate = new Date(now);
    
    if (daysUntilMonday === 0) {
      // Today is Monday, check if it's past 12:01 AM
      const todayAt1201 = new Date(now);
      todayAt1201.setHours(0, 1, 0, 0); // 12:01 AM
      
      if (now < todayAt1201) {
        // It's Monday but before 12:01 AM, target is today at 12:01 AM
        targetDate.setHours(0, 1, 0, 0);
      } else {
        // It's Monday after 12:01 AM, target is next Monday
        targetDate.setDate(now.getDate() + 7);
        targetDate.setHours(0, 1, 0, 0);
      }
    } else {
      // Target is the upcoming Monday
      targetDate.setDate(now.getDate() + daysUntilMonday);
      targetDate.setHours(0, 1, 0, 0);
    }

    const difference = targetDate.getTime() - now.getTime();

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: TimeLeft): string => {
    if (time.days > 0) {
      return `${time.days}d ${time.hours}h ${time.minutes}m`;
    } else if (time.hours > 0) {
      return `${time.hours}h ${time.minutes}m ${time.seconds}s`;
    } else if (time.minutes > 0) {
      return `${time.minutes}m ${time.seconds}s`;
    } else {
      return `${time.seconds}s`;
    }
  };

  return (
    <span className="font-bold tabular-nums">
      {formatTime(timeLeft)}
    </span>
  );
};