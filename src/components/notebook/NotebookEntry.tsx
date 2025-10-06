import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Target, Clock, ExternalLink, Brain, AlertCircle, Unlock, Crown } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
}

export const NotebookEntry = ({ entry }: NotebookEntryProps) => {
  const { isPremium } = useAuth();
  const navigate = useNavigate();
  
  const BlurSpan = ({ children }: { children: React.ReactNode }) => (
    <span className={!isPremium ? "blur-sm" : ""}>{children}</span>
  );
  
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
    <Card className="mb-4 sm:mb-6 border-l-4 border-l-primary shadow-lg hover:shadow-xl transition-shadow duration-300 mx-2 sm:mx-0">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg font-bold text-foreground mb-2 break-words">
              {entry.subject} → {entry.topic}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-3 break-words">
              {entry.question_label}
            </CardDescription>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <Badge 
                className={`${getConfidenceColor(entry.confidence_level)} border-0 font-medium text-xs sm:text-sm`}
              >
                {entry.confidence_level} Confidence
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 text-xs sm:text-sm">
                {getSkillIcon(entry.skill_type)}
                <span className="hidden sm:inline">{entry.skill_type.charAt(0).toUpperCase() + entry.skill_type.slice(1)}</span>
                <span className="sm:hidden">{entry.skill_type}</span>
              </Badge>
              <Badge variant="secondary" className="text-xs sm:text-sm">
                -{entry.mark_loss} marks
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{format(new Date(entry.created_at), 'MMM d, yyyy')}</span>
                <span className="sm:hidden">{format(new Date(entry.created_at), 'MMM d')}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
        {/* What Tripped Me Up */}
        <div className="bg-red-50 dark:bg-red-950/20 p-3 sm:p-4 rounded-lg border border-red-200 dark:border-red-800/30">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            What Tripped Me Up
          </h4>
          <p className="text-red-700 dark:text-red-200 text-sm break-words"><BlurSpan>{entry.what_tripped_up}</BlurSpan></p>
        </div>

        {/* Fix Sentence */}
        <div className="bg-green-50 dark:bg-green-950/20 p-3 sm:p-4 rounded-lg border border-green-200 dark:border-green-800/30">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Lightbulb className="h-4 w-4 flex-shrink-0" />
            Fix in One Sentence
          </h4>
          <p className="text-green-700 dark:text-green-200 text-sm font-medium break-words"><BlurSpan>{entry.fix_sentence}</BlurSpan></p>
        </div>

        {/* Bulletproof Notes */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 sm:p-4 rounded-lg border border-blue-200 dark:border-blue-800/30">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            Bulletproof Notes
          </h4>
          <ul className="space-y-2">
            {entry.bulletproof_notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700 dark:text-blue-200 text-sm">
                <span className="text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0">•</span>
                <span className="break-words"><BlurSpan>{formatBoldText(note)}</BlurSpan></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-blue-400 to-purple-500 text-white p-4 rounded-lg border-0 shadow-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Unlock className="h-4 w-4 text-white flex-shrink-0" />
              <h4 className="font-semibold text-white text-sm sm:text-base">
                Unlock Full Notes
              </h4>
            </div>
            <p className="text-white/90 text-xs sm:text-sm mb-3 break-words">
              Start your free trial to access complete revision notes and unlock all study features
            </p>
            <Button 
              onClick={() => navigate("/pricing")}
              size="sm" 
              className="w-full bg-card text-foreground hover:bg-muted font-bold py-3 rounded-2xl border border-border min-h-[44px]"
            >
              Start Free Trial
            </Button>
          </div>
        )}

        {/* Mini Example */}
        {entry.mini_example && (
          <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800/30">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mini Worked Example
            </h4>
            <p className="text-purple-700 dark:text-purple-200 text-sm whitespace-pre-wrap">
              <BlurSpan>{entry.mini_example?.replace(/\*/g, '')}</BlurSpan>
            </p>
          </div>
        )}

        {/* Keywords */}
        <div className="bg-gray-50 dark:bg-gray-950/20 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-800/30">
          <h4 className="font-semibold text-gray-800 dark:text-gray-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Brain className="h-4 w-4 flex-shrink-0" />
            Keywords
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {entry.keywords.map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs break-words">
                <BlurSpan>{keyword}</BlurSpan>
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Step */}
        <div className="bg-amber-50 dark:bg-amber-950/20 p-3 sm:p-4 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2 text-sm sm:text-base">
            <Target className="h-4 w-4 flex-shrink-0" />
            Next Step
          </h4>
          <p className="text-amber-700 dark:text-amber-200 text-sm break-words"><BlurSpan>{entry.next_step_suggestion}</BlurSpan></p>
        </div>

      </CardContent>
    </Card>
  );
};
