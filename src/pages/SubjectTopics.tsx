import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, Zap, Clock, Brain, TrendingUp, CheckCircle2, Flame, Battery, Award, Sparkles, Calendar, BookOpen } from "lucide-react";
import { LineChart, Line, BarChart, Bar, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

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

  // Generate mock data for charts
  const progressData = [
    { week: 'Week 1', grade: 4.2, target: targetGrade },
    { week: 'Week 2', grade: 4.5, target: targetGrade },
    { week: 'Week 3', grade: 4.8, target: targetGrade },
    { week: 'Week 4', grade: 5.2, target: targetGrade },
    { week: 'Week 5', grade: 5.5, target: targetGrade },
    { week: 'Now', grade: predictedGradeDecimal, target: targetGrade },
  ];

  const hourlyPerformance = [
    { hour: '6AM', score: 65 },
    { hour: '9AM', score: 72 },
    { hour: '12PM', score: 68 },
    { hour: '3PM', score: 74 },
    { hour: '6PM', score: 88 },
    { hour: '9PM', score: 85 },
    { hour: '11PM', score: 58 },
  ];

  const topicMastery = subject?.topics.slice(0, 5).map(topic => {
    const progress = getTopicProgress(topic.id);
    return {
      name: topic.name.length > 20 ? topic.name.substring(0, 20) + '...' : topic.name,
      mastery: progress.averageScore || 0,
    };
  }) || [];

  const weeklyEngagement = [
    { metric: 'Time', value: 85, fill: '#2563EB' },
    { metric: 'Accuracy', value: avgScore, fill: '#3B82F6' },
    { metric: 'Consistency', value: consistencyScore, fill: '#60A5FA' },
  ];

  // Target Grade Setup Modal
  if (showGradeSetup) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 animate-fade-in">
        <Card className="max-w-2xl w-full rounded-3xl shadow-[0_8px_48px_rgba(0,0,0,0.06)] border border-[#E7ECF5] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/3 to-transparent pointer-events-none" />
          <CardContent className="p-16 text-center relative">
            <div className="mb-10">
              <h1 className="text-5xl font-semibold mb-4 text-gray-900 tracking-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                Set your target grade
              </h1>
              <p className="text-xl text-gray-600 mb-2">for {subject?.name}</p>
              <p className="text-sm text-gray-500 mt-3">Everything you see next will adapt to your goal.</p>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-10 max-w-md mx-auto">
              {[4, 5, 6, 7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleSetTargetGrade(grade)}
                  className="h-20 rounded-2xl border border-[#E2E8F0] hover:border-[#60A5FA] hover:bg-gradient-to-br hover:from-[#2563EB]/5 hover:to-[#60A5FA]/5 hover:shadow-[0_4px_16px_rgba(37,99,235,0.1)] transition-all duration-300 flex items-center justify-center text-3xl font-semibold text-gray-900 group"
                >
                  <span className="group-hover:scale-105 transition-transform duration-200">{grade}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => setShowGradeSetup(false)}
              className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white rounded-full h-12 px-10 text-base font-medium shadow-md hover:shadow-lg transition-all"
            >
              Save & Unlock My Hub
            </Button>

            <p className="text-xs text-gray-400 mt-6">You can change this anytime</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-[#E7ECF5] bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-900 hover:bg-[#F8FAFC] rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-12 space-y-12 animate-fade-in">
        
        {/* Hero Section */}
        <section className="space-y-8">
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_2px_24px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB]/5 via-[#60A5FA]/3 to-transparent pointer-events-none" />
            <CardContent className="p-10 relative">
              <h1 className="text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
                Your journey in {subject?.name}
              </h1>
              <p className="text-base text-gray-600 mb-8">
                We'll keep you on track — step by step, at your pace.
              </p>

              {/* Stat Chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-sm text-gray-700">
                  🎯 Target: Grade {targetGrade}
                </div>
                <div className="px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-sm text-gray-700">
                  🌿 Confidence: Growing steady
                </div>
                <div className="px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-sm text-gray-700">
                  ⏰ This week: {nextTopic?.name || 'Review'}
                </div>
              </div>

              {/* Curved Line Chart */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500 mb-4">Your learning curve so far</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7ECF5" vertical={false} />
                    <XAxis dataKey="week" stroke="#9CA3AF" fontSize={12} />
                    <YAxis hide domain={[3, 10]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #E7ECF5', 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="grade" 
                      stroke="#2563EB" 
                      strokeWidth={2}
                      fill="url(#heroGradient)" 
                      dot={{ fill: '#2563EB', r: 5, strokeWidth: 2, stroke: 'white' }}
                      activeDot={{ r: 7, fill: '#2563EB', stroke: 'white', strokeWidth: 3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="text-sm text-gray-500 italic">
                You're right where you should be. Keep building on it.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* SECTION 1: Progress & Mastery */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Topic Mastery */}
          <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Topic Mastery</h2>
              
              <div className="space-y-5">
                {topicMastery.map((topic, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{topic.name}</span>
                      <span className="text-sm font-semibold text-[#2563EB]">{topic.mastery}%</span>
                    </div>
                    <div className="relative h-2 bg-[#F8FAFC] rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {topic.mastery >= 85 ? 'strong' : topic.mastery >= 60 ? 'improving' : 'needs focus'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Rhythm */}
          <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">When you perform best</h2>
              <p className="text-sm text-gray-500 mb-6">Your accuracy peaks between 7–9 PM.</p>
              
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={hourlyPerformance}>
                  <defs>
                    <linearGradient id="rhythmGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={11} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E2E8F0', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    fill="url(#rhythmGradient)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* SECTION 2: Personal Insights */}
        <section className="rounded-3xl bg-[#F7F9FF] p-10 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">How you learn best in {subject?.name}</h2>
          
          <div className="grid md:grid-cols-3 gap-5">
            <Card className="rounded-2xl border border-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] bg-white hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-t-2xl" />
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#2563EB]/5">
                    <Zap className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Short 10-min sessions help you remember faster.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] bg-white hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-t-2xl" />
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#2563EB]/5">
                    <Clock className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      You focus best right after dinner.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] bg-white hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-all">
              <div className="h-1 bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-t-2xl" />
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#2563EB]/5">
                    <Brain className="w-5 h-5 text-[#2563EB]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Explaining answers aloud boosts your recall.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SECTION 3: Weekly Focus Plan */}
        <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <CardContent className="p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">Your Focus for the Week</h2>
            <p className="text-sm text-gray-500 mb-8">Each step helps move you closer to your grade goal.</p>

            <div className="space-y-3 mb-8">
              {[
                { task: 'Revise Enzymes (10 min quiz)', icon: '🧬', completed: true },
                { task: 'Review Forces with flashcards', icon: '💡', completed: false },
                { task: 'Practice a 6-marker on Photosynthesis', icon: '📝', completed: false },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#60A5FA]/30 transition-all"
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.completed 
                      ? 'bg-[#2563EB] border-[#2563EB]' 
                      : 'border-gray-300'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-xl">{item.icon}</span>
                  <div className={`flex-1 text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-gray-700 font-medium'}`}>
                    {item.task}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mb-6">Plan refreshes every Sunday.</p>

            <Button className="w-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white rounded-full h-11 text-sm font-medium shadow-md hover:shadow-lg transition-all">
              Start Next Task →
            </Button>
          </CardContent>
        </Card>

        {/* SECTION 4: Motivation & Momentum */}
        <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 divide-x divide-[#E2E8F0]">
              {/* Left: Streak */}
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Flame className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{studyStreak}-day streak</div>
                    <p className="text-sm text-gray-500">Consistency compounds results.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-2 flex-1 rounded-full transition-all ${
                        i < studyStreak 
                          ? 'bg-orange-500' 
                          : 'bg-[#F8FAFC]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Right: Confidence */}
              <div className="p-8">
                <p className="text-sm font-medium text-gray-500 mb-4">Confidence grows every time you show up.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="#2563EB" 
                          strokeWidth="6" 
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - examReadiness / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-900">{examReadiness}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Knowledge</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="#60A5FA" 
                          strokeWidth="6" 
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - avgScore / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-900">{avgScore}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Exam Skill</p>
                  </div>
                  <div className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-2">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="#F8FAFC" strokeWidth="6" fill="none" />
                        <circle 
                          cx="32" 
                          cy="32" 
                          r="28" 
                          stroke="#10B981" 
                          strokeWidth="6" 
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - consistencyScore / 100)}`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-900">{consistencyScore}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Timing</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SECTION 5: Premium Insights */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Advanced Analytics</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Exam Readiness Gauge */}
            <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <CardContent className="p-8 text-center">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <defs>
                      <linearGradient id="examGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" />
                        <stop offset="100%" stopColor="#60A5FA" />
                      </linearGradient>
                    </defs>
                    <circle cx="64" cy="64" r="56" stroke="#F8FAFC" strokeWidth="12" fill="none" />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="url(#examGradient)" 
                      strokeWidth="12" 
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - examReadiness / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">{examReadiness}%</span>
                    <span className="text-xs text-gray-500">ready</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">You're {examReadiness}% ready for your next mock.</p>
              </CardContent>
            </Card>

            {/* Retention Heatmap */}
            <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <CardContent className="p-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Memory Pattern</h3>
                <div className="grid grid-cols-7 gap-1.5 mb-4">
                  {[...Array(14)].map((_, i) => (
                    <div 
                      key={i} 
                      className="aspect-square rounded-md"
                      style={{
                        backgroundColor: i < 10 ? `hsl(217, 91%, ${85 - i * 3}%)` : '#F8FAFC'
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">Your memory health over the last two weeks.</p>
              </CardContent>
            </Card>

            {/* Difficulty Curve */}
            <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <CardContent className="p-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Learning Curve</h3>
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={progressData.slice(1)}>
                    <Line 
                      type="monotone" 
                      dataKey="grade" 
                      stroke="#2563EB" 
                      strokeWidth={2}
                      dot={{ fill: '#2563EB', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-500 mt-4">Your questions are getting tougher — and you're keeping up.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* All Topics - Simplified */}
        <Card className="rounded-2xl border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <CardHeader className="pb-4 px-8 pt-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">All Topics</CardTitle>
              <div className="flex gap-2">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter 
                      ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl px-4" 
                      : "rounded-xl px-4 text-gray-600 hover:text-gray-900 hover:bg-[#F8FAFC]"
                    }
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strong' : filter === 'focus' ? 'Focus' : 'New'}
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
                    className="w-full rounded-xl border border-[#E2E8F0] bg-white hover:border-[#60A5FA] hover:shadow-md p-5 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                            {topic.name}
                          </h3>
                          {isMastered && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                          {needsPractice && (
                            <span className="text-xs text-orange-600">⚠</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-[#F8FAFC] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#2563EB] to-[#60A5FA] rounded-full transition-all duration-500"
                              style={{ width: `${progress.averageScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 min-w-[40px]">
                            {progress.attempts > 0 ? `${progress.averageScore}%` : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* SECTION 6: Next Step CTA - Sticky */}
        {nextTopic && (
          <div className="sticky bottom-6">
            <Card className="rounded-2xl border border-[#E2E8F0] bg-gradient-to-r from-[#EAF2FF] to-white shadow-[0_4px_24px_rgba(37,99,235,0.12)]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#2563EB]/10">
                      <Sparkles className="w-6 h-6 text-[#2563EB]" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900 mb-0.5">
                        Next Step: {nextTopic.name}
                      </div>
                      <div className="text-xs text-gray-600">
                        Completing this keeps your streak alive.
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="bg-gradient-to-r from-[#2563EB] to-[#60A5FA] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white rounded-full h-11 px-8 text-sm font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    Start Now →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectTopics;
