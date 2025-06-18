
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface TopicProgress {
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const SubjectTopics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    if (user?.id) {
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        const subjectProgress = allProgress.filter((p: any) => p.subjectId === subjectId);
        setTopicProgress(subjectProgress);
      }
    }
  }, [user?.id, subjectId]);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const progress = topicProgress.find(p => p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className={`w-6 h-6 rounded-full ${subject.color}`}></div>
              <h1 className="text-2xl font-bold text-slate-900">{subject.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Subject Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Total Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subject.topics.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {topicProgress.filter(p => p.averageScore >= 85).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {topicProgress.filter(p => p.attempts > 0 && p.averageScore < 85).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.topics.map((topic) => {
            const progress = getTopicProgress(topic.id);
            const isNew = progress.attempts === 0;
            const isMastered = progress.averageScore >= 85;
            const needsWork = progress.attempts > 0 && progress.averageScore < 60;

            return (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg leading-tight">{topic.name}</CardTitle>
                    <div className="flex flex-col items-end space-y-1">
                      {isNew && (
                        <Badge variant="outline">New</Badge>
                      )}
                      {isMastered && (
                        <Badge className="bg-green-500 hover:bg-green-600">Mastered</Badge>
                      )}
                      {needsWork && (
                        <Badge variant="destructive">Needs Work</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {topic.questions.length} exam-style questions available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progress.attempts > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span className="font-medium">{progress.averageScore}%</span>
                      </div>
                      <Progress value={progress.averageScore} className="mb-2" />
                      <p className="text-xs text-slate-600">
                        {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <Button 
                    className={`w-full font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      isMastered 
                        ? 'bg-gradient-to-r from-slate-400 to-slate-500 hover:from-slate-500 hover:to-slate-600 text-white' 
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white'
                    }`}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                  >
                    {isNew ? 'Start Practice' : 
                     isMastered ? 'Review' : 
                     'Continue Practice'}
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

export default SubjectTopics;
