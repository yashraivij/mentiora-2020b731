import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Trophy, Star, Zap } from "lucide-react";
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
    if (grade === 9) return "linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)"; // Premium purple-pink-amber
    if (grade === 8) return "linear-gradient(135deg, #10b981, #06b6d4, #3b82f6)"; // Emerald-cyan-blue
    if (grade === 7) return "linear-gradient(135deg, #22c55e, #84cc16, #eab308)"; // Green-lime-yellow
    if (grade === 6) return "linear-gradient(135deg, #fbbf24, #fb923c, #f472b6)"; // Yellow-orange-pink
    if (grade === 5) return "linear-gradient(135deg, #fb923c, #ef4444, #f97316)"; // Orange-red-orange
    if (grade === 4) return "linear-gradient(135deg, #f97316, #dc2626, #ea580c)"; // Orange-red-orange
    if (grade === 3) return "linear-gradient(135deg, #dc2626, #b91c1c, #ef4444)"; // Red gradient
    if (grade === 2) return "linear-gradient(135deg, #b91c1c, #991b1b, #dc2626)"; // Dark red gradient
    return "linear-gradient(135deg, #991b1b, #7f1d1d, #b91c1c)"; // Darkest red gradient
  };

  const getGradeColorClass = (grade: number) => {
    if (grade === 9) return "text-purple-500";
    if (grade === 8) return "text-emerald-500";
    if (grade === 7) return "text-green-500";
    if (grade === 6) return "text-yellow-500";
    if (grade === 5) return "text-orange-500";
    if (grade === 4) return "text-red-500";
    if (grade === 3) return "text-red-600";
    if (grade === 2) return "text-red-700";
    return "text-red-800";
  };

  const getGradeEmoji = (grade: number) => {
    if (grade >= 8) return "🏆";
    if (grade === 7) return "🌟";
    if (grade >= 5) return "⭐";
    if (grade === 4) return "💪";
    return "🎯";
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
    <Card className="mb-8 bg-gradient-to-br from-background via-purple-50/5 to-pink-50/5 dark:from-background dark:via-purple-950/10 dark:to-pink-950/10 border border-purple-200/20 dark:border-purple-800/20 shadow-2xl shadow-purple-500/5">
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
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 rounded-full border border-purple-500/20">
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">AI Powered</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Bar Chart Graph */}
        <div className="relative">
          {/* Y-axis labels (grades) */}
          <div className="absolute left-0 top-0 h-80 flex flex-col justify-between items-end pr-4 text-xs text-muted-foreground">
            {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(grade => (
              <div key={grade} className="h-8 flex items-center">
                Grade {grade}
              </div>
            ))}
          </div>
          
          {/* Main graph area */}
          <div className="ml-16 pl-4 border-l border-b border-border/30 h-80 relative">
            {/* Horizontal grid lines */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(grade => (
              <div 
                key={grade} 
                className="absolute w-full border-t border-border/10" 
                style={{ bottom: `${((grade - 1) / 8) * 100}%` }}
              />
            ))}
            
            {/* Bars Container */}
            <div className="h-full flex justify-center gap-4 px-4 relative">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="flex flex-col items-center group relative">
                  {/* Floating grade & emoji */}
                  <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:-translate-y-2 z-10">
                    <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-xl px-3 py-2 shadow-lg">
                      <div className="text-center">
                        <div className="text-lg font-bold">{getGradeEmoji(subject.grade)}</div>
                        <div className={`text-2xl font-bold ${getGradeColorClass(subject.grade)}`}>
                          {subject.grade}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {subject.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                   {/* Animated bar */}
                  <div 
                    className="w-14 md:w-20 rounded-t-xl absolute bottom-0 overflow-hidden shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-1"
                    style={{ 
                      height: `${((subject.grade - 1) / 8) * 320}px`,
                      background: getGradeColor(subject.grade),
                      minHeight: "12px",
                      filter: "drop-shadow(0 8px 25px rgba(168, 85, 247, 0.15))"
                    }}
                  >
                    {/* Enhanced shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                    
                    {/* Premium glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 opacity-50"></div>
                    
                    {/* Sparkle effect for high grades */}
                    {subject.grade >= 7 && (
                      <div className="absolute top-2 right-2">
                        <Star className="h-4 w-4 text-white/90 animate-pulse" />
                      </div>
                    )}
                    
                    {/* Lightning effect for grade 9 */}
                    {subject.grade === 9 && (
                      <div className="absolute top-3 left-2">
                        <Zap className="h-4 w-4 text-yellow-200 animate-bounce" />
                      </div>
                    )}
                    
                    {/* Premium particles for grade 9 */}
                    {subject.grade === 9 && (
                      <>
                        <div className="absolute top-1 left-3 w-1 h-1 bg-white/60 rounded-full animate-ping"></div>
                        <div className="absolute top-4 right-4 w-1 h-1 bg-yellow-300/60 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                      </>
                    )}
                  </div>
                  
                  {/* Subject name */}
                  <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="text-xs font-medium text-foreground truncate max-w-20">
                      {subject.name}
                    </div>
                    <div className={`text-sm font-bold ${getGradeColorClass(subject.grade)} group-hover:scale-110 transition-transform duration-300`}>
                      {subject.grade}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Legend with enhanced gradients */}
        <div className="mt-10 pt-8 border-t border-gradient-to-r from-purple-200/20 via-pink-200/20 to-amber-200/20">
          <div className="flex items-center justify-center flex-wrap gap-8 text-sm">
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)" }}></div>
              <span className="text-foreground font-semibold group-hover:text-purple-600 transition-colors">Grade 9</span>
              <span className="text-purple-500 text-lg">🏆</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4, #3b82f6)" }}></div>
              <span className="text-foreground font-semibold group-hover:text-emerald-600 transition-colors">Grade 8</span>
              <span className="text-emerald-500 text-lg">💎</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #22c55e, #84cc16, #eab308)" }}></div>
              <span className="text-foreground font-semibold group-hover:text-green-600 transition-colors">Grade 7</span>
              <span className="text-green-500 text-lg">🌟</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #fbbf24, #fb923c, #f472b6)" }}></div>
              <span className="text-foreground font-semibold group-hover:text-yellow-600 transition-colors">Grades 5-6</span>
              <span className="text-yellow-500 text-lg">⭐</span>
            </div>
            <div className="flex items-center space-x-3 group">
              <div className="w-6 h-6 rounded-full shadow-lg" style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c, #ef4444)" }}></div>
              <span className="text-foreground font-semibold group-hover:text-red-600 transition-colors">Grades 1-4</span>
              <span className="text-red-500 text-lg">🎯</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};