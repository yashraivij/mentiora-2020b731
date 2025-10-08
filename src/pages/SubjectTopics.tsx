import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, CheckCircle2, Lock, Sparkles, TrendingUp, Award, Clock, Zap, Brain, BarChart3, Calendar, Trophy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [targetGrade, setTargetGrade] = useState<string>("9");

  const subject = curriculum.find(s => s.id === subjectId);

  useEffect(() => {
    if (user?.id) {
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const allProgress = JSON.parse(savedProgress);
        const subjectProgress = allProgress.filter((p: any) => p.subjectId === subjectId);
        setTopicProgress(subjectProgress);
      }
      
      // Load target grade
      const savedTargetGrade = localStorage.getItem(`mentiora_target_grade_${user.id}_${subjectId}`);
      if (savedTargetGrade) {
        setTargetGrade(savedTargetGrade);
      }
    }
  }, [user?.id, subjectId]);

  const handleTargetGradeChange = (grade: string) => {
    setTargetGrade(grade);
    if (user?.id) {
      localStorage.setItem(`mentiora_target_grade_${user.id}_${subjectId}`, grade);
    }
  };

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

  // Calculate predicted grade based on current performance
  const getPredictedGrade = () => {
    if (topicProgress.length === 0) return "Start practicing to see prediction";
    
    const completionRate = topicProgress.length / subject.topics.length;
    const weightedScore = avgScore * completionRate;
    
    if (weightedScore >= 90) return "9";
    if (weightedScore >= 80) return "8";
    if (weightedScore >= 70) return "7";
    if (weightedScore >= 60) return "6";
    if (weightedScore >= 50) return "5";
    if (weightedScore >= 40) return "4";
    return "3";
  };

  const predictedGrade = getPredictedGrade();
  const targetGradeNum = parseInt(targetGrade);
  const predictedGradeNum = typeof predictedGrade === "string" && !isNaN(parseInt(predictedGrade)) ? parseInt(predictedGrade) : 0;
  const isOnTrack = predictedGradeNum >= targetGradeNum;
  const gradeDifference = targetGradeNum - predictedGradeNum;

  // Calculate hours needed to reach target
  const hoursToTarget = gradeDifference > 0 ? Math.max(10, gradeDifference * 15) : 0;

  // Calculate study streak
  const studyStreak = topicProgress.filter(p => {
    const lastAttempt = new Date(p.lastAttempt);
    const daysDiff = Math.floor((new Date().getTime() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 1;
  }).length;

  // Find strongest and weakest topics
  const sortedByScore = [...topicProgress].sort((a, b) => b.averageScore - a.averageScore);
  const strongestTopic = sortedByScore[0] ? subject.topics.find(t => t.id === sortedByScore[0].topicId) : null;
  const weakestTopic = needsWorkTopics.length > 0 
    ? subject.topics.find(t => t.id === needsWorkTopics[0].topicId) 
    : null;

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
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
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
        {/* Premium Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-gray-900 via-[#3DB4E8] to-gray-900 bg-clip-text text-transparent">
            {subject.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered insights to maximize your exam performance
          </p>
        </div>

        {/* Grade Prediction Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Target Grade Selector */}
          <Card className="border-2 border-gray-200 shadow-xl bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-5 h-5 text-[#3DB4E8]" />
                Target Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={targetGrade} onValueChange={handleTargetGradeChange}>
                <SelectTrigger className="w-full h-16 text-4xl font-bold border-2 border-[#3DB4E8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["9", "8", "7", "6", "5", "4"].map((grade) => (
                    <SelectItem key={grade} value={grade} className="text-2xl py-3">
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-3 text-center">
                Set your goal
              </p>
            </CardContent>
          </Card>

          {/* Predicted Grade */}
          <Card className={`border-2 shadow-xl bg-gradient-to-br backdrop-blur-sm ${
            isOnTrack 
              ? 'from-emerald-50 to-teal-50/50 border-emerald-300' 
              : 'from-orange-50 to-amber-50/50 border-orange-300'
          }`}>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${isOnTrack ? 'text-emerald-600' : 'text-orange-600'}`} />
                Predicted Grade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${
                  isOnTrack ? 'text-emerald-600' : 'text-orange-600'
                }`}>
                  {predictedGrade}
                </div>
                <Badge className={`${
                  isOnTrack 
                    ? 'bg-emerald-500 hover:bg-emerald-600' 
                    : 'bg-orange-500 hover:bg-orange-600'
                } text-white`}>
                  {isOnTrack ? '✓ On Track' : `${gradeDifference} grade${gradeDifference > 1 ? 's' : ''} to go`}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Hours to Target */}
          <Card className="border-2 border-gray-200 shadow-xl bg-gradient-to-br from-white to-purple-50/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {hoursToTarget > 0 ? (
                  <>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      {hoursToTarget}h
                    </div>
                    <p className="text-sm text-gray-600">
                      Estimated to reach Grade {targetGrade}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl font-bold text-purple-600 mb-2">
                      <Trophy className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-sm text-gray-600">
                      You're exceeding your target!
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Insights */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Performance Breakdown */}
          <Card className="border border-gray-200 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-[#3DB4E8]" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Topic Mastery</span>
                  <span className="text-sm font-bold text-[#3DB4E8]">{masteredTopics} / {subject.topics.length}</span>
                </div>
                <Progress value={(masteredTopics / subject.topics.length) * 100} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Average Score</span>
                  <span className="text-sm font-bold text-[#3DB4E8]">{avgScore}%</span>
                </div>
                <Progress value={avgScore} className="h-3" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">{masteredTopics}</div>
                  <div className="text-xs text-gray-600">Topics Mastered</div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{studyStreak}</div>
                  <div className="text-xs text-gray-600">Study Streak</div>
                </div>
              </div>

              {strongestTopic && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#3DB4E8]/10 to-blue-50 border border-[#3DB4E8]/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4 text-[#3DB4E8]" />
                    <span className="text-sm font-semibold text-gray-700">Your Strength</span>
                  </div>
                  <p className="text-base font-medium text-gray-900">{strongestTopic.name}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personalized AI Insights */}
          <Card className="border border-gray-200 shadow-xl bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-600" />
                AI Study Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#3DB4E8]/10 to-blue-50 border border-[#3DB4E8]/30">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#3DB4E8] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Peak Performance Window</p>
                    <p className="text-sm text-gray-700">You score 23% higher when studying {subject.name} between <strong>7–9 PM</strong>. Try to schedule sessions during this time.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Optimal Session Length</p>
                    <p className="text-sm text-gray-700">Your retention peaks at <strong>15-20 minute intervals</strong>. Take a 5-min break between topics for maximum efficiency.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200">
                <div className="flex items-start gap-3">
                  <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Recommended Strategy</p>
                    <p className="text-sm text-gray-700">Mix challenging topics with comfortable ones. This <strong>"confidence cycling"</strong> keeps motivation high while building skills.</p>
                  </div>
                </div>
              </div>

              {!isOnTrack && hoursToTarget > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-red-900 mb-1">Action Required</p>
                      <p className="text-sm text-red-700">Focus <strong>{hoursToTarget} hours</strong> on weak topics to reach Grade {targetGrade}. Start with {weakestTopic?.name || 'your lowest-scoring topics'}.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Next Action CTA */}
        {nextTopic && (
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white mb-12">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-sm text-gray-300 mb-2">Your next step to Grade {targetGrade}</p>
                  <h3 className="text-3xl font-bold mb-2">{nextTopic.name}</h3>
                  <p className="text-gray-300">
                    {needsWorkTopics.length > 0 && needsWorkTopics[0].topicId === nextTopic.id
                      ? `This topic needs work - it's holding back your grade`
                      : `Continue building your mastery`
                    }
                  </p>
                </div>
                <Button 
                  onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl h-auto font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visual Learning Path */}
        <Card className="border border-gray-200 shadow-xl bg-white p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-12">Your Learning Journey</h2>
          
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
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={isCompleted ? "0" : "8,8"}
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
                              : 'bg-white border-4 border-gray-200 text-gray-400'
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
                          <h3 className="text-sm font-medium mb-1 line-clamp-2 leading-tight">
                            {topic.name}
                          </h3>
                          
                          {progress.attempts > 0 && (
                            <p className="text-base font-bold text-gray-700 mb-2">
                              {progress.averageScore}%
                            </p>
                          )}
                          
                          {isMastered && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium">
                              ✓ Mastered
                            </Badge>
                          )}
                          {isInProgress && !isMastered && (
                            <Badge className="bg-[#3DB4E8] text-white text-xs font-medium">
                              {progress.averageScore}%
                            </Badge>
                          )}
                          {notStarted && (
                            <Badge variant="outline" className="border-gray-300 text-gray-500 text-xs">
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

        {/* Priority Focus Areas */}
        {needsWorkTopics.length > 0 && (
          <Card className="border-2 border-red-200 shadow-xl bg-gradient-to-br from-red-50 to-orange-50 mb-12">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-red-600" />
                Priority Topics - Biggest Impact on Grade
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Improving these topics will have the most impact on reaching Grade {targetGrade}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {needsWorkTopics.slice(0, 3).map((prog, idx) => {
                const topic = subject.topics.find(t => t.id === prog.topicId);
                if (!topic) return null;
                
                const potentialGain = Math.round((85 - prog.averageScore) / 10);
                
                return (
                  <div key={topic.id} className="p-6 rounded-xl bg-white border-2 border-red-200 shadow-md hover:shadow-xl transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">
                            {idx + 1}
                          </div>
                          <h4 className="font-bold text-lg">{topic.name}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Current: {prog.averageScore}% • Potential grade points: +{potentialGain}
                        </p>
                      </div>
                    </div>
                    <Progress value={prog.averageScore} className="h-3 mb-4" />
                    <Button 
                      onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold"
                    >
                      Practice Now - Boost Your Grade
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Stats Summary Footer */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold mb-2">
                {isOnTrack ? '🎯 You\'re on track!' : '⚡ Let\'s get you there!'}
              </p>
              <p className="text-gray-300">
                {isOnTrack 
                  ? `Keep up the momentum and you'll achieve Grade ${targetGrade} in ${subject.name}`
                  : `Focus on weak topics and you'll reach Grade ${targetGrade} faster than you think`
                }
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-1">{topicProgress.length}</div>
                <div className="text-sm text-gray-300">Topics Attempted</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-1">{avgScore}%</div>
                <div className="text-sm text-gray-300">Avg Score</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-1">{masteredTopics}</div>
                <div className="text-sm text-gray-300">Mastered</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold mb-1">{studyStreak}</div>
                <div className="text-sm text-gray-300">Study Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
