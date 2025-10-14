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
    <div className="space-y-6">
      {/* Main Card Container */}
      <Card className="rounded-3xl border-2 border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white via-[#FAFBFC] to-[#F8FAFC] dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 shadow-2xl">
        <CardHeader className="pb-6 border-b border-[#E2E8F0]/30 dark:border-gray-800/50">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Create Flashcards
            </CardTitle>
            <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium text-lg">
              Transform your study notes into AI-powered flashcards
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 pt-8">
          {/* Study Notes Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes" className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
                Study Notes
              </Label>
              <div className="text-sm font-medium text-[#64748B] dark:text-gray-400">
                {notes.length < 50 ? (
                  <span>
                    Minimum <span className="text-[#0EA5E9] font-bold">{50}</span> characters
                  </span>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    ✓ Ready
                  </span>
                )}
              </div>
            </div>
            <Textarea
              id="notes"
              placeholder="Paste your study notes here... The more detailed your notes, the better the flashcards will be."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[220px] rounded-2xl border-2 border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-950 text-[#0F172A] dark:text-white shadow-sm hover:border-[#0EA5E9]/50 focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] font-medium resize-none text-base leading-relaxed p-5 transition-all duration-200"
            />
            <div className="flex justify-between items-center">
              <p className="text-sm text-[#64748B] dark:text-gray-400 font-medium">
                {notes.length < 50 ? (
                  <>
                    <span className="text-[#0EA5E9] font-bold">{50 - notes.length}</span> more characters needed
                  </>
                ) : (
                  <>
                    <span className="text-[#0EA5E9] font-bold">{notes.length}</span> characters • Ready to generate
                  </>
                )}
              </p>
              {notes.length >= 50 && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 font-bold shadow-lg px-4 py-1.5 text-sm animate-in fade-in slide-in-from-right-2 duration-300">
                  ✓ Ready
                </Badge>
              )}
            </div>
          </div>

          {/* Enhanced Mode Toggle */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0EA5E9]/8 via-[#0EA5E9]/4 to-transparent dark:from-[#0EA5E9]/15 dark:via-[#0EA5E9]/8 dark:to-transparent border-2 border-[#0EA5E9]/25 dark:border-[#0EA5E9]/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-[#0EA5E9]/40">
            <div className="flex items-start justify-between gap-6 mb-5">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <Label htmlFor="enhance" className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight cursor-pointer">
                    Enhanced Generation
                  </Label>
                  {!isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-bold text-xs shadow-md px-2.5 py-1">
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-[#64748B] dark:text-gray-400 font-medium leading-relaxed">
                  {isPremium 
                    ? "Generate exam-style flashcards with mark schemes and detailed guidance" 
                    : "Unlock exam-style flashcards with marks, examiner tips, and structured answers"}
                </p>
              </div>
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={handleEnhanceToggle}
                className="data-[state=checked]:bg-[#0EA5E9] mt-1.5 scale-110"
              />
            </div>

            {/* Example Preview */}
            {(enhance || !isPremium) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-[#E2E8F0]/40 dark:border-gray-700/50 animate-in fade-in slide-in-from-top-2 duration-500">
                <div className="group p-5 bg-white dark:bg-gray-900 rounded-2xl border-2 border-[#E2E8F0] dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#64748B]"></div>
                    <p className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wide uppercase">Standard</p>
                  </div>
                  <p className="text-sm text-[#0F172A] dark:text-white font-medium leading-relaxed">
                    {subject && subjectExamples[subject]?.normal ? subjectExamples[subject].normal : "What is Newton's first law?"}
                  </p>
                </div>
                <div className="group p-5 bg-gradient-to-br from-[#0EA5E9]/8 to-[#38BDF8]/8 dark:from-[#0EA5E9]/15 dark:to-[#38BDF8]/15 rounded-2xl border-2 border-[#0EA5E9]/50 shadow-lg hover:shadow-xl hover:border-[#0EA5E9]/70 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-[#0EA5E9] animate-pulse"></div>
                    <p className="text-xs font-bold text-[#0EA5E9] tracking-wide uppercase">Enhanced</p>
                  </div>
                  <p className="text-sm text-[#0F172A] dark:text-white font-medium leading-relaxed">
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
            className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl font-bold text-lg h-16 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              "Generate Flashcards"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="rounded-3xl border-2 border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white via-[#FAFBFC] to-[#F8FAFC] dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="border-b-2 border-[#E2E8F0]/30 dark:border-gray-800/50 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  Your Flashcards
                </CardTitle>
                <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium text-lg">
                  Review and customize before saving to your library
                </CardDescription>
              </div>
              <Badge className="bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] text-white border-0 font-bold shadow-lg px-5 py-2.5 text-lg rounded-xl">
                {generatedFlashcards.length} cards
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            {/* Optional Set Title */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="setTitle" className="text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
                  Flashcard Set Name
                </Label>
                <span className="text-sm text-[#64748B] dark:text-gray-400 font-medium">Optional</span>
              </div>
              <Input
                id="setTitle"
                placeholder="e.g., Physics Revision - Forces and Motion"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="rounded-2xl border-2 border-[#E2E8F0] dark:border-gray-700 bg-white dark:bg-gray-950 shadow-sm hover:border-[#0EA5E9]/50 focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] font-medium h-14 text-base px-5 transition-all duration-200"
              />
            </div>

            <div className="space-y-5 max-h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-[#0EA5E9]/20 scrollbar-track-transparent">
              {generatedFlashcards.map((flashcard, index) => (
                <Card key={index} className="group rounded-2xl border-2 border-[#E2E8F0]/60 dark:border-gray-700 bg-white dark:bg-gray-950 shadow-md hover:shadow-xl hover:border-[#0EA5E9]/50 dark:hover:border-[#0EA5E9]/50 transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-6 space-y-5">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                          <span className="text-base font-bold text-white">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wider uppercase">
                          Question
                        </span>
                      </div>
                      <p className="text-base font-bold text-[#0F172A] dark:text-white leading-relaxed tracking-tight pl-13">
                        {flashcard.front}
                      </p>
                    </div>
                    <div className="pt-5 border-t-2 border-[#E2E8F0]/60 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></div>
                        <p className="text-xs font-bold text-[#64748B] dark:text-gray-400 tracking-wider uppercase">
                          Answer
                        </p>
                      </div>
                      <p className="text-base text-[#64748B] dark:text-gray-300 leading-relaxed font-medium">
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
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl font-bold h-16 text-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                  Saving to Library...
                </>
              ) : (
                <>
                  <Plus className="h-6 w-6 mr-3" />
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