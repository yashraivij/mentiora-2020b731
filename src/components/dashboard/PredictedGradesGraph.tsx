import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles } from "lucide-react";
import { curriculum } from "@/data/curriculum";

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

interface SubjectGrade {
  subjectName: string;
  subjectId: string;
  averageScore: number;
  predictedGrade: number;
  gradeColor: string;
  hasProgress: boolean;
}

export const PredictedGradesGraph = ({ userProgress }: PredictedGradesGraphProps) => {
  const getGradeFromScore = (score: number): number => {
    if (score >= 85) return 9;
    if (score >= 75) return 8;
    if (score >= 65) return 7;
    if (score >= 55) return 6;
    if (score >= 45) return 5;
    if (score >= 35) return 4;
    if (score >= 25) return 3;
    if (score >= 15) return 2;
    return 1;
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 7) return "hsl(var(--success))";
    if (grade >= 4) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  const getSubjectGrades = (): SubjectGrade[] => {
    return curriculum.map(subject => {
      const subjectProgress = userProgress.filter(p => p.subjectId === subject.id);
      
      if (subjectProgress.length === 0) {
        return {
          subjectName: subject.name,
          subjectId: subject.id,
          averageScore: 0,
          predictedGrade: 0,
          gradeColor: "hsl(var(--muted))",
          hasProgress: false
        };
      }

      const averageScore = Math.round(
        subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length
      );
      const predictedGrade = getGradeFromScore(averageScore);

      return {
        subjectName: subject.name,
        subjectId: subject.id,
        averageScore,
        predictedGrade,
        gradeColor: getGradeColor(predictedGrade),
        hasProgress: true
      };
    }).filter(subject => subject.hasProgress).sort((a, b) => b.predictedGrade - a.predictedGrade);
  };

  const subjectGrades = getSubjectGrades();
  const maxScore = Math.max(...subjectGrades.map(s => s.averageScore), 100);

  if (subjectGrades.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                🔥 Your Grade Predictions
              </CardTitle>
              <p className="text-sm text-muted-foreground">Complete quizzes to see your predicted GCSE grades</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Start practicing to unlock your grade predictions!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/80 border-border/50 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                🔥 You're on track for great results!
              </CardTitle>
              <p className="text-sm text-muted-foreground">Every question you answer sharpens your prediction.</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-primary/10 to-primary/20 text-primary border-primary/20">
            Live Predictions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {subjectGrades.map((subject, index) => (
          <div key={subject.subjectId} className="group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <span className="font-medium text-foreground">{subject.subjectName}</span>
                <div className="flex items-center space-x-2">
                  <Badge 
                    className="font-bold text-white border-0 shadow-sm"
                    style={{ backgroundColor: subject.gradeColor }}
                  >
                    Grade {subject.predictedGrade}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {subject.averageScore}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{
                    width: `${(subject.averageScore / maxScore) * 100}%`,
                    backgroundColor: subject.gradeColor,
                    boxShadow: `0 0 20px ${subject.gradeColor}20`
                  }}
                />
              </div>
              
              {/* Grade marker */}
              <div 
                className="absolute -top-1 w-5 h-5 rounded-full border-2 border-background shadow-lg transition-all duration-700"
                style={{
                  left: `${(subject.averageScore / maxScore) * 100}%`,
                  backgroundColor: subject.gradeColor,
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center justify-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--success))" }} />
              <span>Grades 7-9</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--warning))" }} />
              <span>Grades 4-6</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(var(--destructive))" }} />
              <span>Below Grade 4</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};