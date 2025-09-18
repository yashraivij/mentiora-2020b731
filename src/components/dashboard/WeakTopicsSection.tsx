
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import { curriculum } from "@/data/curriculum";

interface WeakTopicsSectionProps {
  weakTopics: string[];
  userProgress: Array<{
    subjectId: string;
    topicId: string;
    averageScore: number;
    attempts: number;
  }>;
  onPractice: (subjectId: string, topicId: string) => void;
}

export const WeakTopicsSection = ({ weakTopics, userProgress, onPractice }: WeakTopicsSectionProps) => {
  const getTopicInfo = (topicId: string) => {
    for (const subject of curriculum) {
      const topic = subject.topics.find(t => t.id === topicId);
      if (topic) {
        return { subject, topic };
      }
    }
    return null;
  };

  const getTopicProgress = (topicId: string) => {
    return userProgress.find(p => p.topicId === topicId);
  };

  const getSubjectColor = (subjectId: string) => {
    // Return a color based on subject ID
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = subjectId.length % colors.length;
    return colors[index];
  };

  if (weakTopics.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Great Progress!</h3>
          <p className="text-muted-foreground">No weak topics identified. Keep practicing to maintain your streak!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-0 rounded-xl">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Focus Areas</h3>
          <p className="text-sm text-muted-foreground">Topics that need attention</p>
        </div>
        
        <div className="space-y-3">
          {weakTopics.slice(0, 5).map((topicId) => {
            const info = getTopicInfo(topicId);
            const progress = getTopicProgress(topicId);
            
            if (!info) return null;
            
            return (
              <div key={topicId} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{info.topic.name}</h4>
                  <p className="text-sm text-muted-foreground">{info.subject.name}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => onPractice(info.subject.id, topicId)}
                >
                  Practice
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
