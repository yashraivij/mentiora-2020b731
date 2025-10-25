import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface SubjectRankCardProps {
  selectedDrawerSubject: any;
  userProgress: UserProgress[];
  userId?: string;
}

export function SubjectRankCard({ selectedDrawerSubject, userProgress, userId }: SubjectRankCardProps) {
  const subjectId = selectedDrawerSubject?.id || '';
  
  // Get all progress for this subject with scores > 0
  const subjectProgress = userProgress.filter(p => 
    p.subjectId === subjectId && p.averageScore > 0
  );
  
  // Generate a consistent random number between 500-1900 based on subject ID
  const getFakeUserCount = (subjectId: string): number => {
    let hash = 0;
    for (let i = 0; i < subjectId.length; i++) {
      hash = ((hash << 5) - hash) + subjectId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return 500 + Math.abs(hash % 1401); // 1401 = 1900 - 500 + 1
  };
  
  // Calculate realistic rank based on accuracy percentage
  const getRealisticRank = (accuracy: number, totalUsers: number): number => {
    // Convert accuracy to percentile (0-100)
    // At 100% accuracy, you're in top 1% (rank 1-10)
    // At 50% accuracy, you're around 50th percentile (middle of pack)
    // At 0% accuracy, you're in bottom 1% (near totalUsers)
    
    // Calculate percentile position (100 - accuracy means lower accuracy = higher percentile from bottom)
    const percentileFromTop = accuracy;
    
    // Convert percentile to actual rank
    const rankPosition = Math.floor((100 - percentileFromTop) / 100 * totalUsers);
    
    // Ensure rank is at least 1 and at most totalUsers
    return Math.max(1, Math.min(totalUsers, rankPosition));
  };
  
  // Calculate user's average accuracy for this subject
  const userAccuracy = subjectProgress.length > 0 
    ? subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length 
    : 0;
  
  // Convert rank to ordinal format (1st, 2nd, 3rd, etc.)
  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  const fakeUserCount = getFakeUserCount(subjectId);
  const realisticRank = subjectProgress.length > 0 ? getRealisticRank(userAccuracy, fakeUserCount) : null;
  
  if (!realisticRank || subjectProgress.length === 0) {
    return (
      <Card className="rounded-3xl border border-[#16A34A]/20 bg-gradient-to-br from-white to-[#16A34A]/5 dark:from-gray-900 dark:to-[#16A34A]/10 shadow-sm hover:shadow-lg hover:shadow-[#16A34A]/10 transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#16A34A]/10">
              <Trophy className="h-4 w-4 text-[#16A34A]" />
            </div>
            <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Rank</div>
          </div>
          <div className="text-3xl font-bold text-[#16A34A]">
            --
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const colorClass = 'border-[#16A34A]/20 bg-gradient-to-br from-white to-[#16A34A]/5 dark:from-gray-900 dark:to-[#16A34A]/10 hover:shadow-[#16A34A]/10';
  const iconColorClass = 'bg-[#16A34A]/10';
  const iconTextClass = 'text-[#16A34A]';
  const textColorClass = 'text-[#16A34A]';
  
  return (
    <Card className={`rounded-3xl border shadow-sm hover:shadow-lg transition-all duration-300 ${colorClass}`}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${iconColorClass}`}>
            <Trophy className={`h-4 w-4 ${iconTextClass}`} />
          </div>
          <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Rank</div>
        </div>
        <div className={`text-3xl font-bold ${textColorClass}`}>
          {getOrdinal(realisticRank)}
        </div>
        <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1">
          of {fakeUserCount} users
        </div>
      </CardContent>
    </Card>
  );
}
