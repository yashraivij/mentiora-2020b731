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

        console.log('🔍 Exam data fetched:', examData);
        console.log('🔍 User progress:', userProgress);

        // Get all unique subject IDs from curriculum, user progress, and exam data
        const curriculumSubjectIds = curriculum.map(s => s.id);
        const progressSubjectIds = [...new Set(userProgress.map((p: any) => p.subjectId))];
        const examSubjectIds = [...new Set(examData?.map(exam => exam.subject_id) || [])];
        
        console.log('🔍 Curriculum subjects:', curriculumSubjectIds);
        console.log('🔍 Progress subjects:', progressSubjectIds);
        console.log('🔍 Exam subjects:', examSubjectIds);
        
        const allSubjectIds = [...new Set([...curriculumSubjectIds, ...progressSubjectIds, ...examSubjectIds])];
        console.log('🔍 All combined subjects:', allSubjectIds);

        const gradePromises = allSubjectIds.map(async (subjectId) => {
          // Find subject in curriculum or create a basic subject info
          const curriculumSubject = curriculum.find(s => s.id === subjectId);
          const subjectName = curriculumSubject?.name || 
            subjectId.charAt(0).toUpperCase() + subjectId.slice(1);

          // Calculate practice score for this subject
          const subjectProgress = userProgress.filter((p: any) => p.subjectId === subjectId);
          
          // Get all topics for this subject and calculate average including unattempted as 0%
          const totalTopics = curriculumSubject?.topics.length || 1;
          const attemptedTopicsScore = subjectProgress.reduce((sum: number, p: any) => sum + p.averageScore, 0);
          const practiceScore = subjectProgress.length > 0 ? Math.round(attemptedTopicsScore / subjectProgress.length) : 0;

          // Get latest exam grade for this subject
          const latestExam = examData?.filter(exam => exam.subject_id === subjectId)
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

          const gradeData = {
            subjectId,
            subjectName,
            practiceScore,
            examGrade,
            finalGrade,
            finalPercentage,
            confidence,
            practiceCount,
            isGrade7Plus: finalPercentage >= 70
          } as GradeData;

          console.log(`🔍 Grade data for ${subjectId}:`, gradeData);
          return gradeData;
        });

        const grades = await Promise.all(gradePromises);
        console.log('🔍 All grades before filtering:', grades);
        
        // Show ALL subjects that have any data - don't filter out subjects with grade "–"
        const gradesWithData = grades.filter(grade => 
          grade.practiceScore > 0 || grade.examGrade !== null
        );
        
        console.log('🔍 Final grades after filtering:', gradesWithData);
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
    const gradeNum = parseInt(grade);
    if (gradeNum >= 9) return 'text-white font-extrabold drop-shadow-lg';
    if (gradeNum >= 8) return 'text-white font-bold drop-shadow-md';
    if (gradeNum >= 7) return 'text-white font-bold drop-shadow-md';
    if (gradeNum >= 5) return 'text-white font-semibold drop-shadow-sm';
    return 'text-white font-medium';
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
    <Card className="glass-effect mb-8 relative overflow-hidden border-2 border-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20">
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
          <div className="space-y-6">
            {/* Premium Grade bars */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {gradesData.map((grade, index) => (
                <div key={grade.subjectId} className="group relative transform transition-all duration-300 hover:scale-105">
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

                    {/* Premium Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-xs rounded-2xl shadow-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 w-72 pointer-events-none backdrop-blur-sm">
                      <div className="text-center space-y-2">
                        <div className="font-semibold text-amber-300">🤖 AI Insight</div>
                        <div className="text-gray-200 leading-relaxed">
                          {getTooltipText(grade)}
                        </div>
                        {grade.isGrade7Plus && (
                          <div className="text-emerald-300 font-semibold">🎉 Excellent work! Keep it up!</div>
                        )}
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
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