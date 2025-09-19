import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
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
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${getSubjectColor(subject.id)}`}></div>
                <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Subject Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Total Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{subject.topics.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {topicProgress.filter(p => p.averageScore >= 85).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {topicProgress.filter(p => p.attempts > 0 && p.averageScore < 85).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Learning Path */}
        <div className="bg-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Learning Path</h2>
          <div className="relative overflow-x-auto">
            <div className="flex items-start pb-32" style={{ minWidth: `${(subject.topics.length + 1) * 200}px` }}>
              {/* SVG for curved connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {subject.topics.map((_, index) => {
                  if (index === subject.topics.length - 1) return null;
                  
                  const startX = 200 * index + 150;
                  const endX = 200 * (index + 1) + 50;
                  const startY = index % 2 === 0 ? 60 : 140;
                  const endY = (index + 1) % 2 === 0 ? 60 : 140;
                  const midX = (startX + endX) / 2;
                  
                  return (
                    <path
                      key={index}
                      d={`M ${startX} ${startY} Q ${midX} ${startY > endY ? startY - 40 : startY + 40} ${endX} ${endY}`}
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      className="text-border"
                      opacity="0.5"
                    />
                  );
                })}
                
                {/* Line to final exam node */}
                {subject.topics.length > 0 && (
                  <path
                    d={`M ${200 * (subject.topics.length - 1) + 150} ${(subject.topics.length - 1) % 2 === 0 ? 60 : 140} Q ${200 * subject.topics.length + 50} 100 ${200 * subject.topics.length + 100} 100`}
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-purple-400"
                    opacity="0.7"
                  />
                )}
              </svg>

              {/* Topic nodes */}
              {subject.topics.map((topic, index) => {
                const progress = getTopicProgress(topic.id);
                const isNew = progress.attempts === 0;
                const isMastered = progress.averageScore >= 85;
                const needsWork = progress.attempts > 0 && progress.averageScore < 60;
                
                // Alternating high/low positions for swinging effect
                const isHigh = index % 2 === 0;
                const topPosition = isHigh ? 'top-4' : 'top-20';
                
                return (
                  <div key={topic.id} className={`absolute ${topPosition}`} style={{ left: `${200 * index + 50}px`, zIndex: 10 }}>
                    <div className="flex flex-col items-center">
                      {/* Topic circle */}
                      <div 
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg border-4 border-white ${
                          isMastered ? 'bg-green-500 hover:bg-green-600' :
                          needsWork ? 'bg-orange-500 hover:bg-orange-600' :
                          'bg-blue-500 hover:bg-blue-600'
                        }`}
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      >
                        {index + 1}
                      </div>
                      
                      {/* Topic name */}
                      <div className="mt-3 text-center max-w-[120px]">
                        <h3 className="text-sm font-medium leading-tight mb-1">{topic.name}</h3>
                        
                        {/* Year badges */}
                        <div className="flex flex-wrap justify-center gap-1 mb-2">
                          {subjectId === 'physics' && getPhysicsTopicYear(topic.name) && (
                            <Badge className={`text-xs ${getPhysicsTopicYear(topic.name) === 'Year 10' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                              {getPhysicsTopicYear(topic.name)}
                            </Badge>
                          )}
                          {subjectId === 'maths' && getMathsTopicYears(topic.name).map((year, yearIndex) => (
                            <Badge key={yearIndex} className={`text-xs ${year === 'Year 10' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                              {year}
                            </Badge>
                          ))}
                          {subjectId === 'geography' && getGeographyTopicYear(topic.name) && (
                            <Badge className={`text-xs ${getGeographyTopicYear(topic.name) === 'Year 10' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                              {getGeographyTopicYear(topic.name)}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Progress indicator */}
                        {progress.attempts > 0 && (
                          <div className="text-xs text-muted-foreground mb-1">
                            {progress.averageScore}% avg
                          </div>
                        )}
                        
                        {/* Status badge */}
                        {isMastered && <Badge className="bg-green-500 text-xs mb-2">Mastered</Badge>}
                        {needsWork && <Badge variant="destructive" className="text-xs mb-2">Needs Work</Badge>}
                        {isNew && <Badge variant="outline" className="text-xs mb-2">New</Badge>}
                        
                        {/* Practice button */}
                        <Button 
                          size="sm" 
                          className="text-xs px-3 py-1"
                          onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        >
                          {isNew ? 'Start' : 'Practice'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 2026 Exam Final Node */}
              <div className="absolute top-12" style={{ left: `${200 * subject.topics.length + 50}px`, zIndex: 10 }}>
                <div className="flex flex-col items-center">
                  {/* Special exam circle */}
                  <div 
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-4 border-yellow-400 shadow-xl animate-pulse"
                    onClick={() => navigate(`/predicted-exam/${subjectId}`)}
                  >
                    <span className="text-xs text-center leading-tight">2026<br/>EXAM</span>
                  </div>
                  
                  {/* Exam info */}
                  <div className="mt-3 text-center max-w-[140px]">
                    <h3 className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Final Challenge
                    </h3>
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs mb-2">
                      Predicted Exam
                    </Badge>
                    <Button 
                      size="sm" 
                      className="text-xs px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      onClick={() => navigate(`/predicted-exam/${subjectId}`)}
                    >
                      Take Exam
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
