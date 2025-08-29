import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
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
          <Button onClick={() => {
            const fromParam = searchParams.get('from');
            navigate(fromParam === 'premium' ? '/premium-dashboard' : '/dashboard');
          }}>
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
              <Button variant="outline" onClick={() => {
                const fromParam = searchParams.get('from');
                navigate(fromParam === 'premium' ? '/premium-dashboard' : '/dashboard');
              }}>
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

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subject.topics.map((topic) => {
            const progress = getTopicProgress(topic.id);
            const isNew = progress.attempts === 0;
            const isMastered = progress.averageScore >= 85;
            const needsWork = progress.attempts > 0 && progress.averageScore < 60;
            const topicYear = subjectId === 'physics' ? getPhysicsTopicYear(topic.name) : null;
            const mathsYears = subjectId === 'maths' ? getMathsTopicYears(topic.name) : null;
            const geographyYear = subjectId === 'geography' ? getGeographyTopicYear(topic.name) : null;

            return (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                       <div className="flex items-center gap-2 mb-1">
                         <CardTitle className="text-lg leading-tight">{topic.name}</CardTitle>
                         {topicYear && (
                           <Badge 
                             className={`text-xs ${
                               topicYear === 'Year 10' 
                                 ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                 : 'bg-purple-500 text-white hover:bg-purple-600'
                             }`}
                           >
                             {topicYear}
                           </Badge>
                         )}
                         {mathsYears && mathsYears.map((year, index) => (
                           <Badge 
                             key={index}
                             className={`text-xs ${
                               year === 'Year 10' 
                                 ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                 : 'bg-purple-500 text-white hover:bg-purple-600'
                             }`}
                           >
                             {year}
                           </Badge>
                         ))}
                          {geographyYear && (
                            <Badge 
                              className={`text-xs ${
                                geographyYear === 'Year 10' 
                                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                  : 'bg-purple-500 text-white hover:bg-purple-600'
                              }`}
                            >
                              {geographyYear}
                            </Badge>
                          )}
                       </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {isNew && (
                        <Badge variant="outline">New</Badge>
                      )}
                      {isMastered && (
                        <Badge className="bg-green-500 hover:bg-green-600">Mastered</Badge>
                      )}
                      {needsWork && (
                        <Badge variant="destructive">Needs Work</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    {topic.questions.length} exam-style questions available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progress.attempts > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Average Score</span>
                        <span className="font-medium">{progress.averageScore}%</span>
                      </div>
                      <Progress value={progress.averageScore} className="mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  <Button 
                    className={`w-full font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                      isMastered 
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground' 
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white'
                    }`}
                     onClick={() => {
                       const fromParam = searchParams.get('from');
                       navigate(`/practice/${subjectId}/${topic.id}${fromParam ? `?from=${fromParam}` : ''}`);
                     }}
                  >
                    {isNew ? 'Start Practice' : 
                     isMastered ? 'Practice More' : 
                     'Continue Practice'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubjectTopics;
