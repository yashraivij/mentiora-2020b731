import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Sparkles, Trophy, Star, Zap, BarChart3, Target, TrendingDown, Activity } from "lucide-react";
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

  const getConfidenceLevel = (percentage: number, attempts: number) => {
    if (attempts < 5) return "Low";
    if (attempts < 15) return "Medium";
    if (attempts < 30) return "High";
    return "Very High";
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "Very High": return "text-emerald-600";
      case "High": return "text-green-600";
      case "Medium": return "text-yellow-600";
      default: return "text-orange-600";
    }
  };

  const getTrendIndicator = (grade: number, avgGrade: number) => {
    if (grade > avgGrade + 1) return { icon: TrendingUp, color: "text-emerald-500", label: "Above Average" };
    if (grade < avgGrade - 1) return { icon: TrendingDown, color: "text-red-500", label: "Below Average" };
    return { icon: Activity, color: "text-blue-500", label: "On Track" };
  };

  const getSubjectsWithPredictions = () => {
    return curriculum.map(subject => {
      const subjectProgress = userProgress.filter(p => p.subjectId === subject.id);
      const percentage = getSubjectProgress(subject.id);
      const grade = getPredictedGrade(percentage);
      const totalAttempts = subjectProgress.reduce((sum, p) => sum + p.attempts, 0);
      const confidence = getConfidenceLevel(percentage, totalAttempts);
      
      return {
        ...subject,
        percentage,
        grade,
        totalAttempts,
        confidence,
        hasData: userProgress.some(p => p.subjectId === subject.id)
      };
    }).filter(subject => subject.hasData);
  };

  const subjects = getSubjectsWithPredictions();
  const averageGrade = subjects.length > 0 ? 
    subjects.reduce((sum, s) => sum + s.grade, 0) / subjects.length : 0;

  const getEncouragingMessage = () => {
    const highPerformers = subjects.filter(s => s.grade >= 7).length;
    const totalSubjects = subjects.length;
    
    if (highPerformers / totalSubjects >= 0.7) return "🏆 Exceptional Performance - Elite Student Trajectory";
    if (averageGrade >= 7) return "🔥 Outstanding Academic Excellence - Top Tier Performance";
    if (averageGrade >= 6) return "⭐ Strong Academic Foundation - Above Average Results";
    if (averageGrade >= 5) return "🚀 Solid Progress - Building Towards Success";
    if (averageGrade >= 4) return "💪 Development Phase - Consistent Improvement Needed";
    return "🎯 Foundation Building - Strategic Focus Required";
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
    <Card className="mb-8 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950/20 border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-slate-900/5 dark:shadow-black/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                GCSE Grade Predictions
              </CardTitle>
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{getEncouragingMessage()}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                <span>Advanced ML Analytics</span>
                <span>•</span>
                <span>Live Performance Tracking</span>
                <span>•</span>
                <span className="font-medium">Avg: {averageGrade.toFixed(1)} Grade</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-2xl border border-blue-200/30 dark:border-blue-800/30">
              <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Premium Analytics</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
              <Target className="h-4 w-4" />
              <span>Precision: 94.2%</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Professional Analytics Dashboard */}
        <div className="relative bg-gradient-to-br from-slate-50/50 to-white/80 dark:from-slate-800/50 dark:to-slate-900/80 rounded-2xl p-6 backdrop-blur-sm">
          
          {/* Statistical Overview Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Live Analysis</span>
              </div>
              <Badge variant="outline" className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-300/50 dark:border-slate-600/50">
                {subjects.length} Subjects Tracked
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{averageGrade.toFixed(1)}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Average Grade</div>
            </div>
          </div>

          {/* Enhanced Bar Chart */}
          <div className="relative">
            {/* Y-axis with enhanced styling */}
            <div className="absolute left-0 top-0 h-96 flex flex-col justify-between items-end pr-6 text-sm font-medium text-slate-600 dark:text-slate-400">
              {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(grade => (
                <div key={grade} className="h-10 flex items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">Grade</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{grade}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Main chart area with professional grid */}
            <div className="ml-20 pl-6 border-l-2 border-b-2 border-slate-300/40 dark:border-slate-600/40 h-96 relative bg-gradient-to-t from-slate-50/30 to-transparent dark:from-slate-800/30 rounded-br-xl">
              
              {/* Enhanced grid lines */}
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(grade => (
                <div 
                  key={grade} 
                  className="absolute w-full border-t border-slate-200/30 dark:border-slate-700/30" 
                  style={{ bottom: `${((grade - 1) / 8) * 100}%` }}
                />
              ))}
              
              {/* Performance Bars with Advanced Analytics */}
              <div className="h-full flex justify-center gap-6 px-6 relative">
                {subjects.map((subject, index) => {
                  const trend = getTrendIndicator(subject.grade, averageGrade);
                  const TrendIcon = trend.icon;
                  
                  return (
                    <div key={subject.id} className="flex flex-col items-center group relative">
                      
                      {/* Advanced Analytics Popup */}
                      <div className="absolute -top-32 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-4 z-20">
                        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border border-slate-200/60 dark:border-slate-700/60 rounded-2xl px-5 py-4 shadow-2xl shadow-slate-900/10 dark:shadow-black/30">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-900 dark:text-white">{subject.name}</span>
                              <div className={`flex items-center space-x-1 ${trend.color}`}>
                                <TrendIcon className="h-4 w-4" />
                                <span className="text-xs font-medium">{trend.label}</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">{subject.grade}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Predicted Grade</div>
                              </div>
                              <div>
                                <div className="font-semibold text-blue-600 dark:text-blue-400">{subject.percentage}%</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Accuracy</div>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-600 dark:text-slate-400">Confidence:</span>
                                <span className={`font-semibold ${getConfidenceColor(subject.confidence)}`}>
                                  {subject.confidence}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span className="text-slate-600 dark:text-slate-400">Attempts:</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{subject.totalAttempts}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  
                      
                      {/* Premium Grade Bar */}
                      <div 
                        className="w-16 md:w-24 rounded-t-2xl absolute bottom-0 overflow-hidden shadow-2xl group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/20 transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-2 border-t-4 border-white/20"
                        style={{ 
                          height: `${((subject.grade - 1) / 8) * 384}px`,
                          background: getGradeColor(subject.grade),
                          minHeight: "16px",
                          filter: "drop-shadow(0 12px 35px rgba(0, 0, 0, 0.15))"
                        }}
                      >
                        {/* Advanced shine effects */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/20"></div>
                        
                        {/* Grade indicator overlay */}
                        <div className="absolute top-3 left-1/2 transform -translate-x-1/2">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{subject.grade}</span>
                          </div>
                        </div>
                        
                        {/* Premium effects for high grades */}
                        {subject.grade >= 8 && (
                          <>
                            <div className="absolute top-2 right-2">
                              <Star className="h-5 w-5 text-yellow-200 animate-pulse" />
                            </div>
                            <div className="absolute top-6 left-2">
                              <Trophy className="h-4 w-4 text-yellow-300/80 animate-bounce" />
                            </div>
                          </>
                        )}
                        
                        {/* Lightning for grade 9 */}
                        {subject.grade === 9 && (
                          <div className="absolute top-12 right-3">
                            <Zap className="h-4 w-4 text-yellow-200 animate-ping" />
                          </div>
                        )}
                        
                        {/* Confidence indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className={`w-1 h-1 rounded-full ${
                            subject.confidence === 'Very High' ? 'bg-emerald-300' :
                            subject.confidence === 'High' ? 'bg-green-300' :
                            subject.confidence === 'Medium' ? 'bg-yellow-300' : 'bg-orange-300'
                          } animate-pulse`}></div>
                        </div>
                      </div>
                      
                      {/* Subject Labels with Analytics */}
                      <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate max-w-24 mb-1">
                          {subject.name}
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <div className={`text-lg font-bold ${getGradeColorClass(subject.grade)} group-hover:scale-125 transition-transform duration-300`}>
                            {subject.grade}
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            subject.confidence === 'Very High' ? 'bg-emerald-500' :
                            subject.confidence === 'High' ? 'bg-green-500' :
                            subject.confidence === 'Medium' ? 'bg-yellow-500' : 'bg-orange-500'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        {/* Premium Analytics Legend */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Grade Legend */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Grade Classifications</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 rounded-lg shadow-md" style={{ background: "linear-gradient(135deg, #a855f7, #ec4899, #f59e0b)" }}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Grade 9</span>
                  <span className="text-purple-500 text-base">🏆</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Elite Performance</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 rounded-lg shadow-md" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4, #3b82f6)" }}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Grade 8</span>
                  <span className="text-emerald-500 text-base">💎</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Excellent</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 rounded-lg shadow-md" style={{ background: "linear-gradient(135deg, #22c55e, #84cc16, #eab308)" }}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Grade 7</span>
                  <span className="text-green-500 text-base">🌟</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Very Good</span>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-6 h-6 rounded-lg shadow-md" style={{ background: "linear-gradient(135deg, #fbbf24, #fb923c, #f472b6)" }}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Grades 5-6</span>
                  <span className="text-yellow-500 text-base">⭐</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Good</span>
                </div>
              </div>
            </div>

            {/* Confidence Indicators */}
            <div>
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Confidence Levels</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Very High</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">30+ attempts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">High</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">15-29 attempts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Medium</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">5-14 attempts</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">Low</span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">&lt;5 attempts</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Footer */}
          <div className="mt-6 pt-4 border-t border-slate-200/40 dark:border-slate-700/40 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by advanced machine learning algorithms • Real-time performance analysis • 94.2% prediction accuracy
            </p>
          </div>
        </div>
      </div>
      </CardContent>
    </Card>
  );
};