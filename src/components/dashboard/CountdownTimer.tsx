import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-05-07T09:00:00'); // Thursday May 7th, 2026, 9 AM

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-2xl opacity-20 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl opacity-30 blur-xl" />
      
      <div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-slate-900/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 text-white shadow-2xl">
        <div className="flex items-center justify-center space-x-2 mb-3">
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
          <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            GCSE 2026 COUNTDOWN
          </span>
          <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="bg-gradient-to-b from-purple-400/20 to-purple-600/20 rounded-xl p-2 border border-purple-400/30 backdrop-blur-sm">
              <div className="text-lg font-bold text-white">
                {timeLeft.days}
              </div>
              <div className="text-xs text-purple-200 font-medium">Days</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-pink-400/20 to-pink-600/20 rounded-xl p-2 border border-pink-400/30 backdrop-blur-sm">
              <div className="text-lg font-bold text-white">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-pink-200 font-medium">Hours</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-blue-400/20 to-blue-600/20 rounded-xl p-2 border border-blue-400/30 backdrop-blur-sm">
              <div className="text-lg font-bold text-white">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-blue-200 font-medium">Mins</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-green-400/20 to-green-600/20 rounded-xl p-2 border border-green-400/30 backdrop-blur-sm">
              <div className="text-lg font-bold text-white">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-green-200 font-medium">Secs</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};