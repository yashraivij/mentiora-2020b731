import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { curriculum } from "@/data/curriculum";

interface TopicMasteryGoal {
  id: string;
  goal_type: string;
  target_value: number;
  metadata?: any;
}

interface MasteryProgress {
  subjectId: string;
  subjectName: string;
  masteredToday: number;
  targetToday: number;
  masteredTopics: string[];
}

export function TopicMasteryDisplay() {
  const { user } = useAuth();
  const [masteryProgress, setMasteryProgress] = useState<MasteryProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadMasteryProgress();
    }
  }, [user?.id]);

  const loadMasteryProgress = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      // Get topic mastery goals
      const { data: goals, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('goal_type', 'daily_topic_mastery');

      if (goalsError) {
        console.error('Error loading mastery goals:', goalsError);
        return;
      }

      if (!goals || goals.length === 0) {
        setMasteryProgress([]);
        return;
      }

      // Get today's mastered topics
      const today = new Date().toISOString().split('T')[0];
      const { data: masteredData, error: masteredError } = await supabase
        .from('daily_topic_mastery')
        .select('subject_id, topic_id')
        .eq('user_id', user.id)
        .eq('date', today)
        .gte('score', 85);

      if (masteredError) {
        console.error('Error loading mastered topics:', masteredError);
        return;
      }

      // Group mastered topics by subject
      const masteredBySubject: Record<string, string[]> = {};
      masteredData?.forEach(record => {
        if (!masteredBySubject[record.subject_id]) {
          masteredBySubject[record.subject_id] = [];
        }
        masteredBySubject[record.subject_id].push(record.topic_id);
      });

      // Create progress for each goal
      const progress: MasteryProgress[] = goals.map(goal => {
        const metadata = goal.metadata || {};
        const subjectId = metadata.subject_id || '';
        const masteredTopics = masteredBySubject[subjectId] || [];
        
        return {
          subjectId,
          subjectName: metadata.subject_name || subjectId,
          masteredToday: masteredTopics.length,
          targetToday: goal.target_value,
          masteredTopics
        };
      });

      setMasteryProgress(progress);
    } catch (error) {
      console.error('Error loading mastery progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-foreground flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-600" />
            Daily Topic Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse text-muted-foreground">Loading mastery progress...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (masteryProgress.length === 0) {
    return null; // Don't show the component if no mastery goals exist
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">Daily Topic Mastery</CardTitle>
            <p className="text-sm text-muted-foreground">
              Track your topic mastery goals (85%+ score required)
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {masteryProgress.map((progress) => {
          const progressPercentage = Math.min((progress.masteredToday / progress.targetToday) * 100, 100);
          const isCompleted = progress.masteredToday >= progress.targetToday;
          
          return (
            <div 
              key={progress.subjectId} 
              className="p-4 rounded-2xl bg-background/50 dark:bg-card/30 border border-border/50 hover:bg-background/80 dark:hover:bg-card/50 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-emerald-500 to-green-600' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <Brain className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">
                        {progress.subjectName}
                      </span>
                      {isCompleted && (
                        <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 text-xs px-2 py-0.5">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {progress.masteredToday} / {progress.targetToday} topics mastered today
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
              </div>
              
              <Progress 
                value={progressPercentage} 
                className="h-2 bg-muted/50"
              />
              
              {progress.masteredTopics.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {progress.masteredTopics.slice(0, 3).map((topicId, index) => {
                    // Find topic name from curriculum
                    const subject = curriculum.find(s => s.id === progress.subjectId);
                    const topic = subject?.topics.find(t => t.id === topicId);
                    
                    return (
                      <Badge 
                        key={topicId} 
                        variant="outline" 
                        className="text-xs px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                      >
                        ✓ {topic?.name || topicId}
                      </Badge>
                    );
                  })}
                  {progress.masteredTopics.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{progress.masteredTopics.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}