import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';

interface NotebookEntry {
  id: string;
  subject: string;
  paper: string;
  topic: string;
  subtopic: string;
  question_id: string;
  question_label: string;
  confidence_level: 'Low' | 'Medium' | 'High';
  what_tripped_up: string;
  fix_sentence: string;
  bulletproof_notes: string[];
  mini_example?: string;
  keywords: string[];
  spec_link: string;
  next_step_suggestion: string;
  mark_loss: number;
  skill_type: string;
  bloom_level: string;
  created_at: string;
  updated_at: string;
}

interface NotebookEntryProps {
  entry: NotebookEntry;
}

const getConfidenceIcon = (level: string) => {
  switch (level) {
    case 'Low': return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'Medium': return <HelpCircle className="h-4 w-4 text-warning" />;
    case 'High': return <CheckCircle className="h-4 w-4 text-success" />;
    default: return <HelpCircle className="h-4 w-4" />;
  }
};

const getConfidenceColor = (level: string) => {
  switch (level) {
    case 'Low': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
    case 'High': return 'bg-success/10 text-success border-success/20';
    default: return 'bg-muted text-muted-foreground';
  }
};

export function NotebookEntry({ entry }: NotebookEntryProps) {
  return (
    <Card className="premium-card border-2 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-medium">
                {entry.subject}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {entry.paper}
              </Badge>
              <Badge 
                variant="outline" 
                className={`${getConfidenceColor(entry.confidence_level)} flex items-center gap-1`}
              >
                {getConfidenceIcon(entry.confidence_level)}
                {entry.confidence_level}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-lg leading-tight">
                {entry.topic} → {entry.subtopic}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {entry.question_label}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {format(new Date(entry.created_at), 'MMM d, yyyy')}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs">
          <Badge variant="outline" className="bg-destructive/5 text-destructive">
            -{entry.mark_loss} marks
          </Badge>
          <span className="text-muted-foreground">{entry.skill_type}</span>
          <span className="text-muted-foreground">{entry.bloom_level}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* What tripped me up */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            What tripped me up
          </h4>
          <p className="text-sm bg-destructive/5 p-3 rounded-lg border border-destructive/20">
            {entry.what_tripped_up}
          </p>
        </div>

        {/* Fix in one sentence */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-success flex items-center gap-2">
            <Target className="h-4 w-4" />
            Fix in one sentence
          </h4>
          <p className="text-sm bg-success/5 p-3 rounded-lg border border-success/20 font-medium">
            {entry.fix_sentence}
          </p>
        </div>

        {/* Bulletproof notes */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Bulletproof Notes</h4>
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <ul className="space-y-1.5">
              {entry.bulletproof_notes.map((note, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className="text-primary font-bold mt-1">•</span>
                  <span dangerouslySetInnerHTML={{ __html: note }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mini example */}
        {entry.mini_example && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Mini Worked Example</h4>
            <div className="bg-muted/50 p-3 rounded-lg border font-mono text-sm">
              <pre className="whitespace-pre-wrap">{entry.mini_example}</pre>
            </div>
          </div>
        )}

        {/* Keywords */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Keywords</h4>
          <div className="flex flex-wrap gap-1">
            {entry.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Spec link and next step */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              <strong>Spec:</strong> {entry.spec_link}
            </span>
          </div>
          <p className="text-sm text-primary font-medium">
            <strong>Next step:</strong> {entry.next_step_suggestion}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}