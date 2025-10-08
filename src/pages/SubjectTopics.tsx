import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, CheckCircle2, Lock, Sparkles, TrendingUp, Clock, Zap, Calendar, Flame, Trophy, Target, Brain, BarChart3, ArrowRight, Star, Award, Activity, BookOpen, LineChart, Battery } from "lucide-react";

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
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full rounded-2xl shadow-2xl border-t-4 border-t-[#2E5BFF]">
          <CardContent className="p-12 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-[#2E5BFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-[#2E5BFF]" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Set your target grade for {subject?.name}</h1>
              <p className="text-lg text-gray-600">We'll personalise everything around your goal.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 max-w-md mx-auto">
              {[4, 5, 6, 7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleSetTargetGrade(grade)}
                  className="h-24 rounded-2xl border-2 border-gray-200 hover:border-[#2E5BFF] hover:bg-[#2E5BFF]/5 hover:shadow-lg transition-all duration-200 flex items-center justify-center text-3xl font-bold text-gray-700 hover:text-[#2E5BFF] hover:scale-105"
                >
                  {grade}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500">You can change this anytime.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#E7ECF5] bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowGradeSetup(true)}
            className="rounded-full"
          >
            Target: Grade {targetGrade}
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* SECTION 1: Subject Overview Hero */}
        <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] mb-8 overflow-hidden">
          <CardContent className="p-8 md:p-12">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-5xl">
                {subjectId?.includes('bio') ? '🧬' : subjectId?.includes('eng') ? '📖' : subjectId?.includes('math') ? '🔢' : subjectId?.includes('phys') ? '⚛️' : subjectId?.includes('chem') ? '🧪' : subjectId?.includes('geo') ? '🌍' : '📚'}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">Your journey in {subject?.name}</h1>
                <p className="text-lg text-gray-600">Everything here adapts to your progress.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="rounded-full px-4 py-2 text-sm bg-[#2E5BFF] hover:bg-[#2E5BFF] text-white">
                Target: Grade {targetGrade}
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-2 text-sm">
                Phase: Building consistency
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-2 text-sm">
                Confidence: Steady improvement
              </Badge>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress to target</span>
                <span className="text-sm font-bold text-[#2E5BFF]">{percentToTarget}%</span>
              </div>
              <Progress value={percentToTarget} className="h-3 rounded-full" />
            </div>

            <p className="text-gray-600 mb-8 text-center italic">
              "Keep showing up. Mentiora adapts your plan every time you do."
            </p>

            {nextTopic && (
              <Button 
                onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                className="w-full md:w-auto mx-auto flex items-center gap-2 bg-gradient-to-r from-[#2E5BFF] to-[#1E4FEE] hover:from-[#1E4FEE] hover:to-[#0E3FDD] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Today's Focus <ArrowRight className="w-5 h-5" />
              </Button>
            )}
          </CardContent>
        </Card>

        {/* SECTION 2: Analytics Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Predicted Grade Tracker */}
          <Card className="rounded-2xl shadow-md border border-[#E7ECF5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#2E5BFF]" />
                <h3 className="text-sm font-semibold text-gray-600">Predicted Grade</h3>
              </div>
              <div className="text-5xl font-bold text-[#2E5BFF] mb-2">{predictedGradeDecimal.toFixed(1)}</div>
              <p className="text-xs text-green-600 mb-4">↑ Up +0.4 since last week</p>
              <div className="h-16 flex items-end justify-between gap-1">
                {[65, 70, 68, 75, 78, 80, avgScore].map((val, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-[#2E5BFF] to-[#2E5BFF]/40 rounded-sm" style={{ height: `${(val / 100) * 64}px` }} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Topic Mastery Overview */}
          <Card className="rounded-2xl shadow-md border border-[#E7ECF5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-semibold text-gray-600">Topic Mastery</h3>
              </div>
              <div className="text-5xl font-bold text-purple-600 mb-2">{masteredTopics}/{totalTopics}</div>
              <p className="text-xs text-gray-600 mb-4">topics mastered</p>
              <Progress value={completionRate} className="h-2 mb-2" />
              <div className="flex gap-1">
                {subject.topics.slice(0, 6).map((topic, i) => {
                  const prog = getTopicProgress(topic.id);
                  return (
                    <div key={i} className="flex-1 h-12 bg-gray-100 rounded-sm relative overflow-hidden">
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm" style={{ height: `${prog.averageScore}%` }} />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Best Study Time */}
          <Card className="rounded-2xl shadow-md border border-[#E7ECF5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="text-sm font-semibold text-gray-600">Best Study Time</h3>
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">7–9 PM</div>
              <p className="text-xs text-gray-600 mb-4">Your peak focus window</p>
              <div className="h-16 flex items-end justify-between gap-1">
                {[40, 50, 45, 60, 70, 85, 92, 88, 75, 65, 50, 40].map((val, i) => (
                  <div key={i} className={`flex-1 rounded-sm ${i >= 7 && i <= 9 ? 'bg-gradient-to-t from-orange-600 to-orange-400' : 'bg-gray-200'}`} style={{ height: `${(val / 100) * 64}px` }} />
                ))}
              </div>
              <p className="text-xs text-green-600 mt-2">+12% higher accuracy at this time</p>
            </CardContent>
          </Card>

          {/* Consistency & Streak */}
          <Card className="rounded-2xl shadow-md border border-[#E7ECF5]">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-semibold text-gray-600">Study Streak</h3>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-10 h-10 text-orange-500" />
                <span className="text-5xl font-bold text-orange-500">{studyStreak}</span>
              </div>
              <p className="text-xs text-gray-600 mb-4">days in a row</p>
              <div className="flex justify-center gap-2 mb-3">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div 
                    key={day} 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${day <= studyStreak ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-600 italic">Consistency builds results</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* SECTION 3: Personal Learning Insights */}
            <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] bg-[#F6F8FF]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-[#2E5BFF]" />
                  How you learn best in {subject?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-5 h-5 text-[#2E5BFF]" />
                      </div>
                      <p className="text-sm">Short <strong>10-min sessions</strong> give best retention</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <p className="text-sm">Your focus dips after <strong>25 min</strong> — take breaks</p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-green-600" />
                      </div>
                      <p className="text-sm">You recall more when <strong>summarising aloud</strong></p>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Target className="w-5 h-5 text-orange-600" />
                      </div>
                      <p className="text-sm"><strong>Visual questions</strong> improve your marks fastest</p>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-6">
                  <Button variant="link" className="text-[#2E5BFF] hover:underline">
                    Optimise my plan →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 4: Weekly Plan */}
            <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] border-t-4 border-t-[#2E5BFF]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Your Weekly Plan</CardTitle>
                  <Button variant="link" className="text-[#2E5BFF]">View all weeks →</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg bg-[#F7F9FC] p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#2E5BFF]" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Quick Quiz — Enzymes and Catalysts (10 min)</h4>
                      <p className="text-xs text-gray-600">Personalised for your weak areas</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F7F9FC] p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🌿</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Flashcards — Photosynthesis</h4>
                      <p className="text-xs text-gray-600">Spaced repetition for long-term memory</p>
                    </div>
                  </div>
                  <div className="rounded-lg bg-[#F7F9FC] p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Exam Practice — 6-marker structure</h4>
                      <p className="text-xs text-gray-600">Timed questions at your target grade</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">All tasks reset every Sunday.</p>
                {nextTopic && (
                  <Button 
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="w-full mt-6 bg-gradient-to-r from-[#2E5BFF] to-[#1E4FEE] hover:from-[#1E4FEE] hover:to-[#0E3FDD] text-white rounded-full py-6 text-base shadow-lg"
                  >
                    Start Next Task →
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* SECTION 5: Deep Analytics Zone */}
            <Card className="rounded-2xl shadow-lg border border-[#E7ECF5]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-[#2E5BFF]" />
                  Deep Analytics
                </CardTitle>
                <CardDescription>Performance insights that fuel your success</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Exam-Readiness Score */}
                  <div className="rounded-xl bg-gradient-to-br from-[#2E5BFF]/5 to-[#2E5BFF]/10 p-6 border border-[#E7ECF5]">
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-[#2E5BFF]" />
                      <h4 className="font-semibold">Exam-Readiness Score</h4>
                    </div>
                    <div className="text-5xl font-bold text-[#2E5BFF] mb-3">{examReadiness}%</div>
                    <p className="text-sm text-gray-600 mb-4">Your readiness for next mock</p>
                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#1E4FEE] rounded-full transition-all duration-1000" style={{ width: `${examReadiness}%` }} />
                    </div>
                  </div>

                  {/* Retention Heatmap */}
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 border border-[#E7ECF5]">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold">Retention Heatmap</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">14-day memory retention</p>
                    <div className="grid grid-cols-7 gap-2">
                      {[85, 90, 78, 92, 88, 95, 87, 82, 89, 91, 86, 93, 88, 90].map((val, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded-sm ${val >= 90 ? 'bg-green-600' : val >= 80 ? 'bg-green-400' : val >= 70 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          title={`Day ${i + 1}: ${val}%`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Learning Curve Graph */}
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 border border-[#E7ECF5]">
                    <div className="flex items-center gap-2 mb-3">
                      <LineChart className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold">Learning Curve</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Marks improvement over time</p>
                    <div className="h-24 flex items-end justify-between gap-1">
                      {[45, 52, 58, 62, 68, 72, 75, 78, 82, 85, avgScore].map((val, i) => (
                        <div key={i} className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-sm" style={{ height: `${(val / 100) * 96}px` }} />
                      ))}
                    </div>
                    <p className="text-xs text-green-600 mt-2">↗️ Steady upward trend — keep going</p>
                  </div>

                  {/* Question Type Accuracy */}
                  <div className="rounded-xl bg-gradient-to-br from-orange-50 to-red-50 p-6 border border-[#E7ECF5]">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold">Question Type Accuracy</h4>
                    </div>
                    <div className="space-y-3">
                      {[
                        { type: 'Describe', accuracy: 92 },
                        { type: 'Explain', accuracy: 85 },
                        { type: 'Evaluate', accuracy: 78 },
                        { type: 'Compare', accuracy: 82 }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium">{item.type}</span>
                            <span className="text-orange-600 font-semibold">{item.accuracy}%</span>
                          </div>
                          <Progress value={item.accuracy} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consistency Score */}
                  <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border border-[#E7ECF5] md:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold">Consistency Score</h4>
                        </div>
                        <p className="text-sm text-gray-600">Your discipline is paying off</p>
                      </div>
                      <div className="text-5xl font-bold text-blue-600">{consistencyScore}</div>
                    </div>
                    <Progress value={consistencyScore} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SECTION 6: Topic Progress */}
            <Card className="rounded-2xl shadow-lg border border-[#E7ECF5]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Topics</CardTitle>
                
                <div className="flex gap-2 mt-4">
                  {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                    <Button
                      key={filter}
                      variant={topicFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTopicFilter(filter)}
                      className={topicFilter === filter ? "rounded-full bg-[#2E5BFF] hover:bg-[#2E5BFF]" : "rounded-full"}
                    >
                      {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strengths' : filter === 'focus' ? 'Focus' : 'New'}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid gap-4">
                  {filteredTopics.map((topic) => {
                    const progress = getTopicProgress(topic.id);
                    const isMastered = progress.averageScore >= 85;
                    const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                    
                    return (
                      <button
                        key={topic.id}
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        className="rounded-xl border border-[#E7ECF5] bg-white p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-left"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{topic.name}</h3>
                            {isMastered && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            {needsPractice && <Zap className="w-4 h-4 text-orange-500" />}
                          </div>
                          <span className="text-sm font-medium text-[#2E5BFF]">
                            {progress.attempts > 0 ? `${progress.averageScore}%` : 'Start'}
                          </span>
                        </div>
                        <Progress value={progress.averageScore} className="h-2 mb-2" />
                        <p className="text-xs text-gray-500">
                          {isMastered ? 'Mastered ⭐' : needsPractice ? 'Needs practice' : progress.attempts > 0 ? 'Good progress' : 'Not started yet'}
                        </p>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">Updated automatically after each session.</p>
              </CardContent>
            </Card>

            {/* SECTION 7: Confidence & Momentum */}
            <Card className="rounded-2xl shadow-lg border border-[#E7ECF5]">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Your Momentum</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Streak */}
                  <div>
                    <div className="text-center mb-4">
                      <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                      <div className="text-4xl font-bold mb-2">{studyStreak}-day streak</div>
                    </div>
                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <div 
                          key={day} 
                          className={`w-3 h-3 rounded-full ${day <= studyStreak ? 'bg-orange-500' : 'bg-gray-200'}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 text-center italic">Each study day compounds your results.</p>
                  </div>

                  {/* Confidence Rings */}
                  <div>
                    <h4 className="font-semibold text-center mb-4">Confidence Growth</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Knowledge</span>
                          <span className="font-semibold text-[#2E5BFF]">{Math.min(90, avgScore + 10)}%</span>
                        </div>
                        <Progress value={Math.min(90, avgScore + 10)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Exam Skill</span>
                          <span className="font-semibold text-[#2E5BFF]">{Math.min(85, avgScore + 5)}%</span>
                        </div>
                        <Progress value={Math.min(85, avgScore + 5)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Timing</span>
                          <span className="font-semibold text-[#2E5BFF]">{Math.min(75, avgScore)}%</span>
                        </div>
                        <Progress value={Math.min(75, avgScore)} className="h-2" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 text-center mt-4 italic">Confidence rises with repetition.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Study Rhythm */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#2E5BFF]" />
                  </div>
                  <h3 className="font-semibold">Study Rhythm</h3>
                </div>
                <p className="text-sm text-gray-600">Evening sessions suit you best</p>
              </CardContent>
            </Card>

            {/* Motivation Quote */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <p className="text-sm italic text-gray-700">"Progress, not perfection."</p>
              </CardContent>
            </Card>

            {/* Upcoming Milestone */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Upcoming Milestone</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Mock in 18 days · {examReadiness}% ready</p>
                <Progress value={examReadiness} className="h-2" />
              </CardContent>
            </Card>

            {/* Energy Meter */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-gradient-to-br from-[#2E5BFF]/5 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                    <Battery className="w-5 h-5 text-[#2E5BFF]" />
                  </div>
                  <h3 className="font-semibold">Energy Meter</h3>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={84} className="flex-1 h-3" />
                  <span className="text-sm font-bold text-[#2E5BFF]">84%</span>
                </div>
                <p className="text-xs text-gray-600">{subject?.name} energy ⚡</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SECTION 8: Next Step Action Card */}
        {nextTopic && (
          <Card className="rounded-2xl shadow-2xl border-t-4 border-t-[#2E5BFF] bg-gradient-to-br from-white to-[#F6F8FF] mb-8">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-6">
                <div className="text-6xl">🚀</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Next Step: Short Drill on {nextTopic.name}</h2>
                  <p className="text-lg text-gray-600 mb-6">10 min • tailored to your target grade</p>
                  <Button 
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="bg-gradient-to-r from-[#2E5BFF] to-[#1E4FEE] hover:from-[#1E4FEE] hover:to-[#0E3FDD] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Now
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">Follow your plan — Mentiora handles the rest.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Footer */}
        <div className="text-center py-12">
          <Trophy className="w-12 h-12 text-[#2E5BFF] mx-auto mb-4" />
          <p className="text-2xl font-bold text-gray-800 mb-2">
            "This is MY private revision space for {subject?.name}"
          </p>
          <p className="text-gray-600">
            Stay consistent — you're getting closer each day.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
