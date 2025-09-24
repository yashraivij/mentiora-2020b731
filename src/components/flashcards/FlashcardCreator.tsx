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
      {/* Subject and Exam Board Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6">
          <Label htmlFor="subject" className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-sky-400 rounded-full"></div>
            Subject *
          </Label>
          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="bg-background/80 border border-border hover:border-sky-400 focus:border-sky-400 transition-all duration-300 shadow-sm rounded-lg">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-xl">
              {subjects.map((subj) => (
                <SelectItem key={subj.id} value={subj.id} className="hover:bg-muted rounded-md font-medium">
                  {subj.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6">
          <Label htmlFor="examBoard" className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Exam Board *
          </Label>
          <Select value={examBoard} onValueChange={setExamBoard}>
            <SelectTrigger className="bg-background/80 border border-border hover:border-blue-400 focus:border-blue-400 transition-all duration-300 shadow-sm rounded-lg">
              <SelectValue placeholder="Select exam board" />
            </SelectTrigger>
            <SelectContent className="bg-background/95 backdrop-blur-xl border border-border rounded-lg shadow-xl">
              {examBoards.map((board) => (
                <SelectItem key={board.id} value={board.id} className="hover:bg-muted rounded-md font-medium">
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes Input */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6">
        <Label htmlFor="notes" className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
          Your Study Notes *
        </Label>
        <div className="relative group">
          <Textarea
            id="notes"
            placeholder="Paste your study notes here... (minimum 50 characters)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-36 bg-background/80 border border-border hover:border-slate-400 focus:border-slate-400 transition-all duration-300 shadow-sm rounded-lg font-medium"
            maxLength={5000}
          />
          {notes.length >= 50 && (
            <div className="absolute top-3 right-3 text-slate-500">
              <Sparkles className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center text-sm mt-3">
          <span className={`px-4 py-2 rounded-full font-medium shadow-sm transition-all duration-300 ${
            notes.length < 50 
              ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' 
              : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
          }`}>
            {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "✨ Ready to generate!"}
          </span>
          <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full border border-border">
            {notes.length}/5000
          </span>
        </div>
      </div>

      {/* Enhance Toggle */}
      <div className={`bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6 transition-all duration-300 ${
        enhance ? 'border-orange-300 dark:border-orange-700/50' : ''
      }`}>
        <div className="flex items-center space-x-6">
          <div className={`p-3 rounded-xl transition-all duration-300 ${enhance ? 'bg-orange-400 shadow-lg' : 'bg-muted'}`}>
            <Switch
              id="enhance"
              checked={enhance}
              onCheckedChange={setEnhance}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="enhance" className="flex items-center gap-3 font-bold cursor-pointer text-lg">
              <Sparkles className={`h-6 w-6 transition-all duration-300 ${enhance ? 'text-orange-500' : 'text-muted-foreground'}`} />
              <span className={enhance ? 'text-orange-600 dark:text-orange-400' : 'text-foreground'}>
                ✨ Enhance for Marks
              </span>
              {enhance && (
                <Badge className="bg-orange-500 text-white text-sm font-bold px-3 py-1 shadow-md">
                  🔥 ACTIVE
                </Badge>
              )}
            </Label>
            <p className={`text-base mt-2 font-medium ${enhance ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
              {enhance 
                ? "✨ Flashcards will use premium exam-board specific language and mark scheme terminology"
                : "Generate standard flashcards from your notes"
              }
            </p>
          </div>
        </div>
        
        {enhance && subject && examBoard && (
          <div className="mt-6 p-5 bg-orange-50/80 dark:bg-orange-950/30 backdrop-blur-sm rounded-xl border border-orange-200 dark:border-orange-800 shadow-sm">
            <h4 className="text-base font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
            </h4>
            <div className="space-y-3">
              <div className="p-4 bg-background/80 rounded-lg border border-border shadow-sm">
                <span className="font-bold text-muted-foreground">📝 Normal:</span> 
                <span className="ml-3 font-medium">"What is photosynthesis?"</span>
              </div>
              <div className="p-4 bg-orange-100/80 dark:bg-orange-900/40 rounded-lg border border-orange-300 dark:border-orange-700 shadow-sm">
                <span className="font-bold text-orange-700 dark:text-orange-300">🚀 Enhanced:</span> 
                <span className="ml-3 font-bold">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-400 hover:to-blue-400 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] disabled:hover:scale-100 rounded-xl"
        size="lg"
      >
        {isGenerating ? (
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent" />
            <span className="text-lg font-bold">Generating Smart Flashcards...</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5" />
            <span className="text-lg font-bold">Generate Smart Flashcards</span>
            <Brain className="h-5 w-5" />
          </div>
        )}
      </Button>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-sky-100/80 to-blue-100/80 dark:from-sky-800/40 dark:to-blue-800/40 backdrop-blur-sm border-b border-border p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Generated Flashcards ({generatedFlashcards.length})
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-gradient-to-r from-sky-400 to-blue-400 text-white text-sm font-bold px-4 py-2 shadow-md">
                    🎯 Smart Generated
                  </Badge>
                  {enhance && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white text-sm font-bold px-4 py-2 shadow-md">
                      🚀 Enhanced for Marks
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground font-medium text-lg mt-4">
              {enhance 
                ? `🎓 These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "📚 Review your smart flashcards before saving them to your library"
              }
            </p>
          </div>
          
          <div className="p-8 space-y-6">
            {/* Set Title Input */}
            <div className="bg-card/60 backdrop-blur-sm rounded-xl shadow-md border border-border p-6">
              <Label htmlFor="setTitle" className="text-base font-bold text-foreground flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-background/80 border border-border hover:border-slate-400 focus:border-slate-400 transition-all duration-300 shadow-sm rounded-lg font-medium py-3"
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
           </div>
         </div>
       )}
     </div>
   );
 };