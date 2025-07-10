import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Target, Plus, Calendar, CheckCircle, Trophy, Trash2, Play, Pause, Square } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

const PRESET_TIMES = [
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
  { value: 90, label: "1.5 hours" },
  { value: 120, label: "2 hours" }
];

export function GoalsSection() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadGoals();
      loadTodayStudyTime();
    }
  }, [user?.id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const loadGoals = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('goal_type', 'daily_study_time');

      if (error) {
        console.error('Error loading goals:', error);
        return;
      }

      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const loadTodayStudyTime = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('study_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('started_at', `${today}T00:00:00`)
        .lt('started_at', `${today}T23:59:59`)
        .not('duration_minutes', 'is', null);

      if (error) {
        console.error('Error loading study time:', error);
        return;
      }

      const totalMinutes = data?.reduce((sum, session) => sum + (session.duration_minutes || 0), 0) || 0;
      setTodayStudyTime(totalMinutes);
    } catch (error) {
      console.error('Error loading study time:', error);
    }
  };

  const createGoal = async () => {
    if (!user?.id || !selectedDuration) return;

    setLoading(true);
    try {
      const targetMinutes = parseInt(selectedDuration);
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          goal_type: 'daily_study_time',
          target_value: targetMinutes,
          current_value: 0,
          start_date: today,
          is_active: true
        });

      if (error) {
        console.error('Error creating goal:', error);
        toast.error('Failed to create goal');
        return;
      }

      toast.success('Study goal created successfully! Click Start Timer to begin studying.');
      setIsDialogOpen(false);
      setSelectedDuration("");
      loadGoals();
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          mode: 'revision',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error starting session:', error);
        toast.error('Failed to start study session');
        return;
      }

      setCurrentSessionId(data.id);
      setIsTimerRunning(true);
      setTimerSeconds(0);
      toast.success('Study timer started!');
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Failed to start timer');
    }
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
    toast.info('Timer paused');
  };

  const stopTimer = async () => {
    if (!user?.id || !currentSessionId) return;

    try {
      const durationMinutes = Math.floor(timerSeconds / 60);
      
      const { error } = await supabase
        .from('study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', currentSessionId);

      if (error) {
        console.error('Error stopping session:', error);
        toast.error('Failed to stop study session');
        return;
      }

      setIsTimerRunning(false);
      setTimerSeconds(0);
      setCurrentSessionId(null);
      loadTodayStudyTime();
      toast.success(`Study session completed! You studied for ${durationMinutes} minutes.`);
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Failed to stop timer');
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ is_active: false })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting goal:', error);
        toast.error('Failed to delete goal');
        return;
      }

      toast.success('Goal deleted successfully');
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((todayStudyTime / goal.target_value) * 100, 100);
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const isGoalCompleted = (goal: Goal) => {
    return todayStudyTime >= goal.target_value;
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">Daily Study Goals</CardTitle>
              <CardDescription className="text-muted-foreground">
                Set and track your daily revision targets
              </CardDescription>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0 shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create Study Goal</DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Set a daily study time target to stay motivated and track your progress.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Daily Study Time Target
                  </label>
                  <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Choose study duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {PRESET_TIMES.map((time) => (
                        <SelectItem key={time.value} value={time.value.toString()} className="text-foreground hover:bg-accent">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{time.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-muted-foreground">
                    Cancel
                  </Button>
                  <Button 
                    onClick={createGoal} 
                    disabled={!selectedDuration || loading}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
                  >
                    {loading ? "Creating..." : "Create Goal"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-muted/30 to-muted/20 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm mb-4">No study goals set yet</p>
            <p className="text-xs text-muted-foreground/80">Create your first goal to start tracking your daily study progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const progress = getProgressPercentage(goal);
              const completed = isGoalCompleted(goal);
              
              return (
                <div key={goal.id} className="p-4 rounded-2xl bg-background/50 dark:bg-card/30 border border-border/50 hover:bg-background/80 dark:hover:bg-card/50 transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                        completed 
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        {completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {formatTime(goal.target_value)} daily
                          </span>
                          {completed && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs px-2 py-0.5">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(todayStudyTime)} / {formatTime(goal.target_value)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-foreground">
                        {Math.round(progress)}%
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteGoal(goal.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <Progress 
                    value={progress} 
                    className="h-2 bg-muted/50"
                  />
                </div>
              );
            })}
          </div>
        )}
        
        {/* Study Timer Section */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200/50 dark:border-green-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Study Timer
                </span>
                <div className="text-2xl font-mono font-bold text-green-800 dark:text-green-200">
                  {formatTimerDisplay(timerSeconds)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!isTimerRunning && !currentSessionId ? (
                <Button 
                  onClick={startTimer}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-1" />
                  Start
                </Button>
              ) : (
                <>
                  {isTimerRunning ? (
                    <Button 
                      onClick={pauseTimer}
                      variant="outline"
                      className="border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                      size="sm"
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setIsTimerRunning(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  <Button 
                    onClick={stopTimer}
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    size="sm"
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {todayStudyTime > 0 && (
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200/50 dark:border-blue-800/30">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Today's Study Time: {formatTime(todayStudyTime)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}