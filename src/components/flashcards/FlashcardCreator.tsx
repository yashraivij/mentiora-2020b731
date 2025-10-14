import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles, Plus, Loader2 } from "lucide-react";

interface FlashcardCreatorProps {
  onSetCreated: () => void;
  userSubjects?: Array<{ subject_name: string; exam_board: string }>;
}

interface GeneratedFlashcard {
  front: string;
  back: string;
}

const subjects = [
  { id: "physics", name: "Physics" },
  { id: "chemistry", name: "Chemistry" },
  { id: "biology", name: "Biology" },
  { id: "mathematics", name: "Mathematics" },
  { id: "english-language", name: "English Language" },
  { id: "english-literature", name: "English Literature" },
  { id: "geography", name: "Geography" },
  { id: "history", name: "History" },
  { id: "religious-studies", name: "Religious Studies" },
  { id: "business", name: "Business Studies" },
];

const examBoards = [
  { id: "AQA", name: "AQA" },
  { id: "Edexcel", name: "Edexcel" },
  { id: "OCR", name: "OCR" },
  { id: "WJEC", name: "WJEC" },
];

const subjectExamples = {
  physics: {
    normal: "What is Newton's first law?",
    enhanced: "State and explain Newton's first law of motion. (3 marks)"
  },
  chemistry: {
    normal: "What is a covalent bond?",
    enhanced: "Describe the formation of a covalent bond and give an example. (4 marks)"
  },
  biology: {
    normal: "What is photosynthesis?",
    enhanced: "Explain the process of photosynthesis. (4 marks)"
  },
  mathematics: {
    normal: "What is the quadratic formula?",
    enhanced: "State the quadratic formula and solve: 2x² + 5x - 3 = 0. (6 marks)"
  },
  "english-language": {
    normal: "What is a metaphor?",
    enhanced: "Identify and analyze the effect of metaphors in the given text. (8 marks)"
  },
  "english-literature": {
    normal: "Who wrote Romeo and Juliet?",
    enhanced: "Analyze Shakespeare's use of dramatic irony in Romeo and Juliet. (10 marks)"
  },
  geography: {
    normal: "What causes earthquakes?",
    enhanced: "Explain the causes and effects of earthquakes using named examples. (9 marks)"
  },
  history: {
    normal: "When did World War II end?",
    enhanced: "Assess the significance of D-Day in ending World War II. (16 marks)"
  },
  "religious-studies": {
    normal: "What is karma?",
    enhanced: "Evaluate different Hindu beliefs about karma and reincarnation. (12 marks)"
  },
  business: {
    normal: "What is supply and demand?",
    enhanced: "Analyze how changes in supply and demand affect pricing strategies. (10 marks)"
  }
};

