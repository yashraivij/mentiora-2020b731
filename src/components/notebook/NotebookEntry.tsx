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
    <Card className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Gradient Header Background */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#3DB4E8] via-[#3DB4E8]/60 to-[#3DB4E8]/30" />
      
      <CardHeader className="pb-5 px-7 pt-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground mb-3 break-words">
              {entry.subject} → {entry.topic}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-4 break-words leading-relaxed">
              {entry.question_label}
            </CardDescription>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                className={`${getConfidenceColor(entry.confidence_level)} border-0 font-medium text-xs px-3 py-1 rounded-full`}
              >
                {entry.confidence_level} Confidence
              </Badge>
              <Badge className="bg-muted/80 dark:bg-muted text-foreground border-0 text-xs px-3 py-1 rounded-full">
                {getSkillIcon(entry.skill_type)}
                <span className="ml-1">{entry.skill_type.charAt(0).toUpperCase() + entry.skill_type.slice(1)}</span>
              </Badge>
              <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-0 text-xs px-3 py-1 rounded-full font-semibold">
                -{entry.mark_loss} marks
              </Badge>
              <Badge className="bg-muted/60 dark:bg-muted/40 text-muted-foreground border-0 text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {format(new Date(entry.created_at), 'MMM d, yyyy')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 px-7 pb-7">
        {/* What Tripped Me Up - Medly Style */}
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-red-50/50 dark:from-red-950/20 dark:to-red-900/10 p-5 border border-red-200/50 dark:border-red-800/30">
          <h4 className="font-semibold text-red-800 dark:text-red-300 mb-3 flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            </div>
            What Tripped Me Up
          </h4>
          <p className="text-red-900 dark:text-red-200 text-sm break-words leading-relaxed ml-10"><BlurSpan>{entry.what_tripped_up}</BlurSpan></p>
        </div>

        {/* Fix Sentence - Medly Style */}
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 dark:from-green-950/20 dark:to-green-900/10 p-5 border border-green-200/50 dark:border-green-800/30">
          <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
            </div>
            Fix in One Sentence
          </h4>
          <p className="text-green-900 dark:text-green-200 text-sm font-medium break-words leading-relaxed ml-10"><BlurSpan>{entry.fix_sentence}</BlurSpan></p>
        </div>

        {/* Bulletproof Notes - Medly Style */}
        <div className="rounded-xl bg-gradient-to-br from-[#3DB4E8]/10 to-[#3DB4E8]/5 dark:from-[#3DB4E8]/20 dark:to-[#3DB4E8]/10 p-5 border border-[#3DB4E8]/20 dark:border-[#3DB4E8]/30">
          <h4 className="font-semibold text-[#3DB4E8] dark:text-[#3DB4E8]/90 mb-4 flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-[#3DB4E8]/20 dark:bg-[#3DB4E8]/30 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-[#3DB4E8] flex-shrink-0" />
            </div>
            Bulletproof Notes
          </h4>
          <ul className="space-y-3 ml-10">
            {entry.bulletproof_notes.map((note, index) => (
              <li key={index} className="flex items-start gap-3 text-foreground text-sm">
                <span className="text-[#3DB4E8] mt-1 flex-shrink-0 font-bold">•</span>
                <span className="break-words leading-relaxed"><BlurSpan>{formatBoldText(note)}</BlurSpan></span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium CTA - Medly Style */}
        {!isPremium && (
          <div className="rounded-xl bg-gradient-to-br from-[#3DB4E8] to-[#3DB4E8]/80 text-white p-6 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Unlock className="h-5 w-5 flex-shrink-0" />
              </div>
              <h4 className="font-bold text-base">
                Unlock Full Notes
              </h4>
            </div>
            <p className="text-white/95 text-sm mb-4 max-w-md mx-auto">
              Start your free trial to access complete revision notes and boost your grades
            </p>
            <Button 
              onClick={() => navigate("/pricing")}
              className="w-full bg-white text-[#3DB4E8] hover:bg-white/90 font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Crown className="h-4 w-4 mr-2" />
              Start Free Trial
            </Button>
          </div>
        )}

        {/* Mini Example - Medly Style */}
        {entry.mini_example && (
          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/20 dark:to-purple-900/10 p-5 border border-purple-200/50 dark:border-purple-800/30">
            <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-3 flex items-center gap-2.5 text-sm">
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              Mini Worked Example
            </h4>
            <p className="text-purple-900 dark:text-purple-200 text-sm whitespace-pre-wrap break-words leading-relaxed ml-10">
              <BlurSpan>{entry.mini_example?.replace(/\*/g, '')}</BlurSpan>
            </p>
          </div>
        )}

        {/* Keywords - Medly Style */}
        <div className="rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 p-5 border border-border/50">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
              <Brain className="h-4 w-4 text-foreground/70 flex-shrink-0" />
            </div>
            Key Terms
          </h4>
          <div className="flex flex-wrap gap-2 ml-10">
            {entry.keywords.map((keyword, index) => (
              <Badge key={index} className="bg-background border border-border/50 text-foreground text-xs px-3 py-1.5 rounded-lg font-medium hover:border-[#3DB4E8]/50 transition-colors">
                <BlurSpan>{keyword}</BlurSpan>
              </Badge>
            ))}
          </div>
        </div>

        {/* Next Step - Medly Style */}
        <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-50/50 dark:from-amber-950/20 dark:to-amber-900/10 p-5 border border-amber-200/50 dark:border-amber-800/30">
          <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-3 flex items-center gap-2.5 text-sm">
            <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
              <Target className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
            </div>
            Next Step
          </h4>
          <p className="text-amber-900 dark:text-amber-200 text-sm break-words leading-relaxed ml-10"><BlurSpan>{entry.next_step_suggestion}</BlurSpan></p>
        </div>

      </CardContent>
    </Card>
  );
};
