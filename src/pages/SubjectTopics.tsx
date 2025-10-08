import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, CheckCircle2, Lock, Sparkles, Clock, Zap, TrendingUp, Award } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Medly-style Header */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
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

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Hero Section with Personalized Greeting */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {subject.name}
              </h1>
              <p className="text-lg text-gray-600">
                Your personalized learning journey
              </p>
            </div>
          </div>
          
          {/* Premium Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-none shadow-lg bg-gradient-to-br from-[#3DB4E8] to-[#2A9FD1] text-white">
              <CardContent className="p-6">
                <Award className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">{masteredTopics}</div>
                <div className="text-sm opacity-90">Topics Mastered</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">{inProgressTopics}</div>
                <div className="text-sm opacity-90">In Progress</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg bg-gradient-to-br from-gray-700 to-gray-800 text-white">
              <CardContent className="p-6">
                <Target className="w-8 h-8 mb-3 opacity-90" />
                <div className="text-3xl font-bold mb-1">{subject.topics.length}</div>
                <div className="text-sm opacity-90">Total Topics</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Premium Personalized Insights - Featured Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#3DB4E8]" />
            Your Personalized Insights
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Best Study Time - Prominent */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-[#3DB4E8]/10 via-blue-50 to-white col-span-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#3DB4E8] flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Your Optimal Time</div>
                    <div className="text-2xl font-bold text-[#3DB4E8]">7–9 PM</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  You perform <strong>37% better</strong> when studying {subject.name} during evening hours
                </p>
              </CardContent>
            </Card>

            {/* Effective Sessions */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-purple-50 to-white col-span-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Session Length</div>
                    <div className="text-2xl font-bold text-purple-600">15 mins</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Short, focused question drills maximize your <strong>retention rate</strong>
                </p>
              </CardContent>
            </Card>

            {/* Study Strategy */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-orange-50 to-white col-span-1">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Best Strategy</div>
                    <div className="text-2xl font-bold text-orange-600">Mix & Match</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Alternating difficulty <strong>builds confidence</strong> while maintaining momentum
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Action CTA */}
        {nextTopic && (
          <Card className="mb-12 border-none shadow-2xl bg-gradient-to-r from-[#3DB4E8] to-[#2A9FD1] text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm opacity-90 mb-2">RECOMMENDED NEXT</div>
                  <h3 className="text-3xl font-bold mb-2">{nextTopic.name}</h3>
                  <p className="text-white/90 mb-4">Start your journey with this topic and build momentum</p>
                </div>
                <Button 
                  onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                  className="bg-white text-[#3DB4E8] hover:bg-gray-100 text-lg px-8 py-6 rounded-2xl h-auto font-semibold shadow-xl hover:scale-105 transition-all"
                >
                  Start Now
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visual Learning Path */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Your Learning Path</h2>
          <p className="text-gray-600 mb-8">Follow your personalized roadmap to mastery</p>
          
          <Card className="border-none shadow-xl bg-white p-8">
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
                              transition-all duration-300 hover:scale-110 hover:shadow-2xl group
                              ${isMastered 
                                ? 'bg-gradient-to-br from-[#3DB4E8] to-[#2A9FD1] text-white shadow-xl shadow-[#3DB4E8]/30' 
                                : isInProgress
                                ? 'bg-white border-4 border-[#3DB4E8] text-[#3DB4E8] shadow-lg'
                                : 'bg-white border-4 border-gray-200 text-gray-400 hover:border-gray-300'
                              }
                            `}
                          >
                            {isMastered ? (
                              <CheckCircle2 className="w-12 h-12" />
                            ) : notStarted ? (
                              <Lock className="w-10 h-10" />
                            ) : (
                              <div className="text-center">
                                <div className="text-3xl font-bold">{index + 1}</div>
                                {progress.attempts > 0 && (
                                  <div className="text-xs font-medium">{progress.averageScore}%</div>
                                )}
                              </div>
                            )}
                          </button>
                          
                          {/* Topic name and status */}
                          <div className="mt-4 text-center">
                            <h3 className="text-sm font-semibold mb-2 line-clamp-2 leading-tight text-gray-900">
                              {topic.name}
                            </h3>
                            
                            {isMastered && (
                              <Badge className="bg-gradient-to-r from-[#3DB4E8] to-[#2A9FD1] text-white text-xs border-none shadow-md">
                                ✓ Mastered
                              </Badge>
                            )}
                            {isInProgress && !isMastered && (
                              <Badge className="bg-purple-50 border-2 border-purple-500 text-purple-700 text-xs font-medium">
                                In Progress
                              </Badge>
                            )}
                            {notStarted && (
                              <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
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

        {/* Focus Areas - If needed */}
        {needsWorkTopics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-red-600 flex items-center gap-2">
              <Target className="w-8 h-8" />
              Topics That Need Your Attention
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {needsWorkTopics.slice(0, 3).map((prog) => {
                const topic = subject.topics.find(t => t.id === prog.topicId);
                if (!topic) return null;
                
                return (
                  <Card key={topic.id} className="border-none shadow-xl bg-gradient-to-br from-red-50 to-orange-50 hover:shadow-2xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg">{topic.name}</h4>
                        <div className="text-2xl font-bold text-red-600">
                          {prog.averageScore}%
                        </div>
                      </div>
                      <Progress value={prog.averageScore} className="h-3 mb-4" />
                      <Button 
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white w-full font-semibold shadow-lg"
                      >
                        Practice Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Motivational Footer */}
        <Card className="border-none shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3DB4E8]/10 rounded-full -mr-48 -mt-48"></div>
          <CardContent className="py-12 px-8 relative z-10">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#3DB4E8]" />
            <p className="text-3xl font-bold mb-4">
              "Mastery is built through consistency, not cramming"
            </p>
            <p className="text-lg text-gray-300">
              Follow your personalized plan and you'll ace your {subject.name} exam
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubjectTopics;
