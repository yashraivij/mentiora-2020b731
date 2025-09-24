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
      <Card className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 border-2 border-purple-200 dark:border-purple-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100 dark:from-purple-800/30 dark:via-blue-800/30 dark:to-cyan-800/30 rounded-t-lg border-b-2 border-purple-200 dark:border-purple-700/50">
          <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg shadow-md">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-bold">
              Create Flashcards from Notes
            </span>
          </CardTitle>
          <CardDescription className="text-purple-600 dark:text-purple-400 font-medium">
            Paste your study notes and we'll automatically generate flashcards for effective revision
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Subject and Exam Board Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-purple-700 dark:text-purple-300 font-semibold">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="border-2 border-purple-200 dark:border-purple-700 bg-white/80 dark:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-colors">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-purple-900/95 backdrop-blur-sm border-purple-200 dark:border-purple-700">
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id} className="hover:bg-purple-50 dark:hover:bg-purple-800/30">
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examBoard" className="text-blue-700 dark:text-blue-300 font-semibold">Exam Board *</Label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger className="border-2 border-blue-200 dark:border-blue-700 bg-white/80 dark:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <SelectValue placeholder="Select exam board" />
                </SelectTrigger>
                <SelectContent className="bg-white/95 dark:bg-blue-900/95 backdrop-blur-sm border-blue-200 dark:border-blue-700">
                  {examBoards.map((board) => (
                    <SelectItem key={board.id} value={board.id} className="hover:bg-blue-50 dark:hover:bg-blue-800/30">
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhance Toggle */}
          <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
            enhance 
              ? 'bg-gradient-to-r from-purple-100 via-pink-50 to-orange-50 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-orange-900/20 border-purple-300 dark:border-purple-600 shadow-lg' 
              : 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800/30 dark:to-slate-800/30 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex items-center space-x-4">
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
              />
              <div className="flex-1">
                <Label htmlFor="enhance" className="flex items-center gap-2 font-bold text-lg">
                  <Sparkles className={`h-5 w-5 ${enhance ? 'text-purple-600 dark:text-purple-400 animate-pulse' : 'text-gray-400'}`} />
                  <span className={enhance ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : ''}>
                    Enhance for Marks
                  </span>
                  {enhance && (
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-md animate-bounce">
                      ✨ ACTIVE
                    </span>
                  )}
                </Label>
                <p className={`text-sm mt-2 ${enhance ? 'text-purple-700 dark:text-purple-300 font-medium' : 'text-muted-foreground'}`}>
                  {enhance 
                    ? "🎯 Flashcards will use exam-board specific language, command words, and mark scheme terminology"
                    : "Generate standard flashcards from your notes"
                  }
                </p>
              </div>
            </div>
            
            {enhance && subject && examBoard && (
              <div className="mt-6 p-4 bg-gradient-to-r from-white/80 to-purple-50/80 dark:from-gray-800/50 dark:to-purple-900/30 rounded-lg border-2 border-purple-200 dark:border-purple-700 shadow-inner">
                <h4 className="text-sm font-bold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="grid gap-3 text-sm">
                  <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Normal:</span> 
                    <span className="ml-2">"What is photosynthesis?"</span>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30 rounded-lg border border-purple-200 dark:border-purple-600">
                    <span className="font-bold text-purple-600 dark:text-purple-400">Enhanced:</span> 
                    <span className="ml-2 font-medium">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-cyan-700 dark:text-cyan-300 font-semibold text-lg">Your Study Notes *</Label>
            <div className="relative">
              <Textarea
                id="notes"
                placeholder="Paste your study notes here... (minimum 50 characters)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 resize-none border-2 border-cyan-200 dark:border-cyan-700 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 dark:from-cyan-900/20 dark:to-blue-900/20 focus:border-cyan-400 dark:focus:border-cyan-500 transition-all duration-300"
                maxLength={5000}
              />
              <div className="absolute top-2 right-2">
                <div className={`w-3 h-3 rounded-full ${notes.length >= 50 ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
              </div>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className={`${notes.length < 50 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                {notes.length < 50 ? `🔥 Need ${50 - notes.length} more characters` : "✅ Looks perfect!"}
              </span>
              <span className="text-cyan-600 dark:text-cyan-400">{notes.length}/5000</span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
            className="w-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 hover:from-purple-600 hover:via-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-purple-300 dark:border-purple-600 font-bold text-lg py-6"
            size="lg"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                <span className="animate-pulse">🎯 Generating Amazing Flashcards...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2 text-yellow-300" />
                <span>✨ Generate Flashcards</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-blue-900/20 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-100 via-teal-100 to-blue-100 dark:from-emerald-800/30 dark:via-teal-800/30 dark:to-blue-800/30 rounded-t-lg border-b-2 border-emerald-200 dark:border-emerald-700/50">
            <CardTitle className="flex items-center gap-3 text-emerald-700 dark:text-emerald-300">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-md animate-pulse">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">
                🎉 Generated Flashcards ({generatedFlashcards.length})
              </span>
              {enhance && (
                <span className="px-3 py-1 text-xs bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full flex items-center gap-1 shadow-md animate-bounce">
                  <Sparkles className="h-3 w-3" />
                  ✨ Enhanced for Marks
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-emerald-600 dark:text-emerald-400 font-medium">
              {enhance 
                ? `🎯 These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words`
                : "🎊 Review your amazing flashcards before saving them to your library"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            {/* Set Title Input */}
            <div className="space-y-3">
              <Label htmlFor="setTitle" className="text-teal-700 dark:text-teal-300 font-semibold">Set Title (Optional)</Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="border-2 border-teal-200 dark:border-teal-700 bg-gradient-to-r from-teal-50/50 to-blue-50/50 dark:from-teal-900/20 dark:to-blue-900/20 focus:border-teal-400 dark:focus:border-teal-500 transition-all duration-300"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {generatedFlashcards.map((flashcard, index) => (
                <div key={index} className={`border-2 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  enhance 
                    ? 'border-purple-200 dark:border-purple-700 bg-gradient-to-r from-purple-50/80 via-pink-50/50 to-orange-50/80 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-orange-900/20 shadow-md' 
                    : 'border-emerald-200 dark:border-emerald-700 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20'
                }`}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">Q</span>
                        </div>
                        Question
                        {enhance && <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
                      </h4>
                      <div className="p-3 bg-white/70 dark:bg-gray-800/30 rounded-lg border border-emerald-200 dark:border-emerald-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{flashcard.front}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm text-teal-700 dark:text-teal-300 mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">A</span>
                        </div>
                        Answer
                        {enhance && <Sparkles className="h-4 w-4 text-purple-500 animate-pulse" />}
                      </h4>
                      <div className="p-3 bg-white/70 dark:bg-gray-800/30 rounded-lg border border-teal-200 dark:border-teal-700">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t-2 border-emerald-200 dark:border-emerald-700/50">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-2 border-emerald-300 dark:border-emerald-600 font-bold text-lg py-6"
                size="lg"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    <span className="animate-pulse">💾 Saving Amazing Flashcards...</span>
                  </>
                ) : (
                  <>
                    <BookOpen className="h-5 w-5 mr-2 text-yellow-300" />
                    <span>🎊 Save to Library</span>
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