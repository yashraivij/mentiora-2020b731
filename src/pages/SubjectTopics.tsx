import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, ChevronLeft, ChevronRight, TrendingUp, Target } from "lucide-react";

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
  const [targetGrade, setTargetGrade] = useState<number | null>(null);
  const [showGradeSetup, setShowGradeSetup] = useState(false);
  const [topicFilter, setTopicFilter] = useState<'all' | 'strengths' | 'focus' | 'new'>('all');

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    if (user?.id && subjectId) {
      // Load progress
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        const subjectProgress = allProgress.filter((p: any) => p.subjectId === subjectId);
        setTopicProgress(subjectProgress);
      }

      // Load target grade
      const savedTarget = localStorage.getItem(`mentiora_target_grade_${user.id}_${subjectId}`);
      if (savedTarget) {
        setTargetGrade(parseInt(savedTarget));
      } else {
        setShowGradeSetup(true);
      }
    }
  }, [user?.id, subjectId]);

  const handleSetTargetGrade = (grade: number) => {
    if (user?.id && subjectId) {
      localStorage.setItem(`mentiora_target_grade_${user.id}_${subjectId}`, grade.toString());
      setTargetGrade(grade);
      setShowGradeSetup(false);
    }
  };

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const progress = topicProgress.find(p => p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  // Calculate statistics
  const masteredTopics = topicProgress.filter(p => p.averageScore >= 85).length;
  const inProgressTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 85 && p.averageScore >= 60).length;
  const needsWorkTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 60);
  const avgScore = topicProgress.length > 0 
    ? Math.round(topicProgress.reduce((sum, p) => sum + p.averageScore, 0) / topicProgress.length)
    : 0;
  
  const totalTopics = subject?.topics.length || 0;
  const completionRate = totalTopics > 0 ? Math.round((masteredTopics / totalTopics) * 100) : 0;
  
  // Calculate predicted grade (simple formula based on avg score)
  const predictedGrade = avgScore >= 90 ? 9 : avgScore >= 80 ? 8 : avgScore >= 70 ? 7 : avgScore >= 60 ? 6 : avgScore >= 50 ? 5 : avgScore >= 40 ? 4 : 3;
  const predictedGradeDecimal = avgScore >= 40 ? 4 + ((avgScore - 40) / 10) : 3;
  
  // Study streak (mock for now)
  const studyStreak = 7;
  
  // Progress to target
  const percentToTarget = targetGrade ? Math.min(100, Math.round((predictedGrade / targetGrade) * 100)) : 0;
  
  // Exam readiness
  const examReadiness = Math.min(100, Math.round((masteredTopics / totalTopics) * 100 + (avgScore * 0.2)));
  
  // Consistency score
  const consistencyScore = Math.min(100, Math.round(studyStreak * 10 + (topicProgress.length > 0 ? 30 : 0)));
  
  // Filter topics
  const filteredTopics = subject?.topics.filter(topic => {
    const progress = getTopicProgress(topic.id);
    if (topicFilter === 'strengths') return progress.averageScore >= 85;
    if (topicFilter === 'focus') return progress.attempts > 0 && progress.averageScore < 60;
    if (topicFilter === 'new') return progress.attempts === 0;
    return true;
  }) || [];

  // Find next recommended topic
  const getNextTopic = () => {
    if (needsWorkTopics.length > 0) {
      return subject.topics.find(t => t.id === needsWorkTopics[0].topicId);
    }
    return subject.topics.find(t => !topicProgress.some(p => p.topicId === t.id));
  };

  const nextTopic = getNextTopic();

  // Target Grade Setup Modal
  if (showGradeSetup) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-xl w-full rounded-lg shadow-lg border">
          <CardContent className="p-12 text-center">
            <h1 className="text-3xl font-semibold mb-3 text-foreground">Set your target grade</h1>
            <p className="text-muted-foreground mb-8">for {subject?.name}</p>

            <div className="grid grid-cols-3 gap-3 mb-8 max-w-sm mx-auto">
              {[4, 5, 6, 7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleSetTargetGrade(grade)}
                  className="h-20 rounded-lg border-2 border-border hover:border-[#3DB4E8] hover:bg-[#3DB4E8]/5 transition-all duration-200 flex items-center justify-center text-3xl font-semibold text-foreground"
                >
                  {grade}
                </button>
              ))}
            </div>

            <p className="text-sm text-muted-foreground">You can change this anytime</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Subject Title */}
        <div className="mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">{subject?.name}</h1>
          <p className="text-muted-foreground">Track your progress and master every topic</p>
        </div>

        {/* Grade Overview */}
        <Card className="rounded-lg border shadow-sm mb-8">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Grade */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[#3DB4E8]" />
                  <span className="text-sm font-medium text-muted-foreground">Current Grade</span>
                </div>
                <div className="text-6xl font-semibold text-[#3DB4E8]">{predictedGradeDecimal.toFixed(1)}</div>
                <p className="text-sm text-muted-foreground mt-2">Based on {topicProgress.length} completed topics</p>
              </div>

              {/* Target Grade - Editable */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-[#3DB4E8]" />
                  <span className="text-sm font-medium text-muted-foreground">Target Grade</span>
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => targetGrade && targetGrade > 4 && handleSetTargetGrade(targetGrade - 1)}
                    disabled={!targetGrade || targetGrade <= 4}
                    className="h-12 w-12 rounded-lg border-2"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="text-6xl font-semibold text-foreground w-20 text-center">{targetGrade}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => targetGrade && targetGrade < 9 && handleSetTargetGrade(targetGrade + 1)}
                    disabled={!targetGrade || targetGrade >= 9}
                    className="h-12 w-12 rounded-lg border-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">Adjust your goal anytime</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-muted-foreground">Progress to target</span>
                <span className="text-2xl font-semibold text-[#3DB4E8]">{percentToTarget}%</span>
              </div>
              <Progress value={percentToTarget} className="h-3" />
              <p className="text-sm text-muted-foreground mt-3">
                {percentToTarget >= 90 ? "Almost there! Keep up the excellent work" : 
                 percentToTarget >= 70 ? "Great progress, you're on track" : 
                 percentToTarget >= 50 ? "Steady progress, keep going" : 
                 "Every practice session moves you closer"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Topic Recommendation */}
        {nextTopic && (
          <Card className="rounded-lg border border-[#3DB4E8] bg-[#3DB4E8]/5 shadow-sm mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">Recommended next</h2>
                <p className="text-lg text-muted-foreground">{nextTopic.name}</p>
              </div>
              <Button 
                onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                className="w-full bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white rounded-lg h-12 text-base font-medium"
              >
                Start Practice
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Personalized Insights */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Optimal study time</div>
              <div className="text-2xl font-semibold text-foreground">7-9 PM</div>
              <div className="text-sm text-muted-foreground mt-2">Based on your performance patterns</div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Topics mastered</div>
              <div className="text-2xl font-semibold text-foreground">{masteredTopics} / {totalTopics}</div>
              <div className="text-sm text-muted-foreground mt-2">{Math.round((masteredTopics / totalTopics) * 100)}% of curriculum complete</div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Exam readiness</div>
              <div className="text-2xl font-semibold text-foreground">{examReadiness}%</div>
              <div className="text-sm text-muted-foreground mt-2">Mock exam in 19 days</div>
            </CardContent>
          </Card>
        </div>

        {/* All Topics */}
        <Card className="rounded-lg border shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold">All Topics</CardTitle>
              <div className="flex gap-2">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter ? "bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white" : ""}
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strong' : filter === 'focus' ? 'Needs work' : 'New'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const progress = getTopicProgress(topic.id);
                const isMastered = progress.averageScore >= 85;
                const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                    className="w-full rounded-lg border bg-card hover:border-[#3DB4E8] hover:bg-accent/50 p-5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground mb-2 group-hover:text-[#3DB4E8] transition-colors">{topic.name}</h3>
                        <div className="flex items-center gap-3">
                          <Progress value={progress.averageScore} className="h-2 flex-1" />
                          <span className="text-sm font-medium text-muted-foreground min-w-[60px] text-right">
                            {progress.attempts > 0 ? `${progress.averageScore}%` : 'Not started'}
                          </span>
                        </div>
                      </div>
                      {isMastered && (
                        <div className="text-sm font-medium text-[#3DB4E8]">Mastered</div>
                      )}
                      {needsPractice && (
                        <div className="text-sm font-medium text-orange-500">Needs work</div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Plan */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">This Week's Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-[#3DB4E8]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📝</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Quick Quiz — 10 min</h4>
                  <p className="text-xs text-gray-600">Your weak areas</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🌿</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Flashcards — 15 min</h4>
                  <p className="text-xs text-gray-600">Memory boost</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📊</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Practice Paper — 20 min</h4>
                  <p className="text-xs text-gray-600">Exam conditions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <Card className="rounded-lg border shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Learning insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Short 10-minute sessions work best for you based on completion rates</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consider taking breaks after 25 minutes for optimal retention</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your scores have improved by 12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
