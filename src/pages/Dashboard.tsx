
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Target, AlertTriangle, Calendar, Trophy, Zap, Crown } from "lucide-react";
import { useState, useEffect } from "react";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem(`mentiora_progress_${user?.id}`);
    const savedWeakTopics = localStorage.getItem(`mentiora_weak_topics_${user?.id}`);
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedWeakTopics) {
      setWeakTopics(JSON.parse(savedWeakTopics));
    }
  }, [user?.id]);

  const getTopicProgress = (subjectId: string, topicId: string) => {
    const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const getTopicName = (topicId: string) => {
    const topic = curriculum
      .flatMap(s => s.topics)
      .find(t => t.id === topicId);
    return topic?.name || 'Unknown Topic';
  };

  const getSubjectName = (subjectId: string) => {
    const subject = curriculum.find(s => s.id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  const getAOBreakdown = () => {
    const averageScore = userProgress.length > 0 ? 
      userProgress.reduce((sum, d) => sum + d.averageScore, 0) / userProgress.length : 0;

    return {
      ao1: Math.max(60, averageScore - 10), // Knowledge
      ao2: Math.max(50, averageScore - 5),  // Application
      ao3: Math.max(40, averageScore - 15)  // Analysis
    };
  };

  const aoBreakdown = getAOBreakdown();
  const totalPracticeSessions = userProgress.reduce((sum, p) => sum + p.attempts, 0);
  const studyStreak = userProgress.length > 0 ? Math.ceil(userProgress.length / 2) : 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md"></div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">Mentiora</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/analytics')} className="border-slate-300 hover:bg-slate-50">
                <BarChart3 className="h-4 w-4 mr-2" />
                Full Analytics
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-slate-600">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-slate-300 hover:bg-slate-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-slate-600">Track your progress and continue your GCSE revision journey</p>
        </div>

        {/* Enhanced Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-700 text-base">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-2">
                {getOverallProgress()}%
              </div>
              <Progress value={getOverallProgress()} className="mb-2 h-2" />
              <p className="text-sm text-green-600">Average across all subjects</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-700 text-base">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                Topics Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-2">
                {getMasteredTopics()}
              </div>
              <p className="text-sm text-blue-600">85%+ average score</p>
              <div className="mt-3 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-3/4"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-700 text-base">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                Practice Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-2">
                {totalPracticeSessions}
              </div>
              <p className="text-sm text-purple-600">Questions completed</p>
              <div className="mt-3 h-1 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 w-2/3"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-amber-700 text-base">
                <div className="p-2 bg-amber-100 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-amber-600" />
                </div>
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-700 mb-2">
                {studyStreak}
              </div>
              <p className="text-sm text-amber-600">Days active</p>
              <div className="mt-3 h-1 bg-amber-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Assessment Objectives */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
                Assessment Objectives
              </CardTitle>
              <CardDescription>
                Your performance across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">AO1 - Knowledge</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(aoBreakdown.ao1)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${aoBreakdown.ao1}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">AO2 - Application</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(aoBreakdown.ao2)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${aoBreakdown.ao2}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">AO3 - Analysis</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(aoBreakdown.ao3)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${aoBreakdown.ao3}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50/30">
            <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Priority Focus Areas
              </CardTitle>
              <CardDescription>
                Topics that need more practice
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {weakTopics.length > 0 ? (
                <div className="space-y-4">
                  {weakTopics.slice(0, 3).map((topicId) => {
                    const data = userProgress.find(p => p.topicId === topicId);
                    return (
                      <div key={topicId} className="group p-4 bg-gradient-to-r from-red-50/50 to-rose-50/50 rounded-xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                              {getTopicName(topicId)}
                            </h4>
                            <p className="text-sm text-slate-600 mb-1">
                              {getSubjectName(data?.subjectId || '')}
                            </p>
                            {data && data.attempts > 0 && (
                              <div className="flex items-center space-x-4 text-xs text-slate-500">
                                <span>{data.attempts} attempts</span>
                                <span>•</span>
                                <span>{data.averageScore}% average</span>
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/practice/${data?.subjectId}/${topicId}`)}
                            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md"
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Practice
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {weakTopics.length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="outline" onClick={() => navigate('/analytics')} className="text-red-600 border-red-200 hover:bg-red-50">
                        View all {weakTopics.length - 3} more focus areas
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-slate-600 font-medium mb-2">All caught up!</p>
                  <p className="text-sm text-slate-500">
                    Start practicing to get personalized insights
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {curriculum.map((subject) => {
            const subjectData = userProgress.filter(p => p.subjectId === subject.id);
            const subjectScore = subjectData.length > 0 ? 
              subjectData.reduce((sum, p) => sum + p.averageScore, 0) / subjectData.length : 0;
            const topicsAttempted = subjectData.length;
            const topicsMastered = subjectData.filter(p => p.averageScore >= 85).length;

            return (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer border-0 shadow-md bg-gradient-to-br from-white to-slate-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <div className={`w-4 h-4 rounded-full ${subject.color} mr-2 shadow-sm`}></div>
                      {subject.name}
                    </CardTitle>
                    <Badge variant="outline" className="bg-white border-slate-300">
                      {subject.topics.length} topics
                    </Badge>
                  </div>
                  {subjectData.length > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Progress</span>
                        <span className="text-sm font-semibold text-slate-900">{Math.round(subjectScore)}%</span>
                      </div>
                      <Progress value={subjectScore} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subject.topics.slice(0, 3).map((topic) => {
                      const progress = getTopicProgress(subject.id, topic.id);
                      return (
                        <div key={topic.id} className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">{topic.name}</span>
                          <div className="flex items-center space-x-2">
                            {progress.attempts > 0 && (
                              <span className="text-xs text-slate-500">
                                {progress.averageScore}%
                              </span>
                            )}
                            <div className={`w-2 h-2 rounded-full ${
                              progress.averageScore >= 85 ? 'bg-green-500' :
                              progress.averageScore >= 60 ? 'bg-yellow-500' :
                              progress.attempts > 0 ? 'bg-red-500' : 'bg-slate-300'
                            }`}></div>
                          </div>
                        </div>
                      );
                    })}
                    {subject.topics.length > 3 && (
                      <p className="text-xs text-slate-500">
                        +{subject.topics.length - 3} more topics
                      </p>
                    )}
                  </div>
                  
                  {subjectData.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-100">
                      <div className="text-center">
                        <div className="text-lg font-bold text-slate-900">{topicsAttempted}</div>
                        <div className="text-xs text-slate-500">Started</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">{topicsMastered}</div>
                        <div className="text-xs text-slate-500">Mastered</div>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md" 
                    onClick={() => navigate(`/subject/${subject.id}`)}
                  >
                    Start Practicing
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