export const FlashcardCreator = ({ onSetCreated, userSubjects = [] }: FlashcardCreatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState("");
  const [enhance, setEnhance] = useState(false);
  const [setTitle, setSetTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<GeneratedFlashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Auto-detect subject and exam board from user's first subject
  const subject = userSubjects.length > 0 ? userSubjects[0].subject_name.toLowerCase().replace(/\s+/g, '-') : "";
  const examBoard = userSubjects.length > 0 ? userSubjects[0].exam_board : "";

  const handleEnhanceToggle = (checked: boolean) => {
    if (!isPremium) {
      // Always redirect free users to pricing page, don't change toggle state
      navigate('/pricing');
      return;
    }
    // Only premium users can actually toggle the feature
    setEnhance(checked);
  };

  const handleGenerate = async () => {
    if (!notes.trim() || !subject || !examBoard) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (notes.length < 50) {
      toast({
        title: "Notes Too Short",
        description: "Please provide more detailed notes (at least 50 characters)",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      const { data, error } = await supabase.functions.invoke('generate-flashcards', {
        body: {
          notes: notes.trim(),
          subject,
          examBoard,
          enhance
        }
      });

      if (error) {
        console.error('Error generating flashcards:', error);
        throw error;
      }

      if (!data.flashcards || data.flashcards.length === 0) {
        throw new Error('No flashcards were generated');
      }

      setGeneratedFlashcards(data.flashcards);
      
      // Auto-generate a title if not provided
      if (!setTitle.trim()) {
        const subjectName = subjects.find(s => s.id === subject)?.name || subject;
        setSetTitle(`${subjectName} (${examBoard}) - ${new Date().toLocaleDateString()}`);
      }

      toast({
        title: "Success!",
        description: `Generated ${data.flashcards.length} flashcards`,
      });

    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedFlashcards.length || !user?.id) return;

    try {
      setIsSaving(true);

      // Prepare flashcards for database insertion
      const flashcardsToSave = generatedFlashcards.map(flashcard => ({
        user_id: user.id,
        subject_id: subject,
        exam_board: examBoard,
        front: flashcard.front,
        back: flashcard.back,
      }));

      const { error } = await supabase
        .from('flashcards')
        .insert(flashcardsToSave);

      if (error) {
        console.error('Error saving flashcards:', error);
        throw error;
      }

      // Reset form
      setNotes("");
      setSetTitle("");
      setEnhance(false);
      setGeneratedFlashcards([]);

      onSetCreated();

    } catch (error) {
      console.error('Error saving flashcards:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save flashcards. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Main Card Container */}
      <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg">
        <CardContent className="space-y-5 p-5">
          {/* Study Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-bold text-[#0F172A] dark:text-white tracking-tight">
              Study Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Paste your study notes here... The more detailed your notes, the better the flashcards will be."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[160px] rounded-xl border-2 border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-950 text-[#0F172A] dark:text-white shadow-sm hover:border-[#0EA5E9]/50 focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] font-medium resize-none text-sm leading-relaxed p-4"
            />
            <div className="flex justify-between items-center pt-1">
              <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium">
                {notes.length < 50 ? (
                  <>
                    <span className="text-[#0EA5E9] font-bold">{50 - notes.length}</span> more characters needed
                  </>
                ) : (
                  <>
                    <span className="text-[#0EA5E9] font-bold">{notes.length}</span> characters
                  </>
                )}
              </p>
              {notes.length >= 50 && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 font-bold shadow-sm px-3 py-0.5 text-xs">
                  Ready
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Mode Toggle */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#0EA5E9]/8 via-[#0EA5E9]/4 to-transparent dark:from-[#0EA5E9]/15 dark:via-[#0EA5E9]/8 dark:to-transparent border-2 border-[#0EA5E9]/25 dark:border-[#0EA5E9]/30 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Label htmlFor="enhance" className="text-sm font-bold text-[#0F172A] dark:text-white tracking-tight cursor-pointer">
                    Enhanced Generation
                  </Label>
                  {!isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-bold text-xs shadow-sm px-2 py-0.5">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium leading-relaxed">
                  {isPremium 
                    ? "Exam-style flashcards with mark schemes" 
                    : "Unlock exam-style flashcards"}
                </p>
              </div>
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={handleEnhanceToggle}
                className="data-[state=checked]:bg-[#0EA5E9] mt-0.5 scale-90"
              />
            </div>

            {/* Example Preview */}
            {(enhance || !isPremium) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#E2E8F0]/40 dark:border-gray-700/50 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="group p-3 bg-white dark:bg-gray-900 rounded-xl border border-[#E2E8F0] dark:border-gray-700 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#64748B]"></div>
                    <p className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wide uppercase">Standard</p>
                  </div>
                  <p className="text-xs text-[#0F172A] dark:text-white font-medium leading-relaxed">
                    {subject && subjectExamples[subject]?.normal ? subjectExamples[subject].normal : "What is Newton's first law?"}
                  </p>
                </div>
                <div className="group p-3 bg-gradient-to-br from-[#0EA5E9]/8 to-[#38BDF8]/8 dark:from-[#0EA5E9]/15 dark:to-[#38BDF8]/15 rounded-xl border-2 border-[#0EA5E9]/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse"></div>
                    <p className="text-xs font-bold text-[#0EA5E9] tracking-wide uppercase">Enhanced</p>
                  </div>
                  <p className="text-xs text-[#0F172A] dark:text-white font-medium leading-relaxed">
                    {subject && subjectExamples[subject]?.enhanced ? subjectExamples[subject].enhanced : "State and explain Newton's first law of motion. (3 marks)"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || notes.length < 50}
            className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-bold text-sm h-11 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="rounded-2xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="border-b border-[#E2E8F0]/30 dark:border-gray-800/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
                  Preview Flashcards
                </CardTitle>
                <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium text-sm mt-1">
                  Review before saving
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white border-0 font-bold shadow-md px-3 py-1.5 text-sm">
                {generatedFlashcards.length} cards
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {/* Optional Set Title */}
            <div className="space-y-2">
              <Label htmlFor="setTitle" className="text-sm font-bold text-[#0F172A] dark:text-white tracking-tight">
                Set Name (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="e.g., Physics - Forces and Motion"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="rounded-xl border-2 border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm hover:border-[#0EA5E9]/50 focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] font-medium h-10 text-sm px-4"
              />
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {generatedFlashcards.map((flashcard, index) => (
                <Card key={index} className="group rounded-xl border border-[#E2E8F0]/60 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm hover:shadow-md hover:border-[#0EA5E9]/50 dark:hover:border-[#0EA5E9]/50 transition-all duration-300">
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center shadow-sm">
                          <span className="text-xs font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-[#0F172A] dark:text-white leading-relaxed tracking-tight">
                        {flashcard.front}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#E2E8F0]/60 dark:border-gray-800">
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="w-1 h-1 rounded-full bg-[#0EA5E9]"></div>
                        <p className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wider uppercase">
                          Answer
                        </p>
                      </div>
                      <p className="text-sm text-[#64748B] dark:text-gray-300 leading-relaxed font-medium">
                        {flashcard.back}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-bold h-11 text-sm hover:scale-[1.01] active:scale-[0.99]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Save to Library
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};