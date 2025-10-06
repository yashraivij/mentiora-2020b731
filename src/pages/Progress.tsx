import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Target, TrendingUp, TrendingDown, Clock, Calendar, Download, Share2, Lightbulb, Award, CheckCircle2, AlertCircle, Brain } from "lucide-react";
import { curriculum } from "@/data/curriculum";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, LineChart, Line, CartesianGrid, Legend, Cell } from "recharts";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

interface SubjectPerformance {
  subjectId: string;
  subjectName: string;
  targetGrade: number;
  predictedGrade: number;
  currentProgress: number;
  weakTopics: string[];
  strongTopics: string[];
  averageScore: number;
}

interface TopicStrength {
  topic: string;
  score: number;
  attempts: number;
  isWeak: boolean;
}

interface WeeklyPlan {
  day: string;
  subject: string;
  topic: string;
  duration: number;
  resource: string;
}

interface StudyInsight {
  date: string;
  hours: number;
  accuracy: number;
}

const ProgressPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPerformance[]>([]);
  const [topicStrengths, setTopicStrengths] = useState<TopicStrength[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan[]>([]);
  const [studyInsights, setStudyInsights] = useState<StudyInsight[]>([]);
  const [personalizedSummary, setPersonalizedSummary] = useState("");
  const [bestStudyTime, setBestStudyTime] = useState("");

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user]);

  const loadProgressData = async () => {
    try {
      setLoading(true);

      // Fetch predicted exam completions
      const { data: examCompletions, error: examError } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (examError) throw examError;

      // Fetch user subjects with target grades
      const { data: userSubjects, error: subjectsError } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user?.id);

      if (subjectsError) throw subjectsError;

      // Fetch weak topics
      const { data: weakTopicsData, error: weakError } = await supabase
        .from('weak_topics')
        .select('topics')
        .eq('user_id', user?.id)
        .single();

      if (weakError && weakError.code !== 'PGRST116') throw weakError;

      // Fetch topic mastery data
      const { data: topicMastery, error: masteryError } = await supabase
        .from('daily_topic_mastery')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (masteryError) throw masteryError;

      // Fetch session analytics for study insights
      const { data: sessions, error: sessionsError } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (sessionsError) throw sessionsError;

      // Process subject performance data
      const weakTopicsArray = (weakTopicsData?.topics && Array.isArray(weakTopicsData.topics)) ? weakTopicsData.topics : [];
      const subjectPerf = processSubjectPerformance(examCompletions || [], userSubjects || [], weakTopicsArray);
      setSubjectPerformance(subjectPerf);

      // Process topic strengths/weaknesses
      const topics = processTopicStrengths(topicMastery || [], weakTopicsArray);
      setTopicStrengths(topics);

      // Generate weekly improvement plan
      const plan = generateWeeklyPlan(subjectPerf, topics);
      setWeeklyPlan(plan);

      // Process study insights
      const insights = processStudyInsights(sessions || []);
      setStudyInsights(insights);

      // Calculate best study time
      const bestTime = calculateBestStudyTime(sessions || []);
      setBestStudyTime(bestTime);

      // Generate personalized summary
      const summary = generatePersonalizedSummary(subjectPerf, topics);
      setPersonalizedSummary(summary);

    } catch (error) {
      console.error('Error loading progress data:', error);
      toast.error("Failed to load progress data");
    } finally {
      setLoading(false);
    }
  };

  const gradeToNumber = (grade: string): number => {
    const gradeMap: { [key: string]: number } = { '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2, '1': 1, 'U': 0 };
    return gradeMap[grade] || 5;
  };

  const processSubjectPerformance = (exams: any[], userSubjects: any[], weakTopics: any[]): SubjectPerformance[] => {
    const subjectMap = new Map<string, any>();

    // Group exams by subject
    exams.forEach(exam => {
      if (!subjectMap.has(exam.subject_id)) {
        subjectMap.set(exam.subject_id, []);
      }
      subjectMap.get(exam.subject_id).push(exam);
    });

    const performance: SubjectPerformance[] = [];

    curriculum.forEach(subject => {
      const subjectExams = subjectMap.get(subject.id) || [];
      const userSubject = userSubjects.find(s => s.subject_name === subject.name);
      
      if (subjectExams.length > 0 || userSubject) {
        const avgGrade = subjectExams.length > 0
          ? subjectExams.reduce((sum, e) => sum + gradeToNumber(e.grade), 0) / subjectExams.length
          : 5;
        
        const targetGrade = userSubject ? gradeToNumber(userSubject.target_grade) : 7;
        const predictedGrade = Math.round(avgGrade);
        const currentProgress = Math.min(100, (predictedGrade / targetGrade) * 100);

      // Extract weak topics for this subject
        const subjectWeakTopics = (Array.isArray(weakTopics) ? weakTopics : [])
          .filter((wt: any) => {
            const topic = subject.topics.find(t => t.id === wt.topicId || t.name === wt.topic);
            return topic !== undefined;
          })
          .map((wt: any) => wt.topic || wt.topicId)
          .slice(0, 3);

        performance.push({
          subjectId: subject.id,
          subjectName: subject.name,
          targetGrade,
          predictedGrade,
          currentProgress,
          weakTopics: subjectWeakTopics,
          strongTopics: [],
          averageScore: avgGrade * 11 // Approximate percentage
        });
      }
    });

    return performance;
  };

  const processTopicStrengths = (mastery: any[], weakTopics: any[]): TopicStrength[] => {
    const topicMap = new Map<string, { total: number, count: number, attempts: number }>();

    mastery.forEach(m => {
      const key = `${m.subject_id}-${m.topic_id}`;
      if (!topicMap.has(key)) {
        topicMap.set(key, { total: 0, count: 0, attempts: 0 });
      }
      const data = topicMap.get(key)!;
      data.total += parseFloat(m.score);
      data.count += 1;
      data.attempts += 1;
    });

    const strengths: TopicStrength[] = [];
    
    topicMap.forEach((data, key) => {
      const [subjectId, topicId] = key.split('-');
      const subject = curriculum.find(s => s.id === subjectId);
      const topic = subject?.topics.find(t => t.id === topicId);
      
      if (topic) {
        const avgScore = data.total / data.count;
        const isWeak = weakTopics.some((wt: any) => 
          wt.topicId === topicId || wt.topic === topic.name
        );

        strengths.push({
          topic: topic.name,
          score: Math.round(avgScore),
          attempts: data.attempts,
          isWeak
        });
      }
    });

    return strengths.sort((a, b) => a.score - b.score);
  };

  const generateWeeklyPlan = (subjects: SubjectPerformance[], topics: TopicStrength[]): WeeklyPlan[] => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const plan: WeeklyPlan[] = [];

    // Focus on weak subjects and topics
    const weakSubjects = subjects
      .filter(s => s.predictedGrade < s.targetGrade)
      .sort((a, b) => (a.targetGrade - a.predictedGrade) - (b.targetGrade - b.predictedGrade));

    const weakTopics = topics.filter(t => t.isWeak).slice(0, 7);

    days.forEach((day, index) => {
      const subject = weakSubjects[index % weakSubjects.length];
      const topic = weakTopics[index] || { topic: 'General Review', score: 50 };
      
      if (subject) {
        plan.push({
          day,
          subject: subject.subjectName,
          topic: topic.topic,
          duration: 45 + (index % 2) * 15, // 45 or 60 minutes
          resource: topic.score < 40 ? 'Past Paper Questions' : topic.score < 60 ? 'Video Tutorial' : 'Practice Quiz'
        });
      }
    });

    return plan;
  };

  const processStudyInsights = (sessions: any[]): StudyInsight[] => {
    const last14Days = sessions.slice(0, 14).reverse();
    
    return last14Days.map(session => ({
      date: new Date(session.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      hours: (session.questions_attempted || 0) * 2 / 60, // Approximate hours
      accuracy: ((session.questions_correct || 0) / (session.questions_attempted || 1)) * 100
    }));
  };

  const calculateBestStudyTime = (sessions: any[]): string => {
    if (sessions.length === 0) return "7-9 PM";

    const hourMap = new Map<number, number>();
    
    sessions.forEach(session => {
      const hour = new Date(session.created_at).getHours();
      const accuracy = ((session.questions_correct || 0) / (session.questions_attempted || 1)) * 100;
      hourMap.set(hour, (hourMap.get(hour) || 0) + accuracy);
    });

    let bestHour = 19; // Default 7 PM
    let bestAccuracy = 0;

    hourMap.forEach((accuracy, hour) => {
      if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
        bestHour = hour;
      }
    });

    const endHour = (bestHour + 2) % 24;
    return `${bestHour}:00-${endHour}:00`;
  };

  const generatePersonalizedSummary = (subjects: SubjectPerformance[], topics: TopicStrength[]): string => {
    const strongSubjects = subjects.filter(s => s.predictedGrade >= s.targetGrade);
    const weakSubjects = subjects.filter(s => s.predictedGrade < s.targetGrade);
    const improvingFastest = subjects.sort((a, b) => b.averageScore - a.averageScore)[0];

    let summary = "";

    if (strongSubjects.length > 0) {
      summary += `Your strengths in ${strongSubjects[0].subjectName} show strong conceptual understanding. `;
    }

    if (weakSubjects.length > 0) {
      const gap = weakSubjects[0].targetGrade - weakSubjects[0].predictedGrade;
      summary += `Focus on ${weakSubjects[0].weakTopics.slice(0, 2).join(' and ')} in ${weakSubjects[0].subjectName} to reach Grade ${weakSubjects[0].targetGrade}. `;
    }

    if (improvingFastest) {
      summary += `You're improving fastest in ${improvingFastest.subjectName} — keep up the momentum!`;
    }

    return summary || "Keep practicing to build your personalized insights!";
  };

  const getGradeColor = (grade: number): string => {
    if (grade >= 7) return "from-emerald-500 to-green-600";
    if (grade >= 5) return "from-blue-500 to-cyan-600";
    if (grade >= 4) return "from-amber-500 to-orange-600";
    return "from-red-500 to-rose-600";
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 100) return "bg-emerald-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your progress data...</p>
        </div>
      </div>
    );
  }

  // Prepare radar chart data
  const radarData = subjectPerformance.slice(0, 6).map(s => ({
    subject: s.subjectName.slice(0, 10),
    target: s.targetGrade * 11,
    predicted: s.predictedGrade * 11,
    current: s.currentProgress
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  My Progress
                </h1>
                <p className="text-sm text-muted-foreground">Complete academic performance overview</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Progress
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* 1. Performance Overview */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Performance Overview</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="overflow-hidden border-primary/20">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle>Target vs Predicted Grades</CardTitle>
                <CardDescription>Visual comparison across all subjects</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {radarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" className="stroke-muted" />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Target Grade" dataKey="target" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <Radar name="Predicted Grade" dataKey="predicted" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.5} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Start practicing to see your performance radar
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subject Progress Cards */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>Your progress toward target grades</CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4 max-h-[350px] overflow-y-auto">
                {subjectPerformance.length > 0 ? subjectPerformance.map(subject => (
                  <div key={subject.subjectId} className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradeColor(subject.predictedGrade)} flex items-center justify-center text-white font-bold`}>
                          {subject.predictedGrade}
                        </div>
                        <div>
                          <h4 className="font-semibold">{subject.subjectName}</h4>
                          <p className="text-xs text-muted-foreground">
                            Target: Grade {subject.targetGrade}
                          </p>
                        </div>
                      </div>
                      <Badge variant={subject.currentProgress >= 100 ? "default" : "secondary"}>
                        {Math.round(subject.currentProgress)}%
                      </Badge>
                    </div>
                    <Progress value={subject.currentProgress} className={getProgressColor(subject.currentProgress)} />
                  </div>
                )) : (
                  <p className="text-center text-muted-foreground py-8">
                    Complete some predicted exams to see your progress
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 2. Strengths and Weaknesses */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Strengths & Weaknesses</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart - All Topics Ranked */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-red-500/10">
                <CardTitle>Topic Performance Ranking</CardTitle>
                <CardDescription>From weakest to strongest topics</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {topicStrengths.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topicStrengths.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="topic" type="category" width={120} className="text-xs" />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="score" radius={[0, 8, 8, 0]}>
                        {topicStrengths.slice(0, 10).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.score < 50 ? 'hsl(var(--destructive))' : entry.score < 70 ? 'hsl(var(--warning))' : 'hsl(var(--chart-2))'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Practice more topics to see your ranking
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Strong vs Weak Topics Panels */}
            <div className="space-y-4">
              {/* Strong Topics */}
              <Card className="border-emerald-500/30">
                <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-green-500/5 pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span>Strong Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {topicStrengths.filter(t => !t.isWeak && t.score >= 70).slice(0, 4).length > 0 ? (
                    topicStrengths.filter(t => !t.isWeak && t.score >= 70).slice(0, 4).map(topic => (
                      <div key={topic.topic} className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-sm font-medium">{topic.topic}</span>
                        <Badge className="bg-emerald-500">{topic.score}%</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Keep practicing to build strong topics
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Weak Topics */}
              <Card className="border-red-500/30">
                <CardHeader className="bg-gradient-to-r from-red-500/10 to-orange-500/5 pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>Weak Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-2">
                  {topicStrengths.filter(t => t.isWeak || t.score < 50).slice(0, 4).length > 0 ? (
                    topicStrengths.filter(t => t.isWeak || t.score < 50).slice(0, 4).map(topic => (
                      <div key={topic.topic} className="flex items-center justify-between p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex-1">
                          <span className="text-sm font-medium block">{topic.topic}</span>
                          <span className="text-xs text-muted-foreground">
                            💡 Try short 10-min recall sessions daily
                          </span>
                        </div>
                        <Badge variant="destructive">{topic.score}%</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No weak topics identified yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 3. Study Insights */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Study Insights</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Study Hours vs Performance Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                <CardTitle>Study Activity & Performance</CardTitle>
                <CardDescription>Daily study hours and accuracy trends</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {studyInsights.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={studyInsights}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis yAxisId="left" label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                      <YAxis yAxisId="right" orientation="right" label={{ value: 'Accuracy %', angle: 90, position: 'insideRight' }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="hours" stroke="hsl(var(--primary))" strokeWidth={2} name="Study Hours" />
                      <Line yAxisId="right" type="monotone" dataKey="accuracy" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Accuracy %" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                    Start studying to see your insights
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personalized Insights Cards */}
            <div className="space-y-4">
              <Card className="border-primary/20">
                <CardHeader className="pb-3 bg-gradient-to-br from-primary/10 to-primary/5">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <span>Peak Learning Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold text-primary mb-2">{bestStudyTime}</p>
                  <p className="text-xs text-muted-foreground">
                    You study best during this time based on focus patterns
                  </p>
                </CardContent>
              </Card>

              <Card className="border-chart-2/20">
                <CardHeader className="pb-3 bg-gradient-to-br from-chart-2/10 to-chart-2/5">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <Award className="h-5 w-5 text-chart-2" />
                    <span>Retention Rate</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold text-chart-2 mb-2">
                    {studyInsights.length > 0 ? Math.round(studyInsights.reduce((sum, s) => sum + s.accuracy, 0) / studyInsights.length) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Try revisiting notes within 24 hours for better memory consolidation
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-500/20">
                <CardHeader className="pb-3 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5">
                  <CardTitle className="text-base flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    <span>Consistency Tracker</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-2xl font-bold text-emerald-500 mb-2">
                    {studyInsights.filter(s => s.hours > 0).length}/7 days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Study sessions completed this week
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* 4. Weekly Improvement Plan */}
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Weekly Improvement Plan</h2>
          </div>

          <Card className="overflow-hidden border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
              <CardTitle>Your Optimized Study Plan</CardTitle>
              <CardDescription>
                {subjectPerformance.length > 0 
                  ? `Focus on these key areas to reach Grade ${subjectPerformance.filter(s => s.predictedGrade < s.targetGrade)[0]?.targetGrade || 7}`
                  : "AI-powered plan to help you improve"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {weeklyPlan.length > 0 ? (
                <div className="space-y-3">
                  {weeklyPlan.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-border hover:border-primary/50 transition-colors">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-24 text-sm font-semibold text-primary">
                          {plan.day}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{plan.subject}</h4>
                          <p className="text-sm text-muted-foreground">{plan.topic}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="whitespace-nowrap">
                          <Clock className="h-3 w-3 mr-1" />
                          {plan.duration} min
                        </Badge>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {plan.resource}
                        </Badge>
                        <Button size="sm" onClick={() => {
                          const subject = curriculum.find(s => s.name === plan.subject);
                          if (subject) navigate(`/subject/${subject.id}`);
                        }}>
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Complete some assessments to generate your personalized plan
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* 5. Personalized Summary */}
        <section className="space-y-4">
          <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-6 w-6 text-primary" />
                <span>Your Personalized Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-foreground/90">
                {personalizedSummary}
              </p>
              <div className="mt-6 flex items-center space-x-4">
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  <Target className="h-4 w-4 mr-2" />
                  View My Weak Topics
                </Button>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Start My Weekly Plan
                </Button>
                <Button variant="outline" onClick={() => navigate('/settings')}>
                  <Target className="h-4 w-4 mr-2" />
                  Update Target Grades
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default ProgressPage;
