import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, User, LogOut, Flame, Calendar, CheckCircle, Trophy, Filter, Star, Pin, Lock, Crown, Zap, Brain, Target, Clock, LineChart, Sparkles, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState, useEffect } from "react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { TopicMasteryDisplay } from "@/components/dashboard/TopicMasteryDisplay";

import { PredictivePerformanceCard } from "@/components/dashboard/PredictivePerformanceCard";
import { OptimalStudyTimeCard } from "@/components/dashboard/OptimalStudyTimeCard";
import { OptimalLearningTimeCard } from "@/components/dashboard/OptimalLearningTimeCard";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";
import { DashboardStressMonitor } from "@/components/dashboard/DashboardStressMonitor";
import { supabase } from "@/integrations/supabase/client";
import { StressTracker } from "@/lib/stressTracker";

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
  const [pinnedSubjects, setPinnedSubjects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'weakest' | 'progress'>('progress');
  const [isNotifyClicked, setIsNotifyClicked] = useState(false);
  const [selectedExamBoard, setSelectedExamBoard] = useState('aqa');

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      // Apply natural stress decay when dashboard loads
      StressTracker.applyTimeDecay(user.id);

      // Load progress from localStorage
      const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setUserProgress(progress);
        
        // Calculate and save weak topics to database
        const weak = progress.filter((p: UserProgress) => p.averageScore < 70).map((p: UserProgress) => p.topicId);
        await saveWeakTopicsToDatabase(weak);
        setWeakTopics(weak);
      }

      // Load weak topics from database
      await loadWeakTopicsFromDatabase();

      // Load pinned subjects from localStorage
      const savedPinnedSubjects = localStorage.getItem(`mentiora_pinned_subjects_${user.id}`);
      if (savedPinnedSubjects) {
        setPinnedSubjects(JSON.parse(savedPinnedSubjects));
      }
    };

    loadUserData();
  }, [user?.id]);

  const loadWeakTopicsFromDatabase = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('weak_topics')
        .select('topics')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading weak topics:', error);
        return;
      }

      if (data?.topics && Array.isArray(data.topics)) {
        setWeakTopics(data.topics as string[]);
      }
    } catch (error) {
      console.error('Error loading weak topics:', error);
    }
  };

  const saveWeakTopicsToDatabase = async (topics: string[]) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('weak_topics')
        .upsert(
          {
            user_id: user.id,
            topics: topics,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error('Error saving weak topics:', error);
      }
    } catch (error) {
      console.error('Error saving weak topics:', error);
    }
  };

  // Update weak topics whenever progress changes
  useEffect(() => {
    if (!user?.id || userProgress.length === 0) return;

    const weak = userProgress.filter(p => p.averageScore < 70).map(p => p.topicId);
    if (JSON.stringify(weak) !== JSON.stringify(weakTopics)) {
      setWeakTopics(weak);
      saveWeakTopicsToDatabase(weak);
    }
  }, [userProgress, user?.id]);

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
    return Math.min(userProgress.length, 7);
  };

  const getSubjectProgress = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return 0;
    return Math.round(subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length);
  };

  const getLastActivity = (subjectId: string) => {
    const subjectProgress = userProgress.filter(p => p.subjectId === subjectId);
    if (subjectProgress.length === 0) return null;
    const lastAttempt = Math.max(...subjectProgress.map(p => new Date(p.lastAttempt).getTime()));
    return new Date(lastAttempt);
  };

  const getSubjectColor = (subjectId: string) => {
    // Return a color based on subject ID
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

  const sortedSubjects = [...curriculum].filter(subject => subject.id !== 'geography-paper-2').sort((a, b) => {
    const isPinnedA = pinnedSubjects.includes(a.id);
    const isPinnedB = pinnedSubjects.includes(b.id);
    
    if (isPinnedA && !isPinnedB) return -1;
    if (!isPinnedA && isPinnedB) return 1;
    
    switch (sortBy) {
      case 'alphabetical':
        return a.name.localeCompare(b.name);
      case 'weakest':
        return getSubjectProgress(a.id) - getSubjectProgress(b.id);
      case 'progress':
        return getSubjectProgress(b.id) - getSubjectProgress(a.id);
      default:
        return 0;
    }
  });

  const togglePinSubject = (subjectId: string) => {
    const newPinned = pinnedSubjects.includes(subjectId)
      ? pinnedSubjects.filter(id => id !== subjectId)
      : [...pinnedSubjects, subjectId];
    
    setPinnedSubjects(newPinned);
    localStorage.setItem(`mentiora_pinned_subjects_${user?.id}`, JSON.stringify(newPinned));
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

  const getFirstName = () => {
    if (!user) return 'there';
    
    // Try to get name from user_metadata first (from registration)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) {
      const firstName = fullName.split(' ')[0];
      return firstName;
    }
    
    // Fallback to email if no name is available
    if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'there';
  };

  const handleNotifyClick = () => {
    setIsNotifyClicked(true);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Premium Header with Glassmorphism */}
      <header className="bg-card/90 backdrop-blur-xl border-b border-border sticky top-0 z-50 shadow-lg shadow-black/5 dark:shadow-black/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg">
                  <img 
                    src="/lovable-uploads/99dd490e-1b20-4181-b127-6915d3c47932.png" 
                    alt="Mentiora Logo" 
                    className="w-8 h-8"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                    Mentiora
                  </h1>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-3 w-3 text-amber-500" />
                    <span className="text-xs font-medium text-muted-foreground">Premium</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="flex items-center space-x-2 px-4 py-2 bg-background/60 dark:bg-card/60 backdrop-blur-sm rounded-2xl border border-border shadow-sm">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">{getFirstName()}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout} className="text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Premium Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {getGreeting()}, {getFirstName()}
              </h2>
              <p className="text-muted-foreground text-lg">Ready to elevate your GCSE revision journey?</p>
            </div>
            <div className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
              <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">AI-Powered Insights</span>
            </div>
          </div>
        </div>

        {/* Predicted GCSE Grades Section */}
        <PredictedGradesGraph userProgress={userProgress} />

        {/* Optimal Learning Time - Premium Feature */}
        <div className="mb-8">
          <OptimalLearningTimeCard />
        </div>

        {/* Predicted 2026 Questions Section */}
        <PredictedQuestionsSection />

        {/* Premium Stress Monitor - Prominently displayed */}
        <DashboardStressMonitor 
          userId={user?.id} 
          userProgress={userProgress}
          onSubjectClick={handlePractice}
        />

        {/* Subjects Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h3 className="text-2xl font-bold text-foreground">Your Subjects</h3>
              <Badge variant="outline" className="text-muted-foreground border-border bg-card/50">
                {curriculum.filter(subject => subject.id !== 'geography-paper-2').length} subjects
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-background/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-1.5 border border-border shadow-sm">
                <Button
                  variant={sortBy === 'progress' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('progress')}
                  className={sortBy === 'progress' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  Progress
                </Button>
                <Button
                  variant={sortBy === 'weakest' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('weakest')}
                  className={sortBy === 'weakest' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  Weakest
                </Button>
                <Button
                  variant={sortBy === 'alphabetical' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('alphabetical')}
                  className={sortBy === 'alphabetical' ? 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors'}
                >
                  A-Z
                </Button>
              </div>
            </div>
          </div>

          {/* Exam Board Tabs */}
          <Tabs value={selectedExamBoard} onValueChange={setSelectedExamBoard} className="mb-6">
            <TabsList className="grid w-full grid-cols-5 max-w-md">
              <TabsTrigger value="aqa">AQA</TabsTrigger>
              <TabsTrigger value="edexcel">Edexcel</TabsTrigger>
              <TabsTrigger value="ccea">CCEA</TabsTrigger>
              <TabsTrigger value="ocr">OCR</TabsTrigger>
              <TabsTrigger value="wjec">WJEC</TabsTrigger>
            </TabsList>

            <TabsContent value="aqa" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedSubjects.filter(subject => subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'edexcel-english-language').map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={{
                      ...subject,
                      color: getSubjectColor(subject.id)
                    }}
                    progress={userProgress}
                    onStartPractice={handlePractice}
                    onTogglePin={togglePinSubject}
                    isPinned={pinnedSubjects.includes(subject.id)}
                    lastActivity={getLastActivity(subject.id)}
                    userId={user?.id}
                  />
                ))}
              </div>
            </TabsContent>

            {['edexcel', 'ccea', 'ocr', 'wjec'].map((examBoard) => (
              <TabsContent key={examBoard} value={examBoard} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedSubjects
                    .filter((subject) => {
                      // Show maths-edexcel, business-edexcel-igcse, and edexcel-english-language only in edexcel tab
                      if (subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') {
                        return examBoard === 'edexcel';
                      }
                      // Hide edexcel subjects from other tabs, show other subjects as coming soon
                      return subject.id !== 'maths-edexcel' && subject.id !== 'business-edexcel-igcse' && subject.id !== 'edexcel-english-language';
                    })
                     .sort((a, b) => {
                       // In edexcel tab, put maths-edexcel first, then business-edexcel-igcse, then edexcel-english-language
                       if (examBoard === 'edexcel') {
                         if (a.id === 'maths-edexcel') return -1;
                         if (b.id === 'maths-edexcel') return 1;
                         if (a.id === 'business-edexcel-igcse') return -1;
                         if (b.id === 'business-edexcel-igcse') return 1;
                         if (a.id === 'edexcel-english-language') return -1;
                         if (b.id === 'edexcel-english-language') return 1;
                       }
                       return 0;
                     })
                    .map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      subject={{
                        ...subject,
                        color: getSubjectColor(subject.id)
                      }}
                       progress={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel' ? userProgress : []}
                       onStartPractice={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel' ? handlePractice : () => {}}
                       onTogglePin={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel' ? togglePinSubject : () => {}}
                       isPinned={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel' ? pinnedSubjects.includes(subject.id) : false}
                       lastActivity={(subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel' ? getLastActivity(subject.id) : null}
                       comingSoon={!((subject.id === 'maths-edexcel' || subject.id === 'business-edexcel-igcse' || subject.id === 'edexcel-english-language') && examBoard === 'edexcel')}
                      userId={user?.id}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" style={{ display: 'none' }}>
          </div>
        </div>

        {/* Premium Progress Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ProgressCard
            title="Overall Progress"
            value={`${getOverallProgress()}%`}
            subtitle="Average across subjects"
            progress={getOverallProgress()}
            icon={TrendingUp}
            color="bg-gradient-to-br from-primary via-primary/90 to-primary/80"
            trend={userProgress.length > 0 ? 5 : undefined}
          />
          
          <ProgressCard
            title="Topics Mastered"
            value={getMasteredTopics()}
            subtitle="85%+ average score"
            icon={Trophy}
            color="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
          
          <ProgressCard
            title="Practice Sessions"
            value={userProgress.reduce((sum, p) => sum + p.attempts, 0)}
            subtitle="Questions completed"
            icon={BookOpen}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          
          <ProgressCard
            title="Study Streak"
            value={`${getStudyStreak()} days`}
            subtitle="Keep it up!"
            icon={Flame}
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
        </div>

        {/* Premium Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 space-y-6">
            <AOBreakdown userProgress={userProgress} />
            <GoalsSection />
            <TopicMasteryDisplay />
          </div>
          <div className="lg:col-span-2">
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={handlePractice}
            />
          </div>
        </div>

        {/* Premium Locked Analytics */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3 mb-6">
            <Crown className="h-6 w-6 text-amber-500" />
            <h3 className="text-2xl font-bold text-foreground">Premium Analytics</h3>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Pro Feature
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PremiumAnalyticsCard
              title="Learning Retention"
              description="Track how well you retain information over time with spaced repetition analysis"
              icon={Brain}
              gradient="from-purple-500 to-indigo-600"
              comingSoon={true}
            />
            
            <OptimalStudyTimeCard />
            
            <PredictivePerformanceCard userProgress={userProgress} />
            
            <PremiumAnalyticsCard
              title="Learning Velocity"
              description="Measure and optimize your knowledge acquisition speed"
              icon={Zap}
              gradient="from-orange-500 to-red-500"
              comingSoon={true}
            />
            
            <PremiumAnalyticsCard
              title="Concept Mapping"
              description="Visualize connections between topics and identify knowledge gaps"
              icon={Target}
              gradient="from-pink-500 to-rose-600"
              comingSoon={true}
            />
            
            <Card className="group relative overflow-hidden border-0 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl">
              {/* Premium Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 opacity-5 group-hover:opacity-10 transition-opacity duration-500" />
              
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs">
                    Active
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="relative z-10">
                <div className="space-y-3">
                  <CardTitle className="text-lg font-bold text-foreground leading-tight">
                    Stress Monitor
                  </CardTitle>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    AI-powered wellness tracking across all subjects
                  </p>
                  
                  {/* Mini Stress Data */}
                  <div className="mt-6 space-y-4">
                    {(() => {
                      const subjectsWithProgress = userProgress?.reduce((acc, progress) => {
                        if (!acc.includes(progress.subjectId)) {
                          acc.push(progress.subjectId);
                        }
                        return acc;
                      }, [] as string[]) || [];

                      const subjectStressLevels = user?.id && subjectsWithProgress.length > 0 
                        ? subjectsWithProgress.map(subjectId => {
                            const stressLevel = StressTracker.getStressLevel(user.id, subjectId);
                            return { subjectId, stressLevel, category: StressTracker.getStressLevelCategory(stressLevel) };
                          }).filter(s => s.stressLevel > 0)
                        : [];

                      const hasStressData = subjectStressLevels.length > 0;
                      const stressCounts = hasStressData ? {
                        low: subjectStressLevels.filter(s => s.category === 'low').length,
                        medium: subjectStressLevels.filter(s => s.category === 'medium').length,
                        high: subjectStressLevels.filter(s => s.category === 'high').length
                      } : { low: 0, medium: 0, high: 0 };

                      return (
                        <>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                {stressCounts.low}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">
                                Low
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                {stressCounts.medium}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">
                                Medium
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="text-lg font-bold text-red-600 dark:text-red-400">
                                {stressCounts.high}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">
                                High
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Overall Wellness</span>
                            <span className="font-semibold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                              {!hasStressData ? 'No Data' : 
                               stressCounts.high > 0 ? 'Needs Attention' :
                               stressCounts.medium > 0 ? 'Moderate' : 'Excellent'}
                            </span>
                          </div>
                          <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div 
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-1000"
                              style={{ 
                                width: !hasStressData ? '0%' : 
                                       stressCounts.high > 0 ? '30%' :
                                       stressCounts.medium > 0 ? '65%' : '95%'
                              }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </CardContent>

              {/* Premium Border Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-600 p-[1px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                <div className="w-full h-full bg-card rounded-3xl" />
              </div>
            </Card>
          </div>

          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-400" />
                <h4 className="text-xl font-bold text-foreground">Advanced Analytics Coming Soon</h4>
                <Sparkles className="h-6 w-6 text-violet-500 dark:text-violet-400" />
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working hard to bring you powerful AI-driven insights to supercharge your GCSE revision. 
                Stay tuned for updates!
              </p>
              <Button 
                variant="outline" 
                className={`
                  px-6 py-2 rounded-xl transition-all duration-300 transform
                  ${isNotifyClicked 
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-700 scale-105 shadow-lg' 
                    : 'bg-white/80 backdrop-blur-sm border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300'
                  }
                `}
                onClick={handleNotifyClick}
              >
                {isNotifyClicked ? <CheckCircle className="h-4 w-4 mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
                {isNotifyClicked ? 'We\'ll Notify You!' : 'Notify Me When Ready'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          data-feedback-fish
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border shadow-lg hover:shadow-xl transition-all duration-200"
        >
          💬 Feedback
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
