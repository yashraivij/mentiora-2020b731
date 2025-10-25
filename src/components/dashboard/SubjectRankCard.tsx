import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

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
  const [rank, setRank] = useState<{ rank: number; totalUsers: number } | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get all progress for this subject with scores > 0
  const subjectProgress = userProgress.filter(p => 
    p.subjectId === subjectId && p.averageScore > 0
  );
  
  useEffect(() => {
    const calculateRank = async () => {
      if (!subjectId || !userId) {
        setLoading(false);
        return;
      }
      
      try {
        // Query all users' accuracy for this subject
        const { data: allPerformances, error } = await supabase
          .from('subject_performance')
          .select('user_id, accuracy_rate')
          .eq('subject_id', subjectId)
          .gt('accuracy_rate', 0);
        
        if (error) {
          console.error('Error fetching subject performance:', error);
          setLoading(false);
          return;
        }
        
        if (!allPerformances || allPerformances.length === 0) {
          setRank(null);
          setLoading(false);
          return;
        }
        
        // Sort by accuracy (highest first)
        const sorted = allPerformances.sort((a, b) => b.accuracy_rate - a.accuracy_rate);
        
        // Find current user's rank
        const userRank = sorted.findIndex(p => p.user_id === userId) + 1;
        
        if (userRank === 0) {
          setRank(null);
        } else {
          setRank({ rank: userRank, totalUsers: sorted.length });
        }
      } catch (err) {
        console.error('Error calculating rank:', err);
      } finally {
        setLoading(false);
      }
    };
    
    calculateRank();
  }, [subjectId, userId, userProgress]);
  
  if (loading) {
    return (
      <Card className="rounded-3xl border border-[#94A3B8]/20 bg-gradient-to-br from-white to-[#94A3B8]/5 dark:from-gray-900 dark:to-[#94A3B8]/10 shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#94A3B8]/10">
              <Trophy className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Rank</div>
          </div>
          <div className="text-3xl font-bold text-[#94A3B8]">
            --
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!rank || subjectProgress.length === 0) {
    return (
      <Card className="rounded-3xl border border-[#94A3B8]/20 bg-gradient-to-br from-white to-[#94A3B8]/5 dark:from-gray-900 dark:to-[#94A3B8]/10 shadow-sm hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-[#94A3B8]/10">
              <Trophy className="h-4 w-4 text-[#94A3B8]" />
            </div>
            <div className="text-xs text-[#64748B] dark:text-gray-400 font-semibold uppercase tracking-wider">Rank</div>
          </div>
          <div className="text-3xl font-bold text-[#94A3B8]">
            --
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Determine color based on rank (top 10% = gold, top 30% = silver, rest = bronze)
  const topPercentile = (rank.rank / rank.totalUsers) * 100;
  const isTopTier = topPercentile <= 10;
  const isMidTier = topPercentile <= 30;
  
  const colorClass = isTopTier 
    ? 'border-[#F59E0B]/20 bg-gradient-to-br from-white to-[#F59E0B]/5 dark:from-gray-900 dark:to-[#F59E0B]/10 hover:shadow-[#F59E0B]/10'
    : isMidTier 
      ? 'border-[#0EA5E9]/20 bg-gradient-to-br from-white to-[#0EA5E9]/5 dark:from-gray-900 dark:to-[#0EA5E9]/10 hover:shadow-[#0EA5E9]/10'
      : 'border-[#94A3B8]/20 bg-gradient-to-br from-white to-[#94A3B8]/5 dark:from-gray-900 dark:to-[#94A3B8]/10 hover:shadow-[#94A3B8]/10';
  
  const iconColorClass = isTopTier 
    ? 'bg-[#F59E0B]/10'
    : isMidTier 
      ? 'bg-[#0EA5E9]/10'
      : 'bg-[#94A3B8]/10';
  
  const iconTextClass = isTopTier 
    ? 'text-[#F59E0B]'
    : isMidTier 
      ? 'text-[#0EA5E9]'
      : 'text-[#94A3B8]';
  
  const textColorClass = isTopTier 
    ? 'text-[#F59E0B]'
    : isMidTier 
      ? 'text-[#0EA5E9]'
      : 'text-[#0F172A] dark:text-white';
  
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
          #{rank.rank}
        </div>
        <div className="text-xs text-[#64748B] dark:text-gray-400 mt-1">
          of {rank.totalUsers} users
        </div>
      </CardContent>
    </Card>
  );
}
