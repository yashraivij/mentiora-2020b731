import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Zap, Sparkles, Crown, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SessionData {
  hour: number;
  day: number;
  correct_answers: number;
  total_questions: number;
  accuracy: number;
  created_at: string;
}

interface TimeSlotAnalysis {
  timeRange: string;
  accuracy: number;
  sessionCount: number;
  improvement: number;
}

export const OptimalStudyTimeCard = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<TimeSlotAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasEnoughData, setHasEnoughData] = useState(false);

  useEffect(() => {
    if (user?.id) {
      analyzeStudyTimes();
    }
  }, [user?.id]);

  const analyzeStudyTimes = async () => {
    try {
      // Fetch session analytics data
      const { data: sessions, error } = await supabase
        .from('session_analytics')
        .select('created_at, questions_attempted, questions_correct')
        .eq('user_id', user?.id)
        .not('questions_attempted', 'is', null)
        .not('questions_correct', 'is', null)
        .gte('questions_attempted', 1);

      if (error || !sessions) {
        console.error('Error fetching session data:', error);
        setLoading(false);
        return;
      }

      // Process sessions by time slots
      const timeSlots: { [key: string]: SessionData[] } = {};
      
      sessions.forEach(session => {
        const date = new Date(session.created_at);
        const hour = date.getHours();
        const day = date.getDay();
        const accuracy = session.questions_attempted > 0 
          ? (session.questions_correct / session.questions_attempted) * 100 
          : 0;

        const timeRange = getTimeRange(hour);
        const key = `${day}-${timeRange}`;

        if (!timeSlots[key]) {
          timeSlots[key] = [];
        }

        timeSlots[key].push({
          hour,
          day,
          correct_answers: session.questions_correct,
          total_questions: session.questions_attempted,
          accuracy,
          created_at: session.created_at
        });
      });

      // Analyze time slots
      const slotAnalysis: { [key: string]: TimeSlotAnalysis } = {};
      let totalSlots = 0;
      let slotsWithEnoughData = 0;

      Object.entries(timeSlots).forEach(([key, sessionData]) => {
        if (sessionData.length >= 2) { // Minimum sessions per slot
          const avgAccuracy = sessionData.reduce((sum, s) => sum + s.accuracy, 0) / sessionData.length;
          const timeRange = getTimeRange(sessionData[0].hour);
          
          slotAnalysis[key] = {
            timeRange,
            accuracy: Math.round(avgAccuracy),
            sessionCount: sessionData.length,
            improvement: 0 // Will calculate below
          };
          slotsWithEnoughData++;
        }
        totalSlots++;
      });

      // Check if we have enough data (5+ sessions across 3+ time ranges)
      const totalSessions = sessions.length;
      const hasEnoughData = totalSessions >= 5 && slotsWithEnoughData >= 2;
      setHasEnoughData(hasEnoughData);

      if (hasEnoughData) {
        // Find the best performing time slot
        const bestSlot = Object.values(slotAnalysis).reduce((best, current) => 
          current.accuracy > best.accuracy ? current : best
        );

        // Calculate improvement percentage
        const avgAccuracy = Object.values(slotAnalysis).reduce((sum, slot) => sum + slot.accuracy, 0) / Object.values(slotAnalysis).length;
        bestSlot.improvement = Math.round(((bestSlot.accuracy - avgAccuracy) / avgAccuracy) * 100);

        setAnalysis(bestSlot);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error analyzing study times:', error);
      setLoading(false);
    }
  };

  const getTimeRange = (hour: number): string => {
    if (hour >= 6 && hour < 9) return "6-9am";
    if (hour >= 9 && hour < 12) return "9am-12pm";
    if (hour >= 12 && hour < 15) return "12-3pm";
    if (hour >= 15 && hour < 18) return "3-6pm";
    if (hour >= 18 && hour < 21) return "6-9pm";
    if (hour >= 21 || hour < 6) return "9pm-6am";
    return "Various";
  };

  const getTimeEmoji = (timeRange: string): string => {
    if (timeRange.includes("6-9am")) return "🌅";
    if (timeRange.includes("9am-12pm")) return "☀️";
    if (timeRange.includes("12-3pm")) return "🌞";
    if (timeRange.includes("3-6pm")) return "🌤️";
    if (timeRange.includes("6-9pm")) return "🌆";
    return "🌙";
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-violet-600/20 via-purple-600/20 to-fuchsia-600/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  AI Study Optimizer
                </CardTitle>
                <p className="text-xs text-muted-foreground">Premium Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-amber-500" />
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                Pro
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gradient-to-r from-violet-400/30 to-purple-400/30 rounded-lg w-3/4"></div>
            <div className="h-3 bg-gradient-to-r from-purple-400/20 to-fuchsia-400/20 rounded-lg w-1/2"></div>
            <div className="flex gap-2">
              <div className="h-6 w-12 bg-gradient-to-r from-emerald-400/30 to-cyan-400/30 rounded-full"></div>
              <div className="h-6 w-16 bg-gradient-to-r from-pink-400/30 to-rose-400/30 rounded-full"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasEnoughData) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl" />
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-br from-pink-400/15 to-rose-500/15 rounded-full blur-xl" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Study Optimizer
                </CardTitle>
                <p className="text-xs text-muted-foreground">Premium Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Crown className="h-4 w-4 text-amber-500" />
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                Pro
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="text-center py-6">
            <div className="relative mb-4">
              <div className="p-4 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 mx-auto w-fit">
                <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <Sparkles className="h-4 w-4 text-amber-400 absolute -top-1 -right-4 animate-pulse" />
              <div className="absolute -bottom-1 -left-2 w-3 h-3 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce" />
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border border-white/20 shadow-lg">
                <p className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  🧠 AI Learning Analysis in Progress
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete more practice sessions to unlock personalized study time recommendations
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 border border-violet-200/50 dark:border-violet-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-300">Smart Insights</span>
                </div>
                <p className="text-xs text-violet-600 dark:text-violet-400 leading-relaxed">
                  Discover your peak learning hours with advanced AI pattern recognition
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-600/20 via-teal-600/20 to-cyan-600/20 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-400/20 to-emerald-500/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-gradient-to-br from-cyan-400/15 to-blue-500/15 rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
      
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                AI Study Optimizer
              </CardTitle>
              <p className="text-xs text-muted-foreground">Premium Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Crown className="h-4 w-4 text-amber-500" />
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
              Pro
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border border-white/20 shadow-lg">
            <div className="text-3xl p-2 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              {getTimeEmoji(analysis?.timeRange || "")}
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                Peak Learning: {analysis?.timeRange}
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span>{analysis?.accuracy}% accuracy</span>
                </div>
                <span>•</span>
                <span>{analysis?.sessionCount} sessions analyzed</span>
              </div>
            </div>
          </div>
          
          {analysis && analysis.improvement > 5 && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-md">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  ⚡ {analysis.improvement}% Performance Boost
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  You're significantly more accurate during this time!
                </p>
              </div>
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-200/50 dark:border-cyan-800/30">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">AI Recommendation</span>
            </div>
            <p className="text-xs text-cyan-600 dark:text-cyan-400 leading-relaxed">
              Schedule your most challenging revision sessions during {analysis?.timeRange} to maximize learning efficiency and retention.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};