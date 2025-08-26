
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { ProgressCard } from "@/components/dashboard/ProgressCard";
import { WeakTopicsSection } from "@/components/dashboard/WeakTopicsSection";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { DashboardStressMonitor } from "@/components/dashboard/DashboardStressMonitor";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { AOBreakdown } from "@/components/dashboard/AOBreakdown";
import { OptimalLearningTimeCard } from "@/components/dashboard/OptimalLearningTimeCard";
import StudyPlaylist from "@/components/dashboard/StudyPlaylist";
import { PremiumAnalytics } from "@/components/premium/PremiumAnalytics";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  Zap, 
  BarChart3, 
  Clock,
  BookOpen,
  Lightbulb
} from "lucide-react";

const PremiumDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<Array<{
    subjectId: string;
    topicId: string;
    averageScore: number;
    attempts: number;
  }>>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserProgress();
    }
  }, [user?.id]);

  const fetchUserProgress = async () => {
    try {
      const { data: sessions, error } = await supabase
        .from('session_analytics')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user progress:', error);
        return;
      }

      // Process session data to calculate progress per subject/topic
      const progressMap = new Map();
      
      sessions?.forEach(session => {
        if (session.subject_id && session.questions_attempted && session.questions_correct) {
          const key = `${session.subject_id}`;
          if (!progressMap.has(key)) {
            progressMap.set(key, {
              subjectId: session.subject_id,
              topicId: 'general',
              totalQuestions: 0,
              totalCorrect: 0,
              attempts: 0
            });
          }
          
          const progress = progressMap.get(key);
          progress.totalQuestions += session.questions_attempted;
          progress.totalCorrect += session.questions_correct;
          progress.attempts += 1;
        }
      });

      const progressArray = Array.from(progressMap.values()).map(progress => ({
        subjectId: progress.subjectId,
        topicId: progress.topicId,
        averageScore: progress.totalQuestions > 0 
          ? (progress.totalCorrect / progress.totalQuestions) * 100 
          : 0,
        attempts: progress.attempts
      }));

      setUserProgress(progressArray);
      
      // Calculate weak topics (score < 70%)
      const weak = progressArray.filter(p => p.averageScore < 70).map(p => p.topicId);
      setWeakTopics(weak);
    } catch (error) {
      console.error('Error in fetchUserProgress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subjects/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Premium Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome back! All premium features are unlocked for you.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <StudyPlaylist isUnlocked={true} />
          </div>
        </div>

        {/* Premium Features Section */}
        <PredictedQuestionsSection />

        {/* Stress Monitor */}
        <DashboardStressMonitor 
          userId={user?.id}
          userProgress={userProgress}
          onSubjectClick={handleSubjectClick}
        />

        {/* Premium Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PremiumAnalyticsCard
            title="Advanced Learning Patterns"
            description="AI-powered insights into your study habits and optimal learning windows"
            icon={Brain}
            gradient="from-purple-500 to-indigo-600"
          />
          
          <PremiumAnalyticsCard
            title="Predictive Performance"
            description="Forecast your exam results with machine learning algorithms"
            icon={TrendingUp}
            gradient="from-emerald-500 to-teal-600"
          />
          
          <PremiumAnalyticsCard
            title="Smart Study Scheduling"
            description="Personalized study plans based on your peak performance times"
            icon={Clock}
            gradient="from-orange-500 to-red-500"
          />
          
          <PremiumAnalyticsCard
            title="Concept Mastery Map"
            description="Visual representation of your knowledge gaps and strengths"
            icon={Target}
            gradient="from-pink-500 to-rose-600"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Subjects */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                Your Subjects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {curriculum.map((subject) => (
                  <SubjectCard
                    key={subject.id}
                    subject={{
                      ...subject,
                      color: 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }}
                    progress={userProgress.filter(p => p.subjectId === subject.id)}
                    onStartPractice={() => handleSubjectClick(subject.id)}
                  />
                ))}
              </div>
            </div>

            {/* Full Premium Analytics */}
            <PremiumAnalytics />

            {/* Assessment Objectives Breakdown */}
            <AOBreakdown userProgress={userProgress} />
          </div>

          {/* Right Column - Analytics & Tools */}
          <div className="space-y-6">
            <OptimalLearningTimeCard />
            <WeakTopicsSection 
              weakTopics={weakTopics}
              userProgress={userProgress}
              onPractice={(subjectId: string, topicId: string) => navigate(`/practice/${subjectId}`)}
            />
            <GoalsSection />
          </div>
        </div>

        {/* Additional Premium Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <PremiumAnalyticsCard
            title="Learning Velocity Tracker"
            description="Monitor how quickly you're mastering new concepts"
            icon={Zap}
            gradient="from-cyan-500 to-blue-600"
          />
          
          <PremiumAnalyticsCard
            title="Retention Analytics"
            description="Track how well you retain information over time"
            icon={BarChart3}
            gradient="from-violet-500 to-purple-600"
          />
          
          <PremiumAnalyticsCard
            title="Study Insights Engine"
            description="Get personalized recommendations for better learning outcomes"
            icon={Lightbulb}
            gradient="from-amber-500 to-yellow-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PremiumDashboard;
