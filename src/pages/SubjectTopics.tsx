import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp } from "lucide-react";

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

  const allowedGeographyTopics = [
    '1A: Coastal Landscapes and Processes',
    '1B: River Landscapes and Processes', 
    '1C: Glaciated Upland Landscapes and Processes',
    'Global Circulation of the Atmosphere',
    'Tropical Cyclones',
    'Extreme Weather in the UK',
    'Climate Change',
    'Ecosystems: Scale, Structure & Processes',
    'Tropical Rainforests',
    'Deciduous Woodlands (UK focus)',
    'Ecosystem Services',
    'Biodiversity Under Threat',
    'Sustainable Management of Ecosystems'
  ];

  const filteredTopics = subject.topics.filter(topic => {
    // For all geography subjects (case-insensitive), completely remove all exam-related content
    if (subjectId?.toLowerCase().includes('geography')) {
      const topicNameLower = topic.name.toLowerCase();
      const topicIdLower = topic.id.toLowerCase();
      
      // Block any topic with exam-related keywords
      const examKeywords = ['predicted', '2026', 'paper', 'exam', 'test', 'assessment'];
      const hasExamKeyword = examKeywords.some(keyword => 
        topicNameLower.includes(keyword) || topicIdLower.includes(keyword)
      );
      
      if (hasExamKeyword) {
        return false;
      }
      
      // For the main geography subject, only show topics in the allowed list
      if (subjectId === 'geography') {
        return allowedGeographyTopics.includes(topic.name);
      }
    }
    
    // For other subjects, filter out predicted exam topics
    if (topic.id === 'predicted-exam-2026' || 
        topic.name.toLowerCase().includes('predicted') ||
        topic.name.toLowerCase().includes('paper 1 exam')) {
      return false;
    }
    
    return true;
  });

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
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full ${getSubjectColor(subject.id)}`}></div>
                <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
              </div>
            </div>
            
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
              <div className="text-3xl font-bold">{filteredTopics.length}</div>
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
          <div className="relative overflow-x-auto min-h-[300px] bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-4">
            <div className="relative h-[250px]" style={{ minWidth: `${(filteredTopics.length + 1) * 220}px` }}>
              {/* SVG for curved connecting lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {filteredTopics.map((_, index) => {
                  if (index === filteredTopics.length - 1) return null;
                  
                  const startX = 220 * index + 110;
                  const endX = 220 * (index + 1) + 110;
                  const startY = index % 2 === 0 ? 80 : 160;
                  const endY = (index + 1) % 2 === 0 ? 80 : 160;
                  const midX = (startX + endX) / 2;
                  
                  return (
                    <path
                      key={index}
                      d={`M ${startX} ${startY} Q ${midX} ${startY > endY ? startY - 50 : startY + 50} ${endX} ${endY}`}
                      stroke="#3B82F6"
                      strokeWidth="4"
                      fill="none"
                      opacity="0.6"
                      strokeDasharray="5,5"
                    />
                  );
                })}
                
                {/* Line to final exam node - only show for non-geography subjects */}
                {filteredTopics.length > 0 && !subjectId?.toLowerCase().includes('geography') && (
                  <path
                    d={`M ${220 * (filteredTopics.length - 1) + 110} ${(filteredTopics.length - 1) % 2 === 0 ? 80 : 160} Q ${220 * filteredTopics.length + 50} 120 ${220 * filteredTopics.length + 110} 120`}
                    stroke="url(#examGradient)"
                    strokeWidth="5"
                    fill="none"
                    opacity="0.8"
                  />
                )}
                
                {/* Gradient definition for exam line */}
                <defs>
                  <linearGradient id="examGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#9333EA", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#EC4899", stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Topic nodes */}
              {filteredTopics.map((topic, index) => {
                const progress = getTopicProgress(topic.id);
                const isUnlocked = true; // All topics are always unlocked
                const isMastered = progress.averageScore >= 85;
                const needsWork = progress.attempts > 0 && progress.averageScore < 60;
                
                // Alternating high/low positions for swinging effect
                const isHigh = index % 2 === 0;
                const topPosition = isHigh ? 40 : 120; // Pixel values for better control
                
                return (
                  <div key={topic.id} className="absolute" style={{ left: `${220 * index + 60}px`, top: `${topPosition}px`, zIndex: 10 }}>
                    <div className="flex flex-col items-center">
                      {/* Topic circle */}
                      <div 
                        className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 shadow-xl border-4 border-white bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
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
                        {isUnlocked && !isMastered && !needsWork && <Badge className="bg-blue-500 text-xs mb-2">Unlocked</Badge>}
                        
                        {/* Practice button */}
                        <Button 
                          size="sm" 
                          className="text-xs px-3 py-1"
                          onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                        >
                          {progress.attempts === 0 ? 'Start' : 'Practice'}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* 2026 Exam Final Node - only show for non-geography subjects */}
              {!subjectId?.toLowerCase().includes('geography') && (
                <div className="absolute" style={{ left: `${220 * filteredTopics.length + 60}px`, top: '80px', zIndex: 10 }}>
                  <div className="flex flex-col items-center">
                    {/* Special exam circle */}
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 hover:scale-110 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-4 border-yellow-400 shadow-2xl animate-pulse"
                      onClick={() => navigate(`/predicted-exam/${subjectId}`)}
                    >
                      <span className="text-sm text-center leading-tight font-black">2026<br/>EXAM</span>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
