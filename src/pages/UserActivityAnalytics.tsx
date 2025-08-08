import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Clock, Calendar, Activity, Eye, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  last_activity: string;
  user_email?: string;
}

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  created_at: string;
  user_email?: string;
}

const UserActivityAnalytics = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserSessions();
    fetchUserActivities();
  }, []);

  const fetchUserSessions = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase
        .from('study_sessions')
        .select(`
          id,
          user_id,
          started_at,
          ended_at,
          duration_minutes,
          created_at
        `)
        .order('started_at', { ascending: false })
        .limit(50);

      if (sessionError) {
        console.error('Error fetching sessions:', sessionError);
        return;
      }

      const sessionsWithEmails = await Promise.all(
        (sessionData || []).map(async (session) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', session.user_id)
              .single();
            
            return {
              ...session,
              last_activity: session.ended_at || session.started_at,
              user_email: profile?.email || 'Unknown'
            };
          } catch (error) {
            return {
              ...session,
              last_activity: session.ended_at || session.started_at,
              user_email: 'Unknown'
            };
          }
        })
      );

      setSessions(sessionsWithEmails);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
    }
  };

  const fetchUserActivities = async () => {
    try {
      const { data: activityData, error: activityError } = await supabase
        .from('daily_usage')
        .select(`
          id,
          user_id,
          date,
          activities_count,
          total_minutes,
          created_at
        `)
        .order('date', { ascending: false })
        .limit(100);

      if (activityError) {
        console.error('Error fetching activities:', activityError);
        setIsLoading(false);
        return;
      }

      const activitiesWithEmails = await Promise.all(
        (activityData || []).map(async (activity) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email')
              .eq('id', activity.user_id)
              .single();
            
            return {
              id: activity.id,
              user_id: activity.user_id,
              activity_type: `${activity.activities_count} activities (${activity.total_minutes}min)`,
              created_at: activity.date,
              user_email: profile?.email || 'Unknown'
            };
          } catch (error) {
            return {
              id: activity.id,
              user_id: activity.user_id,
              activity_type: `${activity.activities_count} activities`,
              created_at: activity.date,
              user_email: 'Unknown'
            };
          }
        })
      );

      setActivities(activitiesWithEmails);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveUsers = () => {
    const now = new Date();
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
    
    return sessions.filter(session => {
      const lastActivity = new Date(session.last_activity);
      return lastActivity > thirtyMinutesAgo && !session.ended_at;
    });
  };

  const getTodaysLogins = () => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(activity => 
      activity.created_at.startsWith(today)
    );
  };

  const getAverageSessionDuration = () => {
    const completedSessions = sessions.filter(s => s.duration_minutes);
    if (completedSessions.length === 0) return 0;
    
    const total = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    return Math.round(total / completedSessions.length);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'Active';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const activeUsers = getActiveUsers();
  const todaysLogins = getTodaysLogins();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading user activity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-foreground">User Activity Analytics</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <Users className="h-5 w-5 mr-2" />
                Active Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {activeUsers.length}
              </div>
              <p className="text-sm text-muted-foreground">Users online (last 30min)</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <LogIn className="h-5 w-5 mr-2" />
                Today's Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {todaysLogins.length}
              </div>
              <p className="text-sm text-muted-foreground">Unique daily activities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <Clock className="h-5 w-5 mr-2" />
                Avg Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatDuration(getAverageSessionDuration())}
              </div>
              <p className="text-sm text-muted-foreground">Average session length</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <Activity className="h-5 w-5 mr-2" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {sessions.length}
              </div>
              <p className="text-sm text-muted-foreground">Recent sessions tracked</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Recent User Sessions
              </CardTitle>
              <CardDescription>
                Latest user login sessions and durations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sessions.slice(0, 20).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={session.ended_at ? "secondary" : "default"}>
                          {session.ended_at ? "Ended" : "Active"}
                        </Badge>
                        <span className="font-medium text-sm">
                          {session.user_email}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started: {formatDateTime(session.started_at)}
                      </p>
                      {session.ended_at && (
                        <p className="text-xs text-muted-foreground">
                          Ended: {formatDateTime(session.ended_at)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {formatDuration(session.duration_minutes)}
                      </div>
                    </div>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No session data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Daily Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Daily Activity Log
              </CardTitle>
              <CardDescription>
                User activity and engagement by day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {activities.slice(0, 20).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {activity.user_email}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">
                        {activity.activity_type}
                      </div>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No activity data available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions for Supabase Auth Logs */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Viewing Supabase Auth Logs</CardTitle>
            <CardDescription>
              For detailed authentication logs, visit your Supabase dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Supabase Dashboard Access
                </h4>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <p>• Go to your Supabase project dashboard</p>
                  <p>• Navigate to Authentication → Users to see all user accounts</p>
                  <p>• Visit Logs → Auth logs to see detailed login/logout events</p>
                  <p>• Check Analytics → General to see user activity patterns</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                  Custom Analytics Data
                </h4>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <p>• This dashboard shows session data from your app's study_sessions table</p>
                  <p>• Daily usage data tracks user engagement and streaks</p>
                  <p>• Session durations are calculated when users end their study sessions</p>
                  <p>• Refresh this page to see the latest activity data</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserActivityAnalytics;