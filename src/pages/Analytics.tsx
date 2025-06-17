
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Calendar } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Target className="h-5 w-5 mr-2" />
                Mastered Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {masteredTopics.length}
              </div>
              <p className="text-sm text-slate-600">85%+ average score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Weak Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                {weakTopics.length}
              </div>
              <p className="text-sm text-slate-600">Need more practice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <TrendingUp className="h-5 w-5 mr-2" />
                Total Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {analyticsData.reduce((sum, d) => sum + d.attempts, 0)}
              </div>
              <p className="text-sm text-slate-600">Questions practiced</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <Calendar className="h-5 w-5 mr-2" />
                Active Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {analyticsData.length > 0 ? Math.ceil(analyticsData.length / 2) : 0}
              </div>
              <p className="text-sm text-slate-600">Days with practice</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Objectives Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Assessment Objectives Performance</CardTitle>
              <CardDescription>
                Your performance across different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">AO1 - Knowledge & Understanding</span>
                  <span className="text-sm font-medium">{Math.round(aoBreakdown.ao1)}%</span>
                </div>
                <Progress value={aoBreakdown.ao1} className="mb-2" />
                <p className="text-xs text-slate-600">
                  Recalling facts, terminology, and concepts
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">AO2 - Application</span>
                  <span className="text-sm font-medium">{Math.round(aoBreakdown.ao2)}%</span>
                </div>
                <Progress value={aoBreakdown.ao2} className="mb-2" />
                <p className="text-xs text-slate-600">
                  Applying knowledge to familiar and unfamiliar situations
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">AO3 - Analysis & Evaluation</span>
                  <span className="text-sm font-medium">{Math.round(aoBreakdown.ao3)}%</span>
                </div>
                <Progress value={aoBreakdown.ao3} className="mb-2" />
                <p className="text-xs text-slate-600">
                  Analyzing and evaluating information to make judgments
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weak Topics Focus */}
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Topics Requiring Attention</CardTitle>
              <CardDescription>
                Focus your revision on these areas for maximum improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weakTopicData.length > 0 ? (
                <div className="space-y-4">
                  {weakTopicData.slice(0, 5).map(({ topicId, data }) => (
                    <div key={topicId} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          {getTopicName(topicId)}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {getSubjectName(data.subjectId)}
                        </p>
                        {data.attempts > 0 && (
                          <p className="text-xs text-slate-500">
                            {data.attempts} attempts • {data.averageScore}% average
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/practice/${data.subjectId}/${topicId}`)}
                      >
                        Practice
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    No weak topics identified yet. Start practicing to get personalized insights!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Subject Performance Breakdown */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Subject Performance Overview</CardTitle>
            <CardDescription>
              Your progress across all subjects and topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {curriculum.map((subject) => {
                const subjectData = analyticsData.filter(d => d.subjectId === subject.id);
                const subjectScore = subjectData.length > 0 ? 
                  subjectData.reduce((sum, d) => sum + d.averageScore, 0) / subjectData.length : 0;
                const topicsAttempted = subjectData.length;
                const topicsMastered = subjectData.filter(d => d.averageScore >= 85).length;

                return (
                  <div key={subject.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${subject.color}`}></div>
                        <h3 className="text-lg font-semibold">{subject.name}</h3>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">
                          {topicsAttempted}/{subject.topics.length} topics
                        </Badge>
                        <span className="text-lg font-bold">
                          {Math.round(subjectScore)}%
                        </span>
                      </div>
                    </div>
                    
                    <Progress value={subjectScore} className="mb-4" />
                    
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-slate-600">Topics Attempted:</span>
                        <span className="font-medium ml-2">{topicsAttempted}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Topics Mastered:</span>
                        <span className="font-medium ml-2 text-green-600">{topicsMastered}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Total Attempts:</span>
                        <span className="font-medium ml-2">
                          {subjectData.reduce((sum, d) => sum + d.attempts, 0)}
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
