import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { readingWritingQuestions, mathQuestions, DiagnosticQuestion } from "@/data/diagnosticQuestions";
import { Button } from "@/components/ui/button";
import { Clock, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DiagnosticTest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const testType = searchParams.get("type") || "reading"; // "reading" or "math"
  
  const questions = testType === "reading" ? readingWritingQuestions : mathQuestions;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (letter: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: letter,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Last question
      setShowSubmitDialog(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / totalQuestions) * 800);
    
    // Navigate to results (you can create a results page later)
    navigate(`/diagnostic-results?type=${testType}&score=${score}&correct=${correctCount}&total=${totalQuestions}`);
  };

  const getQuestionState = (index: number) => {
    const q = questions[index];
    if (index === currentQuestionIndex) return "current";
    if (answers[q.id]) return "answered";
    return "unanswered";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Progress Bar */}
      <div className="h-[60px] bg-card border-b flex items-center justify-between px-8">
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <div className="w-[300px] h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B35] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold">
            {testType === "reading" ? "Reading & Writing Section" : "Math Section"}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => setShowExitDialog(true)}
            className="text-[#FF6B35] hover:text-[#FF5722]"
          >
            Save & Exit
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[240px] bg-[#1E3A8A] p-6 min-h-[calc(100vh-60px)]">
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                {testType === "reading" ? "📖 Reading & Writing" : "🔢 Math"}
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {questions.map((q, index) => {
                  const state = getQuestionState(index);
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                        state === "current"
                          ? "bg-[#FF6B35] text-white"
                          : state === "answered"
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-white hover:bg-white/15"
                      }`}
                    >
                      {state === "answered" ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-background">
          <div className="max-w-[900px] mx-auto p-12">
            {/* Question Number */}
            <div className="uppercase text-xs text-muted-foreground tracking-widest mb-4">
              Question {currentQuestion.questionNumber}
            </div>

            {/* Passage (if applicable) */}
            {currentQuestion.passage && (
              <div className="bg-muted/50 border-l-4 border-[#FF6B35] p-6 rounded-lg mb-8 max-w-[700px]">
                <p className="text-base leading-relaxed text-foreground">
                  {currentQuestion.passage}
                </p>
              </div>
            )}

            {/* Question Text */}
            <h2 className="text-2xl font-semibold text-foreground mb-8 leading-snug">
              {currentQuestion.question}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 max-w-[700px] mb-12">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.letter;
                return (
                  <button
                    key={option.letter}
                    onClick={() => handleAnswerSelect(option.letter)}
                    className={`w-full min-h-[64px] p-5 rounded-xl flex items-center gap-4 transition-all border-2 ${
                      isSelected
                        ? "border-[#FF6B35] bg-[#FFF7F5]"
                        : "border-border bg-card hover:border-[#FF6B35] hover:bg-[#FFF7F5]"
                    }`}
                  >
                    {/* Letter Badge */}
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${
                        isSelected
                          ? "bg-[#FF6B35] text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {option.letter}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 text-left text-base text-foreground leading-relaxed">
                      {option.text}
                    </div>

                    {/* Radio Circle */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        isSelected ? "border-[#FF6B35]" : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-3 h-3 rounded-full bg-[#FF6B35]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between max-w-[700px]">
              <div className="flex items-center gap-4">
                {currentQuestionIndex > 0 && (
                  <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="px-7 h-12"
                  >
                    ← Previous
                  </Button>
                )}
                <button
                  onClick={handleSkip}
                  className="text-muted-foreground text-sm hover:text-foreground underline"
                >
                  Skip
                </button>
              </div>

              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="px-8 h-12 bg-[#FF6B35] hover:bg-[#FF5722] text-white disabled:bg-muted"
              >
                {currentQuestionIndex === totalQuestions - 1 ? "Submit Test" : "Continue"} →
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Exit Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your Progress?</DialogTitle>
            <DialogDescription>
              Your progress will be saved. You can continue this test later from where you left off.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => navigate("/dashboard")}>
              Save & Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ready to Submit?</DialogTitle>
            <DialogDescription>
              You've answered {answeredCount} out of {totalQuestions} questions.
              You won't be able to change your answers after submitting.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowSubmitDialog(false)}
            >
              Review Answers
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#FF6B35] hover:bg-[#FF5722]"
            >
              Submit Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
