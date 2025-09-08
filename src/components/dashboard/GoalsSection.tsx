import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, Target, Plus, Calendar, CheckCircle, Trophy, Trash2, Play, Pause, Square, BookOpen, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { curriculum } from "@/data/curriculum";

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  metadata?: any;
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
  const [selectedGoalType, setSelectedGoalType] = useState<"daily_study_time" | "daily_topic_mastery">("daily_study_time");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [topicTarget, setTopicTarget] = useState<string>("");
  const [todayStudyTime, setTodayStudyTime] = useState(0);
  const [dailyTopicMastery, setDailyTopicMastery] = useState<Record<string, number>>({});
  
  // Timer states
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadGoals();
      loadTodayStudyTime();
      loadTodayTopicMastery();
    }
  }, [user?.id]);

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setIsPaused(false);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, isPaused, timeRemaining]);

  const loadGoals = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .in('goal_type', ['daily_study_time', 'daily_topic_mastery']);

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

  const loadTodayTopicMastery = async () => {
    if (!user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_topic_mastery')
        .select('subject_id')
        .eq('user_id', user.id)
        .eq('date', today)
        .gte('score', 85);

      if (error) {
        console.error('Error loading topic mastery:', error);
        return;
      }

      const masteryCount: Record<string, number> = {};
      data?.forEach(record => {
        masteryCount[record.subject_id] = (masteryCount[record.subject_id] || 0) + 1;
      });
      
      setDailyTopicMastery(masteryCount);
    } catch (error) {
      console.error('Error loading topic mastery:', error);
    }
  };

  const createGoal = async () => {
    if (!user?.id) return;

    if (selectedGoalType === "daily_study_time" && !selectedDuration) {
      toast.error('Please select a study time target');
      return;
    }

    if (selectedGoalType === "daily_topic_mastery" && (!selectedSubject || !topicTarget)) {
      toast.error('Please select a subject and topic target');
      return;
    }

    setLoading(true);
    try {
      let goalData;
      
      if (selectedGoalType === "daily_study_time") {
        goalData = {
          user_id: user.id,
          goal_type: 'daily_study_time',
          target_value: parseInt(selectedDuration),
          current_value: 0,
          start_date: new Date().toISOString().split('T')[0],
          is_active: true
        };
      } else {
        const subject = curriculum.find(s => s.id === selectedSubject);
        goalData = {
          user_id: user.id,
          goal_type: 'daily_topic_mastery',
          target_value: parseInt(topicTarget),
          current_value: 0,
          start_date: new Date().toISOString().split('T')[0],
          is_active: true,
          metadata: {
            subject_id: selectedSubject,
            subject_name: subject?.name || selectedSubject
          }
        };
      }

      const { error } = await supabase
        .from('user_goals')
        .insert(goalData);

      if (error) {
        console.error('Error creating goal:', error);
        toast.error('Failed to create goal');
        return;
      }

      setIsDialogOpen(false);
      setSelectedDuration("");
      setSelectedSubject("");
      setTopicTarget("");
      setSelectedGoalType("daily_study_time");
      loadGoals();
      loadTodayStudyTime();
      loadTodayTopicMastery();
      
      toast.success('Goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = async () => {
    if (!user?.id || !selectedDuration) return;

    setLoading(true);
    try {
      const durationMinutes = parseInt(selectedDuration);
      
      // Create a study session
      const { data: sessionData, error: sessionError } = await supabase
        .from('study_sessions')
        .insert({
          user_id: user.id,
          mode: 'chat',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        toast.error('Failed to start timer');
        return;
      }

      setCurrentSessionId(sessionData.id);
      setTimeRemaining(durationMinutes * 60); // Convert to seconds
      setIsTimerRunning(true);
      setIsPaused(false);
      setIsDialogOpen(false);
      setSelectedDuration("");
      
      toast.success(`Timer started for ${durationMinutes} minutes!`);
    } catch (error) {
      console.error('Error starting timer:', error);
      toast.error('Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const pauseTimer = () => {
    setIsPaused(true);
    toast.info('Timer paused');
  };

  const resumeTimer = () => {
    setIsPaused(false);
    toast.info('Timer resumed');
  };

  const stopTimer = async () => {
    if (!currentSessionId || !user?.id) return;

    try {
      const durationMinutes = Math.ceil((parseInt(selectedDuration || "0") * 60 - timeRemaining) / 60);
      
      await supabase
        .from('study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', currentSessionId);

      setIsTimerRunning(false);
      setIsPaused(false);
      setTimeRemaining(0);
      setCurrentSessionId(null);
      
      loadTodayStudyTime();
      loadTodayTopicMastery();
      toast.info('Timer stopped');
    } catch (error) {
      console.error('Error stopping timer:', error);
      toast.error('Failed to stop timer');
    }
  };

  const completeSession = async () => {
    if (!currentSessionId || !user?.id) return;

    try {
      const durationMinutes = parseInt(selectedDuration || "0");
      
      await supabase
        .from('study_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_minutes: durationMinutes
        })
        .eq('id', currentSessionId);

      setCurrentSessionId(null);
      loadTodayStudyTime();
      loadTodayTopicMastery();
      toast.success('Study session completed! 🎉');
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const formatTimerDisplay = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    if (goal.goal_type === 'daily_study_time') {
      return Math.min((todayStudyTime / goal.target_value) * 100, 100);
    } else if (goal.goal_type === 'daily_topic_mastery') {
      const metadata = goal.metadata || {};
      const subjectId = metadata.subject_id;
      const currentMastery = subjectId ? (dailyTopicMastery[subjectId] || 0) : 0;
      return Math.min((currentMastery / goal.target_value) * 100, 100);
    }
    return 0;
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const isGoalCompleted = (goal: Goal) => {
    if (goal.goal_type === 'daily_study_time') {
      return todayStudyTime >= goal.target_value;
    } else if (goal.goal_type === 'daily_topic_mastery') {
      const metadata = goal.metadata || {};
      const subjectId = metadata.subject_id;
      const currentMastery = subjectId ? (dailyTopicMastery[subjectId] || 0) : 0;
      return currentMastery >= goal.target_value;
    }
    return false;
  };

  return (
    <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-all duration-300">
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
                  Set daily targets to stay motivated and track your progress.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Goal Type
                  </label>
                  <Select value={selectedGoalType} onValueChange={(value: "daily_study_time" | "daily_topic_mastery") => setSelectedGoalType(value)}>
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Choose goal type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="daily_study_time" className="text-foreground hover:bg-accent">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Daily Study Time</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="daily_topic_mastery" className="text-foreground hover:bg-accent">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-muted-foreground" />
                          <span>Daily Topic Mastery</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedGoalType === "daily_study_time" && (
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
                )}

                {selectedGoalType === "daily_topic_mastery" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Subject
                      </label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger className="bg-background border-border text-foreground">
                          <SelectValue placeholder="Choose subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {curriculum.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id} className="text-foreground hover:bg-accent">
                              <div className="flex items-center space-x-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span>{subject.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Topics to Master Today
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={topicTarget}
                        onChange={(e) => setTopicTarget(e.target.value)}
                        placeholder="e.g. 3"
                        className="bg-background border-border text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A topic is mastered when you score 85%+ on it
                      </p>
                    </div>
                  </>
                )}
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border text-muted-foreground">
                    Cancel
                  </Button>
                  {selectedGoalType === "daily_study_time" ? (
                    <Button 
                      onClick={startTimer} 
                      disabled={!selectedDuration || loading}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
                    >
                      {loading ? "Starting..." : "Start Timer"}
                    </Button>
                  ) : (
                    <Button 
                      onClick={createGoal} 
                      disabled={!selectedSubject || !topicTarget || loading}
                      className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white border-0"
                    >
                      {loading ? "Creating..." : "Create Goal"}
                    </Button>
                  )}
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
                <div key={goal.id} className="p-4 rounded-2xl bg-background/50 dark:bg-card/30 border border-border/50 hover:bg-background/80 dark:hover:bg-card/50 transition-all duration-200 w-full">
                  <div className="flex items-start justify-between mb-3 w-full">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${
                        completed 
                          ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                          : 'bg-gradient-to-br from-blue-500 to-cyan-600'
                      }`}>
                        {completed ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : goal.goal_type === 'daily_topic_mastery' ? (
                          <Brain className="h-4 w-4 text-white" />
                        ) : (
                          <Clock className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-medium text-foreground">
                            {goal.goal_type === 'daily_study_time' 
                              ? `${formatTime(goal.target_value)} daily`
                              : `${goal.target_value} topics daily`
                            }
                          </span>
                          {goal.goal_type === 'daily_topic_mastery' && (
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs px-2 py-0.5">
                                {goal.metadata?.subject_name || 'Subject'}
                              </Badge>
                              {completed && (
                                <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs px-2 py-0.5">
                                  <Trophy className="h-3 w-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                            </div>
                          )}
                          {goal.goal_type === 'daily_study_time' && completed && (
                            <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs px-2 py-0.5">
                              <Trophy className="h-3 w-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground block truncate">
                          {goal.goal_type === 'daily_study_time' 
                            ? `${formatTime(todayStudyTime)} / ${formatTime(goal.target_value)}`
                            : `${dailyTopicMastery[(goal.metadata || {}).subject_id || ''] || 0} / ${goal.target_value} topics mastered`
                          }
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {Math.round(progress)}%
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteGoal(goal.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
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
        
        {/* Timer Display */}
        {isTimerRunning && (
          <div className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                {formatTimerDisplay(timeRemaining)}
              </div>
              <div className="flex justify-center space-x-3">
                {!isPaused ? (
                  <Button 
                    onClick={pauseTimer}
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    onClick={resumeTimer}
                    variant="outline"
                    size="sm"
                    className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/30"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                )}
                <Button 
                  onClick={stopTimer}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
              <div className="text-sm text-emerald-600 dark:text-emerald-400">
                {isPaused ? 'Timer Paused' : 'Study Session Active'}
              </div>
            </div>
          </div>
        )}

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