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
    <Card className="rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-border/30">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="rounded-xl bg-primary text-primary-foreground px-3 py-1 font-semibold">
                {entry.subject}
              </Badge>
              <Badge variant="outline" className="rounded-xl px-3 py-1 font-medium">
                {entry.paper}
              </Badge>
              <Badge 
                className={cn(
                  "rounded-xl px-3 py-1 font-medium",
                  entry.confidence_level.toLowerCase() === 'high' && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                  entry.confidence_level.toLowerCase() === 'medium' && "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
                  entry.confidence_level.toLowerCase() === 'low' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                )}
              >
                {entry.confidence_level} Confidence
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
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
              <span className="flex items-center gap-1.5 font-semibold text-red-600 dark:text-red-400">
                -{entry.mark_loss} mark{entry.mark_loss !== 1 ? 's' : ''} lost
              </span>
            </div>
          </div>
        </div>

        {/* What Tripped Me Up */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-base font-bold text-foreground">What Tripped Me Up</h4>
          </div>
          <BlurWrapper>
            <p className="text-sm text-foreground/80 leading-relaxed pl-10">{entry.what_tripped_up}</p>
          </BlurWrapper>
        </div>

        {/* Fix Sentence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-base font-bold text-foreground">The Fix</h4>
          </div>
          <BlurWrapper>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium pl-10">{entry.fix_sentence}</p>
          </BlurWrapper>
        </div>

        {/* Bulletproof Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <h4 className="text-base font-bold text-foreground">Bulletproof Notes</h4>
          </div>
          <BlurWrapper>
            <div className="space-y-2 pl-10">
              {entry.bulletproof_notes.map((note, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <div className="flex-shrink-0 h-5 w-5 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed flex-1">{note}</p>
                </div>
              ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Mini Example (if exists) */}
        {entry.mini_example && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="text-base font-bold text-foreground">Mini Example</h4>
            </div>
            <BlurWrapper>
              <div className="pl-10 p-4 bg-muted/50 rounded-xl border border-border">
                <p className="text-sm text-foreground/80 leading-relaxed font-mono">{entry.mini_example}</p>
              </div>
            </BlurWrapper>
          </div>
        )}

        {/* Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Tag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="text-base font-bold text-foreground">Key Terms</h4>
          </div>
          <BlurWrapper>
            <div className="flex flex-wrap gap-2 pl-10">
              {entry.keywords.map((keyword, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary"
                  className="rounded-lg px-3 py-1 text-xs font-medium"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Metadata Footer */}
        <div className="pt-6 border-t border-border/30 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BlurWrapper>
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Skill Type</p>
                <p className="text-sm font-bold text-foreground">{entry.skill_type}</p>
              </div>
            </div>
          </BlurWrapper>
          <BlurWrapper>
            <div className="flex items-center gap-2.5 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bloom Level</p>
                <p className="text-sm font-bold text-foreground">{entry.bloom_level}</p>
              </div>
            </div>
          </BlurWrapper>
        </div>

        {/* Next Steps */}
        <BlurWrapper>
          <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-foreground mb-1.5">Next Step</h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{entry.next_step_suggestion}</p>
              </div>
            </div>
          </div>
        </BlurWrapper>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="mt-6 p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-foreground mb-1">Unlock Full Access</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to Premium to unlock all notes, detailed insights, and personalized recommendations
                </p>
                <Button 
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm px-5"
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
