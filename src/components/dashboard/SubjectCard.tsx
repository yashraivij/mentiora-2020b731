
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Circle } from "lucide-react";

interface SubjectCardProps {
  subject: {
    id: string;
    name: string;
    color: string;
    topics: Array<{ id: string; name: string }>;
  };
  progress: Array<{
    subjectId: string;
    topicId: string;
    averageScore: number;
    attempts: number;
  }>;
  onStartPractice: (subjectId: string) => void;
}

export const SubjectCard = ({ subject, progress, onStartPractice }: SubjectCardProps) => {
  const subjectProgress = progress.filter(p => p.subjectId === subject.id);
  const averageScore = subjectProgress.length > 0 
    ? Math.round(subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length)
    : 0;
  
  const masteredTopics = subjectProgress.filter(p => p.averageScore >= 85).length;
  const weakTopics = subjectProgress.filter(p => p.averageScore < 70).length;
  const totalAttempted = subjectProgress.length;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-50 border-green-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/95 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${subject.color}`}></div>
            <CardTitle className="text-lg font-semibold text-slate-900">{subject.name}</CardTitle>
          </div>
          <div className={`px-3 py-1 rounded-full border-2 ${getScoreBg(averageScore)}`}>
            <span className={`text-sm font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={averageScore} className="h-2" />
        
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-sm font-semibold text-green-600">{masteredTopics}</span>
            </div>
            <p className="text-xs text-slate-500">Mastered</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-sm font-semibold text-red-600">{weakTopics}</span>
            </div>
            <p className="text-xs text-slate-500">Weak</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <Circle className="h-4 w-4 text-slate-400 mr-1" />
              <span className="text-sm font-semibold text-slate-600">{subject.topics.length - totalAttempted}</span>
            </div>
            <p className="text-xs text-slate-500">Untested</p>
          </div>
        </div>

        <Button 
          className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium" 
          onClick={() => onStartPractice(subject.id)}
        >
          Practice Now
        </Button>
      </CardContent>
    </Card>
  );
};
