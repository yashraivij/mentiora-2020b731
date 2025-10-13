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

  // Check if next step is generic/repetitive
  const isGenericNextStep = (suggestion: string): boolean => {
    const cleaned = cleanMarkdown(suggestion.toLowerCase());
    const genericPhrases = [
      'practice more questions',
      'practice questions',
      'do more practice',
      'keep practicing',
      'revise this topic',
      'review this',
      'go over',
    ];
    return genericPhrases.some(phrase => cleaned.includes(phrase)) && cleaned.length < 60;
  };

  // Get unique keywords and filter out empty ones, topic names, and subtopic names
  const uniqueKeywords = [...new Set(entry.keywords)]
    .filter(k => {
      if (!k || k.trim().length === 0) return false;
      const cleaned = k.toLowerCase().trim();
      const topic = entry.topic.toLowerCase().trim();
      const subtopic = entry.subtopic.toLowerCase().trim();
      // Filter out if keyword exactly matches topic or subtopic
      return cleaned !== topic && cleaned !== subtopic;
    });
  
  const BlurWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={!isPremium ? "blur-sm select-none" : ""}>{children}</div>
  );

  return (
    <Card className="rounded-3xl overflow-hidden bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-800 dark:to-gray-900 border border-[#E2E8F0]/50 dark:border-gray-700 shadow-sm hover:shadow-[0_16px_48px_rgba(14,165,233,0.15)] hover:-translate-y-1 transition-all duration-500">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-[#E2E8F0]/30 dark:border-gray-700/30">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="rounded-xl bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white px-3 py-1 font-semibold shadow-sm">
                {entry.subject}
              </Badge>
              <Badge variant="outline" className="rounded-xl border-[#E2E8F0]/50 dark:border-gray-700 px-3 py-1 font-medium text-[#64748B] dark:text-gray-400">
                {entry.paper}
              </Badge>
              <Badge 
                className={cn(
                  "rounded-xl px-3 py-1 font-medium shadow-sm",
                  entry.confidence_level.toLowerCase() === 'high' && "bg-[#16A34A] text-white",
                  entry.confidence_level.toLowerCase() === 'medium' && "bg-[#F59E0B] text-white",
                  entry.confidence_level.toLowerCase() === 'low' && "bg-[#EF4444] text-white"
                )}
              >
                {entry.confidence_level} Confidence
              </Badge>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white leading-tight mt-1">
              {entry.question_label}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B] dark:text-gray-400">
              <span className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0EA5E9]" />
                {entry.topic === entry.subtopic ? entry.topic : `${entry.topic} → ${entry.subtopic}`}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(entry.created_at)}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-[#EF4444]">
                -{entry.mark_loss} mark{entry.mark_loss !== 1 ? 's' : ''} lost
              </span>
            </div>
          </div>
        </div>

        {/* What Tripped Me Up */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#EF4444]/20 to-[#EF4444]/5">
              <AlertCircle className="h-5 w-5 text-[#EF4444]" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">What Went Wrong</h4>
          </div>
          <BlurWrapper>
            <div className="p-5 rounded-xl bg-[#FEF2F2] dark:bg-red-950/20 border border-[#EF4444]/20">
              <p className="text-base text-[#1E293B] dark:text-gray-200 leading-relaxed font-medium">
                {cleanMarkdown(entry.what_tripped_up)}
              </p>
            </div>
          </BlurWrapper>
        </div>

        {/* Fix Sentence */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#16A34A]/20 to-[#16A34A]/5">
              <CheckCircle className="h-5 w-5 text-[#16A34A]" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">The Solution</h4>
          </div>
          <BlurWrapper>
            <div className="p-5 rounded-xl bg-[#F0FDF4] dark:bg-green-950/20 border border-[#16A34A]/20">
              <p className="text-base text-[#1E293B] dark:text-gray-200 leading-relaxed font-semibold">
                {cleanMarkdown(entry.fix_sentence)}
              </p>
            </div>
          </BlurWrapper>
        </div>

        {/* Bulletproof Notes */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5">
              <Lightbulb className="h-4 w-4 text-[#0EA5E9]" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Key Points to Remember</h4>
          </div>
          <BlurWrapper>
            <div className="space-y-4 pl-2">
              {entry.bulletproof_notes
                .filter(isValidNote)
                .map((note, idx) => (
                  <div key={idx} className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-800/50 border border-[#0EA5E9]/20 hover:border-[#0EA5E9]/40 transition-all duration-200 shadow-sm hover:shadow-md">
                    <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {idx + 1}
                    </div>
                    <p className="text-base text-[#1E293B] dark:text-gray-200 leading-relaxed flex-1 font-medium">
                      {cleanMarkdown(note)}
                    </p>
                  </div>
                ))}
            </div>
          </BlurWrapper>
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-[#A855F7]/20 to-[#A855F7]/5">
              <Tag className="h-5 w-5 text-[#A855F7]" />
            </div>
            <h4 className="text-lg font-bold text-[#0F172A] dark:text-white">Key Terms to Know</h4>
          </div>
           <BlurWrapper>
             {uniqueKeywords.length > 0 ? (
               <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF] dark:from-purple-950/20 dark:to-purple-900/10 border border-[#A855F7]/20">
                 {uniqueKeywords.map((keyword, idx) => (
                   <Badge 
                     key={idx} 
                     className="rounded-lg bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white px-4 py-2 text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                   >
                     {keyword}
                   </Badge>
                 ))}
               </div>
             ) : (
               <div className="p-4 rounded-xl bg-gradient-to-br from-[#FAF5FF] to-[#F3E8FF] dark:from-purple-950/20 dark:to-purple-900/10 border border-[#A855F7]/20">
                 <p className="text-sm text-[#64748B] dark:text-gray-400 italic">Key terms will be generated for new notes</p>
               </div>
             )}
           </BlurWrapper>
        </div>

        {/* Next Steps */}
        <BlurWrapper>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/10 to-[#0EA5E9]/5 border border-[#0EA5E9]/20 dark:border-[#0EA5E9]/30">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center flex-shrink-0 shadow-md">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#0F172A] dark:text-white mb-1.5">Next Step</h4>
                <p className="text-sm text-[#475569] dark:text-gray-300 leading-relaxed">{cleanMarkdown(entry.next_step_suggestion)}</p>
              </div>
            </div>
          </div>
        </BlurWrapper>

        {/* Premium CTA for non-premium users */}
        {!isPremium && (
          <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-[#F59E0B]/10 to-[#F59E0B]/5 border border-[#F59E0B]/20 dark:border-[#F59E0B]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#F59E0B]/20 to-transparent rounded-full blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F59E0B]/80 flex items-center justify-center shadow-lg flex-shrink-0">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-[#0F172A] dark:text-white mb-1">Unlock Full Access</h4>
                <p className="text-sm text-[#64748B] dark:text-gray-400 mb-3">
                  Upgrade to Premium to unlock all notes, detailed insights, and personalized recommendations
                </p>
                <Button 
                  className="rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#F59E0B]/80 hover:from-[#F59E0B]/90 hover:to-[#F59E0B]/70 text-white shadow-lg shadow-[#F59E0B]/25 hover:shadow-xl hover:shadow-[#F59E0B]/30 transition-all duration-300 font-medium text-sm px-5"
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
