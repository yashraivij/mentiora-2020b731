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
      {/* Minimal Header */}
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 -ml-3"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <div className="text-3xl">
            {subjectId?.includes('bio') ? '🧬' : subjectId?.includes('eng') ? '📖' : subjectId?.includes('math') ? '🔢' : subjectId?.includes('phys') ? '⚛️' : subjectId?.includes('chem') ? '🧪' : subjectId?.includes('geo') ? '🌍' : '📚'}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Hero Stats - Big Dopamine Hits */}
        <div className="grid grid-cols-3 gap-4">
          {/* Streak */}
          <Card className="rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-4xl font-bold text-orange-600 mb-1">{studyStreak}</div>
              <p className="text-xs font-medium text-gray-600">Day Streak 🔥</p>
            </CardContent>
          </Card>

          {/* Current Grade */}
          <Card className="rounded-2xl border-2 border-[#3DB4E8] bg-gradient-to-br from-blue-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-[#3DB4E8] mx-auto mb-2" />
              <div className="text-4xl font-bold text-[#3DB4E8] mb-1">{predictedGradeDecimal.toFixed(1)}</div>
              <p className="text-xs font-medium text-gray-600">Current Grade</p>
            </CardContent>
          </Card>

          {/* Target */}
          <Card className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-4xl font-bold text-green-600 mb-1">{targetGrade}</div>
              <p className="text-xs font-medium text-gray-600">Target Grade 🎯</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Target - Visual Motivation */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-900">Your Progress to Grade {targetGrade}</h2>
              <span className="text-2xl font-bold text-[#3DB4E8]">{percentToTarget}%</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3DB4E8] to-[#2E5BFF] rounded-full transition-all duration-1000"
                style={{ width: `${percentToTarget}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-3 text-center italic">
              {percentToTarget >= 90 ? "🎉 Almost there! Keep it up!" : percentToTarget >= 70 ? "💪 Great progress! You're on track!" : percentToTarget >= 50 ? "📈 Getting stronger every day!" : "🚀 Every session gets you closer!"}
            </p>
          </CardContent>
        </Card>

        {/* Next Action - BIGGEST CTA */}
        {nextTopic && (
          <Card className="rounded-2xl border-2 border-[#3DB4E8] bg-gradient-to-br from-[#3DB4E8]/5 to-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[#3DB4E8]/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-8 h-8 text-[#3DB4E8]" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Ready to level up?</h2>
                  <p className="text-gray-600">Next: <span className="font-semibold">{nextTopic.name}</span></p>
                </div>
              </div>
              <Button 
                onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                className="w-full bg-gradient-to-r from-[#3DB4E8] to-[#2E5BFF] hover:from-[#2E5BFF] hover:to-[#1E4FEE] text-white rounded-xl py-6 text-lg font-semibold shadow-md hover:shadow-xl transition-all"
              >
                Start Practice Now →
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Wins - 3 Key Insights */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Best Time</h4>
                  <p className="text-xs text-gray-600">7–9 PM works best for you</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Mastered</h4>
                  <p className="text-xs text-gray-600">{masteredTopics} of {totalTopics} topics complete</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Mock Exam</h4>
                  <p className="text-xs text-gray-600">19 days • {examReadiness}% ready</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Topics - Clean List */}
        <Card className="rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">All Topics</CardTitle>
              <div className="flex gap-2">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter ? "rounded-lg bg-[#3DB4E8] hover:bg-[#2E5BFF] text-white h-8 text-xs" : "rounded-lg h-8 text-xs"}
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strong' : filter === 'focus' ? 'Focus' : 'New'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-2">
              {filteredTopics.map((topic) => {
                const progress = getTopicProgress(topic.id);
                const isMastered = progress.averageScore >= 85;
                const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                const inProgress = progress.attempts > 0 && !isMastered && !needsPractice;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                    className="w-full rounded-xl border border-gray-200 bg-white hover:border-[#3DB4E8] hover:bg-blue-50/50 p-4 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isMastered ? 'bg-green-100' : 
                          needsPractice ? 'bg-orange-100' : 
                          inProgress ? 'bg-blue-100' : 
                          'bg-gray-100'
                        }`}>
                          {isMastered ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          ) : needsPractice ? (
                            <Zap className="w-5 h-5 text-orange-600" />
                          ) : inProgress ? (
                            <Clock className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-[#3DB4E8] transition-colors">{topic.name}</h3>
                          <div className="flex items-center gap-2">
                            <Progress value={progress.averageScore} className="h-1.5 flex-1 max-w-[200px]" />
                            <span className="text-xs font-medium text-gray-500">
                              {progress.attempts > 0 ? `${progress.averageScore}%` : 'Start'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#3DB4E8] transition-colors" />
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

        {/* Insights */}
        <Card className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#3DB4E8]" />
              Your Learning Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#3DB4E8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-[#3DB4E8]" />
                </div>
                <p className="text-sm text-gray-700">Short 10-min sessions work best for you</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm text-gray-700">Take breaks after 25 minutes for best retention</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">You're improving steadily — up 12% this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Motivation */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#3DB4E8]/10 mb-4">
            <Trophy className="w-5 h-5 text-[#3DB4E8]" />
            <span className="text-sm font-semibold text-[#3DB4E8]">You're on the right path</span>
          </div>
          <p className="text-gray-600 text-sm">
            Keep showing up. Every session brings you closer to Grade {targetGrade}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
