import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState } from "react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { TopicMasteryDisplay } from "@/components/dashboard/TopicMasteryDisplay";
import { PredictivePerformanceCard } from "@/components/dashboard/PredictivePerformanceCard";
import { OptimalStudyTimeCard } from "@/components/dashboard/OptimalStudyTimeCard";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { PublicStreakProfiles } from '@/components/dashboard/PublicStreakProfiles';
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'alphabetical' | 'weakest' | 'progress'>('progress');
  const [subjectsTab, setSubjectsTab] = useState<'my-subjects' | 'all-subjects'>('my-subjects');

  // Mock data for premium dashboard
  const userProgress = [
    { subjectId: 'physics', topicId: 'forces', attempts: 5, averageScore: 85, lastAttempt: new Date() },
    { subjectId: 'maths', topicId: 'calculus', attempts: 3, averageScore: 92, lastAttempt: new Date() }
  ];
  const weakTopics = ['forces', 'thermodynamics'];
  const pinnedSubjects = ['physics', 'maths'];
  const userSubjects = ['physics', 'maths', 'chemistry'];

  const togglePin = (subjectId: string) => {
    // Mock implementation
    console.log('Toggling pin for', subjectId);
  };

  const toggleUserSubject = (subjectId: string) => {
    // Mock implementation
    console.log('Toggling user subject for', subjectId);
  };

  // Subject color mapping for premium dashboard
  const getSubjectColor = (subjectId: string) => {
    const colorMap: Record<string, string> = {
      'physics': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'physics-edexcel': 'bg-gradient-to-r from-blue-500 to-cyan-500',
      'maths': 'bg-gradient-to-r from-purple-500 to-pink-500',
      'chemistry': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'chemistry-edexcel': 'bg-gradient-to-r from-green-500 to-emerald-500',
      'biology': 'bg-gradient-to-r from-orange-500 to-red-500',
      'computer-science': 'bg-gradient-to-r from-indigo-500 to-purple-500',
      'english-language': 'bg-gradient-to-r from-teal-500 to-cyan-500',
      'history': 'bg-gradient-to-r from-amber-500 to-orange-500',
      'geography': 'bg-gradient-to-r from-emerald-500 to-teal-500',
      'business': 'bg-gradient-to-r from-rose-500 to-pink-500',
      'economics': 'bg-gradient-to-r from-violet-500 to-purple-500',
    };
    return colorMap[subjectId] || 'bg-gradient-to-r from-slate-500 to-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <span className="font-semibold text-lg bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                Premium Dashboard
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ColorThemeToggle />
            <ThemeToggle />
            <ProfileDropdown streakDays={12} firstName={user?.user_metadata?.full_name?.split(' ')[0] || 'User'} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-8 space-y-8">
        {/* Premium Account Badge */}
        <div className="flex items-center justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full"
          >
            <Crown className="h-5 w-5 text-amber-500" />
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              Premium Account Active
            </span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </motion.div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ProgressCard 
            title="Study Streak"
            value="12 days"
            icon={Flame}
            color="bg-gradient-to-r from-orange-500 to-red-500"
            trend={15}
          />
          <ProgressCard 
            title="Total Study Time"
            value="48 hours"
            icon={Clock}
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            trend={12}
          />
          <ProgressCard 
            title="Average Score"
            value="87%"
            icon={Target}
            color="bg-gradient-to-r from-green-500 to-emerald-500"
            trend={8}
          />
          <ProgressCard 
            title="Subjects Mastered"
            value="3"
            icon={Trophy}
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            trend={25}
          />
        </div>

        {/* Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PremiumAnalyticsCard 
            title="AI Study Insights"
            description="Advanced analytics powered by AI"
            icon={Brain}
            gradient="from-purple-500 to-pink-500"
          />
          <PremiumAnalyticsCard 
            title="Performance Prediction"
            description="Predict your exam results"
            icon={Target}
            gradient="from-blue-500 to-cyan-500"
          />
          <PremiumAnalyticsCard 
            title="Optimal Study Times"
            description="When you learn best"
            icon={Clock}
            gradient="from-green-500 to-emerald-500"
          />
        </div>

        {/* Enhanced Study Tools */}
        <Tabs defaultValue="subjects" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Subjects
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Predictions
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Goals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subject Filter */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2">
                <Tabs value={subjectsTab} onValueChange={(value) => setSubjectsTab(value as 'my-subjects' | 'all-subjects')}>
                  <TabsList>
                    <TabsTrigger value="my-subjects">My Subjects</TabsTrigger>
                    <TabsTrigger value="all-subjects">All Subjects</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'weakest' | 'progress')}
                  className="px-3 py-1 border rounded-md bg-background"
                >
                  <option value="progress">By Progress</option>
                  <option value="alphabetical">Alphabetical</option>
                  <option value="weakest">Weakest First</option>
                </select>
              </div>
            </div>

            {/* Subject Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {curriculum
                .filter(subject => subjectsTab === 'all-subjects' || userSubjects.includes(subject.id))
                .map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={{...subject, color: getSubjectColor(subject.id)}}
                  progress={userProgress.filter(p => p.subjectId === subject.id)}
                  onStartPractice={(subjectId) => navigate(`/subject/${subjectId}`)}
                  onTogglePin={() => togglePin(subject.id)}
                  isPinned={pinnedSubjects.includes(subject.id)}
                  isUserSubject={userSubjects.includes(subject.id)}
                  onToggleUserSubject={() => toggleUserSubject(subject.id)}
                  showAddButton={subjectsTab === 'all-subjects'}
                  userId={user?.id}
                />
              ))}
            </div>

            {/* Weak Topics Section */}
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={(subjectId: string, topicId: string) => navigate(`/practice/${subjectId}/${topicId}`)}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PredictivePerformanceCard userProgress={userProgress} />
              <OptimalStudyTimeCard />
            </div>
            <PredictedGradesGraph userProgress={userProgress} />
            <AOBreakdown userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <PredictedQuestionsSection />
            <TopicMasteryDisplay />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <GoalsSection />
          </TabsContent>
        </Tabs>

        {/* Study Playlist */}
        <StudyPlaylist isUnlocked={true} />

        {/* Public Streak Profiles */}
        <PublicStreakProfiles />
      </main>
    </div>
  );
};

export default PremiumDashboard;