import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Lightbulb, Clock, AlertCircle, Crown, CheckCircle, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import katex from "katex";
import "katex/dist/katex.min.css";


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

// Render text with LaTeX support
const renderTextWithLatex = (text: string): React.ReactNode => {
  // Pattern to match inline LaTeX: \(...\) or $...$
  // Pattern to match display LaTeX: \[...\] or $$...$$
  const latexPattern = /(\\\(.*?\\\)|\\\[.*?\\\]|\$\$.*?\$\$|\$.*?\$)/g;
  
  const parts = text.split(latexPattern);
  
  return (
    <>
      {parts.map((part, index) => {
        // Check if this part is LaTeX
        if (!part) return null;
        
        // Inline LaTeX: \(...\) or $...$
        if ((part.startsWith('\\(') && part.endsWith('\\)')) || 
            (part.startsWith('$') && part.endsWith('$') && !part.startsWith('$$'))) {
          const latex = part.startsWith('\\(') 
            ? part.slice(2, -2) 
            : part.slice(1, -1);
          try {
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(latex, { throwOnError: false, displayMode: false })
                }}
              />
            );
          } catch (e) {
            return <span key={index}>{part}</span>;
          }
        }
        
        // Display LaTeX: \[...\] or $$...$$
        if ((part.startsWith('\\[') && part.endsWith('\\]')) || 
            (part.startsWith('$$') && part.endsWith('$$'))) {
          const latex = part.startsWith('\\[') 
            ? part.slice(2, -2) 
            : part.slice(2, -2);
          try {
            return (
              <div
                key={index}
                className="my-2"
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(latex, { throwOnError: false, displayMode: true })
                }}
              />
            );
          } catch (e) {
            return <span key={index}>{part}</span>;
          }
        }
        
        // Regular text
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};

export const NotebookEntry = ({ entry }: NotebookEntryProps) => {
  const { isPremium } = useAuth();
  
  // Clean markdown formatting from text
  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/\*/g, '')   // Remove italic markers
      .replace(/#{1,6}\s/g, '') // Remove heading markers
      .replace(/`/g, '')    // Remove code markers
      .replace(/^-\s+/, '') // Remove leading dash
      .trim();
  };

  // Filter out incomplete or textbook-related content
  const isValidNote = (note: string): boolean => {
    const cleaned = cleanMarkdown(note);
    // Filter out empty notes or notes that end with a colon (incomplete)
    if (!cleaned || cleaned.endsWith(':')) return false;
    return true;
  };

  const BlurWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={!isPremium ? "blur-sm select-none" : ""}>{children}</div>
  );

  return (
    <Card className="rounded-2xl overflow-hidden bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <CardContent className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-4 border-b border-[#E2E8F0]/30 dark:border-gray-700/30">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge 
                className={cn(
                  "rounded-lg px-2 py-0.5 font-medium shadow-sm text-xs",
                  entry.confidence_level.toLowerCase() === 'high' && "bg-[#16A34A] text-white",
                  entry.confidence_level.toLowerCase() === 'medium' && "bg-[#F59E0B] text-white",
                  entry.confidence_level.toLowerCase() === 'low' && "bg-[#EF4444] text-white"
                )}
              >
                {entry.confidence_level} Confidence
              </Badge>
            </div>
            <h3 className="text-base font-bold text-[#0F172A] dark:text-white leading-tight mt-1">
              {entry.question_label}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] dark:text-gray-400">
              <span className="flex items-center gap-1.5">
                <div className="h-1 w-1 rounded-full bg-[#0EA5E9]" />
                {entry.topic === entry.subtopic ? entry.topic : `${entry.topic} → ${entry.subtopic}`}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(entry.created_at)}
              </span>
              <span className="flex items-center gap-1 font-semibold text-[#EF4444]">
                -{entry.mark_loss} mark{entry.mark_loss !== 1 ? 's' : ''} lost
              </span>
            </div>
          </div>
        </div>

        {/* What Tripped Me Up */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/5">
              <AlertCircle className="h-4 w-4 text-[#EF4444]" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">What Went Wrong</h4>
          </div>
          <BlurWrapper>
            <div className="p-3 rounded-lg bg-[#FEF2F2] dark:bg-red-950/20 border border-[#EF4444]/20">
              <p className="text-sm text-[#1E293B] dark:text-gray-200 leading-relaxed font-medium">
                {renderTextWithLatex(cleanMarkdown(entry.what_tripped_up))}
              </p>
            </div>
          </BlurWrapper>
        </div>

        {/* Fix Sentence */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
              <CheckCircle className="h-4 w-4 text-[#16A34A]" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">The Solution</h4>
          </div>
          <BlurWrapper>
            <div className="p-3 rounded-lg bg-[#F0FDF4] dark:bg-green-950/20 border border-[#16A34A]/20">
              <p className="text-sm text-[#1E293B] dark:text-gray-200 leading-relaxed font-semibold">
                {renderTextWithLatex(cleanMarkdown(entry.fix_sentence))}
              </p>
            </div>
          </BlurWrapper>
        </div>

        {/* Bulletproof Notes */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
              <Lightbulb className="h-3.5 w-3.5 text-[#0EA5E9]" />
            </div>
            <h4 className="text-sm font-bold text-[#0F172A] dark:text-white">Key Points to Remember</h4>
          </div>
          <BlurWrapper>
            <div className="space-y-2.5 pl-1">
              {entry.bulletproof_notes
                .filter(isValidNote)
                .map((note, idx) => (
                  <div key={idx} className="flex gap-2.5 p-3 rounded-lg bg-white dark:bg-gray-800/50 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all duration-200 shadow-sm">
                    <div className="flex-shrink-0 h-6 w-6 rounded-md bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-[#1E293B] dark:text-gray-200 leading-relaxed flex-1 font-medium">
                      {renderTextWithLatex(cleanMarkdown(note))}
                    </p>
                  </div>
                ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="mt-4 p-6 rounded-2xl border-2 border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-sm">
            <div className="text-center space-y-3">
              <h4 className="text-base font-bold text-[#0F172A] dark:text-white">Unlock Full Access</h4>
              <p className="text-sm text-[#64748B] dark:text-gray-400 max-w-md mx-auto">
                Upgrade to Premium to unlock all notes, detailed insights, and personalized recommendations
              </p>
              <Button 
                className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/25 hover:shadow-xl hover:shadow-[#0EA5E9]/30 transition-all duration-300 font-medium"
                onClick={() => {/* Add premium upgrade logic */}}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
