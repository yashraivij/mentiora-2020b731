import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    return 'U';
  };

  useEffect(() => {
    const calculatePredictedGrades = async () => {
      if (!user?.id) return;

      try {
        // Get predicted exam completions (same as PredictivePerformanceCard)
        const { data: predictedExamData } = await supabase
          .from('predicted_exam_completions')
          .select('subject_id, grade, percentage, created_at')
          .eq('user_id', user.id);

        // Helper functions (same as PredictivePerformanceCard)
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
          if (gradeString === 'U') return 0; // U grade is treated as 0 for calculations
          const parsed = parseInt(gradeString);
          return isNaN(parsed) ? 0 : Math.max(0, parsed); // Ensure minimum grade 0 and handle NaN
        };

        const calculateCombinedGrade = (subjectId: string) => {
          // Get practice progress
          const practicePercentage = getSubjectProgress(subjectId);
          const practiceGrade = percentageToGrade(practicePercentage);
          
          // Get most recent predicted exam completion for this subject
          const recentExamCompletion = (predictedExamData || [])
            .filter(completion => completion.subject_id === subjectId)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          
          // If no practice data and no exam completion, don't show subject
          const hasPracticeData = userProgress.some(p => p.subjectId === subjectId);
          if (!hasPracticeData && !recentExamCompletion) {
            return null;
          }
          
          // If only exam completion, use that grade
          if (!hasPracticeData && recentExamCompletion) {
            const examGradeNumber = getPredictedGradeNumber(recentExamCompletion.grade);
            return {
              grade: examGradeNumber === 0 ? 'U' : examGradeNumber.toString(),
              percentage: recentExamCompletion.percentage,
              examGrade: recentExamCompletion.grade,
              practiceScore: 0
            };
          }
          
          // If only practice data, use that
          if (hasPracticeData && !recentExamCompletion) {
            return {
              grade: practiceGrade,
              percentage: practicePercentage,
              examGrade: null,
              practiceScore: practicePercentage
            };
          }
          
          // If both exist, combine with weighted average (predicted exam has more weight - 70%)
          if (hasPracticeData && recentExamCompletion) {
            const examGrade = getPredictedGradeNumber(recentExamCompletion.grade);
            const practiceGradeNum = practiceGrade === 'U' ? 0 : parseInt(practiceGrade);
            const validPracticeGrade = isNaN(practiceGradeNum) ? 0 : practiceGradeNum;
            const examWeight = 0.7;
            const practiceWeight = 0.3;
            
            const combinedGrade = Math.round((examGrade * examWeight) + (validPracticeGrade * practiceWeight));
            const combinedPercentage = Math.round((recentExamCompletion.percentage * examWeight) + (practicePercentage * practiceWeight));
            
            return {
              grade: combinedGrade === 0 ? 'U' : combinedGrade.toString(),
              percentage: isNaN(combinedPercentage) ? 0 : combinedPercentage,
              examGrade: recentExamCompletion.grade,
              practiceScore: practicePercentage
            };
          }
          
          return null;
        };

        // Get all subjects from curriculum
        const curriculumSubjectIds = curriculum.map(s => s.id);
        const progressSubjectIds = [...new Set(userProgress.map((p: any) => p.subjectId))];
        const examSubjectIds = [...new Set((predictedExamData || []).map(exam => exam.subject_id))];
        
        // Include all curriculum subjects plus any additional subjects from progress/exams
        const additionalSubjects = [...progressSubjectIds, ...examSubjectIds].filter(id => !curriculumSubjectIds.includes(id));
        const allSubjectIds = [...curriculumSubjectIds, ...additionalSubjects];

        // Process all subjects - show all curriculum subjects even without data
        const gradePromises = allSubjectIds.map(async (subjectId) => {
          const combinedResult = calculateCombinedGrade(subjectId);
          
          // Find subject in curriculum or create a basic subject info
          const curriculumSubject = curriculum.find(s => s.id === subjectId);
          const subjectName = curriculumSubject?.name || 
            subjectId.charAt(0).toUpperCase() + subjectId.slice(1);

          // If no data, return empty state for curriculum subjects
          if (!combinedResult) {
            // Only show curriculum subjects without data, skip non-curriculum subjects
            if (!curriculumSubject) {
              return null;
            }
            
            return {
              subjectId: subjectId,
              subjectName,
              practiceScore: 0,
              examGrade: null,
              finalGrade: '–',
              finalPercentage: 0,
              confidence: 'low' as const,
              practiceCount: 0,
              isGrade7Plus: false
            } as GradeData;
          }

          // Calculate confidence based on practice attempts
          const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
          const practiceCount = subjectProgress.reduce((sum, p) => sum + p.attempts, 0);
          let confidence: 'high' | 'medium' | 'low';
          if (practiceCount >= 20) confidence = 'high';
          else if (practiceCount >= 10) confidence = 'medium';
          else confidence = 'low';

          return {
            subjectId: subjectId,
            subjectName,
            practiceScore: combinedResult.practiceScore,
            examGrade: combinedResult.examGrade,
            finalGrade: combinedResult.grade || 'U',
            finalPercentage: isNaN(combinedResult.percentage) ? 0 : combinedResult.percentage,
            confidence,
            practiceCount,
            isGrade7Plus: combinedResult.grade !== 'U' && !isNaN(parseInt(combinedResult.grade)) && parseInt(combinedResult.grade) >= 7
          } as GradeData;
        });

        const grades = await Promise.all(gradePromises);
        const gradesWithData = grades.filter(grade => grade !== null);
        
        setGradesData(gradesWithData);
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
      'from-purple-400 via-purple-500 to-purple-600',
      'from-blue-400 via-blue-500 to-blue-600',
      'from-emerald-400 via-emerald-500 to-emerald-600',
      'from-orange-400 via-orange-500 to-red-500',
      'from-pink-400 via-pink-500 to-rose-600',
      'from-indigo-400 via-indigo-500 to-purple-600',
      'from-amber-400 via-amber-500 to-orange-600',
      'from-green-400 via-green-500 to-emerald-600',
      'from-cyan-400 via-cyan-500 to-teal-600',
      'from-violet-400 via-violet-500 to-purple-600',
      'from-rose-400 via-rose-500 to-pink-600',
      'from-sky-400 via-sky-500 to-blue-600',
    ];
    return colors[index % colors.length];
  };

  const getSubjectShadow = (index: number) => {
    const shadows = [
      'shadow-purple-500/25',
      'shadow-blue-500/25',
      'shadow-emerald-500/25',
      'shadow-orange-500/25',
      'shadow-pink-500/25',
      'shadow-indigo-500/25',
      'shadow-amber-500/25',
      'shadow-green-500/25',
      'shadow-cyan-500/25',
      'shadow-violet-500/25',
      'shadow-rose-500/25',
      'shadow-sky-500/25',
    ];
    return shadows[index % shadows.length];
  };

  const getGradeColor = (grade: string) => {
    if (grade === '–') return 'text-muted-foreground';
    if (grade === 'U') return 'text-black dark:text-white font-medium';
    const gradeNum = parseInt(grade);
    if (isNaN(gradeNum)) return 'text-foreground font-medium';
    if (gradeNum >= 9) return 'text-black dark:text-white font-extrabold drop-shadow-lg';
    if (gradeNum >= 8) return 'text-black dark:text-white font-bold drop-shadow-md';
    if (gradeNum >= 7) return 'text-black dark:text-white font-bold drop-shadow-md';
    if (gradeNum >= 5) return 'text-black dark:text-white font-semibold drop-shadow-sm';
    return 'text-black dark:text-white font-medium';
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

    let text = '';
    if (grade.practiceScore > 0 && grade.examGrade) {
      text = `You scored an average of ${grade.practiceScore}% across your ${grade.subjectName} quizzes and achieved a Grade ${grade.examGrade} in your predicted paper. This puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    } else if (grade.practiceScore > 0) {
      text = `You scored an average of ${grade.practiceScore}% across your ${grade.subjectName} quizzes. This puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    } else if (grade.examGrade) {
      text = `You scored a Grade ${grade.examGrade} in your ${grade.subjectName} predicted paper. This puts you on track for a Grade ${grade.finalGrade} in the real exam.`;
    }

    // Only show next grade advice for numeric grades (not U)
    if (grade.finalGrade !== 'U' && !isNaN(parseInt(grade.finalGrade))) {
      const nextGrade = parseInt(grade.finalGrade) + 1;
      if (nextGrade <= 9) {
        const nextGradePercentage = gradeToPercentage(nextGrade.toString());
        text += ` To hit a Grade ${nextGrade}, aim for ${nextGradePercentage}%+ across all topics.`;
      }
    }

    return text;
  };

  const averageGrade = gradesData.filter(g => g.finalGrade !== '–' && !isNaN(parseInt(g.finalGrade))).length > 0 
    ? Math.round(gradesData.filter(g => g.finalGrade !== '–' && !isNaN(parseInt(g.finalGrade))).reduce((sum, g) => sum + parseInt(g.finalGrade), 0) / gradesData.filter(g => g.finalGrade !== '–' && !isNaN(parseInt(g.finalGrade))).length)
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
    <Card className="glass-effect mb-8 relative border-2 border-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 overflow-visible">
      {/* Premium background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-emerald-500/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-transparent rounded-full blur-2xl" />
      
      {/* Floating elements for premium feel */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75" />
      <div className="absolute top-8 right-12 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
      <div className="absolute top-12 right-8 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/25 animate-pulse">
                <TrendingUp className="h-6 w-6 text-white drop-shadow-lg" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-background animate-bounce">
                <Sparkles className="h-2 w-2 text-white m-auto mt-0.5" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent flex items-center space-x-3">
                <span>Predicted GCSE Grades</span>
                <Crown className="h-6 w-6 text-amber-500 animate-pulse" />
                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs px-2 py-1 font-bold animate-bounce">
                  PREMIUM
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-medium">🚀 AI-powered predictions • Real-time updates • Grade 9 insights</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {averageGrade > 0 && (
              <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20">
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{averageGrade}</div>
                <div className="text-xs text-muted-foreground font-semibold">Avg Grade</div>
              </div>
            )}
            {grade7PlusCount > 0 && (
              <Badge className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg shadow-emerald-500/25 animate-pulse">
                <Trophy className="h-4 w-4 mr-2 animate-bounce" />
                {grade7PlusCount} Grade 7+ 🎉
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {gradesData.some(g => g.finalGrade !== '–') ? (
          <TooltipProvider>
            <div className="space-y-6">
              {/* Premium Grade bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 overflow-visible">
              {gradesData.map((grade, index) => (
                <Tooltip key={grade.subjectId}>
                  <TooltipTrigger asChild>
                    <div className="group relative transform transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="relative">
                        {/* Premium Bar with enhanced effects */}
                        <div className={`relative h-40 bg-gradient-to-t from-gray-100/30 to-gray-50/20 dark:from-gray-800/30 dark:to-gray-700/20 rounded-3xl overflow-hidden border-2 border-white/20 backdrop-blur-sm shadow-xl ${getSubjectShadow(index)} group-hover:shadow-2xl transition-all duration-500`}>
                          {grade.finalGrade !== '–' && (
                            <>
                              {/* Main gradient bar */}
                              <div 
                                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getSubjectColor(index)} rounded-3xl transition-all duration-1000 ease-out animate-in slide-in-from-bottom-4`}
                                style={{ 
                                  height: `${Math.max(grade.finalPercentage * 0.85, 20)}%`,
                                  filter: grade.isGrade7Plus ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                                }}
                              />
                              
                              {/* Premium glow overlay */}
                              <div 
                                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/20 to-transparent rounded-3xl opacity-60`}
                                style={{ height: `${Math.max(grade.finalPercentage * 0.85, 20)}%` }}
                              />
                              
                              {/* Animated shimmer effect */}
                              <div 
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-3xl animate-pulse"
                                style={{ height: `${Math.max(grade.finalPercentage * 0.85, 20)}%` }}
                              />
                            </>
                          )}
                          
                          {/* Enhanced Grade number */}
                          <div className={`absolute inset-0 flex items-center justify-center font-black text-3xl ${getGradeColor(grade.finalGrade)} z-10 transition-transform duration-300 group-hover:scale-110`}>
                            {grade.finalGrade}
                          </div>

                          {/* Premium celebration effects for grade 7+ */}
                          {grade.isGrade7Plus && (
                            <>
                              <div className="absolute top-3 right-3 animate-bounce">
                                <Sparkles className="h-5 w-5 text-yellow-400 drop-shadow-lg" />
                              </div>
                              <div className="absolute top-2 left-2 animate-pulse">
                                <Crown className="h-4 w-4 text-amber-400" />
                              </div>
                              {/* Grade 9 special effect */}
                              {parseInt(grade.finalGrade) === 9 && (
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-yellow-300/20 rounded-3xl animate-pulse" />
                              )}
                            </>
                          )}
                          
                          {/* Premium percentage indicator */}
                          {grade.finalGrade !== '–' && (
                            <div className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                              <span className="text-xs font-bold text-white">{grade.finalPercentage}%</span>
                            </div>
                          )}
                        </div>

                        {/* Premium Subject name */}
                        <div className="mt-4 text-center">
                          <div className="text-sm font-bold text-foreground truncate mb-2">{grade.subjectName}</div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs font-semibold ${getConfidenceColor(grade.confidence)} border-0 shadow-sm`}
                          >
                            ✨ {grade.confidence} confidence
                          </Badge>
                          {grade.isGrade7Plus && (
                            <div className="mt-2">
                              <Badge className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs px-2 py-1 font-bold animate-pulse">
                                🎯 Target Hit!
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    align="center"
                    className="max-w-80 w-auto p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-xs rounded-2xl shadow-2xl border border-white/10 backdrop-blur-sm"
                  >
                    <div className="space-y-2">
                      <div className="font-semibold text-amber-300 text-center">🤖 AI Insight</div>
                      <div className="text-gray-200 leading-relaxed">
                        {getTooltipText(grade)}
                      </div>
                      {grade.isGrade7Plus && (
                        <div className="text-emerald-300 font-semibold text-center">🎉 Excellent work! Keep it up!</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Premium Statistics */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-purple-500/15 via-purple-500/10 to-purple-500/5 rounded-2xl border border-purple-500/20 shadow-lg">
                <Target className="h-5 w-5 text-purple-500 animate-pulse" />
                <span className="text-sm font-semibold text-foreground">
                  📊 {gradesData.filter(g => g.finalGrade !== '–').length} subjects tracked
                </span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-emerald-500/5 rounded-2xl border border-emerald-500/20 shadow-lg">
                <Zap className="h-5 w-5 text-emerald-500 animate-bounce" />
                <span className="text-sm font-semibold text-foreground">
                  ⚡ Real-time updates
                </span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 rounded-2xl border border-amber-500/20 shadow-lg">
                <Crown className="h-5 w-5 text-amber-500 animate-pulse" />
                <span className="text-sm font-semibold text-foreground">
                  👑 Premium insights
                </span>
              </div>
            </div>
            </div>
          </TooltipProvider>
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