import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Crown, LineChart, Star, Trophy } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface PredictedExamData {
  subject_id: string;
  grade: string;
  percentage: number;
  achieved_marks: number;
  total_marks: number;
  completed_at: string;
}

interface PredictivePerformanceCardProps {
  userProgress: UserProgress[];
}

export const PredictivePerformanceCard = ({ userProgress }: PredictivePerformanceCardProps) => {
  const [predictedExamData, setPredictedExamData] = useState<PredictedExamData[]>([]);

  useEffect(() => {
    fetchPredictedExamData();
  }, []);

  const fetchPredictedExamData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('predicted_exam_completions')
        .select('subject_id, grade, percentage, achieved_marks, total_marks, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching predicted exam data:', error);
        return;
      }

      // Group by subject, keeping the latest completion for each
      const latestCompletions: {[key: string]: PredictedExamData} = {};
      data?.forEach(completion => {
        if (!latestCompletions[completion.subject_id]) {
          latestCompletions[completion.subject_id] = completion;
        }
      });

      setPredictedExamData(Object.values(latestCompletions));
    } catch (error) {
      console.error('Error fetching predicted exam data:', error);
    }
  };

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

  const getEnhancedSubjectGrade = (subjectId: string) => {
    // Get practice questions performance
    const practicePercentage = getSubjectProgress(subjectId);
    const practiceAttempts = userProgress.filter(p => p.subjectId === subjectId)
      .reduce((sum, p) => sum + p.attempts, 0);
    
    // Get predicted 2026 exam performance
    const examData = predictedExamData.find(exam => exam.subject_id === subjectId);
    const examPercentage = examData?.percentage || 0;
    
    // Calculate combined grade with weighted approach
    let combinedPercentage = 0;
    
    if (practiceAttempts > 0 && examData) {
      // Both practice and exam data available - weighted combination
      // Recent exam data gets 60% weight, practice gets 40%
      combinedPercentage = Math.round((examPercentage * 0.6) + (practicePercentage * 0.4));
    } else if (examData) {
      // Only exam data available
      combinedPercentage = examPercentage;
    } else if (practiceAttempts > 0) {
      // Only practice data available
      combinedPercentage = practicePercentage;
    }
    
    return {
      percentage: combinedPercentage,
      grade: getPredictedGrade(combinedPercentage),
      hasExamData: !!examData,
      hasPracticeData: practiceAttempts > 0
    };
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
    return 1;
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
      const enhancedData = getEnhancedSubjectGrade(subject.id);
      
      return {
        ...subject,
        percentage: enhancedData.percentage,
        grade: enhancedData.grade,
        hasData: enhancedData.hasPracticeData || enhancedData.hasExamData,
        hasExamData: enhancedData.hasExamData,
        hasPracticeData: enhancedData.hasPracticeData
      };
    }).filter(subject => subject.hasData).slice(0, 5); // Show top 5 subjects
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
                      <span className="text-xs font-bold text-foreground">{subject.grade}</span>
                      {subject.grade >= 8 && <Star className="h-3 w-3 text-yellow-500" />}
                      {subject.grade === 9 && <Trophy className="h-3 w-3 text-amber-500" />}
                      <div className="flex items-center ml-1 space-x-0.5">
                        {subject.hasExamData && (
                          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" title="2026 Exam Data" />
                        )}
                        {subject.hasPracticeData && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="Practice Data" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-muted/20 space-y-1">
                <div>{subjects.length > 3 ? `+${subjects.length - 3} more subjects` : 'All subjects shown'}</div>
                <div className="flex items-center justify-center space-x-3 mt-1">
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    <span className="text-xs">2026 Exam</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="text-xs">Practice</span>
                  </div>
                </div>
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