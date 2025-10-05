import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Home,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

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
  type: 'quiz' | 'flashcards' | 'notes' | 'exam';
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

const MyPlan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [subjectsProgress, setSubjectsProgress] = useState<SubjectProgress[]>([]);
  const [weeklyTasks, setWeeklyTasks] = useState<WeeklyTask[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
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
      // Load user subjects
      const { data: userSubjects, error: subjectsError } = await supabase
        .from('user_subjects')
        .select('*')
        .eq('user_id', user.id);

      if (subjectsError) throw subjectsError;

      // Load performance data
      const { data: performance, error: perfError } = await supabase
        .from('subject_performance')
        .select('*')
        .eq('user_id', user.id);

      if (perfError) throw perfError;

      // Load exam completions
      const { data: exams, error: examsError } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (examsError) throw examsError;

      const subjectsData = userSubjects?.map(subject => {
        const perf = performance?.find(p => p.subject_id === subject.subject_name);
        const recentExam = exams?.find(e => e.subject_id === subject.subject_name);
        
        const curriculumSubject = curriculum.find(s => 
          s.name.toLowerCase() === subject.subject_name.toLowerCase()
        );
        
        const totalTopics = curriculumSubject?.topics.length || 1;
        const topicsStudied = perf?.total_questions_answered ? 
          Math.min(Math.floor(perf.total_questions_answered / 10), totalTopics) : 0;

        const currentProgress = (topicsStudied / totalTopics) * 100;
        
        // Calculate weekly improvement
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
          accuracy: Math.round(perf?.accuracy_rate || 0),
          topicsStudied,
          totalTopics,
          weeklyImprovement: Math.round(weeklyImprovement * 10) / 10
        };
      }) || [];

      setSubjectsProgress(subjectsData);
      if (subjectsData.length > 0 && !selectedSubject) {
        setSelectedSubject(subjectsData[0].subjectId);
      }

      // Calculate overall stats
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
        .single();

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
        
        const topicsWithInfo = topicsArray.slice(0, 5).map((topicId: string) => {
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
        .limit(5);

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
    const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1; // Convert to 0=Monday

    const tasks: WeeklyTask[] = [];

    // Get weak topics for task generation
    const { data: weakData } = await supabase
      .from('weak_topics')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const weakTopicIds = Array.isArray(weakData?.topics) ? (weakData.topics as string[]) : [];
    const weakTopicDetails = weakTopicIds.slice(0, 7).map((topicId: string) => {
      for (const subject of curriculum) {
        const topic = subject.topics.find(t => t.id === topicId);
        if (topic) return { topicId, subjectId: subject.id, topicName: topic.name };
      }
      return null;
    }).filter(Boolean);

    // Generate tasks for each day
    days.forEach((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - currentDay + index);
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

      const weakTopic = weakTopicDetails[index % weakTopicDetails.length];
      
      let task: WeeklyTask;
      
      switch (index % 5) {
        case 0:
          task = {
            day,
            date: dateStr,
            task: weakTopic ? `Revise ${weakTopic.topicName}` : 'Practice questions',
            type: 'quiz',
            icon: BookOpen,
            subjectId: weakTopic?.subjectId || '',
            topicId: weakTopic?.topicId,
            completed: index < currentDay
          };
          break;
        case 1:
          task = {
            day,
            date: dateStr,
            task: weakTopic ? `Create flashcards for ${weakTopic.topicName}` : 'Make flashcards',
            type: 'flashcards',
            icon: Brain,
            subjectId: weakTopic?.subjectId || '',
            topicId: weakTopic?.topicId,
            completed: index < currentDay
          };
          break;
        case 2:
          task = {
            day,
            date: dateStr,
            task: 'Review smart notes',
            type: 'notes',
            icon: FileText,
            subjectId: weakTopic?.subjectId || '',
            completed: index < currentDay
          };
          break;
        case 3:
          task = {
            day,
            date: dateStr,
            task: weakTopic ? `Flashcard review: ${weakTopic.topicName}` : 'Review flashcards',
            type: 'flashcards',
            icon: Brain,
            subjectId: weakTopic?.subjectId || '',
            topicId: weakTopic?.topicId,
            completed: index < currentDay
          };
          break;
        case 4:
          task = {
            day,
            date: dateStr,
            task: 'Complete predicted exam',
            type: 'exam',
            icon: CheckCircle,
            subjectId: weakTopic?.subjectId || '',
            completed: index < currentDay
          };
          break;
        default:
          task = {
            day,
            date: dateStr,
            task: 'Practice questions',
            type: 'quiz',
            icon: BookOpen,
            subjectId: '',
            completed: index < currentDay
          };
      }

      tasks.push(task);
    });

    setWeeklyTasks(tasks);
  };

  const loadProgressOverTime = async () => {
    if (!user?.id) return;

    try {
      // Load last 4 weeks of data
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

      const { data: exams, error } = await supabase
        .from('predicted_exam_completions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', fourWeeksAgo.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;

      // Group by week
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

    switch (task.type) {
      case 'quiz':
        if (task.topicId) {
          navigate(`/practice/${task.subjectId}/${task.topicId}`);
        }
        break;
      case 'flashcards':
        navigate('/flashcards');
        break;
      case 'notes':
        navigate('/notebook');
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

  const selectedSubjectData = subjectsProgress.find(s => s.subjectId === selectedSubject);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your personalized plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <Home className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  My Plan
                </h1>
                <p className="text-sm text-muted-foreground">Your personalized revision journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6 pb-20">
        {/* Stats at a Glance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Average Score</span>
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{overallStats.avgScore}%</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">📊 Keep it up!</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Topics Studied</span>
                <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">{overallStats.topicsStudied}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">📚 Great progress</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Streak</span>
                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{streak} Days</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">🔥 Active</p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Predicted Grade</span>
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{overallStats.predictedGrade}</div>
                <div className="flex items-center gap-1 text-sm">
                  {getTrendIcon(overallStats.weeklyChange)}
                  <span className={overallStats.weeklyChange > 0 ? 'text-green-600' : overallStats.weeklyChange < 0 ? 'text-red-600' : 'text-muted-foreground'}>
                    {Math.abs(overallStats.weeklyChange)}
                  </span>
                </div>
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">this week</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subject Progress Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Overall Progress</CardTitle>
                <Select value={selectedSubject || undefined} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsProgress.map(subject => (
                      <SelectItem key={subject.subjectId} value={subject.subjectId}>
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {selectedSubjectData && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  {/* Progress Wheel */}
                  <div className="flex items-center justify-center">
                    <div className="relative w-64 h-64">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted/20"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${selectedSubjectData.currentProgress * 2.51} 251`}
                          transform="rotate(-90 50 50)"
                          className="transition-all duration-1000"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold">{selectedSubjectData.currentProgress}%</div>
                        <div className="text-sm text-muted-foreground">Complete</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Target Grade</span>
                      <Badge variant="outline" className="text-lg">{selectedSubjectData.targetGrade}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Predicted Grade</span>
                      <Badge className="text-lg">{selectedSubjectData.predictedGrade}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Accuracy</span>
                      <span className="text-lg font-semibold">{selectedSubjectData.accuracy}%</span>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Topics Mastered</span>
                      <span className="text-lg font-semibold">
                        {selectedSubjectData.topicsStudied} / {selectedSubjectData.totalTopics}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Improvement Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Improvement Plan
              </CardTitle>
              <p className="text-sm text-muted-foreground">AI-personalized schedule for the next 7 days</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
                        flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer
                        ${task.completed ? 'bg-muted/50 opacity-60' : 'bg-card hover:bg-muted/30 hover:border-primary'}
                        ${isToday ? 'border-primary shadow-lg' : 'border-border'}
                      `}
                    >
                      <div className={`
                        flex items-center justify-center w-12 h-12 rounded-full
                        ${task.completed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary/10'}
                      `}>
                        {task.completed ? (
                          <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                        ) : (
                          <Icon className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">📅 {task.day}</span>
                          <Badge variant="outline" className="text-xs">{task.date}</Badge>
                          {isToday && <Badge className="text-xs">Today</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{task.task}</p>
                      </div>
                      
                      {!task.completed && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weak and Strong Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Weak Topics */}
          <Card className="border-0 bg-gradient-to-br from-red-50/50 to-card dark:from-red-950/20 dark:to-card">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-400">Focus Areas</CardTitle>
              <p className="text-sm text-muted-foreground">Topics that need more practice</p>
            </CardHeader>
            <CardContent>
              {weakTopics.length > 0 ? (
                <div className="space-y-2">
                  {weakTopics.map((topic: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border border-red-200 dark:border-red-800/30 hover:border-red-400 dark:hover:border-red-600 transition-colors cursor-pointer"
                      onClick={() => navigate(`/practice/${topic.subjectId}/${topic.topicId}`)}
                    >
                      <div>
                        <div className="font-medium">{topic.topicName}</div>
                        <div className="text-xs text-muted-foreground">{topic.subjectName}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No weak topics identified - great job! 🎉</p>
              )}
            </CardContent>
          </Card>

          {/* Strong Topics */}
          <Card className="border-0 bg-gradient-to-br from-green-50/50 to-card dark:from-green-950/20 dark:to-card">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-400">Strong Areas</CardTitle>
              <p className="text-sm text-muted-foreground">Topics you've mastered</p>
            </CardHeader>
            <CardContent>
              {strongTopics.length > 0 ? (
                <div className="space-y-2">
                  {strongTopics.map((topic: any, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-card border border-green-200 dark:border-green-800/30"
                    >
                      <div>
                        <div className="font-medium">{topic.topicName}</div>
                        <div className="text-xs text-muted-foreground">{topic.subjectName}</div>
                      </div>
                      <Badge className="bg-green-600 dark:bg-green-700">{topic.score}%</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Keep practicing to build strong topics! 💪</p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Progress Over Time</CardTitle>
              <p className="text-sm text-muted-foreground">Track your improvement week by week</p>
            </CardHeader>
            <CardContent>
              {progressData.length > 0 ? (
                <div className="space-y-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={progressData}>
                      <defs>
                        <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: any, name: string) => {
                          if (name === 'accuracy') return [`${value}%`, '% Accuracy'];
                          if (name === 'topics') return [value, 'Topics Covered'];
                          if (name === 'xp') return [value, 'XP Earned'];
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

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">
                        {progressData[progressData.length - 1]?.accuracy || 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Latest Accuracy</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">
                        {progressData.reduce((sum, d) => sum + d.topics, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Topics</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">
                        {progressData.reduce((sum, d) => sum + d.xp, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">Total XP</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl font-bold text-primary">
                        {progressData[progressData.length - 1]?.grade || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">Current Grade</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Start practicing to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MyPlan;
