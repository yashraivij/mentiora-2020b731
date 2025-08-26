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

const PremiumSubjectTopics = () => {
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
          <Button onClick={() => navigate('/premium-dashboard')}>
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
        topicName.toLowerCase().includes('changing economic world') ||
        topicName.toLowerCase().includes('resource management')) {
      return 'Year 11';
    }
    // Natural hazards and Climate change are Year 10
    return 'Year 10';
  };

  const masteredTopics = topicProgress.filter(p => p.averageScore >= 85).length;
  const inProgressTopics = topicProgress.filter(p => p.averageScore > 0 && p.averageScore < 85).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/premium-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{subject.name}</h1>
                <p className="text-sm text-muted-foreground">Choose a topic to practice</p>
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
              <CardTitle className="flex items-center text-blue-600">
                <BookOpen className="h-5 w-5 mr-2" />
                Total Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {subject.topics.length}
              </div>
              <p className="text-sm text-muted-foreground">Available to practice</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <TrendingUp className="h-5 w-5 mr-2" />
                Mastered
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {masteredTopics}
              </div>
              <p className="text-sm text-muted-foreground">85%+ average score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-600">
                <Clock className="h-5 w-5 mr-2" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {inProgressTopics}
              </div>
              <p className="text-sm text-muted-foreground">Need more practice</p>
            </CardContent>
          </Card>
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subject.topics.map((topic) => {
            const progress = getTopicProgress(topic.id);
            const isNew = progress.attempts === 0;
            const isMastered = progress.averageScore >= 85;
            const needsWork = progress.attempts > 0 && progress.averageScore < 70;

            // Get year information based on subject
            let yearInfo = null;
            if (subjectId === 'physics') {
              yearInfo = getPhysicsTopicYear(topic.name);
            } else if (subjectId === 'mathematics' || subjectId === 'maths-edexcel') {
              const years = getMathsTopicYears(topic.name);
              yearInfo = years.join(' & ');
            } else if (subjectId === 'geography') {
              yearInfo = getGeographyTopicYear(topic.name);
            }

            return (
              <Card key={topic.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group" 
                    onClick={() => navigate(`/premium-practice/${subjectId}/${topic.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {topic.name}
                      </CardTitle>
                      {yearInfo && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {yearInfo}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getSubjectColor(subjectId)}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {isNew && <Badge variant="secondary">New</Badge>}
                        {isMastered && <Badge className="bg-green-600">Mastered</Badge>}
                        {needsWork && <Badge variant="destructive">Needs Work</Badge>}
                      </div>
                      {!isNew && (
                        <div className="text-right">
                          <div className="text-sm font-medium">{progress.averageScore}%</div>
                          <div className="text-xs text-muted-foreground">{progress.attempts} attempts</div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!isNew && (
                      <Progress value={progress.averageScore} className="h-2" />
                    )}

                    {/* Action Button */}
                    <Button 
                      className="w-full" 
                      variant={isNew ? "default" : isMastered ? "outline" : "secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/premium-practice/${subjectId}/${topic.id}`);
                      }}
                    >
                      {isNew ? "Start Practice" : 
                       isMastered ? "Practice More" : 
                       "Continue Practice"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumSubjectTopics;