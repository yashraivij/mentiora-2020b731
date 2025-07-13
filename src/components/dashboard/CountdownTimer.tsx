import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="border-amber-200/50 dark:border-amber-800/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
            <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">GCSE 2026 Countdown</h3>
            <p className="text-sm text-muted-foreground">Until your first exam</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/50">
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                {timeLeft.days}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Days</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/50">
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Hours</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/50">
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Minutes</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-xl p-3 border border-amber-200/50 dark:border-amber-700/50">
              <div className="text-2xl font-bold text-amber-800 dark:text-amber-200">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Seconds</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};