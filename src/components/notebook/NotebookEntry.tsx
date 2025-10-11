import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Target, Clock, AlertCircle, Crown, CheckCircle, FileText, Tag, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";


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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const NotebookEntry = ({ entry }: NotebookEntryProps) => {
  const { isPremium } = useAuth();
  
  const BlurWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={!isPremium ? "blur-sm select-none" : ""}>{children}</div>
  );

  return (
    <Card className="border border-border bg-card hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6 space-y-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-border">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary text-primary-foreground px-3 py-1 font-medium">
                {entry.subject}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 font-medium">
                {entry.paper}
              </Badge>
              <Badge 
                className={cn(
                  "px-3 py-1 font-medium",
                  entry.confidence_level.toLowerCase() === 'high' && "bg-green-500 text-white",
                  entry.confidence_level.toLowerCase() === 'medium' && "bg-yellow-500 text-white",
                  entry.confidence_level.toLowerCase() === 'low' && "bg-red-500 text-white"
                )}
              >
                {entry.confidence_level} Confidence
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {entry.question_label}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {entry.topic} → {entry.subtopic}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(entry.created_at)}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-red-500">
                -{entry.mark_loss} mark{entry.mark_loss !== 1 ? 's' : ''} lost
              </span>
            </div>
          </div>
        </div>

        {/* What Tripped Me Up */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">What Tripped Me Up</h4>
          </div>
          <BlurWrapper>
            <p className="text-sm text-muted-foreground leading-relaxed pl-10">{entry.what_tripped_up}</p>
          </BlurWrapper>
        </div>

        {/* Fix Sentence */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">The Fix</h4>
          </div>
          <BlurWrapper>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium pl-10">{entry.fix_sentence}</p>
          </BlurWrapper>
        </div>

        {/* Bulletproof Notes */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Bulletproof Notes</h4>
          </div>
          <BlurWrapper>
            <div className="space-y-2 pl-10">
              {entry.bulletproof_notes.map((note, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-shrink-0 h-5 w-5 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{note}</p>
                </div>
              ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Mini Example (if exists) */}
        {entry.mini_example && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                <FileText className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <h4 className="text-sm font-semibold text-foreground">Mini Example</h4>
            </div>
            <BlurWrapper>
              <div className="pl-10 p-4 bg-muted rounded-lg border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed font-mono">{entry.mini_example}</p>
              </div>
            </BlurWrapper>
          </div>
        )}

        {/* Keywords */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-sm font-semibold text-foreground">Key Terms</h4>
          </div>
          <BlurWrapper>
            <div className="flex flex-wrap gap-2 pl-10">
              {entry.keywords.map((keyword, idx) => (
                <Badge 
                  key={idx} 
                  className="bg-purple-500 text-white px-3 py-1 text-xs font-medium"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Metadata Footer */}
        <div className="pt-5 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BlurWrapper>
            <div className="flex items-center gap-2.5 p-4 rounded-lg bg-muted border border-border">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skill Type</p>
                <p className="text-sm font-semibold text-foreground">{entry.skill_type}</p>
              </div>
            </div>
          </BlurWrapper>
          <BlurWrapper>
            <div className="flex items-center gap-2.5 p-4 rounded-lg bg-muted border border-border">
              <div className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bloom Level</p>
                <p className="text-sm font-semibold text-foreground">{entry.bloom_level}</p>
              </div>
            </div>
          </BlurWrapper>
        </div>

        {/* Next Steps */}
        <BlurWrapper>
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <Target className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">Next Step</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{entry.next_step_suggestion}</p>
              </div>
            </div>
          </div>
        </BlurWrapper>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="mt-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-base font-semibold text-foreground mb-1">Unlock Full Access</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Premium to unlock all notes and insights
                </p>
                <Button 
                  className="font-medium"
                  onClick={() => {/* Add premium upgrade logic */}}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
