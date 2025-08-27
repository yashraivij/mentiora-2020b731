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
      <Card className="relative overflow-hidden bg-gradient-to-br from-violet-100 via-purple-100 to-fuchsia-100 dark:from-violet-900/40 dark:via-purple-900/40 dark:to-fuchsia-900/40 border-0 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute top-2 left-2 p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg animate-pulse">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <CardContent className="pt-12 pb-6 px-6">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gradient-to-r from-violet-300/60 to-purple-300/60 rounded-lg w-3/4 shimmer"></div>
            <div className="h-4 bg-gradient-to-r from-purple-300/40 to-fuchsia-300/40 rounded-lg w-1/2 shimmer"></div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-gradient-to-r from-pink-300/50 to-rose-300/50 rounded-full shimmer"></div>
              <div className="h-6 w-12 bg-gradient-to-r from-cyan-300/50 to-blue-300/50 rounded-full shimmer"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasEnoughData) {
    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-red-900/40 border-0 shadow-xl group hover:shadow-2xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10" />
        <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-yellow-400/25 to-orange-500/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-pink-400/20 to-rose-500/20 rounded-full blur-2xl animate-bounce" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full animate-pulse opacity-80" />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-bounce opacity-60" />
        
        <div className="absolute top-2 left-2 p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <Clock className="h-5 w-5 text-white" />
        </div>
        
        <CardContent className="pt-12 pb-6 px-6">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-800/50 dark:to-orange-800/50 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-amber-700 dark:text-amber-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-bounce opacity-80" />
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-60" />
            </div>
            
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 dark:from-gray-800/80 dark:to-gray-800/60 backdrop-blur-sm border border-white/30 shadow-lg">
                <p className="text-sm font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  🧠 Learning Pattern Discovery
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  Complete more practice sessions to unlock your personalized peak learning hours with advanced analysis
                </p>
              </div>
              
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/60 dark:border-amber-800/40">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">Premium Intelligence</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                  Discover when your brain learns best with time optimization
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 border-0 shadow-xl group hover:shadow-2xl transition-all duration-500 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/15 via-teal-500/15 to-cyan-500/15" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-400/20 to-emerald-500/20 rounded-full blur-2xl animate-bounce" />
      <div className="absolute top-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-xl" />
      
      {/* Enhanced floating orbs animation */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full animate-pulse opacity-80" />
      <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full animate-bounce opacity-60" />
      <div className="absolute top-2/3 right-1/3 w-2.5 h-2.5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full animate-pulse opacity-70" />
      
      <div className="absolute top-2 left-2 p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Clock className="h-5 w-5 text-white" />
      </div>
      
      <div className="absolute top-2 right-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={analyzeOptimalTimes}
          disabled={isRefreshing}
          className="h-8 w-8 p-0 hover:bg-white/60 dark:hover:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-white/30"
        >
          <RefreshCw className={`h-4 w-4 text-emerald-700 dark:text-emerald-300 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <CardContent className="pt-12 pb-6 px-6">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-3 rounded-full bg-gradient-to-br from-amber-200 to-orange-200 dark:from-amber-800/60 dark:to-orange-800/60 shadow-lg">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{getTimeEmoji(analysis?.timeRange || "")}</span>
              </div>
              <div className="text-left">
                <p className="text-base font-bold bg-gradient-to-r from-emerald-800 via-teal-800 to-cyan-800 dark:from-emerald-200 dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                  You learn best between
                </p>
                <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
                  {analysis?.timeRange}
                </p>
              </div>
            </div>
            
            {analysis && analysis.improvement > 0 && (
              <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800/60 dark:to-teal-800/60 border border-emerald-300/60 dark:border-emerald-700/40 mb-4 shadow-lg">
                <Sparkles className="h-4 w-4 text-emerald-700 dark:text-emerald-300 animate-pulse" />
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-200">
                  You get {analysis.improvement}% more correct answers during this time!
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-white/70 to-white/50 dark:from-gray-800/70 dark:to-gray-800/50 backdrop-blur-sm border border-white/40 shadow-xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-teal-800 dark:text-teal-200">Smart Insight</span>
            </div>
            <p className="text-xs text-teal-700 dark:text-teal-300 leading-relaxed font-medium">
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};