import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
import { TimeSavedNotification } from "@/components/notifications/TimeSavedNotification";
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

import { supabase } from "@/integrations/supabase/client";
import { StressTracker } from "@/lib/stressTracker";

import { usePersonalizedNotifications } from "@/hooks/usePersonalizedNotifications";
import { StreakCelebration } from "@/components/ui/streak-celebration";
import { ProfileDropdown } from '@/components/ui/profile-dropdown';
import { PublicStreakProfiles } from '@/components/dashboard/PublicStreakProfiles';
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";
import { useToast } from "@/hooks/use-toast";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'weakest' | 'progress'>('progress');
  const [isNotifyClicked, setIsNotifyClicked] = useState(false);
  const [selectedExamBoard, setSelectedExamBoard] = useState('aqa');
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [subjectsTab, setSubjectsTab] = useState<'my-subjects' | 'all-subjects'>('my-subjects');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showTimeSavedNotification, setShowTimeSavedNotification] = useState(false);
  const [timeSavedHours, setTimeSavedHours] = useState(0);
  const [previousTimeSaved, setPreviousTimeSaved] = useState(0);

  const {
    notification,
    checkForWeakTopicRecommendation,
    checkForExamRecommendation,
    showStudyRecommendation,
    clearNotificationCache,
    hideNotification,
    clearNotification
  } = usePersonalizedNotifications();

  // Similar data loading logic as the main dashboard
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        
        const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
        setWeakTopics(weak);
      }

      // Load pinned subjects from localStorage
      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }

      // Load user's selected subjects
      await loadUserSubjects();
    };

    loadUserData();
  }, [user?.id]);

  const loadUserSubjects = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_subjects')
        .select('subject_name, exam_board')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading user subjects:', error);
        return;
      }

      if (data) {
        const subjectIds = data.map(record => {
          const examBoard = record.exam_board.toLowerCase();
          
          if (record.subject_name === 'Physics' && examBoard === 'aqa') {
            return 'physics';
          }
          if (record.subject_name === 'Physics' && examBoard === 'edexcel') {
            return 'physics-edexcel';
          }
          
          const subject = curriculum.find(s => 
            (record.subject_name === 'Mathematics' && s.name === 'Maths (Edexcel)') ||
            (record.subject_name === 'IGCSE Business' && s.name === 'Business (Edexcel IGCSE)') ||
            (record.subject_name === 'Chemistry' && examBoard === 'edexcel' && s.id === 'chemistry-edexcel') ||
            s.name.toLowerCase() === record.subject_name.toLowerCase()
          );
          
          return subject ? subject.id : null;
        }).filter(Boolean) as string[];
        
        setUserSubjects(subjectIds);
      }
    } catch (error) {
      console.error('Error loading user subjects:', error);
    }
  };

  const getFilteredSubjects = () => {
    let subjects = subjectsTab === 'my-subjects' 
      ? curriculum.filter(subject => userSubjects.includes(subject.id))
      : curriculum;

    // Sort subjects based on selected sorting method
    if (sortBy === 'alphabetical') {
      subjects = subjects.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'weakest') {
      subjects = subjects.sort((a, b) => {
        const aWeakTopics = a.topics.filter(topic => weakTopics.includes(topic.id)).length;
        const bWeakTopics = b.topics.filter(topic => weakTopics.includes(topic.id)).length;
        return bWeakTopics - aWeakTopics;
      });
    } else if (sortBy === 'progress') {
      subjects = subjects.sort((a, b) => {
        const aProgress = userProgress.filter(p => p.subjectId === a.id);
        const bProgress = userProgress.filter(p => p.subjectId === b.id);
        const aAvg = aProgress.length > 0 ? aProgress.reduce((sum, p) => sum + p.averageScore, 0) / aProgress.length : 0;
        const bAvg = bProgress.length > 0 ? bProgress.reduce((sum, p) => sum + p.averageScore, 0) / bProgress.length : 0;
        return bAvg - aAvg;
      });
    }

    // Move pinned subjects to the top
    const pinnedSubjectsData = subjects.filter(subject => pinnedSubjects.includes(subject.id));
    const unpinnedSubjectsData = subjects.filter(subject => !pinnedSubjects.includes(subject.id));
    
    return [...pinnedSubjectsData, ...unpinnedSubjectsData];
  };

  const filteredSubjects = getFilteredSubjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard')}
                className="text-muted-foreground hover:text-foreground"
              >
                ← Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h1 className="text-lg font-semibold">Premium Dashboard</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <ColorThemeToggle />
              <ThemeToggle />
              <ProfileDropdown streakDays={0} firstName={user?.email?.split('@')[0] || 'User'} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to EduClara Premium
          </h2>
          <p className="text-muted-foreground">
            Unlock your full academic potential with AI-powered insights
          </p>
        </motion.div>

        {/* Premium Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PremiumAnalyticsCard
            title="Predictive Performance"
            description="AI-powered grade predictions based on your current progress"
            icon={TrendingUp}
            gradient="from-blue-500 to-purple-600"
          />
          
          <PremiumAnalyticsCard
            title="Learning Efficiency"
            description="Optimize your study time with personalized recommendations"
            icon={Brain}
            gradient="from-green-500 to-blue-500"
          />
          
          <PremiumAnalyticsCard
            title="Topic Mastery"
            description="Track your understanding across all subjects and topics"
            icon={Target}
            gradient="from-orange-500 to-red-500"
          />
        </div>

        {/* Premium Features Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="predictions" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Predictions</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
            <TabsTrigger value="subjects" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Subjects</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <PredictivePerformanceCard userProgress={userProgress} />
              <OptimalStudyTimeCard />
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <PredictedGradesGraph userProgress={userProgress} />
              <AOBreakdown userProgress={userProgress} />
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <PredictedQuestionsSection />
            <WeakTopicsSection 
              weakTopics={weakTopics} 
              userProgress={userProgress}
              onPractice={(subjectId: string, topicId: string) => navigate(`/practice/${subjectId}/${topicId}`)}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <GoalsSection />
              <Card>
                <CardHeader>
                  <CardTitle>Topic Mastery</CardTitle>
                  <CardDescription>Track your understanding across topics</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mastery tracking coming soon...</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <StudyPlaylist isUnlocked={true} />
              <PublicStreakProfiles />
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            {/* Subjects Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold">Your Subjects</h2>
                <p className="text-muted-foreground">Track progress across all your subjects</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as 'alphabetical' | 'weakest' | 'progress')}
                  className="bg-background border border-border rounded-md px-3 py-1 text-sm"
                >
                  <option value="progress">Sort by Progress</option>
                  <option value="alphabetical">Sort Alphabetically</option>
                  <option value="weakest">Sort by Weakest</option>
                </select>
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredSubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={{
                    id: subject.id,
                    name: subject.name,
                    color: '#3B82F6',
                    topics: subject.topics
                  }}
                  progress={userProgress.filter(p => p.subjectId === subject.id)}
                  onStartPractice={(subjectId) => navigate(`/subject/${subjectId}`)}
                  onTogglePin={() => {}}
                  isPinned={pinnedSubjects.includes(subject.id)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PremiumDashboard;