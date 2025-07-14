import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { TrendingUp, Info, Star, AlertCircle } from "lucide-react";
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
  color: string;
  gradient: string;
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

// Subject colors and gradients
const subjectStyles = {
  physics: { color: 'from-blue-400 to-blue-600', glow: 'shadow-blue-400/20' },
  chemistry: { color: 'from-green-400 to-green-600', glow: 'shadow-green-400/20' },
  biology: { color: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-400/20' },
  mathematics: { color: 'from-purple-400 to-purple-600', glow: 'shadow-purple-400/20' },
  english: { color: 'from-rose-400 to-rose-600', glow: 'shadow-rose-400/20' },
  history: { color: 'from-amber-400 to-amber-600', glow: 'shadow-amber-400/20' },
  geography: { color: 'from-teal-400 to-teal-600', glow: 'shadow-teal-400/20' },
  default: { color: 'from-slate-400 to-slate-600', glow: 'shadow-slate-400/20' },
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
        color: style.color,
        gradient: style.glow,
      };
    }).filter(data => data.finalScore > 0 || data.practiceAttempts > 0); // Only show subjects with some data
  }, [userProgress, examCompletions]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
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
      <Card className="mb-8 bg-gradient-to-br from-card to-card/80 border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">Predicted GCSE Grades</CardTitle>
                <p className="text-sm text-muted-foreground">Based on practice performance and exam scores</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              AI Prediction
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {gradeData.map((subject) => (
              <Tooltip key={subject.subjectId}>
                <TooltipTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className="relative">
                      {/* Grade Bar */}
                      <div 
                        className={`
                          relative h-32 rounded-2xl bg-gradient-to-b ${subject.color} 
                          shadow-lg ${subject.gradient} transition-all duration-300 
                          group-hover:scale-105 group-hover:shadow-xl overflow-hidden
                          ${parseInt(subject.predictedGrade) >= 7 ? 'ring-2 ring-amber-400/50' : ''}
                        `}
                      >
                        {/* Success glow for grade 7+ */}
                        {parseInt(subject.predictedGrade) >= 7 && (
                          <div className="absolute inset-0 bg-gradient-to-t from-amber-400/20 to-transparent" />
                        )}
                        
                        {/* Grade display */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center text-white">
                            <div className="text-3xl font-bold mb-1 drop-shadow-lg">
                              {subject.finalScore > 0 ? subject.predictedGrade : '–'}
                            </div>
                            {parseInt(subject.predictedGrade) >= 7 && (
                              <Star className="h-4 w-4 mx-auto text-amber-300" />
                            )}
                          </div>
                        </div>

                        {/* Height indicator based on percentage */}
                        <div 
                          className="absolute bottom-0 left-0 right-0 bg-white/20 transition-all duration-500"
                          style={{ height: `${Math.max(subject.finalScore, 10)}%` }}
                        />
                      </div>

                      {/* Subject name */}
                      <div className="mt-3 text-center">
                        <p className="font-medium text-sm text-foreground truncate">
                          {subject.subjectName}
                        </p>
                        
                        {/* Confidence indicator */}
                        <Badge 
                          variant="outline" 
                          className={`mt-1 text-xs ${getConfidenceColor(subject.confidence)}`}
                        >
                          {subject.confidence} confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                
                <TooltipContent side="top" className="max-w-sm p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-base">{subject.subjectName}</h4>
                    
                    {subject.finalScore > 0 ? (
                      <>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Practice Average:</span> {subject.practiceScore.toFixed(1)}%
                            {subject.examGrade && (
                              <>
                                <br />
                                <span className="font-medium">Latest Exam:</span> Grade {subject.examGrade} ({subject.examPercentage}%)
                              </>
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Predicted Grade:</span> Grade {subject.predictedGrade} ({subject.finalScore.toFixed(1)}%)
                          </p>
                        </div>
                        
                        <div className="pt-2 border-t border-border">
                          <p className="text-xs text-muted-foreground">
                            {subject.confidence === 'high' 
                              ? "Strong prediction based on comprehensive data."
                              : subject.confidence === 'medium'
                              ? "Good prediction - complete more topics for higher confidence."
                              : "Early prediction - more practice needed for accuracy."
                            }
                          </p>
                          
                          {parseInt(subject.predictedGrade) < 7 && (
                            <p className="text-xs text-primary mt-1">
                              💡 To hit Grade {getNextGradeTarget(subject.predictedGrade)}, aim for {getTargetPercentage(getNextGradeTarget(subject.predictedGrade))}%+ across all topics.
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Start practicing topics to see your predicted grade.
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center mt-6 space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Info className="h-3 w-3" />
              <span>Hover for details</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-amber-400" />
              <span>Grade 7+ target</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-blue-400 rounded-sm" />
              <span>Combined practice + exam scores</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};