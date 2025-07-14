import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Brain, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SessionData {
  hour: number;
  accuracy: number;
  created_at: string;
}

interface OptimalTimeAnalysis {
  timeRange: string;
  improvement: number;
  accuracy: number;
  sessionCount: number;
}

export const OptimalLearningTimeCard = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<OptimalTimeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      analyzeOptimalTimes();
    }
  }, [user?.id]);

  const analyzeOptimalTimes = async () => {
    try {
      setIsRefreshing(true);
      
      // Fetch session analytics data
      const { data: sessions, error } = await supabase
        .from('session_analytics')
        .select('created_at, questions_attempted, questions_correct')
        .eq('user_id', user?.id)
        .not('questions_attempted', 'is', null)
        .not('questions_correct', 'is', null)
        .gte('questions_attempted', 1)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error || !sessions) {
        console.error('Error fetching session data:', error);
        setLoading(false);
        setIsRefreshing(false);
        return;
      }

      // Process sessions by hour
      const hourlyData: { [hour: number]: SessionData[] } = {};
      
      sessions.forEach(session => {
        const date = new Date(session.created_at);
        const hour = date.getHours();
        const accuracy = session.questions_attempted > 0 
          ? (session.questions_correct / session.questions_attempted) * 100 
          : 0;

        if (!hourlyData[hour]) {
          hourlyData[hour] = [];
        }

        hourlyData[hour].push({
          hour,
          accuracy,
          created_at: session.created_at
        });
      });

      // Calculate average accuracy for each hour with enough data
      const hourlyAverages: { [hour: number]: { accuracy: number; count: number } } = {};
      
      Object.entries(hourlyData).forEach(([hourStr, sessionData]) => {
        const hour = parseInt(hourStr);
        if (sessionData.length >= 2) { // Need at least 2 sessions per hour
          const avgAccuracy = sessionData.reduce((sum, s) => sum + s.accuracy, 0) / sessionData.length;
          hourlyAverages[hour] = {
            accuracy: avgAccuracy,
            count: sessionData.length
          };
        }
      });

      // Check if we have enough data
      const totalSessions = sessions.length;
      const hoursWithData = Object.keys(hourlyAverages).length;
      const hasEnoughData = totalSessions >= 8 && hoursWithData >= 3;
      setHasEnoughData(hasEnoughData);

      if (hasEnoughData) {
        // Find the best performing time slot
        const bestHour = Object.entries(hourlyAverages).reduce((best, [hourStr, data]) => {
          const hour = parseInt(hourStr);
          return data.accuracy > best.accuracy ? { hour, ...data } : best;
        }, { hour: 0, accuracy: 0, count: 0 });

        // Calculate overall average
        const overallAccuracy = Object.values(hourlyAverages).reduce((sum, data) => sum + data.accuracy, 0) / Object.values(hourlyAverages).length;
        
        // Calculate improvement percentage
        const improvement = Math.round(((bestHour.accuracy - overallAccuracy) / overallAccuracy) * 100);

        // Convert hour to time range
        const timeRange = getOptimalTimeRange(bestHour.hour);

        setAnalysis({
          timeRange,
          improvement: Math.max(improvement, 0),
          accuracy: Math.round(bestHour.accuracy),
          sessionCount: bestHour.count
        });
      }

      setLoading(false);
      setIsRefreshing(false);
    } catch (error) {
      console.error('Error analyzing optimal times:', error);
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getOptimalTimeRange = (hour: number): string => {
    if (hour >= 6 && hour < 9) return "6AM - 9AM";
    if (hour >= 9 && hour < 12) return "9AM - 12PM";
    if (hour >= 12 && hour < 15) return "12PM - 3PM";
    if (hour >= 15 && hour < 18) return "3PM - 6PM";
    if (hour >= 18 && hour < 21) return "6PM - 9PM";
    if (hour >= 21 && hour < 24) return "9PM - 12AM";
    return "12AM - 6AM";
  };

  const getTimeEmoji = (timeRange: string): string => {
    if (timeRange.includes("6AM")) return "🌅";
    if (timeRange.includes("9AM")) return "☀️";
    if (timeRange.includes("12PM")) return "🌞";
    if (timeRange.includes("3PM")) return "🌤️";
    if (timeRange.includes("6PM")) return "🌆";
    if (timeRange.includes("9PM")) return "🌃";
    return "🌙";
  };

  const getMotivationalMessage = () => {
    const subjects = ["Chemistry", "Mathematics", "Physics", "Biology", "English"];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    return `Try reviewing ${randomSubject} during this window for maximum impact.`;
  };

  if (loading) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-pink-950/20 border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-2 left-2">
          <Clock className="h-5 w-5 text-indigo-500" />
        </div>
        <CardContent className="pt-12 pb-6 px-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gradient-to-r from-indigo-200/50 to-purple-200/50 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasEnoughData) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-950/20 dark:via-gray-950/20 dark:to-zinc-950/20 border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-gray-500/5 to-zinc-500/5" />
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-2xl" />
        <div className="absolute top-2 left-2">
          <Clock className="h-5 w-5 text-slate-500" />
        </div>
        <CardContent className="pt-12 pb-6 px-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 mx-auto">
              <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                🧠 Learning Pattern Analysis
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete more practice sessions to discover your optimal study times
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20 border-0 shadow-lg group hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/10 to-emerald-500/10 rounded-full blur-xl" />
      
      {/* Floating orbs animation */}
      <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-60" />
      <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce opacity-40" />
      
      <div className="absolute top-2 left-2 group-hover:scale-110 transition-transform duration-300">
        <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={analyzeOptimalTimes}
          disabled={isRefreshing}
          className="h-8 w-8 p-0 hover:bg-white/50 dark:hover:bg-gray-800/50"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-600 dark:text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="pt-12 pb-6 px-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl">{getTimeEmoji(analysis?.timeRange || "")}</span>
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300 bg-clip-text text-transparent">
                  You learn best between
                </p>
                <p className="text-xl font-bold text-emerald-800 dark:text-emerald-200">
                  {analysis?.timeRange}
                </p>
              </div>
            </div>
            
            {analysis && analysis.improvement > 0 && (
              <div className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/30 mb-3">
                <Sparkles className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                  You get {analysis.improvement}% more correct answers during this time!
                </span>
              </div>
            )}
          </div>
          
          <div className="p-3 rounded-lg bg-gradient-to-r from-white/60 to-white/40 dark:from-gray-800/60 dark:to-gray-800/40 backdrop-blur-sm border border-white/20 shadow-inner">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <span className="text-sm font-medium text-teal-700 dark:text-teal-300">AI Insight</span>
            </div>
            <p className="text-xs text-teal-600 dark:text-teal-400 leading-relaxed">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};