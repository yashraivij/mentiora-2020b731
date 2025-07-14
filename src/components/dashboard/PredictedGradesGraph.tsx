import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Crown, Target, Sparkles, Trophy, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";

interface GradeData {
  subjectId: string;
  subjectName: string;
  practiceScore: number;
  examGrade: string | null;
  finalGrade: string;
  finalPercentage: number;
  confidence: 'high' | 'medium' | 'low';
  practiceCount: number;
  isGrade7Plus: boolean;
}

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface PredictedGradesGraphProps {
  userProgress: UserProgress[];
}

export const PredictedGradesGraph = ({ userProgress }: PredictedGradesGraphProps) => {
  const { user } = useAuth();
  const [gradesData, setGradesData] = useState<GradeData[]>([]);
  const [loading, setLoading] = useState(true);

  // Grade to percentage mapping
  const gradeToPercentage = (grade: string): number => {
    switch (grade) {
      case '9': return 95;
      case '8': return 85;
      case '7': return 75;
      case '6': return 65;
      case '5': return 55;
      case '4': return 45;
      case '3': return 35;
      case '2': return 25;
      case '1': return 15;
      case 'U': return 5;
      default: return 0;
    }
  };

  // Percentage to grade mapping
  const percentageToGrade = (percentage: number): string => {
    if (percentage >= 90) return '9';
    if (percentage >= 80) return '8';
    if (percentage >= 70) return '7';
    if (percentage >= 60) return '6';
    if (percentage >= 50) return '5';
    if (percentage >= 40) return '4';
    if (percentage >= 30) return '3';
    if (percentage >= 20) return '2';
    if (percentage >= 10) return '1';
    return 'U';
  };

  useEffect(() => {
    const calculatePredictedGrades = async () => {
      if (!user?.id) return;

      try {
        // Get exam scores from database
        const { data: examData } = await supabase
          .from('predicted_exam_completions')
          .select('subject_id, grade, percentage, created_at')
          .eq('user_id', user.id);

        const gradePromises = curriculum.map(async (subject) => {
          // Calculate practice score for this subject
          const subjectProgress = userProgress.filter((p: any) => p.subjectId === subject.id);
          
          // Get all topics for this subject and calculate average including unattempted as 0%
          const totalTopics = subject.topics.length;
          const attemptedTopicsScore = subjectProgress.reduce((sum: number, p: any) => sum + p.averageScore, 0);
          const practiceScore = totalTopics > 0 ? Math.round(attemptedTopicsScore / totalTopics) : 0;

          // Get latest exam grade for this subject
          const latestExam = examData?.filter(exam => exam.subject_id === subject.id)
            .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0];

          const examGrade = latestExam?.grade || null;
          const examPercentage = examGrade ? gradeToPercentage(examGrade) : 0;

          // Calculate final score using the specified formula
          let finalPercentage: number;
          if (!examGrade && practiceScore === 0) {
            finalPercentage = 0;
          } else if (!examGrade) {
            finalPercentage = practiceScore;
          } else if (practiceScore === 0) {
            finalPercentage = examPercentage;
          } else {
            finalPercentage = Math.round((practiceScore + examPercentage) / 2);
          }

          const finalGrade = finalPercentage === 0 ? '–' : percentageToGrade(finalPercentage);

          // Calculate confidence based on practice attempts
          const practiceCount = subjectProgress.reduce((sum: number, p: any) => sum + p.attempts, 0);
          let confidence: 'high' | 'medium' | 'low';
          if (practiceCount >= 20) confidence = 'high';
          else if (practiceCount >= 10) confidence = 'medium';
          else confidence = 'low';

          return {
            subjectId: subject.id,
            subjectName: subject.name,
            practiceScore,
            examGrade,
            finalGrade,
            finalPercentage,
            confidence,
            practiceCount,
            isGrade7Plus: finalPercentage >= 70
          } as GradeData;
        });

        const grades = await Promise.all(gradePromises);
        setGradesData(grades);
      } catch (error) {
        console.error('Error calculating predicted grades:', error);
      } finally {
        setLoading(false);
      }
    };

    calculatePredictedGrades();
  }, [user?.id, userProgress]);

  const getSubjectColor = (index: number) => {
    const colors = [
      'from-purple-500 to-violet-600',
      'from-blue-500 to-cyan-600',
      'from-emerald-500 to-teal-600',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-600',
      'from-indigo-500 to-purple-600',
      'from-amber-500 to-orange-600',
      'from-green-500 to-emerald-600',
    ];
    return colors[index % colors.length];
  };

  const getGradeColor = (grade: string) => {
    if (grade === '–') return 'text-muted-foreground';
    const gradeNum = parseInt(grade);
    if (gradeNum >= 8) return 'text-emerald-500';
    if (gradeNum >= 7) return 'text-blue-500';
    if (gradeNum >= 5) return 'text-orange-500';
    return 'text-red-500';
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'low': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTooltipText = (grade: GradeData) => {
    if (grade.finalGrade === '–') {
      return "Start revising to unlock your prediction";
    }

    let text = `You're currently `;
    if (grade.practiceScore > 0 && grade.examGrade) {
      text += `averaging ${grade.practiceScore}% across your ${grade.subjectName} quizzes and scored a Grade ${grade.examGrade} in your predicted paper. That puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    } else if (grade.practiceScore > 0) {
      text += `averaging ${grade.practiceScore}% across your ${grade.subjectName} quizzes. That puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    } else if (grade.examGrade) {
      text += `scored a Grade ${grade.examGrade} in your ${grade.subjectName} predicted paper. That puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    }

    const nextGrade = parseInt(grade.finalGrade) + 1;
    if (nextGrade <= 9) {
      const nextGradePercentage = gradeToPercentage(nextGrade.toString());
      text += ` To hit a Grade ${nextGrade}, aim for ${nextGradePercentage}%+ across all topics.`;
    }

    return text;
  };

  const averageGrade = gradesData.filter(g => g.finalGrade !== '–').length > 0 
    ? Math.round(gradesData.filter(g => g.finalGrade !== '–').reduce((sum, g) => sum + parseInt(g.finalGrade), 0) / gradesData.filter(g => g.finalGrade !== '–').length)
    : 0;

  const grade7PlusCount = gradesData.filter(g => g.isGrade7Plus).length;

  if (loading) {
    return (
      <Card className="glass-effect mb-8">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Predicted GCSE Grades</CardTitle>
              <p className="text-sm text-muted-foreground">Loading your predictions...</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-effect mb-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground flex items-center space-x-2">
                <span>Predicted GCSE Grades</span>
                <Crown className="h-5 w-5 text-amber-500" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">AI-powered grade predictions based on your performance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {averageGrade > 0 && (
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">{averageGrade}</div>
                <div className="text-xs text-muted-foreground">Avg Grade</div>
              </div>
            )}
            {grade7PlusCount > 0 && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3 py-1">
                <Trophy className="h-3 w-3 mr-1" />
                {grade7PlusCount} Grade 7+
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {gradesData.some(g => g.finalGrade !== '–') ? (
          <div className="space-y-6">
            {/* Grade bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {gradesData.map((grade, index) => (
                <div key={grade.subjectId} className="group relative">
                  <div className="relative">
                    {/* Bar */}
                    <div className="relative h-32 bg-gradient-to-t from-muted/20 to-muted/10 rounded-2xl overflow-hidden border border-border/50">
                      {grade.finalGrade !== '–' && (
                        <div 
                          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getSubjectColor(index)} rounded-2xl transition-all duration-1000 ease-out animate-in slide-in-from-bottom-4`}
                          style={{ 
                            height: `${Math.max(grade.finalPercentage * 0.8, 15)}%`,
                            filter: grade.isGrade7Plus ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.4))' : 'none'
                          }}
                        />
                      )}
                      
                      {/* Grade number */}
                      <div className={`absolute inset-0 flex items-center justify-center font-bold text-2xl ${getGradeColor(grade.finalGrade)} z-10`}>
                        {grade.finalGrade}
                      </div>

                      {/* Celebration effect for grade 7+ */}
                      {grade.isGrade7Plus && (
                        <div className="absolute top-2 right-2">
                          <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Subject name */}
                    <div className="mt-3 text-center">
                      <div className="text-sm font-medium text-foreground truncate">{grade.subjectName}</div>
                      <Badge 
                        variant="outline" 
                        className={`mt-1 text-xs ${getConfidenceColor(grade.confidence)} border-0`}
                      >
                        {grade.confidence} confidence
                      </Badge>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 w-64 pointer-events-none">
                      <div className="text-center">
                        {getTooltipText(grade)}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Statistics */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-border/50">
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {gradesData.filter(g => g.finalGrade !== '–').length} subjects tracked
                </span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 rounded-xl">
                <Zap className="h-4 w-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">
                  Real-time updates
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Start Revising to Unlock Predictions</h3>
            <p className="text-muted-foreground mb-4">Complete practice questions or take predicted papers to see your grade forecasts</p>
            <Badge variant="outline" className="text-muted-foreground">
              AI predictions available after first activity
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};