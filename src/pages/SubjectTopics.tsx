import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, CheckCircle2, Lock, Sparkles, TrendingUp, Clock, Zap, Calendar, Flame, Trophy, Target, Brain, BarChart3, ArrowRight, Star } from "lucide-react";

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

  const getPhysicsTopicYear = (topicName: string) => {
    const year10Topics = ['Energy', 'Electricity', 'Particle Model of Matter', 'Atomic Structure'];
    const year11Topics = ['Forces', 'Waves', 'Magnetism and Electromagnetism', 'Space Physics'];
    
    if (year10Topics.some(y10Topic => topicName.toLowerCase().includes(y10Topic.toLowerCase()))) {
      return 'Year 10';
    }
    if (year11Topics.some(y11Topic => topicName.toLowerCase().includes(y11Topic.toLowerCase()))) {
      return 'Year 11';
    }
    return null;
  };

  const getMathsTopicYears = (topicName: string) => {
    // Number is only Year 10
    if (topicName.toLowerCase().includes('number')) {
      return ['Year 10'];
    }
    // All other maths topics are both Year 10 and Year 11
    return ['Year 10', 'Year 11'];
  };

  const getGeographyTopicYear = (topicName: string) => {
    // Glacial and River landscapes are Year 11
    if (topicName.toLowerCase().includes('glacial') || topicName.toLowerCase().includes('river')) {
      return 'Year 11';
    }
    // Human Environment topics are Year 11
    if (topicName.toLowerCase().includes('urban issues') || 
        topicName.toLowerCase().includes('changing economic') || 
        topicName.toLowerCase().includes('resource management')) {
      return 'Year 11';
    }
    // All other geography topics are Year 10
    return 'Year 10';
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
  
  // Study streak (mock for now)
  const studyStreak = 7;
  
  // Progress to target
  const percentToTarget = targetGrade ? Math.min(100, Math.round((predictedGrade / targetGrade) * 100)) : 0;
  
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
    // First, check if there are topics that need work
    if (needsWorkTopics.length > 0) {
      return subject.topics.find(t => t.id === needsWorkTopics[0].topicId);
    }
    // Otherwise, find the first topic not started yet
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
                <p className="text-lg text-gray-600">Everything here is tuned to your learning style and progress.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <Badge className="rounded-full px-4 py-2 text-sm bg-[#2E5BFF] hover:bg-[#2E5BFF] text-white">
                Target: Grade {targetGrade}
              </Badge>
              <Badge variant="outline" className="rounded-full px-4 py-2 text-sm">
                Current phase: Building consistency
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

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* SECTION 2: Topic Progress */}
          <div className="md:col-span-2">
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
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            {/* Best Study Time */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#2E5BFF]" />
                  </div>
                  <h3 className="font-semibold">Best Study Time</h3>
                </div>
                <p className="text-sm text-gray-600">Your top performance window is 7–9 PM.</p>
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
                <p className="text-sm italic text-gray-700">"Progress is built on rhythm, not rush."</p>
              </CardContent>
            </Card>

            {/* Milestone Countdown */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-[#F7F9FC]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold">Milestone Countdown</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">Mock exam in 19 days</p>
                <Progress value={70} className="h-2" />
              </CardContent>
            </Card>

            {/* Energy Boost */}
            <Card className="rounded-2xl shadow-md border border-[#E7ECF5] bg-gradient-to-br from-[#2E5BFF]/5 to-purple-50">
              <CardContent className="p-6">
                <div className="text-4xl mb-2 text-center">🧠</div>
                <p className="text-sm text-center text-gray-700 font-medium">You're ahead of schedule — keep that streak alive!</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SECTION 3: Smart Insights */}
        <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] mb-8 bg-[#F6F8FF]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#2E5BFF]" />
              How you learn best in {subject?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Clock className="w-4 h-4 text-[#2E5BFF]" />
                  </div>
                  <p className="text-sm">You score highest in <strong>evening sessions (6–8 PM)</strong></p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-sm"><strong>Short quizzes</strong> boost your retention by 20%</p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-sm">You recall best after <strong>reviewing the next day</strong></p>
                </div>
              </div>
              <div className="rounded-xl bg-white p-4 border border-[#E7ECF5]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Target className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-sm"><strong>Timed mocks</strong> improve your focus</p>
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
        <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] mb-8 border-t-4 border-t-[#2E5BFF]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">This Week's Personal Plan</CardTitle>
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
                  <h4 className="font-semibold mb-1">Monday — Quick Quiz (10 min)</h4>
                  <p className="text-xs text-gray-600">Personalised for your weak areas</p>
                </div>
              </div>
              <div className="rounded-lg bg-[#F7F9FC] p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🌿</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Wednesday — Flashcards: {subject?.topics[0]?.name || 'Key Topic'}</h4>
                  <p className="text-xs text-gray-600">Spaced repetition for long-term memory</p>
                </div>
              </div>
              <div className="rounded-lg bg-[#F7F9FC] p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Friday — Practice Paper (20 min)</h4>
                  <p className="text-xs text-gray-600">Timed questions at your target grade</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">All tasks update automatically every Sunday.</p>
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

        {/* SECTION 5: Confidence & Streak */}
        <Card className="rounded-2xl shadow-lg border border-[#E7ECF5] mb-8">
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
                <p className="text-sm text-gray-600 text-center italic">Every study session compounds your success.</p>
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
                <p className="text-sm text-gray-600 text-center mt-4 italic">Confidence builds with each attempt.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6: Next Step Action Card */}
        {nextTopic && (
          <Card className="rounded-2xl shadow-2xl border-t-4 border-t-[#2E5BFF] bg-gradient-to-br from-white to-[#F6F8FF] mb-8">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-start gap-6">
                <div className="text-6xl">🚀</div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">Next Step: Short Drill on {nextTopic.name}</h2>
                  <p className="text-lg text-gray-600 mb-6">10 min • personalised for your target grade</p>
                  <Button 
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="bg-gradient-to-r from-[#2E5BFF] to-[#1E4FEE] hover:from-[#1E4FEE] hover:to-[#0E3FDD] text-white rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Now
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">Just follow your plan — it's built to get you to Grade {targetGrade}.</p>
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
            Follow your plan daily, and watch your confidence grow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
