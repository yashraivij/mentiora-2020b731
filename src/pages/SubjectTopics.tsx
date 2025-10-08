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
      <div className="min-h-screen bg-gradient-to-br from-[#EAF2FF] to-white flex items-center justify-center p-6 animate-fade-in">
        <Card className="max-w-2xl w-full rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.08)] border-2 border-[#E7ECF5] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-transparent pointer-events-none" />
          <CardContent className="p-16 text-center relative">
            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 text-gray-900 tracking-tight">
                Set your target grade
              </h1>
              <p className="text-xl text-gray-600">for {subject?.name}</p>
              <p className="text-base text-gray-500 mt-3">We'll tailor every plan and insight around your goal.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
              {[4, 5, 6, 7, 8, 9].map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleSetTargetGrade(grade)}
                  className="h-24 rounded-2xl border-2 border-[#E7ECF5] hover:border-[#2563EB] hover:bg-[#2563EB]/5 hover:shadow-[0_0_24px_rgba(37,99,235,0.15)] transition-all duration-300 flex items-center justify-center text-4xl font-bold text-gray-900 group"
                >
                  <span className="group-hover:scale-110 transition-transform duration-200">{grade}</span>
                </button>
              ))}
            </div>

            <Button 
              onClick={() => setShowGradeSetup(false)}
              className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-full h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Confirm & Unlock My Hub
            </Button>

            <p className="text-sm text-gray-500 mt-6">You can change this anytime</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
      <header className="border-b border-[#E7ECF5] bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-16 animate-fade-in">
        
        {/* Hero Section */}
        <section className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#EAF2FF] via-transparent to-transparent rounded-3xl opacity-50" />
            <div className="relative py-12 px-8">
              <h1 className="text-6xl font-bold text-gray-900 mb-3 tracking-tight">
                Your Journey in {subject?.name}
              </h1>
              <p className="text-xl text-gray-600">
                We're guiding you step-by-step to Grade {targetGrade}.
              </p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/5">
                    <TrendingUp className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Current Grade</span>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{predictedGradeDecimal.toFixed(1)}</div>
                <p className="text-sm text-gray-500">
                  {predictedGradeDecimal >= (targetGrade || 0) - 0.5 ? '🎯 Almost there' : '📈 Improving steadily'}
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/5">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Confidence</span>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">{examReadiness}%</div>
                <p className="text-sm text-gray-500">Exam readiness score</p>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/10 to-violet-500/5">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Focus Topic</span>
                </div>
                <div className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                  {nextTopic?.name || 'All topics mastered'}
                </div>
                <p className="text-sm text-gray-500">This week's priority</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA */}
          <Button 
            onClick={() => nextTopic && navigate(`/practice/${subjectId}/${nextTopic.id}`)}
            disabled={!nextTopic}
            className="w-full md:w-auto bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-full h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            Start Today's Focus →
          </Button>
        </section>

        {/* Personal Progress Graph */}
        <section className="space-y-6">
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your progress toward your target grade</h2>
              <p className="text-gray-600 mb-8">+{(predictedGradeDecimal - 4.2).toFixed(1)} since you started</p>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={progressData}>
                  <defs>
                    <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7ECF5" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis domain={[3, 10]} stroke="#9CA3AF" />
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
                    strokeWidth={3}
                    fill="url(#gradeGradient)" 
                    dot={{ fill: '#2563EB', r: 6 }}
                    activeDot={{ r: 8, fill: '#2563EB', stroke: 'white', strokeWidth: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="target" 
                    stroke="#9CA3AF" 
                    strokeWidth={2} 
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Topic Mastery & Study Rhythm - Side by Side */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Topic Mastery Overview */}
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Topic Mastery Overview</h2>
              
              <div className="space-y-6">
                {topicMastery.map((topic, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-700">{topic.name}</span>
                      <span className="text-sm font-bold text-[#2563EB]">{topic.mastery}%</span>
                    </div>
                    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all duration-500"
                        style={{ width: `${topic.mastery}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {topic.mastery >= 85 ? '✓ Strong' : topic.mastery >= 60 ? '↗ Improving' : '⚠ Needs review'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Study Rhythm Heatline */}
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardContent className="p-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Study Rhythm</h2>
              <p className="text-gray-600 mb-8">You perform 18% better between 6–9 PM</p>
              
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={hourlyPerformance}>
                  <defs>
                    <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="hour" stroke="#9CA3AF" fontSize={12} />
                  <YAxis hide />
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
                    dataKey="score" 
                    stroke="#2563EB" 
                    strokeWidth={3}
                    fill="url(#performanceGradient)"
                    dot={{ fill: '#2563EB', r: 4 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Engagement Rings */}
        <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <CardContent className="p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">This week's performance at a glance</h2>
            <p className="text-gray-600 mb-10">Your three key engagement metrics</p>
            
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <RadialBarChart 
                  innerRadius="20%" 
                  outerRadius="90%" 
                  data={weeklyEngagement} 
                  startAngle={90} 
                  endAngle={-270}
                >
                  <RadialBar 
                    background 
                    dataKey="value" 
                    cornerRadius={10}
                    label={{ position: 'insideStart', fill: '#1F2937', fontSize: 14, fontWeight: 600 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E7ECF5', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }} 
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {weeklyEngagement.map((metric, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}%</div>
                  <div className="text-sm text-gray-500">{metric.metric}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Insights */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900">Learning Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="rounded-3xl border border-[#E7ECF5] bg-gradient-to-br from-[#F7F9FF] to-white shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <Zap className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Optimal session length</h3>
                    <p className="text-gray-600 leading-relaxed">You retain more when doing 10-minute sessions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECF5] bg-gradient-to-br from-[#F7F9FF] to-white shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <Clock className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Rest breaks matter</h3>
                    <p className="text-gray-600 leading-relaxed">Your accuracy drops slightly after 20 minutes — time to rest.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECF5] bg-gradient-to-br from-[#F7F9FF] to-white shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <Brain className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Learning style</h3>
                    <p className="text-gray-600 leading-relaxed">You learn best from written explanations.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-[#E7ECF5] bg-gradient-to-br from-[#F7F9FF] to-white shadow-[0_4px_32px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm">
                    <Target className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Exam practice works</h3>
                    <p className="text-gray-600 leading-relaxed">You're improving fastest in exam-style questions.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Weekly Focus Plan */}
        <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)] overflow-hidden">
          <CardContent className="p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Personal Plan for This Week</h2>
            <p className="text-gray-600 mb-8">Plan refreshes automatically every Sunday</p>

            <div className="space-y-4 mb-8">
              {[
                { task: 'Quick quiz: Forces & Motion ⚡', time: '10 mins', completed: true },
                { task: 'Flashcards: Key Terms', time: '5 mins', completed: false },
                { task: 'Exam Question: Enzymes (6 marks)', time: '6 mins', completed: false },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-[#E7ECF5] hover:border-[#2563EB]/30 transition-all group"
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    item.completed 
                      ? 'bg-[#2563EB] border-[#2563EB]' 
                      : 'border-gray-300 group-hover:border-[#2563EB]'
                  }`}>
                    {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className={`font-semibold ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                      {item.task}
                    </div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-full h-12 px-8 font-semibold shadow-lg">
              Start Next Task →
            </Button>
          </CardContent>
        </Card>

        {/* Motivation & Reward Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Streak */}
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8 text-center">
              <Flame className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">{studyStreak} days</div>
              <div className="text-gray-600 mb-4">Current streak</div>
              <div className="flex gap-2 justify-center">
                {[...Array(7)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full transition-all ${
                      i < studyStreak 
                        ? 'bg-orange-500 animate-pulse' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Confidence */}
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8 text-center">
              <Award className="w-12 h-12 text-[#2563EB] mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">{examReadiness}%</div>
              <div className="text-gray-600 mb-4">Exam confidence</div>
              <div className="text-sm text-gray-500">Knowledge • Skill • Timing</div>
            </CardContent>
          </Card>

          {/* Energy */}
          <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)]">
            <CardContent className="p-8 text-center">
              <Battery className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 mb-2">84%</div>
              <div className="text-gray-600 mb-4">{subject?.name} energy</div>
              <div className="text-sm text-gray-500">Keep it charged ⚡</div>
            </CardContent>
          </Card>
        </div>

        {/* All Topics - Clean List */}
        <Card className="rounded-3xl border border-[#E7ECF5] shadow-[0_4px_32px_rgba(0,0,0,0.05)]">
          <CardHeader className="pb-6 px-10 pt-10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-3xl font-bold mb-2">All Topics</CardTitle>
                <p className="text-gray-600">{filteredTopics.length} {filteredTopics.length === 1 ? 'topic' : 'topics'} in this subject</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'strengths', 'focus', 'new'] as const).map((filter) => (
                  <Button
                    key={filter}
                    variant={topicFilter === filter ? "default" : "outline"}
                    size="default"
                    onClick={() => setTopicFilter(filter)}
                    className={topicFilter === filter 
                      ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-2xl px-6 shadow-lg" 
                      : "rounded-2xl px-6 border-2 border-[#E7ECF5] hover:border-[#2563EB]/30"
                    }
                  >
                    {filter === 'all' ? 'All' : filter === 'strengths' ? 'Strengths' : filter === 'focus' ? 'Focus' : 'New'}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-10 pb-10">
            <div className="space-y-4">
              {filteredTopics.map((topic) => {
                const progress = getTopicProgress(topic.id);
                const isMastered = progress.averageScore >= 85;
                const needsPractice = progress.attempts > 0 && progress.averageScore < 60;
                
                return (
                  <button
                    key={topic.id}
                    onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                    className="w-full rounded-2xl border-2 border-[#E7ECF5] bg-white hover:border-[#2563EB] hover:shadow-lg p-6 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors">
                            {topic.name}
                          </h3>
                          {isMastered && (
                            <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-bold">
                              ✓ Mastered
                            </div>
                          )}
                          {needsPractice && (
                            <div className="px-3 py-1 rounded-lg bg-orange-100 text-orange-700 text-xs font-bold">
                              ⚠ Focus area
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-full transition-all duration-500"
                              style={{ width: `${progress.averageScore}%` }}
                            />
                          </div>
                          <div className="text-right min-w-[100px]">
                            <div className="text-lg font-bold text-gray-900">
                              {progress.attempts > 0 ? `${progress.averageScore}%` : '—'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {progress.attempts > 0 
                                ? `${progress.attempts} ${progress.attempts === 1 ? 'attempt' : 'attempts'}` 
                                : 'Start practicing'
                              }
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

        {/* Next Action - Sticky CTA */}
        {nextTopic && (
          <Card className="rounded-3xl border-2 border-[#2563EB]/20 bg-gradient-to-r from-[#EAF2FF] to-white shadow-[0_4px_32px_rgba(37,99,235,0.1)] sticky bottom-6">
            <CardContent className="p-8">
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-[#2563EB]/10">
                    <Sparkles className="w-8 h-8 text-[#2563EB]" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900 mb-1">
                      Next Best Step: {nextTopic.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      Completing this keeps your streak alive
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                  className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white rounded-full h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Now →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SubjectTopics;
