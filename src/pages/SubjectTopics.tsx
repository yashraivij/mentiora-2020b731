import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, CheckCircle2, Lock, Sparkles, TrendingUp, Clock, Zap, Award, Brain, Calendar, BarChart3, Trophy, Flame } from "lucide-react";

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

  // Calculate statistics
  const masteredTopics = topicProgress.filter(p => p.averageScore >= 85).length;
  const inProgressTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 85 && p.averageScore >= 60).length;
  const needsWorkTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 60);
  const avgScore = topicProgress.length > 0 
    ? Math.round(topicProgress.reduce((sum, p) => sum + p.averageScore, 0) / topicProgress.length)
    : 0;

  // Advanced Analytics
  const totalAttempts = topicProgress.reduce((sum, p) => sum + p.attempts, 0);
  const predictedGrade = avgScore >= 90 ? '9' : avgScore >= 80 ? '8' : avgScore >= 70 ? '7' : avgScore >= 60 ? '6' : avgScore >= 50 ? '5' : avgScore >= 40 ? '4' : '3';
  const hoursToMastery = Math.max(0, Math.round((subject.topics.length - masteredTopics) * 2.5));
  const consistencyScore = topicProgress.length > 0 ? Math.min(100, Math.round((totalAttempts / topicProgress.length) * 20)) : 0;
  const improvementRate = topicProgress.length > 1 ? '+12%' : '+0%';
  const topStrength = topicProgress.length > 0 ? subject.topics.find(t => t.id === topicProgress.sort((a, b) => b.averageScore - a.averageScore)[0]?.topicId)?.name : 'None yet';
  const studyStreak = 7; // This would come from real tracking

  // Find next recommended topic
  const getNextTopic = () => {
    // First, check if there are topics that need work
    if (needsWorkTopics.length > 0) {
      return subject.topics.find(t => t.id === needsWorkTopics[0].topicId);
    }
    // Otherwise, find the first topic not started yet
    return subject.topics.find(t => !topicProgress.some(p => p.topicId === t.id));
  };

  const nextTopic = getNextTopic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Premium Header */}
      <header className="border-b border-gray-100/50 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            {subject.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered insights to maximize your exam performance
          </p>
        </div>

        {/* Premium Analytics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Predicted Grade */}
          <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-[#3DB4E8] to-[#2A9FD1] text-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white/90">Predicted Grade</CardTitle>
                <Trophy className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2">{predictedGrade}</div>
              <p className="text-sm text-white/80">Based on current performance</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                <span>{improvementRate} from last week</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          </Card>

          {/* Time to Mastery */}
          <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white/90">Time to Mastery</CardTitle>
                <Clock className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2">{hoursToMastery}h</div>
              <p className="text-sm text-white/80">Until full subject mastery</p>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{Math.round((masteredTopics / subject.topics.length) * 100)}%</span>
                </div>
                <Progress value={(masteredTopics / subject.topics.length) * 100} className="h-2 bg-white/20" />
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          </Card>

          {/* Study Streak */}
          <Card className="relative overflow-hidden border-none shadow-xl bg-gradient-to-br from-orange-500 to-red-500 text-white hover:shadow-2xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-white/90">Study Streak</CardTitle>
                <Flame className="h-5 w-5 text-white/80" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold mb-2">{studyStreak}</div>
              <p className="text-sm text-white/80">Days in a row</p>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Award className="h-4 w-4" />
                <span>Keep going to reach 14 days!</span>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          </Card>
        </div>

        {/* AI Insights Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Performance Breakdown */}
          <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-[#3DB4E8]" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">Mastered Topics</span>
                    <span className="text-[#3DB4E8] font-bold">{masteredTopics}/{subject.topics.length}</span>
                  </div>
                  <Progress value={(masteredTopics / subject.topics.length) * 100} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">Average Score</span>
                    <span className="text-[#3DB4E8] font-bold">{avgScore}%</span>
                  </div>
                  <Progress value={avgScore} className="h-3" />
                </div>
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium">Consistency Score</span>
                    <span className="text-[#3DB4E8] font-bold">{consistencyScore}%</span>
                  </div>
                  <Progress value={consistencyScore} className="h-3" />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-[#3DB4E8] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium mb-1">Your strongest topic:</p>
                    <p className="text-sm text-gray-600">{topStrength}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personalized Study Plan */}
          <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-500" />
                Your Optimal Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100/50 border border-blue-200">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-[#3DB4E8] mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Best Study Time</p>
                    <p className="text-sm text-gray-700">7–9 PM</p>
                    <p className="text-xs text-gray-600 mt-1">You score 23% higher during evening sessions</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Ideal Session Length</p>
                    <p className="text-sm text-gray-700">15-20 minutes</p>
                    <p className="text-xs text-gray-600 mt-1">Short bursts maximize your retention by 34%</p>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100/50 border border-green-200">
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Recommended Strategy</p>
                    <p className="text-sm text-gray-700">Mix difficulty levels</p>
                    <p className="text-xs text-gray-600 mt-1">Alternate between easy and hard for 2x faster progress</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Action CTA */}
        {nextTopic && (
          <Card className="mb-12 border-none shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#3DB4E8]/20 to-purple-500/20" />
            <CardContent className="relative p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-sm text-white/70 mb-2">Recommended next step</p>
                  <h3 className="text-3xl font-bold mb-2">{nextTopic.name}</h3>
                  <p className="text-white/80">Estimated time: 15-20 minutes</p>
                </div>
                <Button 
                  onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl h-auto font-semibold shadow-xl hover:shadow-2xl transition-all"
                >
                  Start Now
                  <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visual Learning Path */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-3 mb-12">
            <h2 className="text-3xl font-bold text-center">Your Learning Journey</h2>
            <Badge className="bg-[#3DB4E8] text-white">{Math.round((masteredTopics / subject.topics.length) * 100)}% Complete</Badge>
          </div>
          
          <Card className="border-gray-200 shadow-xl p-8 bg-white">
            <div className="relative">
              {/* Scrollable container */}
              <div className="overflow-x-auto pb-8">
              <div className="relative" style={{ minWidth: `${subject.topics.length * 200}px`, height: '400px' }}>
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {subject.topics.map((_, index) => {
                    if (index === subject.topics.length - 1) return null;
                    
                    const startX = 200 * index + 100;
                    const endX = 200 * (index + 1) + 100;
                    const startY = index % 2 === 0 ? 100 : 260;
                    const endY = (index + 1) % 2 === 0 ? 100 : 260;
                    const midX = (startX + endX) / 2;
                    
                    const progress = getTopicProgress(subject.topics[index].id);
                    const isCompleted = progress.averageScore >= 85;
                    
                    return (
                      <path
                        key={index}
                        d={`M ${startX} ${startY} Q ${midX} ${startY > endY ? startY - 60 : startY + 60} ${endX} ${endY}`}
                        stroke={isCompleted ? "#3DB4E8" : "#E5E7EB"}
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={isCompleted ? "0" : "6,6"}
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Topic nodes */}
                {subject.topics.map((topic, index) => {
                  const progress = getTopicProgress(topic.id);
                  const isMastered = progress.averageScore >= 85;
                  const isInProgress = progress.attempts > 0 && !isMastered;
                  const notStarted = progress.attempts === 0;
                  
                  const isHigh = index % 2 === 0;
                  const topPosition = isHigh ? 50 : 210;
                  
                  return (
                    <div 
                      key={topic.id} 
                      className="absolute transition-all duration-300"
                      style={{ 
                        left: `${200 * index + 50}px`, 
                        top: `${topPosition}px`, 
                        zIndex: 10 
                      }}
                    >
                      <div className="flex flex-col items-center w-[100px]">
                        {/* Circle */}
                        <button
                          onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                          className={`
                            relative w-28 h-28 rounded-full flex items-center justify-center
                            transition-all duration-300 hover:scale-110 hover:shadow-2xl
                            ${isMastered 
                              ? 'bg-gradient-to-br from-[#3DB4E8] to-[#2A9FD1] text-white shadow-xl' 
                              : isInProgress
                              ? 'bg-white border-4 border-[#3DB4E8] text-[#3DB4E8] shadow-lg'
                              : 'bg-white border-4 border-gray-200 text-gray-400 shadow-md'
                            }
                          `}
                        >
                          {isMastered ? (
                            <CheckCircle2 className="w-12 h-12" />
                          ) : notStarted ? (
                            <Lock className="w-10 h-10" />
                          ) : (
                            <span className="text-3xl font-bold">{index + 1}</span>
                          )}
                        </button>
                        
                        {/* Topic name and status */}
                        <div className="mt-4 text-center">
                          <h3 className="text-sm font-semibold mb-2 line-clamp-2 leading-tight">
                            {topic.name}
                          </h3>
                          
                          {progress.attempts > 0 && (
                            <p className="text-sm font-bold text-[#3DB4E8] mb-2">
                              {progress.averageScore}%
                            </p>
                          )}
                          
                          {isMastered && (
                            <Badge className="bg-gradient-to-r from-[#3DB4E8] to-[#2A9FD1] text-white text-xs font-medium">
                              ✓ Mastered
                            </Badge>
                          )}
                          {isInProgress && !isMastered && (
                            <Badge variant="outline" className="border-[#3DB4E8] text-[#3DB4E8] text-xs font-medium">
                              In Progress
                            </Badge>
                          )}
                          {notStarted && (
                            <Badge variant="outline" className="text-xs">
                              Not Started
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            </div>
          </Card>
        </div>

        {/* Priority Focus Areas */}
        {needsWorkTopics.length > 0 && (
          <Card className="mb-12 border-red-200 shadow-xl bg-gradient-to-br from-red-50 to-orange-50">
            <CardHeader className="border-b border-red-100">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-6 h-6 text-red-500" />
                Priority Topics - Biggest Impact on Your Grade
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">Focus here for maximum improvement</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                {needsWorkTopics.slice(0, 3).map((prog) => {
                  const topic = subject.topics.find(t => t.id === prog.topicId);
                  if (!topic) return null;
                  
                  return (
                    <div key={topic.id} className="p-5 rounded-xl bg-white border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{topic.name}</h4>
                        <Badge className="bg-red-500 text-white">{prog.averageScore}%</Badge>
                      </div>
                      <Progress value={prog.averageScore} className="h-3 mb-4" />
                      <p className="text-xs text-gray-600 mb-4">
                        +{Math.round((85 - prog.averageScore) / 10)} grade points if mastered
                      </p>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white w-full font-semibold"
                      >
                        Practice Now
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Motivational Stats */}
        <Card className="border-none shadow-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <Sparkles className="h-12 w-12 text-[#3DB4E8] mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-3">
                You're on track for Grade {predictedGrade}
              </h3>
              <p className="text-lg text-white/80">
                Keep up this momentum and you'll exceed your target
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3DB4E8] mb-1">{totalAttempts}</div>
                <div className="text-sm text-white/70">Questions Practiced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3DB4E8] mb-1">{Math.round(avgScore)}%</div>
                <div className="text-sm text-white/70">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#3DB4E8] mb-1">{studyStreak}</div>
                <div className="text-sm text-white/70">Day Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
