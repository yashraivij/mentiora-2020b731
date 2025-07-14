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
      <Card className="mb-8 bg-gradient-to-br from-background via-background to-muted/5 border-border/30 shadow-2xl shadow-black/10 dark:shadow-black/30 backdrop-blur-xl relative overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <CardHeader className="pb-8 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                  <Brain className="h-8 w-8 text-primary-foreground relative z-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
                {/* Floating achievement badges */}
                <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
                  <Star className="h-2.5 w-2.5 text-white fill-white" />
                </div>
              </div>
              <div className="space-y-1">
                <CardTitle className="text-3xl font-black bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent tracking-tight">
                  AI Grade Predictions
                </CardTitle>
                <p className="text-muted-foreground font-medium text-base">Your path to GCSE excellence, powered by machine learning</p>
                <div className="flex items-center space-x-3 mt-2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
                    <Target className="h-3 w-3 mr-1" />
                    Real-time Analysis
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium Insights
                  </Badge>
                </div>
              </div>
            </div>
            <div className="hidden md:block text-right space-y-2">
              <div className="text-2xl font-bold text-foreground">
                {gradeData.filter(d => parseInt(d.predictedGrade) >= 7).length}/{gradeData.length}
              </div>
              <div className="text-sm text-muted-foreground">Grade 7+ Subjects</div>
              <div className="flex items-center justify-end space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-3 w-3 ${i < Math.floor(gradeData.filter(d => parseInt(d.predictedGrade) >= 7).length / gradeData.length * 5) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 relative">
          {/* Grade Chart Area */}
          <div className="relative bg-gradient-to-br from-muted/20 to-background/50 rounded-3xl p-8 border border-border/30 shadow-inner backdrop-blur-sm">
            {/* Chart grid background */}
            <div className="absolute inset-8 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="absolute w-full border-t border-muted-foreground/20" style={{ bottom: `${(i / 8) * 100}%` }}>
                  <span className="absolute -left-8 -top-2 text-xs text-muted-foreground font-medium">
                    {9 - i}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Grade bars */}
            <div className="relative flex items-end justify-center space-x-4 md:space-x-6 h-80">
              {gradeData.map((subject, index) => (
                <Tooltip key={subject.subjectId}>
                  <TooltipTrigger asChild>
                    <div className="group cursor-pointer flex flex-col items-center" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative mb-4">
                        {/* Grade achievement celebration */}
                        {parseInt(subject.predictedGrade) >= 8 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                            <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              🎉 Elite!
                            </div>
                          </div>
                        )}
                        {parseInt(subject.predictedGrade) === 7 && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-pulse">
                            <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                              🌟 Strong!
                            </div>
                          </div>
                        )}
                        
                        {/* Main grade bar */}
                        <div 
                          className={`
                            relative w-16 md:w-20 rounded-t-2xl transition-all duration-1000 ease-out
                            transform group-hover:scale-105 group-hover:shadow-2xl
                            ${subject.style.bgGradient} border-2 border-border/20
                            ${parseInt(subject.predictedGrade) >= 7 ? 'ring-2 ring-amber-400/60 shadow-amber-400/30' : ''}
                            animate-fade-in overflow-hidden
                          `}
                          style={{ 
                            height: `${Math.max((parseInt(subject.predictedGrade) / 9) * 280, 40)}px`,
                            animationDelay: `${index * 150}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          {/* Gradient fill */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${subject.style.color} opacity-90`} />
                          
                          {/* Success effects for high grades */}
                          {parseInt(subject.predictedGrade) >= 7 && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-t from-amber-400/30 via-transparent to-transparent animate-pulse" />
                              <div className="absolute top-2 right-2 w-4 h-4 bg-amber-400/90 rounded-full flex items-center justify-center">
                                <Star className="h-2 w-2 text-white fill-white" />
                              </div>
                            </>
                          )}
                          
                          {/* Animated progress fill */}
                          <div 
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/40 to-transparent transition-all duration-1000 ease-out"
                            style={{ 
                              height: `${Math.max(subject.finalScore, 10)}%`,
                              animationDelay: `${index * 200 + 500}ms`
                            }}
                          />
                          
                          {/* Grade display */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl md:text-3xl font-black text-white drop-shadow-xl tracking-tight">
                                {subject.finalScore > 0 ? subject.predictedGrade : '–'}
                              </div>
                              {subject.finalScore > 0 && (
                                <div className="text-xs font-bold text-white/90 bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm mt-1">
                                  {subject.finalScore.toFixed(0)}%
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000" />
                        </div>
                      </div>
                      
                      {/* Subject info */}
                      <div className="text-center space-y-2 min-h-[60px]">
                        <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                          {subject.subjectName}
                        </h4>
                        
                        {/* Enhanced confidence and progress */}
                        <div className="space-y-1">
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-1 ${getConfidenceColor(subject.confidence)} font-medium shadow-sm`}
                          >
                            {subject.confidence === 'high' ? '🎯' : subject.confidence === 'medium' ? '⚡' : '🔄'} {subject.confidence}
                          </Badge>
                          
                          {/* Progress bar */}
                          <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${subject.style.color} transition-all duration-1000 ease-out`}
                              style={{ 
                                width: `${(subject.practiceAttempts / subject.totalTopics) * 100}%`,
                                animationDelay: `${index * 100 + 800}ms`
                              }}
                            />
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">
                            {subject.practiceAttempts}/{subject.totalTopics} topics
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  
                  <TooltipContent side="top" className="max-w-md p-6 bg-card/98 backdrop-blur-2xl border-border/50 shadow-2xl rounded-2xl">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-lg bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                          {subject.subjectName}
                        </h4>
                        {parseInt(subject.predictedGrade) >= 7 && (
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 px-2 py-1 rounded-full">
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Excellence</span>
                          </div>
                        )}
                      </div>
                      
                      {subject.finalScore > 0 ? (
                        <>
                          {/* Performance metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-3 rounded-xl border border-primary/20">
                              <div className="text-xs text-muted-foreground mb-1">Practice Average</div>
                              <div className="text-xl font-bold text-primary">{subject.practiceScore.toFixed(1)}%</div>
                            </div>
                            {subject.examGrade && (
                              <div className="bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                <div className="text-xs text-muted-foreground mb-1">Latest Exam</div>
                                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Grade {subject.examGrade}</div>
                              </div>
                            )}
                            <div className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                              <div className="text-xs text-muted-foreground mb-1">Predicted Grade</div>
                              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">Grade {subject.predictedGrade}</div>
                            </div>
                            <div className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                              <div className="text-xs text-muted-foreground mb-1">Coverage</div>
                              <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{Math.round((subject.practiceAttempts / subject.totalTopics) * 100)}%</div>
                            </div>
                          </div>
                          
                          {/* AI insights */}
                          <div className="bg-gradient-to-br from-muted/30 to-background/50 p-4 rounded-xl border border-border/50">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="h-4 w-4 text-primary" />
                              <span className="text-sm font-semibold text-primary">AI Insight</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {subject.examGrade && subject.practiceAttempts > 0
                                ? `Outstanding progress! You're averaging ${subject.practiceScore.toFixed(0)}% across ${subject.subjectName} practice and scored Grade ${subject.examGrade} on your predicted paper. This trajectory puts you on track for Grade ${subject.predictedGrade}! 🚀`
                                : subject.examGrade
                                ? `Strong exam performance with Grade ${subject.examGrade}! Complete more practice topics to strengthen your foundation.`
                                : `Solid practice performance at ${subject.practiceScore.toFixed(0)}% average. Take a predicted exam to unlock your full potential!`
                              }
                            </p>
                          </div>
                          
                          {/* Motivational targets */}
                          {parseInt(subject.predictedGrade) < 7 ? (
                            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-sm font-bold text-primary">Next Level Target</span>
                              </div>
                              <p className="text-sm font-medium text-primary">
                                🎯 To achieve Grade {getNextGradeTarget(subject.predictedGrade)}, aim for {getTargetPercentage(getNextGradeTarget(subject.predictedGrade))}%+ across all topics. You're closer than you think!
                              </p>
                            </div>
                          ) : parseInt(subject.predictedGrade) >= 8 ? (
                            <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-300/50 dark:border-amber-700/50 rounded-xl p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">Elite Performance</span>
                              </div>
                              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                🌟 Exceptional work! You're performing at the highest level. Keep this momentum to secure your top grade!
                              </p>
                            </div>
                          ) : (
                            <div className="bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-300/50 dark:border-emerald-700/50 rounded-xl p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Strong Performance</span>
                              </div>
                              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                🎯 Great progress! You're on track for a strong Grade 7. Push for 85%+ to reach Grade 8 territory!
                              </p>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-6">
                          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            🚀 Start your journey! Complete practice questions to unlock your grade prediction and see your potential unfold.
                          </p>
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          
          {/* Premium stats footer */}
          <div className="mt-8 pt-6 border-t border-border/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-1">
                  {gradeData.filter(d => parseInt(d.predictedGrade) >= 7).length}
                </div>
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Grade 7+ Subjects</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-1">
                  {Math.round(gradeData.reduce((sum, d) => sum + d.finalScore, 0) / gradeData.length)}%
                </div>
                <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">Average Performance</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mb-1">
                  {gradeData.reduce((sum, d) => sum + d.practiceAttempts, 0)}
                </div>
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">Topics Completed</div>
              </div>
            </div>
            
            {/* Premium legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-4 py-2 rounded-full border border-primary/20 shadow-sm">
                <Brain className="h-3 w-3" />
                <span className="font-semibold">AI-Powered Predictions</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full border border-amber-200/50 dark:border-amber-800/50 shadow-sm">
                <Star className="h-3 w-3 fill-current" />
                <span className="font-semibold">Excellence Indicators</span>
              </div>
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full border border-emerald-200/50 dark:border-emerald-800/50 shadow-sm">
                <Target className="h-3 w-3" />
                <span className="font-semibold">Real-time Updates</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};