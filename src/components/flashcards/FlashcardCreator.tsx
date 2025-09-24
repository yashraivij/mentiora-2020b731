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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border border-purple-200/50 dark:border-purple-700/30 shadow-2xl backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-blue-400/10 to-indigo-400/10"></div>
        <div className="relative p-8 space-y-6">
        {/* Subject and Exam Board Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="subject" className="text-sm font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Subject *
            </Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-400 dark:hover:border-purple-500 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/50 rounded-xl">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/90 dark:to-pink-900/90 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-700 rounded-xl shadow-2xl">
                {subjects.map((subj) => (
                  <SelectItem key={subj.id} value={subj.id} className="hover:bg-purple-100 dark:hover:bg-purple-800/50 rounded-lg font-medium">
                    {subj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label htmlFor="examBoard" className="text-sm font-bold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Exam Board *
            </Label>
            <Select value={examBoard} onValueChange={setExamBoard}>
              <SelectTrigger className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/50 rounded-xl">
                <SelectValue placeholder="Select exam board" />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/90 dark:to-indigo-900/90 backdrop-blur-xl border-2 border-blue-200 dark:border-blue-700 rounded-xl shadow-2xl">
                {examBoards.map((board) => (
                  <SelectItem key={board.id} value={board.id} className="hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg font-medium">
                    {board.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes Input */}
        <div className="space-y-4">
          <Label htmlFor="notes" className="text-sm font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            Your Study Notes *
          </Label>
          <div className="relative group">
            <Textarea
              id="notes"
              placeholder="Paste your study notes here... (minimum 50 characters)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-36 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 border-2 border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-400 dark:hover:border-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/50 rounded-xl font-medium"
              maxLength={5000}
            />
            {notes.length >= 50 && (
              <div className="absolute top-3 right-3 text-emerald-500 animate-pulse">
                <Sparkles className="h-5 w-5 drop-shadow-lg" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-teal-400/10 to-cyan-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className={`px-4 py-2 rounded-full font-bold shadow-md transition-all duration-300 ${
              notes.length < 50 
                ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-2 border-red-200 shadow-red-200/50' 
                : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-2 border-emerald-200 shadow-emerald-200/50'
            }`}>
              {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "✨ Ready to generate!"}
            </span>
            <span className="text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-700">
              {notes.length}/5000
            </span>
          </div>
        </div>

        {/* Enhance Toggle - Premium Design */}
        <div className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-500 transform hover:scale-[1.01] ${
          enhance 
            ? 'bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-orange-900/30 dark:via-red-900/30 dark:to-pink-900/30 border-orange-300 dark:border-orange-600/50 shadow-2xl shadow-orange-200/30 dark:shadow-orange-900/30' 
            : 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-slate-800/40 dark:via-gray-800/40 dark:to-zinc-800/40 border-gray-300 dark:border-gray-600/50 shadow-xl shadow-gray-200/30 dark:shadow-gray-900/30'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center space-x-6">
            <div className={`p-3 rounded-2xl transition-all duration-300 ${enhance ? 'bg-gradient-to-r from-orange-400 to-red-500 shadow-lg shadow-orange-300/50' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500 scale-125"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="enhance" className="flex items-center gap-3 font-bold cursor-pointer text-lg">
                <Sparkles className={`h-6 w-6 transition-all duration-300 ${enhance ? 'text-orange-500 animate-pulse' : 'text-gray-400'}`} />
                <span className={enhance ? 'text-orange-700 dark:text-orange-300 font-extrabold' : 'text-foreground font-bold'}>
                  ✨ Enhance for Marks
                </span>
                {enhance && (
                  <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 shadow-lg animate-pulse">
                    🔥 ACTIVE
                  </Badge>
                )}
              </Label>
              <p className={`text-base mt-2 font-medium ${enhance ? 'text-orange-700 dark:text-orange-300' : 'text-muted-foreground'}`}>
                {enhance 
                  ? "✨ Flashcards will use premium exam-board specific language and mark scheme terminology"
                  : "Generate standard flashcards from your notes"
                }
              </p>
            </div>
          </div>
          
          {enhance && subject && examBoard && (
            <div className="mt-6 p-5 bg-gradient-to-br from-orange-100 via-red-100 to-pink-100 dark:from-orange-900/40 dark:via-red-900/40 dark:to-pink-900/40 backdrop-blur-sm rounded-2xl border-2 border-orange-200/70 dark:border-orange-700/50 shadow-xl">
              <h4 className="text-base font-bold text-orange-700 dark:text-orange-300 mb-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
              </h4>
              <div className="space-y-3">
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="font-bold text-gray-600 dark:text-gray-400">📝 Normal:</span> 
                  <span className="ml-3 font-medium">"What is photosynthesis?"</span>
                </div>
                <div className="p-4 bg-gradient-to-r from-orange-200 via-red-200 to-pink-200 dark:from-orange-800/50 dark:via-red-800/50 dark:to-pink-800/50 rounded-xl border-2 border-orange-300/70 dark:border-orange-600/70 shadow-lg">
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
          className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 rounded-xl"
          size="lg"
        >
          {isGenerating ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent" />
              <span className="text-lg">Generating Premium Flashcards...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5" />
              <span className="text-lg">Generate Premium Flashcards</span>
              <Brain className="h-5 w-5" />
            </div>
          )}
        </Button>
        </div>
      </div>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 border-2 border-emerald-300 dark:border-emerald-600/50 shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.01] rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 via-teal-200/20 to-cyan-200/20 dark:from-emerald-800/10 dark:via-teal-800/10 dark:to-cyan-800/10 animate-pulse" />
          
          <CardHeader className="relative bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-800/40 dark:via-teal-800/40 dark:to-cyan-800/40 backdrop-blur-sm border-b-2 border-emerald-300 dark:border-emerald-600/50 p-8">
            <CardTitle className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl shadow-2xl">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">✨ Generated Flashcards ({generatedFlashcards.length})</span>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white text-sm font-bold px-4 py-2 shadow-lg">
                    🎯 Smart Generated
                  </Badge>
                  {enhance && (
                    <Badge className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 shadow-lg animate-pulse">
                      🚀 Enhanced for Marks
                    </Badge>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300 font-bold text-lg mt-3">
              {enhance 
                ? `🎓 These premium flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "📚 Review your smart flashcards before saving them to your library"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-8 p-8">
            {/* Set Title Input */}
            <div className="space-y-3">
              <Label htmlFor="setTitle" className="text-base font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated premium title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 border-2 border-emerald-300 dark:border-emerald-600/50 hover:border-emerald-400 dark:hover:border-emerald-500 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/50 rounded-xl font-medium py-3"
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