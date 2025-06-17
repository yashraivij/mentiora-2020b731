
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Circle, Pin, Calendar, ArrowRight } from "lucide-react";

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
  onTogglePin?: (subjectId: string) => void;
  isPinned?: boolean;
  lastActivity?: Date | null;
}

export const SubjectCard = ({ 
  subject, 
  progress, 
  onStartPractice, 
  onTogglePin, 
  isPinned = false, 
  lastActivity 
}: SubjectCardProps) => {
  const subjectProgress = progress.filter(p => p.subjectId === subject.id);
  const averageScore = subjectProgress.length > 0 
    ? Math.round(subjectProgress.reduce((sum, p) => sum + p.averageScore, 0) / subjectProgress.length)
    : 0;
  
  const masteredTopics = subjectProgress.filter(p => p.averageScore >= 85).length;
  const weakTopics = subjectProgress.filter(p => p.averageScore < 70).length;
  const totalAttempted = subjectProgress.length;

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const formatLastActivity = (date: Date | null) => {
    if (!date) return 'No activity yet';
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card 
      className="group relative overflow-hidden border-0 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer rounded-2xl"
      onClick={() => onStartPractice(subject.id)}
    >
      {/* Pin Button */}
      {onTogglePin && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity ${
            isPinned ? 'opacity-100 text-amber-500' : 'text-slate-400'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(subject.id);
          }}
        >
          <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
        </Button>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${subject.color} group-hover:scale-110 transition-transform`}></div>
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                {subject.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-slate-500">{averageScore}% accuracy</span>
                {totalAttempted > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{formatLastActivity(lastActivity)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full border ${getScoreBg(averageScore)}`}>
            <span className={`text-sm font-semibold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Progress 
          value={averageScore} 
          className="h-2 bg-slate-100" 
        />
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-sm font-semibold text-emerald-600">{masteredTopics}</span>
            </div>
            <p className="text-xs text-slate-500">Mastered</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
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

        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-slate-500">
            {subject.topics.length} topics available
          </div>
          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  );
};
