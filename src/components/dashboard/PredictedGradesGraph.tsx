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
  subscribed?: boolean;
}

export const PredictedGradesGraph = ({ userProgress, subscribed = false }: PredictedGradesGraphProps) => {
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

  const calculatePredictedGrades = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Fetch predicted exam completions
      const { data: examData, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching exam data:', error);
        return;
      }

      // Process userProgress to get practice data by subject
      const subjectProgress = new Map<string, { totalScore: number; count: number; attempts: number }>();
      
      userProgress.forEach(progress => {
        if (!subjectProgress.has(progress.subjectId)) {
          subjectProgress.set(progress.subjectId, { totalScore: 0, count: 0, attempts: 0 });
        }
        const current = subjectProgress.get(progress.subjectId)!;
        
        if (progress.attempts > 0) {
          // Calculate average including unattempted topics as 0%
          const subjectTopicsCount = curriculum.find(s => s.id === progress.subjectId)?.topics?.length || 1;
          current.count = subjectTopicsCount;
          current.totalScore += progress.averageScore;
          current.attempts += progress.attempts;
        }
      });

      // Calculate practice scores for subjects
      const practiceScores = new Map<string, { score: number; attempts: number }>();
      subjectProgress.forEach((data, subjectId) => {
        if (data.count > 0) {
          const practiceScore = data.totalScore / data.count;
          practiceScores.set(subjectId, { 
            score: Math.round(practiceScore), 
            attempts: data.attempts 
          });
        }
      });

      // Process exam data
      const examGrades = new Map<string, { grade: string; percentage: number }>();
      examData?.forEach(exam => {
        examGrades.set(exam.subject_id, {
          grade: exam.grade,
          percentage: exam.percentage
        });
      });

      // Get all unique subjects from both practice and exams
      const allSubjects = new Set([
        ...Array.from(practiceScores.keys()),
        ...Array.from(examGrades.keys())
      ]);

      // Calculate final grades for each subject
      const results: GradeData[] = [];
      
      allSubjects.forEach(subjectId => {
        const subject = curriculum.find(s => s.id === subjectId);
        if (!subject) return;

        const practiceData = practiceScores.get(subjectId);
        const examData = examGrades.get(subjectId);

        let combinedResult: { grade: string; percentage: number; confidence: 'high' | 'medium' | 'low' };

        if (practiceData && examData) {
          // If both exist, combine with weighted average (predicted exam has more weight - 70%)
          const combinedPercentage = Math.round(
            (examData.percentage * 0.7) + (practiceData.score * 0.3)
          );
          combinedResult = {
            grade: percentageToGrade(combinedPercentage),
            percentage: combinedPercentage,
            confidence: practiceData.attempts >= 5 ? 'high' : 'medium'
          };
        } else if (examData) {
          // Only exam data available
          combinedResult = {
            grade: examData.grade,
            percentage: examData.percentage,
            confidence: 'high'
          };
        } else if (practiceData) {
          // Only practice data available - be more conservative
          const adjustedScore = Math.max(practiceData.score - 5, 0); // Slightly lower prediction
          combinedResult = {
            grade: percentageToGrade(adjustedScore),
            percentage: adjustedScore,
            confidence: practiceData.attempts >= 10 ? 'medium' : 'low'
          };
        } else {
          // No data available
          combinedResult = {
            grade: '–',
            percentage: 0,
            confidence: 'low'
          };
        }

        results.push({
          subjectId,
          subjectName: subject.name,
          practiceScore: practiceData?.score || 0,
          examGrade: examData?.grade || null,
          finalGrade: combinedResult.grade,
          finalPercentage: combinedResult.percentage,
          confidence: combinedResult.confidence,
          practiceCount: practiceData?.attempts || 0,
          isGrade7Plus: combinedResult.grade !== 'U' && !isNaN(parseInt(combinedResult.grade)) && parseInt(combinedResult.grade) >= 7
        });
      });

      // Sort by final percentage (highest first)
      results.sort((a, b) => b.finalPercentage - a.finalPercentage);
      
      setGradesData(results);
    } catch (error) {
      console.error('Error calculating predicted grades:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePredictedGrades();
  }, [user?.id, userProgress]);

  // Enhanced color schemes for subjects
  const getSubjectColor = (index: number): string => {
    const colors = [
      'from-emerald-400 via-emerald-500 to-teal-600',
      'from-blue-400 via-blue-500 to-indigo-600', 
      'from-purple-400 via-purple-500 to-violet-600',
      'from-rose-400 via-rose-500 to-pink-600',
      'from-amber-400 via-orange-500 to-red-600',
      'from-cyan-400 via-cyan-500 to-blue-600',
      'from-lime-400 via-green-500 to-emerald-600',
      'from-fuchsia-400 via-fuchsia-500 to-purple-600',
      'from-yellow-400 via-amber-500 to-orange-600',
      'from-indigo-400 via-indigo-500 to-purple-600'
    ];
    return colors[index % colors.length];
  };

  // Shadow effects matching colors
  const getSubjectShadow = (index: number): string => {
    const shadows = [
      'shadow-emerald-500/25',
      'shadow-blue-500/25',
      'shadow-purple-500/25',
      'shadow-rose-500/25',
      'shadow-orange-500/25',
      'shadow-cyan-500/25',
      'shadow-green-500/25',
      'shadow-fuchsia-500/25',
      'shadow-amber-500/25',
      'shadow-indigo-500/25'
    ];
    return shadows[index % shadows.length];
  };

  // Enhanced grade text colors
  const getGradeColor = (grade: string): string => {
    const gradeNum = parseInt(grade);
    if (gradeNum >= 9) return 'text-amber-500 dark:text-amber-400 font-extrabold drop-shadow-lg';
    if (gradeNum >= 8) return 'text-emerald-500 dark:text-emerald-400 font-bold drop-shadow-md';
    if (gradeNum >= 7) return 'text-black dark:text-white font-bold drop-shadow-md';
    if (gradeNum >= 4) return 'text-gray-700 dark:text-gray-300 font-semibold';
    return 'text-gray-500 dark:text-gray-400 font-medium';
  };

  // Enhanced tooltip content
  const getTooltipText = (grade: GradeData): string => {
    const gradeNum = parseInt(grade.finalGrade);
    const isHighGrade = !isNaN(gradeNum) && gradeNum >= 7;
    const isMidGrade = !isNaN(gradeNum) && gradeNum >= 4 && gradeNum < 7;

    let text = '';
    
    if (isHighGrade) {
      if (grade.examGrade && grade.practiceScore > 0) {
        text = `🌟 Outstanding Performance: Your ${grade.practiceScore}% practice average combined with your Grade ${grade.examGrade} predicted exam result forecasts a stellar Grade ${grade.finalGrade}. You're excelling in ${grade.subjectName}!`;
      } else if (grade.examGrade) {
        text = `🎯 Exam Excellence: Your Grade ${grade.examGrade} predicted exam performance suggests you're on track for a Grade ${grade.finalGrade} in ${grade.subjectName}. Keep up the excellent work!`;
      } else {
        text = `💪 Room for Growth: Based on your ${grade.practiceScore}% practice average and Grade ${grade.examGrade} predicted exam, our premium system forecasts a Grade ${grade.finalGrade}. With focused revision, significant improvement is absolutely achievable.`;
      }
    } else if (isMidGrade) {
      if (grade.examGrade && grade.practiceScore > 0) {
        text = `📈 Solid Foundation: Your ${grade.practiceScore}% practice average and Grade ${grade.examGrade} exam prediction indicate a Grade ${grade.finalGrade} trajectory. There's excellent potential to push towards higher grades with targeted revision.`;
      } else if (grade.practiceScore > 0) {
        text = `📚 Development Phase: Your current ${grade.practiceScore}% practice average in ${grade.subjectName} suggests a Grade ${grade.finalGrade} trajectory. Our premium system identifies key areas where targeted revision can unlock substantial improvements.`;
      }
    } else {
      text = `⭐ Growth Opportunity: ${grade.subjectName} shows tremendous potential for improvement. Focus on fundamental concepts and consistent practice to see dramatic grade improvements.`;
    }

    // Add confidence indicator
    if (grade.confidence === 'high') {
      text += ` ✅ High confidence prediction based on substantial data.`;
    } else if (grade.confidence === 'medium') {
      text += ` 📊 Medium confidence - complete more practice for refined predictions.`;
    } else {
      text += ` 🔍 Early prediction - more practice needed for accuracy.`;
    }

    return text;
  };

  if (loading) {
    return (
      <Card className="glass-effect mb-8 animate-pulse">
        <CardHeader>
          <div className="h-8 bg-muted rounded-lg"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 bg-muted rounded-3xl"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate average grade (same logic as PredictivePerformanceCard)
  const gradesWithData = gradesData.filter(g => g.finalGrade !== '–' && !isNaN(parseInt(g.finalGrade)));
  const averageGrade = gradesWithData.length > 0 
    ? gradesWithData.reduce((sum, g) => sum + parseInt(g.finalGrade), 0) / gradesWithData.length 
    : 0;

  const grade7PlusCount = gradesData.filter(g => g.isGrade7Plus).length;

  return (
    <Card className="glass-effect mb-8 relative border-2 border-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 overflow-visible">
      {/* Premium background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-emerald-500/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/10 via-purple-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-transparent rounded-full blur-2xl" />
      
      {/* Floating elements for premium feel */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-75" />
      <div className="absolute top-8 right-12 w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />

      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent flex items-center space-x-3">
                <span>Predicted GCSE Grades</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1 font-medium">Real-time predictions based on your progress</p>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            {averageGrade > 0 && (
              <div className={`text-center p-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl border border-purple-500/20 ${!subscribed ? 'blur-md' : ''}`}>
                <div className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{averageGrade.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground font-semibold">Avg Grade</div>
              </div>
            )}
            {grade7PlusCount > 0 && (
              <Badge className={`bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 text-white border-0 px-4 py-2 text-sm font-bold shadow-lg shadow-emerald-500/25 animate-pulse ${!subscribed ? 'blur-md' : ''}`}>
                <Trophy className="h-4 w-4 mr-2 animate-bounce" />
                <span>{grade7PlusCount} Grade 7+ 🎉</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative">
        {gradesData.some(g => g.finalGrade !== '–') ? (
          <div className="relative">
            {/* Premium CTA overlay for free users */}
            {!subscribed && (
              <div className="absolute inset-0 z-50 bg-gradient-to-br from-purple-600/95 via-blue-600/95 to-emerald-600/95 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-pulse">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      🎯 Unlock Premium Insights
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed">
                      Get detailed grade predictions, performance insights, and personalized study recommendations
                    </p>
                  </div>
                  <button 
                    onClick={() => window.dispatchEvent(new Event('openPremiumPaywall'))}
                    className="bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-black font-bold px-8 py-3 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse"
                  >
                    ✨ Upgrade to Premium
                  </button>
                </div>
              </div>
            )}
            
            <TooltipProvider>
              <div className="space-y-6">
                {/* Premium Grade bars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 overflow-visible">
                  {gradesData.map((grade, index) => (
                    subscribed ? (
                      <Tooltip key={grade.subjectId}>
                        <TooltipTrigger asChild>
                          <div className="group relative transform transition-all duration-300 hover:scale-105 cursor-pointer">
                            <div className="relative">
                              {/* Premium Bar with enhanced effects */}
                              <div className={`relative h-40 bg-gradient-to-t from-gray-100/30 to-gray-50/20 dark:from-gray-800/30 dark:to-gray-700/20 rounded-3xl overflow-hidden border-2 border-white/20 backdrop-blur-sm shadow-xl ${getSubjectShadow(index)} group-hover:shadow-2xl transition-all duration-500 ${!subscribed ? 'blur-lg' : ''}`}>
                                {grade.finalGrade !== '–' && (
                                  <>
                                    {/* Main gradient bar */}
                                    <div 
                                      className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getSubjectColor(index)} rounded-b-3xl transition-all duration-1000 ease-out animate-in slide-in-from-bottom-4`}
                                      style={{ 
                                        height: subscribed ? `${Math.max(grade.finalPercentage, 10)}%` : `100%`,
                                        filter: grade.isGrade7Plus ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                                      }}
                                    />
                                   
                                    {/* Premium glow overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-3xl opacity-60" />
                                    
                                    {/* Animated shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-3xl animate-pulse" />
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
                                {grade.isGrade7Plus && (
                                  <div className="mt-2">
                                    <Badge className={`bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs px-2 py-1 font-bold animate-pulse ${!subscribed ? 'blur-sm' : ''}`}>
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
                          sideOffset={10}
                          className="max-w-80 w-auto p-4 bg-gradient-to-br from-purple-600/95 via-blue-600/95 to-emerald-600/95 backdrop-blur-sm text-white text-sm rounded-xl shadow-2xl border-2 border-white/30 relative overflow-hidden z-50"
                          avoidCollisions={true}
                          sticky="always"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 animate-pulse" />
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-yellow-300/30 to-amber-400/30 rounded-full blur-xl" />
                          <div className="relative space-y-2">
                            <div className="font-bold text-white drop-shadow-md bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent">{grade.subjectName}</div>
                            <div className="text-sm text-white/90 leading-relaxed drop-shadow-sm">
                              {getTooltipText(grade)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-300 to-amber-400 rounded-full animate-ping shadow-lg" />
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <div key={grade.subjectId} className="group relative transform transition-all duration-300 cursor-pointer">
                        <div className="relative">
                          {/* Premium Bar with enhanced effects */}
                          <div className={`relative h-40 bg-gradient-to-t from-gray-100/30 to-gray-50/20 dark:from-gray-800/30 dark:to-gray-700/20 rounded-3xl overflow-hidden border-2 border-white/20 backdrop-blur-sm shadow-xl ${getSubjectShadow(index)} group-hover:shadow-2xl transition-all duration-500 ${!subscribed ? 'blur-lg' : ''}`}>
                            {grade.finalGrade !== '–' && (
                              <>
                                {/* Main gradient bar */}
                                <div 
                                  className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${getSubjectColor(index)} rounded-b-3xl transition-all duration-1000 ease-out animate-in slide-in-from-bottom-4`}
                                  style={{ 
                                    height: subscribed ? `${Math.max(grade.finalPercentage, 10)}%` : `100%`,
                                    filter: grade.isGrade7Plus ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.6))' : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
                                  }}
                                />
                               
                                {/* Premium glow overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-3xl opacity-60" />
                                
                                {/* Animated shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-3xl animate-pulse" />
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
                            {grade.isGrade7Plus && (
                              <div className="mt-2">
                                <Badge className={`bg-gradient-to-r from-emerald-400 to-teal-500 text-white text-xs px-2 py-1 font-bold animate-pulse ${!subscribed ? 'blur-sm' : ''}`}>
                                  🎯 Target Hit!
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
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
          </div>
        ) : (
          <div className="text-center py-16 relative">
            {/* Premium background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-emerald-500/10 rounded-3xl" />
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/20 to-rose-500/20 rounded-full blur-2xl animate-bounce" />
            <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-xl" />
            
            {/* Floating elements */}
            <div className="absolute top-8 right-12 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-80" />
            <div className="absolute bottom-12 left-16 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce opacity-60" />
            <div className="absolute top-16 left-12 w-2.5 h-2.5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping opacity-70" />
            
            <div className="relative z-10">
              {/* Premium icon container */}
              <div className="relative mx-auto mb-8 w-fit">
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-purple-500/25 animate-pulse">
                  <TrendingUp className="h-12 w-12 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full border-4 border-background animate-bounce shadow-lg">
                  <Sparkles className="h-4 w-4 text-white m-auto mt-1" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full border-2 border-background animate-pulse shadow-md">
                  <Crown className="h-3 w-3 text-white m-auto mt-1" />
                </div>
              </div>
              
              {/* Premium content */}
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    ✨ Start Revising to Unlock Predictions
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    Complete practice questions or take predicted papers to see your <span className="font-semibold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">grade forecasts</span>
                  </p>
                </div>
                
                {/* Premium features showcase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 border border-purple-200/60 dark:border-purple-800/40 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">Accurate Predictions</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">AI-powered grade forecasting based on your performance data</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/60 dark:border-emerald-800/40 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">Progress Tracking</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Monitor improvement across all subjects in real-time</p>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/60 dark:border-amber-800/40 shadow-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 mb-2">Smart Insights</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Personalized recommendations for grade improvement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};