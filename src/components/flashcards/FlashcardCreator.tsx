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

export const FlashcardCreator = ({ onSetCreated }: FlashcardCreatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isPremium } = useSubscription();
  const navigate = useNavigate();
  
  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [enhance, setEnhance] = useState(false);
  const [setTitle, setSetTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<GeneratedFlashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
      setSubject("");
      setExamBoard("");
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
    <div className="space-y-8">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Subject and Exam Board Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="subject" className="text-sm font-semibold text-foreground">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger 
                id="subject" 
                className="w-full h-14 text-base bg-background border-2 hover:border-purple-500/50 focus:border-purple-500 transition-colors shadow-sm"
              >
                <SelectValue placeholder="Select your subject" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] bg-background border-2">
                {subjects.map((subj) => (
                  <SelectItem 
                    key={subj.id} 
                    value={subj.id}
                    className="text-base py-3 hover:bg-muted cursor-pointer"
                  >
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="examBoard" className="text-sm font-semibold text-foreground">
              Exam Board <span className="text-destructive">*</span>
            </Label>
            <Select value={examBoard} onValueChange={setExamBoard}>
              <SelectTrigger 
                id="examBoard" 
                className="w-full h-14 text-base bg-background border-2 hover:border-purple-500/50 focus:border-purple-500 transition-colors shadow-sm"
              >
                <SelectValue placeholder="Select your exam board" />
              </SelectTrigger>
              <SelectContent className="bg-background border-2">
                {examBoards.map((board) => (
                  <SelectItem 
                    key={board.id} 
                    value={board.id}
                    className="text-base py-3 hover:bg-muted cursor-pointer"
                  >
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Study Notes Input */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
            Your Study Notes <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Paste your study notes here... (minimum 50 characters)"
            className="min-h-[240px] text-base bg-background border-2 focus:border-purple-500 hover:border-purple-500/50 transition-colors resize-none shadow-sm rounded-xl"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={5000}
          />
          <div className="flex items-center justify-between">
            {notes.length < 50 ? (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-500" />
                <span>Need <strong>{50 - notes.length}</strong> more characters</span>
              </p>
            ) : (
              <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 font-medium">
                <Sparkles className="h-4 w-4" />
                Ready to generate flashcards
              </p>
            )}
            <p className="text-sm font-medium text-muted-foreground">{notes.length}/5000</p>
          </div>
        </div>

        {/* Enhance for Marks Toggle */}
        <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">Enhance for Marks</h3>
                    {enhance && isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-sm">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-12">
                  Use exam-board specific language and mark scheme terminology to maximize your marks
                </p>
              </div>
              <Switch
                id="enhance"
                checked={enhance && isPremium}
                onCheckedChange={handleEnhanceToggle}
                className="mt-2 data-[state=checked]:bg-purple-600"
              />
            </div>
            
            {enhance && isPremium && subject && examBoard && (
              <div className="mt-6 pt-6 border-t-2 space-y-4">
                <h4 className="text-sm font-bold text-muted-foreground">
                  Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Normal:</div>
                    <div className="text-sm">"{subjectExamples[subject]?.normal || "What is...?"}"</div>
                  </div>
                  <div className="p-4 bg-purple-100 dark:bg-purple-900/50 rounded-xl border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 mb-2">Enhanced:</div>
                    <div className="text-sm font-medium text-foreground">"{subjectExamples[subject]?.enhanced.replace('(', `(${examBoard} ${subjects.find(s => s.id === subject)?.name}) (`).replace(' marks)', ' marks)') || `Explain... (4 marks, ${examBoard} ${subjects.find(s => s.id === subject)?.name})`}"</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!subject || !examBoard || notes.length < 50 || isGenerating}
          size="lg"
          className="w-full h-16 text-lg font-bold shadow-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
              Generating Your Flashcards...
            </>
          ) : (
            <>
              <Sparkles className="h-6 w-6 mr-3" />
              Generate Smart Flashcards
            </>
          )}
        </Button>
      </div>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <div className="space-y-8 max-w-4xl mx-auto mt-12">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-2xl border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 rounded-2xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">Flashcards Generated!</h3>
                <p className="text-muted-foreground">Review your flashcards below and save them to your library</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-5 py-2 font-bold">
              {generatedFlashcards.length} {generatedFlashcards.length === 1 ? 'Card' : 'Cards'}
            </Badge>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {generatedFlashcards.map((card, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-none shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">Card {index + 1}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground mb-2">QUESTION</p>
                      <p className="font-bold text-base leading-tight text-foreground">{card.front}</p>
                    </div>
                    <div className="pt-4 border-t-2">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">ANSWER</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{card.back}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="w-full h-16 text-lg font-bold shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                Saving to Your Library...
              </>
            ) : (
              <>
                <BookOpen className="h-6 w-6 mr-3" />
                Save to My Library
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};