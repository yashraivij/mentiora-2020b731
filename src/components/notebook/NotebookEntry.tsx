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
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-4 px-6 pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2 break-words">
              {entry.subject} → {entry.topic}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mb-3 break-words">
              {entry.question_label}
            </CardDescription>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                className={`${getConfidenceColor(entry.confidence_level)} border-0 font-medium text-xs`}
              >
                {entry.confidence_level} Confidence
              </Badge>
              <Badge className="bg-gray-100 text-gray-700 border-0 text-xs">
                {getSkillIcon(entry.skill_type)}
                <span className="ml-1">{entry.skill_type.charAt(0).toUpperCase() + entry.skill_type.slice(1)}</span>
              </Badge>
              <Badge className="bg-red-50 text-red-700 border-0 text-xs">
                -{entry.mark_loss} marks
              </Badge>
              <Badge className="bg-gray-50 text-gray-600 border-0 text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {format(new Date(entry.created_at), 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 px-6 pb-6">
        {/* What Tripped Me Up */}
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            What Tripped Me Up
          </h4>
          <p className="text-red-700 text-sm break-words"><BlurSpan>{entry.what_tripped_up}</BlurSpan></p>
        </div>

        {/* Fix Sentence */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 flex-shrink-0" />
            Fix in One Sentence
          </h4>
          <p className="text-green-700 text-sm font-medium break-words"><BlurSpan>{entry.fix_sentence}</BlurSpan></p>
        </div>

        {/* Bulletproof Notes */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 flex-shrink-0" />
            Bulletproof Notes
          </h4>
          <ul className="space-y-2">
            {entry.bulletproof_notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700 text-sm">
                <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                <span className="break-words"><BlurSpan>{formatBoldText(note)}</BlurSpan></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="bg-[#3DB4E8] text-white p-4 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Unlock className="h-4 w-4 flex-shrink-0" />
              <h4 className="font-semibold text-sm">
                Unlock Full Notes
              </h4>
            </div>
            <p className="text-white/90 text-sm mb-3">
              Start your free trial to access complete revision notes
            </p>
            <Button 
              onClick={() => navigate("/pricing")}
              className="w-full bg-white text-[#3DB4E8] hover:bg-gray-100 font-semibold py-2 rounded-lg"
            >
              Start Free Trial
            </Button>
          </div>
        )}

        {/* Mini Example */}
        {entry.mini_example && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2 text-sm">
              <Target className="h-4 w-4" />
              Mini Worked Example
            </h4>
            <p className="text-purple-700 text-sm whitespace-pre-wrap">
              <BlurSpan>{entry.mini_example?.replace(/\*/g, '')}</BlurSpan>
            </p>
          </div>
        )}

        {/* Keywords */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 flex-shrink-0" />
            Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {entry.keywords.map((keyword, index) => (
              <Badge key={index} className="bg-white border border-gray-300 text-gray-700 text-xs">
                <BlurSpan>{keyword}</BlurSpan>
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Step */}
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
          <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 flex-shrink-0" />
            Next Step
          </h4>
          <p className="text-amber-700 text-sm break-words"><BlurSpan>{entry.next_step_suggestion}</BlurSpan></p>
        </div>

      </CardContent>
    </Card>
  );
};
