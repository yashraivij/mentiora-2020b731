import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { 
  ArrowLeft, BookOpen, Clock, TrendingUp, Target, Zap, Brain, 
  Calendar, CheckCircle2, AlertCircle, Sparkles, ArrowRight, 
  Trophy, Activity, Flame, Quote, Microscope, Calculator, Pen
} from "lucide-react";
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

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    if (user?.id) {
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        const subjectProgress = allProgress.filter((p: any) => p.subjectId === subjectId);
        setTopicProgress(subjectProgress);
      }
    }
  }, [user?.id, subjectId]);

  if (!subject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    );
  }

  const getTopicProgress = (topicId: string) => {
    const progress = topicProgress.find(p => p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  // Calculate insights
  const masteredTopics = topicProgress.filter(p => p.averageScore >= 85);
  const needsWorkTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 60);
  const inProgressTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore >= 60 && p.averageScore < 85);
  const totalAttempts = topicProgress.reduce((sum, p) => sum + p.attempts, 0);
  const avgScore = topicProgress.length > 0 
    ? Math.round(topicProgress.reduce((sum, p) => sum + p.averageScore, 0) / topicProgress.length)
    : 0;

  // Next best step
  const nextTopic = needsWorkTopics.length > 0 
    ? subject.topics.find(t => t.id === needsWorkTopics[0].topicId)
    : subject.topics.find(t => !topicProgress.find(p => p.topicId === t.id));

  // Calculate progress to target (assuming target is 85%)
  const targetGrade = 8;
  const currentProgress = Math.min(100, Math.round((avgScore / 85) * 100));

  // Determine stage and confidence
  const getStageLabel = () => {
    if (avgScore >= 75) return "Mastering exam technique";
    if (avgScore >= 60) return "Building confidence";
    if (totalAttempts > 5) return "Developing understanding";
    return "Getting started";
  };

  const getConfidenceLabel = () => {
    if (masteredTopics.length >= 5) return "Strong momentum";
    if (inProgressTopics.length >= 3) return "Steady improvement";
    return "Building foundations";
  };

  // Subject icon
  const getSubjectIcon = () => {
    const name = subject.name.toLowerCase();
    if (name.includes('biology') || name.includes('chemistry') || name.includes('physics')) {
      return <Microscope className="h-4 w-4" />;
    }
    if (name.includes('maths') || name.includes('mathematics')) {
      return <Calculator className="h-4 w-4" />;
    }
    return <Pen className="h-4 w-4" />;
  };

  // Determine topic status
  const getTopicStatus = (topicId: string) => {
    const progress = getTopicProgress(topicId);
    if (progress.attempts === 0) return { label: "Upcoming", color: "text-slate-500", bgColor: "bg-slate-50 dark:bg-slate-900" };
    if (progress.averageScore >= 85) return { label: "Strong understanding", color: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-950" };
    if (progress.averageScore >= 60) return { label: "Building confidence", color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950" };
    return { label: "Needs practice", color: "text-rose-600", bgColor: "bg-rose-50 dark:bg-rose-950" };
  };

  const [topicFilter, setTopicFilter] = useState<"all" | "strengths" | "needs-work" | "upcoming">("all");

  const getFilteredTopics = () => {
    if (topicFilter === "strengths") {
      return subject.topics.filter(t => {
        const p = getTopicProgress(t.id);
        return p.averageScore >= 85 && p.attempts > 0;
      });
    }
    if (topicFilter === "needs-work") {
      return subject.topics.filter(t => {
        const p = getTopicProgress(t.id);
        return p.averageScore < 60 && p.attempts > 0;
      });
    }
    if (topicFilter === "upcoming") {
      return subject.topics.filter(t => {
        const p = getTopicProgress(t.id);
        return p.attempts === 0;
      });
    }
    return subject.topics;
  };

  const filteredTopics = getFilteredTopics();

  // Calculate streak (mock data for demo)
  const currentStreak = Math.min(7, totalAttempts);
  const streakDays = Array.from({ length: 7 }, (_, i) => i < currentStreak);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-[#E7ECF5] dark:border-gray-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="hover:bg-[#F6F8FB] dark:hover:bg-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        {/* Hero Section - Subject Overview */}
        <Card className="mb-8 border-t-4 border-t-[#2E5BFF] shadow-sm rounded-2xl animate-fade-in">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 rounded-xl bg-[#EAF2FF] dark:bg-blue-950/30 text-[#2E5BFF]">
                {getSubjectIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-semibold mb-2 text-foreground">
                  Your journey in {subject.name}
                </h1>
                <p className="text-muted-foreground">
                  We're guiding you toward your target — one smart topic at a time.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-[#F6F8FB] dark:bg-gray-900 text-foreground border-0 rounded-full px-4 py-1">
                Current stage: {getStageLabel()}
              </Badge>
              <Badge variant="secondary" className="bg-[#F6F8FB] dark:bg-gray-900 text-foreground border-0 rounded-full px-4 py-1">
                Confidence: {getConfidenceLabel()}
              </Badge>
              <Badge className="bg-[#EAF2FF] dark:bg-blue-950/30 text-[#2E5BFF] border-0 rounded-full px-4 py-1">
                Target: Grade {targetGrade}
              </Badge>
            </div>

            <div className="mb-3">
              <div className="h-2 bg-[#F6F8FB] dark:bg-gray-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#5B8FFF] transition-all duration-500 rounded-full"
                  style={{ width: `${currentProgress}%` }}
                />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              You're now <span className="font-semibold text-[#2E5BFF]">{currentProgress}%</span> of the way to your target — stay consistent.
            </p>
          </CardContent>
        </Card>

        {/* Main Layout - 2 Column Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 - Progress by Topic */}
            <Card className="shadow-sm rounded-2xl animate-fade-in">
              <CardHeader className="border-b border-[#E7ECF5] dark:border-gray-800 bg-[#F6F8FB] dark:bg-gray-900 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Your Topics at a Glance</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={topicFilter === "all" ? "default" : "ghost"}
                      onClick={() => setTopicFilter("all")}
                      className="text-sm"
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={topicFilter === "strengths" ? "default" : "ghost"}
                      onClick={() => setTopicFilter("strengths")}
                      className="text-sm"
                    >
                      Strengths
                    </Button>
                    <Button
                      size="sm"
                      variant={topicFilter === "needs-work" ? "default" : "ghost"}
                      onClick={() => setTopicFilter("needs-work")}
                      className="text-sm"
                    >
                      Needs Work
                    </Button>
                    <Button
                      size="sm"
                      variant={topicFilter === "upcoming" ? "default" : "ghost"}
                      onClick={() => setTopicFilter("upcoming")}
                      className="text-sm"
                    >
                      Upcoming
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {filteredTopics.map((topic) => {
                    const progress = getTopicProgress(topic.id);
                    const status = getTopicStatus(topic.id);
                    return (
                      <Card 
                        key={topic.id}
                        className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group rounded-xl border-[#E7ECF5] dark:border-gray-800"
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-sm leading-tight flex-1 group-hover:text-[#2E5BFF] transition-colors">
                              {topic.name}
                            </h3>
                            {progress.averageScore >= 85 && progress.attempts > 0 && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 ml-2" />
                            )}
                            {progress.averageScore < 60 && progress.attempts > 0 && (
                              <Zap className="h-4 w-4 text-amber-500 flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className={`text-xs ${status.color} mb-2`}>{status.label}</p>
                          {progress.attempts > 0 && (
                            <div className="space-y-1">
                              <Progress 
                                value={progress.averageScore} 
                                className="h-1.5"
                              />
                              <p className="text-xs text-muted-foreground">
                                {progress.averageScore}% • {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="text-center pt-4 border-t border-[#E7ECF5] dark:border-gray-800">
                  <Button 
                    onClick={() => nextTopic && navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                    className="bg-[#2E5BFF] hover:bg-[#2552E5] text-white rounded-full px-6"
                  >
                    View Next Recommended Topic
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Our AI coach updates this daily based on your learning.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section 2 - Key Insights */}
            <Card className="shadow-sm rounded-2xl bg-[#F6F8FB] dark:bg-gray-900 border-[#E7ECF5] dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  How you learn best in {subject.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    You perform best when studying {subject.name} between 7–9 PM.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Short 15-min question drills work best for your memory.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    You recall keywords better when you summarise aloud.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    Your confidence grows fastest when you alternate hard and easy questions.
                  </p>
                </div>
                <Button 
                  variant="link" 
                  className="text-[#2E5BFF] p-0 h-auto font-normal"
                >
                  Optimise my plan →
                </Button>
              </CardContent>
            </Card>

            {/* Section 3 - This Week's Smart Plan */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800">
              <CardHeader className="border-b border-[#E7ECF5] dark:border-gray-800">
                <CardTitle className="text-xl font-semibold">This Week's Smart Plan</CardTitle>
                <CardDescription>
                  These tasks adapt automatically based on your recent work.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                {needsWorkTopics.slice(0, 3).length > 0 ? (
                  needsWorkTopics.slice(0, 3).map((progress, index) => {
                    const topic = subject.topics.find(t => t.id === progress.topicId);
                    if (!topic) return null;
                    const tasks = [
                      { prefix: "Revise", suffix: "10 min micro-drill" },
                      { prefix: "Answer 1 long-form question", suffix: "Exam-style 6-marker" },
                      { prefix: "Flash review", suffix: "Quick 3-min recap" }
                    ];
                    const task = tasks[index % 3];
                    return (
                      <div 
                        key={topic.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-[#F6F8FB] dark:bg-gray-900 hover:shadow-sm transition-all cursor-pointer group"
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-[#2E5BFF] text-white flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm group-hover:text-[#2E5BFF] transition-colors">
                              {task.prefix}: {topic.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{task.suffix}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#2E5BFF] transition-colors" />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Complete some topics to generate your personalized plan</p>
                  </div>
                )}
                <p className="text-center text-xs text-muted-foreground pt-4 border-t border-[#E7ECF5] dark:border-gray-800">
                  Complete all to unlock next week's tasks.
                </p>
                <Button 
                  className="w-full bg-[#2E5BFF] hover:bg-[#2552E5] text-white rounded-full mt-4"
                  onClick={() => nextTopic && navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                >
                  Start today's task
                </Button>
              </CardContent>
            </Card>

            {/* Section 4 - Confidence & Consistency */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800">
              <CardHeader className="border-b border-[#E7ECF5] dark:border-gray-800">
                <CardTitle className="text-xl font-semibold">Your Momentum</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Streak */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="h-6 w-6 text-orange-500" />
                      <span className="text-3xl font-bold text-foreground">{currentStreak}-day streak</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      You've studied {subject.name} {currentStreak} days in a row.
                    </p>
                    <div className="flex gap-1 mb-3">
                      {streakDays.map((filled, i) => (
                        <div 
                          key={i}
                          className={`w-8 h-8 rounded-full ${filled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-800'}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Consistency = higher marks. Keep the streak alive.
                    </p>
                  </div>

                  {/* Confidence Meter */}
                  <div>
                    <h4 className="font-semibold mb-4 text-foreground">Confidence Levels</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">Knowledge</span>
                          <span className="text-sm text-muted-foreground">{Math.min(100, avgScore + 10)}%</span>
                        </div>
                        <div className="h-2 bg-[#F6F8FB] dark:bg-gray-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#5B8FFF] rounded-full"
                            style={{ width: `${Math.min(100, avgScore + 10)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">Exam skill</span>
                          <span className="text-sm text-muted-foreground">{Math.min(100, avgScore)}%</span>
                        </div>
                        <div className="h-2 bg-[#F6F8FB] dark:bg-gray-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#5B8FFF] rounded-full"
                            style={{ width: `${Math.min(100, avgScore)}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-foreground">Timing</span>
                          <span className="text-sm text-muted-foreground">{Math.min(100, avgScore + 5)}%</span>
                        </div>
                        <div className="h-2 bg-[#F6F8FB] dark:bg-gray-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2E5BFF] to-[#5B8FFF] rounded-full"
                            style={{ width: `${Math.min(100, avgScore + 5)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Confidence is built, not given. You're building it daily.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 - Next Best Step */}
            {nextTopic && (
              <Card className="shadow-sm rounded-2xl border-t-4 border-t-[#2E5BFF] border-[#E7ECF5] dark:border-gray-800 bg-gradient-to-br from-[#EAF2FF] to-white dark:from-blue-950/10 dark:to-gray-950">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#2E5BFF] text-white">
                      <Target className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">
                        Next Best Step
                      </h3>
                      <p className="text-foreground mb-1">
                        Next step for {subject.name}: 10-min topic quiz
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Focus: {nextTopic.name}
                      </p>
                      <Button 
                        onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                        className="w-full md:w-auto bg-[#2E5BFF] hover:bg-[#2552E5] text-white rounded-full px-8"
                      >
                        Start now
                      </Button>
                      <p className="text-xs text-muted-foreground mt-3">
                        Follow this next step — your plan adjusts automatically.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Study Rhythm */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#EAF2FF] dark:bg-blue-950/30">
                    <Clock className="h-5 w-5 text-[#2E5BFF]" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Study Rhythm</h4>
                    <p className="text-sm text-muted-foreground">
                      You do your best {subject.name} work in the evening. We'll keep scheduling around that.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mindset Reminder */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800 bg-[#F6F8FB] dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Quote className="h-5 w-5 text-[#2E5BFF] flex-shrink-0 mt-0.5" />
                  <p className="text-sm italic text-foreground">
                    "Mastery is built through consistency, not cramming."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Milestone */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-[#E7ECF5] dark:border-gray-800">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="#2E5BFF"
                          strokeWidth="4"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 28 * (currentProgress / 100)} ${2 * Math.PI * 28}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-foreground">{currentProgress}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Upcoming Milestone</h4>
                    <p className="text-sm text-muted-foreground">
                      Midterm exam in 18 days — your pace is perfect.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motivation Boost */}
            <Card className="shadow-sm rounded-2xl border-[#E7ECF5] dark:border-gray-800 bg-gradient-to-br from-[#EAF2FF] to-white dark:from-blue-950/10 dark:to-gray-950">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h4 className="font-semibold mb-2 text-foreground">Motivation Boost</h4>
                    <p className="text-sm text-foreground">
                      You're ahead of schedule — keep that energy!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-t border-[#E7ECF5] dark:border-gray-800">
        <Button 
          onClick={() => nextTopic && navigate(`/practice/${subjectId}/${nextTopic.id}`)}
          className="w-full bg-[#2E5BFF] hover:bg-[#2552E5] text-white rounded-full"
        >
          Start next task
        </Button>
      </div>
    </div>
  );
};

export default SubjectTopics;
