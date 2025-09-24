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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Generation Form */}
      <div className="space-y-6">
        {/* Subject and Exam Board Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm font-semibold text-sky-700 dark:text-sky-300">
              Subject *
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="bg-sky-50/50 dark:bg-sky-900/30 border border-sky-200 dark:border-sky-700 hover:border-sky-300 dark:hover:border-sky-600 focus:border-sky-400 dark:focus:border-sky-500 transition-colors shadow-sm">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-sky-50/90 dark:bg-sky-900/90 backdrop-blur-xl border border-sky-200 dark:border-sky-700">
                {subjects.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id} className="hover:bg-sky-100 dark:hover:bg-sky-800/50">
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="examBoard" className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Exam Board *
            </Label>
            <Select value={examBoard} onValueChange={setExamBoard}>
              <SelectTrigger className="bg-blue-50/50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 transition-colors shadow-sm">
                <SelectValue placeholder="Select exam board" />
              </SelectTrigger>
              <SelectContent className="bg-blue-50/90 dark:bg-blue-900/90 backdrop-blur-xl border border-blue-200 dark:border-blue-700">
                {examBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id} className="hover:bg-blue-100 dark:hover:bg-blue-800/50">
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Input */}
        <div className="space-y-3">
          <Label htmlFor="notes" className="text-sm font-semibold text-green-700 dark:text-green-300">
            Your Study Notes *
          </Label>
          <div className="relative">
            <Textarea
              id="notes"
              placeholder="Paste your study notes here... (minimum 50 characters)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-32 bg-green-50/50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 focus:border-green-400 dark:focus:border-green-500 transition-colors shadow-sm"
              maxLength={5000}
            />
            {notes.length >= 50 && (
              <div className="absolute top-2 right-2 text-green-500">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={`px-3 py-1 rounded-full font-medium ${
              notes.length < 50 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "Ready to generate!"}
            </span>
            <span className="text-sky-600 dark:text-sky-400 font-medium">
              {notes.length}/5000
            </span>
          </div>
        </div>

        {/* Enhance Toggle - Moved here for cleaner layout */}
        <div className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-300 ${
          enhance 
            ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700/50 shadow-lg' 
            : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-200 dark:border-gray-600/50 shadow-sm'
        }`}>
          <div className="flex items-center space-x-4">
            <Switch
              id="enhance"
              checked={enhance}
              onCheckedChange={setEnhance}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-400 data-[state=checked]:to-red-400"
            />
            <div className="flex-1">
              <Label htmlFor="enhance" className="flex items-center gap-2 font-semibold cursor-pointer">
                <Sparkles className={`h-4 w-4 ${enhance ? 'text-orange-500' : 'text-gray-400'}`} />
                <span className={enhance ? 'text-orange-700 dark:text-orange-300 font-bold' : 'text-foreground'}>
                  Enhance for Marks
                </span>
                {enhance && (
                  <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold">
                    ACTIVE
                  </Badge>
                )}
              </Label>
              <p className={`text-sm mt-1 ${enhance ? 'text-orange-700 dark:text-orange-300 font-medium' : 'text-muted-foreground'}`}>
                {enhance 
                  ? "Flashcards will use exam-board specific language and mark scheme terminology"
                  : "Generate standard flashcards from your notes"
                }
              </p>
            </div>
          </div>
          
          {enhance && subject && examBoard && (
            <div className="mt-4 p-3 bg-orange-100/60 dark:bg-orange-900/30 backdrop-blur-sm rounded-lg border border-orange-200/70 dark:border-orange-700/50 shadow-sm">
              <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-2">
                Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Normal:</span> 
                  <span className="ml-2">"What is photosynthesis?"</span>
                </div>
                <div className="p-2 bg-orange-200/60 dark:bg-orange-800/40 rounded border border-orange-300/70 dark:border-orange-600/70 shadow-sm">
                  <span className="font-medium text-orange-700 dark:text-orange-300">Enhanced:</span> 
                  <span className="ml-2 font-medium">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
          className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:hover:scale-100"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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
      </div>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 dark:from-emerald-900/10 dark:to-teal-900/10" />
          
          <CardHeader className="relative bg-gradient-to-r from-emerald-100/70 to-teal-100/70 dark:from-emerald-800/30 dark:to-teal-800/30 backdrop-blur-sm border-b border-emerald-200 dark:border-emerald-700/50">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">Generated Flashcards ({generatedFlashcards.length})</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold">
                    Smart Generated
                  </Badge>
                  {enhance && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold">
                      Enhanced for Marks
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300 font-medium">
              {enhance 
                ? `These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "Review your smart flashcards before saving them to your library"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6 p-6">
            {/* Set Title Input */}
            <div className="space-y-2">
              <Label htmlFor="setTitle" className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-emerald-50/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors shadow-sm"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                Preview Your Smart Flashcards
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto rounded-lg border border-emerald-200 dark:border-emerald-700/50 p-4 bg-emerald-50/30 dark:bg-emerald-900/10 backdrop-blur-sm">
                {generatedFlashcards.map((flashcard, index) => (
                  <div key={index} className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                    enhance 
                      ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-700/50 shadow-md' 
                      : 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-700/50 shadow-sm'
                  }`}>
                    {enhance && (
                      <div className="flex justify-end mb-2">
                        <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-bold">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Enhanced
                        </Badge>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                          Question
                        </h4>
                        <p className="text-sm bg-blue-50 dark:bg-blue-900/30 p-3 rounded border border-blue-200 dark:border-blue-700/50 font-medium">{flashcard.front}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Brain className="h-4 w-4 text-green-600" />
                          Answer
                        </h4>
                        <p className="text-sm bg-green-50 dark:bg-green-900/30 p-3 rounded border border-green-200 dark:border-green-700/50 font-medium">{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-emerald-200 dark:border-emerald-700/50">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:hover:scale-100"
                size="lg"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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