import { Flame } from "lucide-react";

interface StreakTrackerProps {
  currentStreak: number;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const StreakTracker = ({ currentStreak }: StreakTrackerProps) => {
  const today = new Date().getDay();
  // Convert Sunday = 0 to index 6, Monday = 1 to index 0, etc.
  const todayIndex = today === 0 ? 6 : today - 1;
  
  // Calculate which days are "active" based on streak
  const activeDays = new Set<number>();
  for (let i = 0; i < Math.min(currentStreak, 7); i++) {
    const dayIndex = (todayIndex - i + 7) % 7;
    activeDays.add(dayIndex);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1.5">
        {DAYS.map((day, index) => {
          const isActive = activeDays.has(index);
          const isToday = index === todayIndex;
          
          return (
            <div
              key={index}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                ${isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
                ${isToday ? 'ring-2 ring-primary ring-offset-2' : ''}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center gap-1.5 pl-2 border-l border-border">
        <Flame className="h-5 w-5 text-orange-500" />
        <span className="font-semibold text-foreground">{currentStreak}</span>
        <span className="text-sm text-muted-foreground">day streak</span>
      </div>
    </div>
  );
};
