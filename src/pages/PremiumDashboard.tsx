import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { curriculum } from "@/data/curriculum";
import { useNavigate } from "react-router-dom";
import { BarChart3, BookOpen, TrendingUp, LogOut, Crown, Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ColorThemeToggle } from "@/components/ui/color-theme-toggle";
import { useState, useEffect } from "react";
import { SubjectCard } from "@/components/dashboard/SubjectCard";
import { PremiumAnalyticsCard } from "@/components/dashboard/PremiumAnalyticsCard";
import { PredictedQuestionsSection } from "@/components/dashboard/PredictedQuestionsSection";
import { PredictedGradesGraph } from "@/components/dashboard/PredictedGradesGraph";

interface UserProgress {
  subjectId: string;
  topicId: string;
  attempts: number;
  averageScore: number;
  lastAttempt: Date;
}

const PremiumDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);

  // Load user progress from local storage
  useEffect(() => {
    if (!user?.id) return;
    
    const savedProgress = localStorage.getItem(`mentiora_progress_${user.id}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section - Premium Badge */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Premium Dashboard
            </h1>
            <Badge variant="default" className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <Crown className="w-3 h-3 mr-1" />
              Premium Access
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <ColorThemeToggle />
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={logout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Premium Content - No Paywalls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Predicted Grades Graph - NO PAYWALL */}
            <PredictedGradesGraph userProgress={userProgress} />
            
            {/* Predicted Questions Section - NO PAYWALL */}
            <PredictedQuestionsSection />
            
            {/* Welcome Message */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-primary" />
                  Welcome to Premium
                </CardTitle>
                <CardDescription>
                  Enjoy unlimited access to all features and premium content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You now have access to all subjects, predicted grades, smart notebooks, and advanced analytics.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Premium Analytics Cards - All Accessible */}
            <PremiumAnalyticsCard
              title="Performance Insights"
              description="Advanced analytics and predictions"
              icon={BarChart3}
              gradient="from-blue-500 to-purple-600"
            />
            
            <PremiumAnalyticsCard
              title="Study Optimization"
              description="AI-powered study recommendations"
              icon={Brain}
              gradient="from-green-500 to-teal-600"
            />
            
            <PremiumAnalyticsCard
              title="Grade Predictions"
              description="Real-time grade forecasting"
              icon={TrendingUp}
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </div>

        {/* Subjects Section - All Accessible */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  All Subjects - Premium Access
                </CardTitle>
                <CardDescription>
                  Access all subjects and topics without restrictions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {curriculum.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={{
                    ...subject,
                    color: '#3b82f6'
                  }}
                  progress={userProgress.filter(p => p.subjectId === subject.id)}
                  onStartPractice={(subjectId) => navigate(`/subject/${subjectId}`)}
                  isPinned={false}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>Jump to your premium features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => navigate('/notebook')} 
                className="h-auto p-4 flex flex-col items-start gap-2"
                variant="outline"
              >
                <Brain className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Smart Notebook</div>
                  <div className="text-sm text-muted-foreground">AI-powered notes</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => navigate('/predicted-questions')} 
                className="h-auto p-4 flex flex-col items-start gap-2"
                variant="outline"
              >
                <TrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Predicted Questions</div>
                  <div className="text-sm text-muted-foreground">2026 exam questions</div>
                </div>
              </Button>
              
              <Button 
                onClick={() => navigate('/analytics')} 
                className="h-auto p-4 flex flex-col items-start gap-2"
                variant="outline"
              >
                <BarChart3 className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Analytics</div>
                  <div className="text-sm text-muted-foreground">Performance tracking</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PremiumDashboard;