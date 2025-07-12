import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Trophy } from "lucide-react";
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

export const PredictedGradesGraph = ({ userProgress }: PredictedGradesGraphProps) => {
  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    return Math.round(subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length);
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
    if (grade >= 7) return "hsl(var(--success))"; // Green
    if (grade >= 4) return "hsl(var(--warning))"; // Amber
    return "hsl(var(--destructive))"; // Red
  };

  const getGradeColorClass = (grade: number) => {
    if (grade >= 7) return "text-success";
    if (grade >= 4) return "text-warning";
    return "text-destructive";
  };

  const getSubjectsWithPredictions = () => {
    return curriculum.map(subject => {
      const percentage = getSubjectProgress(subject.id);
      const grade = getPredictedGrade(percentage);
      return {
        ...subject,
        percentage,
        grade,
        hasData: userProgress.some(p => p.subjectId === subject.id)
      };
    }).filter(subject => subject.hasData);
  };

  const subjects = getSubjectsWithPredictions();
  const averageGrade = subjects.length > 0 ? 
    Math.round(subjects.reduce((sum, s) => sum + s.grade, 0) / subjects.length) : 0;

  const getEncouragingMessage = () => {
    if (averageGrade >= 7) return "🔥 Outstanding! You're on track for top grades!";
    if (averageGrade >= 5) return "🚀 Great progress! Keep pushing for those higher grades!";
    if (averageGrade >= 4) return "💪 You're building momentum! Every question counts!";
    return "🌟 You're getting started! Every step forward matters!";
  };

  if (subjects.length === 0) {
    return (
      <Card className="mb-8 bg-gradient-to-br from-background via-background to-muted/5 border-border/50 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                Predicted GCSE Grades
              </CardTitle>
              <p className="text-muted-foreground">Start practicing to see your grade predictions!</p>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Powered</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Complete some practice questions to see your predictions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 bg-gradient-to-br from-background via-background to-muted/5 border-border/50 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Predicted GCSE Grades
            </CardTitle>
            <p className="text-muted-foreground">{getEncouragingMessage()}</p>
            <p className="text-xs text-muted-foreground mt-1">Every question you answer sharpens your prediction</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI Powered</span>
            </div>
            <Badge variant="outline" className="bg-card/50">
              Avg Grade {averageGrade}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="relative group p-4 rounded-xl border border-border/50 bg-card/30 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Grade improvement indicator - placeholder for future animation */}
              <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-success-foreground" />
                </div>
              </div>
              
              <div className="text-center">
                <h4 className="font-semibold text-sm text-foreground mb-2 truncate">
                  {subject.name}
                </h4>
                
                {/* Predicted Grade - Big Font */}
                <div className={`text-4xl font-bold mb-1 ${getGradeColorClass(subject.grade)}`}>
                  {subject.grade}
                </div>
                
                {/* Percentage Score - Small Text */}
                <div className="text-xs text-muted-foreground mb-3">
                  {subject.percentage}% average
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-muted/30 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${subject.percentage}%`,
                      backgroundColor: getGradeColor(subject.grade)
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">Grades 7-9</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span className="text-muted-foreground">Grades 4-6</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">Grades 1-3</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};