import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { TrendingUp, Info, Star, AlertCircle, Sparkles, Target, Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface PredictedExamCompletion {
  id: string;
  subject_id: string;
  grade: string;
  percentage: number;
  completed_at: string;
}

interface PredictedGradesGraphProps {
  userProgress: UserProgress[];
}

interface SubjectGradeData {
  subjectId: string;
  subjectName: string;
  practiceScore: number;
  examGrade?: string;
  examPercentage?: number;
  finalScore: number;
  predictedGrade: string;
  confidence: 'high' | 'medium' | 'low';
  practiceAttempts: number;
  totalTopics: number;
  style: {
    color: string;
    glow: string;
    bgGradient: string;
    ring: string;
  };
}

// GCSE Grade to Percentage Mapping
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

// Percentage to GCSE Grade Mapping
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

// Premium subject colors and gradients - using semantic tokens
const subjectStyles = {
  physics: { 
    color: 'from-blue-500/90 to-blue-600/90', 
    glow: 'shadow-blue-500/30',
    bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/40',
    ring: 'ring-blue-200 dark:ring-blue-800',
  },
  chemistry: { 
    color: 'from-emerald-500/90 to-emerald-600/90', 
    glow: 'shadow-emerald-500/30',
    bgGradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/40',
    ring: 'ring-emerald-200 dark:ring-emerald-800',
  },
  biology: { 
    color: 'from-green-500/90 to-green-600/90', 
    glow: 'shadow-green-500/30',
    bgGradient: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/40',
    ring: 'ring-green-200 dark:ring-green-800',
  },
  mathematics: { 
    color: 'from-purple-500/90 to-purple-600/90', 
    glow: 'shadow-purple-500/30',
    bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/40',
    ring: 'ring-purple-200 dark:ring-purple-800',
  },
  english: { 
    color: 'from-rose-500/90 to-rose-600/90', 
    glow: 'shadow-rose-500/30',
    bgGradient: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/30 dark:to-rose-900/40',
    ring: 'ring-rose-200 dark:ring-rose-800',
  },
  history: { 
    color: 'from-amber-500/90 to-amber-600/90', 
    glow: 'shadow-amber-500/30',
    bgGradient: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/40',
    ring: 'ring-amber-200 dark:ring-amber-800',
  },
  geography: { 
    color: 'from-teal-500/90 to-teal-600/90', 
    glow: 'shadow-teal-500/30',
    bgGradient: 'bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/30 dark:to-teal-900/40',
    ring: 'ring-teal-200 dark:ring-teal-800',
  },
  default: { 
    color: 'from-slate-500/90 to-slate-600/90', 
    glow: 'shadow-slate-500/30',
    bgGradient: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/30 dark:to-slate-900/40',
    ring: 'ring-slate-200 dark:ring-slate-800',
  },
};

export const PredictedGradesGraph = ({ userProgress }: PredictedGradesGraphProps) => {
  const { user } = useAuth();
  const [examCompletions, setExamCompletions] = useState<PredictedExamCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExamCompletions = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('predicted_exam_completions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (error) {
          console.error('Error fetching exam completions:', error);
        } else {
          setExamCompletions(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamCompletions();
  }, [user?.id]);

  const gradeData = useMemo((): SubjectGradeData[] => {
    return curriculum.map(subject => {
      // Calculate practice score (average across all topics, unattempted = 0%)
      const subjectProgress = userProgress.filter(p => p.subjectId === subject.id);
      const totalTopics = subject.topics.length;
      const attemptedTopics = subjectProgress.length;
      
      const attemptedAverage = attemptedTopics > 0 
        ? subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / attemptedTopics
        : 0;
      
      // Include unattempted topics as 0% to encourage full coverage
      const practiceScore = totalTopics > 0 
        ? (attemptedAverage * attemptedTopics) / totalTopics
        : 0;

      // Get latest exam completion for this subject
      const latestExam = examCompletions
        .filter(exam => exam.subject_id === subject.id)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];

      // Calculate final score
      let finalScore = 0;
      let confidence: 'high' | 'medium' | 'low' = 'low';

      if (latestExam && attemptedTopics > 0) {
        // Both practice and exam data available
        const examPercentage = gradeToPercentage(latestExam.grade);
        finalScore = (practiceScore + examPercentage) / 2;
        confidence = attemptedTopics >= totalTopics * 0.8 ? 'high' : 'medium';
      } else if (latestExam) {
        // Only exam data
        finalScore = gradeToPercentage(latestExam.grade);
        confidence = 'medium';
      } else if (attemptedTopics > 0) {
        // Only practice data
        finalScore = practiceScore;
        confidence = attemptedTopics >= totalTopics * 0.6 ? 'medium' : 'low';
      } else {
        // No data
        finalScore = 0;
        confidence = 'low';
      }

      const style = subjectStyles[subject.id as keyof typeof subjectStyles] || subjectStyles.default;

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        practiceScore,
        examGrade: latestExam?.grade,
        examPercentage: latestExam ? gradeToPercentage(latestExam.grade) : undefined,
        finalScore,
        predictedGrade: percentageToGrade(finalScore),
        confidence,
        practiceAttempts: attemptedTopics,
        totalTopics,
        style,
      };
    }).filter(data => data.finalScore > 0 || data.practiceAttempts > 0); // Only show subjects with some data
  }, [userProgress, examCompletions]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-700 bg-emerald-100/70 border-emerald-300/50 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-700/50';
      case 'medium': return 'text-amber-700 bg-amber-100/70 border-amber-300/50 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-700/50';
      case 'low': return 'text-red-700 bg-red-100/70 border-red-300/50 dark:text-red-300 dark:bg-red-900/30 dark:border-red-700/50';
      default: return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  const getNextGradeTarget = (currentGrade: string) => {
    const gradeOrder = ['U', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const currentIndex = gradeOrder.indexOf(currentGrade);
    return currentIndex < gradeOrder.length - 1 ? gradeOrder[currentIndex + 1] : '9';
  };

  const getTargetPercentage = (targetGrade: string) => {
    switch (targetGrade) {
      case '9': return 90;
      case '8': return 80;
      case '7': return 70;
      case '6': return 60;
      case '5': return 50;
      case '4': return 40;
      default: return 70;
    }
  };

  if (isLoading) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-card to-card/80 border-border/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Predicted GCSE Grades</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Loading grade predictions...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (gradeData.length === 0) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-card to-card/80 border-border/50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Predicted GCSE Grades</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-32 space-y-3">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              Start revising to unlock your grade predictions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="mb-8 bg-gradient-to-br from-background via-background to-muted/10 border-border/50 shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/25">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Predicted GCSE Grades
                </CardTitle>
                <p className="text-muted-foreground">AI-powered predictions based on your performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-primary/30 shadow-sm">
                <Target className="h-3 w-3 mr-1" />
                Real-time Analysis
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {gradeData.map((subject) => (
              <Tooltip key={subject.subjectId}>
                <TooltipTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className="relative">
                      {/* Premium Grade Bar */}
                      <div className="relative">
                        <div 
                          className={`
                            relative h-36 rounded-3xl overflow-hidden transition-all duration-500 
                            group-hover:scale-105 group-hover:shadow-2xl 
                            ${subject.style.bgGradient}
                            border border-border/50 shadow-lg ${subject.style.glow}
                            ${parseInt(subject.predictedGrade) >= 7 ? `ring-2 ${subject.style.ring}/50 shadow-amber-400/20` : ''}
                          `}
                        >
                          {/* Animated background gradient */}
                          <div 
                            className={`absolute inset-0 bg-gradient-to-b ${subject.style.color} opacity-90`}
                          />
                          
                          {/* Success celebration for grade 7+ */}
                          {parseInt(subject.predictedGrade) >= 7 && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-transparent to-transparent" />
                              <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-amber-400/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <Star className="h-3 w-3 text-white fill-white" />
                                </div>
                              </div>
                            </>
                          )}
                          
                          {/* Grade display */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                            <div className="text-4xl font-black mb-2 drop-shadow-xl tracking-tight">
                              {subject.finalScore > 0 ? subject.predictedGrade : '–'}
                            </div>
                            {subject.finalScore > 0 && (
                              <div className="text-xs font-medium opacity-90 bg-black/20 px-2 py-1 rounded-full backdrop-blur-sm">
                                {subject.finalScore.toFixed(0)}%
                              </div>
                            )}
                          </div>

                          {/* Animated height indicator */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/30 to-transparent transition-all duration-700 ease-out"
                            style={{ height: `${Math.max(subject.finalScore * 0.8, 15)}%` }}
                          />
                          
                          {/* Subtle animation dots for premium feel */}
                          <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                          <div className="absolute top-5 left-5 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-100" />
                        </div>
                      </div>

                      {/* Premium subject info */}
                      <div className="mt-4 text-center space-y-2">
                        <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {subject.subjectName}
                        </h4>
                        
                        {/* Progress and confidence indicators */}
                        <div className="flex items-center justify-center space-x-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-1 ${getConfidenceColor(subject.confidence)} backdrop-blur-sm`}
                          >
                            {subject.confidence} confidence
                          </Badge>
                        </div>
                        
                        {/* Topic coverage */}
                        <div className="flex items-center justify-center space-x-1 text-xs text-muted-foreground">
                          <span>{subject.practiceAttempts}/{subject.totalTopics} topics</span>
                          {subject.practiceAttempts === subject.totalTopics && (
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                
                <TooltipContent side="top" className="max-w-md p-5 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-base">{subject.subjectName}</h4>
                      {parseInt(subject.predictedGrade) >= 7 && (
                        <div className="flex items-center space-x-1 text-amber-500">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-xs font-medium">Strong Performer</span>
                        </div>
                      )}
                    </div>
                    
                    {subject.finalScore > 0 ? (
                      <>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Practice Score</p>
                            <p className="font-semibold">{subject.practiceScore.toFixed(1)}%</p>
                          </div>
                          {subject.examGrade && (
                            <div className="space-y-1">
                              <p className="text-muted-foreground text-xs">Latest Exam</p>
                              <p className="font-semibold">Grade {subject.examGrade}</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Predicted Grade</p>
                            <p className="font-bold text-primary">Grade {subject.predictedGrade}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs">Coverage</p>
                            <p className="font-semibold">{subject.practiceAttempts}/{subject.totalTopics} topics</p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-border/50 space-y-2">
                          <div className="text-xs">
                            <p className="text-muted-foreground">
                              {subject.examGrade && subject.practiceAttempts > 0
                                ? `You're averaging ${subject.practiceScore.toFixed(0)}% across ${subject.subjectName} quizzes and scored a Grade ${subject.examGrade} in your predicted paper. That puts you on track for a Grade ${subject.predictedGrade} in the real exam.`
                                : subject.examGrade
                                ? `Based on your Grade ${subject.examGrade} predicted paper performance.`
                                : `Based on ${subject.practiceScore.toFixed(0)}% average across practice questions.`
                              }
                            </p>
                          </div>
                          
                          {parseInt(subject.predictedGrade) < 7 && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
                              <p className="text-xs text-primary font-medium">
                                🎯 To hit Grade {getNextGradeTarget(subject.predictedGrade)}, aim for {getTargetPercentage(getNextGradeTarget(subject.predictedGrade))}%+ across all topics.
                              </p>
                            </div>
                          )}
                          
                          {parseInt(subject.predictedGrade) >= 8 && (
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/50 rounded-lg p-2">
                              <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
                                🌟 Excellent work! You're on track for a top grade.
                              </p>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Start practicing topics to unlock your grade prediction.
                        </p>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Premium Legend */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2 bg-muted/30 px-3 py-2 rounded-full">
                <Info className="h-3 w-3" />
                <span>Hover bars for detailed insights</span>
              </div>
              <div className="flex items-center space-x-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 px-3 py-2 rounded-full border border-amber-200/50 dark:border-amber-800/50">
                <Star className="h-3 w-3 fill-current" />
                <span>Grade 7+ Excellence</span>
              </div>
              <div className="flex items-center space-x-2 bg-primary/5 text-primary px-3 py-2 rounded-full border border-primary/20">
                <Brain className="h-3 w-3" />
                <span>AI-Powered Predictions</span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 max-w-2xl mx-auto leading-relaxed">
              Grades calculated using intelligent weighting of practice questions and predicted exam performance. 
              Complete more topics to increase prediction confidence.
            </p>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};