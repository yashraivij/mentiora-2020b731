import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Flame, 
  Target, 
  Calendar,
  BookOpen,
  Brain,
  FileText,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  Sparkles,
  Crown,
  Lock,
  Zap,
  Star
} from "lucide-react";
import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

interface SubjectProgress {
  subjectId: string;
  subjectName: string;
  targetGrade: string;
  predictedGrade: string;
  currentProgress: number;
  accuracy: number;
  topicsStudied: number;
  totalTopics: number;
  weeklyImprovement: number;
}

interface WeeklyTask {
  day: string;
  date: string;
  task: string;
  description: string;
  type: 'quiz' | 'flashcards' | 'notes' | 'exam' | 'boost';
  icon: any;
  subjectId: string;
  topicId?: string;
  completed: boolean;
}

interface ProgressData {
  week: string;
  accuracy: number;
  topics: number;
  xp: number;
  grade: number;
}

interface RadarData {
  subject: string;
  score: number;
  fullMark: number;
}

export const PersonalizedPlanTab = () => {
  const { user, isPremium } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [radarData, setRadarData] = useState<RadarData[]>([]);
  const [streak, setStreak] = useState(0);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [strongTopics, setStrongTopics] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState({
    avgScore: 0,
    topicsStudied: 0,
    predictedGrade: "0",
    weeklyChange: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      loadSubjectsProgress(),
      loadWeakTopics(),
      loadStrongTopics(),
      loadStreak(),
      generateWeeklyTasks(),
      loadProgressOverTime()
    ]);
    setLoading(false);
  };

  const loadSubjectsProgress = async () => {
    if (!user?.id) return;

    try {
      const { data: userSubjects, error: subjectsError } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user.id);

      if (subjectsError) throw subjectsError;

      console.log('User subjects from database:', userSubjects);

      if (!userSubjects || userSubjects.length === 0) {
        console.log('No subjects found for user');
        setRadarData([]);
        return;
      }

      const { data: performance, error: perfError } = await supabase
        .from('subject_performance')
        .select('*')
        .eq('user_id', user.id);

      if (perfError) throw perfError;

      const { data: exams, error: examsError } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (examsError) throw examsError;

      const subjectsData = userSubjects.map(subject => {
        const perf = performance?.find(p => p.subject_id === subject.subject_name);
        const recentExam = exams?.find(e => e.subject_id === subject.subject_name);
        
        const curriculumSubject = curriculum.find(s => 
          s.name.toLowerCase() === subject.subject_name.toLowerCase()
        );
        
        const totalTopics = curriculumSubject?.topics.length || 1;
        const topicsStudied = perf?.total_questions_answered ? 
          Math.min(Math.floor(perf.total_questions_answered / 10), totalTopics) : 0;

        const currentProgress = (topicsStudied / totalTopics) * 100;
        
        // Calculate actual accuracy from exam completions
        const subjectExams = exams?.filter(e => e.subject_id === subject.subject_name) || [];
        let calculatedAccuracy = 0;
        
        if (subjectExams.length > 0) {
          const totalPercentage = subjectExams.reduce((sum, exam) => sum + (exam.percentage || 0), 0);
          calculatedAccuracy = Math.round(totalPercentage / subjectExams.length);
        } else if (perf?.accuracy_rate) {
          calculatedAccuracy = Math.round(perf.accuracy_rate);
        }
        
        const weekAgoExams = exams?.filter(e => 
          e.subject_id === subject.subject_name && 
          new Date(e.completed_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        );
        const avgRecentGrade = weekAgoExams?.length 
          ? weekAgoExams.reduce((sum, e) => sum + parseFloat(e.grade || '0'), 0) / weekAgoExams.length
          : 0;
        const predictedGradeNum = parseFloat(subject.predicted_grade || '0');
        const weeklyImprovement = avgRecentGrade - predictedGradeNum;

        return {
          subjectId: subject.subject_name,
          subjectName: subject.subject_name,
          targetGrade: subject.target_grade || '9',
          predictedGrade: recentExam?.grade || subject.predicted_grade || '5',
          currentProgress: Math.round(currentProgress),
          accuracy: calculatedAccuracy,
          topicsStudied,
          totalTopics,
          weeklyImprovement: Math.round(weeklyImprovement * 10) / 10
        };
      });

      setSubjectsProgress(subjectsData);

      // Create radar chart data - show ALL chosen subjects
      const radarChartData = subjectsData.map(s => {
        // Extract just the subject name without exam board for cleaner display
        const displayName = s.subjectName.split(' (')[0];
        return {
          subject: displayName.length > 15 ? displayName.substring(0, 15) + '...' : displayName,
          score: s.accuracy,
          fullMark: 100
        };
      });
      
      console.log('Radar chart data:', radarChartData);
      setRadarData(radarChartData);

      if (subjectsData.length > 0) {
        const avgScore = Math.round(
          subjectsData.reduce((sum, s) => sum + s.accuracy, 0) / subjectsData.length
        );
        const topicsStudied = subjectsData.reduce((sum, s) => sum + s.topicsStudied, 0);
        const avgPredictedGrade = (
          subjectsData.reduce((sum, s) => sum + parseFloat(s.predictedGrade), 0) / subjectsData.length
        ).toFixed(1);
        const avgWeeklyChange = Math.round(
          (subjectsData.reduce((sum, s) => sum + s.weeklyImprovement, 0) / subjectsData.length) * 10
        ) / 10;

        setOverallStats({
          avgScore,
          topicsStudied,
          predictedGrade: avgPredictedGrade,
          weeklyChange: avgWeeklyChange
        });
      }
    } catch (error) {
      console.error('Error loading subjects progress:', error);
    }
  };

  const loadWeakTopics = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data?.topics) {
        let topicsArray: string[] = [];
        if (Array.isArray(data.topics)) {
          topicsArray = data.topics as string[];
        } else if (typeof data.topics === 'string') {
          try {
            topicsArray = JSON.parse(data.topics);
          } catch {
            topicsArray = [];
          }
        }
        
        const topicsWithInfo = topicsArray.slice(0, 3).map((topicId: string) => {
          for (const subject of curriculum) {
            const topic = subject.topics.find(t => t.id === topicId);
            if (topic) {
              return {
                topicId,
                topicName: topic.name,
                subjectId: subject.id,
                subjectName: subject.name
              };
            }
          }
          return null;
        }).filter(Boolean);

        setWeakTopics(topicsWithInfo);
      }
    } catch (error) {
      console.error('Error loading weak topics:', error);
    }
  };

  const loadStrongTopics = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('daily_topic_mastery')
        .select('*')
        .eq('user_id', user.id)
        .gte('score', 85)
        .order('score', { ascending: false })
        .limit(3);

      if (error) throw error;

      const topicsWithInfo = data?.map(item => {
        for (const subject of curriculum) {
          const topic = subject.topics.find(t => t.id === item.topic_id);
          if (topic) {
            return {
              topicId: item.topic_id,
              topicName: topic.name,
              subjectId: subject.id,
              subjectName: subject.name,
              score: Math.round(item.score)
            };
          }
        }
        return null;
      }).filter(Boolean) || [];

      setStrongTopics(topicsWithInfo);
    } catch (error) {
      console.error('Error loading strong topics:', error);
    }
  };

  const loadStreak = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase.rpc('get_user_streak', {
        user_uuid: user.id
      });

      if (error) throw error;
      setStreak(data || 0);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  const generateWeeklyTasks = async () => {
    if (!user?.id) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const today = new Date();
    const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1;

    const tasks: WeeklyTask[] = [];

    const { data: weakData } = await supabase
      .from('weak_topics')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const weakTopicIds = Array.isArray(weakData?.topics) ? (weakData.topics as string[]) : [];
    const weakTopicDetails = weakTopicIds.slice(0, 7).map((topicId: string) => {
      for (const subject of curriculum) {
        const topic = subject.topics.find(t => t.id === topicId);
        if (topic) return { topicId, subjectId: subject.id, topicName: topic.name };
      }
      return null;
    }).filter(Boolean);

    const taskTemplates = [
      { type: 'quiz' as const, icon: BookOpen, task: 'Revise', description: '10 practice questions' },
      { type: 'flashcards' as const, icon: Brain, task: 'Create flashcards', description: 'Build your deck' },
      { type: 'notes' as const, icon: FileText, task: 'Review notes', description: 'Smart recap' },
      { type: 'flashcards' as const, icon: Brain, task: 'Flashcard review', description: 'Test yourself' },
      { type: 'exam' as const, icon: CheckCircle, task: 'Predicted exam', description: 'Full practice test' },
      { type: 'boost' as const, icon: Zap, task: 'Quick boost', description: '3-minute recap' },
      { type: 'quiz' as const, icon: Target, task: 'Weak area focus', description: 'Target improvement' },
    ];

    days.forEach((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + index);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      const weakTopic = weakTopicDetails[index % weakTopicDetails.length];
      const template = taskTemplates[index % taskTemplates.length];
      
      const taskName = weakTopic 
        ? `${template.task} ${weakTopic.topicName}`
        : template.task;

      tasks.push({
        day,
        date: dateStr,
        task: taskName,
        description: template.description,
        type: template.type,
        icon: template.icon,
        subjectId: weakTopic?.subjectId || '',
        topicId: weakTopic?.topicId,
        completed: index < currentDay
      });
    });

    setWeeklyTasks(tasks);
  };

  const loadProgressOverTime = async () => {
    if (!user?.id) return;

    try {
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const { data: exams, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', fourWeeksAgo.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;

      const weeklyData: { [key: string]: { accuracy: number[], grades: number[], count: number } } = {};
      
      exams?.forEach(exam => {
        const weekNum = Math.floor(
          (new Date(exam.completed_at).getTime() - fourWeeksAgo.getTime()) / (7 * 24 * 60 * 60 * 1000)
        );
        const weekKey = `Week ${weekNum + 1}`;
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { accuracy: [], grades: [], count: 0 };
        }
        
        weeklyData[weekKey].accuracy.push(exam.percentage);
        weeklyData[weekKey].grades.push(parseFloat(exam.grade));
        weeklyData[weekKey].count++;
      });

      const progressArray = Object.entries(weeklyData).map(([week, data]) => ({
        week,
        accuracy: Math.round(data.accuracy.reduce((a, b) => a + b, 0) / data.accuracy.length),
        topics: data.count,
        xp: data.count * 40,
        grade: Math.round((data.grades.reduce((a, b) => a + b, 0) / data.grades.length) * 10) / 10
      }));

      setProgressData(progressArray);
    } catch (error) {
      console.error('Error loading progress over time:', error);
    }
  };

  const handleTaskClick = (task: WeeklyTask) => {
    if (task.completed) return;

    if (!isPremium) {
      navigate('/pricing');
      return;
    }

    switch (task.type) {
      case 'quiz':
        if (task.topicId) {
          navigate(`/practice/${task.subjectId}/${task.topicId}`);
        }
        break;
      case 'flashcards':
        navigate('/dashboard?tab=flashcards');
        break;
      case 'notes':
        navigate('/dashboard?tab=notes');
        break;
      case 'exam':
        if (task.subjectId) {
          navigate(`/predicted-exam/${task.subjectId}`);
        }
        break;
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getConfidenceBadge = (accuracy: number) => {
    if (accuracy >= 80) return { label: "Mastered", color: "bg-green-500" };
    if (accuracy >= 60) return { label: "Improving", color: "bg-yellow-500" };
    return { label: "Needs Work", color: "bg-red-500" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/10 to-teal-50/10 dark:from-background dark:via-purple-950/10 dark:to-teal-950/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/10 to-gold-50/10 dark:from-background dark:via-purple-950/10 dark:to-amber-950/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-0 bg-gradient-to-br from-purple-100 to-amber-100 dark:from-purple-900/30 dark:to-amber-900/30 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Crown className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">🔒 Unlock Your Personalized Plan</h2>
              <p className="text-lg text-muted-foreground mb-6">
                See exactly where to improve — and how to move up a grade.
              </p>
              <div className="space-y-3 mb-8 text-left max-w-md mx-auto">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>AI-powered weekly study plans</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Personalized weak topic recommendations</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Predicted grade tracker</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Progress analytics over time</span>
                </div>
              </div>
              <Button
                onClick={() => navigate('/pricing')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-bold text-lg px-8 py-6"
              >
                Upgrade for £14.99/month
              </Button>
              <p className="text-sm text-muted-foreground mt-4">Get 7-day free trial</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 -m-8 p-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 dark:from-purple-400 dark:to-cyan-400 bg-clip-text text-transparent">Personalized Plan</h1>
            <p className="text-muted-foreground text-sm">Your AI-powered revision journey</p>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Stats at a Glance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:from-blue-500/20 dark:via-blue-500/10 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Average Score</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Target className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-1">{overallStats.avgScore}%</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{overallStats.avgScore >= 70 ? 'Excellent progress' : 'Keep practicing'}</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/20 dark:via-emerald-500/10 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Subjects</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-1">{subjectsProgress.length}</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{overallStats.topicsStudied} topics covered</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent dark:from-orange-500/20 dark:via-orange-500/10 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-amber-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Streak</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg group-hover:scale-110 transition-transform">
                  <Flame className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-1">{streak}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Days active</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent dark:from-purple-500/20 dark:via-purple-500/10 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Predicted Grade</span>
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{overallStats.predictedGrade}</div>
                {overallStats.weeklyChange !== 0 && (
                  <div className="flex items-center gap-1">
                    {getTrendIcon(overallStats.weeklyChange)}
                    <span className={`text-sm font-semibold ${overallStats.weeklyChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(overallStats.weeklyChange)}
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">This week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strengths & Weakness Radar Chart */}
        {radarData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-violet-500/10 via-card to-card dark:from-violet-500/10 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Strengths & Weakness Map</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Dynamic performance across all subjects</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--foreground))' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`${value}%`, 'Score']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-muted-foreground">Strong (80%+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-muted-foreground">Moderate (60-79%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-muted-foreground">Weak (&lt;60%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Weekly Improvement Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-indigo-500/10 via-card to-card dark:from-indigo-500/10 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">Weekly Improvement Plan</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">AI-personalized schedule — tap any task to begin</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyTasks.map((task, index) => {
                  const Icon = task.icon;
                  const isToday = new Date().getDay() === ((index + 1) % 7);
                  
                  return (
                    <motion.div
                      key={task.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleTaskClick(task)}
                      className={`
                        group flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer
                        ${task.completed 
                          ? 'bg-muted/30 opacity-60 border-border' 
                          : 'bg-card hover:bg-accent/50 hover:border-primary hover:shadow-sm border-border'
                        }
                        ${isToday ? 'ring-2 ring-primary' : ''}
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0
                        ${task.completed 
                          ? 'bg-green-500/20' 
                          : 'bg-gradient-to-br from-primary/20 to-cyan-500/20'
                        }
                      `}>
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Icon className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-sm text-foreground">{task.day}</span>
                          <Badge variant="outline" className="text-xs">{task.date}</Badge>
                          {isToday && (
                            <Badge className="text-xs bg-primary text-primary-foreground">Today</Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm text-foreground truncate">{task.task}</p>
                        <p className="text-xs text-muted-foreground">{task.description}</p>
                      </div>
                      
                      {!task.completed && (
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Fix Topics & Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Top 3 to Improve */}
          <Card className="border-0 bg-gradient-to-br from-red-500/15 via-orange-500/10 to-card dark:from-red-500/20 dark:via-orange-500/15 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-gradient-to-br from-red-500 to-orange-500">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">Top 3 to Improve</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Focus here before mocks</p>
            </CardHeader>
            <CardContent>
              {weakTopics.length > 0 ? (
                <div className="space-y-3">
                  {weakTopics.map((topic: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border hover:border-red-500 transition-all cursor-pointer hover:shadow-sm"
                      onClick={() => navigate(`/practice/${topic.subjectId}/${topic.topicId}`)}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{topic.topicName}</div>
                        <div className="text-xs text-muted-foreground">{topic.subjectName}</div>
                        <div className="text-xs text-red-500 mt-1">
                          Revise this next to boost your grade
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      if (weakTopics.length > 0) {
                        const firstTopic = weakTopics[0];
                        navigate(`/practice/${firstTopic.subjectId}/${firstTopic.topicId}`);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Improve My Weaknesses
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">No weak areas identified</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mastered Topics */}
          <Card className="border-0 bg-gradient-to-br from-green-500/15 via-emerald-500/10 to-card dark:from-green-500/20 dark:via-emerald-500/15 shadow-lg backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">Mastered Topics</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Areas of strength</p>
            </CardHeader>
            <CardContent>
              {strongTopics.length > 0 ? (
                <div className="space-y-3">
                  {strongTopics.map((topic: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-green-500/5 border border-green-200 dark:border-green-900/30"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">{topic.topicName}</div>
                        <div className="text-xs text-muted-foreground">{topic.subjectName}</div>
                        <Badge className="mt-2 bg-green-500 text-white text-xs">{topic.score}% accuracy</Badge>
                      </div>
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">Keep practicing to build mastery</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Over Time */}
        {progressData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-0 bg-gradient-to-br from-teal-500/10 via-card to-card dark:from-teal-500/10 shadow-lg backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Progress Over Time</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">Your improvement journey — week by week</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any, name: string) => {
                        if (name === 'accuracy') return [`${value}%`, '% Accuracy'];
                        if (name === 'grade') return [value, 'Predicted Grade'];
                        return [value, name];
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="accuracy"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorAccuracy)"
                    />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {progressData[progressData.length - 1]?.accuracy || 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Latest Accuracy</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30">
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {progressData.reduce((sum, d) => sum + d.topics, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Topics</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                      {progressData.reduce((sum, d) => sum + d.xp, 0)}
                    </div>
                    <div className="text-xs text-muted-foreground">Total XP</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30">
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {progressData[progressData.length - 1]?.grade || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Current Grade</div>
                  </div>
                </div>

                {progressData.length >= 2 && (
                  <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-300 dark:border-green-700">
                    <p className="text-sm font-semibold text-green-800 dark:text-green-200">
                      💡 Insight: Week 1: {progressData[0].accuracy}% → Week {progressData.length}: {progressData[progressData.length - 1].accuracy}% 
                      (up {progressData[progressData.length - 1].accuracy - progressData[0].accuracy}%)
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      Students who complete their plan improve by an average of 0.7 grades!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};
