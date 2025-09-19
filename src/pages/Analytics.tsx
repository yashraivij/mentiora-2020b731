import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";

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

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500', 
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = subjectId.length % colors.length;
    return colors[index];
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

  const masteredTopics = getMasteredTopics();
  const weakTopicData = getWeakTopicData();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Performance Analytics</h1>
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
              <p className="text-sm text-muted-foreground">85%+ average score</p>
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
              <p className="text-sm text-muted-foreground">Need more practice</p>
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
              <p className="text-sm text-muted-foreground">Questions practiced</p>
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
              <p className="text-sm text-muted-foreground">Days with practice</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Objectives Breakdown */}
          <AOBreakdown userProgress={analyticsData} />

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
                     <div key={topicId} className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                       <div>
                         <h4 className="font-medium text-foreground">
                           {getTopicName(topicId)}
                         </h4>
                         <p className="text-sm text-muted-foreground">
                           {getSubjectName(data.subjectId)}
                         </p>
                         {data.attempts > 0 && (
                           <p className="text-xs text-muted-foreground/80">
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
                   <Target className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                   <p className="text-muted-foreground">
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
                   <div key={subject.id} className="border border-border rounded-lg p-4 bg-card">
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center space-x-3">
                         <div className={`w-4 h-4 rounded-full ${getSubjectColor(subject.id)}`}></div>
                         <h3 className="text-lg font-semibold text-foreground">{subject.name}</h3>
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
                         <span className="text-muted-foreground">Topics Attempted:</span>
                         <span className="font-medium ml-2 text-foreground">{topicsAttempted}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Topics Mastered:</span>
                         <span className="font-medium ml-2 text-green-600">{topicsMastered}</span>
                       </div>
                       <div>
                         <span className="text-muted-foreground">Total Attempts:</span>
                         <span className="font-medium ml-2 text-foreground">
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
