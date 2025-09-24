import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
      {/* Generation Form */}
      <Card className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-orange-100 dark:bg-orange-800/30 rounded-t-lg border-b border-orange-200 dark:border-orange-700/50">
          <CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
            <div className="p-2 bg-orange-400 rounded-lg shadow-sm">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span>
              Create Flashcards from Notes
            </span>
          </CardTitle>
          <CardDescription className="text-orange-600 dark:text-orange-400">
            Paste your study notes and we'll automatically generate flashcards for effective revision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Subject and Exam Board Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id}>
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examBoard">Exam Board *</Label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exam board" />
                </SelectTrigger>
                <SelectContent>
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
          <div className={`p-4 rounded-lg border-2 transition-all ${
            enhance 
              ? 'bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700' 
              : 'bg-muted/50 border-transparent'
          }`}>
            <div className="flex items-center space-x-3">
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
              />
              <div className="flex-1">
                <Label htmlFor="enhance" className="flex items-center gap-2 font-medium">
                  <Sparkles className={`h-4 w-4 ${enhance ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                  Enhance for Marks
                  {enhance && (
                    <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                      ACTIVE
                    </span>
                  )}
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {enhance 
                    ? "✨ Flashcards will use exam-board specific language, command words, and mark scheme terminology"
                    : "Generate standard flashcards from your notes"
                  }
                </p>
              </div>
            </div>
            
            {enhance && subject && examBoard && (
              <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                  Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="grid gap-2 text-xs">
                  <div>
                    <span className="font-medium">Normal:</span> "What is photosynthesis?"
                  </div>
                  <div>
                    <span className="font-medium text-purple-600 dark:text-purple-400">Enhanced:</span> "Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="notes">Your Study Notes *</Label>
            <Textarea
              id="notes"
              placeholder="Paste your study notes here... (minimum 50 characters)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-32 resize-none"
              maxLength={5000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{notes.length < 50 ? `Need ${50 - notes.length} more characters` : "✓ Looks good"}</span>
              <span>{notes.length}/5000</span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
            className="w-full bg-orange-400 hover:bg-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate Flashcards
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700/50 hover:shadow-lg transition-all duration-300">
          <CardHeader className="bg-green-100 dark:bg-green-800/30 rounded-t-lg border-b border-green-200 dark:border-green-700/50">
            <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
              <div className="p-2 bg-green-400 rounded-lg shadow-sm">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span>
                Generated Flashcards ({generatedFlashcards.length})
              </span>
              {enhance && (
                <span className="px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Enhanced for Marks
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {enhance 
                ? `✨ These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "Review your flashcards before saving them to your library"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Set Title Input */}
            <div className="space-y-2">
              <Label htmlFor="setTitle">Set Title (Optional)</Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="grid gap-3 max-h-96 overflow-y-auto">
              {generatedFlashcards.map((flashcard, index) => (
                <div key={index} className={`border rounded-lg p-4 ${
                  enhance 
                    ? 'border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50/50 to-blue-50/50 dark:from-purple-900/10 dark:to-blue-900/10' 
                    : 'border-border'
                }`}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        Question
                        {enhance && <Sparkles className="h-3 w-3 text-purple-500" />}
                      </h4>
                      <p className="text-sm">{flashcard.front}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        Answer
                        {enhance && <Sparkles className="h-3 w-3 text-purple-500" />}
                      </h4>
                      <p className="text-sm">{flashcard.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-green-200 dark:border-green-700/50">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-green-400 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving Flashcards...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Save to Library
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};