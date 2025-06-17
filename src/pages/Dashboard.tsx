import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);

  useEffect(() => {
    // Load user progress from localStorage
    const savedProgress = localStorage.getItem(`mentiora_progress_${user?.id}`);
    const savedWeakTopics = localStorage.getItem(`mentiora_weak_topics_${user?.id}`);
    
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedWeakTopics) {
      setWeakTopics(JSON.parse(savedWeakTopics));
    }
  }, [user?.id]);

  const getTopicProgress = (subjectId: string, topicId: string) => {
    const progress = userProgress.find(p => p.subjectId === subjectId && p.topicId === topicId);
    return progress || { attempts: 0, averageScore: 0, lastAttempt: new Date() };
  };

  const getMasteredTopics = () => {
    return userProgress.filter(p => p.averageScore >= 85).length;
  };

  const getOverallProgress = () => {
    if (userProgress.length === 0) return 0;
    const totalScore = userProgress.reduce((sum, p) => sum + p.averageScore, 0);
    return Math.round(totalScore / userProgress.length);
  };

  const getStudyStreak = () => {
    // Calculate study streak based on practice sessions
    return Math.min(userProgress.length, 7); // Cap at 7 for demo
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePractice = (subjectId: string, topicId?: string) => {
    if (topicId) {
      navigate(`/practice/${subjectId}/${topicId}`);
    } else {
      navigate(`/subject/${subjectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"></div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Mentiora
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/analytics')} className="border-slate-200 hover:bg-slate-50">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
              <Button variant="outline" onClick={handleLogout} className="border-slate-200 hover:bg-slate-50">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Good morning, {user?.name} 👋
          </h2>
          <p className="text-lg text-slate-600">Ready to crush your GCSE revision today?</p>
        </div>

        {/* Progress Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Overall Progress"
            value={`${getOverallProgress()}%`}
            subtitle="Average across all subjects"
            progress={getOverallProgress()}
            icon={TrendingUp}
            color="bg-green-500"
            trend={userProgress.length > 0 ? 5 : 0}
          />
          
          <ProgressCard
            title="Topics Mastered"
            value={getMasteredTopics()}
            subtitle="85%+ average score"
            icon={Trophy}
            color="bg-blue-500"
          />
          
          <ProgressCard
            title="Practice Sessions"
            value={userProgress.reduce((sum, p) => sum + p.attempts, 0)}
            subtitle="Questions attempted"
            icon={BookOpen}
            color="bg-purple-500"
          />
          
          <ProgressCard
            title="Study Streak"
            value={`${getStudyStreak()} days`}
            subtitle="Keep it up!"
            icon={Flame}
            color="bg-orange-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Assessment Objectives */}
          <div className="lg:col-span-1">
            <AOBreakdown userProgress={userProgress} />
          </div>

          {/* Weak Topics */}
          <div className="lg:col-span-2">
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={handlePractice}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Your Subjects</h3>
            <Badge variant="outline" className="text-slate-600">
              {curriculum.length} subjects available
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculum.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                progress={userProgress}
                onStartPractice={handlePractice}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{curriculum.length}</div>
                <p className="text-sm text-slate-600">Subjects</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {curriculum.reduce((sum, s) => sum + s.topics.length, 0)}
                </div>
                <p className="text-sm text-slate-600">Total Topics</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{getMasteredTopics()}</div>
                <p className="text-sm text-slate-600">Mastered</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{weakTopics.length}</div>
                <p className="text-sm text-slate-600">Need Practice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
