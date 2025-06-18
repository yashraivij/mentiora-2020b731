
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, Circle, Pin, Calendar, ArrowRight, Sparkles } from "lucide-react";

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
    if (score >= 85) return 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200';
    if (score >= 70) return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
    return 'bg-gradient-to-r from-red-50 to-red-100 border-red-200';
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
      className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-3xl"
      onClick={() => onStartPractice(subject.id)}
    >
      {/* Premium Background Gradient */}
      <div className={`absolute inset-0 ${subject.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />

      {/* Pin Button with Premium Styling */}
      {onTogglePin && (
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl backdrop-blur-sm ${
            isPinned 
              ? 'opacity-100 text-amber-500 bg-amber-50/80 hover:bg-amber-100/80' 
              : 'text-slate-400 bg-white/50 hover:bg-white/80'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(subject.id);
          }}
        >
          <Pin className={`h-4 w-4 ${isPinned ? 'fill-current' : ''}`} />
        </Button>
      )}

      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${subject.color} shadow-lg group-hover:scale-125 transition-transform duration-300`}></div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                {subject.name}
              </CardTitle>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-sm font-semibold text-slate-600">{averageScore}% accuracy</span>
                {totalAttempted > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">{formatLastActivity(lastActivity)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-2xl border shadow-sm ${getScoreBg(averageScore)}`}>
            <span className={`text-sm font-bold ${getScoreColor(averageScore)}`}>
              {averageScore}%
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        <div className="space-y-3">
          <Progress 
            value={averageScore} 
            className="h-3 bg-slate-100 rounded-full shadow-inner" 
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-2 p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
              <span className="text-lg font-bold text-emerald-600">{masteredTopics}</span>
            </div>
            <p className="text-xs text-emerald-600 font-medium">Mastered</p>
          </div>
          
          <div className="text-center space-y-2 p-3 rounded-2xl bg-red-50/50 border border-red-100">
            <div className="flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-lg font-bold text-red-600">{weakTopics}</span>
            </div>
            <p className="text-xs text-red-600 font-medium">Weak</p>
          </div>
          
          <div className="text-center space-y-2 p-3 rounded-2xl bg-slate-50/50 border border-slate-200">
            <div className="flex items-center justify-center">
              <Circle className="h-4 w-4 text-slate-400 mr-1" />
              <span className="text-lg font-bold text-slate-600">{subject.topics.length - totalAttempted}</span>
            </div>
            <p className="text-xs text-slate-600 font-medium">Untested</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">
              {subject.topics.length} topics available
            </span>
          </div>
          <Button 
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-500 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onStartPractice(subject.id);
            }}
          >
            Start Practice
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>

      {/* Premium Border Glow */}
      <div className={`absolute inset-0 rounded-3xl ${subject.color} p-[1px] opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`}>
        <div className="w-full h-full bg-white rounded-3xl" />
      </div>
    </Card>
  );
};
