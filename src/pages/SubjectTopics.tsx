import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate } from "react-router-dom";
import { curriculum } from "@/data/curriculum";
import { ArrowLeft, BookOpen, Clock, TrendingUp, Target, Zap, Brain, Calendar, CheckCircle2, AlertCircle, Sparkles, Award } from "lucide-react";

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
  const inProgressTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 85).length;
  const needsWorkTopics = topicProgress.filter(p => p.attempts > 0 && p.averageScore < 60);
  const avgScore = topicProgress.length > 0 
    ? Math.round(topicProgress.reduce((sum, p) => sum + p.averageScore, 0) / topicProgress.length)
    : 0;

  // Find next recommended topic
  const nextTopic = needsWorkTopics.length > 0 
    ? subject.topics.find(t => t.id === needsWorkTopics[0].topicId)
    : subject.topics.find(t => !topicProgress.some(p => p.topicId === t.id));

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
          {/* Main Content Column */}
          <div className="space-y-6">
            {/* Hero Section - Subject Overview */}
            <Card className="border-t-4 border-t-[#3DB4E8] shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#3DB4E8]/5 to-transparent p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#3DB4E8]/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-[#3DB4E8]" />
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold mb-1">{subject.name}</h1>
                    <p className="text-muted-foreground text-sm">
                      Your personalized learning journey
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-[#3DB4E8]/10 text-[#3DB4E8] border-[#3DB4E8]/20">
                    <Target className="w-3 h-3 mr-1" />
                    Current: Building foundations
                  </Badge>
                  <Badge variant="secondary" className="bg-muted/50">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Confidence: Steady improvement
                  </Badge>
                  <Badge variant="secondary" className="bg-muted/50">
                    <Award className="w-3 h-3 mr-1" />
                    Target: Grade 8
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress to target</span>
                    <span className="font-medium text-[#3DB4E8]">{avgScore}%</span>
                  </div>
                  <Progress value={avgScore} className="h-2 bg-muted" />
                  <p className="text-xs text-muted-foreground mt-2">
                    You're {avgScore}% of the way to your target — stay consistent.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#3DB4E8]">{masteredTopics}</div>
                    <div className="text-xs text-muted-foreground">Mastered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{inProgressTopics}</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{subject.topics.length}</div>
                    <div className="text-xs text-muted-foreground">Total Topics</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Next Best Step - Primary CTA */}
            {nextTopic && (
              <Card className="border-[#3DB4E8]/30 bg-gradient-to-br from-[#3DB4E8]/5 to-transparent shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#3DB4E8] flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg">Next Best Step</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Next step for {subject.name}: Topic practice
                  </p>
                  <p className="font-medium mb-4">Focus: {nextTopic.name}</p>
                  <Button 
                    className="w-full bg-[#3DB4E8] hover:bg-[#3DB4E8]/90 text-white rounded-full"
                    onClick={() => navigate(`/practice/${subjectId}/${nextTopic.id}`)}
                  >
                    Start now
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    Follow this next step — your plan adjusts automatically
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Focus Areas */}
            {needsWorkTopics.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertCircle className="w-5 h-5 text-[#3DB4E8]" />
                    Priority Focus Areas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {needsWorkTopics.slice(0, 3).map((progress) => {
                    const topic = subject.topics.find(t => t.id === progress.topicId);
                    if (!topic) return null;
                    
                    return (
                      <div key={topic.id} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1">{topic.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Current score: {progress.averageScore}%
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                          >
                            Practice
                          </Button>
                        </div>
                        <Progress value={progress.averageScore} className="h-1.5" />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* All Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Topics at a Glance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {subject.topics.map((topic) => {
                    const progress = getTopicProgress(topic.id);
                    const isMastered = progress.averageScore >= 85;
                    const needsWork = progress.attempts > 0 && progress.averageScore < 60;
                    
                    return (
                      <div
                        key={topic.id}
                        className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigate(`/practice/${subjectId}/${topic.id}`)}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-semibold text-white ${
                            isMastered ? 'bg-[#3DB4E8]' : needsWork ? 'bg-orange-500' : 'bg-muted-foreground/50'
                          }`}>
                            {isMastered ? <CheckCircle2 className="w-4 h-4" /> : subject.topics.indexOf(topic) + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">{topic.name}</h4>
                            {progress.attempts > 0 ? (
                              <p className="text-xs text-muted-foreground">
                                {progress.averageScore}% average
                              </p>
                            ) : (
                              <p className="text-xs text-muted-foreground">Not started</p>
                            )}
                          </div>
                        </div>
                        
                        {progress.attempts > 0 && (
                          <Progress value={progress.averageScore} className="h-1.5 mb-2" />
                        )}
                        
                        {isMastered && (
                          <Badge className="bg-[#3DB4E8]/10 text-[#3DB4E8] border-[#3DB4E8]/20 text-xs">
                            Mastered
                          </Badge>
                        )}
                        {needsWork && (
                          <Badge variant="secondary" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">
                            Needs Work
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    if (nextTopic) {
                      navigate(`/practice/${subjectId}/${nextTopic.id}`);
                    }
                  }}
                >
                  View Next Recommended Topic →
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Our AI coach updates this daily based on your learning
                </p>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-[#3DB4E8]" />
                  How you learn best in {subject.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-[#3DB4E8] mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    You perform best when studying {subject.name} between 7–9 PM
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Zap className="w-4 h-4 text-[#3DB4E8] mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Short 15-min question drills work best for your memory
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Sparkles className="w-4 h-4 text-[#3DB4E8] mt-0.5 flex-shrink-0" />
                  <p className="text-muted-foreground">
                    Your confidence grows fastest when you alternate hard and easy questions
                  </p>
                </div>
                <Button variant="link" className="text-[#3DB4E8] p-0 h-auto text-sm">
                  Optimize my plan →
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Rhythm */}
            <Card className="bg-muted/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3DB4E8]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#3DB4E8]" />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Study Rhythm</h4>
                    <p className="text-xs text-muted-foreground">
                      You do your best {subject.name} work in the evening. We'll keep scheduling around that.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* This Week's Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="w-4 h-4 text-[#3DB4E8]" />
                  This Week's Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="font-medium mb-1">Revise weak areas</div>
                    <p className="text-xs text-muted-foreground">10 min micro-drill</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="font-medium mb-1">Practice 1 long question</div>
                    <p className="text-xs text-muted-foreground">Exam-style</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <div className="font-medium mb-1">Quick review</div>
                    <p className="text-xs text-muted-foreground">Key concepts</p>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Complete all to unlock next week's tasks
                </p>
              </CardContent>
            </Card>

            {/* Mindset Reminder */}
            <Card className="bg-[#3DB4E8]/5 border-[#3DB4E8]/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Sparkles className="w-6 h-6 text-[#3DB4E8] mx-auto mb-2" />
                  <p className="text-sm italic text-muted-foreground">
                    "Mastery is built through consistency, not cramming."
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Milestone */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#3DB4E8]/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-[#3DB4E8]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">Upcoming Milestone</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      Midterm exam in 18 days — your pace is perfect
                    </p>
                    <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="absolute inset-0 bg-[#3DB4E8] rounded-full" style={{ width: '70%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Motivation Boost */}
            <Card className="bg-gradient-to-br from-[#3DB4E8]/5 to-transparent border-[#3DB4E8]/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <p className="text-sm font-medium mb-1">You're ahead of schedule!</p>
                  <p className="text-xs text-muted-foreground">Keep that energy going</p>
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
