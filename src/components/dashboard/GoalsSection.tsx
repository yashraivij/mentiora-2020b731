import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Clock, Play, Pause, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudySession {
  id: string;
  target_minutes: number;
  elapsed_minutes: number;
  is_active: boolean;
  created_at: string;
}

const STUDY_TIME_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export default function GoalsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<number>(15);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('goal_type', 'study_session')
        .gte('created_at', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const sessionData = data?.map(goal => ({
        id: goal.id,
        target_minutes: goal.target_value,
        elapsed_minutes: goal.current_value,
        is_active: goal.is_active,
        created_at: goal.created_at,
      })) || [];
      
      setSessions(sessionData);
      
      // Check if there's an active session
      const active = sessionData.find(s => s.is_active);
      if (active) {
        setActiveSession(active);
        setTimeRemaining(Math.max(0, (active.target_minutes - active.elapsed_minutes) * 60));
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const startStudySession = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert([{
          user_id: user.id,
          goal_type: 'study_session',
          target_value: selectedMinutes,
          current_value: 0,
          is_active: true,
        }])
        .select()
        .single();

      if (error) throw error;

      const newSession = {
        id: data.id,
        target_minutes: selectedMinutes,
        elapsed_minutes: 0,
        is_active: true,
        created_at: data.created_at,
      };

      setActiveSession(newSession);
      setTimeRemaining(selectedMinutes * 60);
      setIsRunning(true);
      setIsOpen(false);
      
      toast({ title: `Study session started for ${selectedMinutes} minutes!` });
      fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
      toast({ title: 'Error starting study session', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      const id = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            completeSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [isRunning, timeRemaining]);

  const completeSession = async () => {
    if (!activeSession) return;
    
    try {
      await supabase
        .from('user_goals')
        .update({ 
          is_active: false,
          current_value: activeSession.target_minutes 
        })
        .eq('id', activeSession.id);
      
      setActiveSession(null);
      setTimeRemaining(0);
      toast({ title: 'Study session completed! Great job!' });
      fetchSessions();
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const pauseSession = () => {
    setIsRunning(false);
  };

  const resumeSession = () => {
    setIsRunning(true);
  };

  const stopSession = async () => {
    if (!activeSession) return;
    
    try {
      const elapsedMinutes = Math.floor((activeSession.target_minutes * 60 - timeRemaining) / 60);
      await supabase
        .from('user_goals')
        .update({ 
          is_active: false,
          current_value: elapsedMinutes 
        })
        .eq('id', activeSession.id);
      
      setActiveSession(null);
      setTimeRemaining(0);
      setIsRunning(false);
      toast({ title: 'Study session stopped' });
      fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTodayMinutes = () => {
    return sessions
      .filter(s => !s.is_active)
      .reduce((total, s) => total + s.elapsed_minutes, 0);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Study Timer</h3>
            <p className="text-muted-foreground">Set study goals and track your time</p>
          </div>
        </div>
        
        {!activeSession && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Start Study Session
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Start Study Session
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-foreground text-sm font-medium">Choose study duration:</label>
                  <Select value={selectedMinutes.toString()} onValueChange={(value) => setSelectedMinutes(parseInt(value))}>
                    <SelectTrigger className="bg-background border-border mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {STUDY_TIME_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value.toString()} className="text-foreground">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={startStudySession} className="bg-primary hover:bg-primary/90">
                    Start Timer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="space-y-6">
        {/* Active Timer */}
        {activeSession && (
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-4">
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-muted-foreground mb-6">
                  {activeSession.target_minutes} minute study session
                </p>
                <div className="flex justify-center space-x-4">
                  {isRunning ? (
                    <Button onClick={pauseSession} variant="outline" size="lg">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeSession} className="bg-primary hover:bg-primary/90" size="lg">
                      <Play className="h-5 w-5 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={stopSession} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Stop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Today's Progress */}
        <Card className="bg-card/80 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-foreground">
              <Clock className="h-5 w-5" />
              <span>Today's Study Time</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              {getTodayMinutes()} minutes
            </div>
            <p className="text-muted-foreground">
              {sessions.filter(s => !s.is_active).length} sessions completed
            </p>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <Card className="bg-card/80 backdrop-blur-sm border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {session.target_minutes} min session
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {session.is_active ? (
                        <span className="text-primary font-medium">Active</span>
                      ) : (
                        <span>{session.elapsed_minutes} min completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {sessions.length === 0 && !activeSession && (
          <Card className="bg-card/60 backdrop-blur-sm border-border">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-muted/30 rounded-2xl w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">No Study Sessions Yet</h4>
              <p className="text-muted-foreground mb-4">
                Start your first study session to track your progress!
              </p>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-primary/80">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Your First Session
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}