import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Target, Clock, BookOpen, Flame, Trophy, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
}

const GOAL_TYPES = {
  daily_study_minutes: { label: 'Daily Study Time (minutes)', icon: Clock },
  weekly_study_hours: { label: 'Weekly Study Time (hours)', icon: Clock },
  daily_questions: { label: 'Questions per Day', icon: BookOpen },
  weekly_questions: { label: 'Questions per Week', icon: BookOpen },
  study_streak: { label: 'Study Streak (days)', icon: Flame },
  subjects_per_week: { label: 'Subjects per Week', icon: Target },
};

export default function GoalsSection() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    goal_type: '',
    target_value: '',
    end_date: '',
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.goal_type || !formData.target_value) return;

    try {
      const goalData = {
        user_id: user.id,
        goal_type: formData.goal_type,
        target_value: parseFloat(formData.target_value),
        current_value: 0,
        end_date: formData.end_date || null,
        is_active: true,
      };

      if (editingGoal) {
        const { error } = await supabase
          .from('user_goals')
          .update(goalData)
          .eq('id', editingGoal.id);
        if (error) throw error;
        toast({ title: 'Goal updated successfully!' });
      } else {
        const { error } = await supabase
          .from('user_goals')
          .insert([goalData]);
        if (error) throw error;
        toast({ title: 'Goal created successfully!' });
      }

      setIsOpen(false);
      setEditingGoal(null);
      setFormData({ goal_type: '', target_value: '', end_date: '' });
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({ title: 'Error saving goal', variant: 'destructive' });
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      goal_type: goal.goal_type,
      target_value: goal.target_value.toString(),
      end_date: goal.end_date || '',
    });
    setIsOpen(true);
  };

  const handleDelete = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update({ is_active: false })
        .eq('id', goalId);

      if (error) throw error;
      toast({ title: 'Goal removed successfully!' });
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({ title: 'Error removing goal', variant: 'destructive' });
    }
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getProgressStatus = (percentage: number) => {
    if (percentage >= 100) return { color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (percentage >= 75) return { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    if (percentage >= 50) return { color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' };
    return { color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-900/30' };
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <Target className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">Revision Goals</h3>
            <p className="text-muted-foreground">Set and track your study objectives</p>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingGoal ? 'Edit Goal' : 'Create New Goal'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="goal_type" className="text-foreground">Goal Type</Label>
                <Select value={formData.goal_type} onValueChange={(value) => setFormData({ ...formData, goal_type: value })}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select a goal type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.entries(GOAL_TYPES).map(([key, { label }]) => (
                      <SelectItem key={key} value={key} className="text-foreground">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="target_value" className="text-foreground">Target Value</Label>
                <Input
                  id="target_value"
                  type="number"
                  min="1"
                  value={formData.target_value}
                  onChange={(e) => setFormData({ ...formData, target_value: e.target.value })}
                  className="bg-background border-border text-foreground"
                  placeholder="Enter target value"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="end_date" className="text-foreground">End Date (Optional)</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <Card className="bg-card/60 backdrop-blur-sm border-border">
          <CardContent className="p-8 text-center">
            <div className="p-4 bg-muted/30 rounded-2xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">No Goals Set</h4>
            <p className="text-muted-foreground mb-4">
              Start by setting your first revision goal to track your progress!
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-primary/80">
                  <Plus className="h-4 w-4 mr-2" />
                  Set Your First Goal
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const GoalIcon = GOAL_TYPES[goal.goal_type as keyof typeof GOAL_TYPES]?.icon || Target;
            const goalLabel = GOAL_TYPES[goal.goal_type as keyof typeof GOAL_TYPES]?.label || goal.goal_type;
            const percentage = getProgressPercentage(goal);
            const status = getProgressStatus(percentage);
            
            return (
              <Card key={goal.id} className="bg-card/80 backdrop-blur-sm border-border hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-xl ${status.bg}`}>
                        <GoalIcon className={`h-5 w-5 ${status.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-medium text-foreground">{goalLabel}</CardTitle>
                        {goal.end_date && (
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(goal.end_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(goal)} className="h-8 w-8 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(goal.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={`font-medium ${status.color}`}>
                        {goal.current_value} / {goal.target_value}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${status.color}`}>
                        {percentage.toFixed(0)}% Complete
                      </span>
                      {percentage >= 100 && (
                        <div className="flex items-center space-x-1">
                          <Trophy className="h-4 w-4 text-yellow-500" />
                          <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                            Achieved!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}