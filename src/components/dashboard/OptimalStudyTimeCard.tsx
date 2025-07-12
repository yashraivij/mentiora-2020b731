import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Zap } from "lucide-react";
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
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Optimal Study Time</CardTitle>
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!hasEnoughData) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
        <CardHeader className="relative">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Optimal Study Time</CardTitle>
            <Badge variant="secondary" className="text-xs">Premium</Badge>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-center py-4">
            <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              Not enough data yet
            </p>
            <p className="text-xs text-muted-foreground">
              Complete more practice sessions to unlock AI-powered study time recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10" />
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-purple-600" />
          <CardTitle className="text-lg">Optimal Study Time</CardTitle>
          <Badge variant="secondary" className="text-xs">Premium</Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getTimeEmoji(analysis?.timeRange || "")}</span>
            <div>
              <p className="font-medium">
                You learn best between {analysis?.timeRange}
              </p>
              <p className="text-sm text-muted-foreground">
                {analysis?.accuracy}% average accuracy • {analysis?.sessionCount} sessions
              </p>
            </div>
          </div>
          
          {analysis && analysis.improvement > 5 && (
            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 rounded-lg p-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-400">
                You're {analysis.improvement}% more accurate during this time!
              </span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            💡 Try scheduling your revision sessions around this time for optimal learning
          </p>
        </div>
      </CardContent>
    </Card>
  );
};