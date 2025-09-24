import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff,
  Play,
  Pause,
  SkipForward,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

interface FlashcardSet {
  id: string;
  title: string;
  subject_id: string;
  exam_board: string;
  flashcards: Flashcard[];
  created_at: string;
  card_count: number;
}

interface FlashcardViewerProps {
  flashcardSet: FlashcardSet;
  mode: "flashcards" | "learn";
  onBack: () => void;
}

export const FlashcardViewer = ({ flashcardSet, mode, onBack }: FlashcardViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize with original order
    setShuffledCards([...flashcardSet.flashcards]);
  }, [flashcardSet]);

  const currentCard = shuffledCards[currentIndex];
  const progress = ((currentIndex + 1) / shuffledCards.length) * 100;
  const learnProgress = (completedCards.size / shuffledCards.length) * 100;

  const handleNext = () => {
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setUserAnswer("");
      setShowAnswer(false);
    } else if (mode === "learn" && !isSessionComplete) {
      // Complete the session
      setIsSessionComplete(true);
      toast({
        title: "Session Complete!",
        description: `You got ${correctAnswers} out of ${shuffledCards.length} correct (${Math.round((correctAnswers / shuffledCards.length) * 100)}%)`,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setUserAnswer("");
      setShowAnswer(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setUserAnswer("");
    setShowAnswer(false);
    toast({
      title: "Cards Shuffled",
      description: "Flashcards have been randomly shuffled",
    });
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setUserAnswer("");
    setShowAnswer(false);
    setCorrectAnswers(0);
    setCompletedCards(new Set());
    setSessionStarted(false);
    setIsSessionComplete(false);
    setShuffledCards([...flashcardSet.flashcards]);
    toast({
      title: "Session Reset",
      description: "Starting fresh with all cards",
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return;
    
    setShowAnswer(true);
    if (!sessionStarted) {
      setSessionStarted(true);
    }
  };

  const handleAnswerFeedback = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers(correctAnswers + 1);
    }
    
    const newCompleted = new Set(completedCards);
    newCompleted.add(currentIndex);
    setCompletedCards(newCompleted);
    
    // Auto-advance after a short delay
    setTimeout(() => {
      handleNext();
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (mode === "flashcards") {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFlip();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    } else if (mode === "learn" && e.key === "Enter" && userAnswer.trim() && !showAnswer) {
      handleAnswerSubmit();
    }
  };

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No flashcards available</p>
          <Button onClick={onBack} className="mt-4">Go Back</Button>
        </Card>
      </div>
    );
  }

  if (isSessionComplete) {
    const percentage = Math.round((correctAnswers / shuffledCards.length) * 100);
    const grade = percentage >= 90 ? "Excellent!" : percentage >= 70 ? "Good!" : percentage >= 50 ? "Fair" : "Keep practicing!";
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Session Complete!</h2>
            <p className="text-muted-foreground mb-6">Great job studying {flashcardSet.title}</p>
            
            <div className="space-y-4 mb-6">
              <div className="text-3xl font-bold text-primary">{percentage}%</div>
              <p className="text-lg font-medium">{grade}</p>
              <p className="text-sm text-muted-foreground">
                {correctAnswers} out of {shuffledCards.length} correct
              </p>
            </div>
            
            <div className="space-y-3">
              <Button onClick={handleReset} className="w-full">
                <RotateCcw className="h-4 w-4 mr-2" />
                Study Again
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" onKeyDown={handleKeyPress} tabIndex={0}>
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">{flashcardSet.title}</h1>
              <p className="text-sm text-muted-foreground">
                {mode === "flashcards" ? "Flashcard Review" : "Learn Mode"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={mode === "learn" ? "default" : "secondary"}>
              {currentIndex + 1} / {shuffledCards.length}
            </Badge>
            {mode === "learn" && (
              <Badge variant="outline">
                {correctAnswers} correct
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <Progress 
            value={mode === "learn" ? learnProgress : progress} 
            className="w-full h-2" 
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {mode === "learn" ? 
              `${completedCards.size} of ${shuffledCards.length} cards completed` :
              `Card ${currentIndex + 1} of ${shuffledCards.length}`
            }
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 max-w-4xl mx-auto">
        <div className="min-h-96 flex items-center justify-center">
          {mode === "flashcards" ? (
            // Flashcard Mode - Flip Card
            <div className="w-full max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentIndex}-${isFlipped}`}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer"
                  onClick={handleFlip}
                >
                  <Card className="min-h-64 flex items-center justify-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 text-center">
                      <div className="mb-4">
                        <Badge variant="outline" className="mb-4">
                          {isFlipped ? "Answer" : "Question"}
                        </Badge>
                      </div>
                      <p className="text-lg leading-relaxed">
                        {isFlipped ? currentCard.back : currentCard.front}
                      </p>
                      {!isFlipped && (
                        <p className="text-xs text-muted-foreground mt-6">
                          Click to reveal answer • Space bar to flip
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            // Learn Mode - Type Answer
            <div className="w-full max-w-2xl space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4">
                    <Badge variant="outline" className="mb-4">Question</Badge>
                  </div>
                  <p className="text-lg mb-6">{currentCard.front}</p>
                  
                  {!showAnswer ? (
                    <div className="space-y-4">
                      <Input
                        placeholder="Type your answer here..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAnswerSubmit()}
                        className="text-center"
                        autoFocus
                      />
                      <Button 
                        onClick={handleAnswerSubmit}
                        disabled={!userAnswer.trim()}
                        className="w-full"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Check Answer
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Your answer:</p>
                        <p className="font-medium">{userAnswer}</p>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-2">Correct answer:</p>
                        <p className="font-medium text-green-800 dark:text-green-200">{currentCard.back}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleAnswerFeedback(true)}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          I got it right
                        </Button>
                        <Button 
                          onClick={() => handleAnswerFeedback(false)}
                          variant="destructive"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-2" />
                          I got it wrong
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            {!isMobile && "Previous"}
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleShuffle}>
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={handleNext}
            disabled={mode === "learn" && !completedCards.has(currentIndex) && !showAnswer}
          >
            {!isMobile && "Next"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {mode === "flashcards" && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Use arrow keys to navigate • Space to flip • Mobile: tap to flip
          </p>
        )}
      </div>
    </div>
  );
};