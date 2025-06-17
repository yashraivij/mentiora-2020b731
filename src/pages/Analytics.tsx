
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Calendar, Crown, Lock, BarChart3, Users, Trophy, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalyticsData {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const Analytics = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    if (user?.id) {
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      const savedWeakTopics = localStorage.getItem(`mentiora_weak_topics_${user.id}`);
      
      if (savedProgress) {
        setAnalyticsData(JSON.parse(savedProgress));
      }
      if (savedWeakTopics) {
        setWeakTopics(JSON.parse(savedWeakTopics));
      }
    }
  }, [user?.id]);

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

  const getMasteredTopics = () => {
    return analyticsData.filter(d => d.averageScore >= 85);
  };

  const getWeakTopicData = () => {
    return weakTopics.map(topicId => {
      const data = analyticsData.find(d => d.topicId === topicId);
      return {
        topicId,
        data: data || { subjectId: '', topicId, attempts: 0, averageScore: 0, lastAttempt: new Date() }
      };
    });
  };

  const getAOBreakdown = () => {
    // Simulate AO analysis based on performance
    const totalAttempts = analyticsData.reduce((sum, d) => sum + d.attempts, 0);
    const averageScore = analyticsData.length > 0 ? 
      analyticsData.reduce((sum, d) => sum + d.averageScore, 0) / analyticsData.length : 0;

    return {
      ao1: Math.max(60, averageScore - 10), // Knowledge
      ao2: Math.max(50, averageScore - 5),  // Application
      ao3: Math.max(40, averageScore - 15)  // Analysis
    };
  };

  const aoBreakdown = getAOBreakdown();
  const masteredTopics = getMasteredTopics();
  const weakTopicData = getWeakTopicData();

  const PremiumFeature = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-dashed border-amber-200 flex items-center justify-center z-10">
        <div className="text-center">
          <Crown className="h-8 w-8 text-amber-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-amber-700 mb-1">Premium Feature</p>
          <p className="text-xs text-amber-600">Upgrade to unlock {title}</p>
          <Button size="sm" className="mt-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Crown className="h-3 w-3 mr-1" />
            Upgrade Now
          </Button>
        </div>
      </div>
      <div className="blur-sm opacity-50">
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200/50 sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-slate-300 hover:bg-slate-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Performance Analytics
                </h1>
                <p className="text-sm text-slate-600">Track your learning progress and insights</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700">
              <BarChart3 className="h-3 w-3 mr-1" />
              Free Plan
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Premium Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-green-700 text-base">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                Mastered Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700 mb-1">
                {masteredTopics.length}
              </div>
              <p className="text-sm text-green-600">85%+ average score</p>
              <div className="mt-3 h-1 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-400 to-green-500 w-3/4"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700 text-base">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                Focus Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700 mb-1">
                {weakTopics.length}
              </div>
              <p className="text-sm text-red-600">Need more practice</p>
              <div className="mt-3 h-1 bg-red-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 to-red-500 w-1/2"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-sky-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-blue-700 text-base">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                Practice Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700 mb-1">
                {analyticsData.reduce((sum, d) => sum + d.attempts, 0)}
              </div>
              <p className="text-sm text-blue-600">Questions completed</p>
              <div className="mt-3 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-2/3"></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-purple-700 text-base">
                <div className="p-2 bg-purple-100 rounded-lg mr-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-700 mb-1">
                {analyticsData.length > 0 ? Math.ceil(analyticsData.length / 2) : 0}
              </div>
              <p className="text-sm text-purple-600">Days active</p>
              <div className="mt-3 h-1 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-400 to-purple-500 w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Assessment Objectives - Premium styling */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
                Assessment Objectives Performance
              </CardTitle>
              <CardDescription>
                Your performance across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">AO1 - Knowledge & Understanding</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(aoBreakdown.ao1)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${aoBreakdown.ao1}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Recalling facts, terminology, and concepts
                </p>
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
                <p className="text-xs text-slate-600 mt-2">
                  Applying knowledge to familiar and unfamiliar situations
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">AO3 - Analysis & Evaluation</span>
                  <span className="text-sm font-bold text-slate-900">{Math.round(aoBreakdown.ao3)}%</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${aoBreakdown.ao3}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-600 mt-2">
                  Analyzing and evaluating information to make judgments
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Focus Areas - Premium styling */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-red-50/30">
            <CardHeader className="border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Priority Focus Areas
              </CardTitle>
              <CardDescription>
                Target these topics for maximum improvement
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {weakTopicData.length > 0 ? (
                <div className="space-y-4">
                  {weakTopicData.slice(0, 5).map(({ topicId, data }) => (
                    <div key={topicId} className="group p-4 bg-gradient-to-r from-red-50/50 to-rose-50/50 rounded-xl border border-red-100 hover:border-red-200 hover:shadow-md transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                            {getTopicName(topicId)}
                          </h4>
                          <p className="text-sm text-slate-600 mb-1">
                            {getSubjectName(data.subjectId)}
                          </p>
                          {data.attempts > 0 && (
                            <div className="flex items-center space-x-4 text-xs text-slate-500">
                              <span>{data.attempts} attempts</span>
                              <span>•</span>
                              <span>{data.averageScore}% average</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => navigate(`/practice/${data.subjectId}/${topicId}`)}
                          className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-md"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Practice
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-green-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Target className="h-10 w-10 text-green-600" />
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

        {/* Premium Features Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <PremiumFeature title="Advanced Analytics">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Peer Comparison
                </CardTitle>
                <CardDescription>
                  See how you rank against other students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Your Percentile</span>
                    <span className="font-bold">87th</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span>Average Study Time</span>
                    <span className="font-bold">2.3h/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PremiumFeature>

          <PremiumFeature title="Learning Insights">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  AI-powered learning predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600">Weekly progress charts and predictions</p>
                </div>
              </CardContent>
            </Card>
          </PremiumFeature>
        </div>

        {/* Subject Performance - Enhanced */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-slate-50">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-slate-600" />
              Subject Performance Overview
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your progress across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {curriculum.map((subject) => {
                const subjectData = analyticsData.filter(d => d.subjectId === subject.id);
                const subjectScore = subjectData.length > 0 ? 
                  subjectData.reduce((sum, d) => sum + d.averageScore, 0) / subjectData.length : 0;
                const topicsAttempted = subjectData.length;
                const topicsMastered = subjectData.filter(d => d.averageScore >= 85).length;

                return (
                  <div key={subject.id} className="group p-6 border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-white to-slate-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-6 h-6 rounded-lg ${subject.color} shadow-sm`}></div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                            {subject.name}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {subject.topics.length} topics available
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <Badge variant="outline" className="bg-white border-slate-300">
                          {topicsAttempted}/{subject.topics.length} topics
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            {Math.round(subjectScore)}%
                          </div>
                          <div className="text-xs text-slate-500">Average</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${subjectScore}%` }}
                      ></div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6 text-sm">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Topics Started:</span>
                        <span className="font-semibold text-slate-900">{topicsAttempted}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="text-slate-600">Topics Mastered:</span>
                        <span className="font-semibold text-green-700">{topicsMastered}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="text-slate-600">Total Practice:</span>
                        <span className="font-semibold text-blue-700">
                          {subjectData.reduce((sum, d) => sum + d.attempts, 0)} questions
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
