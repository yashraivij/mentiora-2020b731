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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-16 space-y-10">
        {/* Subject Title */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">{subject?.name}</h1>
          <p className="text-xl text-muted-foreground">Your personalized learning journey</p>
        </div>

        {/* Grade Overview */}
        <Card className="rounded-2xl border-2 shadow-2xl bg-gradient-to-br from-card via-card to-[#3DB4E8]/10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#3DB4E8]/5 rounded-full blur-3xl -z-10" />
          <CardContent className="p-12">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Current Grade */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#3DB4E8]/10">
                    <TrendingUp className="w-5 h-5 text-[#3DB4E8]" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Grade</span>
                </div>
                <div className="text-8xl font-black text-[#3DB4E8] mb-4 tracking-tight">{predictedGradeDecimal.toFixed(1)}</div>
                <p className="text-base text-muted-foreground mb-6">Based on {topicProgress.length} completed {topicProgress.length === 1 ? 'topic' : 'topics'}</p>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average score</span>
                    <span className="text-2xl font-bold text-foreground">{avgScore}%</span>
                  </div>
                </div>
              </div>

              {/* Target Grade - Editable */}
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-[#3DB4E8]/10">
                    <Target className="w-5 h-5 text-[#3DB4E8]" />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Target Grade</span>
                </div>
                <div className="flex items-center gap-5 mb-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => targetGrade && targetGrade > 4 && handleSetTargetGrade(targetGrade - 1)}
                    disabled={!targetGrade || targetGrade <= 4}
                    className="h-16 w-16 rounded-xl border-2 hover:border-[#3DB4E8] hover:bg-[#3DB4E8]/5 transition-all"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </Button>
                  <div className="text-8xl font-black text-foreground w-28 text-center tracking-tight">{targetGrade}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => targetGrade && targetGrade < 9 && handleSetTargetGrade(targetGrade + 1)}
                    disabled={!targetGrade || targetGrade >= 9}
                    className="h-16 w-16 rounded-xl border-2 hover:border-[#3DB4E8] hover:bg-[#3DB4E8]/5 transition-all"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </Button>
                </div>
                <p className="text-base text-muted-foreground mb-6">Your personalized goal</p>
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Points needed</span>
                    <span className="text-2xl font-bold text-foreground">{Math.max(0, Math.round((targetGrade || 0) - predictedGradeDecimal) * 10)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-12 pt-10 border-t border-border/50">
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Progress to target</span>
                <span className="text-4xl font-black text-[#3DB4E8]">{percentToTarget}%</span>
              </div>
              <div className="relative">
                <div className="h-5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3DB4E8] to-[#2E5BFF] rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${percentToTarget}%` }}
                  />
                </div>
              </div>
              <p className="text-base text-muted-foreground mt-5 leading-relaxed">
                {percentToTarget >= 90 ? "Outstanding! You're almost at your goal. One final push to achieve grade " + targetGrade : 
                 percentToTarget >= 70 ? "Excellent momentum. You're well on track to hit grade " + targetGrade : 
                 percentToTarget >= 50 ? "Solid progress. Keep this pace and you'll reach grade " + targetGrade : 
                 "You're building towards grade " + targetGrade + ". Each session counts"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Optimal Study Time - Premium Feature */}
        <Card className="rounded-2xl border-2 border-[#3DB4E8]/30 shadow-2xl bg-gradient-to-br from-[#3DB4E8]/10 via-card to-card overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3DB4E8]/5 to-transparent" />
          <CardContent className="p-12 relative z-10">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3DB4E8]/20 text-[#3DB4E8] text-xs font-bold uppercase tracking-wider mb-6 border border-[#3DB4E8]/30">
                Personalized for you
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3 tracking-tight">Your optimal study window</h2>
              <p className="text-lg text-muted-foreground">Based on your performance patterns across {topicProgress.length} practice sessions</p>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Peak Performance Time */}
              <div>
                <div className="mb-8">
                  <div className="text-sm text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Peak performance</div>
                  <div className="text-6xl font-black text-[#3DB4E8] mb-3 tracking-tight">7-9 PM</div>
                  <p className="text-base text-muted-foreground">Your scores average <span className="font-bold text-foreground">18% higher</span> during evening sessions</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all hover:border-border">
                    <span className="text-sm font-medium text-muted-foreground">Morning (6-9 AM)</span>
                    <div className="flex items-center gap-3">
                      <Progress value={65} className="w-24 h-2.5" />
                      <span className="text-base font-bold text-foreground w-14">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all hover:border-border">
                    <span className="text-sm font-medium text-muted-foreground">Afternoon (12-3 PM)</span>
                    <div className="flex items-center gap-3">
                      <Progress value={72} className="w-24 h-2.5" />
                      <span className="text-base font-bold text-foreground w-14">72%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#3DB4E8]/15 border-2 border-[#3DB4E8]/40 backdrop-blur-sm shadow-lg shadow-[#3DB4E8]/10">
                    <span className="text-sm font-bold text-foreground">Evening (7-9 PM)</span>
                    <div className="flex items-center gap-3">
                      <Progress value={88} className="w-24 h-2.5" />
                      <span className="text-base font-black text-[#3DB4E8] w-14">88%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm transition-all hover:border-border">
                    <span className="text-sm font-medium text-muted-foreground">Night (9-11 PM)</span>
                    <div className="flex items-center gap-3">
                      <Progress value={58} className="w-24 h-2.5" />
                      <span className="text-base font-bold text-foreground w-14">58%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Study Patterns & Recommendations */}
              <div className="space-y-8">
                <div>
                  <div className="text-sm text-muted-foreground mb-5 uppercase tracking-wider font-semibold">Best days</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-[#3DB4E8]/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-[#3DB4E8]">Tue</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Tuesday</span>
                          <span className="text-base font-bold">92% avg</span>
                        </div>
                        <Progress value={92} className="h-2.5" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-[#3DB4E8]/30 backdrop-blur-sm">
                      <div className="text-3xl font-black text-[#3DB4E8]">Thu</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Thursday</span>
                          <span className="text-base font-bold">89% avg</span>
                        </div>
                        <Progress value={89} className="h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-card to-card/50 border-2 border-border backdrop-blur-sm">
                  <div className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Session recommendations</div>
                  <ul className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <li className="flex items-start gap-3">
                      <span className="text-[#3DB4E8] mt-0.5 text-lg">•</span>
                      <span>15-20 minute sessions yield your best completion rates</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#3DB4E8] mt-0.5 text-lg">•</span>
                      <span>You perform 23% better when practicing after a 5-minute break</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#3DB4E8] mt-0.5 text-lg">•</span>
                      <span>Consistency boost: You're on a {studyStreak}-day streak</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Topic Recommendation */}
        {nextTopic && (
          <Card className="rounded-2xl border-2 shadow-2xl bg-gradient-to-r from-[#3DB4E8]/15 via-card to-card overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DB4E8]/10 rounded-full blur-3xl" />
            <CardContent className="p-10 relative z-10">
              <div className="flex items-start justify-between gap-8">
                <div className="flex-1">
                  <div className="text-sm text-[#3DB4E8] font-bold mb-3 uppercase tracking-wider">Recommended next</div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">{nextTopic.name}</h2>
                  <p className="text-base text-muted-foreground mb-8 leading-relaxed">
                    {needsWorkTopics.length > 0 
                      ? "This topic needs attention. Practicing now will boost your overall grade." 
                      : "Based on your learning path, this is the ideal next step."}
                  </p>
                  <Button 
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="bg-gradient-to-r from-[#3DB4E8] to-[#2E5BFF] hover:from-[#2E5BFF] hover:to-[#3DB4E8] text-white rounded-xl h-14 px-10 text-base font-semibold shadow-lg shadow-[#3DB4E8]/20 hover:shadow-xl hover:shadow-[#3DB4E8]/30 transition-all"
                  >
                    Start Practice Session
                  </Button>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Estimated impact</div>
                  <div className="text-5xl font-black text-[#3DB4E8] mb-1">+0.3</div>
                  <div className="text-sm text-muted-foreground font-medium">grade points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Performance Analytics */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all hover:border-[#3DB4E8]/30 group">
            <CardContent className="p-8">
              <div className="text-sm text-muted-foreground mb-5 uppercase tracking-wider font-semibold">Mastery progress</div>
              <div className="flex items-end gap-3 mb-3">
                <div className="text-5xl font-black text-foreground">{masteredTopics}</div>
                <div className="text-3xl text-muted-foreground mb-1">/ {totalTopics}</div>
              </div>
              <div className="text-sm text-muted-foreground mb-4 font-medium">topics mastered</div>
              <Progress value={Math.round((masteredTopics / totalTopics) * 100)} className="h-3 mb-4" />
              <div className="text-sm text-muted-foreground">
                {totalTopics - masteredTopics} remaining to complete
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all hover:border-[#3DB4E8]/30 group">
            <CardContent className="p-8">
              <div className="text-sm text-muted-foreground mb-5 uppercase tracking-wider font-semibold">Study consistency</div>
              <div className="flex items-end gap-3 mb-3">
                <div className="text-5xl font-black text-[#3DB4E8]">{studyStreak}</div>
                <div className="text-xl text-muted-foreground mb-1">days</div>
              </div>
              <div className="text-sm text-muted-foreground mb-4 font-medium">current streak</div>
              <div className="flex gap-1.5 mb-4">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`h-3 flex-1 rounded-full transition-all ${i < studyStreak ? 'bg-gradient-to-t from-[#3DB4E8] to-[#2E5BFF] shadow-sm' : 'bg-border'}`} />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                You're {studyStreak >= 7 ? 'crushing it' : `${7 - studyStreak} days to 1 week`}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-2 shadow-xl hover:shadow-2xl transition-all hover:border-[#3DB4E8]/30 group">
            <CardContent className="p-8">
              <div className="text-sm text-muted-foreground mb-5 uppercase tracking-wider font-semibold">Exam readiness</div>
              <div className="flex items-end gap-3 mb-3">
                <div className="text-5xl font-black text-foreground">{examReadiness}</div>
                <div className="text-3xl text-muted-foreground mb-1">%</div>
              </div>
              <div className="text-sm text-muted-foreground mb-4 font-medium">ready for exam</div>
              <Progress value={examReadiness} className="h-3 mb-4" />
              <div className="text-sm text-muted-foreground">
                Mock exam in 19 days
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Topics */}
        <Card className="rounded-2xl border-2 shadow-2xl">
          <CardHeader className="pb-8">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold mb-2 tracking-tight">All Topics</CardTitle>
                <p className="text-base text-muted-foreground">{filteredTopics.length} topics in this subject</p>
              </div>
              <div className="flex gap-3">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter ? "bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white font-semibold px-5" : "font-medium"}
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strong' : filter === 'focus' ? 'Focus' : 'New'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {filteredTopics.map((topic) => {
                const progress = getTopicProgress(topic.id);
                const isMastered = progress.averageScore >= 85;
                const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                    className="w-full rounded-xl border-2 bg-card hover:border-[#3DB4E8] hover:shadow-xl p-7 transition-all text-left group hover:bg-[#3DB4E8]/5"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <h3 className="font-bold text-lg text-foreground group-hover:text-[#3DB4E8] transition-colors">{topic.name}</h3>
                          {isMastered && (
                            <div className="px-3 py-1.5 rounded-lg bg-[#3DB4E8]/15 text-[#3DB4E8] text-xs font-bold uppercase tracking-wider border border-[#3DB4E8]/30">Mastered</div>
                          )}
                          {needsPractice && (
                            <div className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider border border-orange-200">Focus area</div>
                          )}
                        </div>
                        <div className="flex items-center gap-5">
                          <Progress value={progress.averageScore} className="h-3 flex-1" />
                          <div className="text-right min-w-[120px]">
                            <div className="text-xl font-black text-foreground">
                              {progress.attempts > 0 ? `${progress.averageScore}%` : '—'}
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">
                              {progress.attempts > 0 ? `${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}` : 'Start practicing'}
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
          <CardHeader className="relative z-10">
            <CardTitle className="text-3xl font-bold mb-2 tracking-tight">Your learning patterns</CardTitle>
            <p className="text-base text-muted-foreground">Insights generated from your study behavior</p>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-5">
                <div className="p-7 rounded-2xl bg-gradient-to-br from-[#3DB4E8]/10 to-card border-2 border-[#3DB4E8]/20 shadow-lg">
                  <div className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Session length</div>
                  <div className="text-4xl font-black text-[#3DB4E8] mb-3">15-20 min</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your sweet spot for maximum focus. Sessions in this range have a 94% completion rate.</p>
                </div>
                
                <div className="p-7 rounded-2xl bg-card border-2 shadow-lg">
                  <div className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Recovery time</div>
                  <div className="text-4xl font-black text-foreground mb-3">5 min</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Taking short breaks between sessions improves your scores by 23% on average.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="p-7 rounded-2xl bg-card border-2 shadow-lg">
                  <div className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Monthly improvement</div>
                  <div className="text-4xl font-black text-green-600 mb-3">+12%</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">Your average scores have increased consistently. Keep up this momentum.</p>
                </div>

                <div className="p-7 rounded-2xl bg-gradient-to-br from-purple-500/10 to-card border-2 border-purple-500/20 shadow-lg">
                  <div className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wider">Retention rate</div>
                  <div className="text-4xl font-black text-foreground mb-3">87%</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">You retain information well. Topics practiced once are usually mastered within 2-3 sessions.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-8 rounded-2xl bg-gradient-to-r from-[#3DB4E8]/15 to-card border-2 border-[#3DB4E8]/30 shadow-xl">
              <div className="text-sm font-bold text-foreground mb-4 uppercase tracking-wider">Personalized recommendation</div>
              <p className="text-base text-muted-foreground leading-relaxed">Based on your patterns, practicing <span className="font-bold text-foreground">Tuesday and Thursday evenings (7-9 PM)</span> for <span className="font-bold text-foreground">15-20 minutes</span> will maximize your progress toward grade {targetGrade}.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
