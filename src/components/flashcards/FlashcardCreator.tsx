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
import { Brain, Sparkles, BookOpen, Zap } from "lucide-react";

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
      {/* Study Notes Input */}
      <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0EA5E9] rounded-full"></div>
            Your Study Notes
          </CardTitle>
          <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium">
            Paste your notes here to generate smart flashcards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            id="notes"
            placeholder="Paste your study notes here... (minimum 50 characters)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px] bg-background/80 border border-[#E2E8F0] dark:border-gray-700 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all duration-300 rounded-xl shadow-sm resize-none font-medium"
          />
          <div className="flex justify-between items-center mt-3">
            <p className="text-xs text-[#64748B] dark:text-gray-400 font-medium">
              {notes.length < 50 ? `${50 - notes.length} more characters needed` : `${notes.length} characters`}
            </p>
            {notes.length >= 50 && (
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm">
                ✓ Ready
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Mode Toggle */}
      <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#0EA5E9]" />
            Enhance for Marks
            {!isPremium && <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-bold shadow-sm">Premium</Badge>}
          </CardTitle>
          <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium">
            {isPremium 
              ? "Generate exam-style flashcards with mark allocations"
              : "Unlock exam-style flashcards with mark schemes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {!isPremium && (
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl border border-amber-200 dark:border-amber-800/30">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                    ✨ Premium flashcards include mark schemes and examiner tips
                  </p>
                </div>
              )}
              
              {/* Preview of what enhancement looks like */}
              {(enhance || !isPremium) && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-[#E2E8F0] dark:border-gray-700 shadow-sm">
                      <div className="text-xs font-semibold text-[#64748B] dark:text-gray-400 mb-2 tracking-wide uppercase">Normal</div>
                      <div className="text-sm font-medium text-[#0F172A] dark:text-white">
                        {subject && subjectExamples[subject]?.normal ? subjectExamples[subject].normal : "What is Newton's first law?"}
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#0EA5E9]/10 to-[#38BDF8]/10 dark:from-[#0EA5E9]/20 dark:to-[#38BDF8]/20 rounded-xl border border-[#0EA5E9]/50 shadow-sm">
                      <div className="text-xs font-semibold text-[#0EA5E9] mb-2 flex items-center gap-1 tracking-wide uppercase">
                        <Sparkles className="h-3 w-3" />
                        Enhanced
                      </div>
                      <div className="text-sm font-medium text-[#0F172A] dark:text-white">
                        {subject && subjectExamples[subject]?.enhanced ? subjectExamples[subject].enhanced : "State and explain Newton's first law of motion. (3 marks)"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Switch
              id="enhance"
              checked={enhance}
              onCheckedChange={handleEnhanceToggle}
              className="data-[state=checked]:bg-[#0EA5E9]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || notes.length < 50}
        className="w-full bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Generating Flashcards...
          </>
        ) : (
          <>
            <Brain className="h-5 w-5 mr-3" />
            Generate Smart Flashcards
          </>
        )}
      </Button>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <Card className="rounded-3xl border border-[#E2E8F0]/50 dark:border-gray-800 bg-gradient-to-br from-white to-[#F8FAFC] dark:from-gray-900 dark:to-gray-950 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-[#0EA5E9]/10 to-[#38BDF8]/10 dark:from-[#0EA5E9]/20 dark:to-[#38BDF8]/20 border-b border-[#E2E8F0]/50 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#0EA5E9]/20 rounded-xl">
                  <Zap className="h-5 w-5 text-[#0EA5E9]" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                    Generated {generatedFlashcards.length} Flashcards
                  </CardTitle>
                  <CardDescription className="text-[#64748B] dark:text-gray-400 font-medium mt-1">
                    Review and save to your library
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Optional Set Title */}
              <div>
                <Label htmlFor="setTitle" className="text-sm font-bold text-[#0F172A] dark:text-white mb-2 block">
                  Set Title (Optional)
                </Label>
                <Input
                  id="setTitle"
                  placeholder="e.g., Physics Revision - Forces and Motion"
                  value={setTitle}
                  onChange={(e) => setSetTitle(e.target.value)}
                  className="bg-background/80 border border-[#E2E8F0] dark:border-gray-700 focus:border-[#0EA5E9] focus:ring-2 focus:ring-[#0EA5E9]/20 transition-all rounded-xl shadow-sm font-medium"
                />
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {generatedFlashcards.map((flashcard, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800 border border-[#E2E8F0] dark:border-gray-700 hover:border-[#0EA5E9] dark:hover:border-[#0EA5E9] rounded-2xl transition-all shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <Badge variant="secondary" className="mb-2 bg-[#0EA5E9]/10 text-[#0EA5E9] border-0 font-semibold">
                            Card {index + 1}
                          </Badge>
                          <div className="text-xs font-semibold text-[#64748B] dark:text-gray-400 mb-1 tracking-wide uppercase">Question</div>
                          <div className="text-sm font-semibold text-[#0F172A] dark:text-white bg-muted/50 p-3 rounded-xl">
                            {flashcard.front}
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#E2E8F0] dark:border-gray-700">
                          <div className="text-xs font-semibold text-[#64748B] dark:text-gray-400 mb-1 tracking-wide uppercase">Answer</div>
                          <div className="text-sm text-[#64748B] dark:text-gray-400 bg-muted/30 p-3 rounded-xl font-medium">
                            {flashcard.back}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full mt-6 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8] hover:from-[#0284C7] hover:to-[#0EA5E9] text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving to Library...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5 mr-3" />
                    Save to Library
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};