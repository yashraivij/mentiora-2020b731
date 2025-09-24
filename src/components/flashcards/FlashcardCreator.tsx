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
          <div className="w-12 h-12 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Smart Flashcards
            </h1>
            <p className="text-violet-600 dark:text-violet-400 font-medium">AI-Powered Study Tool</p>
          </div>
        </div>
        <div className="flex items-center justify-center space-x-3 mb-6">
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-lg">
            Exam-Board Specific
          </Badge>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
            AI Generated
          </Badge>
        </div>
      </div>

      {/* Generation Form */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-700 dark:to-purple-700 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/30 via-blue-100/20 to-purple-100/30 dark:from-violet-900/10 dark:via-blue-900/10 dark:to-purple-900/10" />
        
        <CardHeader className="relative bg-gradient-to-r from-violet-200/60 via-blue-200/50 to-purple-200/60 dark:from-violet-800/40 dark:via-blue-800/30 dark:to-purple-800/40 backdrop-blur-sm border-b-2 border-gradient-to-r from-violet-300 to-purple-300 dark:from-violet-600 dark:to-purple-600">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-xl shadow-xl">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Create Smart Flashcards</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold">
                  AI-Powered
                </Badge>
                <Badge className="bg-gradient-to-r from-emerald-400 to-teal-400 text-white text-xs font-bold">
                  Exam-Board Specific
                </Badge>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-violet-700 dark:text-violet-300 font-medium">
            Transform your study notes into powerful flashcards with AI analysis and exam-board optimization
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6 p-6">
          {/* Subject and Exam Board Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Subject *
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-2 border-blue-200 dark:border-blue-700 hover:border-blue-300 dark:hover:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 transition-colors shadow-lg">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/90 dark:to-indigo-900/90 backdrop-blur-xl border-2 border-blue-200 dark:border-blue-700">
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id} className="hover:bg-gradient-to-r hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/50 dark:hover:to-indigo-800/50">
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="examBoard" className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Exam Board *
              </Label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 focus:border-purple-400 dark:focus:border-purple-500 transition-colors shadow-lg">
                  <SelectValue placeholder="Select exam board" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/90 dark:to-pink-900/90 backdrop-blur-xl border-2 border-purple-200 dark:border-purple-700">
                  {examBoards.map((board) => (
                    <SelectItem key={board.id} value={board.id} className="hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-800/50 dark:hover:to-pink-800/50">
                      {board.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Enhance Toggle */}
          <div className={`relative overflow-hidden p-4 rounded-xl border-2 transition-all duration-300 ${
            enhance 
              ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 border-yellow-300 dark:border-yellow-600 shadow-xl' 
              : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-800/50 dark:to-slate-800/50 border-gray-200 dark:border-gray-600 shadow-md'
          }`}>
            <div className="flex items-center space-x-4">
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-400 data-[state=checked]:to-orange-400"
              />
              <div className="flex-1">
                <Label htmlFor="enhance" className="flex items-center gap-2 font-semibold cursor-pointer">
                  <Sparkles className={`h-4 w-4 ${enhance ? 'text-yellow-500 animate-pulse' : 'text-gray-400'}`} />
                  <span className={enhance ? 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent font-bold' : 'text-foreground'}>
                    Enhance for Marks
                  </span>
                  {enhance && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold animate-pulse">
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
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100/80 to-orange-100/80 dark:from-yellow-900/40 dark:to-orange-900/40 backdrop-blur-sm rounded-lg border-2 border-yellow-300/50 dark:border-yellow-600/50 shadow-lg">
                <h4 className="text-sm font-semibold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
                  Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Normal:</span> 
                    <span className="ml-2">"What is photosynthesis?"</span>
                  </div>
                  <div className="p-2 bg-gradient-to-r from-yellow-200/60 to-orange-200/60 dark:from-yellow-800/40 dark:to-orange-800/40 rounded border-2 border-yellow-300/70 dark:border-yellow-600/70 shadow-md">
                    <span className="font-medium bg-gradient-to-r from-yellow-700 to-orange-700 bg-clip-text text-transparent">Enhanced:</span> 
                    <span className="ml-2 font-medium">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology)"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-3">
            <Label htmlFor="notes" className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your Study Notes *
            </Label>
            <div className="relative">
              <Textarea
                id="notes"
                placeholder="Paste your study notes here... (minimum 50 characters)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors shadow-lg"
                maxLength={5000}
              />
              {notes.length >= 50 && (
                <div className="absolute top-2 right-2 text-emerald-500">
                  <Sparkles className="h-4 w-4 animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className={`px-3 py-1 rounded-full font-medium ${
                notes.length < 50 
                  ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200' 
                  : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200'
              }`}>
                {notes.length < 50 ? `Need ${50 - notes.length} more characters` : "Ready to generate!"}
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                {notes.length}/5000
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
            className="w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:via-purple-400 hover:to-indigo-400 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
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
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-700 dark:to-teal-700 shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/30 via-cyan-100/20 to-emerald-100/30 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-emerald-900/10" />
          
          <CardHeader className="relative bg-gradient-to-r from-emerald-200/60 via-teal-200/50 to-cyan-200/60 dark:from-emerald-800/40 dark:via-teal-800/30 dark:to-cyan-800/40 backdrop-blur-sm border-b-2 border-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600">
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-xl">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Generated Flashcards ({generatedFlashcards.length})</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-gradient-to-r from-green-400 to-teal-400 text-white text-xs font-bold">
                    Smart Generated
                  </Badge>
                  {enhance && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold animate-pulse">
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
              <Label htmlFor="setTitle" className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-400 dark:focus:border-emerald-500 transition-colors shadow-lg"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Preview Your Smart Flashcards
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto rounded-lg border-2 border-emerald-200 dark:border-emerald-700 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 backdrop-blur-sm">
                {generatedFlashcards.map((flashcard, index) => (
                  <div key={index} className={`border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                    enhance 
                      ? 'bg-gradient-to-br from-yellow-100/70 via-orange-100/60 to-red-100/70 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-red-900/30 border-yellow-300 dark:border-yellow-600 shadow-lg' 
                      : 'bg-gradient-to-br from-emerald-100/70 to-teal-100/70 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-200 dark:border-emerald-700 shadow-md'
                  }`}>
                    {enhance && (
                      <div className="flex justify-end mb-2">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Enhanced
                        </Badge>
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Question
                        </h4>
                        <p className="text-sm bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 p-3 rounded border-2 border-blue-200 dark:border-blue-700 font-medium">{flashcard.front}</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          <Brain className="h-4 w-4 text-green-500" />
                          Answer
                        </h4>
                        <p className="text-sm bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 p-3 rounded border-2 border-green-200 dark:border-green-700 font-medium">{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t-2 border-emerald-200 dark:border-emerald-700">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100"
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