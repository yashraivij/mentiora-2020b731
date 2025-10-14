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
      {/* Hero Section */}
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">Smart Flashcards</h3>
        <p className="text-muted-foreground">
          Transform your study notes into powerful flashcards with AI analysis and exam-board optimization
        </p>
      </div>

      {/* Subject and Exam Board Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="subject" className="text-sm font-semibold">
            Subject <span className="text-destructive">*</span>
          </Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="h-11 bg-background border-input hover:border-primary/50 focus:border-primary transition-colors">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {subjects.map((subj) => (
                <SelectItem key={subj.id} value={subj.id} className="cursor-pointer">
                  {subj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="examBoard" className="text-sm font-semibold">
            Exam Board <span className="text-destructive">*</span>
          </Label>
          <Select value={examBoard} onValueChange={setExamBoard}>
            <SelectTrigger className="h-11 bg-background border-input hover:border-primary/50 focus:border-primary transition-colors">
              <SelectValue placeholder="Select exam board" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {examBoards.map((board) => (
                <SelectItem key={board.id} value={board.id} className="cursor-pointer">
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes Input */}
      <div className="space-y-3">
        <Label htmlFor="notes" className="text-sm font-semibold">
          Your Study Notes <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Textarea
            id="notes"
            placeholder="Paste your study notes here... (minimum 50 characters)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[200px] resize-none bg-background border-input hover:border-primary/50 focus:border-primary transition-colors"
            maxLength={5000}
          />
          {notes.length >= 50 && (
            <div className="absolute top-3 right-3 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className={`font-medium transition-colors ${
            notes.length < 50 
              ? 'text-destructive' 
              : 'text-primary'
          }`}>
            {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "Ready to generate"}
          </span>
          <span className="text-muted-foreground">
            {notes.length}/5000
          </span>
        </div>
      </div>

      {/* Enhance Toggle */}
      <Card className={`transition-all ${enhance ? 'ring-2 ring-primary' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 mt-1">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <Label htmlFor="enhance" className="text-base font-semibold cursor-pointer">
                    Enhance for Marks
                  </Label>
                  {enhance && (
                    <Badge className="bg-primary text-primary-foreground">
                      PREMIUM
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Flashcards will use premium exam-board specific language and mark scheme terminology
                </p>
              </div>
            </div>
            <Switch
              id="enhance"
              checked={enhance && isPremium}
              onCheckedChange={handleEnhanceToggle}
            />
          </div>
          
          {enhance && isPremium && subject && examBoard && (
            <div className="mt-6 pt-6 border-t space-y-4">
              <h4 className="text-sm font-semibold text-muted-foreground">
                Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Normal:</div>
                  <div className="text-sm">"{subjectExamples[subject]?.normal || "What is...?"}"</div>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-2">Enhanced:</div>
                  <div className="text-sm font-medium">"{subjectExamples[subject]?.enhanced.replace('(', `(${examBoard} ${subjects.find(s => s.id === subject)?.name}) (`).replace(' marks)', ' marks)') || `Explain... (4 marks, ${examBoard} ${subjects.find(s => s.id === subject)?.name})`}"</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
        className="w-full h-12"
        size="lg"
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
            Generating Smart Flashcards...
          </>
        ) : (
          <>
            <Brain className="h-4 w-4 mr-2" />
            Generate Smart Flashcards
          </>
        )}
      </Button>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card>
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Generated Flashcards ({generatedFlashcards.length})
                </CardTitle>
                <CardDescription className="mt-1">
                  {enhance 
                    ? `Enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language`
                    : "Review your flashcards before saving"
                  }
                </CardDescription>
              </div>
              {enhance && (
                <Badge className="ml-auto bg-primary text-primary-foreground">
                  Enhanced
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            {/* Set Title Input */}
            <div className="space-y-3">
              <Label htmlFor="setTitle" className="text-sm font-semibold">
                Set Title <span className="text-muted-foreground font-normal">(Optional)</span>
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="h-11 bg-background border-input"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">Preview Flashcards</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {generatedFlashcards.map((card, index) => (
                  <Card key={index} className="border-border">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            Front
                          </Badge>
                          <span className="text-xs text-muted-foreground">Card {index + 1}</span>
                        </div>
                        <p className="font-medium text-sm leading-relaxed">{card.front}</p>
                      </div>
                      <div className="pt-3 border-t">
                        <Badge variant="secondary" className="mb-2 text-xs">
                          Back
                        </Badge>
                        <p className="text-sm text-muted-foreground leading-relaxed">{card.back}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12"
              size="lg"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                  Saving to Library...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save to Library ({generatedFlashcards.length} cards)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};