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
      <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6">
        <Label htmlFor="notes" className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          Your Study Notes *
        </Label>
        <Textarea
          id="notes"
          placeholder="Paste your study notes here... (minimum 50 characters)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-[200px] bg-background/80 border border-border focus:border-purple-400 transition-all duration-300 rounded-lg shadow-sm resize-none font-medium"
        />
        <div className="flex justify-between items-center mt-2">
          <p className="text-xs text-muted-foreground">
            {notes.length < 50 ? `${50 - notes.length} more characters needed` : `${notes.length} characters`}
          </p>
        </div>
      </div>

      {/* Enhanced Mode Toggle */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl shadow-md border border-purple-200/50 dark:border-purple-800/30 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <Label htmlFor="enhance" className="text-base font-bold text-foreground cursor-pointer">
                Enhance for Marks {!isPremium && <Badge variant="secondary" className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">Premium</Badge>}
              </Label>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isPremium 
                ? "Generate exam-style flashcards with mark allocations and detailed model answers"
                : "Unlock exam-style flashcards with mark schemes to maximize your grades"}
            </p>
            
            {!isPremium && (
              <div className="mt-3 p-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-xs font-medium text-amber-900 dark:text-amber-100">
                  ✨ Premium flashcards include mark schemes and examiner tips
                </p>
              </div>
            )}
          </div>
          <Switch
            id="enhance"
            checked={enhance}
            onCheckedChange={handleEnhanceToggle}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {/* Preview of what enhancement looks like */}
        {(enhance || !isPremium) && (
          <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg border border-border">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Normal</div>
                <div className="text-sm font-medium text-foreground">
                  {subject && subjectExamples[subject]?.normal ? subjectExamples[subject].normal : "What is Newton's first law?"}
                </div>
              </div>
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-lg border border-purple-300 dark:border-purple-700">
                <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Enhanced
                </div>
                <div className="text-sm font-medium text-foreground">
                  {subject && subjectExamples[subject]?.enhanced ? subjectExamples[subject].enhanced : "State and explain Newton's first law of motion. (3 marks)"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || notes.length < 50}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl shadow-md border border-emerald-200/50 dark:border-emerald-800/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Generated {generatedFlashcards.length} Flashcards</h3>
                <p className="text-sm text-muted-foreground">Review and save to your library</p>
              </div>
            </div>

            {/* Optional Set Title */}
            <div className="mb-4">
              <Label htmlFor="setTitle" className="text-sm font-medium text-foreground mb-2 block">
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="e.g., Physics Revision - Forces and Motion"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-background/80 border border-border focus:border-emerald-400 transition-all"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {generatedFlashcards.map((flashcard, index) => (
                <Card key={index} className="bg-white dark:bg-gray-900 border border-border hover:border-emerald-400 transition-all">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Badge variant="secondary" className="mb-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-0">
                          Card {index + 1}
                        </Badge>
                        <div className="text-xs text-muted-foreground mb-1 font-medium">Front</div>
                        <div className="text-sm font-semibold text-foreground bg-muted/50 p-3 rounded-lg">
                          {flashcard.front}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="text-xs text-muted-foreground mb-1 font-medium">Back</div>
                        <div className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
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
              className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
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
          </div>
        </div>
      )}
    </div>
  );
};