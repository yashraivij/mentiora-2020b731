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
    <div className="relative space-y-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 animate-bounce delay-300">
          <Sparkles className="h-6 w-6 text-yellow-400/40" />
        </div>
        <div className="absolute top-32 left-20 animate-pulse delay-700">
          <Brain className="h-8 w-8 text-purple-400/30" />
        </div>
        <div className="absolute bottom-20 right-32 animate-bounce delay-1000">
          <Zap className="h-5 w-5 text-orange-400/40" />
        </div>
        <div className="absolute top-64 right-16 animate-pulse delay-500">
          <BookOpen className="h-7 w-7 text-blue-400/30" />
        </div>
      </div>

      {/* Generation Form */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-gradient-to-r border-indigo-200 dark:border-indigo-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
        {/* Card Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-100/40 via-fuchsia-100/30 to-cyan-100/40 dark:from-violet-900/10 dark:via-fuchsia-900/10 dark:to-cyan-900/10"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-300/20 to-transparent rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-green-300/20 to-transparent rounded-full"></div>
        
        <CardHeader className="relative bg-gradient-to-r from-indigo-200/80 via-purple-200/70 to-pink-200/60 dark:from-indigo-800/40 dark:via-purple-800/30 dark:to-pink-800/20 rounded-t-lg border-b-2 border-gradient-to-r border-indigo-300 dark:border-indigo-600/50 backdrop-blur-sm">
          <CardTitle className="flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-300 dark:via-purple-300 dark:to-pink-300">
            <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-xl border border-white/20 backdrop-blur-sm animate-pulse">
              <Brain className="h-6 w-6 text-white drop-shadow-sm" />
            </div>
            <div>
              <span className="text-xl font-bold">
                🧠 Create Smart Flashcards from Notes ✨
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs rounded-full font-bold shadow-sm">
                  🚀 AI-Powered
                </div>
                <div className="px-2 py-1 bg-gradient-to-r from-green-400 to-blue-400 text-white text-xs rounded-full font-bold shadow-sm">
                  🎯 Exam-Board Specific
                </div>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-indigo-700 dark:text-indigo-300 text-base font-medium mt-2">
            🪄 Paste your study notes and we'll automatically generate premium flashcards for effective revision
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-8 p-8">
          {/* Subject and Exam Board Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="subject" className="text-base font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                📚 Subject *
              </Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-200 dark:border-indigo-700 hover:border-indigo-300 dark:hover:border-indigo-600 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="🎓 Select subject" />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/90 dark:to-purple-900/90 backdrop-blur-xl border-2 border-indigo-200 dark:border-indigo-700">
                  {subjects.map((subj) => (
                    <SelectItem key={subj.id} value={subj.id} className="hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800/50 dark:hover:to-purple-800/50">
                      {subj.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="examBoard" className="text-base font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                🏆 Exam Board *
              </Label>
              <Select value={examBoard} onValueChange={setExamBoard}>
                <SelectTrigger className="h-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 focus:border-purple-400 dark:focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md">
                  <SelectValue placeholder="📋 Select exam board" />
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
          <div className={`relative overflow-hidden p-6 rounded-2xl border-3 transition-all duration-500 transform hover:scale-[1.02] ${
            enhance 
              ? 'bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-yellow-300 dark:border-yellow-600 shadow-2xl' 
              : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30 border-gray-200 dark:border-gray-700 shadow-lg'
          }`}>
            {enhance && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-orange-400/10 to-red-400/10 animate-pulse"></div>
            )}
            <div className="relative flex items-center space-x-4">
              <Switch
                id="enhance"
                checked={enhance}
                onCheckedChange={setEnhance}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-400 data-[state=checked]:to-orange-400"
              />
              <div className="flex-1">
                <Label htmlFor="enhance" className="flex items-center gap-3 font-bold text-lg cursor-pointer">
                  <Sparkles className={`h-6 w-6 ${enhance ? 'text-yellow-500 animate-spin' : 'text-gray-400'}`} />
                  <span className={enhance ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600' : 'text-gray-700 dark:text-gray-300'}>
                    ⚡ Enhance for Marks
                  </span>
                  {enhance && (
                    <span className="px-3 py-1 text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-black rounded-full font-bold shadow-lg animate-bounce">
                      🔥 ACTIVE
                    </span>
                  )}
                </Label>
                <p className={`text-base mt-2 font-medium ${enhance ? 'text-orange-700 dark:text-orange-300' : 'text-gray-600 dark:text-gray-400'}`}>
                  {enhance 
                    ? "✨ Flashcards will use exam-board specific language, command words, and mark scheme terminology 🎯"
                    : "Generate standard flashcards from your notes 📝"
                  }
                </p>
              </div>
            </div>
            
            {enhance && subject && examBoard && (
              <div className="mt-6 p-5 bg-gradient-to-r from-white/80 to-yellow-50/80 dark:from-gray-800/80 dark:to-yellow-900/80 rounded-xl border-2 border-yellow-300 dark:border-yellow-600 backdrop-blur-sm shadow-xl">
                <h4 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mb-3 flex items-center gap-2">
                  🎯 Enhanced Mode Preview ({subjects.find(s => s.id === subject)?.name} - {examBoard})
                </h4>
                <div className="grid gap-3 text-sm">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-gray-600 dark:text-gray-400">📝 Normal:</span> 
                    <span className="ml-2">"What is photosynthesis?"</span>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-lg border-2 border-yellow-300 dark:border-yellow-600 shadow-md">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">🚀 Enhanced:</span> 
                    <span className="ml-2 font-medium">"Explain the process of photosynthesis. (4 marks, {examBoard} Biology) 🎯"</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-4">
            <Label htmlFor="notes" className="text-base font-semibold text-green-700 dark:text-green-300 flex items-center gap-2">
              📝 Your Study Notes *
            </Label>
            <div className="relative">
              <Textarea
                id="notes"
                placeholder="✨ Paste your study notes here... (minimum 50 characters) 🚀"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-40 resize-none text-base bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-700 hover:border-green-300 dark:hover:border-green-600 focus:border-green-400 dark:focus:border-green-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
                maxLength={5000}
              />
              {notes.length >= 50 && (
                <div className="absolute top-3 right-3 text-green-500">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-base font-medium">
              <span className={`px-3 py-1 rounded-full ${
                notes.length < 50 
                  ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border border-red-200' 
                  : 'bg-gradient-to-r from-green-100 to-teal-100 text-green-700 border border-green-200'
              }`}>
                {notes.length < 50 ? `⚠️ Need ${50 - notes.length} more characters` : "✅ Looks perfect!"}
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {notes.length}/5000 📊
              </span>
            </div>
          </div>

          {/* Generate Button */}
          <div className="pt-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !notes.trim() || !subject || !examBoard || notes.length < 50}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-400 hover:via-purple-400 hover:to-indigo-400 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 rounded-xl border-2 border-white/20 backdrop-blur-sm"
              size="lg"
            >
              {isGenerating ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                  <span className="animate-pulse">🧠 Generating Smart Flashcards... ✨</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  <span>🚀 Generate Smart Flashcards 🎯</span>
                  <Brain className="h-6 w-6" />
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Flashcards Preview */}
      {generatedFlashcards.length > 0 && (
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border-2 border-emerald-200 dark:border-emerald-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]">
          {/* Card Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-100/40 via-cyan-100/30 to-emerald-100/40 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-emerald-900/10"></div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-green-300/20 to-transparent rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-teal-300/20 to-transparent rounded-full"></div>
          
          <CardHeader className="relative bg-gradient-to-r from-emerald-200/80 via-teal-200/70 to-cyan-200/60 dark:from-emerald-800/40 dark:via-teal-800/30 dark:to-cyan-800/20 rounded-t-lg border-b-2 border-emerald-300 dark:border-emerald-600/50 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300">
              <div className="p-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-xl border border-white/20 backdrop-blur-sm animate-pulse">
                <BookOpen className="h-6 w-6 text-white drop-shadow-sm" />
              </div>
              <div>
                <span className="text-xl font-bold">
                  🎉 Generated Flashcards ({generatedFlashcards.length}) ✨
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="px-2 py-1 bg-gradient-to-r from-green-400 to-teal-400 text-white text-xs rounded-full font-bold shadow-sm">
                    🧠 Smart Generated
                  </div>
                  {enhance && (
                    <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs rounded-full font-bold shadow-sm animate-bounce">
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      🔥 Enhanced for Marks
                    </div>
                  )}
                </div>
              </div>
            </CardTitle>
            <CardDescription className="text-emerald-700 dark:text-emerald-300 text-base font-medium mt-2">
              {enhance 
                ? `✨ These flashcards have been enhanced with ${examBoard} ${subjects.find(s => s.id === subject)?.name} mark scheme language and command words 🎯`
                : "📚 Review your smart flashcards before saving them to your library 🚀"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="relative space-y-6 p-8">
            {/* Set Title Input */}
            <div className="space-y-3">
              <Label htmlFor="setTitle" className="text-base font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                🏷️ Set Title (Optional)
              </Label>
              <Input
                id="setTitle"
                placeholder="✨ Auto-generated title will be used if empty"
                value={setTitle}
                onChange={(e) => setSetTitle(e.target.value)}
                className="h-12 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-2 border-emerald-200 dark:border-emerald-700 hover:border-emerald-300 dark:hover:border-emerald-600 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-md text-base"
              />
            </div>

            {/* Flashcard Preview Grid */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center gap-2">
                🎴 Preview Your Smart Flashcards
              </h3>
              <div className="grid gap-4 max-h-96 overflow-y-auto rounded-xl border-2 border-emerald-200 dark:border-emerald-700 p-4 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm">
                {generatedFlashcards.map((flashcard, index) => (
                  <div key={index} className={`relative overflow-hidden border-2 rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    enhance 
                      ? 'border-gradient-to-r border-yellow-300 dark:border-yellow-600 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20' 
                      : 'border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
                  }`}>
                    {enhance && (
                      <div className="absolute top-2 right-2">
                        <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          <div className="p-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg">
                            <BookOpen className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-blue-700 dark:text-blue-300">❓ Question</span>
                          {enhance && <Sparkles className="h-4 w-4 text-yellow-500" />}
                        </h4>
                        <p className="text-sm font-medium bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg border border-blue-200 dark:border-blue-700">{flashcard.front}</p>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-base flex items-center gap-2">
                          <div className="p-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-lg">
                            <Brain className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-green-700 dark:text-green-300">✅ Answer</span>
                          {enhance && <Sparkles className="h-4 w-4 text-yellow-500" />}
                        </h4>
                        <p className="text-sm font-medium bg-green-50 dark:bg-green-900/30 p-3 rounded-lg border border-green-200 dark:border-green-700">{flashcard.back}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t-2 border-emerald-200 dark:border-emerald-700/50">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-400 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] disabled:hover:scale-100 transition-all duration-300 rounded-xl border-2 border-white/20 backdrop-blur-sm"
                size="lg"
              >
                {isSaving ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent" />
                    <span className="animate-pulse">💾 Saving to Library... ✨</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6" />
                    <span>💾 Save to Smart Library 📚</span>
                    <Sparkles className="h-6 w-6" />
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