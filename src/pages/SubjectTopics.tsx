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
        <div className="max-w-4xl mx-auto px-8 py-5 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 -ml-3 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12 space-y-12">
        {/* Subject Title */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold text-gray-900">{subject?.name}</h1>
          <p className="text-lg text-gray-600">Your personal revision hub</p>
        </div>

        {/* Grade Stats - Clean Medly Style */}
        <div className="grid grid-cols-2 gap-6">
          {/* Current Grade */}
          <div className="text-center py-12 px-8 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 transition-colors">
            <div className="text-7xl font-bold text-gray-900 mb-3">{predictedGradeDecimal.toFixed(1)}</div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Grade</p>
          </div>

          {/* Target Grade - Editable */}
          <div className="text-center py-12 px-8 rounded-2xl border-2 border-[#3DB4E8] bg-white hover:border-[#2E5BFF] transition-colors">
            <div className="flex items-center justify-center gap-4 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => targetGrade && targetGrade > 4 && handleSetTargetGrade(targetGrade - 1)}
                className="h-10 w-10 p-0 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 text-xl font-bold"
                disabled={!targetGrade || targetGrade <= 4}
              >
                −
              </Button>
              <div className="text-7xl font-bold text-[#3DB4E8]">{targetGrade}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => targetGrade && targetGrade < 9 && handleSetTargetGrade(targetGrade + 1)}
                className="h-10 w-10 p-0 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 text-xl font-bold"
                disabled={!targetGrade || targetGrade >= 9}
              >
                +
              </Button>
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Target Grade</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Progress to Grade {targetGrade}</h2>
            <span className="text-2xl font-bold text-[#3DB4E8]">{percentToTarget}%</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#3DB4E8] rounded-full transition-all duration-1000"
              style={{ width: `${percentToTarget}%` }}
            />
          </div>
        </div>

        {/* Next Action - Primary CTA */}
        {nextTopic && (
          <div className="text-center py-12 px-8 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">What's next?</h2>
            <p className="text-lg text-gray-600 mb-8">Practice: <span className="font-semibold">{nextTopic.name}</span></p>
            <Button 
              onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
              className="bg-[#3DB4E8] hover:bg-[#2E5BFF] text-white rounded-xl px-12 py-6 text-lg font-semibold shadow-none hover:shadow-lg transition-all"
            >
              Start Practice
            </Button>
          </div>
        )}

        {/* Topic List - Clean Medly Style */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">All Topics</h2>
            <div className="flex gap-2">
              {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={topicFilter === filter ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTopicFilter(filter)}
                  className={topicFilter === filter 
                    ? "rounded-lg bg-[#3DB4E8] hover:bg-[#2E5BFF] text-white font-medium" 
                    : "rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium"
                  }
                >
                  {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strong' : filter === 'focus' ? 'Needs Work' : 'New'}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredTopics.map((topic) => {
              const progress = getTopicProgress(topic.id);
              const isMastered = progress.averageScore >= 85;
              const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
              const inProgress = progress.attempts > 0 && !isMastered && !needsPractice;
              
              return (
                <button
                  key={topic.id}
                  onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                  className="w-full rounded-xl border border-gray-200 bg-white hover:border-[#3DB4E8] hover:bg-blue-50/30 p-6 transition-all duration-200 text-left group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3DB4E8] transition-colors">{topic.name}</h3>
                    <div className="flex items-center gap-3">
                      {progress.attempts > 0 && (
                        <span className="text-sm font-bold text-gray-600">{progress.averageScore}%</span>
                      )}
                      <div className={`w-3 h-3 rounded-full ${
                        isMastered ? 'bg-green-500' : 
                        needsPractice ? 'bg-orange-400' : 
                        inProgress ? 'bg-[#3DB4E8]' : 
                        'bg-gray-300'
                      }`} />
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isMastered ? 'bg-green-500' : 
                        needsPractice ? 'bg-orange-400' : 
                        'bg-[#3DB4E8]'
                      }`}
                      style={{ width: `${progress.averageScore}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Grid - Minimal */}
        <div className="grid grid-cols-3 gap-6 pt-6">
          <div className="text-center py-8 px-6 rounded-xl border border-gray-200 bg-white">
            <div className="text-4xl font-bold text-gray-900 mb-2">{masteredTopics}</div>
            <p className="text-sm font-medium text-gray-600">Topics Mastered</p>
          </div>
          <div className="text-center py-8 px-6 rounded-xl border border-gray-200 bg-white">
            <div className="text-4xl font-bold text-gray-900 mb-2">{avgScore}%</div>
            <p className="text-sm font-medium text-gray-600">Average Score</p>
          </div>
          <div className="text-center py-8 px-6 rounded-xl border border-gray-200 bg-white">
            <div className="text-4xl font-bold text-gray-900 mb-2">{examReadiness}%</div>
            <p className="text-sm font-medium text-gray-600">Exam Ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
