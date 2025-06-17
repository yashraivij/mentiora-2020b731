
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

  if (weakTopics.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Great Progress!</h3>
          <p className="text-slate-600">No weak topics identified. Keep practicing to maintain your streak!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Priority Focus Areas
        </CardTitle>
        <p className="text-sm text-slate-600">Topics scoring below 70% - focus here for maximum improvement</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {weakTopics.slice(0, 5).map((topicId) => {
            const info = getTopicInfo(topicId);
            const progress = getTopicProgress(topicId);
            
            if (!info) return null;
            
            return (
              <div key={topicId} className="group p-4 rounded-lg border border-red-100 bg-gradient-to-r from-red-50 to-orange-50 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${info.subject.color}`}></div>
                      <h4 className="font-medium text-slate-900">{info.topic.name}</h4>
                      <Badge variant="outline" className="text-xs">{info.subject.name}</Badge>
                    </div>
                    {progress && (
                      <p className="text-xs text-slate-500">
                        {progress.attempts} attempts • {progress.averageScore}% average
                      </p>
                    )}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => onPractice(info.subject.id, topicId)}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Practice
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
