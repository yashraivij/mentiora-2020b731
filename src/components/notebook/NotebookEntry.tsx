import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Target, Clock, ExternalLink, Brain, AlertCircle, Crown, Lock } from "lucide-react";
import { format } from "date-fns";

// Safe text formatting function to prevent XSS
const formatBoldText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part.replace(/\*/g, '');
  });
};

interface NotebookEntryProps {
  entry: {
    id: string;
    subject: string;
    paper: string;
    topic: string;
    subtopic: string;
    question_label: string;
    confidence_level: string;
    what_tripped_up: string;
    fix_sentence: string;
    bulletproof_notes: string[];
    mini_example?: string;
    keywords: string[];
    spec_link: string;
    next_step_suggestion: string;
    skill_type: string;
    bloom_level: string;
    mark_loss: number;
    created_at: string;
  };
  onUpgradeClick?: () => void;
}

export const NotebookEntry = ({ entry, onUpgradeClick }: NotebookEntryProps) => {
  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getSkillIcon = (skillType: string) => {
    switch (skillType.toLowerCase()) {
      case 'calc': return <Target className="h-4 w-4" />;
      case 'graph': return <Brain className="h-4 w-4" />;
      case 'define': return <BookOpen className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <Card className="mb-6 border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-foreground mb-2">
              {entry.subject} → {entry.topic}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-3">
              {entry.question_label}
            </CardDescription>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                className={`${getConfidenceColor(entry.confidence_level)} border-0 font-medium`}
              >
                {entry.confidence_level} Confidence
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                {getSkillIcon(entry.skill_type)}
                {entry.skill_type.charAt(0).toUpperCase() + entry.skill_type.slice(1)}
              </Badge>
              <Badge variant="secondary">
                -{entry.mark_loss} marks
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(entry.created_at), 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 relative">
        {/* What Tripped Me Up */}
        <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800/30 filter blur-sm">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            What Tripped Me Up
          </h4>
          <p className="text-red-700 dark:text-red-200 text-sm">{entry.what_tripped_up}</p>
        </div>

        {/* Fix Sentence */}
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800/30 filter blur-sm">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Fix in One Sentence
          </h4>
          <p className="text-green-700 dark:text-green-200 text-sm font-medium">{entry.fix_sentence}</p>
        </div>

        {/* Bulletproof Notes */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800/30 filter blur-sm">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Bulletproof Notes
          </h4>
          <ul className="space-y-2">
            {entry.bulletproof_notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700 dark:text-blue-200 text-sm">
                <span className="text-blue-500 dark:text-blue-400 mt-1">•</span>
                <span>{formatBoldText(note)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mini Example */}
        {entry.mini_example && (
          <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30 filter blur-sm">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mini Worked Example
            </h4>
            <p className="text-purple-700 dark:text-purple-200 text-sm whitespace-pre-wrap">
              {entry.mini_example?.replace(/\*/g, '')}
            </p>
          </div>
        )}

        {/* Keywords */}
        <div className="bg-gray-50 dark:bg-gray-950/20 p-4 rounded-lg border border-gray-200 dark:border-gray-800/30 filter blur-sm">
          <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {entry.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Step */}
        <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800/30 filter blur-sm">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Next Step
          </h4>
          <p className="text-amber-700 dark:text-amber-200 text-sm">{entry.next_step_suggestion}</p>
        </div>

        {/* Premium CTA Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 max-w-sm mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Premium Feature
            </h3>
            <p className="text-sm font-semibold text-muted-foreground mb-4 leading-relaxed">
              Turn 3-hour revision sessions into 30 minutes with instant notes
            </p>
            <Button 
              size="sm" 
              onClick={onUpgradeClick}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Crown className="h-3 w-3 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
