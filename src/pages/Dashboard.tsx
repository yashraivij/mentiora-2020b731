
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut } from "lucide-react";
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
                <h1 className="text-2xl font-bold text-slate-900">Mentiora</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/analytics')}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm text-slate-600">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-slate-600">Ready to continue your GCSE revision journey?</p>
        </div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {getOverallProgress()}%
              </div>
              <Progress value={getOverallProgress()} className="mb-2" />
              <p className="text-sm text-slate-600">Average across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                Topics Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {getMasteredTopics()}
              </div>
              <p className="text-sm text-slate-600">
                Topics with 85%+ average score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                Practice Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {userProgress.reduce((sum, p) => sum + p.attempts, 0)}
              </div>
              <p className="text-sm text-slate-600">Total questions attempted</p>
            </CardContent>
          </Card>
        </div>

        {/* Weak Topics Section */}
        {weakTopics.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Topics to Focus On</CardTitle>
              <CardDescription>
                These topics need more practice based on your recent performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {weakTopics.map((topicId) => {
                  const subject = curriculum.find(s => 
                    s.topics.some(t => t.id === topicId)
                  );
                  const topic = subject?.topics.find(t => t.id === topicId);
                  if (!topic || !subject) return null;
                  
                  return (
                    <div key={topicId} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
                      <Badge variant="destructive" className="flex items-center space-x-1">
                        <span className="text-xs text-red-100">{subject.name}:</span>
                        <span>{topic.name}</span>
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subjects Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {curriculum.map((subject) => (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <div className={`w-4 h-4 rounded-full ${subject.color} mr-2`}></div>
                    {subject.name}
                  </CardTitle>
                  <Badge variant="outline">
                    {subject.topics.length} topics
                  </Badge>
                </div>
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
                <Button 
                  className="w-full mt-4" 
                  onClick={() => navigate(`/subject/${subject.id}`)}
                >
                  Start Practicing
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
