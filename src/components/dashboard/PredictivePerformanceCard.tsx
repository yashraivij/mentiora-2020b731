import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, LineChart, Star, Trophy } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface PredictivePerformanceCardProps {
  userProgress: UserProgress[];
}

export const PredictivePerformanceCard = ({ userProgress }: PredictivePerformanceCardProps) => {
  const { user, isPremium } = useAuth();
  const [predictedExamCompletions, setPredictedExamCompletions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPredictedExamCompletions = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('predicted_exam_completions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setPredictedExamCompletions(data || []);
      } catch (error) {
        console.error('Error fetching predicted exam completions:', error);
      }
    };

    fetchPredictedExamCompletions();
  }, [user]);

  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    
    // Find the subject in curriculum to get all topics
    const subject = curriculum.find(s => s.id === subjectId);
    if (!subject) return 0;
    
    // Calculate average including unattempted topics as 0%
    const totalTopics = subject.topics.length;
    if (totalTopics === 0) return 0;
    
    const totalScore = subjectProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / totalTopics);
  };

  const getPredictedGradeNumber = (gradeString: string): number => {
    if (gradeString === 'U') return 0;
    return parseInt(gradeString) || 0;
  };

  const getConfidenceLevel = (percentage: number, attempts: number) => {
    if (attempts < 5) return "Low";
    if (attempts < 15) return "Medium";
    if (attempts < 30) return "High";
    return "Very High";
  };

  const calculateCombinedGrade = (subjectId: string) => {
    // Get practice progress
    const practicePercentage = getSubjectProgress(subjectId);
    const practiceGrade = getPredictedGrade(practicePercentage);
    
    // Get most recent predicted exam completion for this subject
    const recentExamCompletion = predictedExamCompletions
      .filter(completion => completion.subject_id === subjectId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    // If no practice data and no exam completion, don't show subject
    const hasPracticeData = userProgress.some(p => p.subjectId === subjectId);
    if (!hasPracticeData && !recentExamCompletion) {
      return null;
    }
    
    // If only exam completion, use that grade
    if (!hasPracticeData && recentExamCompletion) {
      const gradeNumber = getPredictedGradeNumber(recentExamCompletion.grade);
      return {
        grade: gradeNumber,
        percentage: recentExamCompletion.percentage
      };
    }
    
    // If only practice data, use that
    if (hasPracticeData && !recentExamCompletion) {
      return {
        grade: practiceGrade,
        percentage: practicePercentage
      };
    }
    
    // If both exist, combine with weighted average (predicted exam has more weight - 70%)
    if (hasPracticeData && recentExamCompletion) {
      const examGrade = getPredictedGradeNumber(recentExamCompletion.grade);
      const examWeight = 0.7;
      const practiceWeight = 0.3;
      
      const combinedGrade = Math.round((examGrade * examWeight) + (practiceGrade * practiceWeight));
      const combinedPercentage = Math.round((recentExamCompletion.percentage * examWeight) + (practicePercentage * practiceWeight));
      
      return {
        grade: combinedGrade, // Allow grade 0 for U
        percentage: combinedPercentage
      };
    }
    
    return null;
  };

  const getPredictedGrade = (percentage: number) => {
    if (percentage >= 85) return 9;
    if (percentage >= 75) return 8;
    if (percentage >= 65) return 7;
    if (percentage >= 55) return 6;
    if (percentage >= 45) return 5;
    if (percentage >= 35) return 4;
    if (percentage >= 25) return 3;
    if (percentage >= 15) return 2;
    return 0; // Return 0 for U grade
  };

  const getGradeColor = (grade: number) => {
    if (grade === 9) return "bg-gradient-to-r from-purple-500 to-pink-500";
    if (grade === 8) return "bg-gradient-to-r from-emerald-500 to-cyan-500";
    if (grade === 7) return "bg-gradient-to-r from-green-500 to-lime-500";
    if (grade === 6) return "bg-gradient-to-r from-yellow-500 to-orange-500";
    if (grade === 5) return "bg-gradient-to-r from-orange-500 to-red-500";
    if (grade === 4) return "bg-gradient-to-r from-red-500 to-red-600";
    if (grade === 3) return "bg-red-600";
    if (grade === 2) return "bg-red-700";
    return "bg-red-800";
  };

  const getSubjectsWithPredictions = () => {
    return curriculum.map(subject => {
      const combinedResult = calculateCombinedGrade(subject.id);
      
      if (!combinedResult) {
        return null;
      }
      
      return {
        ...subject,
        percentage: combinedResult.percentage,
        grade: combinedResult.grade,
        hasData: true
      };
    }).filter(subject => subject !== null).slice(0, 5); // Show top 5 subjects
  };

  const subjects = getSubjectsWithPredictions();
  const averageGrade = subjects.length > 0 ? 
    subjects.reduce((sum, s) => sum + s.grade, 0) / subjects.length : 0;

  const hasData = subjects.length > 0;

  return (
    <Card className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500" />

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <LineChart className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 transition-all duration-300">
        <div className="space-y-3">
          <CardTitle className="text-lg font-bold text-foreground leading-tight">
            Predictive Performance
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Forecast your exam performance based on current learning patterns
          </p>
          
          {/* Mini Grade Prediction Chart */}
          {hasData ? (
            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Average Grade</span>
                <span className="font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  {!isPremium ? "?" : averageGrade.toFixed(1)}
                </span>
              </div>
              
              {/* Mini Bar Chart */}
              <div className="space-y-2">
                {subjects.slice(0, 3).map((subject, index) => (
                  <div key={subject.id} className="flex items-center gap-3">
                    <div className="w-12 text-xs text-muted-foreground truncate">
                      {subject.name.slice(0, 4)}
                    </div>
                    <div className="flex-1 relative">
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${getGradeColor(subject.grade)}`}
                          style={{ width: `${(subject.grade / 9) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-foreground">{!isPremium ? "?" : (subject.grade === 0 ? 'U' : subject.grade)}</span>
                      {isPremium && subject.grade >= 8 && <Star className="h-3 w-3 text-yellow-500" />}
                      {isPremium && subject.grade === 9 && <Trophy className="h-3 w-3 text-amber-500" />}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-muted/20">
                {subjects.length > 3 ? `+${subjects.length - 3} more subjects` : 'All subjects shown'}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Start Practicing</span>
                <span className="font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">
                  0 Subjects
                </span>
              </div>
              <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-1000 w-0" />
              </div>
              <div className="text-xs text-muted-foreground text-center pt-2">
                Complete practice sessions to see predictions
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Premium Border Glow */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-600 p-[1px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
        <div className="w-full h-full bg-card rounded-3xl" />
      </div>
    </Card>
  );
};