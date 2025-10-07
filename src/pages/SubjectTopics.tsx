import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp, Target, Zap, Brain, Calendar, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Trophy } from "lucide-react";

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

  // Calculate personalized insights
  const masteredTopics = topicProgress.filter(p => p.averageScore >= 85);
  const needsWorkTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 60);
  const inProgressTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore >= 60 && p.averageScore < 85);
  const totalAttempts = topicProgress.reduce((sum, p) => sum + p.attempts, 0);
  const avgScore = topicProgress.length > 0 
    ? Math.round(topicProgress.reduce((sum, p) => sum + p.averageScore, 0) / topicProgress.length)
    : 0;

  // Determine next best step
  const nextTopic = needsWorkTopics.length > 0 
    ? subject.topics.find(t => t.id === needsWorkTopics[0].topicId)
    : subject.topics.find(t => !topicProgress.find(p => p.topicId === t.id));

  // Learning style based on performance
  const learningStyle = avgScore >= 75 
    ? "You're excelling with consistent practice" 
    : totalAttempts > 10 
    ? "You're building momentum - keep going"
    : "Start with small, focused sessions";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#F0FBFF] to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Premium Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-[#E5F6FC]/60 dark:border-gray-800 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="hover:bg-[#F0FBFF] dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] flex items-center justify-center shadow-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                    {subject.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">Your personalized revision guide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Stats - Above the fold */}
        <div className="grid md:grid-cols-4 gap-4 animate-fade-in">
          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-[#3DB4E8]/10 to-[#5DD4FF]/10">
                  <Trophy className="h-5 w-5 text-[#3DB4E8]" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] bg-clip-text text-transparent">
                  {masteredTopics.length}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Mastered</p>
              <p className="text-xs text-muted-foreground">Topics you've conquered</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                  <Zap className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-3xl font-bold text-amber-500">
                  {inProgressTopics.length}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">In Progress</p>
              <p className="text-xs text-muted-foreground">Building your knowledge</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/10 to-red-500/10">
                  <Target className="h-5 w-5 text-rose-500" />
                </div>
                <span className="text-3xl font-bold text-rose-500">
                  {needsWorkTopics.length}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Focus Areas</p>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                </div>
                <span className="text-3xl font-bold text-emerald-500">
                  {avgScore}%
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">Avg Score</p>
              <p className="text-xs text-muted-foreground">Overall performance</p>
            </CardContent>
          </Card>
        </div>

        {/* What to do next - Prominent CTA */}
        {nextTopic && (
          <Card className="shadow-xl border-[#3DB4E8]/20 dark:border-gray-800 bg-gradient-to-br from-[#F0FBFF] via-white to-[#E5F6FC] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 animate-fade-in overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3DB4E8]/10 to-transparent rounded-full blur-3xl" />
            <CardContent className="p-8 relative">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] text-white border-0">
                      Recommended Next
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-foreground">
                    {nextTopic.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {needsWorkTopics.length > 0 
                      ? "This topic needs strengthening to boost your overall score"
                      : "Start here to expand your knowledge in this subject"
                    }
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                      className="bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#2EA3D7] hover:to-[#4CC3EE] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Start Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-[#3DB4E8] text-[#3DB4E8] hover:bg-[#F0FBFF] dark:border-gray-700 dark:text-[#5DD4FF]"
                    >
                      See All Topics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Focus Areas */}
            {needsWorkTopics.length > 0 && (
              <Card className="shadow-lg border-rose-500/20 dark:border-gray-800 animate-fade-in">
                <CardHeader className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950/20 dark:to-red-950/20 border-b border-rose-100 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 shadow-lg">
                        <AlertCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">Priority Focus Areas</CardTitle>
                        <CardDescription>Topics that need your attention this week</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {needsWorkTopics.slice(0, 3).map((progress) => {
                      const topic = subject.topics.find(t => t.id === progress.topicId);
                      if (!topic) return null;
                      return (
                        <div 
                          key={topic.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-rose-50/50 dark:from-gray-900 dark:to-rose-950/10 border border-rose-100 dark:border-gray-800 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{topic.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress value={progress.averageScore} className="h-2 flex-1 max-w-[200px]" />
                              <span className="text-sm font-medium text-muted-foreground">
                                {progress.averageScore}%
                              </span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                            className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white"
                          >
                            Practice
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Topics - Visual Learning Path */}
            <Card className="shadow-lg border-[#E5F6FC]/60 dark:border-gray-800">
              <CardHeader className="bg-gradient-to-br from-[#F0FBFF] to-white dark:from-gray-900 dark:to-gray-800 border-b border-[#E5F6FC] dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] shadow-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Complete Learning Path</CardTitle>
                    <CardDescription>All {subject.topics.length} topics in {subject.name}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="relative overflow-x-auto">
                  <div className="relative min-h-[300px] bg-gradient-to-r from-[#F0FBFF]/50 to-[#E5F6FC]/50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4" style={{ minWidth: `${subject.topics.length * 220}px` }}>
                    {/* SVG for curved connecting lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                      {subject.topics.map((_, index) => {
                        if (index === subject.topics.length - 1) return null;
                        
                        const startX = 220 * index + 110;
                        const endX = 220 * (index + 1) + 110;
                        const startY = index % 2 === 0 ? 80 : 160;
                        const endY = (index + 1) % 2 === 0 ? 80 : 160;
                        const midX = (startX + endX) / 2;
                        
                        return (
                          <path
                            key={index}
                            d={`M ${startX} ${startY} Q ${midX} ${startY > endY ? startY - 50 : startY + 50} ${endX} ${endY}`}
                            stroke="url(#pathGradient)"
                            strokeWidth="3"
                            fill="none"
                            opacity="0.4"
                            strokeDasharray="5,5"
                          />
                        );
                      })}
                      
                      <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" style={{ stopColor: "#3DB4E8", stopOpacity: 1 }} />
                          <stop offset="100%" style={{ stopColor: "#5DD4FF", stopOpacity: 1 }} />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Topic nodes */}
                    {subject.topics.map((topic, index) => {
                      const progress = getTopicProgress(topic.id);
                      const isMastered = progress.averageScore >= 85;
                      const needsWork = progress.attempts > 0 && progress.averageScore < 60;
                      
                      const isHigh = index % 2 === 0;
                      const topPosition = isHigh ? 40 : 120;
                      
                      return (
                        <div key={topic.id} className="absolute" style={{ left: `${220 * index + 60}px`, top: `${topPosition}px`, zIndex: 10 }}>
                          <div className="flex flex-col items-center">
                            <div 
                              className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl border-4 border-white dark:border-gray-800 ${
                                isMastered 
                                  ? 'bg-gradient-to-br from-emerald-500 to-green-500' 
                                  : needsWork 
                                  ? 'bg-gradient-to-br from-rose-500 to-red-500'
                                  : 'bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF]'
                              }`}
                              onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                            >
                              {isMastered ? (
                                <CheckCircle2 className="h-8 w-8" />
                              ) : (
                                <span className="text-xl">{index + 1}</span>
                              )}
                            </div>
                            
                            <div className="mt-3 text-center max-w-[140px]">
                              <h3 className="text-sm font-semibold leading-tight mb-2 text-foreground">{topic.name}</h3>
                              
                              {progress.attempts > 0 && (
                                <div className="mb-2">
                                  <Progress value={progress.averageScore} className="h-1.5" />
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {progress.averageScore}%
                                  </p>
                                </div>
                              )}
                              
                              {isMastered && <Badge className="bg-emerald-500 text-xs mb-2">Mastered</Badge>}
                              {needsWork && <Badge className="bg-rose-500 text-xs mb-2">Focus</Badge>}
                              
                              <Button 
                                size="sm" 
                                className={`text-xs ${
                                  isMastered 
                                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                                    : needsWork 
                                    ? 'bg-rose-500 hover:bg-rose-600'
                                    : 'bg-gradient-to-r from-[#3DB4E8] to-[#5DD4FF] hover:from-[#2EA3D7] hover:to-[#4CC3EE]'
                                } text-white`}
                                onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                              >
                                {progress.attempts === 0 ? 'Start' : 'Practice'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* How You Learn Best */}
            <Card className="shadow-lg border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                    <Brain className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">How You Learn Best</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{learningStyle}</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-foreground">Practice regularly</p>
                    <p className="text-xs text-muted-foreground">15-30 min daily sessions</p>
                  </div>
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-100 dark:border-gray-800">
                    <p className="text-sm font-medium text-foreground">Focus on weak areas</p>
                    <p className="text-xs text-muted-foreground">Master one topic at a time</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Week's Plan */}
            <Card className="shadow-lg border-[#E5F6FC]/60 dark:border-gray-800 bg-gradient-to-br from-white to-[#F0FBFF]/30 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#5DD4FF] shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">This Week's Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {needsWorkTopics.slice(0, 2).map((progress, idx) => {
                    const topic = subject.topics.find(t => t.id === progress.topicId);
                    if (!topic) return null;
                    return (
                      <div 
                        key={topic.id}
                        className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-[#E5F6FC] dark:border-gray-800 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-[#3DB4E8] text-white text-xs">
                            Day {idx + 1}
                          </Badge>
                          <span className="text-sm font-semibold text-foreground">{topic.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Boost from {progress.averageScore}% to 70%+</p>
                      </div>
                    );
                  })}
                  {masteredTopics.length > 0 && (
                    <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-100 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className="bg-emerald-500 text-white text-xs">
                          Review
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">Mastered topics</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Quick revision to maintain momentum</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Motivation Card */}
            <Card className="shadow-lg border-amber-500/20 dark:border-gray-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Keep Going!</h4>
                    <p className="text-sm text-muted-foreground">
                      {totalAttempts > 20 
                        ? "Your dedication is paying off. Every question brings you closer to mastery."
                        : "Small steps every day lead to big results. You've got this!"}
                    </p>
                  </div>
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
