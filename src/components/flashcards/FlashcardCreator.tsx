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

export const FlashcardCreator = ({ onSetCreated }: FlashcardCreatorProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [notes, setNotes] = useState("");
  const [subject, setSubject] = useState("");
  const [examBoard, setExamBoard] = useState("");
  const [enhance, setEnhance] = useState(false);
  const [setTitle, setSetTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<GeneratedFlashcard[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center shadow-lg">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Smart Flashcards
            </h1>
            <p className="text-muted-foreground">AI-Powered Study Tool</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Badge className="bg-primary/20 text-primary-foreground border-primary/30">
            Exam-Board Specific
          </Badge>
          <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30">
            AI Generated
          </Badge>
        </div>
      </div>

      {/* Generation Form */}
      <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 opacity-50" />
        
        <CardHeader className="relative bg-card/50 backdrop-blur-sm border-b border-border">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-primary to-primary/80 rounded-xl shadow-lg">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold text-foreground">Create Smart Flashcards</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Exam-Board Specific
                </Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Transform your study notes into powerful flashcards with AI analysis and exam-board optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 p-6">
          {/* Subject and Exam Board Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold text-foreground">
                Subject *
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="bg-card/50 border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border">
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examBoard" className="text-sm font-semibold text-foreground">
                Exam Board *
              </Label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger className="bg-card/50 border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Select exam board" />
                </SelectTrigger>
                <SelectContent className="bg-card/95 backdrop-blur-xl border-border">
                  {examBoards.map((board) => (
                    <SelectItem key={board.id} value={board.id}>
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhance Toggle */}
          <div className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 ${
            enhance 
              ? 'bg-accent/10 border-accent/30 shadow-lg' 
              : 'bg-muted/50 border-border'
          }`}>
            <div className="flex items-center space-x-4">
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
              />
              <div className="flex-1">
                <Label htmlFor="enhance" className="flex items-center gap-2 font-semibold cursor-pointer">
                  <Sparkles className={`h-4 w-4 ${enhance ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
                  <span className={enhance ? 'text-accent-foreground' : 'text-foreground'}>
                    Enhance for Marks
                  </span>
                  {enhance && (
                    <Badge variant="secondary" className="text-xs">
                      ACTIVE
                    </Badge>
                  )}
                </Label>
                <p className={`text-sm mt-1 ${enhance ? 'text-accent-foreground/80' : 'text-muted-foreground'}`}>
                  {enhance 
                    ? "Flashcards will use exam-board specific language and mark scheme terminology"
                    : "Generate standard flashcards from your notes"
                  }
                </p>
              </div>
            </div>
            
            {enhance && subject && examBoard && (
              <div className="mt-4 p-3 bg-card/60 backdrop-blur-sm rounded-lg border border-accent/20">
                <h4 className="text-sm font-semibold text-accent-foreground mb-2">
                  Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-muted rounded border">
                    <span className="font-medium text-muted-foreground">Normal:</span> 
                    <span className="ml-2">"What is photosynthesis?"</span>
                  </div>
                  <div className="p-2 bg-accent/20 rounded border border-accent/30">
                    <span className="font-medium text-accent-foreground">Enhanced:</span> 
                    <span className="ml-2">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
              Your Study Notes *
            </Label>
            <div className="relative">
              <Textarea
                id="notes"
                placeholder="Paste your study notes here... (minimum 50 characters)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 bg-card/50 border-border hover:border-primary/50 focus:border-primary transition-colors"
                maxLength={5000}
              />
              {notes.length >= 50 && (
                <div className="absolute top-2 right-2 text-primary">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`${
                notes.length < 50 
                  ? 'text-destructive' 
                  : 'text-primary'
              }`}>
                {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "Ready to generate!"}
              </span>
              <span className="text-muted-foreground">
                {notes.length}/5000
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
            className="w-full bg-gradient-to-r from-primary via-primary/80 to-primary/60 hover:from-primary/90 hover:via-primary/70 hover:to-primary/50 text-primary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                <span>Generating Smart Flashcards...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Generate Smart Flashcards</span>
                <Brain className="h-4 w-4" />
              </div>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="relative overflow-hidden bg-card/80 backdrop-blur-xl border border-border shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-accent/3 to-primary/5 opacity-50" />
          
          <CardHeader className="relative bg-card/50 backdrop-blur-sm border-b border-border">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-secondary to-secondary/80 rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Generated Flashcards ({generatedFlashcards.length})</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    Smart Generated
                  </Badge>
                  {enhance && (
                    <Badge className="text-xs bg-accent/20 text-accent-foreground border-accent/30">
                      Enhanced for Marks
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {enhance 
                ? `These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "Review your smart flashcards before saving them to your library"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6 p-6">
            {/* Set Title Input */}
            <div className="space-y-2">
              <Label htmlFor="setTitle" className="text-sm font-semibold text-foreground">
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-card/50 border-border hover:border-primary/50 focus:border-primary transition-colors"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Preview Your Smart Flashcards
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto rounded-lg border border-border p-4 bg-card/30">
                {generatedFlashcards.map((flashcard, index) => (
                  <div key={index} className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                    enhance 
                      ? 'bg-accent/10 border-accent/30' 
                      : 'bg-card/50 border-border'
                  }`}>
                    {enhance && (
                      <div className="flex justify-end mb-2">
                        <Badge variant="outline" className="text-xs">
                          Enhanced
                        </Badge>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-primary">
                          <BookOpen className="h-4 w-4" />
                          Question
                        </h4>
                        <p className="text-sm bg-primary/10 p-3 rounded border border-primary/20">{flashcard.front}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-secondary-foreground">
                          <Brain className="h-4 w-4" />
                          Answer
                        </h4>
                        <p className="text-sm bg-secondary/10 p-3 rounded border border-secondary/20">{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-secondary via-secondary/80 to-secondary/60 hover:from-secondary/90 hover:via-secondary/70 hover:to-secondary/50 text-secondary-foreground font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-secondary-foreground border-t-transparent" />
                    <span>Saving to Library...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Save to Smart Library</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};