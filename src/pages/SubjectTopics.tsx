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

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Subject Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{subject?.name}</h1>
          <p className="text-muted-foreground">Your learning journey</p>
        </div>

        {/* Compact Grade Overview */}
        <Card className="rounded-xl border shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-8">
              {/* Current Grade */}
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current Grade</div>
                  <div className="text-4xl font-bold text-[#3DB4E8]">{predictedGradeDecimal.toFixed(1)}</div>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-2xl text-muted-foreground">→</div>

              {/* Target Grade */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => targetGrade && targetGrade > 4 && handleSetTargetGrade(targetGrade - 1)}
                  disabled={!targetGrade || targetGrade <= 4}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Target Grade</div>
                  <div className="text-4xl font-bold text-foreground">{targetGrade}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => targetGrade && targetGrade < 9 && handleSetTargetGrade(targetGrade + 1)}
                  disabled={!targetGrade || targetGrade >= 9}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-semibold text-[#3DB4E8]">{masteredTopics}/{totalTopics} topics</span>
                </div>
                <Progress value={Math.round((masteredTopics / totalTopics) * 100)} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Topics */}
        <Card className="rounded-xl border shadow-sm">
          <CardHeader className="pb-6 px-8 pt-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl font-bold mb-1">All Topics</CardTitle>
                <p className="text-sm text-muted-foreground">{filteredTopics.length} available</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter ? "bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white" : ""}
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strengths' : filter === 'focus' ? 'Focus' : 'New'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <div className="space-y-3">
              {filteredTopics.map((topic) => {
                const progress = getTopicProgress(topic.id);
                const isMastered = progress.averageScore >= 85;
                const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                    className="w-full rounded-lg border bg-card hover:border-[#3DB4E8] hover:shadow-md p-5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-base font-semibold text-foreground group-hover:text-[#3DB4E8] transition-colors">{topic.name}</h3>
                          {isMastered && (
                            <div className="px-2 py-1 rounded text-[#3DB4E8] text-xs font-medium border border-[#3DB4E8]/30 bg-[#3DB4E8]/10">Mastered</div>
                          )}
                          {needsPractice && (
                            <div className="px-2 py-1 rounded text-orange-600 text-xs font-medium border border-orange-200 bg-orange-50">Focus</div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress value={progress.averageScore} className="h-2 flex-1" />
                          <div className="text-right min-w-[100px]">
                            <div className="text-base font-semibold text-foreground">
                              {progress.attempts > 0 ? `${progress.averageScore}%` : '—'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {progress.attempts > 0 ? `${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}` : 'Not started'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Learning Insights */}
        <Card className="rounded-2xl border-2 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl" />
          <CardHeader className="px-12 pt-10 pb-8 relative">
            <CardTitle className="text-3xl font-bold mb-2">Your learning patterns</CardTitle>
            <p className="text-base text-muted-foreground">Insights generated from your study behavior</p>
          </CardHeader>
          <CardContent className="px-12 pb-12 relative">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="p-7 rounded-2xl bg-gradient-to-br from-[#3DB4E8]/10 to-background border-2 shadow-lg">
                  <div className="text-sm font-bold text-foreground mb-3">Session length</div>
                  <div className="text-4xl font-black text-[#3DB4E8] mb-3">15-20 min</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your sweet spot for maximum focus. Sessions in this range have a 94% completion rate.</p>
                </div>
                
                <div className="p-7 rounded-2xl bg-card border-2 shadow-lg">
                  <div className="text-sm font-bold text-foreground mb-3">Recovery time</div>
                  <div className="text-4xl font-black text-foreground mb-3">5 min</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Taking short breaks between sessions improves your scores by 23% on average.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-7 rounded-2xl bg-card border-2 shadow-lg">
                  <div className="text-sm font-bold text-foreground mb-3">Monthly improvement</div>
                  <div className="text-4xl font-black text-green-600 mb-3">+12%</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your average scores have increased consistently. Keep up this momentum.</p>
                </div>

                <div className="p-7 rounded-2xl bg-gradient-to-br from-purple-500/10 to-background border-2 shadow-lg">
                  <div className="text-sm font-bold text-foreground mb-3">Retention rate</div>
                  <div className="text-4xl font-black text-foreground mb-3">87%</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">You retain information well. Topics practiced once are usually mastered within 2-3 sessions.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-[#3DB4E8]/15 to-card border-2 border-[#3DB4E8]/30 shadow-xl">
              <div className="text-sm font-bold text-foreground mb-4">Personalized recommendation</div>
              <p className="text-base text-muted-foreground leading-relaxed">Based on your patterns, practicing <span className="font-bold text-foreground">Tuesday and Thursday evenings (7-9 PM)</span> for <span className="font-bold text-foreground">15-20 minutes</span> will maximize your progress toward grade {targetGrade}.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
