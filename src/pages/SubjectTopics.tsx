import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, TrendingUp, Clock, Zap, Brain, Flame, CheckCircle2, Rocket, Send, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, BarChart, Bar, LineChart, Line } from "recharts";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

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
  const [targetGrade, setTargetGrade] = useState<string | null>(null);
  const [showGradeSetup, setShowGradeSetup] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<boolean[]>([false, false, false]);
  const [chatMessage, setChatMessage] = useState("");

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    const loadProgress = async () => {
      if (user?.id) {
        try {
          // Try loading from database first
          const { data, error } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('subject_id', subjectId);

          if (error) throw error;

          if (data && data.length > 0) {
            const progressData = data.map((p: any) => ({
              subjectId: p.subject_id,
              topicId: p.topic_id,
              attempts: p.attempts,
              averageScore: p.average_score,
              lastAttempt: new Date(p.last_attempt)
            }));
            setTopicProgress(progressData);
          } else {
            // Fallback to localStorage
            const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
            if (savedProgress) {
              const allProgress = JSON.parse(savedProgress);
              const progressWithDates = allProgress.map((p: any) => ({
                ...p,
                lastAttempt: new Date(p.lastAttempt)
              }));
              const subjectProgress = progressWithDates.filter((p: any) => p.subjectId === subjectId);
              setTopicProgress(subjectProgress);
            }
          }
        } catch (error) {
          console.error('Error loading progress:', error);
          // Fallback to localStorage on error
          const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
          if (savedProgress) {
            const allProgress = JSON.parse(savedProgress);
            const progressWithDates = allProgress.map((p: any) => ({
              ...p,
              lastAttempt: new Date(p.lastAttempt)
            }));
            const subjectProgress = progressWithDates.filter((p: any) => p.subjectId === subjectId);
            setTopicProgress(subjectProgress);
          }
        }
        
        // Check if target grade is already set
        const savedGrade = localStorage.getItem(`mentiora_target_grade_${user.id}_${subjectId}`);
        if (savedGrade) {
          setTargetGrade(savedGrade);
          setShowGradeSetup(false);
        }
      }
    };

    loadProgress();
  }, [user?.id, subjectId]);

  const handleGradeSelect = (grade: string) => {
    setTargetGrade(grade);
    if (user?.id) {
      localStorage.setItem(`mentiora_target_grade_${user.id}_${subjectId}`, grade);
    }
    setShowGradeSetup(false);
  };

  const toggleTask = (index: number) => {
    const newTasks = [...completedTasks];
    newTasks[index] = !newTasks[index];
    setCompletedTasks(newTasks);
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

  // Mock data for charts
  const progressData = [
    { week: 'Week 1', score: 45 },
    { week: 'Week 2', score: 52 },
    { week: 'Week 3', score: 58 },
    { week: 'Week 4', score: 65 },
    { week: 'Week 5', score: 70 },
    { week: 'Week 6', score: 75 },
  ];

  const hourlyPerformance = [
    { hour: '6am', accuracy: 45 },
    { hour: '9am', accuracy: 55 },
    { hour: '12pm', accuracy: 50 },
    { hour: '3pm', accuracy: 58 },
    { hour: '6pm', accuracy: 72 },
    { hour: '9pm', accuracy: 68 },
  ];

  // Calculate topic mastery
  const topicMastery = subject?.topics.slice(0, 5).map(topic => {
    const progress = getTopicProgress(topic.id);
    return {
      name: topic.name,
      mastery: progress.averageScore || Math.floor(Math.random() * 40 + 40),
      status: progress.averageScore >= 80 ? 'Strong' : progress.averageScore >= 60 ? 'Improving' : 'Needs review'
    };
  }) || [];

  const streakDays = 7;
  const examReadiness = 82;
  const currentEstimate = 6.5;
  const confidenceLevel = "Building consistency";
  const focusTopic = subject?.topics[0]?.name || "Core concepts";

  // Determine if subject is A-Level
  const isALevel = subjectId?.includes('alevel') || false;

  // Target Grade Setup Screen
  if (showGradeSetup) {
    // Define grade options based on level
    const gradeOptions = isALevel 
      ? ['A*', 'A', 'B', 'C', 'D', 'E']
      : ['9', '8', '7', '6', '5', '4', '3', '2', '1'];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <Card className="max-w-2xl w-full rounded-3xl border-border shadow-lg dark:shadow-xl">
          <CardHeader className="text-center space-y-4 pt-12 pb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-semibold text-foreground">
              Set your target grade for {subject?.name}
            </CardTitle>
            <p className="text-muted-foreground text-base">
              Everything next adapts to your goal.
            </p>
          </CardHeader>
          <CardContent className="pb-12">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {gradeOptions.map((grade) => (
                <Button
                  key={grade}
                  onClick={() => handleGradeSelect(grade)}
                  variant="outline"
                  className="h-20 text-2xl font-semibold rounded-2xl border-border hover:border-primary hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:shadow-lg dark:hover:bg-primary/20"
                >
                  {grade}
                </Button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              You can change this later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b border-border bg-card dark:bg-card/50">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          {/* Main Content Column */}
          <div className="space-y-8">
            {/* Hero Card */}
            <Card className="rounded-2xl border-border shadow-lg dark:shadow-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10" />
              <CardHeader className="relative space-y-6 pb-8">
                <div>
                  <h1 className="text-4xl font-semibold text-foreground mb-2">
                    Your journey in {subject?.name}
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    We'll guide you step-by-step to Grade {targetGrade}.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-full bg-muted/50 dark:bg-muted/20 border border-border text-sm font-medium text-foreground">
                    🎯 Target: {targetGrade}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-muted/50 dark:bg-muted/20 border border-border text-sm font-medium text-foreground">
                    🌿 {confidenceLevel}
                  </div>
                  <div className="px-4 py-2 rounded-full bg-muted/50 dark:bg-muted/20 border border-border text-sm font-medium text-foreground">
                    ⏰ Focus: {focusTopic}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2E5BFF" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#2E5BFF" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="week" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip />
                      <Area type="monotone" dataKey="score" stroke="#2E5BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Your learning curve so far · You're right where you should be. Keep building on it.
                </p>
              </CardContent>
            </Card>

            {/* Progress & Mastery - Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Topic Mastery */}
              <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#0F172A]">Topic Mastery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topicMastery.map((topic, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-[#0F172A]">{topic.name}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-[#F7F9FC] text-muted-foreground">
                          {topic.status}
                        </span>
                      </div>
                      <div className="h-2 bg-[#E7ECF5] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#60A5FA] rounded-full transition-all duration-500"
                          style={{ width: `${topic.mastery}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{topic.mastery}% strong</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Study Rhythm */}
              <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-[#0F172A]">Best Study Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={hourlyPerformance}>
                        <defs>
                          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2E5BFF" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#2E5BFF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="hour" stroke="#94A3B8" fontSize={12} />
                        <YAxis stroke="#94A3B8" fontSize={12} />
                        <Tooltip />
                        <Area type="monotone" dataKey="accuracy" stroke="#2E5BFF" strokeWidth={3} fillOpacity={1} fill="url(#colorAccuracy)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    You're most accurate between 7–9 PM
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Personal Insights */}
            <section className="bg-[#F7F9FF] rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-[#0F172A] text-center">
                How you learn best in {subject?.name}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-[#2E5BFF]" />
                    </div>
                    <p className="text-sm text-[#0F172A] leading-relaxed">
                      Short 10-min sessions help you remember faster.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-[#2E5BFF]" />
                    </div>
                    <p className="text-sm text-[#0F172A] leading-relaxed">
                      You focus best right after dinner.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
                  <CardContent className="pt-6 text-center space-y-3">
                    <div className="mx-auto w-12 h-12 rounded-full bg-[#2E5BFF]/10 flex items-center justify-center">
                      <Brain className="h-6 w-6 text-[#2E5BFF]" />
                    </div>
                    <p className="text-sm text-[#0F172A] leading-relaxed">
                      Explaining answers aloud boosts your recall.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Weekly Focus Plan */}
            <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-[#0F172A]">Your Focus for the Week</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Each step helps move you closer to your grade goal.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: "🧬", title: `Revise ${focusTopic}`, time: "10 min quiz" },
                  { icon: "💡", title: "Review Forces with flashcards", time: "5 mins" },
                  { icon: "📝", title: "Practice a 6-marker on Photosynthesis", time: "15 mins" }
                ].map((task, idx) => (
                  <button
                    key={idx}
                    onClick={() => toggleTask(idx)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#F7F9FC] hover:bg-[#E7ECF5] transition-all duration-200 text-left group"
                  >
                    <div className="text-2xl">{task.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0F172A] group-hover:text-[#2E5BFF]">{task.title}</p>
                      <p className="text-sm text-muted-foreground">({task.time})</p>
                    </div>
                    {completedTasks[idx] ? (
                      <CheckCircle2 className="h-6 w-6 text-[#17B26A]" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-[#E7ECF5]" />
                    )}
                  </button>
                ))}
                <p className="text-center text-sm text-muted-foreground mt-6">
                  Plan refreshes every Sunday.
                </p>
                <Button 
                  className="w-full rounded-full bg-[#2E5BFF] hover:bg-[#254AE0] text-white py-6 text-base font-medium shadow-[0_4px_16px_rgba(46,91,255,0.25)]"
                  onClick={() => navigate(`/practice/${subjectId}/${subject?.topics[0]?.id}`)}
                >
                  Start next task
                </Button>
              </CardContent>
            </Card>

            {/* Momentum */}
            <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
              <CardContent className="grid md:grid-cols-2 gap-8 p-8">
                {/* Streak */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Flame className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-3xl font-bold text-[#0F172A]">{streakDays}-day streak</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-8 h-8 rounded-full ${
                          i < streakDays ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-[#E7ECF5]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Consistency builds confidence.</p>
                </div>

                {/* Confidence Gauges */}
                <div className="space-y-4">
                  <p className="font-semibold text-[#0F172A]">Confidence</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Knowledge', value: 78, color: '#2E5BFF' },
                      { label: 'Exam Skill', value: examReadiness, color: '#17B26A' },
                      { label: 'Timing', value: 72, color: '#FDB022' }
                    ].map((gauge, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{gauge.label}</span>
                          <span className="font-medium text-[#0F172A]">{gauge.value}%</span>
                        </div>
                        <div className="h-2 bg-[#E7ECF5] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${gauge.value}%`, backgroundColor: gauge.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Insights */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Exam Readiness */}
              <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
                <CardContent className="pt-8 text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#E7ECF5"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="url(#examGrad)"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - examReadiness / 100)}`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id="examGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2E5BFF" />
                          <stop offset="100%" stopColor="#60A5FA" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-[#0F172A]">{examReadiness}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You're {examReadiness}% ready for your next mock.
                  </p>
                </CardContent>
              </Card>

              {/* Retention Heatmap */}
              <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
                <CardContent className="pt-8 space-y-4">
                  <p className="text-sm font-semibold text-[#0F172A] text-center">Retention Pattern</p>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded"
                        style={{
                          backgroundColor: i < 10 ? `hsl(217, 91%, ${60 + (i * 3)}%)` : '#E7ECF5'
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Your memory pattern over the last two weeks.
                  </p>
                </CardContent>
              </Card>

              {/* Difficulty Trend */}
              <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
                <CardContent className="pt-8 space-y-4">
                  <p className="text-sm font-semibold text-[#0F172A] text-center">Difficulty Curve</p>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <Line type="monotone" dataKey="score" stroke="#2E5BFF" strokeWidth={2} dot={{ fill: '#2E5BFF', r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Your questions are getting tougher — and you're keeping up.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Sticky Next Step */}
            <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)] bg-gradient-to-r from-[#EAF2FF] to-background">
              <CardContent className="flex items-center gap-6 p-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2E5BFF] to-[#60A5FA] flex items-center justify-center flex-shrink-0">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#0F172A] text-lg mb-1">
                    Next up: 10-min {subject?.name} drill on {focusTopic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Completing this keeps your streak alive.
                  </p>
                </div>
                <Button 
                  className="rounded-full bg-[#2E5BFF] hover:bg-[#254AE0] text-white px-8 py-6 text-base font-medium shadow-[0_4px_16px_rgba(46,91,255,0.25)] hover:shadow-[0_6px_24px_rgba(46,91,255,0.35)]"
                  onClick={() => navigate(`/practice/${subjectId}/${subject?.topics[0]?.id}`)}
                >
                  Start now →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tutor Dock */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card className="rounded-2xl border-[#E7ECF5] shadow-[0_6px_30px_rgba(15,23,42,0.06)]">
              <CardHeader className="border-b border-[#E7ECF5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2E5BFF] to-[#60A5FA] flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-[#0F172A]">Your Mentor</CardTitle>
                    <p className="text-xs text-muted-foreground">I'll break things down and keep you on track.</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                {/* Chat Messages */}
                <div className="space-y-3">
                  <div className="bg-[#F7F9FC] rounded-2xl rounded-tl-sm p-4 text-sm text-[#0F172A]">
                    Let's make a plan for today.
                  </div>
                  <div className="bg-[#F7F9FC] rounded-2xl rounded-tl-sm p-4 text-sm text-[#0F172A]">
                    Want help with {focusTopic}?
                  </div>
                  <div className="bg-[#F7F9FC] rounded-2xl rounded-tl-sm p-4 text-sm text-[#0F172A]">
                    Prefer a 10-min or 20-min session?
                  </div>
                </div>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E7ECF5] hover:bg-[#F7F9FC] hover:border-[#2E5BFF] hover:text-[#2E5BFF]">
                    Explain step-by-step
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E7ECF5] hover:bg-[#F7F9FC] hover:border-[#2E5BFF] hover:text-[#2E5BFF]">
                    Mark my answer
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-full text-xs border-[#E7ECF5] hover:bg-[#F7F9FC] hover:border-[#2E5BFF] hover:text-[#2E5BFF]">
                    Give me a quick drill
                  </Button>
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 pt-4 border-t border-[#E7ECF5]">
                  <Input
                    placeholder="Type to ask anything…"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="rounded-full border-[#E7ECF5] focus:border-[#2E5BFF] focus:ring-[#2E5BFF]"
                  />
                  <Button 
                    size="icon"
                    className="rounded-full bg-[#2E5BFF] hover:bg-[#254AE0] text-white flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
