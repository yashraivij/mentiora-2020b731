import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp, RotateCcw, Eye, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface TopicProgress {
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

interface CompletedExam {
  id: string;
  subject_id: string;
  percentage: number;
  grade: string;
  completed_at: string;
  achieved_marks: number;
  total_marks: number;
}

const SubjectTopics = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topicProgress, setTopicProgress] = useState<TopicProgress[]>([]);
  const [completedExams, setCompletedExams] = useState<CompletedExam[]>([]);

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

  // Load completed predicted 2026 exams for this subject
  useEffect(() => {
    const loadCompletedExams = async () => {
      if (!user?.id || !subjectId) return;
      
      try {
        console.log('Loading completed exams for subject:', subjectId, 'user:', user.id);
        const { data, error } = await supabase
          .from('predicted_exam_completions')
          .select('id, subject_id, percentage, grade, completed_at, achieved_marks, total_marks')
          .eq('user_id', user.id)
          .eq('subject_id', subjectId)
          .order('completed_at', { ascending: false });
        
        if (error) {
          console.error('Error loading completed exams:', error);
        } else {
          console.log('Found completed exams:', data?.length || 0);
          setCompletedExams(data || []);
        }
      } catch (error) {
        console.error('Error loading completed exams:', error);
      }
    };

    loadCompletedExams();
  }, [user?.id, subjectId]);

  const getSubjectColor = (subjectId: string | undefined) => {
    if (!subjectId) return 'bg-slate-500';
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${getSubjectColor(subject.id)}`}></div>
                <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
              </div>
            </div>
            <ThemeToggle />
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

        {/* Completed 2026 Predicted Exams Section */}
        {completedExams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              2026 Predicted Exam Papers
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedExams.map((exam) => (
                <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">2026 Predicted Paper</CardTitle>
                      <Badge 
                        variant={
                          exam.percentage >= 70 ? "default" :
                          exam.percentage >= 50 ? "secondary" : "destructive"
                        }
                      >
                        Grade {exam.grade}
                      </Badge>
                    </div>
                    <CardDescription>
                      Completed {new Date(exam.completed_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Score:</span>
                      <span className="font-medium">{exam.achieved_marks}/{exam.total_marks} ({exam.percentage.toFixed(1)}%)</span>
                    </div>
                    <Progress value={exam.percentage} className="h-2" />
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/predicted-results?examId=${exam.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => navigate(`/predicted-questions?subject=${subject.id}`)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Retry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

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
                      <p className="text-xs text-muted-foreground">
                        {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <Button 
                    className={`w-full font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      isMastered 
                        ? 'bg-gradient-to-r from-muted to-muted-foreground hover:from-muted-foreground hover:to-foreground text-white' 
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
