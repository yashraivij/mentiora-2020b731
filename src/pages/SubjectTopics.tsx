import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, Target, CheckCircle2, Lock, Sparkles } from "lucide-react";

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
    <div className="min-h-screen bg-white">
      {/* Medly-style Header */}
      <header className="border-b border-gray-100 bg-white">
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
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            {subject.name}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your personalized revision plan to ace your exams
          </p>
          
          {/* Progress Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#3DB4E8] mb-1">{masteredTopics}</div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{inProgressTopics}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-400 mb-1">{subject.topics.length - masteredTopics - inProgressTopics}</div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>

          {/* CTA */}
          {nextTopic && (
            <div className="inline-block">
              <p className="text-sm text-gray-600 mb-3">Next recommended topic:</p>
              <Button 
                onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                className="bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white text-lg px-8 py-6 rounded-2xl h-auto font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Start: {nextTopic.name}
              </Button>
            </div>
          )}
        </div>

        {/* Visual Learning Path */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Your Learning Path</h2>
          
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
                            relative w-24 h-24 rounded-full flex items-center justify-center
                            transition-all duration-300 hover:scale-110 hover:shadow-2xl
                            ${isMastered 
                              ? 'bg-[#3DB4E8] text-white shadow-lg' 
                              : isInProgress
                              ? 'bg-[#3DB4E8]/20 border-4 border-[#3DB4E8] text-[#3DB4E8] shadow-md'
                              : 'bg-gray-100 border-4 border-gray-300 text-gray-500'
                            }
                          `}
                        >
                          {isMastered ? (
                            <CheckCircle2 className="w-10 h-10" />
                          ) : notStarted ? (
                            <Lock className="w-8 h-8" />
                          ) : (
                            <span className="text-2xl font-bold">{index + 1}</span>
                          )}
                        </button>
                        
                        {/* Topic name and status */}
                        <div className="mt-4 text-center">
                          <h3 className="text-sm font-medium mb-1 line-clamp-2 leading-tight">
                            {topic.name}
                          </h3>
                          
                          {progress.attempts > 0 && (
                            <p className="text-xs text-gray-500 mb-2">
                              {progress.averageScore}%
                            </p>
                          )}
                          
                          {isMastered && (
                            <Badge className="bg-[#3DB4E8] text-white text-xs">
                              Mastered
                            </Badge>
                          )}
                          {isInProgress && !isMastered && (
                            <Badge variant="outline" className="border-[#3DB4E8] text-[#3DB4E8] text-xs">
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
        </div>

        {/* Personalized Insights */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Focus Areas */}
          {needsWorkTopics.length > 0 && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Focus on these first</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {needsWorkTopics.slice(0, 3).map((prog) => {
                  const topic = subject.topics.find(t => t.id === prog.topicId);
                  if (!topic) return null;
                  
                  return (
                    <div key={topic.id} className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{topic.name}</h4>
                        <span className="text-sm text-orange-600 font-medium">
                          {prog.averageScore}%
                        </span>
                      </div>
                      <Progress value={prog.averageScore} className="h-2 mb-3" />
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        className="bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white w-full"
                      >
                        Practice now
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Study Tips */}
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#3DB4E8]" />
                Study tips for you
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="text-sm">
                  📚 <strong>Your best time:</strong> You perform best when studying {subject.name} between 7–9 PM
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="text-sm">
                  ⚡ <strong>Effective sessions:</strong> Short 15-min question drills work best for your memory
                </p>
              </div>
              <div className="p-4 rounded-xl bg-blue-50">
                <p className="text-sm">
                  🎯 <strong>Build confidence:</strong> Alternate between hard and easy questions for steady growth
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Footer */}
        <div className="text-center py-12 bg-gradient-to-r from-[#3DB4E8]/5 to-transparent rounded-3xl">
          <p className="text-2xl font-medium text-gray-800 mb-2">
            "Mastery is built through consistency, not cramming"
          </p>
          <p className="text-gray-600">
            Follow your personalized plan and you'll ace your {subject.name} exam
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
