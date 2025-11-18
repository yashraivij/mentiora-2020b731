import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, LineChart, Star, Trophy } from "lucide-react";
import { useCurriculum } from "@/hooks/useCurriculum";
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
  const { user } = useAuth();
  const { curriculum, isLoading: curriculumLoading } = useCurriculum();
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

  // Helper to check if subject is A-Level - simple string check
  const isALevel = (subjectId: string): boolean => {
    return subjectId.toLowerCase().includes('alevel');
  };

  // Helper to check if subject is SAT
  const isSATSubject = (subjectId: string): boolean => {
    return subjectId.startsWith('sat-');
  };

  // Convert percentage to SAT score (400-1600)
  const percentageToSATScore = (percentage: number): number => {
    return Math.round(400 + (percentage / 100) * 1200);
  };

  const gradeToNumber = (gradeString: string, subjectId: string): number => {
    if (isSATSubject(subjectId)) {
      if (gradeString === 'U') return 400; // SAT minimum
      // SAT scores are 400-1600, convert to 0-9 scale for internal calculations
      const score = parseInt(gradeString) || 400;
      const percentage = ((score - 400) / 1200) * 100;
      return 4 + (percentage / 100) * 5; // Map to 4-9 scale
    }
    
    if (gradeString === 'U') return 0;
    
    if (isALevel(subjectId)) {
      // Convert A-Level letter grades to numbers
      switch (gradeString) {
        case 'A*': return 9;
        case 'A': return 8;
        case 'B': return 7;
        case 'C': return 6;
        case 'D': return 5;
        case 'E': return 4;
        default: return 0;
      }
    } else {
      // GCSE grades
      return parseInt(gradeString) || 0;
    }
  };

  const getConfidenceLevel = (percentage: number, attempts: number) => {
    if (attempts < 5) return "Low";
    if (attempts < 15) return "Medium";
    if (attempts < 30) return "High";
    return "Very High";
  };

  const calculateCombinedGrade = (subjectId: string) => {
    // Get practice progress - match both exact ID and base subject name
    const baseSubjectName = subjectId.split('-')[0];
    const matchingProgress = userProgress.filter(p => 
      p.subjectId === subjectId || 
      p.subjectId === baseSubjectName ||
      p.subjectId.split('-')[0] === baseSubjectName
    );
    
    // Calculate practice percentage from matching progress
    const practicePercentage = matchingProgress.length > 0
      ? Math.round(matchingProgress.reduce((sum, p) => sum + p.averageScore, 0) / matchingProgress.length)
      : 0;
    const practiceGrade = getPredictedGrade(practicePercentage, subjectId);
    
    // Get most recent predicted exam completion for this subject - also with flexible matching
    const recentExamCompletion = predictedExamCompletions
      .filter(completion => 
        completion.subject_id === subjectId ||
        completion.subject_id === baseSubjectName ||
        completion.subject_id.split('-')[0] === baseSubjectName
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    
    // Check if there's actual practice data with attempts > 0
    const hasPracticeData = matchingProgress.some(p => p.attempts > 0);
    if (!hasPracticeData && !recentExamCompletion) {
      return null;
    }
    
    // If only exam completion, use that grade (convert to number for calculations)
    if (!hasPracticeData && recentExamCompletion) {
      const gradeNumber = gradeToNumber(recentExamCompletion.grade, subjectId);
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
      const examGrade = gradeToNumber(recentExamCompletion.grade, subjectId);
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

  const getPredictedGrade = (percentage: number, subjectId?: string): number => {
    if (isSATSubject(subjectId || '')) {
      // For SAT, return the SAT score directly (minimum 400)
      return Math.max(400, percentageToSATScore(percentage));
    }
    // Convert accuracy percentage to A-Level grade (30-39% = E = 4, 40-49% = D = 5, etc.)
    if (percentage >= 80) return 9; // A*
    if (percentage >= 70) return 8; // A
    if (percentage >= 60) return 7; // B
    if (percentage >= 50) return 6; // C
    if (percentage >= 40) return 5; // D
    if (percentage >= 30) return 4; // E
    return 0; // U
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
                  {averageGrade.toFixed(1)}
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
                      <span className="text-xs font-bold text-foreground">{subject.grade === 0 ? 'U' : subject.grade}</span>
                      {subject.grade >= 8 && <Star className="h-3 w-3 text-yellow-500" />}
                      {subject.grade === 9 && <Trophy className="h-3 w-3 text-amber-500" />}
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